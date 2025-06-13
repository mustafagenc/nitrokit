import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generatePageMetadata } from '@/lib';
import { SessionsPageClient } from './components/sessions-page-client';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('dashboard.account.security.sessions');
    return await generatePageMetadata({
        params: Promise.resolve({
            title: t('page.title'),
            description: t('page.description'),
        }),
    });
}

export default async function ActiveSessionsPage() {
    const session = await auth();
    const t = await getTranslations('dashboard.account.security.sessions');

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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t('page.heading')}</h1>
                <p className="text-muted-foreground">{t('page.subheading')}</p>
            </div>

            <SessionsPageClient />
        </div>
    );
}
