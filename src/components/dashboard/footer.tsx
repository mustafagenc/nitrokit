'use client';

import DevelopedBy from '@/components/shared/developed-by';
import { CompactThemeSwitcher } from '@/components/theme/compact-theme-switcher';

export function DashboardFooter() {
    return (
        <footer className="mt-2 mr-3 ml-16 flex h-8">
            <div className="flex w-1/2 items-center justify-start">
                <CompactThemeSwitcher />
            </div>
            <div className="flex w-1/2 items-center justify-end">
                <DevelopedBy />
            </div>
        </footer>
    );
}
