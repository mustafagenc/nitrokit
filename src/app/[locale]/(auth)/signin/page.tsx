import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import SigninForm from './components/signin-form';
import { SignWithButtonsCard } from '../components/sign-with-buttons-card';

export default async function Page() {
    const t = await getTranslations();

    return (
        <div className="flex w-full flex-col items-center justify-center gap-3">
            <h2 className="text-center text-xl font-bold">
                {t('signin.title', { appName: t('app.name') })}
            </h2>
            <h3 className="text-center text-xs">{t('signin.description')}</h3>
            <SignWithButtonsCard />
            <SigninForm />
            <div className="text-sm">
                {t.rich('signin.dontHaveAnAccount', {
                    link: (children) => (
                        <Link
                            href={'/signup'}
                            className="text-blue-600 hover:text-blue-700 hover:underline hover:underline-offset-2"
                        >
                            {children}
                        </Link>
                    ),
                })}
            </div>
        </div>
    );
}
