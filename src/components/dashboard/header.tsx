'use client';

import { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { MobileSidebarTrigger } from '@/components/dashboard/sidebar';
import { UserMenu } from '@/components/dashboard/user-menu';
import { Notifications } from '@/components/dashboard/notifications';

interface DashboardHeaderProps {
    children?: ReactNode;
}

export function DashboardHeader({ children }: DashboardHeaderProps) {
    return (
        <header className="flex h-15 w-full items-center justify-between bg-gray-100 px-4 dark:bg-zinc-900">
            <div className="flex items-center space-x-4">
                <MobileSidebarTrigger />
                <Link href="/" className="group flex items-center space-x-4">
                    <div className="relative flex h-9 w-9 items-center justify-center">
                        <div
                            className="absolute inset-0 bg-slate-900 transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-purple-600 dark:bg-slate-100"
                            style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
                        ></div>
                        <span className="relative z-10 text-lg font-bold text-white transition-all duration-300 group-hover:text-blue-100 dark:text-slate-900 dark:group-hover:text-white">
                            N
                        </span>
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
                <Notifications />
                <UserMenu size={'size-10'} />
            </div>
        </header>
    );
}
