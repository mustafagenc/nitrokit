import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import { Button } from '@/components/ui/button';

export default async function Page() {
    const t = await getTranslations();

    return (
        <div className="flex w-full flex-col items-center justify-center gap-3">
            <h2 className="text-center text-xl font-bold">{t('auth.emailVerification.title')}</h2>
            <h3 className="text-center text-xs">{t('auth.emailVerification.description')}</h3>
            <hr className="my-3 h-px w-64 border-0 bg-gray-200 dark:bg-gray-700" />
            <div className="text-sm">
                <Button asChild className="w-full" variant="outline">
                    <Link href={'/signin'}>{t('auth.emailVerification.signIn')}</Link>
                </Button>
            </div>
        </div>
    );
}
