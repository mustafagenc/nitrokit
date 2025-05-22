import { ChevronRight, Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { NAV_LINKS } from '@/constants/site';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { NavbarProps } from '@/types/NavbarProps';
import { cn } from '@/utils/helpers';
import Logo from '@/components/shared/logo';

export const NavbarMobile = ({ className }: NavbarProps) => {
    const [open, setOpen] = useState(false);
    const pathName = usePathname();
    const t = useTranslations();

    function getClassForMobileNavbar(path: string): string {
        return pathName === path ? 'underline' : 'hover:underline';
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" className={cn('cursor-pointer lg:hidden', className)}>
                    <Menu className="size-8 cursor-pointer font-bold" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
                <div className="mt-1 flex flex-col p-6">
                    <Logo onlyIcon={false} size={60} forceText={true} />
                    <h2 className="mt-10 mb-3 text-xl font-bold text-gray-900 dark:text-gray-300">
                        {t('navigation.title')}
                    </h2>
                    <ul className="list-inside">
                        {NAV_LINKS.map((link, index) => (
                            <li key={index} className="mb-2">
                                <Link
                                    href={link.path}
                                    className={cn(
                                        'flex h-7 flex-row underline-offset-2',
                                        getClassForMobileNavbar(link.path)
                                    )}
                                    onClick={() => setOpen(false)}>
                                    <ChevronRight /> {t(link.name)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </SheetContent>
        </Sheet>
    );
};
