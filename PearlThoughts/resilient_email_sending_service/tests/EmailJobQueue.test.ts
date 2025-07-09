import { EmailService } from "../src/services/EmailService";

it('processes queued job and marks as sent', async () => {
  const svc = new EmailService();
  const { id } = await svc.enqueue({
    to: 'test@x.com', subject: 'Hi', body: 'Hello'
  });

  await new Promise(r => setTimeout(r, 2000)); // wait worker cycles
  expect(svc.getStatus(id)).toBe('sent');
});
