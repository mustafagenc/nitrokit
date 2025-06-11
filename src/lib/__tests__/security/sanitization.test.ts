import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as sanitization from '../../security/sanitization';

// DOMPurify ve logger mock
vi.mock('dompurify', () => ({
    default: {
        sanitize: vi.fn((input, opts) => {
            if (opts && opts.ALLOWED_TAGS && opts.ALLOWED_TAGS.length === 0) {
                // stripAllTags için
                return input.replace(/<[^>]*>/g, '');
            }
            // sanitizeHtml için
            return input.replace(/<script.*?>.*?<\/script>/gi, '');
        }),
    },
}));
vi.mock('@/lib/services/logger', () => ({
    logger: {
        warn: vi.fn(),
        debug: vi.fn(),
        error: vi.fn(),
    },
}));

describe('sanitization utils', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('sanitizeHtml zararlı script etiketini temizler', () => {
        const dirty = '<p>test</p><script>alert(1)</script>';
        const clean = sanitization.sanitizeHtml(dirty);
        expect(clean).toBe('<p>test</p>');
    });

    it('stripAllTags tüm HTML etiketlerini kaldırır', () => {
        const dirty = '<div>Merhaba <b>dünya</b>!</div>';
        const clean = sanitization.stripAllTags(dirty);
        expect(clean).toBe('Merhaba dünya!');
    });

    it('sanitizeSqlInput SQL injection karakterlerini temizler', () => {
        const dirty = "test'; DROP TABLE users; --";
        const clean = sanitization.sanitizeSqlInput(dirty);
        expect(clean).toBe("test'' DROP TABLE users");
    });

    it('sanitizeUserInput temel temizlik yapar', () => {
        const dirty = '<b>test</b>\n<script>alert(1)</script>';
        const clean = sanitization.sanitizeUserInput(dirty);
        expect(clean).not.toContain('<script>');
        expect(clean).not.toContain('</script>');
    });

    it('sanitizeFileName geçersiz karakterleri temizler', () => {
        const dirty = 'test/../file.txt';
        const clean = sanitization.sanitizeFileName(dirty);
        expect(clean).toBe('test_.._file.txt');
    });

    it('sanitizeUrl geçerli bir URL döndürür', () => {
        const url = 'https://example.com/path?query=1';
        const clean = sanitization.sanitizeUrl(url);
        expect(clean).toBe(url);
    });

    it('sanitizePhoneNumber sadece rakamları döndürür', () => {
        const phone = '+90 (555) 123-45-67';
        const clean = sanitization.sanitizePhoneNumber(phone);
        expect(clean).toBe('+905551234567');
    });

    it('sanitizeEmail küçük harfe çevirir ve boşlukları kırpar', () => {
        const email = '  TEST@EXAMPLE.COM ';
        const clean = sanitization.sanitizeEmail(email);
        expect(clean).toBe('test@example.com');
    });

    it('sanitizeObject derin nesneleri temizler', () => {
        const obj = { a: '<b>test</b>', b: { c: '<script>bad()</script>' } };
        const clean = sanitization.sanitizeObject(obj, { stripHtml: true });
        expect(clean.a).toBe('test');
        expect(clean.b.c).toBe('bad()');
    });
});
