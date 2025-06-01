'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/helpers';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, Settings, Menu, HeartHandshake, ReceiptText } from 'lucide-react';

const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Invoices', href: '/dashboard/invoices', icon: ReceiptText },
    { name: 'Support', href: '/dashboard/support', icon: HeartHandshake },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

function DesktopSidebar() {
    const pathname = usePathname();

    return (
        <TooltipProvider>
            <aside className="hidden w-16 flex-col bg-gray-100 md:flex dark:bg-zinc-900">
                <nav className="flex flex-1 flex-col items-center justify-start space-y-3 p-2">
                    {navigationItems.map(item => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Tooltip key={item.name} delayDuration={300}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200',
                                            isActive
                                                ? 'bg-white text-blue-600 shadow-lg dark:bg-zinc-800 dark:text-blue-400'
                                                : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                                        )}>
                                        <Icon className="h-5 w-5" />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={12}>
                                    <p>{item.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>
            </aside>
        </TooltipProvider>
    );
}
export function MobileSidebarTrigger() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full hover:bg-white hover:shadow-sm md:hidden dark:hover:bg-zinc-800">
                    <Menu className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-full flex-col bg-white dark:bg-zinc-950">
                    <div className="flex h-12 items-center border-b border-gray-200 px-4 dark:border-zinc-800">
                        <Link href="/dashboard" className="flex items-center space-x-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                                <span className="text-xs font-bold text-white">N</span>
                            </div>
                            <span className="font-bold text-gray-900 dark:text-zinc-100">
                                Nitrokit
                            </span>
                        </Link>
                    </div>
                    <nav className="flex-1 space-y-2 px-4 pt-4">
                        {navigationItems.map(item => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center space-x-3 rounded-xl px-3 py-2.5 transition-all duration-200',
                                        isActive
                                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                                    )}>
                                    <Icon className="h-5 w-5" />
                                    <span className="text-sm font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    );
}
export function DashboardSidebar() {
    return <DesktopSidebar />;
}
