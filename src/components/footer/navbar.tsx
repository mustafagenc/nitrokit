'use client';

import { useTranslations } from 'next-intl';

import { NAV_LINKS } from '@/constants/menu';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib';

export interface NavbarProps {
    className?: string;
}

export const FooterNavbar = ({ className }: NavbarProps) => {
    const t = useTranslations();

    return (
        <div className={cn('flex flex-wrap items-center justify-center gap-5', className)}>
            {NAV_LINKS.map((link, index) => (
                <Link
                    key={index}
                    href={link.path}
                    className="text-sm text-gray-500 no-underline underline-offset-2 hover:text-blue-600 hover:underline dark:text-gray-400 dark:hover:text-white"
                >
                    {t(link.name)}
                </Link>
            ))}
        </div>
    );
};
