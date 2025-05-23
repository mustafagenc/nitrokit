'use client';

import { useState } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { CheckIcon } from '@/components/icons/check';
import { PricingSectionProps } from '@/types/PricingSectionProps';
import BillingCycleToggle from './billging-cycle-toggle';
import { DEFAULT_CURRENCY } from '@/constants/locale';

export default function PricingSection({ plansConfig }: PricingSectionProps) {
    const t = useTranslations();
    const [billingCycle, setBillingCycle] = useState('monthly');
    const format = useFormatter();
    return (
        <div>
            <div className="mt-10 flex items-center justify-center">
                <BillingCycleToggle
                    billingCycle={billingCycle}
                    onBillingCycleChange={setBillingCycle}
                />
            </div>

            {/* ${plansConfig.length} */}
            <div className={`mt-12 grid grid-cols-1 items-end gap-0 md:grid-cols-2 lg:grid-cols-3`}>
                {plansConfig.map(plan => {
                    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
                    const priceSuffixKey =
                        billingCycle === 'monthly' ? 'pricePerMonth' : 'pricePerYear';

                    const heightClass = plan.isFeatured
                        ? 'min-h-[36rem] lg:scale-[1.03]'
                        : 'min-h-[32rem]';
                    const titleColor = plan.isFeatured
                        ? 'text-blue-500 dark:text-cyan-500'
                        : 'text-neutral-800 dark:text-neutral-200';
                    const titleSize = plan.isFeatured ? 'text-2xl' : 'text-xl';

                    const cardWrapperClasses = 'flex flex-col';
                    const cardClasses =
                        'flex flex-col justify-between rounded-lg border-1 bg-white p-6 shadow-lg dark:bg-black';

                    return (
                        <div key={plan.id} className={cardWrapperClasses}>
                            <div className={`${cardClasses} ${heightClass}`}>
                                <h3
                                    className={`${titleSize} font-medium text-shadow-xs ${titleColor}`}>
                                    {t(`pricing.${plan.id}.title`)}
                                </h3>
                                <p className="mt-6 text-base/7 text-neutral-600 dark:text-neutral-300">
                                    {t(`pricing.${plan.id}.description`)}
                                </p>
                                <p className="mt-4 flex items-baseline gap-0.5">
                                    <span className={'text-5xl font-semibold tracking-tight'}>
                                        {format.number(price, {
                                            style: 'currency',
                                            currency: DEFAULT_CURRENCY,
                                            maximumFractionDigits: 0,
                                        })}
                                    </span>
                                    <span className="text-base text-gray-500">
                                        /{t(`pricing.${priceSuffixKey}`)}
                                    </span>
                                </p>
                                <ul className="mt-8 space-y-3 text-sm/6 sm:mt-10">
                                    {plan.features.map((feature, index) => {
                                        return (
                                            <li key={index} className="flex gap-x-3">
                                                <CheckIcon
                                                    aria-hidden="true"
                                                    className="h-6 w-5 flex-none text-blue-600"
                                                />
                                                {t(`pricing.features.${feature}`)}
                                            </li>
                                        );
                                    })}
                                </ul>
                                <Button
                                    variant={plan.isFeatured ? 'default' : 'outline'}
                                    size={'rlg'}
                                    className={`mt-10 w-full ${plan.isFeatured ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:bg-gradient-to-l' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800/50'}`}>
                                    {t('pricing.purchasePlan')}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
