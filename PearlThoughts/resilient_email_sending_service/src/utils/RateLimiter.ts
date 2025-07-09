export class RateLimiter {
  private tokens = 5;                // 5 emails / 10 s
  private lastRefill = Date.now();

  async consume() {
    const now = Date.now();
    if (now - this.lastRefill > 10_000) {    // refill every 10 s
      this.tokens = 5;
      this.lastRefill = now;
    }
    if (this.tokens === 0) throw new Error('Rate limit');
    this.tokens--;
  }
}
export class RateLimiterError extends Error {
  constructor() {
    super('Rate limit exceeded');
    this.name = 'RateLimiterError';
  }
}