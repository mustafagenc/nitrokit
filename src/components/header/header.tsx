'use client';

import { SessionProvider } from 'next-auth/react';

import { Navbar } from '@/components/header/navbar';
import { NavbarMobile } from '@/components/header/navbar-mobile';
import Logo from '@/components/shared/logo';
import useStickyNavbar from '@/hooks/useStickyNavbar';
import { CompactLocaleSwitcher } from '@/components/locale/compact-locale-switcher';
import UserMenu from '@/components/dashboard/user-menu';

export const Header = () => {
    const sticky = useStickyNavbar();
    return (
        <header
            className={`top-0 left-0 w-full items-center px-3 ${
                sticky
                    ? 'border-stroke sticky z-[999] bg-white/80 shadow-md backdrop-blur-[5px] dark:bg-black/80'
                    : 'border-0 bg-transparent'
            }`}>
            <div className="mx-auto flex h-20 w-full flex-row items-center bg-transparent lg:w-7xl">
                <div className="text-foreground flex flex-row items-center justify-center gap-2">
                    <Logo />
                    <NavbarMobile />
                </div>
                <div className="hidden grow items-center justify-center lg:flex">
                    <Navbar />
                </div>
                <div className="flex grow flex-row items-center justify-end gap-2 lg:grow-0">
                    <CompactLocaleSwitcher />
                    <SessionProvider>
                        <UserMenu />
                    </SessionProvider>
                </div>
            </div>
        </header>
    );
};
