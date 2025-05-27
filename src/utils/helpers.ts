import { ClassValue, clsx } from 'clsx';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { twMerge } from 'tailwind-merge';

import { localesForMetadata } from '@/constants/locale';
import { env } from '@/lib/env';

/**
 * Retrieves the base URL for the application.
 * It checks for the following environment variables in order:
 * 1. NEXT_PUBLIC_APP_URL
 * 2. VERCEL_PROJECT_PRODUCTION_URL (if VERCEL_ENV is 'production')
 * 3. VERCEL_URL
 * If none of these are set, it defaults to 'http://localhost:3000'.
 * @returns {string} The base URL.
 */
function getBaseUrl(): string {
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL;
    }

    if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    return 'http://localhost:3000';
}

/**
 * Gets the Storybook URL based on environment configuration.
 *
 * @returns The Storybook URL string. Priority order:
 *   1. `NEXT_PUBLIC_APP_URL/storybook` if available
 *   2. `https://{VERCEL_PROJECT_PRODUCTION_URL}/storybook` if in Vercel production
 *   3. `https://{VERCEL_URL}/storybook` if VERCEL_URL is available
 *   4. `http://localhost:6006` as fallback for local development
 */
function getStroybookUrl(): string {
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return `${process.env.NEXT_PUBLIC_APP_URL}/storybook`;
    }

    if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/storybook`;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}/storybook`;
    }

    return 'http://localhost:6006';
}

/**
 * Generates the site metadata for the application.
 * @returns {Promise<Metadata>} The site metadata.
 */
async function generateSiteMetadata(): Promise<Metadata> {
    const t = await getTranslations();
    const baseUrl = getBaseUrl();

    const imageData = {
        images: [{ url: baseUrl + '/api/og' }],
    };

    return {
        metadataBase: new URL(baseUrl),
        generator: 'Nitrokit',
        applicationName: t('metadata.applicationName'),
        referrer: 'origin-when-cross-origin',
        authors: [
            {
                name: 'Nitrokit',
                url: 'https://nitrokit.tr',
            },
        ],
        creator: t('metadata.author'),
        publisher: t('metadata.author'),
        appleWebApp: {
            statusBarStyle: 'black-translucent',
            title: t('metadata.title'),
            capable: true,
            startupImage: [
                {
                    url: `${baseUrl}/images/apple-touch-startup-image.png`,
                    media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)',
                },
            ],
        },
        title: {
            default: t('metadata.title'),
            template: `%s - ${t('metadata.title')}`,
        },
        description: t('metadata.description'),
        alternates: {
            canonical: baseUrl,
            languages: Object.fromEntries(
                localesForMetadata().map(locale => [locale.code, locale.url])
            ),
        },
        icons: {
            icon: `${baseUrl}/favicon.ico`,
        },
        twitter: {
            card: 'summary_large_image',
            title: t('metadata.title'),
            description: t('metadata.description'),
            creator: t('metadata.author'),
            ...imageData,
        },
        openGraph: {
            title: t('metadata.title'),
            description: t('metadata.description'),
            url: baseUrl,
            siteName: t('metadata.title'),
            ...imageData,
        },
        verification: {
            google: env.GOOGLE_SITE_VERIFICATION,
            yandex: env.YANDEX_VERIFICATION,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

/**
 * Generates the page metadata for a specific page.
 * @param params - The parameters containing the title and description.
 * @returns {Promise<Metadata>} The page metadata.
 */
type PageMetaDataProps = Promise<{ title: string; description: string }>;

/**
 * @param params - The parameters containing the title and description.
 * @returns {Promise<Metadata>} The page metadata.
 * @description: This function generates the page metadata for a specific page.
 * It takes the title and description from the params and returns a Metadata object.
 * The metadata includes the title and description for the page.
 * It is used to set the metadata for the page in the Next.js application.
 * @example
 * const params = { title: 'My Page', description: 'This is my page' };
 * const metadata = await generatePageMetadata({ params });
 */
async function generatePageMetadata({ params }: { params: PageMetaDataProps }): Promise<Metadata> {
    const { title, description } = await params;

    const baseMetadata = {
        title: title,
        description: description,
    };

    return {
        ...baseMetadata,
    };
}

/**
 * @param inputs - The class names to be merged.
 * @description: This function merges class names using clsx and tailwind-merge.
 * It allows for conditional class names and handles conflicts between Tailwind CSS classes.
 * @returns {string} The merged class names.
 */
function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Capitalizes the first letter of a string.
 * @param str - The string to be capitalized.
 * @returns {string} The string with the first letter capitalized.
 * @example
 * capitalizeFirstLetter('hello world') // 'Hello world'
 * @example
 * capitalizeFirstLetter('') // ''
 * @example
 * capitalizeFirstLetter('a') // 'A'
 * @example
 * capitalizeFirstLetter('A') // 'A'
 */
function capitalizeFirstLetter(str: string): string {
    return str[0].toUpperCase() + str.slice(1);
}

/**
 * Determines the appropriate CSS class name for a link based on the current path.
 *
 * @param pathName - The current path name (e.g., the active route).
 * @param path - The path to compare against the current path name.
 * @returns A string containing the CSS class names to apply to the link.
 *          If the `pathName` matches the `path`, a set of classes indicating
 *          the active state is returned. Otherwise, a set of default classes
 *          with hover effects is returned.
 */
function getClassForNavbar(pathName: string, path: string): string {
    return pathName === path
        ? 'rounded-md bg-blue-600 dark:bg-gray-900 px-3 py-2 text-sm font-medium text-white dark:text-gray-300'
        : 'rounded-md px-3 py-2 text-sm font-medium text-white-950 hover:bg-gray-100 hover:text-black dark:hover:bg-gray-950 dark:text-gray-300';
}

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export {
    getBaseUrl,
    getStroybookUrl,
    generateSiteMetadata,
    generatePageMetadata,
    cn,
    capitalizeFirstLetter,
    getClassForNavbar,
    delay,
};
export type { PageMetaDataProps };
