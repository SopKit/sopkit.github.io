/**
 * @file sopkit-backend/src/security/rate-limit.ts
 * @description In-memory and KV-backed token bucket rate limiter for API endpoints.
 */

export interface RateLimitConfig {
  maxRequests: number;
  windowSeconds: number;
}

export class RateLimiter {
  private requests = new Map<string, { count: number; expiresAt: number }>();

  public isAllowed(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const entry = this.requests.get(key);

    if (!entry || entry.expiresAt <= now) {
      this.requests.set(key, {
        count: 1,
        expiresAt: now + config.windowSeconds * 1000,
      });
      return true;
    }

    if (entry.count < config.maxRequests) {
      entry.count += 1;
      return true;
    }

    return false;
  }
}
