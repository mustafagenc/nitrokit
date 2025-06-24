'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from '@/i18n/navigation';
import { useEffect } from 'react';

export function useRequireAuth() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/signin');
        }
    }, [session, status, router]);

    return { session, status };
}
