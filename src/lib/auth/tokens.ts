import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/lib/services/logger';
import { randomBytes } from 'crypto';
import { sign } from 'jsonwebtoken';
import { User } from '@prisma/client';

export async function generateVerificationToken(email: string) {
    try {
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        logger.info('Generating verification token', {
            action: 'generate_verification_token',
            email: email.split('@')[0] + '@***',
            expiresIn: '24h',
        });

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

        logger.info('Verification token created successfully', {
            action: 'verification_token_created',
            tokenLength: token.length,
        });

        return verificationToken;
    } catch (error) {
        logger.error(
            'Failed to generate verification token',
            error instanceof Error ? error : undefined,
            {
                action: 'generate_verification_token_failed',
                email: email.split('@')[0] + '@***',
            }
        );
        throw error;
    }
}

export async function generatePasswordResetToken(email: string) {
    try {
        const token = uuidv4();
        const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

        logger.info('Generating password reset token', {
            action: 'generate_password_reset_token',
            email: email.split('@')[0] + '@***',
            expiresIn: '1h',
        });

        // Log security event for password reset request
        logger.logSecurityEvent('password_reset_token_requested', {
            severity: 'medium',
            email: email.split('@')[0] + '@***',
            ip: logger.getContext().ip,
        });

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

        logger.info('Password reset token created successfully', {
            action: 'password_reset_token_created',
            tokenId: passwordResetToken.id,
        });

        return passwordResetToken;
    } catch (error) {
        logger.error(
            'Failed to generate password reset token',
            error instanceof Error ? error : undefined,
            {
                action: 'generate_password_reset_token_failed',
                email: email.split('@')[0] + '@***',
            }
        );
        throw error;
    }
}

export async function verifyPasswordResetToken(token: string) {
    try {
        logger.info('Verifying password reset token', {
            action: 'verify_password_reset_token',
            tokenLength: token.length,
        });

        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
        });

        if (!resetToken) {
            logger.warn('Invalid password reset token provided', {
                action: 'invalid_password_reset_token',
                tokenLength: token.length,
            });
            return { valid: false, error: 'Invalid token' };
        }

        if (resetToken.expires < new Date()) {
            logger.warn('Expired password reset token used', {
                action: 'expired_password_reset_token',
                email: resetToken.email.split('@')[0] + '@***',
                expiredAt: resetToken.expires.toISOString(),
            });

            // Delete expired token
            await prisma.passwordResetToken.delete({
                where: { token },
            });
            return { valid: false, error: 'Token has expired' };
        }

        logger.info('Password reset token verified successfully', {
            action: 'password_reset_token_verified',
            email: resetToken.email.split('@')[0] + '@***',
        });

        return { valid: true, email: resetToken.email };
    } catch (error) {
        logger.error('Token verification error', error instanceof Error ? error : undefined, {
            action: 'verify_password_reset_token_failed',
        });
        return { valid: false, error: 'Token verification failed' };
    }
}

export async function verifyToken(token: string) {
    try {
        logger.info('Verifying email verification token', {
            action: 'verify_email_token',
            tokenLength: token.length,
        });

        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
        });

        if (!verificationToken) {
            logger.warn('Invalid email verification token provided', {
                action: 'invalid_email_token',
                tokenLength: token.length,
            });
            return { valid: false, error: 'Invalid token' };
        }

        if (verificationToken.expires < new Date()) {
            logger.warn('Expired email verification token used', {
                action: 'expired_email_token',
                email: verificationToken.identifier.split('@')[0] + '@***',
                expiredAt: verificationToken.expires.toISOString(),
            });

            await prisma.verificationToken.delete({
                where: { token },
            });
            return { valid: false, error: 'Token expired' };
        }

        logger.info('Email verification token verified successfully', {
            action: 'email_token_verified',
            email: verificationToken.identifier.split('@')[0] + '@***',
        });

        return {
            valid: true,
            email: verificationToken.identifier,
        };
    } catch (error) {
        logger.error(
            'Email verification token verification failed',
            error instanceof Error ? error : undefined,
            {
                action: 'verify_email_token_failed',
            }
        );
        return { valid: false, error: 'Token verification failed' };
    }
}

export function getTokenType(identifier: string): 'EMAIL_VERIFICATION' | 'PASSWORD_RESET' {
    return identifier.startsWith('reset_') ? 'PASSWORD_RESET' : 'EMAIL_VERIFICATION';
}

export async function generatePasswordResetTokenWithPrefix(email: string) {
    try {
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        const identifier = `reset_${email}`;

        logger.info('Generating password reset token with prefix', {
            action: 'generate_password_reset_token_prefix',
            email: email.split('@')[0] + '@***',
            identifier: 'reset_***',
        });

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

        logger.info('Password reset token with prefix created', {
            action: 'password_reset_token_prefix_created',
            tokenLength: token.length,
        });

        return resetToken;
    } catch (error) {
        logger.error(
            'Failed to generate password reset token with prefix',
            error instanceof Error ? error : undefined,
            {
                action: 'generate_password_reset_token_prefix_failed',
                email: email.split('@')[0] + '@***',
            }
        );
        throw error;
    }
}

export async function verifyTokenWithType(token: string) {
    try {
        logger.info('Verifying token with type detection', {
            action: 'verify_token_with_type',
            tokenLength: token.length,
        });

        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
        });

        if (!verificationToken) {
            logger.warn('Invalid token provided for type verification', {
                action: 'invalid_token_with_type',
                tokenLength: token.length,
            });
            return { valid: false, error: 'Invalid token' };
        }

        if (verificationToken.expires < new Date()) {
            logger.warn('Expired token used for type verification', {
                action: 'expired_token_with_type',
                identifier: verificationToken.identifier.startsWith('reset_')
                    ? 'reset_***'
                    : verificationToken.identifier.split('@')[0] + '@***',
                expiredAt: verificationToken.expires.toISOString(),
            });

            await prisma.verificationToken.delete({
                where: { token },
            });
            return { valid: false, error: 'Token expired' };
        }

        const isPasswordReset = verificationToken.identifier.startsWith('reset_');
        const email = isPasswordReset
            ? verificationToken.identifier.replace('reset_', '')
            : verificationToken.identifier;

        logger.info('Token with type verified successfully', {
            action: 'token_with_type_verified',
            email: email.split('@')[0] + '@***',
            type: isPasswordReset ? 'PASSWORD_RESET' : 'EMAIL_VERIFICATION',
        });

        return {
            valid: true,
            email,
            type: isPasswordReset ? 'PASSWORD_RESET' : 'EMAIL_VERIFICATION',
            identifier: verificationToken.identifier,
        };
    } catch (error) {
        logger.error(
            'Token with type verification failed',
            error instanceof Error ? error : undefined,
            {
                action: 'verify_token_with_type_failed',
            }
        );
        return { valid: false, error: 'Token verification failed' };
    }
}

export async function generateRefreshToken(userId: string): Promise<string> {
    const token = randomBytes(40).toString('hex');
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 gün

    await prisma.refreshToken.create({
        data: {
            token,
            userId,
            expires,
        },
    });

    return token;
}

export async function refreshAccessToken(refreshToken: string) {
    try {
        const token = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });

        if (!token || token.expires < new Date()) {
            throw new Error('Invalid or expired refresh token');
        }

        // Eski refresh token'ı sil
        await prisma.refreshToken.delete({
            where: { id: token.id },
        });

        // Yeni access token ve refresh token oluştur
        const newRefreshToken = await generateRefreshToken(token.userId);
        const newAccessToken = await generateAccessToken(token.user);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
        };
    } catch (error) {
        console.error('Token refresh error:', error);
        throw error;
    }
}

export async function revokeRefreshToken(token: string) {
    await prisma.refreshToken.delete({
        where: { token },
    });
}

export async function generateAccessToken(user: User): Promise<string> {
    const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
        locale: user.locale,
        theme: user.theme,
    };

    return sign(payload, process.env.AUTH_SECRET!, {
        expiresIn: '30d',
    });
}
