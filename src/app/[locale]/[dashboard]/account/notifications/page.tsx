import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generatePageMetadata } from '@/lib';
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

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('dashboard.account.notifications');
    return await generatePageMetadata({
        params: Promise.resolve({
            title: t('page.title'),
            description: t('page.description'),
        }),
    });
}

export default async function NotificationSettingsPage() {
    const session = await auth();
    const t = await getTranslations('dashboard.account.notifications');

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
                <h2 className="text-2xl font-bold tracking-tight">{t('page.heading')}</h2>
                <p className="text-muted-foreground">{t('page.subheading')}</p>
            </div>

            <NotificationSettingsForm preferences={preferences} />
        </div>
    );
}
