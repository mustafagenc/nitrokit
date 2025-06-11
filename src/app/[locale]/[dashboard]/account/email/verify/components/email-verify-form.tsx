'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
                    toast.success('Email verified successfully!');
                    setTimeout(() => {
                        router.push('/dashboard/account?message=email-verified');
                    }, 2000);
                } else {
                    setVerificationStatus('error');
                    toast.error(result.message || 'Failed to verify email');
                }
            } catch (error) {
                console.error('Email verification error:', error);
                setVerificationStatus('error');
                toast.error('An error occurred while verifying email');
            } finally {
                setIsLoading(false);
            }
        },
        [router]
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
                toast.success('Verification email sent! Check your inbox.');
            } else {
                toast.error(result.message || 'Failed to send verification email');
            }
        } catch (error) {
            console.error('Send verification email error:', error);
            toast.error('An error occurred while sending verification email');
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
                                    <h3 className="text-lg font-medium">Verifying Email...</h3>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        Please wait while we verify your email address.
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
                                        Email Verified!
                                    </h3>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        Your email address has been successfully verified.
                                    </p>
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    Redirecting to account settings...
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-red-600">
                                        Verification Failed
                                    </h3>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        The verification link is invalid or has expired.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => router.push('/dashboard/account/email/verify')}>
                                    Try Again
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
                        Email Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">{user.email}</p>
                            <p className="text-muted-foreground text-sm">Primary email address</p>
                        </div>
                        <Badge variant="destructive">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Unverified
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Verify Your Email</CardTitle>
                    <CardDescription>
                        Click the button below to send a verification email to{' '}
                        <strong>{user.email}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {isSent ? (
                        <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                                Verification email sent! Check your inbox and click the verification
                                link. If you don&apos;t see it, check your spam folder.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Your email address is not verified. Some features may be limited
                                until you verify your email.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-4">
                        {!isSent ? (
                            <Button
                                onClick={sendVerificationEmail}
                                disabled={isLoading}
                                className="w-full"
                                size="lg">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Send className="mr-2 h-4 w-4" />
                                Send Verification Email
                            </Button>
                        ) : (
                            <div className="space-y-3">
                                <Button
                                    onClick={resendVerificationEmail}
                                    disabled={isLoading || countdown > 0}
                                    variant="outline"
                                    className="w-full">
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                    )}
                                    {countdown > 0
                                        ? `Resend in ${countdown}s`
                                        : 'Resend Verification Email'}
                                </Button>

                                {countdown > 0 && (
                                    <div className="text-center">
                                        <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
                                            <Clock className="h-4 w-4" />
                                            <span>
                                                Please wait {countdown} seconds before resending
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
                        <h4 className="mb-2 font-medium">Need help?</h4>
                        <ul className="text-muted-foreground space-y-1 text-sm">
                            <li>• Check your spam/junk folder</li>
                            <li>• Make sure {user.email} is correct</li>
                            <li>• The verification link expires in 24 hours</li>
                            <li>• Contact support if you continue having issues</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
