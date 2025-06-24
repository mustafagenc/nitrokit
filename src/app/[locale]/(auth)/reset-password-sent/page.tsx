'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft } from 'lucide-react';

function ResetPasswordSentContent() {
    const t = useTranslations();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    return (
        <div className="flex w-full flex-col items-center justify-center gap-3">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Mail className="h-8 w-8 text-blue-600" />
            </div>

            <h2 className="text-center text-xl font-bold">
                {t('auth.resetPassword.emailSentTitle')}
            </h2>
            <h3 className="text-center text-xs text-gray-600">
                {t('auth.resetPassword.emailSentDescription')}
            </h3>

            {email && (
                <Alert>
                    <AlertDescription>
                        {t('auth.resetPassword.emailSentTo')} <strong>{email}</strong>
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-4 text-sm text-gray-600">
                <p>{t('auth.resetPassword.instructions.check')}</p>
                <p>{t('auth.resetPassword.instructions.click')}</p>
                <p>{t('auth.resetPassword.instructions.expire')}</p>
            </div>

            <Button variant="ghost" asChild className="w-full">
                <Link href="/signin">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('auth.backToSignin')}
                </Link>
            </Button>
        </div>
    );
}

export default function ResetPasswordSentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordSentContent />
        </Suspense>
    );
}
