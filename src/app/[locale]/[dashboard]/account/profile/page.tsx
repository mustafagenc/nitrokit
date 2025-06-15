import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generatePageMetadata } from '@/lib';
import { AccountLinking } from './components/account-linking';
import { ProfileInformation } from './components/profile-information';
import { Preferences } from './components/preferences';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('dashboard.account.profile');
    return await generatePageMetadata({
        params: Promise.resolve({
            title: t('page.title'),
            description: t('page.description'),
        }),
    });
}

async function getConnectedAccounts(userId: string) {
    const accounts = await prisma.account.findMany({
        where: { userId },
        select: {
            id: true,
            provider: true,
            providerAccountId: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    return accounts.map((account) => ({
        ...account,
        createdAt: account.createdAt.toISOString(),
    }));
}

async function AccountLinkingContent({ userId }: { userId: string }) {
    const accounts = await getConnectedAccounts(userId);

    return <AccountLinking accounts={accounts} />;
}

export default async function ProfilePage() {
    const session = await auth();
    const t = await getTranslations('dashboard.account.profile');

    if (!session) {
        redirect('/signin');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
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

            <ProfileInformation
                user={{
                    ...user,
                    emailVerified: !!user.emailVerified,
                    lastLoginAt: user.lastLoginAt || undefined,
                }}
            />
            <AccountLinkingContent userId={session.user.id} />
            <Preferences
                user={{
                    ...user,
                    emailVerified: !!user.emailVerified,
                    lastLoginAt: user.lastLoginAt || undefined,
                }}
            />
        </div>
    );
}
