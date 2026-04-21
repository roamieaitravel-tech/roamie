/**
 * Simple in-memory rate limiter for serverless environments.
 * Note: This state is local to each serverless function instance and will reset on cold starts.
 */

interface RateLimitOptions {
  interval: number; // Time window in milliseconds
  limit: number;    // Maximum number of requests in the window
}

const cache = new Map<string, { count: number; expires: number }>();

export function ratelimit(ip: string, options: RateLimitOptions) {
  const now = Date.now();
  const key = `${ip}`;
  const record = cache.get(key);

  if (!record || now > record.expires) {
    cache.set(key, { count: 1, expires: now + options.interval });
    return { success: true, count: 1, remaining: options.limit - 1 };
  }

  if (record.count >= options.limit) {
    return { success: false, count: record.count, remaining: 0 };
  }

  record.count += 1;
  return { success: true, count: record.count, remaining: options.limit - record.count };
}

// Cleanup interval to prevent memory leaks (runs every hour)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
      if (now > value.expires) {
        cache.delete(key);
      }
    }
  }, 3600000);
}
