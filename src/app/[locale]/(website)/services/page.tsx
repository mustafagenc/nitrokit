import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import SharedLayout from '@/components/layout/shared';
import { generatePageMetadata } from '@/lib';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('services');
    return await generatePageMetadata({
        params: Promise.resolve({
            title: t('title'),
            description: t('description'),
        }),
    });
}

export default async function Page() {
    const t = await getTranslations('services');
    return (
        <SharedLayout>
            {Array.from(Array(400).keys()).map((i) => (
                <p key={i} className="text-md mb-6">
                    {t('title')}
                </p>
            ))}
        </SharedLayout>
    );
}
