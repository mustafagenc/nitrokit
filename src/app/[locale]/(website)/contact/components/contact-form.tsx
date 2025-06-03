'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { sendEmail } from '@/lib/actions/contact';

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
import { Badge } from '@/components/ui/badge';
import { ContactFormSchema, TContactFormSchema } from '@/lib/validators/contact-form';
import { cn } from '@/utils/helpers';

type FormStatus = 'idle' | 'success' | 'error';

export const ContactForm = () => {
    const t = useTranslations();
    const [isPending, startTransition] = useTransition();
    const [formStatus, setFormStatus] = useState<FormStatus>('idle');

    const form = useForm<TContactFormSchema>({
        resolver: zodResolver(ContactFormSchema(t)),
        defaultValues: {
            name: '',
            email: '',
            message: '',
        },
        mode: 'onBlur',
    });

    const {
        formState: { isSubmitting, errors, isValid, touchedFields },
    } = form;

    const handleFormSubmit: SubmitHandler<TContactFormSchema> = async data => {
        startTransition(async () => {
            try {
                setFormStatus('idle');
                const result = await sendEmail(data);

                if (!result.success) {
                    setFormStatus('error');
                    toast.error(result.error || t('common.error'), {
                        icon: <AlertCircle className="h-4 w-4" />,
                        description: 'Please try again later or contact us directly.',
                    });
                    return;
                }

                setFormStatus('success');
                toast.success(t('contact.messageSent'), {
                    icon: <CheckCircle className="h-4 w-4" />,
                    description: "We'll get back to you as soon as possible.",
                });

                form.reset();
                setTimeout(() => setFormStatus('idle'), 3000);
            } catch (error) {
                console.error(error);
                setFormStatus('error');
                toast.error('Network error occurred', {
                    icon: <AlertCircle className="h-4 w-4" />,
                });
            }
        });
    };

    const isLoading = isSubmitting || isPending;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Send us a message</h2>
                    {formStatus === 'success' && (
                        <Badge
                            variant="secondary"
                            className="border-green-200 bg-green-50 text-green-700">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Sent
                        </Badge>
                    )}
                </div>
                <p className="text-muted-foreground">
                    Fill out the form below and we&apos;ll get back to you within 24 hours.
                </p>
            </div>

            {/* Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-sm font-medium">
                                        {t('contact.name')}
                                        <span className="text-destructive ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t('placeholder.enterYourName')}
                                            autoComplete="name"
                                            className={cn(
                                                'bg-background border-border focus:border-primary h-12 transition-all duration-200',
                                                errors.name &&
                                                    'border-destructive focus-visible:ring-destructive',
                                                touchedFields.name &&
                                                    !errors.name &&
                                                    'border-green-500'
                                            )}
                                            {...field}
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
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-sm font-medium">
                                        {t('contact.email')}
                                        <span className="text-destructive ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder={t('placeholder.enterYourEmail')}
                                            autoComplete="email"
                                            className={cn(
                                                'bg-background border-border focus:border-primary h-12 transition-all duration-200',
                                                errors.email &&
                                                    'border-destructive focus-visible:ring-destructive',
                                                touchedFields.email &&
                                                    !errors.email &&
                                                    'border-green-500'
                                            )}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Message Field */}
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-sm font-medium">
                                    {t('contact.message')}
                                    <span className="text-destructive ml-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder={t('placeholder.enterYourMessage')}
                                        rows={6}
                                        className={cn(
                                            'bg-background border-border focus:border-primary resize-none transition-all duration-200',
                                            errors.message &&
                                                'border-destructive focus-visible:ring-destructive',
                                            touchedFields.message &&
                                                !errors.message &&
                                                'border-green-500'
                                        )}
                                        {...field}
                                    />
                                </FormControl>
                                <div className="flex items-center justify-between">
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading || !isValid}
                            size="lg"
                            className={cn(
                                'h-12 w-full transition-all duration-200',
                                formStatus === 'success' && 'bg-green-600 hover:bg-green-700',
                                isLoading && 'cursor-not-allowed'
                            )}>
                            {isLoading ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Sending...
                                </>
                            ) : formStatus === 'success' ? (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Message Sent!
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    {t('contact.send')}
                                </>
                            )}
                        </Button>

                        {/* Privacy Notice */}
                        <p className="text-muted-foreground mt-4 text-center text-xs">
                            By submitting this form, you agree to our{' '}
                            <button
                                type="button"
                                className="hover:text-foreground underline transition-colors"
                                onClick={() => window.open('/privacy', '_blank')}>
                                Privacy Policy
                            </button>
                        </p>
                    </div>
                </form>
            </Form>
        </div>
    );
};
