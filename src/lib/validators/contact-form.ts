import { z } from 'zod';

export const ContactFormSchema = (t: (key: string) => string) => {
    return z.object({
        name: z.string().min(3, { message: t('validation.required.name') }),
        email: z
            .string()
            .min(1, { message: t('validation.required.email') })
            .email(t('validation.invalid.email')),
        message: z.string().min(1, { message: t('validation.required.message') }),
    });
};

export type TContactFormSchema = z.infer<ReturnType<typeof ContactFormSchema>>;
