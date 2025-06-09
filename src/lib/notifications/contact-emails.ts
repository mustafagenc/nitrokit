import { render } from '@react-email/render';
import { ContactEmail } from '@/components/emails/contact-email';
import { PUBLIC_MAIL } from '@/constants/site';
import { getEmailService } from '@/lib/services/email';
import { logger } from '@/lib/services/logger';

interface SendContactEmailProps {
    name: string;
    email: string;
    message: string;
    userId?: string;
}

export interface EmailServiceResult {
    success: boolean;
    error?: string;
    data?: {
        id?: string;
        message: string;
        [key: string]: unknown;
    };
}

export async function sendContactEmail({
    name,
    email,
    message,
    userId,
}: SendContactEmailProps): Promise<EmailServiceResult> {
    try {
        // Set user context if available
        if (userId) {
            logger.setUserId(userId);
        }

        logger.info('Preparing contact email', {
            action: 'send_contact_email',
            fromEmail: email.split('@')[0] + '@***',
            hasName: !!name,
            messageLength: message.length,
        });

        // Use your existing template exactly as before
        const emailHtml = await render(
            ContactEmail({
                name,
                email,
                message,
            })
        );

        const emailService = getEmailService();

        logger.logUserAction('send_contact_email', 'contact', {
            fromEmail: email.split('@')[0] + '@***',
            provider: emailService.getProviderType(),
        });

        // Send email using new service but same structure
        const result = await emailService.sendEmail({
            to: PUBLIC_MAIL,
            subject: `💬 New Contact: ${name}`,
            html: emailHtml,
            replyTo: email,
            metadata: {
                type: 'contact_form',
                fromName: name,
                fromEmail: email,
                userId: userId || 'anonymous',
            },
        });

        if (!result.success) {
            logger.error('Contact email failed to send', undefined, {
                fromEmail: email.split('@')[0] + '@***',
                error: result.error,
                provider: emailService.getProviderType(),
            });

            return {
                success: false,
                error: `Failed to send contact email: ${result.error}`,
            };
        }

        logger.info('Contact email sent successfully', {
            messageId: result.messageId,
            fromEmail: email.split('@')[0] + '@***',
            provider: emailService.getProviderType(),
        });

        logger.logUserAction('contact_email_sent', 'contact', {
            messageId: result.messageId,
            fromEmail: email.split('@')[0] + '@***',
        });

        return {
            success: true,
            data: {
                id: result.messageId,
                message: 'Email sent successfully',
            },
        };
    } catch (error) {
        logger.error('Send contact email error', error instanceof Error ? error : undefined, {
            fromEmail: email?.split('@')[0] + '@***',
            action: 'send_contact_email',
        });

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send email',
        };
    }
}
