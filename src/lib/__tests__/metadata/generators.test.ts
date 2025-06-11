import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateSiteMetadata, generatePageMetadata } from '../../metadata/generators';

vi.mock('next-intl/server', () => ({
    getTranslations: vi.fn(),
}));

vi.mock('@/constants/locale', () => ({
    localesForMetadata: vi.fn(),
}));

vi.mock('@/lib/env', () => ({
    env: {
        GOOGLE_SITE_VERIFICATION: 'mock-google-verification',
        YANDEX_VERIFICATION: 'mock-yandex-verification',
    },
}));

vi.mock('@/lib', () => ({
    getBaseUrl: vi.fn(),
}));

import { getTranslations } from 'next-intl/server';
import { localesForMetadata } from '@/constants/locale';
import { getBaseUrl } from '@/lib';

const mockGetTranslations = vi.mocked(getTranslations);
const mockLocalesForMetadata = vi.mocked(localesForMetadata);
const mockGetBaseUrl = vi.mocked(getBaseUrl);

describe('Metadata Generators', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockGetBaseUrl.mockReturnValue('https://example.com');
        mockLocalesForMetadata.mockReturnValue([
            { code: 'en', url: 'https://example.com/en' },
            { code: 'tr', url: 'https://example.com/tr' },
        ]);

        mockGetTranslations.mockResolvedValue(
            Object.assign(
                (key: string, ..._args: any[]) => {
                    const translations: Record<string, string> = {
                        'metadata.applicationName': 'Test App',
                        'metadata.title': 'Test Title',
                        'metadata.description': 'Test Description',
                        'metadata.author': 'Test Author',
                    };
                    return translations[key] || key;
                },
                {
                    rich: vi.fn(),
                    markup: vi.fn(),
                    raw: vi.fn(),
                    has: vi.fn(),
                }
            )
        );
    });

    describe('generateSiteMetadata', () => {
        it('should generate complete site metadata', async () => {
            const metadata = await generateSiteMetadata();

            expect(metadata).toEqual({
                metadataBase: new URL('https://example.com'),
                generator: 'Nitrokit',
                applicationName: 'Test App',
                referrer: 'origin-when-cross-origin',
                authors: [
                    {
                        name: 'Nitrokit',
                        url: 'https://nitrokit.tr',
                    },
                ],
                creator: 'Test Author',
                publisher: 'Test Author',
                appleWebApp: {
                    statusBarStyle: 'black-translucent',
                    title: 'Test Title',
                    capable: true,
                    startupImage: [
                        {
                            url: 'https://example.com/images/apple-touch-startup-image.png',
                            media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)',
                        },
                    ],
                },
                title: {
                    default: 'Test Title',
                    template: '%s - Test Title',
                },
                description: 'Test Description',
                alternates: {
                    canonical: 'https://example.com',
                    languages: {
                        en: 'https://example.com/en',
                        tr: 'https://example.com/tr',
                    },
                },
                icons: {
                    icon: 'https://example.com/favicon.ico',
                },
                twitter: {
                    card: 'summary_large_image',
                    title: 'Test Title',
                    description: 'Test Description',
                    creator: 'Test Author',
                    images: [{ url: 'https://example.com/api/og' }],
                },
                openGraph: {
                    title: 'Test Title',
                    description: 'Test Description',
                    url: 'https://example.com',
                    siteName: 'Test Title',
                    images: [{ url: 'https://example.com/api/og' }],
                },
                verification: {
                    google: 'mock-google-verification',
                    yandex: 'mock-yandex-verification',
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
            });
        });

        it('should call all required dependencies', async () => {
            await generateSiteMetadata();

            expect(mockGetTranslations).toHaveBeenCalledTimes(1);
            expect(mockGetBaseUrl).toHaveBeenCalledTimes(1);
            expect(mockLocalesForMetadata).toHaveBeenCalledTimes(1);
        });

        it('should handle different base URLs', async () => {
            mockGetBaseUrl.mockReturnValue('https://different-domain.com');

            const metadata = await generateSiteMetadata();

            expect(metadata.metadataBase).toEqual(new URL('https://different-domain.com'));
            expect(metadata.alternates?.canonical).toBe('https://different-domain.com');
            expect(metadata.openGraph?.url).toBe('https://different-domain.com');
        });

        it('should handle empty locales', async () => {
            mockLocalesForMetadata.mockReturnValue([]);

            const metadata = await generateSiteMetadata();

            expect(metadata.alternates?.languages).toEqual({});
        });
    });

    describe('generatePageMetadata', () => {
        it('should generate page metadata with provided title and description', async () => {
            const params = Promise.resolve({
                title: 'Custom Page Title',
                description: 'Custom page description',
            });

            const metadata = await generatePageMetadata({ params });

            expect(metadata).toEqual({
                title: 'Custom Page Title',
                description: 'Custom page description',
            });
        });

        it('should handle async params correctly', async () => {
            const params = new Promise<{ title: string; description: string }>((resolve) => {
                setTimeout(() => {
                    resolve({
                        title: 'Async Title',
                        description: 'Async Description',
                    });
                }, 10);
            });

            const metadata = await generatePageMetadata({ params });

            expect(metadata.title).toBe('Async Title');
            expect(metadata.description).toBe('Async Description');
        });
    });
});
