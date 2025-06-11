import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generatePageMetadata } from '@/lib';
import { ProfileForm } from './components/profile-form';

export async function generateMetadata(): Promise<Metadata> {
    return await generatePageMetadata({
        params: Promise.resolve({
            title: 'Profile Settings',
            description: 'Manage your personal information and profile settings',
        }),
    });
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
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
                <p className="text-muted-foreground">
                    Manage your personal information and profile preferences.
                </p>
            </div>

            <ProfileForm user={{ ...user, emailVerified: !!user.emailVerified }} />
        </div>
    );
}
