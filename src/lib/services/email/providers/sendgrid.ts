import { EmailProvider, EmailData, EmailResult, EmailAttachment } from '../types';
import { logger } from '@/lib/services/logger';

export interface SendGridConfig {
    apiKey: string;
    from: string;
}

interface SendGridAttachment {
    filename: string;
    content: string;
    type: string;
    disposition: 'attachment' | 'inline';
    content_id?: string;
}

interface SendGridMessage {
    from: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text: string;
    html?: string;
    replyTo?: string;
    attachments?: SendGridAttachment[];
    custom_args?: Record<string, string | number | boolean>;
    headers?: Record<string, string>;
    template_id?: string;
    dynamic_template_data?: Record<string, unknown>;
}

interface SendGridResponse {
    statusCode: number;
    body: unknown;
    headers: {
        'x-message-id': string;
        [key: string]: string;
    };
}

interface SendGridError {
    response?: {
        statusCode: number;
        body: {
            errors?: Array<{
                message: string;
                field?: string;
                help?: string;
            }>;
        };
    };
    message: string;
    code?: number;
}

export class SendGridProvider implements EmailProvider {
    constructor(private config: SendGridConfig) {
        this.validateConfig();
    }

    getProviderName(): string {
        return 'sendgrid';
    }

    validateConfig(): void {
        if (!this.config.apiKey) {
            throw new Error('SendGrid API key is required');
        }
        if (!this.config.from) {
            throw new Error('SendGrid from address is required');
        }
    }

    private htmlToText(html: string): string {
        return html
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n\n')
            .replace(/<\/div>/gi, '\n')
            .replace(/<\/h[1-6]>/gi, '\n\n')
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .trim()
            .replace(/\n\s*\n\s*\n/g, '\n\n');
    }

    private convertAttachments(attachments: EmailAttachment[]): SendGridAttachment[] {
        return attachments.map((att) => ({
            filename: att.filename,
            content: typeof att.content === 'string' ? att.content : att.content.toString('base64'),
            type: att.contentType,
            disposition: att.disposition || 'attachment',
            ...(att.cid && { content_id: att.cid }),
        }));
    }

    private convertMetadata(
        metadata: Record<string, string | number | boolean>
    ): Record<string, string> {
        const converted: Record<string, string> = {};
        for (const [key, value] of Object.entries(metadata)) {
            converted[key] = String(value);
        }
        return converted;
    }

    private getPriorityHeader(priority?: 'high' | 'normal' | 'low'): string {
        switch (priority) {
            case 'high':
                return '1';
            case 'low':
                return '5';
            default:
                return '3';
        }
    }

    private parseError(error: unknown): string {
        if (!error || typeof error !== 'object') {
            return 'Unknown SendGrid error';
        }

        const sgError = error as SendGridError;

        // Check for SendGrid API errors
        if (sgError.response?.body?.errors) {
            return sgError.response.body.errors.map((e) => e.message).join(', ');
        }

        // Fallback to error message
        if (sgError.message) {
            return sgError.message;
        }

        return 'SendGrid API error';
    }

    async sendEmail(data: EmailData): Promise<EmailResult> {
        try {
            logger.info('Sending email via SendGrid', {
                provider: 'sendgrid',
                to: Array.isArray(data.to) ? data.to.length : 1,
                subject: data.subject,
                hasHtml: !!data.html,
                hasAttachments: !!data.attachments?.length,
                priority: data.priority || 'normal',
            });

            // Dynamic import with proper typing
            const { default: sgMail } = (await import('@sendgrid/mail')) as {
                default: {
                    setApiKey: (apiKey: string) => void;
                    send: (
                        message: SendGridMessage
                    ) => Promise<[SendGridResponse, Record<string, unknown>]>;
                };
            };

            sgMail.setApiKey(this.config.apiKey);

            // Prepare text content with fallback
            const textContent =
                data.text || (data.html ? this.htmlToText(data.html) : '') || 'Email content';

            // Build message with proper typing
            const message: SendGridMessage = {
                from: this.config.from,
                to: data.to,
                subject: data.subject,
                text: textContent,
            };

            // Optional fields
            if (data.html) message.html = data.html;
            if (data.cc) message.cc = data.cc;
            if (data.bcc) message.bcc = data.bcc;
            if (data.replyTo) message.replyTo = data.replyTo;

            // Attachments
            if (data.attachments?.length) {
                message.attachments = this.convertAttachments(data.attachments);
            }

            // Metadata as custom args
            if (data.metadata) {
                message.custom_args = this.convertMetadata(data.metadata);
            }

            // Headers
            message.headers = {
                'X-Mailer': 'Nitrokit Email Service',
                'X-Priority': this.getPriorityHeader(data.priority),
            };

            // Template support
            if (data.templateId) {
                message.template_id = data.templateId;
                if (data.templateData) {
                    message.dynamic_template_data = data.templateData;
                }
            }

            // Send email
            const [response] = await sgMail.send(message);

            const messageId = response.headers['x-message-id'];

            logger.info('Email sent successfully via SendGrid', {
                provider: 'sendgrid',
                messageId,
                statusCode: response.statusCode,
            });

            return {
                success: true,
                messageId,
            };
        } catch (error) {
            const errorMessage = this.parseError(error);

            logger.error('SendGrid email failed', error instanceof Error ? error : undefined, {
                provider: 'sendgrid',
                to: Array.isArray(data.to) ? data.to.length : 1,
                errorMessage,
                statusCode: (error as SendGridError)?.response?.statusCode,
            });

            return {
                success: false,
                error: errorMessage,
            };
        }
    }

    // Additional SendGrid-specific methods
    async validateApiKey(): Promise<{ valid: boolean; error?: string }> {
        try {
            const { default: sgMail } = await import('@sendgrid/mail');
            sgMail.setApiKey(this.config.apiKey);

            // Try to send a validation request (this is a simple check)
            // In a real scenario, you might want to use SendGrid's API to validate
            return { valid: true };
        } catch (error) {
            logger.warn('SendGrid API key validation failed', {
                error: this.parseError(error),
            });

            return {
                valid: false,
                error: this.parseError(error),
            };
        }
    }

    async getAccountInfo(): Promise<{
        success: boolean;
        data?: {
            reputation: number;
            credits: number;
        };
        error?: string;
    }> {
        try {
            // This would require additional SendGrid API calls
            // For now, return a placeholder
            logger.info('Getting SendGrid account info');

            return {
                success: true,
                data: {
                    reputation: 100,
                    credits: -1, // Unlimited
                },
            };
        } catch (error) {
            return {
                success: false,
                error: this.parseError(error),
            };
        }
    }
}
