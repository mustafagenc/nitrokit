'use client';

import { usePathname } from 'next/navigation';
import { Link } from '@/lib/i18n/navigation';
import {
    LayoutDashboard,
    User,
    Shield,
    Smartphone,
    Bell,
    Settings,
    ChevronDown,
} from 'lucide-react';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from '@/components/ui/menubar';

export function AccountNavigation() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/dashboard/account') {
            return pathname === path;
        }
        return pathname.includes(path.replace('/dashboard/account', ''));
    };

    const getNavItemClasses = (path: string) => {
        const isCurrentlyActive = isActive(path);

        return `
            group flex cursor-pointer items-center gap-1 rounded-none 
            bg-transparent px-0 py-3.5 text-sm font-medium text-nowrap 
            outline-none select-none transition-all duration-200
            border-b-3 ${
                isCurrentlyActive
                    ? 'text-primary border-primary font-semibold'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
            }
            hover:bg-transparent focus:bg-transparent 
            data-[state=open]:bg-transparent data-[state=open]:text-foreground
        `
            .replace(/\s+/g, ' ')
            .trim();
    };

    const getSimpleNavItemClasses = (path: string) => {
        const isCurrentlyActive = isActive(path);

        return `
            group flex cursor-pointer items-center rounded-none 
            bg-transparent px-3 py-3.5 text-sm font-medium text-nowrap 
            outline-none select-none transition-all duration-200
            border-b-3 ${
                isCurrentlyActive
                    ? 'text-primary border-primary font-semibold'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
            }
            hover:bg-transparent focus:bg-transparent
        `
            .replace(/\s+/g, ' ')
            .trim();
    };

    return (
        <div className="sticky top-0 z-10 rounded-t-2xl border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-zinc-950">
            <div className="mx-auto flex w-full items-stretch justify-between gap-5 px-4 lg:px-6">
                <div className="grid">
                    <div className="kt-scrollable-x-auto flex items-stretch">
                        <Menubar className="flex h-auto items-stretch gap-5 space-x-0 rounded-none border-none bg-transparent p-0">
                            {/* Account Overview */}
                            <MenubarMenu>
                                <MenubarTrigger asChild>
                                    <Link
                                        href="/dashboard/account"
                                        className={getNavItemClasses('/dashboard/account')}>
                                        <LayoutDashboard className="h-4 w-4" />
                                        Overview
                                    </Link>
                                </MenubarTrigger>
                            </MenubarMenu>

                            {/* Profile */}
                            <MenubarMenu>
                                <MenubarTrigger asChild>
                                    <Link
                                        href="/dashboard/account/profile"
                                        className={getNavItemClasses('/profile')}>
                                        <User className="h-4 w-4" />
                                        Profile
                                    </Link>
                                </MenubarTrigger>
                            </MenubarMenu>

                            {/* Security */}
                            <MenubarMenu>
                                <MenubarTrigger className={getNavItemClasses('/security')}>
                                    <Shield className="h-4 w-4" />
                                    Security
                                    <ChevronDown className="ms-auto size-3.5" />
                                </MenubarTrigger>
                                <MenubarContent className="bg-white dark:bg-zinc-950">
                                    <MenubarItem asChild>
                                        <Link
                                            href="/dashboard/account/security"
                                            className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <Shield className="h-4 w-4" />
                                            Password & Security
                                        </Link>
                                    </MenubarItem>
                                    <MenubarItem asChild>
                                        <Link
                                            href="/dashboard/account/2fa"
                                            className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <Smartphone className="h-4 w-4" />
                                            Two-Factor Authentication
                                        </Link>
                                    </MenubarItem>
                                    <MenubarSeparator />
                                    <MenubarItem asChild>
                                        <Link
                                            href="/dashboard/account/sessions"
                                            className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <Settings className="h-4 w-4" />
                                            Active Sessions
                                        </Link>
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>

                            {/* Notifications */}
                            <MenubarMenu>
                                <MenubarTrigger asChild>
                                    <Link
                                        href="/dashboard/account/notifications"
                                        className={getSimpleNavItemClasses('/notifications')}>
                                        <Bell className="mr-2 h-4 w-4" />
                                        Notifications
                                    </Link>
                                </MenubarTrigger>
                            </MenubarMenu>

                            {/* <MenubarMenu>
                                <MenubarTrigger className={getNavItemClasses('/billing')}>
                                    <CreditCard className="h-4 w-4" />
                                    Billing
                                    <ChevronDown className="ms-auto size-3.5" />
                                </MenubarTrigger>
                                <MenubarContent className="bg-white dark:bg-zinc-950">
                                    <MenubarItem asChild>
                                        <Link
                                            href="/dashboard/account/billing"
                                            className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <CreditCard className="h-4 w-4" />
                                            Plans & Billing
                                        </Link>
                                    </MenubarItem>
                                    <MenubarItem asChild>
                                        <Link
                                            href="/dashboard/account/billing/invoices"
                                            className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <Settings className="h-4 w-4" />
                                            Invoice History
                                        </Link>
                                    </MenubarItem>
                                    <MenubarSeparator />
                                    <MenubarItem asChild>
                                        <Link
                                            href="/dashboard/account/billing/payment-methods"
                                            className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <Key className="h-4 w-4" />
                                            Payment Methods
                                        </Link>
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu> */}

                            {/* <MenubarMenu>
                                <MenubarTrigger asChild>
                                    <Link
                                        href="/dashboard/account/api-keys"
                                        className={getSimpleNavItemClasses('/api-keys')}>
                                        <Key className="mr-2 h-4 w-4" />
                                        API Keys
                                    </Link>
                                </MenubarTrigger>
                            </MenubarMenu>

                            <MenubarMenu>
                                <MenubarTrigger className="group text-muted-foreground hover:text-foreground data-[state=open]:text-foreground flex cursor-pointer items-center gap-1 rounded-none border-b-3 border-transparent bg-transparent px-0 py-3.5 text-sm font-medium text-nowrap transition-all duration-200 outline-none select-none hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                                    More
                                    <ChevronDown className="ms-auto size-3.5" />
                                </MenubarTrigger>
                                <MenubarContent className="bg-white dark:bg-zinc-950">
                                    <MenubarItem asChild>
                                        <Link
                                            href="/dashboard/account/preferences"
                                            className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <Settings className="h-4 w-4" />
                                            Preferences
                                        </Link>
                                    </MenubarItem>
                                    <MenubarItem asChild>
                                        <Link
                                            href="/dashboard/account/integrations"
                                            className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <Key className="h-4 w-4" />
                                            Integrations
                                        </Link>
                                    </MenubarItem>
                                    <MenubarSeparator />
                                    <MenubarItem asChild>
                                        <Link
                                            href="/dashboard/account/advanced"
                                            className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <Shield className="h-4 w-4" />
                                            Advanced Settings
                                        </Link>
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu> */}
                        </Menubar>
                    </div>
                </div>
            </div>
        </div>
    );
}
