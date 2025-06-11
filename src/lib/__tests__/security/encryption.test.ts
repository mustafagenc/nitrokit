import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as encryption from '../../security/encryption';

vi.mock('crypto', async (importOriginal) => {
    const actual = await importOriginal();
    return Object.assign({}, actual, {
        default: {
            randomBytes: vi.fn((len) => Buffer.alloc(len, 1)),
            createHmac: vi.fn(() => ({
                update: vi.fn().mockReturnThis(),
                digest: vi.fn(() => 'mocked-hmac'),
            })),
            scryptSync: vi.fn(() => Buffer.alloc(32, 2)),
            createHash: vi.fn(() => ({
                update: vi.fn().mockReturnThis(),
                digest: vi.fn(() => 'mocked-hash'),
            })),
            timingSafeEqual: vi.fn((a, b) => {
                if (Buffer.isBuffer(a) && Buffer.isBuffer(b)) {
                    return a.equals(b);
                }
                return a === b;
            }),
        },
        randomBytes: vi.fn((len) => Buffer.alloc(len, 1)),
        createHmac: vi.fn(() => ({
            update: vi.fn().mockReturnThis(),
            digest: vi.fn(() => 'mocked-hmac'),
        })),
        scryptSync: vi.fn(() => Buffer.alloc(32, 2)),
        createHash: vi.fn(() => ({
            update: vi.fn().mockReturnThis(),
            digest: vi.fn(() => 'mocked-hash'),
        })),
        timingSafeEqual: vi.fn((a, b) => {
            if (Buffer.isBuffer(a) && Buffer.isBuffer(b)) {
                return a.equals(b);
            }
            return a === b;
        }),
    });
});

describe('encryption utils', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('generateEncryptionKey bir hex string döndürür', () => {
        const key = encryption.generateEncryptionKey();
        expect(typeof key).toBe('string');
        expect(key.length).toBe(64);
    });

    it('generateSecureToken doğru uzunlukta string döndürür', () => {
        const token = encryption.generateSecureToken(16);
        expect(typeof token).toBe('string');
        expect(token.length).toBe(32);
    });

    it('createHmacSignature string döndürür', () => {
        const sig = encryption.createHmacSignature('data', 'secret');
        expect(sig).toBe('mocked-hmac');
    });

    it('maskSensitiveData doğru şekilde maskeleme yapar', () => {
        expect(encryption.maskSensitiveData('1234567890', 4)).toBe('1234******');
        expect(encryption.maskSensitiveData('abc', 4)).toBe('***');
    });

    it('maskEmail doğru şekilde maskeleme yapar', () => {
        expect(encryption.maskEmail('test@example.com')).toBe('te**@example.com');
        expect(encryption.maskEmail('a@b.com')).toBe('*@b.com');
    });

    it('maskCreditCard doğru şekilde maskeleme yapar', () => {
        expect(encryption.maskCreditCard('1234567812345678')).toBe('************5678');
        expect(encryption.maskCreditCard('123')).toBe('***');
    });

    it('maskPhoneNumber doğru şekilde maskeleme yapar', () => {
        expect(encryption.maskPhoneNumber('5551234567')).toBe('******4567');
        expect(encryption.maskPhoneNumber('123')).toBe('***');
    });

    it('generateSalt doğru uzunlukta string döndürür', () => {
        const salt = encryption.generateSalt(8);
        expect(typeof salt).toBe('string');
        expect(salt.length).toBe(16);
    });

    it('hashWithSalt hash ve salt döndürür', () => {
        const { hash, salt } = encryption.hashWithSalt('data', 'mysalt');
        expect(hash).toBe('mocked-hash');
        expect(salt).toBe('mysalt');
    });

    it('verifyHashWithSalt true döndürür', () => {
        const { hash, salt } = encryption.hashWithSalt('data', 'mysalt');
        const result = encryption.verifyHashWithSalt('data', hash, salt);
        expect(result).toBe(true);
    });

    it('deriveKey 32 byte buffer döndürür', () => {
        const buf = encryption.deriveKey('pass', 'salt');
        expect(Buffer.isBuffer(buf)).toBe(true);
        expect(buf.length).toBe(32);
    });

    it('generateSecureRandomString hex döndürür', () => {
        const str = encryption.generateSecureRandomString(8, 'hex');
        expect(typeof str).toBe('string');
        expect(str.length).toBe(8);
    });

    it('constantTimeEquals true döndürür', () => {
        expect(encryption.constantTimeEquals('abc', 'abc')).toBe(true);
    });
});
