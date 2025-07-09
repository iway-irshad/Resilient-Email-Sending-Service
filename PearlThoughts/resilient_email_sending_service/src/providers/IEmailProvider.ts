export interface EmailRequest {
  id: string;               // idempotency key
  to: string;
  subject: string;
  body: string;
}

export interface IEmailProvider {
  name: string;
  send(req: EmailRequest): Promise<void>;
}
export interface EmailStatus {
  id: string;               // idempotency key
  status: 'success' | 'failed';
  error?: string;           // optional error message if failed
}