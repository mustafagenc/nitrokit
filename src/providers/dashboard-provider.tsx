import { AvatarProvider } from '@/contexts/avatar-context';
import { SessionProvider } from 'next-auth/react';

export default function DashboardProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AvatarProvider>{children}</AvatarProvider>
        </SessionProvider>
    );
}
