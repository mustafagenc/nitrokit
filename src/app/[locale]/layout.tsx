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
import { generateSiteMetadata } from '@/utils/helpers';

import notFound from './not-found';

import type { Viewport } from 'next';
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
    params: Promise<{ locale: string }>;
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
            className="scroll-smooth">
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${lexend.variable} font-[family-name:var(--font-lexend)] antialiased`}>
                <NextIntlClientProvider>
                    <NextThemeProvider>
                        <AnalyticsProvider>{children}</AnalyticsProvider>
                        <Toaster />
                    </NextThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
