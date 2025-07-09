import { IEmailProvider, EmailRequest } from './IEmailProvider';

export class MockProvider2 implements IEmailProvider {
  name = 'MockProvider1';
  async send(_: EmailRequest) {
    // 60% success, 40% failure
    if (Math.random() < 0.4) throw new Error('Provider1 failed');
  }
}
