import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generatePageMetadata } from '@/lib';
import { TwoFactorManagement } from './components/two-factor-management';

export async function generateMetadata(): Promise<Metadata> {
    return await generatePageMetadata({
        params: Promise.resolve({
            title: 'Two-Factor Authentication',
            description: 'Manage your two-factor authentication settings',
        }),
    });
}

export default async function TwoFactorPage() {
    const session = await auth();

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
                <h2 className="text-2xl font-bold tracking-tight">Two-Factor Authentication</h2>
                <p className="text-muted-foreground">
                    Add an extra layer of security to your account with 2FA.
                </p>
            </div>

            <TwoFactorManagement
                userId={user.id}
                twoFactorEnabled={user.twoFactorEnabled}
                twoFactorVerifiedAt={user.twoFactorVerifiedAt}
            />
        </div>
    );
}
