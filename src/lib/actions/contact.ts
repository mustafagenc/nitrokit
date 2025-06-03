'use server';

import { sendContactEmail } from '@/lib/email';
import { TContactFormSchema } from '@/lib/validators/contact-form';

interface EmailData {
    id?: string;
    [key: string]: unknown;
}

interface ActionResult {
    success: boolean;
    error?: string;
    data?: EmailData;
}

export async function sendEmail(data: TContactFormSchema): Promise<ActionResult> {
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
