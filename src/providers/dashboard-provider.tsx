import { AvatarProvider } from '@/contexts/avatar-context';
import { InAppNotificationProvider } from '@/contexts/inapp-notification-context';

export default function DashboardProvider({ children }: { children: React.ReactNode }) {
    return (
        <InAppNotificationProvider>
            <AvatarProvider>{children}</AvatarProvider>
        </InAppNotificationProvider>
    );
}
