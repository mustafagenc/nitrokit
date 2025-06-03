import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function generateVerificationToken(email: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.deleteMany({
        where: { identifier: email },
    });
    const verificationToken = await prisma.verificationToken.create({
        data: {
            identifier: email,
            token,
            expires,
        },
    });

    return verificationToken;
}

export async function generatePasswordResetToken(email: string) {
    const token = uuidv4();
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // Delete existing tokens for this email
    await prisma.passwordResetToken.deleteMany({
        where: { email },
    });

    // Create new token
    const passwordResetToken = await prisma.passwordResetToken.create({
        data: {
            email,
            token,
            expires,
        },
    });

    return passwordResetToken;
}

export async function verifyPasswordResetToken(token: string) {
    try {
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
        });

        if (!resetToken) {
            return { valid: false, error: 'Invalid token' };
        }

        if (resetToken.expires < new Date()) {
            // Delete expired token
            await prisma.passwordResetToken.delete({
                where: { token },
            });
            return { valid: false, error: 'Token has expired' };
        }

        return { valid: true, email: resetToken.email };
    } catch (error) {
        console.error('Token verification error:', error);
        return { valid: false, error: 'Token verification failed' };
    }
}

export async function verifyToken(token: string) {
    const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
    });

    if (!verificationToken) {
        return { valid: false, error: 'Invalid token' };
    }

    if (verificationToken.expires < new Date()) {
        await prisma.verificationToken.delete({
            where: { token },
        });
        return { valid: false, error: 'Token expired' };
    }

    return {
        valid: true,
        email: verificationToken.identifier,
    };
}

export function getTokenType(identifier: string): 'EMAIL_VERIFICATION' | 'PASSWORD_RESET' {
    return identifier.startsWith('reset_') ? 'PASSWORD_RESET' : 'EMAIL_VERIFICATION';
}

export async function generatePasswordResetTokenWithPrefix(email: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const identifier = `reset_${email}`;
    await prisma.verificationToken.deleteMany({
        where: {
            identifier,
        },
    });

    const resetToken = await prisma.verificationToken.create({
        data: {
            identifier,
            token,
            expires,
        },
    });

    return resetToken;
}

export async function verifyTokenWithType(token: string) {
    const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
    });

    if (!verificationToken) {
        return { valid: false, error: 'Invalid token' };
    }

    if (verificationToken.expires < new Date()) {
        await prisma.verificationToken.delete({
            where: { token },
        });
        return { valid: false, error: 'Token expired' };
    }

    const isPasswordReset = verificationToken.identifier.startsWith('reset_');
    const email = isPasswordReset
        ? verificationToken.identifier.replace('reset_', '')
        : verificationToken.identifier;

    return {
        valid: true,
        email,
        type: isPasswordReset ? 'PASSWORD_RESET' : 'EMAIL_VERIFICATION',
        identifier: verificationToken.identifier,
    };
}
