import type { Metadata } from 'next';
import '@radix-ui/themes/styles.css';
import '@/styles/globals.css';

import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getLangDir } from 'rtl-detect';
import { Toaster } from 'sonner';

import { geistMono, geistSans, lexend } from '@/constants/fonts';
import { routing } from '@/lib/i18n/routing';
import AnalyticsProvider from '@/providers/analytics-provider';
import NextThemeProvider from '@/providers/next-theme-provider';
import { generateSiteMetadata } from '@/lib';

import notFound from './not-found';

import type { Viewport } from 'next';
import { AvatarProvider } from '@/contexts/avatar-context';
import { CookieConsent } from '@/components/shared/cookie-consent';
import { SessionProvider } from 'next-auth/react';
import { ServiceWorkerRegister } from '@/components/shared/service-worker-register';

export async function generateMetadata(): Promise<Metadata> {
    return await generateSiteMetadata();
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
}>) {
    const { locale } = await params;
    const direction = getLangDir(locale);

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <html
            lang={locale}
            dir={direction}
            suppressHydrationWarning={true}
            className="scroll-smooth"
        >
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${lexend.variable} font-[family-name:var(--font-lexend)] antialiased`}
            >
                <SessionProvider
                    refetchInterval={0}
                    refetchOnWindowFocus={true}
                    refetchWhenOffline={false}
                >
                    <NextIntlClientProvider>
                        <NextThemeProvider>
                            <AnalyticsProvider>
                                <AvatarProvider>
                                    <ServiceWorkerRegister />
                                    {children}
                                    <CookieConsent />
                                </AvatarProvider>
                            </AnalyticsProvider>
                            <Toaster />
                        </NextThemeProvider>
                    </NextIntlClientProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
