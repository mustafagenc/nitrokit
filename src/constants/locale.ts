import { getBaseUrl } from '@/lib';

const DEFAULT_LANGUAGE = 'en';
const DEFAULT_CURRENCY = 'USD';

/**
 * List of locales supported by the application.
 * This is used to determine the language of the application.
 * The default locale is Turkish (tr).
 * The English locale is also supported (en).
 * The application will use the browser's language settings to determine the default locale.
 * @returns {string[]} An array of supported locales.
 */
const locales = [
    'ar',
    'az',
    'bs',
    'de',
    'en',
    'es',
    'fr',
    'hi',
    'id',
    'it',
    'kk',
    'ko',
    'ky',
    'ru',
    'tk',
    'tr',
    'ur',
    'uz',
    'zh',
];

/**
 * List of locales with their respective flags.
 * This is used to display the language selection in the UI.
 * The flag URLs are relative to the public directory.
 * For example, the flag for Turkish is located at /public/flags/tr.svg.
 * The flag for English is located at /public/flags/us.svg.
 * https://github.com/lipis/flag-icons
 * @returns {Array<{ id: string, name: string, flag: string }>}
 */
const localesWithFlag = [
    { id: 'ar', name: 'العربية', flag: '/flags/sa.svg' },
    { id: 'az', name: 'Azərbaycanca', flag: '/flags/az.svg' },
    { id: 'bs', name: 'Bosanski', flag: '/flags/ba.svg' },
    { id: 'de', name: 'Deutsch', flag: '/flags/de.svg' },
    { id: 'en', name: 'English', flag: '/flags/us.svg' },
    { id: 'es', name: 'Español', flag: '/flags/es.svg' },
    { id: 'fr', name: 'Français', flag: '/flags/fr.svg' },
    { id: 'hi', name: 'हिन्दी', flag: '/flags/in.svg' },
    { id: 'id', name: 'Indonesia', flag: '/flags/id.svg' },
    { id: 'it', name: 'Italiano', flag: '/flags/it.svg' },
    { id: 'kk', name: 'Қазақша', flag: '/flags/kz.svg' },
    { id: 'ko', name: '한국어', flag: '/flags/kr.svg' },
    { id: 'ky', name: 'Кыргызча', flag: '/flags/kg.svg' },
    { id: 'ru', name: 'Русский', flag: '/flags/ru.svg' },
    { id: 'tk', name: 'Türkmençe', flag: '/flags/tm.svg' },
    { id: 'tr', name: 'Türkçe', flag: '/flags/tr.svg' },
    { id: 'ur', name: 'اردو', flag: '/flags/pk.svg' },
    { id: 'uz', name: "O'zbekcha", flag: '/flags/uz.svg' },
    { id: 'zh', name: '中文', flag: '/flags/cn.svg' },
];

/**
 * This function returns the locales for metadata.
 * This is used to generate the metadata for the application.
 * The metadata is used to determine the language of the application.
 * The metadata is used in the middleware to redirect to the correct locale.
 * @returns {Array<{ [key: string]: string }>} An array of objects with the locale and its URL.
 */
function localesForMetadata(): { [key: string]: string }[] {
    const baseUrl = getBaseUrl();
    return locales.map(locale => {
        return {
            [locale]: `${baseUrl}/${locale}`,
        };
    });
}

export { locales, localesWithFlag, localesForMetadata, DEFAULT_LANGUAGE, DEFAULT_CURRENCY };
