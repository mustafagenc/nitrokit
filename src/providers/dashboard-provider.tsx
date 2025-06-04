import { AvatarProvider } from '@/contexts/avatar-context';
import { NotificationProvider } from '@/contexts/notification-context';
import { SessionProvider } from 'next-auth/react';

export default function DashboardProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <NotificationProvider>
                <AvatarProvider>{children}</AvatarProvider>
            </NotificationProvider>
        </SessionProvider>
    );
}
