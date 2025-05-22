'use client';

import { useTranslations } from 'next-intl';

import { NAV_LINKS } from '@/constants/site';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { NavbarProps } from '@/types/NavbarProps';
import { cn, getClassForNavbar } from '@/utils/helpers';

export const NavbarSimple = ({ className }: NavbarProps) => {
    const t = useTranslations();
    const pathName = usePathname();

    return (
        <nav className={cn('mx-10 items-center justify-center gap-5', className)}>
            {NAV_LINKS.filter(link => link.path !== '/').map((link, index) => (
                <Link
                    key={index}
                    href={link.path}
                    className={getClassForNavbar(pathName, link.path)}>
                    {t(link.name)}
                </Link>
            ))}
        </nav>
    );
};
