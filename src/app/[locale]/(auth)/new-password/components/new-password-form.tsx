'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useRouter } from '@/lib/i18n/navigation';
import { z } from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

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

interface NewPasswordFormProps {
    token: string;
}

export default function NewPasswordForm({ token }: NewPasswordFormProps) {
    const t = useTranslations();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const formSchema = z
        .object({
            password: z
                .string()
                .min(8, {
                    message: t('validation.password.minLength'),
                })
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
                    message: t('validation.password.complexity'),
                }),
            confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t('validation.password.noMatch'),
            path: ['confirmPassword'],
        });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/reset-password/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    password: values.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || t('auth.resetPassword.confirmError'));
            }

            toast.success(t('auth.resetPassword.success'), {
                description: t('auth.resetPassword.successDescription'),
            });

            form.reset();
            router.push('/signin?message=password-reset-success');
        } catch (error) {
            console.error('Password reset confirm error:', error);
            const errorMessage =
                error instanceof Error ? error.message : t('auth.resetPassword.confirmError');
            setError(errorMessage);

            toast.error(t('auth.resetPassword.confirmError'), {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    {error && (
                        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('auth.newPassword')}</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            placeholder={t('placeholder.enterNewPassword')}
                                            type={showPassword ? 'text' : 'password'}
                                            disabled={isLoading}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            placeholder={t('placeholder.confirmNewPassword')}
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            disabled={isLoading}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
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
                        {isLoading ? t('common.loading') : t('auth.resetPassword.confirm')}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
