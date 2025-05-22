import { getTranslations } from 'next-intl/server';

import BackButton from '@/components/shared/back-button';

import ResetPasswordForm from './components/reset-form';

export default async function Page() {
    const t = await getTranslations();
    return (
        <div className="flex w-full flex-col items-center justify-center gap-3">
            <h2 className="text-xl font-bold">{t('resetPassword.title')}</h2>
            <h3 className="mb-3 text-center text-xs">{t('resetPassword.description')}</h3>
            <ResetPasswordForm />
            <div className="text-sm">
                <BackButton href={'/signin'} />
            </div>
        </div>
    );
}
