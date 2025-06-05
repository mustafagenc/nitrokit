import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { NotificationSettingsForm } from './components/notification-settings-form';

export const metadata: Metadata = {
    title: 'Notification Settings',
    description: 'Manage your notification preferences',
};

async function getNotificationPreferences(userId: string) {
    const preferences = await prisma.notificationPreferences.findUnique({
        where: { userId },
    });

    if (!preferences) {
        return await prisma.notificationPreferences.create({
            data: { userId },
        });
    }

    return preferences;
}

export default async function NotificationSettingsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/signin');
    }

    const preferences = await getNotificationPreferences(session.user.id);

    return (
        <div className="container mx-auto py-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Notification Settings</h1>
                    <p className="text-muted-foreground">
                        Choose how you want to be notified about account activity and updates.
                    </p>
                </div>

                <NotificationSettingsForm preferences={preferences} />
            </div>
        </div>
    );
}
