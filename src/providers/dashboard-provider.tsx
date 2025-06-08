import { AvatarProvider } from '@/contexts/avatar-context';
import { InAppNotificationProvider } from '@/contexts/inapp-notification-context';
import { SessionProvider } from 'next-auth/react';

export default function DashboardProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <InAppNotificationProvider>
                <AvatarProvider>{children}</AvatarProvider>
            </InAppNotificationProvider>
        </SessionProvider>
    );
}
