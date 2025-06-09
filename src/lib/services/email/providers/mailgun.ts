import { EmailProvider, EmailData, EmailResult } from '../types';
import { logger } from '@/lib/logger';

export interface MailgunConfig {
    apiKey: string;
    domain: string;
    from: string;
    baseUrl?: string;
}

export class MailgunProvider implements EmailProvider {
    constructor(private config: MailgunConfig) {
        this.validateConfig();
    }

    getProviderName(): string {
        return 'mailgun';
    }

    validateConfig(): void {
        if (!this.config.apiKey) {
            throw new Error('Mailgun API key is required');
        }
        if (!this.config.domain) {
            throw new Error('Mailgun domain is required');
        }
        if (!this.config.from) {
            throw new Error('Mailgun from address is required');
        }
    }

    async sendEmail(data: EmailData): Promise<EmailResult> {
        try {
            logger.info('Sending email via Mailgun', {
                provider: 'mailgun',
                domain: this.config.domain,
                to: Array.isArray(data.to) ? data.to.length : 1,
                subject: data.subject,
            });

            const baseUrl = this.config.baseUrl || 'https://api.mailgun.net';
            const formData = new URLSearchParams();

            formData.append('from', this.config.from);
            formData.append('to', Array.isArray(data.to) ? data.to.join(',') : data.to);
            formData.append('subject', data.subject);

            if (data.cc) {
                formData.append('cc', Array.isArray(data.cc) ? data.cc.join(',') : data.cc);
            }
            if (data.bcc) {
                formData.append('bcc', Array.isArray(data.bcc) ? data.bcc.join(',') : data.bcc);
            }
            if (data.text) formData.append('text', data.text);
            if (data.html) formData.append('html', data.html);
            if (data.replyTo) formData.append('h:Reply-To', data.replyTo);

            if (data.metadata) {
                Object.entries(data.metadata).forEach(([key, value]) => {
                    formData.append(`v:${key}`, String(value));
                });
            }

            const response = await fetch(`${baseUrl}/v3/${this.config.domain}/messages`, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${Buffer.from(`api:${this.config.apiKey}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Mailgun HTTP ${response.status}: ${errorText}`);
            }

            const result = await response.json();

            logger.info('Email sent successfully via Mailgun', {
                provider: 'mailgun',
                messageId: result.id,
            });

            return {
                success: true,
                messageId: result.id,
            };
        } catch (error) {
            logger.error('Mailgun email failed', error instanceof Error ? error : undefined, {
                provider: 'mailgun',
                to: Array.isArray(data.to) ? data.to.length : 1,
            });

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
}
