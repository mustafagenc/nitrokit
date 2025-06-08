if (typeof window !== 'undefined') {
    throw new Error('Email Service can only be used on the server side');
}

export type EmailProvider = 'resend' | 'sendgrid' | 'mailgun' | 'nodemailer';

export interface ResendConfig {
    apiKey: string;
    from: string;
}

export interface SendGridConfig {
    apiKey: string;
    from: string;
}

export interface MailgunConfig {
    apiKey: string;
    domain: string;
    from: string;
    baseUrl?: string;
}

export interface NodemailerConfig {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    from: string;
}

export interface EmailConfig {
    provider: EmailProvider;
    resend?: ResendConfig;
    sendgrid?: SendGridConfig;
    mailgun?: MailgunConfig;
    nodemailer?: NodemailerConfig;
}

export interface EmailAttachment {
    filename: string;
    content: Buffer | string;
    contentType: string;
    disposition?: 'attachment' | 'inline';
    cid?: string;
}

export interface EmailData {
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html?: string;
    attachments?: EmailAttachment[];
    replyTo?: string;
    priority?: 'high' | 'normal' | 'low';
    metadata?: Record<string, string | number | boolean>;
    templateId?: string;
    templateData?: Record<string, string | number | boolean>;
}

export interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
    provider: EmailProvider;
    metadata?: Record<string, string | number | boolean>;
}

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    html: string;
    text?: string;
    variables?: string[];
}

export interface BulkEmailResult {
    total: number;
    successful: number;
    failed: number;
    results: EmailResult[];
}

export type ProviderConfig = ResendConfig | SendGridConfig | MailgunConfig | NodemailerConfig;

export interface ResendEmailOptions {
    from: string;
    to: string[];
    subject: string;
    text: string;
    html?: string;
    cc?: string[];
    bcc?: string[];
    replyTo?: string;
    attachments?: ResendAttachment[];
    tags?: ResendTag[];
}

export interface ResendAttachment {
    filename: string;
    content: string | Buffer;
}

export interface ResendTag {
    name: string;
    value: string;
}

export interface ResendApiResponse {
    data?: {
        id: string;
    };
    error?: {
        message: string;
    };
}

export interface SendGridMessage {
    from: string;
    to: string | string[];
    subject: string;
    text: string;
    html?: string;
    cc?: string | string[];
    bcc?: string | string[];
    replyTo?: string;
    attachments?: SendGridAttachment[];
    custom_args?: Record<string, string | number | boolean>;
    headers?: Record<string, string>;
}

export interface SendGridAttachment {
    filename: string;
    content: string;
    type: string;
    disposition: string;
    contentId?: string;
}

export interface SendGridResponse {
    statusCode: number;
    headers: Record<string, string>;
}

export interface MailgunApiResponse {
    id: string;
    message: string;
}

export interface NodemailerTransportOptions {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

export interface NodemailerMailOptions {
    from: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html?: string;
    attachments?: NodemailerAttachment[];
    replyTo?: string;
    priority?: 'high' | 'normal' | 'low';
}

export interface NodemailerAttachment {
    filename: string;
    content: Buffer | string;
    contentType: string;
    disposition?: string;
    cid?: string;
}

export interface NodemailerResult {
    messageId: string;
}

export abstract class BaseEmailProvider<TConfig extends ProviderConfig = ProviderConfig> {
    protected config: TConfig;

    constructor(config: TConfig) {
        this.config = config;
    }

    abstract sendEmail(data: EmailData): Promise<EmailResult>;

    async sendEmailWithTemplate?(
        templateId: string,
        data: Omit<EmailData, 'html' | 'text' | 'subject'>,
        variables: Record<string, string | number | boolean>
    ): Promise<EmailResult> {
        throw new Error(
            `Provider does not support sending email with template. Template ID: ${templateId} ${JSON.stringify(data)} ${JSON.stringify(variables)}`
        );
    }

    async healthCheck?(): Promise<{ status: 'healthy' | 'unhealthy'; error?: string }> {
        return { status: 'healthy' };
    }
}

export class ResendProvider extends BaseEmailProvider<ResendConfig> {
    async sendEmail(data: EmailData): Promise<EmailResult> {
        try {
            const { Resend } = await import('resend');
            const resend = new Resend(this.config.apiKey);

            console.log('📧 Resend Debug Info:');
            console.log('- From:', this.config.from);
            console.log('- To:', data.to);
            console.log('- Subject:', data.subject);

            const textContent =
                data.text || (data.html ? this.htmlToText(data.html) : '') || 'Email content';

            const emailOptions: ResendEmailOptions = {
                from: this.config.from,
                to: Array.isArray(data.to) ? data.to : [data.to],
                subject: data.subject,
                text: textContent,
            };

            if (data.html) emailOptions.html = data.html;
            if (data.cc) emailOptions.cc = Array.isArray(data.cc) ? data.cc : [data.cc];
            if (data.bcc) emailOptions.bcc = Array.isArray(data.bcc) ? data.bcc : [data.bcc];
            if (data.replyTo) emailOptions.replyTo = data.replyTo;

            if (data.attachments && data.attachments.length > 0) {
                emailOptions.attachments = data.attachments.map(
                    (att): ResendAttachment => ({
                        filename: att.filename,
                        content: att.content,
                    })
                );
            }

            if (data.metadata) {
                emailOptions.tags = Object.entries(data.metadata).map(
                    ([key, value]): ResendTag => ({
                        name: key,
                        value: String(value),
                    })
                );
            }

            const result = (await resend.emails.send(emailOptions)) as ResendApiResponse;

            if (result.error) {
                throw new Error(`Resend API error: ${result.error.message}`);
            }

            return {
                success: true,
                messageId: result.data?.id,
                provider: 'resend',
            };
        } catch (error) {
            console.error('❌ Resend Error:', error);
            return {
                success: false,
                error: `Resend error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                provider: 'resend',
            };
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
}

export class SendGridProvider extends BaseEmailProvider<SendGridConfig> {
    async sendEmail(data: EmailData): Promise<EmailResult> {
        try {
            const sgMail = await import('@sendgrid/mail');
            sgMail.default.setApiKey(this.config.apiKey);

            console.log('📧 SendGrid Debug Info:');
            console.log('- From:', this.config.from);
            console.log('- To:', data.to);
            console.log('- Subject:', data.subject);

            const textContent =
                data.text || (data.html ? this.htmlToText(data.html) : '') || 'Email content';

            const message: SendGridMessage = {
                from: this.config.from,
                to: data.to,
                subject: data.subject,
                text: textContent,
            };

            if (data.html) message.html = data.html;
            if (data.cc) message.cc = data.cc;
            if (data.bcc) message.bcc = data.bcc;
            if (data.replyTo) message.replyTo = data.replyTo;

            if (data.attachments && data.attachments.length > 0) {
                message.attachments = data.attachments.map(
                    (att): SendGridAttachment => ({
                        filename: att.filename,
                        content:
                            typeof att.content === 'string'
                                ? att.content
                                : att.content.toString('base64'),
                        type: att.contentType,
                        disposition: att.disposition || 'attachment',
                        contentId: att.cid,
                    })
                );
            }

            if (data.metadata) message.custom_args = data.metadata;

            message.headers = {
                'X-Mailer': 'Nitrokit Email Service',
                'X-Priority': data.priority === 'high' ? '1' : data.priority === 'low' ? '5' : '3',
            };

            const result = (await sgMail.default.send(message)) as SendGridResponse[];

            return {
                success: true,
                messageId: result[0].headers['x-message-id'],
                provider: 'sendgrid',
            };
        } catch (error) {
            console.error('❌ SendGrid Error:', error);

            let errorMessage = `SendGrid error: ${error instanceof Error ? error.message : 'Unknown error'}`;

            // Type-safe error handling
            if (error && typeof error === 'object' && 'response' in error) {
                const sgError = error as {
                    response?: { body?: { errors?: { message: string }[] } };
                };
                if (sgError.response?.body?.errors) {
                    const errors = sgError.response.body.errors;
                    errorMessage = `SendGrid validation error: ${errors.map(e => e.message).join(', ')}`;
                }
            }

            return {
                success: false,
                error: errorMessage,
                provider: 'sendgrid',
            };
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
}
export class MailgunProvider extends BaseEmailProvider<MailgunConfig> {
    async sendEmail(data: EmailData): Promise<EmailResult> {
        try {
            console.log('📧 Mailgun Debug Info:');
            console.log('- Domain:', this.config.domain);
            console.log('- From:', this.config.from);
            console.log('- To:', data.to);

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

            if (data.attachments && data.attachments.length > 0) {
                console.warn(
                    '⚠️ Mailgun attachments require FormData implementation - skipping attachments'
                );
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

            const result = (await response.json()) as MailgunApiResponse;

            return {
                success: true,
                messageId: result.id,
                provider: 'mailgun',
            };
        } catch (error) {
            console.error('❌ Mailgun Error:', error);
            return {
                success: false,
                error: `Mailgun error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                provider: 'mailgun',
            };
        }
    }
}

export class NodemailerProvider extends BaseEmailProvider<NodemailerConfig> {
    async sendEmail(data: EmailData): Promise<EmailResult> {
        try {
            const nodemailer = await import('nodemailer');

            const transportOptions: NodemailerTransportOptions = {
                host: this.config.host,
                port: this.config.port,
                secure: this.config.secure,
                auth: {
                    user: this.config.user,
                    pass: this.config.pass,
                },
            };

            const transporter = nodemailer.createTransport(transportOptions);

            const mailOptions: NodemailerMailOptions = {
                from: this.config.from,
                to: data.to,
                subject: data.subject,
                text: data.text,
                html: data.html,
                replyTo: data.replyTo,
                priority: data.priority,
            };

            if (data.cc) mailOptions.cc = data.cc;
            if (data.bcc) mailOptions.bcc = data.bcc;

            if (data.attachments && data.attachments.length > 0) {
                mailOptions.attachments = data.attachments.map(
                    (att): NodemailerAttachment => ({
                        filename: att.filename,
                        content: att.content,
                        contentType: att.contentType,
                        disposition: att.disposition,
                        cid: att.cid,
                    })
                );
            }

            const result = (await transporter.sendMail(mailOptions)) as NodemailerResult;

            return {
                success: true,
                messageId: result.messageId,
                provider: 'nodemailer',
            };
        } catch (error) {
            console.error('❌ Nodemailer Error:', error);
            return {
                success: false,
                error: `Nodemailer error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                provider: 'nodemailer',
            };
        }
    }
}

export interface RateLimitEntry {
    count: number;
    resetTime: number;
}

export interface EmailStatistics {
    provider: EmailProvider;
    rateLimitStatus: Array<{
        email: string;
        count: number;
        resetTime: number;
    }>;
    templateCount: number;
}

export class EmailService {
    private provider: BaseEmailProvider;
    private config: EmailConfig;
    private templates: Map<string, EmailTemplate> = new Map();
    private rateLimitMap = new Map<string, RateLimitEntry>();
    private readonly RATE_LIMIT = 100; // emails per hour
    private readonly RATE_WINDOW = 60 * 60 * 1000; // 1 hour

    constructor(config: EmailConfig) {
        this.config = config;
        this.provider = this.createProvider(config);
    }

    private createProvider(config: EmailConfig): BaseEmailProvider {
        switch (config.provider) {
            case 'resend':
                if (!config.resend) throw new Error('Resend configuration missing');
                return new ResendProvider(config.resend);

            case 'sendgrid':
                if (!config.sendgrid) throw new Error('SendGrid configuration missing');
                return new SendGridProvider(config.sendgrid);

            case 'mailgun':
                if (!config.mailgun) throw new Error('Mailgun configuration missing');
                return new MailgunProvider(config.mailgun);

            case 'nodemailer':
                if (!config.nodemailer) throw new Error('Nodemailer configuration missing');
                return new NodemailerProvider(config.nodemailer);

            default:
                throw new Error(`Unsupported email provider: ${config.provider}`);
        }
    }

    async sendEmail(data: EmailData): Promise<EmailResult> {
        try {
            // Rate limiting
            if (!this.checkRateLimit(typeof data.to === 'string' ? data.to : data.to[0])) {
                throw new Error('Rate limit exceeded. Please try again later.');
            }

            // Validation
            this.validateEmailData(data);

            // Process templates
            const processedData = await this.processTemplate(data);

            // Send email
            const result = await this.provider.sendEmail(processedData);

            if (result.success) {
                console.log('✅ Email sent successfully:', {
                    provider: this.config.provider,
                    to: data.to,
                    subject: data.subject,
                    messageId: result.messageId,
                });
            }

            return result;
        } catch (error) {
            console.error('❌ Email service error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to send email',
                provider: this.config.provider,
            };
        }
    }

    async sendBulkEmails(
        emailsData: EmailData[],
        batchSize: number = 10
    ): Promise<BulkEmailResult> {
        const results: EmailResult[] = [];
        let successful = 0;

        for (let i = 0; i < emailsData.length; i += batchSize) {
            const batch = emailsData.slice(i, i + batchSize);
            const batchPromises = batch.map(emailData => this.sendEmail(emailData));
            const batchResults = await Promise.allSettled(batchPromises);

            batchResults.forEach(result => {
                if (result.status === 'fulfilled') {
                    results.push(result.value);
                    if (result.value.success) successful++;
                } else {
                    results.push({
                        success: false,
                        error: result.reason?.message || 'Unknown error',
                        provider: this.config.provider,
                    });
                }
            });

            // Delay between batches to avoid rate limits
            if (i + batchSize < emailsData.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        return {
            total: emailsData.length,
            successful,
            failed: emailsData.length - successful,
            results,
        };
    }

    // Template management
    registerTemplate(template: EmailTemplate): void {
        this.templates.set(template.id, template);
    }

    getTemplate(id: string): EmailTemplate | undefined {
        return this.templates.get(id);
    }

    async sendEmailWithTemplate(
        templateId: string,
        data: Omit<EmailData, 'html' | 'text' | 'subject'>,
        variables: Record<string, string | number | boolean>
    ): Promise<EmailResult> {
        const template = this.getTemplate(templateId);
        if (!template) {
            throw new Error(`Template not found: ${templateId}`);
        }

        return this.sendEmail({
            ...data,
            subject: template.subject,
            html: template.html,
            text: template.text,
            templateData: variables,
        });
    }

    // Health check
    async healthCheck(): Promise<{
        provider: EmailProvider;
        status: 'healthy' | 'unhealthy';
        error?: string;
    }> {
        try {
            if (this.provider.healthCheck) {
                const result = await this.provider.healthCheck();
                return {
                    provider: this.config.provider,
                    status: result.status,
                    error: result.error,
                };
            }
            return { provider: this.config.provider, status: 'healthy' };
        } catch (error) {
            return {
                provider: this.config.provider,
                status: 'unhealthy',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    // Private methods
    private validateEmailData(data: EmailData): void {
        if (!data.to || (Array.isArray(data.to) && data.to.length === 0)) {
            throw new Error('Recipient email is required');
        }
        if (!data.subject) throw new Error('Email subject is required');
        if (!data.text && !data.html) throw new Error('Email content (text or html) is required');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validateEmail = (email: string): void => {
            if (!emailRegex.test(email)) {
                throw new Error(`Invalid email format: ${email}`);
            }
        };

        if (Array.isArray(data.to)) {
            data.to.forEach(validateEmail);
        } else {
            validateEmail(data.to);
        }

        if (data.cc) {
            if (Array.isArray(data.cc)) {
                data.cc.forEach(validateEmail);
            } else {
                validateEmail(data.cc);
            }
        }

        if (data.bcc) {
            if (Array.isArray(data.bcc)) {
                data.bcc.forEach(validateEmail);
            } else {
                validateEmail(data.bcc);
            }
        }
    }

    private checkRateLimit(email: string): boolean {
        const now = Date.now();
        const key = email;
        const limit = this.rateLimitMap.get(key);

        if (!limit || now > limit.resetTime) {
            this.rateLimitMap.set(key, { count: 1, resetTime: now + this.RATE_WINDOW });
            return true;
        }

        if (limit.count >= this.RATE_LIMIT) {
            return false;
        }

        limit.count++;
        return true;
    }

    private async processTemplate(data: EmailData): Promise<EmailData> {
        if (!data.templateData) return data;

        let processedHtml = data.html || '';
        let processedText = data.text || '';
        let processedSubject = data.subject;

        Object.entries(data.templateData).forEach(([key, value]) => {
            const placeholder = `{{${key}}}`;
            const stringValue = String(value);

            processedHtml = processedHtml.replace(new RegExp(placeholder, 'g'), stringValue);
            processedText = processedText.replace(new RegExp(placeholder, 'g'), stringValue);
            processedSubject = processedSubject.replace(new RegExp(placeholder, 'g'), stringValue);
        });

        return {
            ...data,
            html: processedHtml,
            text: processedText,
            subject: processedSubject,
        };
    }

    // Statistics
    async getStatistics(): Promise<EmailStatistics> {
        return {
            provider: this.config.provider,
            rateLimitStatus: Array.from(this.rateLimitMap.entries()).map(([email, data]) => ({
                email,
                count: data.count,
                resetTime: data.resetTime,
            })),
            templateCount: this.templates.size,
        };
    }
}

let emailService: EmailService | null = null;

export function getEmailService(): EmailService {
    if (typeof window !== 'undefined') {
        throw new Error('getEmailService can only be called on the server side');
    }

    if (!emailService) {
        const provider = (process.env.EMAIL_PROVIDER as EmailProvider) || 'resend';
        console.log('🔍 Email Service Configuration:', { provider });

        const emailConfig: EmailConfig = { provider };

        switch (provider) {
            case 'resend':
                if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
                    throw new Error('Resend configuration missing: RESEND_API_KEY, EMAIL_FROM');
                }
                emailConfig.resend = {
                    apiKey: process.env.RESEND_API_KEY,
                    from: process.env.EMAIL_FROM,
                };
                break;

            case 'sendgrid':
                if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
                    throw new Error('SendGrid configuration missing: SENDGRID_API_KEY, EMAIL_FROM');
                }
                emailConfig.sendgrid = {
                    apiKey: process.env.SENDGRID_API_KEY,
                    from: process.env.EMAIL_FROM,
                };
                break;

            case 'mailgun':
                if (
                    !process.env.MAILGUN_API_KEY ||
                    !process.env.MAILGUN_DOMAIN ||
                    !process.env.EMAIL_FROM
                ) {
                    throw new Error(
                        'Mailgun configuration missing: MAILGUN_API_KEY, MAILGUN_DOMAIN, EMAIL_FROM'
                    );
                }
                emailConfig.mailgun = {
                    apiKey: process.env.MAILGUN_API_KEY,
                    domain: process.env.MAILGUN_DOMAIN,
                    from: process.env.EMAIL_FROM,
                    baseUrl: process.env.MAILGUN_BASE_URL, // Optional for EU
                };
                break;

            case 'nodemailer':
                if (
                    !process.env.SMTP_HOST ||
                    !process.env.SMTP_USER ||
                    !process.env.SMTP_PASS ||
                    !process.env.EMAIL_FROM
                ) {
                    throw new Error(
                        'Nodemailer configuration missing: SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_FROM'
                    );
                }
                emailConfig.nodemailer = {
                    host: process.env.SMTP_HOST,
                    port: parseInt(process.env.SMTP_PORT || '587'),
                    secure: process.env.SMTP_SECURE === 'true',
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                    from: process.env.EMAIL_FROM,
                };
                break;

            default:
                throw new Error(`Unsupported email provider: ${provider}`);
        }

        emailService = new EmailService(emailConfig);
    }

    return emailService;
}

export async function sendEmail(data: EmailData): Promise<EmailResult> {
    if (typeof window !== 'undefined') {
        throw new Error('sendEmail can only be called on the server side');
    }
    const service = getEmailService();
    return service.sendEmail(data);
}

export async function sendBulkEmails(emailsData: EmailData[]): Promise<BulkEmailResult> {
    if (typeof window !== 'undefined') {
        throw new Error('sendBulkEmails can only be called on the server side');
    }
    const service = getEmailService();
    return service.sendBulkEmails(emailsData);
}

export async function sendTemplateEmail(
    templateId: string,
    data: Omit<EmailData, 'html' | 'text' | 'subject'>,
    variables: Record<string, string | number | boolean>
): Promise<EmailResult> {
    if (typeof window !== 'undefined') {
        throw new Error('sendTemplateEmail can only be called on the server side');
    }
    const service = getEmailService();
    return service.sendEmailWithTemplate(templateId, data, variables);
}
