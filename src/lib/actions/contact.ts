'use server';

import { type ContactFormData } from '@/lib/validations';
import { EmailServiceResult, sendContactEmail } from '@/lib/notifications/contact-emails';

export async function sendEmail(data: ContactFormData): Promise<EmailServiceResult> {
    try {
        const result = await sendContactEmail({
            name: data.name,
            email: data.email,
            message: data.message,
        });

        return result;
    } catch (error) {
        console.error('Contact action error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send email',
        };
    }
}
