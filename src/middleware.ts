import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { routing } from '@/lib/i18n/routing';

import type { NextRequest } from 'next/server';
const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
    // Önce next-intl middleware'ini çalıştır
    const intlResponse = await intlMiddleware(request);
    if (intlResponse) return intlResponse;

    // Auth middleware'ini çalıştır
    const session = await auth();
    if (!session) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Auth ve next-intl için gerekli tüm path'leri kapsa
        '/((?!api|trpc|_next|_vercel|sitemap|robots|.*\\..*).*)',
    ],
};
