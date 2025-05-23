import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import SharedLayout from '@/components/layout/shared';
import { generatePageMetadata } from '@/utils/helpers';
import PricingSection from './components/pricing-section';
import { PlanDetail } from '@/types/PricingSectionProps';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('pricing');

    return await generatePageMetadata({
        params: Promise.resolve({
            title: t('title'),
            description: t('description'),
        }),
    });
}

const plansConfiguration: PlanDetail[] = [
    {
        id: 'freelancer',
        monthlyPrice: 19,
        yearlyPrice: 190,
        features: ['5products', 'upto1000subscribers', 'basicanalytics', '48hoursupport'],
    },
    {
        id: 'startup',
        monthlyPrice: 49,
        yearlyPrice: 490,
        features: [
            '25products',
            'upto10000subscribers',
            'advancedanalytics',
            '24hoursupport',
            'marketingautomations',
        ],
        isFeatured: true,
    },
    {
        id: 'enterprise',
        monthlyPrice: 99,
        yearlyPrice: 990,
        features: [
            'unlimitedproducts',
            'unlimitedsubscribers',
            'advancedanalytics',
            '1hoursupport',
            'marketingautomations',
        ],
    },
];

export default async function Page() {
    const t = await getTranslations('pricing');
    return (
        <SharedLayout>
            <div className="m-w-3xl mx-auto text-center leading-12">
                <h2 className="font-semibold text-cyan-500 dark:text-shadow-2xs">{t('title')}</h2>
                <h1 className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-5xl leading-16 font-bold text-transparent dark:text-shadow-2xs">
                    {t('subtitle')}
                </h1>
                <p className="mt-6 text-xl">{t('description')}</p>
            </div>
            <div className="mb-30">
                <PricingSection plansConfig={plansConfiguration} />
            </div>
        </SharedLayout>
    );
}
