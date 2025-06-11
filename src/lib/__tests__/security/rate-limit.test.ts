import { describe, it, expect } from 'vitest';
import { getRateLimitHeaders, isRateLimited, checkRateLimit } from '../../security/rate-limit';

describe('rate-limit utils', () => {
    it('getRateLimitHeaders doğru header değerlerini döndürür', () => {
        const result = {
            limit: 100,
            remaining: 99,
            reset: Date.now() + 60000,
        };
        const headers = getRateLimitHeaders(result);
        expect(headers['X-RateLimit-Limit']).toBe('100');
        expect(headers['X-RateLimit-Remaining']).toBe('99');
        expect(headers['X-RateLimit-Reset']).toBe(result.reset.toString());
    });

    it('isRateLimited true döndürür', () => {
        const result = { success: false };
        expect(isRateLimited(result)).toBe(true);
    });

    it('isRateLimited false döndürür', () => {
        const result = { success: true };
        expect(isRateLimited(result)).toBe(false);
    });

    it('checkRateLimit fallback ile çalışır', async () => {
        const result = await checkRateLimit(null, 'test-key');
        expect(result.success).toBe(true);
        expect(result.limit).toBe(100);
        expect(result.remaining).toBe(99);
        expect(result.reset).toBeGreaterThan(Date.now());
    });
});
