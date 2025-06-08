import { render } from '@react-email/render';
import { ContactEmail } from '@/components/emails/contact-email';
import { PUBLIC_MAIL } from '@/constants/site';
import { sendEmail } from '@/lib/services/email-service';

interface SendContactEmailProps {
    name: string;
    email: string;
    message: string;
}

export interface EmailServiceResult {
    success: boolean;
    error?: string;
    data?: {
        id?: string;
        [key: string]: unknown;
    };
}

export async function sendContactEmail({
    name,
    email,
    message,
}: SendContactEmailProps): Promise<EmailServiceResult> {
    try {
        const emailHtml = await render(
            ContactEmail({
                name,
                email,
                message,
            })
        );

        const result = await sendEmail({
            to: PUBLIC_MAIL,
            subject: `💬 New Contact: ${name}`,
            html: emailHtml,
            replyTo: email,
        });

        if (!result.success) {
            console.error('❌ Contact email error:', result.error);
            return {
                success: false,
                error: `Failed to send contact email: ${result.error}`,
            };
        }

        return {
            success: true,
            data: {
                id: result.messageId,
                message: 'Email sent successfully',
            },
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send email',
        };
    }
}
