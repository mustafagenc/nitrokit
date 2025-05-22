'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PasswordStrengthBar from 'react-password-strength-bar';
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
import { zodResolver } from '@hookform/resolvers/zod';

export default function SignupForm() {
    const [password, setPassword] = useState<string>('');
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
        .refine(password => /[A-Z]/.test(password), { message: t('validation.password.uppercase') })
        .refine(password => /[a-z]/.test(password), { message: t('validation.password.lowercase') })
        .refine(password => /[0-9]/.test(password), { message: t('validation.password.number') })
        .refine(password => /[!@#$%^&*]/.test(password), {
            message: t('validation.password.special'),
        });

    const formSchema = z
        .object({
            name: z.string().min(2, {
                message: t('validation.required.name'),
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
        })
        .refine(
            data => {
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
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error(error);
            }
        }
    }

    useEffect(() => {
        setPassword(form.getValues('password'));
    }, [form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('auth.name')}</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={t('placeholder.enterYourName')}
                                    type="text"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                                    onChangeCapture={e => setPassword(e.currentTarget.value)}
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
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 bg-blue-600 hover:bg-blue-600/80">
                    {t('auth.signup')}
                </Button>
            </form>
        </Form>
    );
}
