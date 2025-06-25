'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PasswordStrengthBar from 'react-password-strength-bar';
import { toast } from 'sonner';
import { z } from 'zod';

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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@/components/ui/checkbox';

export default function SignupForm() {
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const t = useTranslations();

    const scoreWords: string[] = [
        t('validation.password.weak'),
        t('validation.password.weak'),
        t('validation.password.okay'),
        t('validation.password.good'),
        t('validation.password.strong'),
    ];

    const passwordMinLength = 6;
    const passwordMaxLength = 20;
    const passwordSchema = z
        .string()
        .min(1, { message: t('validation.required.password') })
        .min(passwordMinLength, {
            message: t('validation.password.minLength', { min: passwordMinLength }),
        })
        .max(passwordMaxLength, {
            message: t('validation.password.maxLength', { max: passwordMaxLength }),
        })
        .refine((password) => /[A-Z]/.test(password), {
            message: t('validation.password.uppercase'),
        })
        .refine((password) => /[a-z]/.test(password), {
            message: t('validation.password.lowercase'),
        })
        .refine((password) => /[0-9]/.test(password), { message: t('validation.password.number') })
        .refine((password) => /[!@#$%^&*]/.test(password), {
            message: t('validation.password.special'),
        });

    const formSchema = z
        .object({
            firstName: z.string().min(1, {
                message: t('validation.required.firstName'),
            }),
            lastName: z.string().min(1, {
                message: t('validation.required.lastName'),
            }),
            email: z
                .string()
                .min(5, {
                    message: t('validation.required.email'),
                })
                .email({
                    message: t('validation.invalid.email'),
                }),
            password: passwordSchema,
            confirmPassword: z.string().min(1, {
                message: t('validation.required.confirmPassword'),
            }),
            receiveUpdates: z.boolean().optional(),
        })
        .refine(
            (data) => {
                return data.password === data.confirmPassword;
            },
            {
                message: t('validation.password.confirm'),
                path: ['confirmPassword'],
            }
        );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            receiveUpdates: false,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    password: values.password,
                    receiveUpdates: values.receiveUpdates,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || t('auth.signup.error'));
            }

            if (data.requiresVerification) {
                toast.success(t('auth.signup.verificationRequired'), {
                    description: t('auth.signup.verificationDescription', { email: values.email }),
                    duration: 6000,
                });

                form.reset();
                router.push(`/verify-email-sent?email=${encodeURIComponent(values.email)}`);
            } else {
                toast.success(t('auth.signup.success'), {
                    description: t('auth.signup.successDescription'),
                });

                form.reset();
                router.push('/signin?message=account-created');
            }
        } catch (error) {
            console.error('Signup error:', error);
            const errorMessage = error instanceof Error ? error.message : t('auth.signup.error');
            setError(errorMessage);

            toast.error(t('auth.signup.error'), {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setPassword(form.getValues('password'));
    }, [form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('auth.firstName')}</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder={t('placeholder.enterYourFirstName')}
                                        type="text"
                                        disabled={isLoading}
                                        autoComplete="given-name"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('auth.lastName')}</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder={t('placeholder.enterYourLastName')}
                                        type="text"
                                        disabled={isLoading}
                                        autoComplete="family-name"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

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
                                    autoComplete="email"
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
                            <FormLabel>{t('auth.password')}</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    {...field}
                                    placeholder={t('placeholder.enterYourPassword')}
                                    autoComplete="new-password"
                                    disabled={isLoading}
                                    onChangeCapture={(e) => setPassword(e.currentTarget.value)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <PasswordStrengthBar
                    password={password}
                    minLength={passwordMinLength}
                    scoreWords={scoreWords}
                    shortScoreWord={t('validation.password.tooShort')}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    {...field}
                                    placeholder={t('placeholder.confirmYourPassword')}
                                    autoComplete="new-password"
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="receiveUpdates"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className="cursor-pointer">
                                    {t('auth.signup.receiveUpdates.label')}
                                </FormLabel>
                                <p className="text-muted-foreground text-sm">
                                    {t('auth.signup.receiveUpdates.description')}
                                </p>
                            </div>
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 bg-blue-600 hover:bg-blue-600/80"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            {t('auth.signup.creating')}
                        </>
                    ) : (
                        t('auth.signup.title')
                    )}
                </Button>
            </form>
        </Form>
    );
}
