import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { generatePageMetadata } from '@/lib';
import { NotificationsList } from './components/notifications-list';

export async function generateMetadata(): Promise<Metadata> {
    return await generatePageMetadata({
        params: Promise.resolve({
            title: 'Notifications',
            description: 'View and manage your notifications',
        }),
    });
}

export default async function NotificationsPage() {
    const session = await auth();

    if (!session) {
        redirect('/signin');
    }

    return (
        <div className="container mx-auto max-w-4xl space-y-8 py-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                <p className="text-muted-foreground">
                    Stay updated with your account activities and system alerts.
                </p>
            </div>

            <NotificationsList />
        </div>
    );
}
