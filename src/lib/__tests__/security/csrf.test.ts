import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import {
    generateCSRFToken,
    verifyCSRFToken,
    csrfProtection,
    addCSRFTokenToResponse,
    generateDoubleSubmitToken,
    verifyDoubleSubmitToken,
    validateOrigin,
} from '../../security/csrf';
import { tokenStore } from '../../security/csrf';

vi.mock('crypto', () => ({
    default: {
        randomBytes: vi.fn(),
        createHmac: vi.fn(),
        timingSafeEqual: vi.fn(),
    },
    randomBytes: vi.fn(),
    createHmac: vi.fn(),
    timingSafeEqual: vi.fn(),
}));

vi.mock('@/lib/services/logger', () => ({
    logger: {
        debug: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        logSecurityEvent: vi.fn(),
    },
}));

import crypto from 'crypto';

const mockCrypto = vi.mocked(crypto);

describe('CSRF Security Module', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        tokenStore.clear();

        const mockBytes = new Uint8Array(32);
        mockBytes.fill(97);
        mockCrypto.randomBytes.mockImplementation(() => mockBytes);

        const mockHmac = {
            update: vi.fn().mockReturnThis(),
            digest: vi.fn().mockReturnValue('mock-signature'),
        };
        mockCrypto.createHmac.mockReturnValue(mockHmac as any);
        mockCrypto.timingSafeEqual.mockReturnValue(true);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('generateCSRFToken', () => {
        it('should generate a valid CSRF token', () => {
            const token = generateCSRFToken();

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.length).toBeGreaterThan(0);
            expect(mockCrypto.randomBytes).toHaveBeenCalledWith(32);
        });

        it('should generate token with user ID', () => {
            const userId = 'user-123';
            const token = generateCSRFToken(userId);

            expect(token).toBeDefined();
            expect(token.length).toBeGreaterThan(0);
        });
    });

    describe('verifyCSRFToken', () => {
        it('should verify valid token', () => {
            const token = generateCSRFToken();
            const isValid = verifyCSRFToken(token);

            expect(isValid).toBe(true);
        });

        it('should reject non-existent token', () => {
            const isValid = verifyCSRFToken('non-existent-token');
            expect(isValid).toBe(false);
        });

        it('should reject expired token', () => {
            const token = generateCSRFToken();
            vi.advanceTimersByTime(60 * 60 * 1000 + 1); // 1 hour + 1ms
            const isValid = verifyCSRFToken(token);
            expect(isValid).toBe(false);
        });

        it('should verify token with matching user ID', () => {
            const userId = 'user-123';
            const token = generateCSRFToken(userId);
            const isValid = verifyCSRFToken(token, userId);
            expect(isValid).toBe(true);
        });

        it('should reject token with mismatched user ID', () => {
            const token = generateCSRFToken('user-123');
            const isValid = verifyCSRFToken(token, 'user-456');
            expect(isValid).toBe(false);
        });
    });

    describe('csrfProtection middleware', () => {
        const createMockRequest = (
            method: string,
            headers: Record<string, string> = {},
            cookies: Record<string, string> = {}
        ) => {
            return {
                method,
                headers: {
                    get: vi.fn((name: string) => headers[name.toLowerCase()] || null),
                },
                cookies: {
                    get: vi.fn((name: string) =>
                        cookies[name] ? { value: cookies[name] } : undefined
                    ),
                },
            } as unknown as NextRequest;
        };

        it('should allow safe methods and generate new token', () => {
            const request = createMockRequest('GET');
            const result = csrfProtection(request);

            expect(result.valid).toBe(true);
            expect(result.token).toBeDefined();
            expect(result.error).toBeUndefined();
        });

        it('should reject unsafe method without token', () => {
            const request = createMockRequest('POST');
            const result = csrfProtection(request);

            expect(result.valid).toBe(false);
            expect(result.error).toBe('CSRF token required');
        });

        it('should accept valid token in header', () => {
            const token = generateCSRFToken();
            const request = createMockRequest('POST', {
                'x-csrf-token': token,
            });

            const result = csrfProtection(request);

            expect(result.valid).toBe(true);
            expect(result.token).toBeDefined();
        });

        it('should accept valid token in cookie', () => {
            const token = generateCSRFToken();
            const request = createMockRequest(
                'POST',
                {},
                {
                    'csrf-token': token,
                }
            );

            const result = csrfProtection(request);

            expect(result.valid).toBe(true);
            expect(result.token).toBeDefined();
        });
    });

    describe('addCSRFTokenToResponse', () => {
        it('should add token to response headers and cookies', () => {
            const token = generateCSRFToken();
            const response = new NextResponse();
            const result = addCSRFTokenToResponse(response, token);

            expect(result.headers.get('x-csrf-token')).toBe(token);
            expect(result.cookies.get('csrf-token')?.value).toBe(token);
        });
    });

    describe('Double Submit Cookie Pattern', () => {
        it('should generate token and signature', () => {
            const { token, signature } = generateDoubleSubmitToken();

            expect(token).toBeDefined();
            expect(signature).toBeDefined();
            expect(typeof token).toBe('string');
            expect(typeof signature).toBe('string');
        });

        it('should verify valid token and signature', () => {
            const { token, signature } = generateDoubleSubmitToken();
            const isValid = verifyDoubleSubmitToken(token, signature);

            expect(isValid).toBe(true);
        });

        it('should reject invalid signature', () => {
            mockCrypto.timingSafeEqual.mockReturnValueOnce(false);
            const { token } = generateDoubleSubmitToken();
            const isValid = verifyDoubleSubmitToken(token, 'invalid-signature');

            expect(isValid).toBe(false);
        });
    });

    describe('Origin Validation', () => {
        it('should validate allowed origin', () => {
            const request = {
                headers: {
                    get: vi.fn((name: string) =>
                        name.toLowerCase() === 'origin' ? 'https://example.com' : null
                    ),
                },
            } as unknown as NextRequest;

            const isValid = validateOrigin(request, ['https://example.com']);
            expect(isValid).toBe(true);
        });

        it('should reject disallowed origin', () => {
            const request = {
                headers: {
                    get: vi.fn((name: string) =>
                        name.toLowerCase() === 'origin' ? 'https://malicious.com' : null
                    ),
                },
            } as unknown as NextRequest;

            const isValid = validateOrigin(request, ['https://example.com']);
            expect(isValid).toBe(false);
        });
    });
});
