'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from '@/lib/i18n/navigation';

export function useSessionCheck() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            if (status === 'authenticated' && session) {
                try {
                    const response = await fetch('/api/auth/session');

                    if (!response.ok && response.status === 401) {
                        window.location.href = '/signin';
                    }
                } catch (error) {
                    console.error('Session check failed:', error);
                }
            }
        };

        // Check session every 5 minutes
        const interval = setInterval(checkSession, 5 * 60 * 1000);

        checkSession();

        return () => clearInterval(interval);
    }, [session, status, router]);
}
