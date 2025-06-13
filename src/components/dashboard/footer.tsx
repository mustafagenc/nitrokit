'use client';

import { CompactThemeSwitcher } from '@/components/theme/compact-theme-switcher';

export function DashboardFooter() {
    return (
        <footer className="mt-3 ml-16 flex h-8">
            <div className="w-full"></div>
            <div className="flex items-center justify-between px-4 text-xs text-gray-500 dark:text-gray-400">
                <CompactThemeSwitcher />
            </div>
        </footer>
    );
}
