import { EmailProvider, EmailData, EmailResult, EmailAttachment } from '../types';
import { logger } from '@/lib/services/logger';

export interface NodemailerConfig {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    from: string;
    tls?: {
        rejectUnauthorized?: boolean;
        ciphers?: string;
    };
    connectionTimeout?: number;
    greetingTimeout?: number;
    socketTimeout?: number;
    pool?: boolean;
    maxConnections?: number;
    maxMessages?: number;
}

// Nodemailer specific types
interface NodemailerTransportOptions {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
    tls?: {
        rejectUnauthorized?: boolean;
        ciphers?: string;
    };
    connectionTimeout?: number;
    greetingTimeout?: number;
    socketTimeout?: number;
    pool?: boolean;
    maxConnections?: number;
    maxMessages?: number;
}

interface NodemailerAttachment {
    filename: string;
    content: Buffer | string;
    contentType?: string;
    disposition?: 'attachment' | 'inline';
    cid?: string;
    encoding?: string;
    raw?: string;
}

interface NodemailerMailOptions {
    from: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string;
    priority?: 'high' | 'normal' | 'low';
    attachments?: NodemailerAttachment[];
    headers?: Record<string, string>;
    messageId?: string;
    date?: Date;
    encoding?: string;
}

interface NodemailerSendResult {
    messageId: string;
    envelope: {
        from: string;
        to: string[];
    };
    accepted: string[];
    rejected: string[];
    pending: string[];
    response: string;
}

interface NodemailerTransporter {
    sendMail(mailOptions: NodemailerMailOptions): Promise<NodemailerSendResult>;
    verify(): Promise<boolean>;
    close(): void;
}

interface NodemailerError extends Error {
    code?: string;
    command?: string;
    response?: string;
    responseCode?: number;
}

export class NodemailerProvider implements EmailProvider {
    private transporter: NodemailerTransporter | null = null;

    constructor(private config: NodemailerConfig) {
        this.validateConfig();
    }

    getProviderName(): string {
        return 'nodemailer';
    }

    validateConfig(): void {
        if (!this.config.host) {
            throw new Error('Nodemailer host is required');
        }
        if (!this.config.user) {
            throw new Error('Nodemailer user is required');
        }
        if (!this.config.pass) {
            throw new Error('Nodemailer password is required');
        }
        if (!this.config.from) {
            throw new Error('Nodemailer from address is required');
        }
        if (this.config.port <= 0 || this.config.port > 65535) {
            throw new Error('Nodemailer port must be between 1 and 65535');
        }
    }

    private async getTransporter(): Promise<NodemailerTransporter> {
        if (!this.transporter) {
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

            // Optional TLS configuration
            if (this.config.tls) {
                transportOptions.tls = this.config.tls;
            }

            // Optional timeout configurations
            if (this.config.connectionTimeout) {
                transportOptions.connectionTimeout = this.config.connectionTimeout;
            }
            if (this.config.greetingTimeout) {
                transportOptions.greetingTimeout = this.config.greetingTimeout;
            }
            if (this.config.socketTimeout) {
                transportOptions.socketTimeout = this.config.socketTimeout;
            }

            // Optional pool configurations
            if (this.config.pool !== undefined) {
                transportOptions.pool = this.config.pool;
            }
            if (this.config.maxConnections) {
                transportOptions.maxConnections = this.config.maxConnections;
            }
            if (this.config.maxMessages) {
                transportOptions.maxMessages = this.config.maxMessages;
            }

            this.transporter = nodemailer.createTransport(
                transportOptions
            ) as NodemailerTransporter;
        }

        return this.transporter;
    }

    private convertAttachments(attachments: EmailAttachment[]): NodemailerAttachment[] {
        return attachments.map(att => ({
            filename: att.filename,
            content: att.content,
            contentType: att.contentType,
            disposition: att.disposition,
            cid: att.cid,
        }));
    }

    private getPriorityValue(priority?: 'high' | 'normal' | 'low'): 'high' | 'normal' | 'low' {
        return priority || 'normal';
    }

    private parseNodemailerError(error: unknown): { message: string; code?: string } {
        if (!error) {
            return { message: 'Unknown Nodemailer error' };
        }

        if (error instanceof Error) {
            const nmError = error as NodemailerError;

            // Extract specific error information
            let message = nmError.message;

            if (nmError.code) {
                message = `${nmError.code}: ${message}`;
            }

            if (nmError.response) {
                message += ` (Server response: ${nmError.response})`;
            }

            return {
                message,
                code: nmError.code,
            };
        }

        return { message: String(error) };
    }

    async sendEmail(data: EmailData): Promise<EmailResult> {
        try {
            logger.info('Sending email via Nodemailer', {
                provider: 'nodemailer',
                host: this.config.host,
                port: this.config.port,
                secure: this.config.secure,
                to: Array.isArray(data.to) ? data.to.length : 1,
                subject: data.subject,
                hasHtml: !!data.html,
                hasAttachments: !!data.attachments?.length,
                priority: data.priority || 'normal',
            });

            const transporter = await this.getTransporter();

            // Build mail options with proper typing
            const mailOptions: NodemailerMailOptions = {
                from: this.config.from,
                to: data.to,
                subject: data.subject,
                priority: this.getPriorityValue(data.priority),
            };

            // Optional fields
            if (data.text) mailOptions.text = data.text;
            if (data.html) mailOptions.html = data.html;
            if (data.cc) mailOptions.cc = data.cc;
            if (data.bcc) mailOptions.bcc = data.bcc;
            if (data.replyTo) mailOptions.replyTo = data.replyTo;

            // Attachments
            if (data.attachments?.length) {
                mailOptions.attachments = this.convertAttachments(data.attachments);
            }

            // Headers including metadata
            mailOptions.headers = {
                'X-Mailer': 'Nitrokit Email Service',
                'X-Priority': data.priority === 'high' ? '1' : data.priority === 'low' ? '5' : '3',
            };

            // Add metadata as custom headers
            if (data.metadata) {
                Object.entries(data.metadata).forEach(([key, value]) => {
                    if (mailOptions.headers) {
                        mailOptions.headers[`X-Custom-${key}`] = String(value);
                    }
                });
            }

            // Send email
            const result = await transporter.sendMail(mailOptions);

            logger.info('Email sent successfully via Nodemailer', {
                provider: 'nodemailer',
                messageId: result.messageId,
                accepted: result.accepted.length,
                rejected: result.rejected.length,
                pending: result.pending.length,
            });

            if (result.rejected.length > 0) {
                logger.warn('Some recipients were rejected', {
                    provider: 'nodemailer',
                    rejectedCount: result.rejected.length,
                    rejectedEmails: result.rejected.join(', '),
                    totalRecipients: result.accepted.length + result.rejected.length,
                    acceptedCount: result.accepted.length,
                });
            }

            return {
                success: true,
                messageId: result.messageId,
            };
        } catch (error) {
            const errorInfo = this.parseNodemailerError(error);

            logger.error('Nodemailer email failed', error instanceof Error ? error : undefined, {
                provider: 'nodemailer',
                host: this.config.host,
                to: Array.isArray(data.to) ? data.to.length : 1,
                errorCode: errorInfo.code,
                errorMessage: errorInfo.message,
            });

            return {
                success: false,
                error: errorInfo.message,
            };
        }
    }

    // Additional Nodemailer-specific methods
    async verifyConnection(): Promise<{ valid: boolean; error?: string }> {
        try {
            logger.info('Verifying Nodemailer connection', {
                host: this.config.host,
                port: this.config.port,
            });

            const transporter = await this.getTransporter();
            await transporter.verify();

            logger.info('Nodemailer connection verified successfully');

            return { valid: true };
        } catch (error) {
            const errorInfo = this.parseNodemailerError(error);

            logger.warn('Nodemailer connection verification failed', {
                error: errorInfo.message,
                code: errorInfo.code,
            });

            return {
                valid: false,
                error: errorInfo.message,
            };
        }
    }

    async closeConnection(): Promise<void> {
        if (this.transporter) {
            try {
                this.transporter.close();
                this.transporter = null;

                logger.info('Nodemailer connection closed');
            } catch (error) {
                logger.warn('Error closing Nodemailer connection', {
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        }
    }

    getConnectionInfo(): {
        host: string;
        port: number;
        secure: boolean;
        user: string;
        poolEnabled: boolean;
    } {
        return {
            host: this.config.host,
            port: this.config.port,
            secure: this.config.secure,
            user: this.config.user,
            poolEnabled: this.config.pool || false,
        };
    }

    // Validate configuration without throwing
    async validateApiKey(): Promise<{ valid: boolean; error?: string }> {
        return this.verifyConnection();
    }

    async getAccountInfo(): Promise<{
        success: boolean;
        data?: {
            host: string;
            port: number;
            secure: boolean;
            connectionPooled: boolean;
        };
        error?: string;
    }> {
        try {
            const connectionValid = await this.verifyConnection();

            if (!connectionValid.valid) {
                return {
                    success: false,
                    error: connectionValid.error,
                };
            }

            return {
                success: true,
                data: {
                    host: this.config.host,
                    port: this.config.port,
                    secure: this.config.secure,
                    connectionPooled: this.config.pool || false,
                },
            };
        } catch (error) {
            const errorInfo = this.parseNodemailerError(error);
            return {
                success: false,
                error: errorInfo.message,
            };
        }
    }
}
