'use client';

import { usePathname, Link } from '@/lib/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
    LayoutDashboard,
    User,
    Shield,
    Smartphone,
    Bell,
    Settings,
    ChevronDown,
    Menu,
} from 'lucide-react';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from '@/components/ui/menubar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib';

export function AccountNavigation() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const t = useTranslations('dashboard.account.navigation');

    const isActive = (path: string) => {
        if (path === '/dashboard/account') {
            return pathname === '/dashboard/account/';
        }
        if (path === '/profile') {
            return pathname.includes('/profile');
        }
        if (path === '/security') {
            return pathname.includes('/security');
        }
        if (path === '/notifications') {
            return pathname.includes('/notifications');
        }
        return false;
    };

    const getNavItemClasses = (path: string) => {
        const isCurrentlyActive = isActive(path);

        return `
            group flex cursor-pointer items-center gap-1 rounded-none 
            bg-transparent px-3 py-3.5 text-sm font-medium text-nowrap 
            outline-none select-none transition-all duration-200
            relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:transition-all after:duration-200 ${
                isCurrentlyActive
                    ? 'text-primary after:bg-primary font-semibold'
                    : 'text-muted-foreground after:bg-transparent hover:text-foreground'
            }
            hover:bg-transparent focus:bg-transparent 
            data-[state=open]:bg-transparent data-[state=open]:text-foreground
        `
            .replace(/\s+/g, ' ')
            .trim();
    };

    const getMobileMenuItemClasses = (path: string) => {
        const isCurrentlyActive = isActive(path);

        return cn(
            'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all',
            isCurrentlyActive
                ? 'bg-primary/10 text-primary border-l-4 border-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        );
    };

    const handleMobileMenuClose = () => {
        setIsMobileMenuOpen(false);
    };

    const getCurrentPageTitle = () => {
        if (isActive('/dashboard/account')) return t('overview');
        if (isActive('/profile')) return t('profile');
        if (isActive('/security')) return t('security.title');
        if (isActive('/notifications')) return t('notifications');
        return t('account');
    };

    return (
        <div className="sticky top-0 z-10 rounded-t-2xl border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-zinc-950">
            <div className="mx-auto flex w-full items-stretch justify-between gap-5 px-4 lg:px-6">
                {/* Desktop Navigation */}
                <div className="hidden md:grid">
                    <div className="kt-scrollable-x-auto flex items-stretch">
                        <Menubar className="flex h-auto items-stretch gap-5 space-x-0 rounded-none border-none bg-transparent p-0">
                            {/* Account Overview */}
                            <MenubarMenu>
                                <MenubarTrigger asChild>
                                    <Link
                                        href="/dashboard/account"
                                        className={getNavItemClasses('/dashboard/account')}
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        {t('overview')}
                                    </Link>
                                </MenubarTrigger>
                            </MenubarMenu>

                            {/* Profile */}
                            <MenubarMenu>
                                <MenubarTrigger asChild>
                                    <Link
                                        href="/dashboard/account/profile"
                                        className={getNavItemClasses('/profile')}
                                    >
                                        <User className="h-4 w-4" />
                                        {t('profile')}
                                    </Link>
                                </MenubarTrigger>
                            </MenubarMenu>

                            {/* Security */}
                            <MenubarMenu>
                                <MenubarTrigger className={getNavItemClasses('/security')}>
                                    <Shield className="h-4 w-4" />
                                    {t('security.title')}
                                    <ChevronDown className="ms-auto size-3.5" />
                                </MenubarTrigger>
                                <MenubarContent className="bg-white dark:bg-zinc-950">
                                    <MenubarItem asChild>
                                        <Link
                                            href="/dashboard/account/security/password"
                                            className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                            <Shield className="h-4 w-4" />
                                            {t('security.password')}
                                        </Link>
                                    </MenubarItem>
                                    <MenubarItem asChild>
                                        <Link
                                            href="/dashboard/account/security/two-factor"
                                            className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                            <Smartphone className="h-4 w-4" />
                                            {t('security.twoFactor')}
                                        </Link>
                                    </MenubarItem>
                                    <MenubarSeparator />
                                    <MenubarItem asChild>
                                        <Link
                                            href="/dashboard/account/security/sessions"
                                            className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                            <Settings className="h-4 w-4" />
                                            {t('security.sessions')}
                                        </Link>
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>

                            <MenubarMenu>
                                <MenubarTrigger asChild>
                                    <Link
                                        href="/dashboard/account/notifications"
                                        className={getNavItemClasses('/notifications')}
                                    >
                                        <Bell className="mr-2 h-4 w-4" />
                                        {t('notifications')}
                                    </Link>
                                </MenubarTrigger>
                            </MenubarMenu>
                        </Menubar>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="flex w-full items-center justify-between md:hidden">
                    <div className="flex items-center gap-3">
                        <h1 className="text-foreground text-lg font-semibold">
                            {getCurrentPageTitle()}
                        </h1>
                    </div>

                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">{t('mobile.openMenu')}</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80 sm:w-80">
                            <SheetHeader className="text-left">
                                <SheetTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    {t('mobile.title')}
                                </SheetTitle>
                            </SheetHeader>

                            <ScrollArea className="mt-6 h-[calc(100vh-120px)]">
                                <div className="space-y-1">
                                    {/* Overview */}
                                    <Link
                                        href="/dashboard/account"
                                        className={getMobileMenuItemClasses('/dashboard/account')}
                                        onClick={handleMobileMenuClose}
                                    >
                                        <LayoutDashboard className="h-5 w-5" />
                                        <span>{t('overview')}</span>
                                    </Link>

                                    {/* Profile */}
                                    <Link
                                        href="/dashboard/account/profile"
                                        className={getMobileMenuItemClasses('/profile')}
                                        onClick={handleMobileMenuClose}
                                    >
                                        <User className="h-5 w-5" />
                                        <span>{t('profile')}</span>
                                    </Link>

                                    {/* Security Section */}
                                    <div className="pt-2">
                                        <div className="px-3 py-2">
                                            <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                                                {t('security.title')}
                                            </h3>
                                        </div>
                                        <div className="space-y-1 pl-3">
                                            <Link
                                                href="/dashboard/account/security/password"
                                                className="hover:bg-muted hover:text-foreground text-muted-foreground flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all"
                                                onClick={handleMobileMenuClose}
                                            >
                                                <Shield className="h-4 w-4" />
                                                <span>{t('security.password')}</span>
                                            </Link>
                                            <Link
                                                href="/dashboard/account/security/two-factor"
                                                className="hover:bg-muted hover:text-foreground text-muted-foreground flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all"
                                                onClick={handleMobileMenuClose}
                                            >
                                                <Smartphone className="h-4 w-4" />
                                                <span>{t('security.twoFactorShort')}</span>
                                            </Link>
                                            <Link
                                                href="/dashboard/account/security/sessions"
                                                className="hover:bg-muted hover:text-foreground text-muted-foreground flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all"
                                                onClick={handleMobileMenuClose}
                                            >
                                                <Settings className="h-4 w-4" />
                                                <span>{t('security.sessions')}</span>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Notifications */}
                                    <Link
                                        href="/dashboard/account/notifications"
                                        className={getMobileMenuItemClasses('/notifications')}
                                        onClick={handleMobileMenuClose}
                                    >
                                        <Bell className="h-5 w-5" />
                                        <span>{t('notifications')}</span>
                                    </Link>
                                </div>
                            </ScrollArea>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    );
}
