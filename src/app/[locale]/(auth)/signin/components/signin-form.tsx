'use client';

import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
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
import { Link, useRouter } from '@/lib/i18n/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

export default function SigninForm() {
    const t = useTranslations();
    const router = useRouter();

    const formSchema = z.object({
        email: z
            .string()
            .min(5, {
                message: t('validation.required.email'),
            })
            .email({
                message: t('validation.invalid.email'),
            }),
        password: z.string().min(2, {
            message: t('validation.required.password'),
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const result = await signIn('credentials', {
            ...values,
            redirect: false,
        });

        if (result?.error) {
            console.error('Sign-in failed:', result.error);
            // It's good practice to use translated error messages if available
            toast.error(result.error);
        } else if (result?.ok) {
            router.push('/');
            router.refresh();
        }
    }
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
                                <p className="text-muted-foreground text-right text-sm font-bold">
                                    <Link href={'/reset-password'}>{t('auth.forgotPassword')}</Link>
                                </p>
                            </div>
                            <FormControl>
                                <PasswordInput
                                    {...field}
                                    placeholder={t('placeholder.enterYourPassword')}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 bg-blue-600 hover:bg-blue-600/80">
                    {t('auth.signin')}
                </Button>
            </form>
        </Form>
    );
}
