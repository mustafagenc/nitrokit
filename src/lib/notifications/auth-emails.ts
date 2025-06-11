import { render } from '@react-email/render';
import { VerificationEmail } from '@/components/emails/verification-email';
import { PasswordResetEmail } from '@/components/emails/password-reset-email';
import { WelcomeEmail } from '@/components/emails/welcome-email';
import { getBaseUrl } from '@/lib';
import { getEmailService } from '@/lib/services/email';
import { logger } from '@/lib/services/logger';

interface SendVerificationEmailProps {
    email: string;
    name: string;
    token: string;
    userId?: string;
}

interface SendPasswordResetEmailProps {
    email: string;
    name: string;
    token: string;
    userId?: string;
}

interface SendWelcomeEmailProps {
    email: string;
    name: string;
    userId?: string;
}

export async function sendVerificationEmail({
    email,
    name,
    token,
    userId,
}: SendVerificationEmailProps) {
    try {
        if (userId) {
            logger.setUserId(userId);
        }

        const verificationUrl = `${getBaseUrl()}/api/auth/verify-email?token=${token}`;

        logger.info('Preparing verification email', {
            action: 'send_verification_email',
            email: email.split('@')[0] + '@***', // Privacy: hide domain
            hasName: !!name,
            tokenLength: token.length,
        });

        const emailHtml = await render(
            VerificationEmail({
                name,
                verificationUrl,
            })
        );

        const emailService = getEmailService();

        logger.logUserAction('send_verification_email', 'auth', {
            email: email.split('@')[0] + '@***',
            provider: emailService.getProviderType(),
        });

        const result = await emailService.sendEmail({
            to: email,
            subject: 'Verify your email address - Nitrokit 🚀',
            html: emailHtml,
            metadata: {
                type: 'verification',
                userId: userId || 'unknown',
                tokenLength: token.length,
            },
            priority: 'high',
        });

        if (!result.success) {
            logger.error('Verification email failed to send', undefined, {
                email: email.split('@')[0] + '@***',
                error: result.error,
                provider: emailService.getProviderType(),
            });

            throw new Error(`Failed to send verification email: ${result.error}`);
        }

        logger.info('Verification email sent successfully', {
            messageId: result.messageId,
            email: email.split('@')[0] + '@***',
            provider: emailService.getProviderType(),
        });

        logger.logUserAction('verification_email_sent', 'auth', {
            messageId: result.messageId,
            email: email.split('@')[0] + '@***',
        });

        return {
            success: true,
            id: result.messageId,
            message: 'Verification email sent successfully',
        };
    } catch (error) {
        logger.error('Send verification email error', error instanceof Error ? error : undefined, {
            email: email.split('@')[0] + '@***',
            action: 'send_verification_email',
        });

        throw error;
    }
}

export async function sendPasswordResetEmail({
    email,
    name,
    token,
    userId,
}: SendPasswordResetEmailProps) {
    try {
        if (userId) {
            logger.setUserId(userId);
        }

        const resetUrl = `${getBaseUrl()}/new-password?token=${token}`;

        logger.info('Preparing password reset email', {
            action: 'send_password_reset_email',
            email: email.split('@')[0] + '@***',
            hasName: !!name,
            tokenLength: token.length,
        });

        const emailHtml = await render(
            PasswordResetEmail({
                name,
                resetUrl,
            })
        );

        const emailService = getEmailService();

        // Log security event for password reset request
        logger.logSecurityEvent('password_reset_requested', {
            severity: 'medium',
            email: email.split('@')[0] + '@***',
            ip: logger.getContext().ip,
            userAgent: logger.getContext().userAgent,
        });

        logger.logUserAction('send_password_reset_email', 'auth', {
            email: email.split('@')[0] + '@***',
            provider: emailService.getProviderType(),
        });

        const result = await emailService.sendEmail({
            to: email,
            subject: 'Reset your password - Nitrokit 🚀',
            html: emailHtml,
            metadata: {
                type: 'password_reset',
                userId: userId || 'unknown',
                tokenLength: token.length,
                securityLevel: 'high',
            },
            priority: 'high',
        });

        if (!result.success) {
            logger.error('Password reset email failed to send', undefined, {
                email: email.split('@')[0] + '@***',
                error: result.error,
                provider: emailService.getProviderType(),
            });

            throw new Error(`Failed to send password reset email: ${result.error}`);
        }

        logger.info('Password reset email sent successfully', {
            messageId: result.messageId,
            email: email.split('@')[0] + '@***',
            provider: emailService.getProviderType(),
        });

        logger.logUserAction('password_reset_email_sent', 'auth', {
            messageId: result.messageId,
            email: email.split('@')[0] + '@***',
        });

        return {
            success: true,
            id: result.messageId,
            message: 'Password reset email sent successfully',
        };
    } catch (error) {
        logger.error(
            'Send password reset email error',
            error instanceof Error ? error : undefined,
            {
                email: email.split('@')[0] + '@***',
                action: 'send_password_reset_email',
            }
        );

        throw error;
    }
}

export async function sendWelcomeEmail({ email, name, userId }: SendWelcomeEmailProps) {
    try {
        // Set user context if available
        if (userId) {
            logger.setUserId(userId);
        }

        const dashboardUrl = `${getBaseUrl()}/dashboard`;

        logger.info('Preparing welcome email', {
            action: 'send_welcome_email',
            email: email.split('@')[0] + '@***',
            hasName: !!name,
        });

        const emailHtml = await render(
            WelcomeEmail({
                name,
                dashboardUrl,
            })
        );

        const emailService = getEmailService();

        logger.logUserAction('send_welcome_email', 'auth', {
            email: email.split('@')[0] + '@***',
            provider: emailService.getProviderType(),
        });

        const result = await emailService.sendEmail({
            to: email,
            subject: 'Welcome to Nitrokit! 🚀',
            html: emailHtml,
            metadata: {
                type: 'welcome',
                userId: userId || 'unknown',
                signupDate: new Date().toISOString(),
            },
            priority: 'normal',
        });

        if (!result.success) {
            logger.warn('Welcome email failed to send (non-critical)', {
                email: email.split('@')[0] + '@***',
                error: result.error,
                provider: emailService.getProviderType(),
            });

            // Don't throw for welcome emails - they're not critical
            return {
                success: false,
                error: result.error,
                message: 'Welcome email failed to send',
            };
        }

        logger.info('Welcome email sent successfully', {
            messageId: result.messageId,
            email: email.split('@')[0] + '@***',
            provider: emailService.getProviderType(),
        });

        logger.logUserAction('welcome_email_sent', 'auth', {
            messageId: result.messageId,
            email: email.split('@')[0] + '@***',
        });

        return {
            success: true,
            id: result.messageId,
            message: 'Welcome email sent successfully',
        };
    } catch (error) {
        logger.warn('Send welcome email error (non-critical)', {
            email: email.split('@')[0] + '@***',
            error: error instanceof Error ? error.message : 'Unknown error',
            action: 'send_welcome_email',
        });

        // Don't throw for welcome emails - they're not critical
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            message: 'Welcome email failed to send',
        };
    }
}

// Bulk email functions
export async function sendBulkVerificationEmails(
    emails: Array<{ email: string; name: string; token: string; userId?: string }>
): Promise<{
    total: number;
    successful: number;
    failed: number;
    results: Array<{ email: string; success: boolean; messageId?: string; error?: string }>;
}> {
    logger.info('Starting bulk verification email send', {
        total: emails.length,
        action: 'bulk_verification_emails',
    });

    const results = [];
    let successful = 0;

    for (const { email, name, token, userId } of emails) {
        try {
            const result = await sendVerificationEmail({ email, name, token, userId });
            results.push({
                email: email.split('@')[0] + '@***',
                success: true,
                messageId: result.id,
            });
            successful++;
        } catch (error) {
            results.push({
                email: email.split('@')[0] + '@***',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }

        // Rate limiting delay
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    logger.info('Bulk verification email send completed', {
        total: emails.length,
        successful,
        failed: emails.length - successful,
    });

    return {
        total: emails.length,
        successful,
        failed: emails.length - successful,
        results,
    };
}

export async function sendBulkWelcomeEmails(
    emails: Array<{ email: string; name: string; userId?: string }>
): Promise<{
    total: number;
    successful: number;
    failed: number;
    results: Array<{ email: string; success: boolean; messageId?: string; error?: string }>;
}> {
    logger.info('Starting bulk welcome email send', {
        total: emails.length,
        action: 'bulk_welcome_emails',
    });

    const results = [];
    let successful = 0;

    for (const { email, name, userId } of emails) {
        try {
            const result = await sendWelcomeEmail({ email, name, userId });
            if (result.success) {
                results.push({
                    email: email.split('@')[0] + '@***',
                    success: true,
                    messageId: result.id,
                });
                successful++;
            } else {
                results.push({
                    email: email.split('@')[0] + '@***',
                    success: false,
                    error: result.error,
                });
            }
        } catch (error) {
            results.push({
                email: email.split('@')[0] + '@***',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }

        // Rate limiting delay
        await new Promise((resolve) => setTimeout(resolve, 200));
    }

    logger.info('Bulk welcome email send completed', {
        total: emails.length,
        successful,
        failed: emails.length - successful,
    });

    return {
        total: emails.length,
        successful,
        failed: emails.length - successful,
        results,
    };
}

// Email stats and utilities
export async function getEmailStats(userId?: string): Promise<{
    verificationEmailsSent: number;
    passwordResetEmailsSent: number;
    welcomeEmailsSent: number;
    provider: string;
}> {
    if (userId) {
        logger.setUserId(userId);
    }

    const emailService = getEmailService();

    logger.info('Getting email stats', {
        action: 'get_email_stats',
        provider: emailService.getProviderType(),
    });

    // This would typically come from a database
    // For now, return mock data or implement actual tracking
    return {
        verificationEmailsSent: 0,
        passwordResetEmailsSent: 0,
        welcomeEmailsSent: 0,
        provider: emailService.getProviderType(),
    };
}

export function getEmailConfiguration(): {
    provider: string;
    rateLimitingEnabled: boolean;
    features: {
        templates: boolean;
        attachments: boolean;
        bulkSending: boolean;
    };
} {
    const emailService = getEmailService();

    return {
        provider: emailService.getProviderType(),
        rateLimitingEnabled: true,
        features: {
            templates: true,
            attachments: true,
            bulkSending: true,
        },
    };
}
