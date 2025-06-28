import { NextIntlClientProvider } from 'next-intl';

export function MockIntlProvider({ children }: { children: React.ReactNode }) {
    // Basit bir çeviri objesi, gerçek çeviriye gerek yok
    const messages = {
        components: {
            testimonials: {
                title: 'Testimonials',
                subtitle: 'What our users say',
                description: 'Here are some testimonials from our users.',
            },
        },
    };

    return (
        <NextIntlClientProvider locale="en" messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
}
