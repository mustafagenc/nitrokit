import { EmailService } from './email-service';
import { EmailProviderType, EmailProviderConfig } from './providers';
import { logger } from '@/lib/services/logger';

let emailService: EmailService;

export function getEmailService(): EmailService {
    if (!emailService) {
        const providerType = (process.env.EMAIL_PROVIDER as EmailProviderType) || 'resend';

        logger.info('Initializing Email Service', { provider: providerType });

        const config: EmailProviderConfig = {};

        switch (providerType) {
            case 'resend':
                config.resend = {
                    apiKey: process.env.RESEND_API_KEY!,
                    from: process.env.EMAIL_FROM!,
                };
                break;

            case 'sendgrid':
                config.sendgrid = {
                    apiKey: process.env.SENDGRID_API_KEY!,
                    from: process.env.EMAIL_FROM!,
                };
                break;

            case 'mailgun':
                config.mailgun = {
                    apiKey: process.env.MAILGUN_API_KEY!,
                    domain: process.env.MAILGUN_DOMAIN!,
                    from: process.env.EMAIL_FROM!,
                    baseUrl: process.env.MAILGUN_BASE_URL,
                };
                break;

            case 'nodemailer':
                config.nodemailer = {
                    host: process.env.SMTP_HOST!,
                    port: parseInt(process.env.SMTP_PORT || '587'),
                    secure: process.env.SMTP_SECURE === 'true',
                    user: process.env.SMTP_USER!,
                    pass: process.env.SMTP_PASS!,
                    from: process.env.EMAIL_FROM!,
                };
                break;

            default:
                throw new Error(`Unsupported email provider: ${providerType}`);
        }

        emailService = new EmailService(providerType, config);
    }

    return emailService;
}

export * from './types';
export * from './providers';
export { EmailService } from './email-service';
