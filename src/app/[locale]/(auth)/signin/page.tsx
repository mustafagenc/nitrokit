import { getTranslations } from 'next-intl/server';

import { SignWithButton } from '@/components/auth/sign-with-button';
import { Link } from '@/lib/i18n/navigation';

import SigninForm from './components/signin-form';

export default async function Page() {
    const t = await getTranslations();

    return (
        <div className="flex w-full flex-col items-center justify-center gap-3">
            <h2 className="text-center text-xl font-bold">
                {t('signin.title', { appName: t('app.name') })}
            </h2>
            <h3 className="text-center text-xs">{t('signin.description')}</h3>
            <div className="mt-3 grid w-full grid-cols-3 gap-3 text-center">
                <SignWithButton provider="google" onlyIcon={true} />
                <SignWithButton provider="github" onlyIcon={true} />
                <SignWithButton provider="facebook" onlyIcon={true} />
            </div>
            <hr className="my-3 h-px w-64 border-0 bg-gray-200 dark:bg-gray-700" />
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
