'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/i18n/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    PasswordStrengthIndicator,
    usePasswordStrength,
} from '@/components/ui/password-strength-indicator';

const passwordSchema = z
    .object({
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

type PasswordFormData = z.infer<typeof passwordSchema>;

export function PasswordCreateForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const form = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const password = form.watch('password');
    const { strength, isWeak, allRequirementsMet } = usePasswordStrength(password);
    console.log('Password strength:', strength);
    const onSubmit = async (data: PasswordFormData) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/password/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: data.password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create password');
            }

            const result = await response.json();

            if (result.success) {
                toast.success('Password created successfully!');
                router.push('/dashboard/account/security/password');
                router.refresh();
            } else {
                throw new Error(result.message || 'Failed to create password');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Create Password
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="password">New Password *</Label>
                        <div className="relative">
                            <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your new password"
                                className="pr-10 pl-10"
                                {...form.register('password')}
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? (
                                    <EyeOff className="text-muted-foreground h-4 w-4" />
                                ) : (
                                    <Eye className="text-muted-foreground h-4 w-4" />
                                )}
                            </Button>
                        </div>

                        <PasswordStrengthIndicator
                            password={password}
                            showRequirements={true}
                            showWarning={true}
                        />

                        {form.formState.errors.password && (
                            <p className="text-destructive text-sm">
                                {form.formState.errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <div className="relative">
                            <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                className="pr-10 pl-10"
                                {...form.register('confirmPassword')}
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
                        {form.formState.errors.confirmPassword && (
                            <p className="text-destructive text-sm">
                                {form.formState.errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading || isWeak || !allRequirementsMet}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Creating Password...' : 'Create Password'}
                        </Button>

                        <p className="text-muted-foreground mt-2 text-sm">
                            Your password must meet all requirements and be at least medium
                            strength.
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
