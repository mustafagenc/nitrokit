import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { logger } from './logger';

export async function setLoggerContextFromRequest(request: NextRequest): Promise<void> {
    try {
        const session = await auth();
        const ip =
            request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';
        const requestId =
            request.headers.get('x-request-id') ||
            `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        logger.setRequestContext(ip, userAgent, requestId);

        if (session?.user?.id) {
            logger.setUserId(session.user.id);

            // Also set user info if available
            if (session.user.email || session.user.name) {
                logger.setUser({
                    email: session.user.email ?? undefined,
                    name: session.user.name ?? undefined,
                });
            }
        }
    } catch (error) {
        // Don't let logging errors break the app
        console.error('Failed to set logger context:', error);
    }
}

export function clearLoggerContext(): void {
    logger.clearContext();
}
