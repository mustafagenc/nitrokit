'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import {
    Home as HomeIcon,
    Info as InfoIcon,
    CreditCard as CreditCardIcon,
    MessageCircle as MessageCircleIcon,
    LucideIcon,
} from 'lucide-react';

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib';

interface MenuItem {
    href: string;
    icon: LucideIcon;
    label: string;
}

export function Navbar() {
    const t = useTranslations();
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href;
    const menuItemClass =
        'group hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50';
    const menuItemActiveClass = 'bg-accent text-accent-foreground';

    const menuItem: MenuItem[] = [
        {
            href: '/',
            icon: HomeIcon,
            label: t('navigation.home'),
        },
        {
            href: '/about/',
            icon: InfoIcon,
            label: t('navigation.about'),
        },
        {
            href: '/pricing/',
            icon: CreditCardIcon,
            label: t('navigation.pricing'),
        },
        {
            href: '/contact/',
            icon: MessageCircleIcon,
            label: t('navigation.contact'),
        },
    ];

    return (
        <NavigationMenu>
            <NavigationMenuList className="space-x-1">
                {menuItem.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavigationMenuItem key={item.href}>
                            <Link
                                href={item.href}
                                className={cn(
                                    menuItemClass,
                                    isActive(item.href) && menuItemActiveClass
                                )}
                            >
                                <Icon size={16} className="mr-2" />
                                {item.label}
                            </Link>
                        </NavigationMenuItem>
                    );
                })}
            </NavigationMenuList>
        </NavigationMenu>
    );
}
