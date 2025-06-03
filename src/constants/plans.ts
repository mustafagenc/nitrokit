import type { Plan } from '@/types/pricing';

export const PLANS: Plan[] = [
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
        id: 'pro',
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
