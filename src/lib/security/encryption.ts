import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { logger } from '@/lib/services/logger';

// Configuration
const ALGORITHM = 'aes-256-gcm';
const SALT_ROUNDS = 12;

// Type definitions
interface EncryptedData {
    encrypted: string;
    iv: string;
    authTag: string;
}

interface TokenVerificationResult {
    valid: boolean;
    payload?: Record<string, unknown>;
    error?: string;
}

interface SessionTokenData extends Record<string, unknown> {
    userId: string;
    email: string;
    role: string;
    sessionId: string;
}

interface ApiTokenData extends Record<string, unknown> {
    clientId: string;
    scopes: string[];
    rateLimit: number;
}

interface BaseTokenData extends Record<string, unknown> {
    [key: string]: unknown;
}

// Type guards
function isString(value: unknown): value is string {
    return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
    return typeof value === 'number' && !isNaN(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

// Get encryption key from environment
function getEncryptionKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
        throw new Error('ENCRYPTION_KEY environment variable is required');
    }

    try {
        return Buffer.from(key, 'hex');
    } catch {
        throw new Error('Invalid ENCRYPTION_KEY format. Must be a valid hex string.');
    }
}

// Generate encryption key (for setup)
export function generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex');
}

// Validate encryption input
function validateEncryptionInput(text: string): void {
    if (!isString(text)) {
        throw new Error('Input must be a string');
    }
    if (text.length === 0) {
        throw new Error('Input cannot be empty');
    }
    if (text.length > 1000000) {
        // 1MB limit
        throw new Error('Input too large (max 1MB)');
    }
}

// Symmetric encryption with createCipheriv
export function encrypt(text: string): EncryptedData {
    try {
        validateEncryptionInput(text);

        const key = getEncryptionKey();
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        cipher.setAAD(Buffer.from('nitrokit', 'utf8'));

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        logger.debug('Data encrypted successfully', {
            inputLength: text.length,
            algorithm: ALGORITHM,
        });

        return {
            encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex'),
        };
    } catch (error) {
        logger.error('Encryption failed', error instanceof Error ? error : undefined, {
            inputLength: isString(text) ? text.length : 0,
        });
        throw new Error('Encryption failed');
    }
}

// Validate encrypted data
function validateEncryptedData(encryptedData: EncryptedData): void {
    if (!isRecord(encryptedData)) {
        throw new Error('Invalid encrypted data format');
    }

    const { encrypted, iv, authTag } = encryptedData;

    if (!isString(encrypted) || !isString(iv) || !isString(authTag)) {
        throw new Error('Invalid encrypted data properties');
    }

    if (encrypted.length === 0 || iv.length === 0 || authTag.length === 0) {
        throw new Error('Encrypted data properties cannot be empty');
    }
}

// Symmetric decryption with createDecipheriv
export function decrypt(encryptedData: EncryptedData): string {
    try {
        validateEncryptedData(encryptedData);

        const key = getEncryptionKey();
        const iv = Buffer.from(encryptedData.iv, 'hex');

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAAD(Buffer.from('nitrokit', 'utf8'));
        decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

        let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        logger.debug('Data decrypted successfully', {
            algorithm: ALGORITHM,
        });

        return decrypted;
    } catch (error) {
        logger.error('Decryption failed', error instanceof Error ? error : undefined);
        throw new Error('Decryption failed');
    }
}

// Password validation
function validatePassword(password: string): void {
    if (!isString(password)) {
        throw new Error('Password must be a string');
    }
    if (password.length === 0) {
        throw new Error('Password cannot be empty');
    }
    if (password.length > 256) {
        throw new Error('Password too long (max 256 characters)');
    }
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
    try {
        validatePassword(password);

        logger.debug('Hashing password', {
            passwordLength: password.length,
            saltRounds: SALT_ROUNDS,
        });

        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hash = await bcrypt.hash(password, salt);

        logger.debug('Password hashed successfully');

        return hash;
    } catch (error) {
        logger.error('Password hashing failed', error instanceof Error ? error : undefined);
        throw new Error('Password hashing failed');
    }
}

// Password verification
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
        validatePassword(password);

        if (!isString(hash)) {
            logger.warn('Invalid hash format for password verification');
            return false;
        }

        logger.debug('Verifying password', {
            passwordLength: password.length,
            hashLength: hash.length,
        });

        const isValid = await bcrypt.compare(password, hash);

        logger.debug('Password verification completed', {
            isValid,
        });

        return isValid;
    } catch (error) {
        logger.error('Password verification failed', error instanceof Error ? error : undefined);
        return false;
    }
}

// Generate secure random token
export function generateSecureToken(length: number = 32): string {
    if (!isNumber(length) || length <= 0 || length > 256) {
        throw new Error('Invalid token length (must be 1-256)');
    }

    return crypto.randomBytes(length).toString('hex');
}

// Generate UUID v4
export function generateUUID(): string {
    return crypto.randomUUID();
}

// HMAC signature
export function createHmacSignature(data: string, secret: string): string {
    if (!isString(data) || !isString(secret)) {
        throw new Error('Data and secret must be strings');
    }

    if (data.length === 0 || secret.length === 0) {
        throw new Error('Data and secret cannot be empty');
    }

    return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

// Verify HMAC signature
export function verifyHmacSignature(data: string, signature: string, secret: string): boolean {
    try {
        if (!isString(data) || !isString(signature) || !isString(secret)) {
            return false;
        }

        if (data.length === 0 || signature.length === 0 || secret.length === 0) {
            return false;
        }

        const expectedSignature = createHmacSignature(data, secret);
        return crypto.timingSafeEqual(
            Buffer.from(signature, 'hex'),
            Buffer.from(expectedSignature, 'hex')
        );
    } catch (error) {
        logger.error('HMAC verification failed', error instanceof Error ? error : undefined);
        return false;
    }
}

export function createJwtToken<T extends BaseTokenData>(
    payload: T,
    expiresIn: number = 3600
): string {
    try {
        if (!isRecord(payload)) {
            throw new Error('Payload must be an object');
        }

        if (!isNumber(expiresIn) || expiresIn <= 0) {
            throw new Error('ExpiresIn must be a positive number');
        }

        const header = { alg: 'HS256', typ: 'JWT' };
        const now = Math.floor(Date.now() / 1000);
        const exp = now + expiresIn;

        const tokenPayload: BaseTokenData = {
            ...payload,
            iat: now,
            exp,
        };

        const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
        const encodedPayload = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable is required');
        }

        const signature = createHmacSignature(`${encodedHeader}.${encodedPayload}`, jwtSecret);

        logger.debug('JWT token created', {
            payloadKeys: Object.keys(payload).join(', '),
            expiresIn,
        });

        return `${encodedHeader}.${encodedPayload}.${signature}`;
    } catch (error) {
        logger.error('JWT token creation failed', error instanceof Error ? error : undefined);
        throw new Error('JWT token creation failed');
    }
}

// Verify JWT token
export function verifyJwtToken(token: string): TokenVerificationResult {
    try {
        if (!isString(token) || token.length === 0) {
            return { valid: false, error: 'Invalid token format' };
        }

        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            return { valid: false, error: 'Invalid token format' };
        }

        const [header, payload, signature] = tokenParts;

        if (!header || !payload || !signature) {
            return { valid: false, error: 'Invalid token format' };
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return { valid: false, error: 'JWT_SECRET not configured' };
        }

        // Verify signature
        const expectedSignature = createHmacSignature(`${header}.${payload}`, jwtSecret);

        if (signature !== expectedSignature) {
            logger.warn('Token signature verification failed');
            return { valid: false, error: 'Invalid signature' };
        }

        // Decode payload
        let decodedPayload: Record<string, unknown>;
        try {
            const payloadString = Buffer.from(payload, 'base64url').toString();
            decodedPayload = JSON.parse(payloadString);
        } catch {
            return { valid: false, error: 'Invalid payload format' };
        }

        // Check expiration
        if (decodedPayload.exp && isNumber(decodedPayload.exp)) {
            const now = Math.floor(Date.now() / 1000);
            if (decodedPayload.exp < now) {
                logger.debug('Token expired', {
                    exp: decodedPayload.exp,
                    now,
                });
                return { valid: false, error: 'Token expired' };
            }
        }

        logger.debug('Token verified successfully');
        return { valid: true, payload: decodedPayload };
    } catch (error) {
        logger.error('Token verification failed', error instanceof Error ? error : undefined);
        return { valid: false, error: 'Token verification failed' };
    }
}

// Data masking for logs
export function maskSensitiveData(data: string, visibleChars: number = 4): string {
    if (!isString(data)) {
        return '';
    }

    if (data.length <= visibleChars) {
        return '*'.repeat(data.length);
    }

    return data.substring(0, visibleChars) + '*'.repeat(data.length - visibleChars);
}

// Email masking
export function maskEmail(email: string): string {
    if (!isString(email)) {
        return '';
    }

    const emailParts = email.split('@');
    if (emailParts.length !== 2) {
        return email;
    }

    const [local, domain] = emailParts;
    if (!local || !domain) {
        return email;
    }

    const maskedLocal =
        local.length > 2
            ? local.substring(0, 2) + '*'.repeat(local.length - 2)
            : '*'.repeat(local.length);

    return `${maskedLocal}@${domain}`;
}

// Credit card masking
export function maskCreditCard(cardNumber: string): string {
    if (!isString(cardNumber)) {
        return '';
    }

    const cleanNumber = cardNumber.replace(/\D/g, '');
    if (cleanNumber.length < 4) {
        return '*'.repeat(cleanNumber.length);
    }

    const lastFour = cleanNumber.slice(-4);
    const masked = '*'.repeat(cleanNumber.length - 4) + lastFour;

    return masked;
}

// Phone number masking
export function maskPhoneNumber(phone: string): string {
    if (!isString(phone)) {
        return '';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 4) {
        return '*'.repeat(cleanPhone.length);
    }

    const lastFour = cleanPhone.slice(-4);
    const masked = '*'.repeat(cleanPhone.length - 4) + lastFour;

    return masked;
}

// Advanced encryption for sensitive data
export function encryptSensitiveData(data: string, userKey?: string): EncryptedData {
    try {
        validateEncryptionInput(data);

        const key = userKey ? crypto.scryptSync(userKey, 'salt', 32) : getEncryptionKey();

        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

        // Additional authentication data for sensitive data
        const timestamp = Date.now().toString();
        const aad = Buffer.from(`nitrokit-sensitive-${timestamp}`, 'utf8');
        cipher.setAAD(aad);

        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        logger.debug('Sensitive data encrypted', {
            hasUserKey: !!userKey,
            dataLength: data.length,
        });

        return {
            encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex'),
        };
    } catch (error) {
        logger.error(
            'Sensitive data encryption failed',
            error instanceof Error ? error : undefined
        );
        throw new Error('Sensitive data encryption failed');
    }
}

// Decrypt sensitive data
export function decryptSensitiveData(encryptedData: EncryptedData, userKey?: string): string {
    try {
        validateEncryptedData(encryptedData);

        const key = userKey ? crypto.scryptSync(userKey, 'salt', 32) : getEncryptionKey();

        const iv = Buffer.from(encryptedData.iv, 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

        // Note: In production, you'd need to store the AAD with the encrypted data
        const aad = Buffer.from('nitrokit-sensitive', 'utf8');
        decipher.setAAD(aad);
        decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

        let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        logger.debug('Sensitive data decrypted successfully');

        return decrypted;
    } catch (error) {
        logger.error(
            'Sensitive data decryption failed',
            error instanceof Error ? error : undefined
        );
        throw new Error('Sensitive data decryption failed');
    }
}

// Generate key derivation
export function deriveKey(password: string, salt: string): Buffer {
    if (!isString(password) || !isString(salt)) {
        throw new Error('Password and salt must be strings');
    }

    if (password.length === 0 || salt.length === 0) {
        throw new Error('Password and salt cannot be empty');
    }

    return crypto.scryptSync(password, salt, 32);
}

// Generate random salt
export function generateSalt(length: number = 16): string {
    if (!isNumber(length) || length <= 0 || length > 64) {
        throw new Error('Invalid salt length (must be 1-64)');
    }

    return crypto.randomBytes(length).toString('hex');
}

// Hash data with salt
export function hashWithSalt(data: string, salt?: string): { hash: string; salt: string } {
    if (!isString(data)) {
        throw new Error('Data must be a string');
    }

    const usedSalt = salt || generateSalt();
    const hash = crypto
        .createHash('sha256')
        .update(data + usedSalt)
        .digest('hex');

    return { hash, salt: usedSalt };
}

// Verify hash with salt
export function verifyHashWithSalt(data: string, hash: string, salt: string): boolean {
    try {
        if (!isString(data) || !isString(hash) || !isString(salt)) {
            return false;
        }

        const computed = crypto
            .createHash('sha256')
            .update(data + salt)
            .digest('hex');
        return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computed, 'hex'));
    } catch (error) {
        logger.error('Hash verification failed', error instanceof Error ? error : undefined);
        return false;
    }
}

// Type guard for SessionTokenData
function isSessionTokenData(data: unknown): data is SessionTokenData {
    if (!isRecord(data)) return false;

    const { userId, email, role, sessionId } = data;
    return (
        isString(userId) &&
        userId.length > 0 &&
        isString(email) &&
        email.includes('@') &&
        isString(role) &&
        role.length > 0 &&
        isString(sessionId) &&
        sessionId.length > 0
    );
}

export function createSessionToken(
    userData: SessionTokenData,
    expiresIn: number = 86400 // 24 hours
): string {
    if (!isSessionTokenData(userData)) {
        throw new Error('Invalid session token data');
    }

    if (!isNumber(expiresIn) || expiresIn <= 0) {
        throw new Error('ExpiresIn must be a positive number');
    }

    return createJwtToken(userData, expiresIn);
}

export function verifySessionToken(token: string): {
    valid: boolean;
    userData?: SessionTokenData;
    error?: string;
} {
    const result = verifyJwtToken(token);

    if (!result.valid) {
        return {
            valid: false,
            error: result.error,
        };
    }

    if (!result.payload || !isSessionTokenData(result.payload)) {
        return {
            valid: false,
            error: 'Invalid session data format',
        };
    }

    return {
        valid: true,
        userData: result.payload,
    };
}

// Type guard for ApiTokenData
function isApiTokenData(data: unknown): data is ApiTokenData {
    if (!isRecord(data)) return false;

    const { clientId, scopes, rateLimit } = data;
    return (
        isString(clientId) &&
        clientId.length > 0 &&
        Array.isArray(scopes) &&
        scopes.every((scope) => isString(scope)) &&
        isNumber(rateLimit) &&
        rateLimit > 0
    );
}

export function createApiToken(
    apiData: ApiTokenData,
    expiresIn: number = 3600 // 1 hour
): string {
    if (!isApiTokenData(apiData)) {
        throw new Error('Invalid API token data');
    }

    if (!isNumber(expiresIn) || expiresIn <= 0) {
        throw new Error('ExpiresIn must be a positive number');
    }

    // Convert scopes array to string for token storage
    const tokenData: BaseTokenData = {
        clientId: apiData.clientId,
        scopes: apiData.scopes.join(','),
        rateLimit: apiData.rateLimit,
    };

    logger.debug('Creating API token', {
        clientId: apiData.clientId,
        scopeCount: apiData.scopes.length,
        scopeList: apiData.scopes.join(', '),
        rateLimit: apiData.rateLimit,
    });

    return createJwtToken(tokenData, expiresIn);
}

export function createToken(payload: SessionTokenData, expiresIn?: number): string;
export function createToken(payload: ApiTokenData, expiresIn?: number): string;
export function createToken(payload: BaseTokenData, expiresIn?: number): string;
export function createToken(payload: BaseTokenData, expiresIn: number = 3600): string {
    return createJwtToken(payload, expiresIn);
}

// ✅ Type-safe token creation helpers
export function createUserSessionToken(
    userId: string,
    email: string,
    role: string,
    sessionId: string,
    expiresIn: number = 86400
): string {
    const userData: SessionTokenData = {
        userId,
        email,
        role,
        sessionId,
    };

    return createSessionToken(userData, expiresIn);
}

export function createClientApiToken(
    clientId: string,
    scopes: string[],
    rateLimit: number,
    expiresIn: number = 3600
): string {
    const apiData: ApiTokenData = {
        clientId,
        scopes,
        rateLimit,
    };

    return createApiToken(apiData, expiresIn);
}

// ✅ Generic token creation for custom data
export function createCustomToken<T extends Record<string, unknown>>(
    customData: T,
    expiresIn: number = 3600
): string {
    // Ensure the data extends BaseTokenData
    const tokenData: BaseTokenData = {
        ...customData,
    };

    return createJwtToken(tokenData, expiresIn);
}

// ✅ Enhanced verification with better type inference
export function verifyTokenWithType<T extends BaseTokenData>(
    token: string,
    validator: (data: unknown) => data is T
): {
    valid: boolean;
    data?: T;
    error?: string;
} {
    const result = verifyJwtToken(token);

    if (!result.valid) {
        return {
            valid: false,
            error: result.error,
        };
    }

    if (!result.payload || !validator(result.payload)) {
        return {
            valid: false,
            error: 'Invalid token data format',
        };
    }

    return {
        valid: true,
        data: result.payload as T,
    };
}

export function verifyApiToken(token: string): {
    valid: boolean;
    apiData?: ApiTokenData;
    error?: string;
} {
    const result = verifyJwtToken(token);

    if (!result.valid) {
        return {
            valid: false,
            error: result.error,
        };
    }

    if (!result.payload || !isRecord(result.payload)) {
        return {
            valid: false,
            error: 'Invalid API token format',
        };
    }

    const { clientId, scopes, rateLimit } = result.payload;

    if (!isString(clientId) || !isString(scopes) || !isNumber(rateLimit)) {
        return {
            valid: false,
            error: 'Invalid API token data format',
        };
    }

    const apiData: ApiTokenData = {
        clientId,
        scopes: scopes.split(',').filter((scope) => scope.length > 0),
        rateLimit,
    };

    return {
        valid: true,
        apiData,
    };
}

// Generate secure random string
export function generateSecureRandomString(length: number = 32, charset: string = 'hex'): string {
    if (!isNumber(length) || length <= 0 || length > 1024) {
        throw new Error('Invalid length (must be 1-1024)');
    }

    const validCharsets = ['hex', 'base64', 'base64url'];
    if (!validCharsets.includes(charset)) {
        throw new Error(`Invalid charset. Must be one of: ${validCharsets.join(', ')}`);
    }

    const bytes = crypto.randomBytes(Math.ceil((length * 3) / 4));

    switch (charset) {
        case 'hex':
            return bytes.toString('hex').substring(0, length);
        case 'base64':
            return bytes.toString('base64').substring(0, length);
        case 'base64url':
            return bytes.toString('base64url').substring(0, length);
        default:
            return bytes.toString('hex').substring(0, length);
    }
}

// Constant-time string comparison
export function constantTimeEquals(a: string, b: string): boolean {
    if (!isString(a) || !isString(b)) {
        return false;
    }

    if (a.length !== b.length) {
        return false;
    }

    try {
        return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
    } catch {
        return false;
    }
}
