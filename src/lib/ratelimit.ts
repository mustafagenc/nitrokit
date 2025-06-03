import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
    }
} catch (error) {
    console.error('❌ Redis connection error:', error);
    redis = null;
}

export const apiRateLimit = redis
    ? new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
          analytics: true,
          prefix: 'api',
      })
    : null;

export const emailResendRateLimit = redis
    ? new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 attempts per hour
          analytics: true,
          prefix: 'email_resend',
      })
    : null;

export const authRateLimit = redis
    ? new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 attempts per 15 minutes
          analytics: true,
          prefix: 'auth',
      })
    : null;

export const fallbackRateLimit = {
    limit: async (key: string) => {
        console.log(`🔄 Rate limit check bypassed for: ${key} (Redis not available)`);
        return {
            success: true,
            limit: 100,
            remaining: 99,
            reset: Date.now() + 60000,
        };
    },
};
