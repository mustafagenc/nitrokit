'use client';

import { useTranslations } from 'next-intl';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import SmallLoading from '@/components/shared/small-loading';
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
import { Textarea } from '@/components/ui/textarea';
import { sendEmail } from '@/lib/resend';
import { ContactFormSchema, TContactFormSchema } from '@/lib/validators/contact-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const ContactForm = () => {
    const t = useTranslations();

    const form = useForm<TContactFormSchema>({
        resolver: zodResolver(ContactFormSchema(t)),
        defaultValues: {
            name: '',
            email: '',
            message: '',
        },
    });

    const handleFormSubmit: SubmitHandler<TContactFormSchema> = async (
        data: TContactFormSchema
    ) => {
        const { success } = await sendEmail(data);
        if (!success) return toast.error('Something went wrong!');
        toast.success('Message sent successfully!');
        form.reset();
    };

    return (
        <section className="flex w-full flex-col gap-8">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleFormSubmit)}
                    className="lg:flex-auto"
                    noValidate>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-zinc-700 uppercase dark:text-zinc-400">
                                            {t('contact.name')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="name"
                                                autoFocus
                                                placeholder={t('placeholder.enterYourName')}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-rose-500" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-zinc-700 uppercase dark:text-zinc-400">
                                            {t('contact.email')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="email"
                                                placeholder={t('placeholder.enterYourEmail')}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-rose-500" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-zinc-700 uppercase dark:text-zinc-400">
                                            {t('contact.message')}
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                rows={8}
                                                id="message"
                                                placeholder={t('placeholder.enterYourMessage')}
                                                className="max-h-72"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-rose-500" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className="w-full disabled:opacity-50">
                            {form.formState.isSubmitting ? <SmallLoading /> : null}
                            {t('contact.send')}
                        </Button>
                    </div>
                </form>
            </Form>
        </section>
    );
};
