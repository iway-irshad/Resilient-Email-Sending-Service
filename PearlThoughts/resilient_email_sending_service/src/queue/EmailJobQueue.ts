import { EmailRequest } from '../providers/IEmailProvider';

export type Job = EmailRequest & { retries?: number };

export class EmailJobQueue {
  private q: Job[] = [];

  push(job: Job) {
    this.q.push(job);
  }

  pull(): Job | undefined {
    return this.q.shift();
  }

  size() {
    return this.q.length;
  }
}
export class EmailJobQueueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmailJobQueueError';
  }
}