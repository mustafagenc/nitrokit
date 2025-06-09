import { EmailProvider } from '../types';
import { ResendProvider, ResendConfig } from './resend';
import { SendGridProvider, SendGridConfig } from './sendgrid';
import { MailgunProvider, MailgunConfig } from './mailgun';
import { NodemailerProvider, NodemailerConfig } from './nodemailer';

export type EmailProviderType = 'resend' | 'sendgrid' | 'mailgun' | 'nodemailer';

export interface EmailProviderConfig {
    resend?: ResendConfig;
    sendgrid?: SendGridConfig;
    mailgun?: MailgunConfig;
    nodemailer?: NodemailerConfig;
}

export function createEmailProvider(
    providerType: EmailProviderType,
    config: EmailProviderConfig
): EmailProvider {
    switch (providerType) {
        case 'resend':
            if (!config.resend) throw new Error('Resend config is required');
            return new ResendProvider(config.resend);

        case 'sendgrid':
            if (!config.sendgrid) throw new Error('SendGrid config is required');
            return new SendGridProvider(config.sendgrid);

        case 'mailgun':
            if (!config.mailgun) throw new Error('Mailgun config is required');
            return new MailgunProvider(config.mailgun);

        case 'nodemailer':
            if (!config.nodemailer) throw new Error('Nodemailer config is required');
            return new NodemailerProvider(config.nodemailer);

        default:
            throw new Error(`Unsupported email provider: ${providerType}`);
    }
}

export { ResendProvider, SendGridProvider, MailgunProvider, NodemailerProvider };
