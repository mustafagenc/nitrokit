import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import SignupForm from './components/signup-form';
import { SignWithButtonsCard } from '../components/sign-with-buttons-card';

export default async function Page() {
    const t = await getTranslations();

    return (
        <div className="flex w-full flex-col items-center justify-center gap-3">
            <h2 className="text-center text-xl font-bold">
                {t('signup.title', { appName: t('app.name') })}
            </h2>
            <SignWithButtonsCard />
            <SignupForm />
            <div className="text-sm">
                {t.rich('signup.alreadyHaveAnAccount', {
                    link: (children) => (
                        <Link
                            href={'/signin'}
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
