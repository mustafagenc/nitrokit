import { getBaseUrl } from '@/utils/helpers';

const DEFAULT_LANGUAGE = 'en';

/**
 * List of locales supported by the application.
 * This is used to determine the language of the application.
 * The default locale is Turkish (tr).
 * The English locale is also supported (en).
 * The application will use the browser's language settings to determine the default locale.
 * @returns {string[]} An array of supported locales.
 */
const locales = ['tr', 'en', 'uz', 'ar', 'ru', 'az', 'de', 'fr', 'es', 'it', 'ur'];

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
    { id: 'tr', name: 'Türkçe', flag: '/flags/tr.svg' },
    { id: 'en', name: 'English', flag: '/flags/us.svg' },
    { id: 'uz', name: "O'zbekcha", flag: '/flags/uz.svg' },
    { id: 'ar', name: 'العربية', flag: '/flags/sa.svg' },
    { id: 'ru', name: 'Русский', flag: '/flags/ru.svg' },
    { id: 'az', name: 'Azərbaycanca', flag: '/flags/az.svg' },
    { id: 'de', name: 'Deutsch', flag: '/flags/de.svg' },
    { id: 'fr', name: 'Français', flag: '/flags/fr.svg' },
    { id: 'es', name: 'Español', flag: '/flags/es.svg' },
    { id: 'it', name: 'Italiano', flag: '/flags/it.svg' },
    { id: 'ur', name: 'اردو', flag: '/flags/pk.svg' },
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

export { locales, localesWithFlag, localesForMetadata, DEFAULT_LANGUAGE };
