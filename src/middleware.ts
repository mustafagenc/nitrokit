import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { routing } from '@/lib/i18n/routing';
import { apiRateLimit, fallbackRateLimit } from '@/lib/security/rate-limit';
import type { NextRequest } from 'next/server';
import { updateSessionInfo } from '@/lib/auth/session-tracking';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
    if (process.env.SKIP_MIDDLEWARE === 'true') {
        return NextResponse.next();
    }

    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        try {
            const session = await auth();
            if (session?.user?.id) {
                const sessionToken =
                    request.cookies.get('authjs.session-token')?.value ||
                    request.cookies.get('__Secure-authjs.session-token')?.value;

                if (sessionToken) {
                    updateSessionInfo(sessionToken, request).catch(() => {});
                }
            }
        } catch (error) {
            console.error('Middleware session tracking error:', error);
        }
    }

    if (request.nextUrl.pathname.startsWith('/api/')) {
        const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth/');

        if (!isAuthRoute) {
            const ip =
                request.headers.get('x-forwarded-for') ||
                request.headers.get('x-real-ip') ||
                'anonymous';

            try {
                const rateLimit = apiRateLimit || fallbackRateLimit;
                const { success, limit, remaining, reset } = await rateLimit.limit(ip);

                if (!success) {
                    return NextResponse.json(
                        {
                            error: 'Too many requests',
                            rateLimit: {
                                limit,
                                remaining: 0,
                                reset: new Date(reset).toISOString(),
                            },
                        },
                        {
                            status: 429,
                            headers: {
                                'X-RateLimit-Limit': limit.toString(),
                                'X-RateLimit-Remaining': '0',
                                'X-RateLimit-Reset': new Date(reset).toISOString(),
                            },
                        }
                    );
                }

                const response = NextResponse.next();
                response.headers.set('X-RateLimit-Limit', limit.toString());
                response.headers.set('X-RateLimit-Remaining', remaining.toString());
                response.headers.set('X-RateLimit-Reset', new Date(reset).toISOString());

                return response;
            } catch (error) {
                console.error('Rate limit error (bypassing):', error);
                return NextResponse.next();
            }
        }

        return NextResponse.next();
    }

    const intlResponse = await intlMiddleware(request);
    if (intlResponse) return intlResponse;

    const session = await auth();
    if (!session) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/(.*)',
        '/dashboard/:path*',
        '/((?!api|trpc|_next|_vercel|sitemap|robots|storybook|.*\\..*).*)',
    ],
};
