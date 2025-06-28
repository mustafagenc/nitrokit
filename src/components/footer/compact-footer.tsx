'use client';

import { useTranslations } from 'next-intl';

import { SocialIcons } from '@/components/footer/social-icons';
import DevelopedBy from '@/components/shared/developed-by';
import { CompactThemeSwitcher } from '@/components/theme/compact-theme-switcher';
import { FooterNavbar } from '@/components/footer/navbar';

export const Footer = () => {
    const t = useTranslations();
    return (
        <footer className="my-10 flex w-full flex-col items-center justify-center px-3 lg:px-0">
            <div className="mb-8">
                <FooterNavbar />
            </div>
            <div className="mb-8 rounded-xl border border-gray-200/40 bg-white/40 p-4 backdrop-blur-sm dark:border-gray-700/40 dark:bg-gray-900/40">
                <SocialIcons />
            </div>
            <div className="mt-5 flex w-full flex-col items-center border-gray-100/70 pt-3 text-xs text-gray-500 lg:w-7xl lg:flex-row lg:justify-between dark:border-gray-800/80 dark:text-gray-400">
                <div className="font-medium">
                    {t('footer.copyright', { year: new Date(), name: t('app.shortName') })}
                </div>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 lg:mt-0 lg:flex-row">
                    <div className="rounded-lg border border-gray-200/30 bg-white/30 p-2 backdrop-blur-sm dark:border-gray-700/30 dark:bg-gray-900/30">
                        <DevelopedBy />
                    </div>
                    <CompactThemeSwitcher />
                </div>
            </div>
        </footer>
    );
};
