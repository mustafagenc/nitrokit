import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generatePageMetadata } from '@/lib';
import { SessionsPageClient } from './components/sessions-page-client';

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

    return <SessionsPageClient />;
}
