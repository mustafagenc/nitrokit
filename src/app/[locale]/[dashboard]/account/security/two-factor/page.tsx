import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generatePageMetadata } from '@/lib';
import { TwoFactorManagement } from './components/two-factor-management';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('dashboard.account.security.twoFactor');
    return await generatePageMetadata({
        params: Promise.resolve({
            title: t('page.title'),
            description: t('page.description'),
        }),
    });
}

export default async function TwoFactorPage() {
    const session = await auth();
    const t = await getTranslations('dashboard.account.security.twoFactor');

    if (!session) {
        redirect('/signin');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            twoFactorEnabled: true,
            twoFactorVerifiedAt: true,
        },
    });

    if (!user) {
        redirect('/signin');
    }

    return (
        <div className="mx-auto w-full space-y-6 px-4 sm:px-6 lg:max-w-4xl lg:px-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">{t('page.heading')}</h2>
                <p className="text-muted-foreground">{t('page.subheading')}</p>
            </div>

            <TwoFactorManagement
                userId={user.id}
                twoFactorEnabled={user.twoFactorEnabled}
                twoFactorVerifiedAt={user.twoFactorVerifiedAt}
            />
        </div>
    );
}
