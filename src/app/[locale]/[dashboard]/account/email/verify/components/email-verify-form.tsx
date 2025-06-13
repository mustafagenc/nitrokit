'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mail, Send, Clock, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface User {
    id: string;
    email: string;
    emailVerified: Date | null;
    name: string | null;
}

interface EmailVerifyFormProps {
    user: User;
}

export function EmailVerifyForm({ user }: EmailVerifyFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>(
        'pending'
    );
    const t = useTranslations('dashboard.account.email.verify');

    const token = searchParams.get('token');

    const verifyEmailWithToken = useCallback(
        async (verificationToken: string) => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/auth/verify-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: verificationToken }),
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    setVerificationStatus('success');
                    toast.success(t('messages.verifySuccess'));
                    setTimeout(() => {
                        router.push('/dashboard/account?message=email-verified');
                    }, 2000);
                } else {
                    setVerificationStatus('error');
                    toast.error(result.message || t('messages.verifyFailed'));
                }
            } catch (error) {
                console.error('Email verification error:', error);
                setVerificationStatus('error');
                toast.error(t('messages.verifyError'));
            } finally {
                setIsLoading(false);
            }
        },
        [router, t]
    );

    useEffect(() => {
        if (token) {
            verifyEmailWithToken(token);
        }
    }, [token, verifyEmailWithToken]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const sendVerificationEmail = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setIsSent(true);
                setCountdown(60);
                toast.success(t('messages.emailSent'));
            } else {
                toast.error(result.message || t('messages.sendFailed'));
            }
        } catch (error) {
            console.error('Send verification email error:', error);
            toast.error(t('messages.sendError'));
        } finally {
            setIsLoading(false);
        }
    };

    const resendVerificationEmail = () => {
        setIsSent(false);
        setCountdown(0);
        sendVerificationEmail();
    };

    if (token) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-4 text-center">
                        {isLoading ? (
                            <>
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">
                                        {t('tokenVerification.loading.title')}
                                    </h3>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        {t('tokenVerification.loading.description')}
                                    </p>
                                </div>
                                <Progress value={75} className="mx-auto w-full max-w-xs" />
                            </>
                        ) : verificationStatus === 'success' ? (
                            <>
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-green-600">
                                        {t('tokenVerification.success.title')}
                                    </h3>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        {t('tokenVerification.success.description')}
                                    </p>
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    {t('tokenVerification.success.redirecting')}
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-red-600">
                                        {t('tokenVerification.error.title')}
                                    </h3>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        {t('tokenVerification.error.description')}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => router.push('/dashboard/account/email/verify')}
                                >
                                    {t('tokenVerification.error.tryAgain')}
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        {t('emailStatus.title')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">{user.email}</p>
                            <p className="text-muted-foreground text-sm">
                                {t('emailStatus.primaryEmail')}
                            </p>
                        </div>
                        <Badge variant="destructive">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            {t('emailStatus.unverified')}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('form.title')}</CardTitle>
                    <CardDescription>
                        {t('form.description', { email: user.email })}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {isSent ? (
                        <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>{t('form.alerts.emailSent')}</AlertDescription>
                        </Alert>
                    ) : (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{t('form.alerts.notVerified')}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-4">
                        {!isSent ? (
                            <Button
                                onClick={sendVerificationEmail}
                                disabled={isLoading}
                                className="w-full"
                                size="lg"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Send className="mr-2 h-4 w-4" />
                                {t('form.buttons.sendVerification')}
                            </Button>
                        ) : (
                            <div className="space-y-3">
                                <Button
                                    onClick={resendVerificationEmail}
                                    disabled={isLoading || countdown > 0}
                                    variant="outline"
                                    className="w-full"
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                    )}
                                    {countdown > 0
                                        ? t('form.buttons.resendCountdown', { seconds: countdown })
                                        : t('form.buttons.resendEmail')}
                                </Button>

                                {countdown > 0 && (
                                    <div className="text-center">
                                        <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
                                            <Clock className="h-4 w-4" />
                                            <span>
                                                {t('form.status.pleaseWait', {
                                                    seconds: countdown,
                                                })}
                                            </span>
                                        </div>
                                        <Progress
                                            value={((60 - countdown) / 60) * 100}
                                            className="mt-2 h-2"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-muted/50 rounded-lg border p-4">
                        <h4 className="mb-2 font-medium">{t('help.title')}</h4>
                        <ul className="text-muted-foreground space-y-1 text-sm">
                            <li>• {t('help.tips.checkSpam')}</li>
                            <li>• {t('help.tips.checkEmail', { email: user.email })}</li>
                            <li>• {t('help.tips.linkExpiry')}</li>
                            <li>• {t('help.tips.contactSupport')}</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
