// src/components/dashboard/header.tsx
'use client';

import { ReactNode } from 'react';
import { Link } from '@/lib/i18n/navigation';
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
        <header className="flex h-15 w-full items-center justify-between bg-gray-100 px-4 dark:bg-zinc-900">
            <div className="flex items-center space-x-3">
                <MobileSidebarTrigger />
                <Link href="/" className="group flex items-center space-x-3">
                    <div className="relative flex h-9 w-9 items-center justify-center">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-90 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 group-hover:shadow-xl"></div>
                        <div className="absolute inset-0.5 rounded-xl bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 opacity-50 blur-sm"></div>
                        <span className="relative z-10 text-xl font-black text-white drop-shadow-lg transition-all duration-300 group-hover:drop-shadow-xl">
                            N
                        </span>
                        <div className="absolute top-1 left-1 h-2 w-2 rounded-full bg-white/30 blur-[1px]"></div>
                    </div>
                    <div className="hidden lg:block">
                        <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-xl font-bold tracking-tight text-transparent transition-all duration-300 group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-300 dark:group-hover:from-blue-400 dark:group-hover:via-purple-400 dark:group-hover:to-pink-400">
                            Nitrokit
                        </span>
                        <div className="h-0.5 w-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></div>
                    </div>
                </Link>
                <div className="hidden md:block">{children}</div>
            </div>
            <div className="mr-1 flex items-center space-x-2">
                <CompactLocaleSwitcher />
                <ThemeToggle />
                <Notifications />
                <SessionProvider>
                    <UserMenu size={'size-10'} />
                </SessionProvider>
            </div>
        </header>
    );
}
