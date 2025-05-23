import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import SharedLayout from '@/components/layout/shared';
import { generatePageMetadata } from '@/utils/helpers';
import PricingSection from './components/pricing-section';
import EnterpriseBanner from './components/enterprise-banner';
import { PLANS } from '@/constants/plans';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('pricing');

    return await generatePageMetadata({
        params: Promise.resolve({
            title: t('title'),
            description: t('description'),
        }),
    });
}

export default async function Page() {
    const t = await getTranslations('pricing');
    return (
        <SharedLayout>
            <div className="mx-auto max-w-3xl text-center leading-22">
                <h2 className="font-semibold text-cyan-500 dark:text-shadow-2xs">{t('title')}</h2>
                <h1 className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-5xl leading-18 font-bold text-transparent dark:text-shadow-2xs">
                    {t('subtitle')}
                </h1>
                <p className="mt-10 text-xl">{t('description')}</p>
            </div>
            <div className="mb-20">
                <PricingSection plansConfig={PLANS} />
            </div>
            <div className="mb-30">
                <EnterpriseBanner />
            </div>
        </SharedLayout>
    );
}
