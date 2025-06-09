import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/services/logger';

// CSRF token configuration
const CSRF_TOKEN_LENGTH = 32;
const CSRF_TOKEN_LIFETIME = 60 * 60 * 1000; // 1 hour
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_COOKIE_NAME = 'csrf-token';

interface CSRFToken {
    token: string;
    timestamp: number;
    userId?: string;
}

// In-memory store (use Redis in production)
const tokenStore = new Map<string, CSRFToken>();

// Generate CSRF token
export function generateCSRFToken(userId?: string): string {
    const token = crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');

    tokenStore.set(token, {
        token,
        timestamp: Date.now(),
        userId,
    });

    logger.debug('CSRF token generated', {
        tokenLength: token.length,
        hasUserId: !!userId,
    });

    // Cleanup old tokens
    cleanupExpiredTokens();

    return token;
}

// Verify CSRF token
export function verifyCSRFToken(token: string, userId?: string): boolean {
    try {
        const storedToken = tokenStore.get(token);

        if (!storedToken) {
            logger.warn('CSRF token not found', {
                tokenLength: token.length,
            });
            return false;
        }

        // Check expiration
        if (Date.now() - storedToken.timestamp > CSRF_TOKEN_LIFETIME) {
            logger.warn('CSRF token expired', {
                tokenAge: Date.now() - storedToken.timestamp,
                tokenLength: token.length,
            });
            tokenStore.delete(token);
            return false;
        }

        // Check user association
        if (userId && storedToken.userId !== userId) {
            logger.warn('CSRF token user mismatch', {
                expectedUserId: userId,
                tokenUserId: storedToken.userId,
            });
            return false;
        }

        logger.debug('CSRF token verified successfully', {
            tokenLength: token.length,
            hasUserId: !!userId,
        });

        return true;
    } catch (error) {
        logger.error('CSRF token verification failed', error instanceof Error ? error : undefined, {
            tokenLength: token.length,
        });
        return false;
    }
}

// Cleanup expired tokens
function cleanupExpiredTokens(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [token, data] of tokenStore.entries()) {
        if (now - data.timestamp > CSRF_TOKEN_LIFETIME) {
            tokenStore.delete(token);
            cleanedCount++;
        }
    }

    if (cleanedCount > 0) {
        logger.debug('Cleaned up expired CSRF tokens', {
            cleanedCount,
            remainingCount: tokenStore.size,
        });
    }
}

// Middleware for CSRF protection
export function csrfProtection(
    request: NextRequest,
    options: {
        ignoreMethods?: string[];
        requireToken?: boolean;
    } = {}
): {
    valid: boolean;
    error?: string;
    token?: string;
} {
    const method = request.method.toUpperCase();
    const ignoreMethods = options.ignoreMethods || ['GET', 'HEAD', 'OPTIONS'];

    // Skip CSRF check for safe methods
    if (ignoreMethods.includes(method)) {
        const newToken = generateCSRFToken();
        return { valid: true, token: newToken };
    }

    // Check for CSRF token in header or body
    const headerToken = request.headers.get(CSRF_HEADER_NAME);
    const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;

    const token = headerToken || cookieToken;

    if (!token) {
        logger.warn('CSRF token missing', {
            method,
            hasHeaderToken: !!headerToken,
            hasCookieToken: !!cookieToken,
            userAgent: request.headers.get('user-agent')?.substring(0, 100),
        });

        return { valid: false, error: 'CSRF token required' };
    }

    const isValid = verifyCSRFToken(token);

    if (!isValid) {
        logger.warn('CSRF token validation failed', {
            method,
            tokenLength: token.length,
            ip:
                request.headers.get('x-forwarded-for') ||
                request.headers.get('x-real-ip') ||
                'unknown',
            userAgent: request.headers.get('user-agent')?.substring(0, 100),
        });

        // Log security event
        logger.logSecurityEvent('csrf_token_invalid', {
            severity: 'high',
            method,
            ip:
                request.headers.get('x-forwarded-for') ||
                request.headers.get('x-real-ip') ||
                'unknown',
            userAgent: request.headers.get('user-agent') || undefined,
        });

        return { valid: false, error: 'Invalid CSRF token' };
    }

    // Generate new token for next request
    const newToken = generateCSRFToken();

    return { valid: true, token: newToken };
}

// Add CSRF token to response
export function addCSRFTokenToResponse(response: NextResponse, token: string): NextResponse {
    // Set as HTTP-only cookie
    response.cookies.set(CSRF_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: CSRF_TOKEN_LIFETIME / 1000,
        path: '/',
    });

    // Also set as header for client-side access
    response.headers.set(CSRF_HEADER_NAME, token);

    return response;
}

// Double Submit Cookie pattern
export function generateDoubleSubmitToken(): {
    token: string;
    signature: string;
} {
    const token = crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
    const secret = process.env.CSRF_SECRET || 'fallback-csrf-secret';
    const signature = crypto.createHmac('sha256', secret).update(token).digest('hex');

    return { token, signature };
}

export function verifyDoubleSubmitToken(token: string, signature: string): boolean {
    try {
        const secret = process.env.CSRF_SECRET || 'fallback-csrf-secret';
        const expectedSignature = crypto.createHmac('sha256', secret).update(token).digest('hex');

        return crypto.timingSafeEqual(
            Buffer.from(signature, 'hex'),
            Buffer.from(expectedSignature, 'hex')
        );
    } catch (error) {
        logger.error(
            'Double submit token verification failed',
            error instanceof Error ? error : undefined
        );
        return false;
    }
}

// SameSite cookie helpers
export function setSecureCookie(
    response: NextResponse,
    name: string,
    value: string,
    options: {
        maxAge?: number;
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
    } = {}
): void {
    response.cookies.set(name, value, {
        maxAge: options.maxAge || 3600,
        httpOnly: options.httpOnly !== false,
        secure: options.secure !== false && process.env.NODE_ENV === 'production',
        sameSite: options.sameSite || 'strict',
        path: '/',
    });
}

// Origin validation
export function validateOrigin(request: NextRequest, allowedOrigins: string[]): boolean {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');

    if (!origin && !referer) {
        logger.warn('No origin or referer header present', {
            method: request.method,
            url: request.url,
        });
        return false;
    }

    const sourceOrigin = origin || (referer ? new URL(referer).origin : '');

    const isAllowed = allowedOrigins.some(allowed => {
        if (allowed === '*') return true;
        if (allowed.startsWith('*.')) {
            const domain = allowed.substring(2);
            return sourceOrigin.endsWith(domain);
        }
        return sourceOrigin === allowed;
    });

    if (!isAllowed) {
        logger.warn('Origin validation failed', {
            sourceOrigin,
            allowedOrigins: allowedOrigins.join(', '),
        });

        logger.logSecurityEvent('origin_validation_failed', {
            severity: 'medium',
            sourceOrigin,
            method: request.method,
        });
    }

    return isAllowed;
}
