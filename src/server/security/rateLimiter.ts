/**
 * Lightweight In-Memory Sliding-Window Rate Limiter Middleware
 * Protects expensive AI and web search endpoints from rapid repeated requests & DoS flooding.
 */

import { Request, Response, NextFunction } from 'express';

interface RateLimitBucket {
  count: number;
  resetTime: number;
}

const windowMs = 60 * 1000; // 1 minute sliding window
const maxRequests = 20; // 20 requests per minute per IP/client
const buckets = new Map<string, RateLimitBucket>();

// Periodic cleanup of expired rate limit buckets to avoid memory leaks
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (now > bucket.resetTime) {
      buckets.delete(key);
    }
  }
}, 30 * 1000);
cleanupInterval.unref();

export function searchRateLimiter(req: Request, res: Response, next: NextFunction): void {
  // Use client IP or proxy forwarded IP
  const clientKey =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    'global_client';

  const now = Date.now();
  const bucket = buckets.get(clientKey);

  if (!bucket || now > bucket.resetTime) {
    // New or expired window
    buckets.set(clientKey, {
      count: 1,
      resetTime: now + windowMs,
    });
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
    res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));
    next();
    return;
  }

  bucket.count += 1;
  const remaining = Math.max(0, maxRequests - bucket.count);
  res.setHeader('X-RateLimit-Limit', maxRequests);
  res.setHeader('X-RateLimit-Remaining', remaining);
  res.setHeader('X-RateLimit-Reset', Math.ceil(bucket.resetTime / 1000));

  if (bucket.count > maxRequests) {
    const retryAfterSec = Math.ceil((bucket.resetTime - now) / 1000);
    res.setHeader('Retry-After', retryAfterSec);
    res.status(429).json({
      success: false,
      error: `Too many requests. Please wait ${retryAfterSec} seconds before searching again.`,
      code: 'RATE_LIMITED',
      retryAfterSeconds: retryAfterSec,
    });
    return;
  }

  next();
}

/**
 * Testing helper to reset rate limit buckets
 */
export function resetRateLimitsForTesting(): void {
  buckets.clear();
}
