import { render } from '@react-email/render';
import { VerificationEmail } from '@/components/emails/verification-email';
import { PasswordResetEmail } from '@/components/emails/password-reset-email';
import { WelcomeEmail } from '@/components/emails/welcome-email';
import { getBaseUrl } from '@/lib';
import { sendEmail } from '@/lib/services/email-service';

interface SendVerificationEmailProps {
    email: string;
    name: string;
    token: string;
}

export async function sendVerificationEmail({ email, name, token }: SendVerificationEmailProps) {
    const verificationUrl = `${getBaseUrl()}/api/auth/verify-email?token=${token}`;

    try {
        const emailHtml = await render(
            VerificationEmail({
                name,
                verificationUrl,
            })
        );

        const result = await sendEmail({
            to: email,
            subject: 'Verify your email address - Nitrokit 🚀',
            html: emailHtml,
        });

        if (!result.success) {
            throw new Error(`Failed to send verification email: ${result.error}`);
        }
        return { id: result.messageId };
    } catch (error) {
        throw error;
    }
}

export async function sendPasswordResetEmail({ email, name, token }: SendVerificationEmailProps) {
    const resetUrl = `${getBaseUrl()}/new-password?token=${token}`;

    try {
        const emailHtml = await render(
            PasswordResetEmail({
                name,
                resetUrl,
            })
        );

        const result = await sendEmail({
            to: email,
            subject: 'Reset your password - Nitrokit 🚀',
            html: emailHtml,
        });

        if (!result.success) {
            throw new Error(`Failed to send password reset email: ${result.error}`);
        }
        return { id: result.messageId };
    } catch (error) {
        console.error('❌ Email service error:', error);
        throw error;
    }
}

export async function sendWelcomeEmail({ email, name }: { email: string; name: string }) {
    try {
        const dashboardUrl = `${getBaseUrl()}/dashboard`;

        const emailHtml = await render(
            WelcomeEmail({
                name,
                dashboardUrl,
            })
        );

        const result = await sendEmail({
            to: email,
            subject: 'Welcome to Nitrokit! 🚀',
            html: emailHtml,
        });

        if (!result.success) {
            throw new Error(`Failed to send welcome email: ${result.error}`);
        }
        return { id: result.messageId };
    } catch (error) {
        throw error;
    }
}
