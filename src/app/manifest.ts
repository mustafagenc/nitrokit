import { getLocale, getTranslations } from 'next-intl/server';
import { getLangDir } from 'rtl-detect';

import { getBaseUrl } from '@/lib';

import type { MetadataRoute } from 'next';
export default async function manifest(): Promise<MetadataRoute.Manifest> {
    const t = await getTranslations();
    const baseUrl = getBaseUrl();
    const locale = await getLocale();
    const direction = getLangDir(locale);

    return {
        name: t('app.name'),
        short_name: t('app.shortName'),
        description: t('app.description'),
        start_url: `${baseUrl}/`,
        display: 'standalone',
        dir: direction,
        lang: locale,
        scope: baseUrl,
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#6FBDFF',
        icons: [
            {
                src: `${baseUrl}/favicon/android-chrome-192x192.png`,
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: `${baseUrl}/favicon/android-chrome-512x512.png`,
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
