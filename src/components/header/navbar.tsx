'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { Home, Layers, CreditCard, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib';
import { COMPONENTS, SERVICES } from '@/constants/menu';

export function Navbar() {
    const t = useTranslations();
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href;

    return (
        <NavigationMenu>
            <NavigationMenuList className="space-x-1">
                {/* Home */}
                <NavigationMenuItem>
                    <Link
                        href="/"
                        className={cn(
                            'group hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50',
                            isActive('/') && 'bg-accent text-accent-foreground'
                        )}
                    >
                        <Home size={16} className="mr-2" />
                        {t('navigation.home')}
                    </Link>
                </NavigationMenuItem>

                {/* Services */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="group">
                        <Sparkles size={16} className="mr-2" />
                        {t('navigation.services.title')}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="grid gap-3 p-6 md:w-[500px] lg:w-[700px] lg:grid-cols-[.75fr_1fr]">
                            {/* Featured Section */}
                            <div className="row-span-3">
                                <div className="flex h-full w-full flex-col justify-end rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 p-6 no-underline outline-none select-none focus:shadow-md dark:from-blue-950 dark:to-indigo-900">
                                    <div className="mt-4 mb-2 text-lg font-bold">
                                        🚀 {t('app.name')}
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-tight">
                                        {t('navigation.services.description')}
                                    </p>
                                    <Badge variant="secondary" className="mt-3 w-fit">
                                        {t('navigation.services.premium_badge')}
                                    </Badge>
                                </div>
                            </div>

                            {/* Services Grid */}
                            <div className="grid gap-3">
                                {SERVICES.map((service) => {
                                    const Icon = service.icon;
                                    return (
                                        <Link
                                            key={service.href}
                                            href={service.href}
                                            className="group hover:bg-accent block space-y-1 rounded-lg p-3 transition-all hover:shadow-sm"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Icon size={16} className={service.color} />
                                                    <span className="text-sm leading-none font-medium">
                                                        {t(service.titleKey)}
                                                    </span>
                                                </div>
                                                {service.badgeKey && (
                                                    <Badge
                                                        variant={
                                                            service.badgeKey.includes('new')
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                        className="text-xs"
                                                    >
                                                        {t(service.badgeKey)}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-muted-foreground line-clamp-2 text-xs leading-snug">
                                                {t(service.descriptionKey)}
                                            </p>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Components */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger>
                        <Layers size={16} className="mr-2" />
                        {t('navigation.components.title')}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="w-[600px] p-4">
                            <div className="mb-4">
                                <h4 className="text-lg font-semibold">
                                    {t('navigation.components.subtitle')}
                                </h4>
                                <p className="text-muted-foreground text-sm">
                                    {t('navigation.components.description')}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {COMPONENTS.map((component) => (
                                    <Link
                                        key={component.href}
                                        href={component.href}
                                        className="group hover:bg-accent block space-y-1 rounded-lg p-3 transition-all hover:shadow-sm"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-lg">{component.icon}</span>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">
                                                        {t(component.titleKey)}
                                                    </span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {t(component.categoryKey)}
                                                    </Badge>
                                                </div>
                                                <p className="text-muted-foreground line-clamp-1 text-xs">
                                                    {t(component.descriptionKey)}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t pt-4">
                                <Link
                                    href="/components"
                                    className="text-primary flex items-center text-sm font-medium hover:underline"
                                >
                                    {t('navigation.components.view_all')}
                                    <ExternalLink size={14} className="ml-1" />
                                </Link>
                                <Badge variant="secondary">
                                    {t('navigation.components.count')}
                                </Badge>
                            </div>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <Link
                        href="/pricing"
                        className={cn(
                            'group hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50',
                            isActive('/pricing') && 'bg-accent text-accent-foreground'
                        )}
                    >
                        <CreditCard size={16} className="mr-2" />
                        {t('navigation.pricing')}
                    </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <Link
                        href="/contact"
                        className={cn(
                            'group hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50',
                            isActive('/contact') && 'bg-accent text-accent-foreground'
                        )}
                    >
                        <MessageCircle size={16} className="mr-2" />
                        {t('navigation.contact')}
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
