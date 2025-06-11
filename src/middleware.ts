import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from '@/lib/i18n/routing';
import type { NextRequest } from 'next/server';
import { handleSessionTracking, checkAuthentication } from './middleware/session';
import { handleRateLimit } from './middleware/rate-limit';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
    if (process.env.SKIP_MIDDLEWARE === 'true') {
        return NextResponse.next();
    }

    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        await handleSessionTracking(request);
    }

    if (request.nextUrl.pathname.startsWith('/api/')) {
        const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth/');
        const isInternalRoute = request.nextUrl.pathname.startsWith('/api/internal/');

        if (!isAuthRoute && !isInternalRoute) {
            return handleRateLimit(request);
        }

        return NextResponse.next();
    }

    const intlResponse = await intlMiddleware(request);
    if (intlResponse) return intlResponse;

    const authResponse = await checkAuthentication(request);
    if (authResponse) return authResponse;

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/(.*)',
        '/dashboard/:path*',
        '/((?!api|trpc|_next|_vercel|sitemap|robots|storybook|.*\\..*).*)',
    ],
};
