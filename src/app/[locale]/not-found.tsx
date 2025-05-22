import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';

import { Link } from '@/lib/i18n/navigation';

export default async function NotFound() {
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace: 'notFound' });
    return (
        <div className="mb-20 grid min-h-96 place-content-center text-center">
            <Image
                src={'/images/404.svg'}
                alt="404"
                width={404}
                height={404}
                className="mt-20 mb-10"
            />
            <h1 className="text-4xl font-bold">{t('title')}</h1>
            <p className="mt-4 text-lg">{t('description')}</p>
            <Link href="/" className="mt-8 text-blue-500 hover:underline">
                {t('returnHome')}
            </Link>
        </div>
    );
}
