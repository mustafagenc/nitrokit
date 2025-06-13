'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useInAppNotificationService } from '@/hooks/useInAppNotificationService';
import {
    PasswordStrengthIndicator,
    usePasswordStrength,
} from '@/components/ui/password-strength-indicator';

export function PasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { createPasswordChanged } = useInAppNotificationService();
    const t = useTranslations('dashboard.account.security.password.change');

    const passwordSchema = z
        .object({
            currentPassword: z.string().min(1, t('validation.currentPassword.required')),
            newPassword: z
                .string()
                .min(8, t('validation.newPassword.minLength'))
                .regex(/[A-Z]/, t('validation.newPassword.uppercase'))
                .regex(/[a-z]/, t('validation.newPassword.lowercase'))
                .regex(/[0-9]/, t('validation.newPassword.number'))
                .regex(/[^A-Za-z0-9]/, t('validation.newPassword.special')),
            confirmPassword: z.string().min(1, t('validation.confirmPassword.required')),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
            message: t('validation.confirmPassword.mismatch'),
            path: ['confirmPassword'],
        });

    type PasswordFormData = z.infer<typeof passwordSchema>;

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isDirty },
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const newPassword = watch('newPassword');

    const { strength, isWeak } = usePasswordStrength(newPassword);
    console.log('Password strength:', strength, 'Is weak:', isWeak);

    const onSubmit = async (data: PasswordFormData) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/user/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                await createPasswordChanged({ changeSource: 'settings_page' });
                toast.success(t('messages.updateSuccess'));
                reset();
            } else {
                toast.error(result.error || t('messages.updateFailed'));
            }
        } catch (error) {
            console.error('Password update error:', error);

            if (error instanceof Error) {
                if (error.message.includes('401')) {
                    toast.error(t('messages.errors.unauthorized'));
                } else if (error.message.includes('400')) {
                    toast.error(t('messages.errors.invalidData'));
                } else if (error.message.includes('403')) {
                    toast.error(t('messages.errors.incorrectPassword'));
                } else if (error.message.includes('500')) {
                    toast.error(t('messages.errors.serverError'));
                } else {
                    toast.error(t('messages.errors.generic'));
                }
            } else {
                toast.error(t('messages.errors.generic'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    {t('card.title')}
                </CardTitle>
                <CardDescription>{t('card.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">{t('form.currentPassword.label')}</Label>
                        <div className="relative">
                            <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                            <Input
                                id="currentPassword"
                                type={showCurrentPassword ? 'text' : 'password'}
                                placeholder={t('form.currentPassword.placeholder')}
                                className="pr-10 pl-10"
                                {...register('currentPassword')}
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                disabled={isLoading}
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="text-muted-foreground h-4 w-4" />
                                ) : (
                                    <Eye className="text-muted-foreground h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.currentPassword && (
                            <p className="text-destructive text-sm">
                                {errors.currentPassword.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword">{t('form.newPassword.label')}</Label>
                        <div className="relative">
                            <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                            <Input
                                id="newPassword"
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder={t('form.newPassword.placeholder')}
                                className="pr-10 pl-10"
                                {...register('newPassword')}
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                disabled={isLoading}
                            >
                                {showNewPassword ? (
                                    <EyeOff className="text-muted-foreground h-4 w-4" />
                                ) : (
                                    <Eye className="text-muted-foreground h-4 w-4" />
                                )}
                            </Button>
                        </div>

                        <PasswordStrengthIndicator
                            password={newPassword}
                            showRequirements={true}
                            showWarning={true}
                        />

                        {errors.newPassword && (
                            <p className="text-destructive text-sm">{errors.newPassword.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">{t('form.confirmPassword.label')}</Label>
                        <div className="relative">
                            <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder={t('form.confirmPassword.placeholder')}
                                className="pr-10 pl-10"
                                {...register('confirmPassword')}
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="text-muted-foreground h-4 w-4" />
                                ) : (
                                    <Eye className="text-muted-foreground h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-destructive text-sm">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading || !isDirty || isWeak}
                            className="flex-1 md:flex-none"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" />
                            {isLoading ? t('buttons.updating') : t('buttons.update')}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => reset()}
                            disabled={isLoading}
                        >
                            {t('buttons.cancel')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
