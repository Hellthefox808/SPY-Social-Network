interface RateLimitRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, RateLimitRecord>();

/**
 * Sliding window rate limiter for API endpoints.
 * @param key Identification key (e.g. IP address or token)
 * @param limit Max allowed requests within window
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit: number = 60,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  const record = memoryStore.get(key) || { timestamps: [] };
  const validTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (validTimestamps.length >= limit) {
    const oldest = validTimestamps[0] || now;
    const resetMs = oldest + windowMs - now;
    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.max(0, resetMs),
    };
  }

  validTimestamps.push(now);
  memoryStore.set(key, { timestamps: validTimestamps });

  // Periodically clean stale records
  if (memoryStore.size > 10000) {
    for (const [k, rec] of memoryStore.entries()) {
      if (rec.timestamps.every((ts) => ts <= windowStart)) {
        memoryStore.delete(k);
      }
    }
  }

  return {
    allowed: true,
    remaining: limit - validTimestamps.length,
    resetMs: windowMs,
  };
}
