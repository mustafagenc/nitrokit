import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import SharedLayout from '@/components/layout/shared';
import { generatePageMetadata } from '@/utils/helpers';

import { ContactForm } from './components/contact-form';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('contact');

    return await generatePageMetadata({
        params: Promise.resolve({
            title: t('title'),
            description: t('description'),
        }),
    });
}

export default async function Page() {
    return (
        <SharedLayout className="mb-10 flex flex-row justify-start gap-6 p-6">
            <ContactForm />
        </SharedLayout>
    );
}
