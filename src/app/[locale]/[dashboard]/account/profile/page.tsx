import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generatePageMetadata } from '@/lib';
import { AccountLinking } from './components/account-linking';
import { ProfileInformation } from './components/profile-information';
import { Preferences } from './components/preferences';

export async function generateMetadata(): Promise<Metadata> {
    return await generatePageMetadata({
        params: Promise.resolve({
            title: 'Profile Settings',
            description: 'Manage your personal information and profile settings',
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
                <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
                <p className="text-muted-foreground">
                    Manage your personal information and profile preferences.
                </p>
            </div>

            <ProfileInformation user={{ ...user, emailVerified: !!user.emailVerified }} />
            <AccountLinkingContent userId={session.user.id} />
            <Preferences user={{ ...user, emailVerified: !!user.emailVerified }} />
        </div>
    );
}
