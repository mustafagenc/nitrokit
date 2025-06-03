'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function Page() {
    const t = useTranslations();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [isResending, setIsResending] = useState(false);
    const [resendCount, setResendCount] = useState(0);
    const MAX_RESEND_COUNT = 3;

    const handleResendEmail = async () => {
        if (!email || resendCount >= MAX_RESEND_COUNT) return;

        setIsResending(true);
        try {
            const response = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setResendCount(prev => prev + 1);
                toast.success('Verification email sent!', {
                    description: `A new verification email has been sent to ${email}`,
                });
            } else {
                const errorData = await response.json();
                toast.error('Failed to send email', {
                    description: errorData.error || 'Please try again later',
                });
            }
        } catch (error) {
            console.error('Failed to resend email:', error);
            toast.error('Failed to send email', {
                description: 'Please check your connection and try again',
            });
        } finally {
            setIsResending(false);
        }
    };

    const isResendDisabled = !email || isResending || resendCount >= MAX_RESEND_COUNT;
    const remainingResends = MAX_RESEND_COUNT - resendCount;

    return (
        <div className="flex w-full flex-col items-center justify-center gap-3">
            <h2 className="text-center text-xl font-bold">{t('auth.verifyEmail.title')}</h2>
            <h3 className="text-center text-xs">{t('auth.verifyEmail.description')}</h3>
            {email && (
                <Alert>
                    <AlertDescription>
                        {t('auth.verifyEmail.sentTo')} <strong>{email}</strong>
                    </AlertDescription>
                </Alert>
            )}
            <div className="space-y-4 text-sm text-gray-600">
                <p>{t('auth.verifyEmail.instructions.check')}</p>
                <p>{t('auth.verifyEmail.instructions.click')}</p>
                <p>{t('auth.verifyEmail.instructions.spam')}</p>
            </div>

            <div className="space-y-3 text-sm">
                <Button
                    onClick={handleResendEmail}
                    variant="outline"
                    className="w-full"
                    disabled={isResendDisabled}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
                    {isResending
                        ? 'Sending...'
                        : resendCount >= MAX_RESEND_COUNT
                          ? 'Maximum resends reached'
                          : t('auth.verifyEmail.resend')}
                </Button>

                {/* Resend counter */}
                {resendCount > 0 && resendCount < MAX_RESEND_COUNT && (
                    <p className="text-center text-xs text-gray-500">
                        {remainingResends} resend{remainingResends !== 1 ? 's' : ''} remaining
                    </p>
                )}

                {resendCount >= MAX_RESEND_COUNT && (
                    <Alert className="border-orange-200 bg-orange-50">
                        <AlertDescription className="text-xs text-orange-700">
                            Maximum resend limit reached. If you still don&apos;t receive the email,
                            please contact support or try again later.
                        </AlertDescription>
                    </Alert>
                )}

                <Button variant="ghost" asChild className="w-full">
                    <Link href="/signin">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('auth.verifyEmail.backToSignin')}
                    </Link>
                </Button>
            </div>
        </div>
    );
}
