'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useInAppNotificationService } from '@/hooks/useInAppNotificationService';

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z.string().min(6, 'New password must be at least 6 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your new password'),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

type PasswordFormData = z.infer<typeof passwordSchema>;

export function PasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { createPasswordChanged } = useInAppNotificationService();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

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
                toast.success('Password updated successfully!');
                reset();
            } else {
                toast.error(result.error || 'Failed to update password');
            }
        } catch (error) {
            console.error('Password update error:', error);

            if (error instanceof Error) {
                if (error.message.includes('401')) {
                    toast.error('Please sign in again to continue');
                } else if (error.message.includes('400')) {
                    toast.error('Invalid password data. Please check your input.');
                } else if (error.message.includes('403')) {
                    toast.error('Current password is incorrect');
                } else if (error.message.includes('500')) {
                    toast.error('Server error. Please try again later.');
                } else {
                    toast.error('Something went wrong. Please try again.');
                }
            } else {
                toast.error('Something went wrong. Please try again.');
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
                    Change Password
                </CardTitle>
                <CardDescription>
                    Update your password to keep your account secure. You&apos;ll receive a
                    notification when your password is changed.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password *</Label>
                        <div className="relative">
                            <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                            <Input
                                id="currentPassword"
                                type={showCurrentPassword ? 'text' : 'password'}
                                placeholder="Enter your current password"
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
                                disabled={isLoading}>
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
                        <Label htmlFor="newPassword">New Password *</Label>
                        <div className="relative">
                            <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                            <Input
                                id="newPassword"
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder="Enter your new password"
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
                                disabled={isLoading}>
                                {showNewPassword ? (
                                    <EyeOff className="text-muted-foreground h-4 w-4" />
                                ) : (
                                    <Eye className="text-muted-foreground h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-destructive text-sm">{errors.newPassword.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                        <div className="relative">
                            <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your new password"
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
                                disabled={isLoading}>
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
                            disabled={isLoading || !isDirty}
                            className="flex-1 md:flex-none">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Password
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => reset()}
                            disabled={isLoading}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
