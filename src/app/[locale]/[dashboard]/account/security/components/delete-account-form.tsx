// src/app/[locale]/[dashboard]/account/components/delete-account-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { signOut } from 'next-auth/react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const deleteAccountSchema = z
    .object({
        password: z.string().optional(),
        confirmText: z.string().min(1, 'Please type "DELETE" to confirm'),
    })
    .refine(data => data.confirmText === 'DELETE', {
        message: 'You must type "DELETE" exactly',
        path: ['confirmText'],
    });

type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;

interface DeleteAccountFormProps {
    hasPassword: boolean;
    userEmail: string;
}

export function DeleteAccountForm({ hasPassword, userEmail }: DeleteAccountFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isValid },
    } = useForm<DeleteAccountFormData>({
        resolver: zodResolver(deleteAccountSchema),
        mode: 'onChange',
        defaultValues: {
            password: '',
            confirmText: '',
        },
    });

    const confirmText = watch('confirmText');

    const onSubmit = async (data: DeleteAccountFormData) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/user/account', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: hasPassword ? data.password : undefined,
                    confirmText: data.confirmText,
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success('Account deleted successfully. Redirecting...');
                await signOut({
                    callbackUrl: '/',
                    redirect: true,
                });
            } else {
                toast.error(result.error || 'Failed to delete account');
            }
        } catch (error) {
            console.error('Account deletion error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
            setIsDialogOpen(false);
            reset();
        }
    };

    return (
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                </CardTitle>
                <CardDescription>
                    Permanently delete your account and all associated data. This action cannot be
                    undone.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-4">
                        <h4 className="text-destructive mb-2 font-medium">What will be deleted:</h4>
                        <ul className="text-muted-foreground space-y-1 text-sm">
                            <li>• Your profile and personal information</li>
                            <li>• All uploaded files and profile pictures</li>
                            <li>• Account settings and preferences</li>
                            <li>• Login sessions and connected accounts</li>
                            <li>• All associated data and history</li>
                        </ul>
                    </div>

                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full" disabled={isLoading}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete My Account
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="sm:max-w-md">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                    <AlertTriangle className="text-destructive h-5 w-5" />
                                    Delete Account
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    You are about to permanently delete your account ({userEmail}).
                                    This action cannot be undone and all your data will be lost
                                    forever.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                {hasPassword && (
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Confirm Password *</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Enter your password"
                                                className="pr-10"
                                                {...register('password', {
                                                    required: hasPassword
                                                        ? 'Password is required'
                                                        : false,
                                                })}
                                                disabled={isLoading}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                                disabled={isLoading}>
                                                {showPassword ? (
                                                    <EyeOff className="text-muted-foreground h-4 w-4" />
                                                ) : (
                                                    <Eye className="text-muted-foreground h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-destructive text-sm">
                                                {errors.password.message}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="confirmText">
                                        Type &quot;DELETE&quot; to confirm *
                                    </Label>
                                    <Input
                                        id="confirmText"
                                        placeholder="Type DELETE here"
                                        {...register('confirmText')}
                                        disabled={isLoading}
                                        className={
                                            confirmText === 'DELETE' ? 'border-destructive' : ''
                                        }
                                    />
                                    {errors.confirmText && (
                                        <p className="text-destructive text-sm">
                                            {errors.confirmText.message}
                                        </p>
                                    )}
                                </div>

                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isLoading}>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        type="submit"
                                        disabled={isLoading || !isValid}
                                        className="bg-destructive hover:bg-destructive/90">
                                        {isLoading && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Delete Account Forever
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
}
