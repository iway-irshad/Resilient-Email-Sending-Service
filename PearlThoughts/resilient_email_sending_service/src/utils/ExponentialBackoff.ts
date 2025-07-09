export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export async function retry<T>(
  fn: () => Promise<T>,
  attempts = 3
): Promise<T> {
  let error;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      error = err;
      await sleep(2 ** i * 100);           // 100 ms, 200 ms, 400 ms
    }
  }
  throw error;
}
export class ExponentialBackoff {
  private attempts = 0;

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      this.attempts++;
      const delay = 2 ** this.attempts * 100; // 100 ms, 200 ms, 400 ms, etc.
      await sleep(delay);
      return this.execute(fn); // Retry
    }
  }
}