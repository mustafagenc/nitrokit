'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function EnterpriseBanner() {
    const t = useTranslations();
    return (
        <div className="mx-auto flex max-w-4xl flex-row items-center justify-between rounded-2xl border-1 p-6 shadow-xs">
            <div className="text-4xl font-bold">{t('pricing.enterprise.title')}</div>
            <div>{t('pricing.enterprise.description')}</div>
            <Link
                href={'/contact'}
                className="rounded-lg border-1 border-blue-400 px-6 py-1 text-lg font-medium text-blue-400 hover:bg-gray-50 dark:border-blue-400 dark:hover:bg-gray-950">
                {t('common.contactUs')}
            </Link>
        </div>
    );
}
