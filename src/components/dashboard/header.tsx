'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { SessionProvider } from 'next-auth/react';
import { MobileSidebarTrigger } from '@/components/dashboard/sidebar';
import { UserMenu } from '@/components/dashboard/user-menu';
import { CompactLocaleSwitcher } from '@/components/locale/compact-locale-switcher';
import { Notifications } from '@/components/dashboard/notifications';
import { ThemeToggle } from '@/components/theme/theme-toggle';

interface DashboardHeaderProps {
    children?: ReactNode;
}

export function DashboardHeader({ children }: DashboardHeaderProps) {
    return (
        <header className="flex h-12 w-full items-center justify-between bg-gray-100 px-4 md:px-5 dark:bg-zinc-900">
            <div className="flex items-center space-x-3">
                <MobileSidebarTrigger />
                <Link href="/" className="flex items-center space-x-6">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                        <span className="text-xs font-bold text-white">N</span>
                    </div>
                    <span className="hidden font-bold text-gray-900 lg:block dark:text-zinc-100">
                        Nitrokit
                    </span>
                </Link>
                <div className="hidden md:block">{children}</div>
            </div>
            <div className="mr-1 flex items-center space-x-2">
                <CompactLocaleSwitcher />
                <ThemeToggle />
                <Notifications />
                <SessionProvider>
                    <UserMenu size={'size-9'} />
                </SessionProvider>
            </div>
        </header>
    );
}
