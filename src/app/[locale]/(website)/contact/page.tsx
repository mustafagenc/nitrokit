import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { generatePageMetadata } from '@/lib';

import { ContactForm } from './components/contact-form';
import { ContactInfo } from './components/contact-info';
import PageHero from '@/components/shared/page-hero';

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
        <div className="w-full px-4 lg:mx-auto lg:w-7xl lg:p-0">
            <PageHero
                h1="Get in Touch"
                h2="Contact Us"
                p="We'd love to hear from you. Send us a message and we'll respond as
                    soon as possible."
            />
            <div className="mx-auto my-20 grid w-full grid-cols-1 gap-16 lg:grid-cols-2">
                {/* Left: Contact Form */}
                <div className="order-2 lg:order-1">
                    <ContactForm />
                </div>

                {/* Right: Contact Info */}
                <div className="order-1 lg:order-2">
                    <ContactInfo />
                </div>
            </div>
        </div>
    );
}
