import { IEmailProvider, EmailRequest } from './IEmailProvider';

export class MockProvider1 implements IEmailProvider {
  name = 'MockProvider1';
  async send(_: EmailRequest) {
    // 70 % success, 30 % failure
    if (Math.random() < 0.3) throw new Error('Provider1 failed');
  }
}
