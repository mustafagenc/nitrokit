'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export function useLoggerContext() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id) {
            logger.setUserId(session.user.id);

            // Build user info object with only truthy values
            const userInfo: Record<string, string> = {};

            if (session.user.email) {
                userInfo.email = session.user.email;
            }

            if (session.user.name) {
                userInfo.name = session.user.name;
            }

            // Only call setUser if we have some user info
            if (Object.keys(userInfo).length > 0) {
                logger.setUser(userInfo);
            }
        } else if (status === 'unauthenticated') {
            logger.clearUserId();
        }

        if (typeof window !== 'undefined') {
            logger.setRequestContext(
                undefined, // IP not available on client
                navigator.userAgent,
                `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            );
        }
    }, [session, status]);

    return {
        logUserAction: logger.logUserAction.bind(logger),
        logPageView: logger.logPageView.bind(logger),
        logFeatureUsage: logger.logFeatureUsage.bind(logger),
        info: logger.info.bind(logger),
        warn: logger.warn.bind(logger),
        error: logger.error.bind(logger),
    };
}
