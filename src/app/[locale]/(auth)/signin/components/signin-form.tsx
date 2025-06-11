'use client';

import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Link, useRouter } from '@/lib/i18n/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

export default function SigninForm() {
    const t = useTranslations();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

    const formSchema = z.object({
        email: z.string().min(5).email(),
        password: z.string().min(2),
        twoFactorCode: z.string().optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
            twoFactorCode: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        try {
            if (!showTwoFactor) {
                const checkResponse = await fetch('/api/auth/2fa/check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: values.email,
                        password: values.password,
                    }),
                });

                if (!checkResponse.ok) {
                    toast.error('Invalid email or password');
                    setIsLoading(false);
                    return;
                }

                const checkData = await checkResponse.json();

                if (checkData.requiresTwoFactor) {
                    setShowTwoFactor(true);
                    toast.info('Please enter your 2FA code');
                    setIsLoading(false);
                    return;
                }
            }

            const result = await signIn('credentials', {
                email: values.email,
                password: values.password,
                twoFactorCode: values.twoFactorCode,
                callbackUrl,
                redirect: false,
            });

            if (result?.error) {
                toast.error('Invalid credentials or 2FA code');
            } else if (result?.ok) {
                toast.success('Login successful!');
                router.push(callbackUrl);
            }
        } catch (error) {
            console.error('Signin error:', error);
            toast.error('An error occurred during sign in');
        } finally {
            setIsLoading(false);
        }
    }

    const resetForm = () => {
        setShowTwoFactor(false);
        form.setValue('twoFactorCode', '');
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('auth.email')}</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={t('placeholder.enterYourEmail')}
                                    type="email"
                                    disabled={showTwoFactor}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="grid grid-cols-2 gap-1">
                                <FormLabel>{t('auth.password')}</FormLabel>
                                {!showTwoFactor && (
                                    <p className="text-muted-foreground text-right text-sm font-bold">
                                        <Link href={'/reset-password'}>
                                            {t('auth.forgotPassword')}
                                        </Link>
                                    </p>
                                )}
                            </div>
                            <FormControl>
                                <PasswordInput
                                    {...field}
                                    placeholder={t('placeholder.enterYourPassword')}
                                    disabled={showTwoFactor}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {showTwoFactor && (
                    <FormField
                        control={form.control}
                        name="twoFactorCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Two-Factor Authentication</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Enter 6-digit code or backup code"
                                        className="text-center font-mono"
                                        autoFocus
                                    />
                                </FormControl>
                                <p className="text-muted-foreground text-xs">
                                    Enter code from your authenticator app or use backup code
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <div className="space-y-2">
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-600/80"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? showTwoFactor
                                ? 'Verifying...'
                                : 'Checking...'
                            : showTwoFactor
                              ? 'Verify & Sign In'
                              : t('auth.signin.title')}
                    </Button>

                    {showTwoFactor && (
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={resetForm}
                        >
                            Back to Login
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
}
