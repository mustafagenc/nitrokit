import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { generatePageMetadata } from '@/lib';
import { SessionsPageClient } from './components/sessions-page-client';
import { logger } from '@/lib/logger/logger';

export async function generateMetadata(): Promise<Metadata> {
    return await generatePageMetadata({
        params: Promise.resolve({
            title: 'Active Sessions',
            description: 'Manage your active login sessions and security',
        }),
    });
}

export default async function ActiveSessionsPage() {
    const session = await auth();

    if (!session) {
        redirect('/signin');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            email: true,
            lastLoginAt: true,
        },
    });

    if (!user) {
        redirect('/signin');
    }

    logger.logUserAction(session.user.id, 'view_sessions_page', 'sessions', {
        timestamp: new Date().toISOString(),
        userAgent: 'server-side-render',
    });

    logger.setUser(session.user.id, {
        email: session.user.email || undefined,
        name: session.user.name || undefined,
        lastLoginAt: new Date(),
    });

    logger.logSecurityEvent(session.user.id, 'sessions_page_access', {
        severity: 'low',
        timestamp: new Date().toISOString(),
    });

    return <SessionsPageClient userId={user.id} currentSessionId={session.user.id} />;
}
