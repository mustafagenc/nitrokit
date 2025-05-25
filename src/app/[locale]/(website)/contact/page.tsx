import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import SharedLayout from '@/components/layout/shared';
import { generatePageMetadata } from '@/utils/helpers';

import { ContactForm } from './components/contact-form';
import { ContactInfo } from './components/contact-info';

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
        <SharedLayout>
            <div className="mx-auto max-w-3xl text-center leading-22">
                <h2 className="font-semibold text-cyan-500 dark:text-shadow-2xs">Contact Us</h2>
                <h1 className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-5xl leading-18 font-bold text-transparent dark:text-shadow-2xs">
                    Get in Touch
                </h1>
                <p className="mt-10 text-xl">
                    We&apos;d love to hear from you. Send us a message and we&apos;ll respond as
                    soon as possible.
                </p>
            </div>
            <div className="mx-auto my-20 grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-2">
                {/* Left: Contact Form */}
                <div className="order-2 lg:order-1">
                    <ContactForm />
                </div>

                {/* Right: Contact Info */}
                <div className="order-1 lg:order-2">
                    <ContactInfo />
                </div>
            </div>
        </SharedLayout>
    );
}
