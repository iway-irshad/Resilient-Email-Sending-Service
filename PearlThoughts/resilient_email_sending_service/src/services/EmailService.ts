import { EmailRequest, IEmailProvider } from '../providers/IEmailProvider';
import { MockProvider1 } from '../providers/MockProvider1';
import { MockProvider2 } from '../providers/MockProvider2';
import { RateLimiter } from '../utils/RateLimiter';
import { retry } from '../utils/ExponentialBackoff';
import { EmailJobQueue, Job } from '../queue/EmailJobQueue';
import { v4 as uuid } from 'uuid';
import { log } from '../utils/logger';

export type EmailStatus = 'queued' | 'sent' | 'failed' | 'duplicate';

export class EmailService {
  private providers: IEmailProvider[];
  private rateLimiter = new RateLimiter();
  private statusMap = new Map<string, EmailStatus>();
  private circuit = new Map<string, { fails: number; openUntil: number }>();
  private queue = new EmailJobQueue();

  constructor() {
    this.providers = [new MockProvider1(), new MockProvider2()];
    // Start background worker every 500ms
    setInterval(() => this.worker(), 500).unref();
  }

  /** Public enqueue method */
  async enqueue(req: Omit<EmailRequest, 'id'> & { id?: string }) {
    const id = req.id ?? uuid();

    // Idempotency check
    const currentStatus = this.statusMap.get(id);
    if (currentStatus === 'sent') {
      log('info', 'Duplicate email detected', { id });
      return { id, status: 'duplicate' as EmailStatus };
    }

    this.statusMap.set(id, 'queued');
    this.queue.push({ ...req, id, retries: 0 });
    log('info', 'Email enqueued', { id });
    return { id, status: 'queued' as EmailStatus };
  }

  /** Get status by email ID */
  getStatus(id: string) {
    return this.statusMap.get(id);
  }

  /** Internal background worker (drains queue) */
  private async worker() {
    const job = this.queue.pull();
    if (!job) return;

    log('info', 'Processing job', { id: job.id, retries: job.retries });

    try {
      await this.rateLimiter.consume();
      await this.internalSend(job);
      this.statusMap.set(job.id, 'sent');
      log('info', 'Email sent successfully', { id: job.id });
    } catch (err: any) {
      job.retries!++;
      log('warn', 'Send attempt failed', { id: job.id, error: err.message });

      if (job.retries! < 3) {
        this.queue.push(job);
        log('info', 'Re-queued job', { id: job.id, retries: job.retries });
      } else {
        this.statusMap.set(job.id, 'failed');
        log('error', 'Email failed after retries', { id: job.id });
      }
    }
  }

  /** Core logic to send email via available providers */
  private async internalSend(req: EmailRequest) {
    for (const provider of this.providers) {
      if (this.isCircuitOpen(provider.name)) {
        log('warn', 'Provider circuit is open, skipping', { provider: provider.name });
        continue;
      }

      try {
        await retry(() => provider.send(req), 3);
        return;
      } catch (err: any) {
        this.registerFailure(provider.name);
        log('error', 'Provider failed', {
          provider: provider.name,
          error: err.message,
          id: req.id,
        });
      }
    }

    throw new Error('All providers failed');
  }

  /** Circuit breaker check */
  private isCircuitOpen(name: string) {
    const slot = this.circuit.get(name);
    return slot && slot.openUntil > Date.now();
  }

  /** Track failure & open circuit if threshold hit */
  private registerFailure(name: string) {
    const slot = this.circuit.get(name) ?? { fails: 0, openUntil: 0 };
    slot.fails++;

    if (slot.fails >= 3) {
      slot.openUntil = Date.now() + 30_000; // 30 sec break
      slot.fails = 0; // reset count after tripping
      log('warn', 'Circuit opened', { provider: name });
    }

    this.circuit.set(name, slot);
  }
}
export class EmailServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmailServiceError';
  }
}