import { prisma } from '@/lib/prisma';
import { getSMSService } from './sms-service';
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

    static async sendVerificationCode(
        userId: string,
        phoneNumber: string
    ): Promise<{
        success: boolean;
        message: string;
        cooldownSeconds?: number;
    }> {
        try {
            let formattedPhone = phoneNumber.trim();

            // Türkiye numarası için format düzeltme
            if (formattedPhone.startsWith('0')) {
                formattedPhone = '+90' + formattedPhone.substring(1);
            } else if (formattedPhone.startsWith('90')) {
                formattedPhone = '+' + formattedPhone;
            } else if (!formattedPhone.startsWith('+')) {
                formattedPhone = '+' + formattedPhone;
            }

            console.log('📱 Phone number formatting:');
            console.log('- Original:', phoneNumber);
            console.log('- Formatted:', formattedPhone);

            // Geçerli telefon numarası kontrol (basit)
            const phoneRegex = /^\+[1-9]\d{1,14}$/;
            if (!phoneRegex.test(formattedPhone)) {
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
                    return {
                        success: false,
                        message: `Please wait ${cooldownSeconds} seconds before requesting another code`,
                        cooldownSeconds,
                    };
                }
            }

            const code = this.generateCode();
            const expiresAt = new Date(Date.now() + this.CODE_EXPIRY_MINUTES * 60 * 1000);

            await prisma.phoneVerification.create({
                data: {
                    userId,
                    phoneNumber: formattedPhone,
                    code,
                    expiresAt,
                    verified: false,
                    attempts: 0,
                },
            });

            const smsService = getSMSService();
            const smsResult = await smsService.sendSMS(
                formattedPhone,
                `Your NitroKit verification code is: ${code}. Valid for ${this.CODE_EXPIRY_MINUTES} minutes.`
            );

            if (!smsResult.success) {
                const errorMessage = smsResult.error || 'Failed to send SMS';
                const cooldownSeconds = smsResult.retryAfter || 0;

                return {
                    success: false,
                    message: errorMessage,
                    cooldownSeconds,
                };
            }

            return {
                success: true,
                message: 'Verification code sent successfully',
            };
        } catch (error) {
            console.error('Send verification error:', error);
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
            const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

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
                return {
                    success: false,
                    message: 'No valid verification code found. Please request a new one.',
                };
            }

            if (verification.attempts >= this.MAX_ATTEMPTS) {
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

            return {
                success: true,
                message: 'Phone number verified successfully!',
                verified: true,
            };
        } catch (error) {
            console.error('Verify code error:', error);
            return {
                success: false,
                message: 'Failed to verify code. Please try again.',
            };
        }
    }

    static async isPhoneVerified(userId: string, phoneNumber: string): Promise<boolean> {
        const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { phone: true, phoneVerified: true },
        });

        return user?.phone === formattedPhone && user?.phoneVerified === true;
    }

    static isRateLimitingEnabled(): boolean {
        return this.isDatabaseRateLimitingEnabled;
    }
}
