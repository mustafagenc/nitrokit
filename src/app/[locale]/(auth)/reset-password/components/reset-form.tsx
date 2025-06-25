'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useRouter } from '@/i18n/navigation';
import { z } from 'zod';
import { toast } from 'sonner';

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
import { zodResolver } from '@hookform/resolvers/zod';

export default function ResetPasswordForm() {
    const t = useTranslations();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const formSchema = z.object({
        email: z
            .string()
            .min(5, {
                message: t('validation.required.email'),
            })
            .email({
                message: t('validation.invalid.email'),
            }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || t('auth.resetPassword.error'));
            }

            toast.success(t('auth.resetPassword.emailSent'), {
                description: t('auth.resetPassword.checkEmail', { email: values.email }),
                duration: 6000,
            });

            form.reset();
            router.push(`/auth/reset-password-sent?email=${encodeURIComponent(values.email)}`);
        } catch (error) {
            console.error('Reset password error:', error);
            const errorMessage =
                error instanceof Error ? error.message : t('auth.resetPassword.error');
            setError(errorMessage);

            toast.error(t('auth.resetPassword.error'), {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                {error && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

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
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 bg-blue-600 hover:bg-blue-600/80"
                    disabled={isLoading}
                >
                    {isLoading ? t('common.loading') : t('auth.resetPassword.sendEmail')}
                </Button>
            </form>
        </Form>
    );
}
