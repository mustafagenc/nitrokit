'use client';

import { useTranslations } from 'next-intl';

import { SocialIcons } from '@/components/footer/social-icons';
import PoweredBy from '@/components/shared/powered-by';
import { CompactThemeSwitcher } from '@/components/theme/compact-theme-switcher';

import { FooterNavbar } from './navbar';

export const Footer = () => {
    const t = useTranslations();
    return (
        <footer className="my-10 flex w-full flex-col items-center justify-center px-3 lg:px-0">
            <FooterNavbar />
            <SocialIcons />
            <div className="mt-5 flex w-full flex-col items-center border-gray-100/70 pt-3 text-xs text-gray-500 lg:w-7xl lg:flex-row lg:justify-between dark:border-gray-800/80 dark:text-gray-400">
                <div>{t('footer.copyright', { year: new Date(), name: t('app.shortName') })}</div>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 lg:mt-0 lg:flex-row">
                    <PoweredBy />
                    <CompactThemeSwitcher />
                </div>
            </div>
        </footer>
    );
};
