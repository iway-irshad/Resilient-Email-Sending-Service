import { EmailService } from '../src/services/EmailService';

describe('EmailService', () => {
  it('should enqueue and eventually mark email as sent', async () => {
    const svc = new EmailService();
    const res = await svc.enqueue({
      to: 'test@example.com',
      subject: 'Test Email',
      body: 'This is a test.',
    });

    expect(res.status).toBe('queued');

    // Wait for background worker to process
    await new Promise(resolve => setTimeout(resolve, 2000));

    const status = svc.getStatus(res.id);
    expect(status).toBe('sent');
  });
});
