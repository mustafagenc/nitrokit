import { defineRouting } from 'next-intl/routing';

import { DEFAULT_LANGUAGE, locales } from '@/constants/locale';

export const routing = defineRouting({
    locales: locales,
    defaultLocale: DEFAULT_LANGUAGE,
});
