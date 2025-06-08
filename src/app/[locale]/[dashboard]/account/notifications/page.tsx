import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NotificationSettingsForm } from './components/notification-settings-form';

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

export const metadata: Metadata = {
    title: 'Notification Settings',
    description: 'Manage your notification preferences',
};

export default async function NotificationSettingsPage() {
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

    const preferences = await getNotificationPreferences(session.user.id);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Notification Settings</h2>
                <p className="text-muted-foreground">
                    Choose how you want to be notified about account activity and updates.
                </p>
            </div>

            <NotificationSettingsForm preferences={preferences} />
        </div>
    );
}
