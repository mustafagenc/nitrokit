'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { useState } from 'react';
import {
    Home,
    Layers,
    CreditCard,
    MessageCircle,
    ExternalLink,
    Sparkles,
    Menu,
    ChevronDown,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib';
import { COMPONENTS, SERVICES } from '@/constants/menu';

interface NavbarMobileProps {
    className?: string;
}

export function NavbarMobile({ className }: NavbarMobileProps) {
    const t = useTranslations();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [componentsOpen, setComponentsOpen] = useState(false);

    const isActive = (href: string) => pathname === href;

    const handleLinkClick = () => {
        setOpen(false);
        setServicesOpen(false);
        setComponentsOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        'hover:bg-accent/30 m-0 rounded-lg p-0 transition-all duration-200 hover:scale-105 lg:hidden',
                        className
                    )}
                    aria-label="Open navigation menu">
                    <Menu size={20} strokeWidth={1.5} className="size-8" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
                <SheetHeader className="border-b px-4 py-4">
                    <SheetTitle className="flex items-center gap-2 text-left">
                        🚀 {t('app.name')}
                    </SheetTitle>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-80px)]">
                    <div className="space-y-1 p-4">
                        <Link
                            href="/"
                            onClick={handleLinkClick}
                            className={cn(
                                'hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                isActive('/') && 'bg-accent text-accent-foreground'
                            )}>
                            <Home size={18} />
                            {t('navigation.home')}
                        </Link>

                        {/* Services */}
                        <Collapsible open={servicesOpen} onOpenChange={setServicesOpen}>
                            <CollapsibleTrigger className="hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors">
                                <div className="flex items-center gap-3">
                                    <Sparkles size={18} />
                                    {t('navigation.services.title')}
                                </div>
                                <ChevronDown
                                    size={16}
                                    className={cn(
                                        'transition-transform duration-200',
                                        servicesOpen && 'rotate-180'
                                    )}
                                />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-1 pr-2 pl-4">
                                {/* Services Header */}
                                <div className="mt-2 mb-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-3 dark:from-blue-950/50 dark:to-indigo-950/50">
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        {t('navigation.services.description')}
                                    </p>
                                    <Badge variant="secondary" className="mt-2 text-xs">
                                        {t('navigation.services.premium_badge')}
                                    </Badge>
                                </div>

                                {/* Services List */}
                                {SERVICES.map(service => {
                                    const Icon = service.icon;
                                    return (
                                        <Link
                                            key={service.href}
                                            href={service.href}
                                            onClick={handleLinkClick}
                                            className="group hover:bg-accent block rounded-lg p-3 transition-colors">
                                            <div className="flex items-start gap-3">
                                                <Icon
                                                    size={16}
                                                    className={cn('mt-0.5', service.color)}
                                                />
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">
                                                            {t(service.titleKey)}
                                                        </span>
                                                        {service.badgeKey && (
                                                            <Badge
                                                                variant={
                                                                    service.badgeKey.includes('new')
                                                                        ? 'default'
                                                                        : 'secondary'
                                                                }
                                                                className="text-xs">
                                                                {t(service.badgeKey)}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                                                        {t(service.descriptionKey)}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Components */}
                        <Collapsible open={componentsOpen} onOpenChange={setComponentsOpen}>
                            <CollapsibleTrigger className="hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors">
                                <div className="flex items-center gap-3">
                                    <Layers size={18} />
                                    {t('navigation.components.title')}
                                </div>
                                <ChevronDown
                                    size={16}
                                    className={cn(
                                        'transition-transform duration-200',
                                        componentsOpen && 'rotate-180'
                                    )}
                                />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-1 pr-2 pl-4">
                                {/* Components Header */}
                                <div className="mt-2 mb-3 space-y-2">
                                    <h4 className="text-sm font-semibold">
                                        {t('navigation.components.subtitle')}
                                    </h4>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        {t('navigation.components.description')}
                                    </p>
                                </div>

                                {/* Components List */}
                                {COMPONENTS.map(component => (
                                    <Link
                                        key={component.href}
                                        href={component.href}
                                        onClick={handleLinkClick}
                                        className="group hover:bg-accent block rounded-lg p-3 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <span className="text-lg">{component.icon}</span>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">
                                                        {t(component.titleKey)}
                                                    </span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {t(component.categoryKey)}
                                                    </Badge>
                                                </div>
                                                <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                                                    {t(component.descriptionKey)}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}

                                {/* View All Components */}
                                <div className="mt-4 border-t pt-3">
                                    <Link
                                        href="/components"
                                        onClick={handleLinkClick}
                                        className="hover:bg-accent flex items-center justify-between rounded-lg p-3 transition-colors">
                                        <div className="text-primary flex items-center gap-2 text-sm font-medium">
                                            {t('navigation.components.view_all')}
                                            <ExternalLink size={14} />
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            {t('navigation.components.count')}
                                        </Badge>
                                    </Link>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        <Link
                            href="/pricing"
                            onClick={handleLinkClick}
                            className={cn(
                                'hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                isActive('/pricing') && 'bg-accent text-accent-foreground'
                            )}>
                            <CreditCard size={18} />
                            {t('navigation.pricing')}
                        </Link>

                        <Link
                            href="/contact"
                            onClick={handleLinkClick}
                            className={cn(
                                'hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                isActive('/contact') && 'bg-accent text-accent-foreground'
                            )}>
                            <MessageCircle size={18} />
                            {t('navigation.contact')}
                        </Link>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
