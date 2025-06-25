'use client';

import { usePathname, Link } from '@/i18n/navigation';
import { useState } from 'react';
import { LayoutDashboard, User, Menu, UsersRound, Tickets } from 'lucide-react';
import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib';

export function AdminNavigation() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === '/dashboard/admin') {
            return pathname === '/dashboard/admin/';
        }
        if (path === '/tickets') {
            return pathname.includes('/tickets');
        }
        if (path === '/users') {
            return pathname.includes('/users');
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
        if (isActive('/dashboard/admin')) return 'Admin Overview';
        if (isActive('/dashboard/admin/tickets')) 'Tickets';
        if (isActive('/dashboard/admin/users')) 'Users';
        return 'Admin';
    };

    return (
        <div className="sticky top-0 z-10 rounded-t-2xl border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-zinc-950">
            <div className="mx-auto flex w-full items-stretch justify-between gap-5 px-4 lg:px-6">
                <div className="hidden md:grid">
                    <div className="kt-scrollable-x-auto flex items-stretch">
                        <Menubar className="flex h-auto items-stretch gap-5 space-x-0 rounded-none border-none bg-transparent p-0">
                            <MenubarMenu>
                                <MenubarTrigger asChild>
                                    <Link
                                        href="/dashboard/admin"
                                        className={getNavItemClasses('/dashboard/admin')}
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        Overview
                                    </Link>
                                </MenubarTrigger>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger asChild>
                                    <Link
                                        href="/dashboard/admin/tickets"
                                        className={getNavItemClasses('/tickets')}
                                    >
                                        <Tickets className="h-4 w-4" />
                                        Tickets
                                    </Link>
                                </MenubarTrigger>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger asChild>
                                    <Link
                                        href="/dashboard/admin/users"
                                        className={getNavItemClasses('/users')}
                                    >
                                        <UsersRound className="mr-2 h-4 w-4" />
                                        Users
                                    </Link>
                                </MenubarTrigger>
                            </MenubarMenu>
                        </Menubar>
                    </div>
                </div>
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
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80 sm:w-80">
                            <SheetHeader className="text-left">
                                <SheetTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Admin Dashboard
                                </SheetTitle>
                            </SheetHeader>
                            <ScrollArea className="mt-6 h-[calc(100vh-120px)]">
                                <div className="space-y-1">
                                    <Link
                                        href="/dashboard/admin/"
                                        className={getMobileMenuItemClasses('/dashboard/admin/')}
                                        onClick={handleMobileMenuClose}
                                    >
                                        <LayoutDashboard className="h-5 w-5" />
                                        <span>Overview</span>
                                    </Link>
                                    <Link
                                        href="/dashboard/admin/tickets"
                                        className={getMobileMenuItemClasses('/tickets')}
                                        onClick={handleMobileMenuClose}
                                    >
                                        <Tickets className="h-5 w-5" />
                                        <span>Tickets</span>
                                    </Link>
                                    <Link
                                        href="/dashboard/admin/users"
                                        className={getMobileMenuItemClasses('/users')}
                                        onClick={handleMobileMenuClose}
                                    >
                                        <UsersRound className="h-5 w-5" />
                                        <span>Users</span>
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
