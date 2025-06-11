import { z } from 'zod';
import { logger } from '@/lib/services/logger';

// Base validation schemas
export const emailSchema = z.string().email('Invalid email format');
export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const nameSchema = z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-ZÀ-ÿĞğİıŞşÇçÖöÜü\s]+$/, 'Name can only contain letters and spaces');

export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

export const urlSchema = z.string().url('Invalid URL format');

export const slugSchema = z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens');

// Enhanced contact form validation
export const contactFormSchema = (t: (key: string) => string) => {
    return z.object({
        name: nameSchema.refine((name) => !containsSuspiciousPatterns(name), {
            message: t('validation.suspicious.name'),
        }),
        email: emailSchema.refine((email) => !isDisposableEmail(email), {
            message: t('validation.disposable.email'),
        }),
        message: z
            .string()
            .min(10, { message: t('validation.required.message') })
            .max(2000, { message: t('validation.maxLength.message') })
            .refine((message) => !containsSpam(message), { message: t('validation.spam.message') }),
        subject: z
            .string()
            .max(200, { message: t('validation.maxLength.subject') })
            .optional(),
        honeypot: z.string().max(0, 'Bot detected').optional(), // Bot trap
    });
};

// User registration validation
export const registerSchema = z
    .object({
        firstName: nameSchema,
        lastName: nameSchema,
        email: emailSchema.refine(
            (email) => !isDisposableEmail(email),
            'Disposable email addresses are not allowed'
        ),
        password: passwordSchema,
        confirmPassword: z.string(),
        terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
        honeypot: z.string().max(0, 'Bot detected').optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

// Login validation
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
    captcha: z.string().optional(),
});

// Password reset validation
export const resetPasswordSchema = z
    .object({
        token: z.string().min(1, 'Reset token is required'),
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

// Utility functions for validation
export function containsSuspiciousPatterns(text: string): boolean {
    const suspiciousPatterns = [
        /admin/i,
        /test/i,
        /null/i,
        /undefined/i,
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
    ];

    return suspiciousPatterns.some((pattern) => pattern.test(text));
}

export function isDisposableEmail(email: string): boolean {
    const disposableDomains = [
        '10minutemail.com',
        'tempmail.org',
        'guerrillamail.com',
        'mailinator.com',
        'temp-mail.org',
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    return disposableDomains.includes(domain);
}

export function containsSpam(text: string): boolean {
    const spamPatterns = [
        /\b(buy|purchase|discount|free|offer|deal)\b.*\b(now|today|limited)\b/i,
        /\b(click here|visit|check out)\b.*\b(link|website|site)\b/i,
        /\$\d+/,
        /\b(viagra|casino|poker|lottery)\b/i,
    ];

    return spamPatterns.some((pattern) => pattern.test(text));
}

// Validation middleware
export function validateRequest<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    action: string
): { success: true; data: T } | { success: false; errors: string[] } {
    try {
        logger.debug('Validating request data', {
            action,
            hasData: !!data,
        });

        const result = schema.safeParse(data);

        if (!result.success) {
            const errors = result.error.errors.map((err) => err.message);

            logger.warn('Request validation failed', {
                action,
                errorCount: errors.length,
                firstError: errors[0],
            });

            return { success: false, errors };
        }

        logger.debug('Request validation successful', {
            action,
        });

        return { success: true, data: result.data };
    } catch (error) {
        logger.error('Validation error', error instanceof Error ? error : undefined, {
            action,
        });

        return { success: false, errors: ['Validation failed'] };
    }
}

export type ContactFormData = z.infer<ReturnType<typeof contactFormSchema>>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
