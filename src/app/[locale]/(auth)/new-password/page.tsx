'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import NewPasswordForm from './components/new-password-form';

function NewPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const t = useTranslations();

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 text-center">
                <h2 className="text-xl font-bold text-red-600">
                    {t('auth.resetPassword.invalidResetLink.title')}
                </h2>
                <p className="text-gray-600">
                    {t('auth.resetPassword.invalidResetLink.description')}
                </p>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col items-center justify-center gap-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold">{t('auth.resetPassword.newPasswordTitle')}</h2>
                <p className="mt-2 text-gray-600">
                    {t('auth.resetPassword.newPasswordDescription')}
                </p>
            </div>
            <NewPasswordForm token={token} />
        </div>
    );
}

export default function NewPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewPasswordContent />
        </Suspense>
    );
}
