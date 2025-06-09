import { prisma } from '@/lib/prisma';
import { getSMSService } from '@/lib/services/sms';
import { logger } from '@/lib/services/logger';
import crypto from 'crypto';

export class PhoneVerificationService {
    private static readonly CODE_LENGTH = 6;
    private static readonly CODE_EXPIRY_MINUTES = 10;
    private static readonly MAX_ATTEMPTS = 3;
    private static readonly RATE_LIMIT_MINUTES = 1;

    private static readonly isDatabaseRateLimitingEnabled =
        process.env.SMS_RATE_LIMITING_ENABLED === 'true';

    static generateCode(): string {
        return crypto.randomInt(100000, 999999).toString();
    }

    private static formatPhoneNumber(phoneNumber: string): string {
        let formattedPhone = phoneNumber.trim();

        if (formattedPhone.startsWith('0')) {
            formattedPhone = '+90' + formattedPhone.substring(1);
        } else if (formattedPhone.startsWith('90')) {
            formattedPhone = '+' + formattedPhone;
        } else if (!formattedPhone.startsWith('+')) {
            formattedPhone = '+' + formattedPhone;
        }

        return formattedPhone;
    }

    private static validatePhoneNumber(phoneNumber: string): boolean {
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        return phoneRegex.test(phoneNumber);
    }

    static async sendVerificationCode(
        userId: string,
        phoneNumber: string
    ): Promise<{
        success: boolean;
        message: string;
        cooldownSeconds?: number;
    }> {
        try {
            logger.setUserId(userId);

            const formattedPhone = this.formatPhoneNumber(phoneNumber);

            logger.info('Initiating phone verification', {
                action: 'send_verification_code',
                originalPhone: phoneNumber.slice(-4),
                formattedPhone: formattedPhone.slice(-4),
            });

            if (!this.validatePhoneNumber(formattedPhone)) {
                logger.warn('Invalid phone number format provided', {
                    phoneNumber: phoneNumber.slice(-4),
                    formattedPhone: formattedPhone.slice(-4),
                });

                return {
                    success: false,
                    message:
                        'Invalid phone number format. Please use international format (+90...)',
                };
            }

            if (this.isDatabaseRateLimitingEnabled) {
                const recentRequest = await prisma.phoneVerification.findFirst({
                    where: {
                        userId,
                        phoneNumber: formattedPhone,
                        createdAt: {
                            gte: new Date(Date.now() - this.RATE_LIMIT_MINUTES * 60 * 1000),
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                });

                if (recentRequest) {
                    const cooldownSeconds = Math.ceil(
                        (this.RATE_LIMIT_MINUTES * 60 * 1000 -
                            (Date.now() - recentRequest.createdAt.getTime())) /
                            1000
                    );

                    logger.warn('Phone verification rate limit exceeded', {
                        cooldownSeconds,
                        phoneNumber: formattedPhone.slice(-4),
                    });

                    return {
                        success: false,
                        message: `Please wait ${cooldownSeconds} seconds before requesting another code`,
                        cooldownSeconds,
                    };
                }
            }

            const code = this.generateCode();
            const expiresAt = new Date(Date.now() + this.CODE_EXPIRY_MINUTES * 60 * 1000);

            const verification = await prisma.phoneVerification.create({
                data: {
                    userId,
                    phoneNumber: formattedPhone,
                    code,
                    expiresAt,
                    verified: false,
                    attempts: 0,
                },
            });

            logger.info('Verification code generated and stored', {
                verificationId: verification.id,
                expiresAt: expiresAt.toISOString(),
            });

            const smsService = getSMSService();
            const smsMessage = `Your Nitrokit verification code is: ${code}. Valid for ${this.CODE_EXPIRY_MINUTES} minutes.`;

            logger.logUserAction('send_verification_sms', 'phone_verification', {
                verificationId: verification.id,
                provider: smsService.getProviderType(),
                messageLength: smsMessage.length,
            });

            const smsResult = await smsService.sendSMS(formattedPhone, smsMessage);

            if (!smsResult.success) {
                logger.error('SMS verification code sending failed', undefined, {
                    verificationId: verification.id,
                    smsError: smsResult.error,
                    retryAfter: smsResult.retryAfter,
                    provider: smsService.getProviderType(),
                });

                return {
                    success: false,
                    message: smsResult.error || 'Failed to send SMS',
                    cooldownSeconds: smsResult.retryAfter || 0,
                };
            }

            logger.info('Verification code sent successfully', {
                verificationId: verification.id,
                messageId: smsResult.messageId,
                provider: smsService.getProviderType(),
            });

            logger.logUserAction('verification_code_sent', 'phone_verification', {
                verificationId: verification.id,
                messageId: smsResult.messageId,
            });

            return {
                success: true,
                message: 'Verification code sent successfully',
            };
        } catch (error) {
            logger.error(
                'Send verification code error',
                error instanceof Error ? error : undefined,
                {
                    phoneNumber: phoneNumber.slice(-4),
                    action: 'send_verification_code',
                }
            );

            return {
                success: false,
                message: 'Failed to send verification code. Please try again.',
            };
        }
    }

    static async verifyCode(
        userId: string,
        phoneNumber: string,
        code: string
    ): Promise<{
        success: boolean;
        message: string;
        verified?: boolean;
    }> {
        try {
            logger.setUserId(userId);

            const formattedPhone = this.formatPhoneNumber(phoneNumber);

            logger.info('Initiating code verification', {
                action: 'verify_code',
                phoneNumber: formattedPhone.slice(-4),
                codeLength: code.length,
            });

            const verification = await prisma.phoneVerification.findFirst({
                where: {
                    userId,
                    phoneNumber: formattedPhone,
                    verified: false,
                    expiresAt: { gte: new Date() },
                },
                orderBy: { createdAt: 'desc' },
            });

            if (!verification) {
                logger.warn('No valid verification code found', {
                    phoneNumber: formattedPhone.slice(-4),
                    action: 'verify_code',
                });

                return {
                    success: false,
                    message: 'No valid verification code found. Please request a new one.',
                };
            }

            if (verification.attempts >= this.MAX_ATTEMPTS) {
                logger.warn('Maximum verification attempts exceeded', {
                    verificationId: verification.id,
                    attempts: verification.attempts,
                    maxAttempts: this.MAX_ATTEMPTS,
                });

                logger.logUserAction('verification_max_attempts', 'phone_verification', {
                    verificationId: verification.id,
                    attempts: verification.attempts,
                });

                return {
                    success: false,
                    message: 'Too many failed attempts. Please request a new code.',
                };
            }

            await prisma.phoneVerification.update({
                where: { id: verification.id },
                data: { attempts: verification.attempts + 1 },
            });

            if (verification.code !== code) {
                const remainingAttempts = this.MAX_ATTEMPTS - (verification.attempts + 1);

                logger.warn('Invalid verification code provided', {
                    verificationId: verification.id,
                    attempts: verification.attempts + 1,
                    remainingAttempts,
                });

                logger.logUserAction('verification_code_invalid', 'phone_verification', {
                    verificationId: verification.id,
                    remainingAttempts,
                });

                return {
                    success: false,
                    message: `Invalid code. ${remainingAttempts} attempts remaining.`,
                };
            }

            await Promise.all([
                prisma.phoneVerification.update({
                    where: { id: verification.id },
                    data: { verified: true },
                }),
                prisma.user.update({
                    where: { id: userId },
                    data: {
                        phone: formattedPhone,
                        phoneVerified: true,
                        phoneVerifiedAt: new Date(),
                    },
                }),
            ]);

            logger.info('Phone verification successful', {
                verificationId: verification.id,
                phoneNumber: formattedPhone.slice(-4),
            });

            logger.logUserAction('phone_verified', 'phone_verification', {
                verificationId: verification.id,
                phoneNumber: formattedPhone.slice(-4),
            });

            logger.logSecurityEvent('phone_verification_success', {
                severity: 'low',
                verificationId: verification.id,
                phoneNumber: formattedPhone.slice(-4),
            });

            return {
                success: true,
                message: 'Phone number verified successfully!',
                verified: true,
            };
        } catch (error) {
            logger.error('Verify code error', error instanceof Error ? error : undefined, {
                phoneNumber: phoneNumber.slice(-4),
                action: 'verify_code',
            });

            return {
                success: false,
                message: 'Failed to verify code. Please try again.',
            };
        }
    }

    static async isPhoneVerified(userId: string, phoneNumber: string): Promise<boolean> {
        try {
            const formattedPhone = this.formatPhoneNumber(phoneNumber);

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { phone: true, phoneVerified: true },
            });

            const isVerified = user?.phone === formattedPhone && user?.phoneVerified === true;

            logger.debug('Phone verification status checked', {
                userId,
                phoneNumber: formattedPhone.slice(-4),
                isVerified,
            });

            return isVerified;
        } catch (error) {
            logger.error(
                'Check phone verification error',
                error instanceof Error ? error : undefined,
                {
                    userId,
                    phoneNumber: phoneNumber.slice(-4),
                }
            );

            return false;
        }
    }

    static async getVerificationStats(userId: string): Promise<{
        totalAttempts: number;
        successfulVerifications: number;
        pendingVerifications: number;
    }> {
        try {
            logger.setUserId(userId);

            const [totalAttempts, successfulVerifications, pendingVerifications] =
                await Promise.all([
                    prisma.phoneVerification.count({
                        where: { userId },
                    }),
                    prisma.phoneVerification.count({
                        where: { userId, verified: true },
                    }),
                    prisma.phoneVerification.count({
                        where: {
                            userId,
                            verified: false,
                            expiresAt: { gte: new Date() },
                        },
                    }),
                ]);

            logger.info('Verification stats retrieved', {
                totalAttempts,
                successfulVerifications,
                pendingVerifications,
            });

            return {
                totalAttempts,
                successfulVerifications,
                pendingVerifications,
            };
        } catch (error) {
            logger.error(
                'Get verification stats error',
                error instanceof Error ? error : undefined,
                {
                    userId,
                }
            );

            return {
                totalAttempts: 0,
                successfulVerifications: 0,
                pendingVerifications: 0,
            };
        }
    }

    static async cleanupExpiredVerifications(): Promise<number> {
        try {
            const result = await prisma.phoneVerification.deleteMany({
                where: {
                    expiresAt: { lt: new Date() },
                    verified: false,
                },
            });

            logger.info('Expired verifications cleaned up', {
                deletedCount: result.count,
                action: 'cleanup_expired_verifications',
            });

            return result.count;
        } catch (error) {
            logger.error(
                'Cleanup expired verifications error',
                error instanceof Error ? error : undefined
            );
            return 0;
        }
    }

    static isRateLimitingEnabled(): boolean {
        return this.isDatabaseRateLimitingEnabled;
    }

    static getConfiguration(): {
        codeLength: number;
        expiryMinutes: number;
        maxAttempts: number;
        rateLimitMinutes: number;
        rateLimitingEnabled: boolean;
    } {
        return {
            codeLength: this.CODE_LENGTH,
            expiryMinutes: this.CODE_EXPIRY_MINUTES,
            maxAttempts: this.MAX_ATTEMPTS,
            rateLimitMinutes: this.RATE_LIMIT_MINUTES,
            rateLimitingEnabled: this.isDatabaseRateLimitingEnabled,
        };
    }
}
