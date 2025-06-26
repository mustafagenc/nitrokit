import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as validation from '../../security/validation';

// logger mock
vi.mock('@/lib/services/logger', () => ({
    logger: {
        debug: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
    },
}));

describe('validation utils', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('emailSchema geçerli email formatını kabul eder', () => {
        const result = validation.emailSchema.safeParse('test@example.com');
        expect(result.success).toBe(true);
    });

    it('emailSchema geçersiz email formatını reddeder', () => {
        const result = validation.emailSchema.safeParse('invalid-email');
        expect(result.success).toBe(false);
    });

    it('passwordSchema geçerli şifreyi kabul eder', () => {
        const result = validation.passwordSchema.safeParse('Test123!@#');
        expect(result.success).toBe(true);
    });

    it('passwordSchema geçersiz şifreyi reddeder', () => {
        const result = validation.passwordSchema.safeParse('weak');
        expect(result.success).toBe(false);
    });

    it('nameSchema geçerli ismi kabul eder', () => {
        const result = validation.nameSchema.safeParse('John Doe');
        expect(result.success).toBe(true);
    });

    it('nameSchema geçersiz ismi reddeder', () => {
        const result = validation.nameSchema.safeParse('J');
        expect(result.success).toBe(false);
    });

    it('phoneSchema geçerli telefon numarasını kabul eder', () => {
        const result = validation.phoneSchema.safeParse('+905551234567');
        expect(result.success).toBe(true);
    });

    it('phoneSchema geçersiz telefon numarasını reddeder', () => {
        const result = validation.phoneSchema.safeParse('invalid-phone');
        expect(result.success).toBe(false);
    });

    it('urlSchema geçerli URL formatını kabul eder', () => {
        const result = validation.urlSchema.safeParse('https://example.com');
        expect(result.success).toBe(true);
    });

    it('urlSchema geçersiz URL formatını reddeder', () => {
        const result = validation.urlSchema.safeParse('invalid-url');
        expect(result.success).toBe(false);
    });

    it('slugSchema geçerli slug formatını kabul eder', () => {
        const result = validation.slugSchema.safeParse('valid-slug-123');
        expect(result.success).toBe(true);
    });

    it('slugSchema geçersiz slug formatını reddeder', () => {
        const result = validation.slugSchema.safeParse('invalid slug');
        expect(result.success).toBe(false);
    });

    it('contactFormSchema geçerli form verisini kabul eder', () => {
        const t = (key: string) => key;
        const schema = validation.contactFormSchema(t);
        const result = schema.safeParse({
            name: 'John Doe',
            email: 'test@example.com',
            message: 'Valid message',
        });
        expect(result.success).toBe(true);
    });

    it('contactFormSchema geçersiz form verisini reddeder', () => {
        const t = (key: string) => key;
        const schema = validation.contactFormSchema(t);
        const result = schema.safeParse({
            name: 'J',
            email: 'invalid-email',
            message: 'Short',
        });
        expect(result.success).toBe(false);
    });

    it('registerSchema geçerli kayıt verisini kabul eder', () => {
        const result = validation.registerSchema.safeParse({
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@example.com',
            password: 'Test123!@#',
            terms: true,
        });
        expect(result.success).toBe(true);
    });

    it('registerSchema geçersiz kayıt verisini reddeder', () => {
        const result = validation.registerSchema.safeParse({
            firstName: 'J',
            lastName: 'D',
            email: 'invalid-email',
            password: 'weak',
            terms: false,
        });
        expect(result.success).toBe(false);
    });

    it('loginSchema geçerli giriş verisini kabul eder', () => {
        const result = validation.loginSchema.safeParse({
            email: 'test@example.com',
            password: 'Test123!@#',
        });
        expect(result.success).toBe(true);
    });

    it('loginSchema geçersiz giriş verisini reddeder', () => {
        const result = validation.loginSchema.safeParse({
            email: 'invalid-email',
            password: '',
        });
        expect(result.success).toBe(false);
    });

    it('resetPasswordSchema geçerli şifre sıfırlama verisini kabul eder', () => {
        const result = validation.resetPasswordSchema.safeParse({
            token: 'valid-token',
            password: 'Test123!@#',
            confirmPassword: 'Test123!@#',
        });
        expect(result.success).toBe(true);
    });

    it('resetPasswordSchema geçersiz şifre sıfırlama verisini reddeder', () => {
        const result = validation.resetPasswordSchema.safeParse({
            token: '',
            password: 'weak',
            confirmPassword: 'weak',
        });
        expect(result.success).toBe(false);
    });

    it('containsSuspiciousPatterns şüpheli metni tespit eder', () => {
        expect(validation.containsSuspiciousPatterns('admin')).toBe(true);
        expect(validation.containsSuspiciousPatterns('normal text')).toBe(false);
    });

    it('isDisposableEmail geçici email adresini tespit eder', () => {
        expect(validation.isDisposableEmail('test@10minutemail.com')).toBe(true);
        expect(validation.isDisposableEmail('test@example.com')).toBe(false);
    });

    it('containsSpam spam metni tespit eder', () => {
        expect(validation.containsSpam('buy now free offer')).toBe(true);
        expect(validation.containsSpam('normal message')).toBe(false);
    });

    it('validateRequest geçerli veriyi kabul eder', () => {
        const schema = validation.emailSchema;
        const result = validation.validateRequest(schema, 'test@example.com', 'test');
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe('test@example.com');
        }
    });

    it('validateRequest geçersiz veriyi reddeder', () => {
        const schema = validation.emailSchema;
        const result = validation.validateRequest(schema, 'invalid-email', 'test');
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.errors).toContain('Invalid email format');
        }
    });
});
