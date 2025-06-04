import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import twilio, { Twilio } from 'twilio';

export type SMSProvider = 'aws' | 'twilio';

interface SMSConfig {
    provider: SMSProvider;
    aws?: {
        accessKeyId: string;
        secretAccessKey: string;
        region: string;
    };
    twilio?: {
        accountSid: string;
        authToken: string;
        phoneNumber: string;
    };
}

interface SMSResult {
    success: boolean;
    messageId?: string;
    error?: string;
    retryAfter?: number;
}

export class SMSService {
    private config: SMSConfig;
    private snsClient?: SNSClient;
    private twilioClient?: Twilio;

    private readonly isRateLimitingEnabled = process.env.SMS_RATE_LIMITING_ENABLED === 'true';

    private failedAttempts = new Map<
        string,
        {
            count: number;
            lastFailure: number;
            blockedUntil?: number;
        }
    >();

    private readonly MAX_FAILURES = 3;
    private readonly BLOCK_DURATION = 5 * 60 * 1000; // 5 minutes
    private readonly FAILURE_WINDOW = 10 * 60 * 1000; // 10 minutes

    constructor(config: SMSConfig) {
        this.config = config;
        this.initializeProviders();
    }

    private initializeProviders() {
        if (this.config.provider === 'aws' && this.config.aws) {
            this.snsClient = new SNSClient({
                region: this.config.aws.region,
                credentials: {
                    accessKeyId: this.config.aws.accessKeyId,
                    secretAccessKey: this.config.aws.secretAccessKey,
                },
            });
        }

        if (this.config.provider === 'twilio' && this.config.twilio) {
            this.twilioClient = twilio(this.config.twilio.accountSid, this.config.twilio.authToken);
        }
    }

    async sendSMS(phoneNumber: string, message: string): Promise<SMSResult> {
        // ... existing code ...

        try {
            console.log('🔍 SMS Service Debug:');
            console.log('- Provider:', this.config.provider);
            console.log('- Rate limiting:', this.isRateLimitingEnabled);
            console.log('- Phone:', phoneNumber);

            let result: SMSResult;

            if (this.config.provider === 'twilio') {
                // Trial account kontrol
                console.log('⚠️  Trial Account Notice:');
                console.log('- Trial accounts can only send to verified numbers');
                console.log('- Check if target number is verified in Twilio Console');
                console.log(
                    '- Twilio Console: https://console.twilio.com/us1/develop/phone-numbers/manage/verified'
                );

                result = await this.sendWithTwilio(phoneNumber, message);
            } else if (this.config.provider === 'aws') {
                result = await this.sendWithAWS(phoneNumber, message);
            } else {
                throw new Error('No SMS provider configured');
            }

            return result;
        } catch (error) {
            console.error('SMS Service Error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to send SMS',
                retryAfter: this.isRateLimitingEnabled ? this.getRetryDelay(phoneNumber) : 0,
            };
        }
    }

    private async sendWithAWS(phoneNumber: string, message: string): Promise<SMSResult> {
        if (!this.snsClient) throw new Error('AWS SNS not configured');

        const command = new PublishCommand({
            PhoneNumber: phoneNumber,
            Message: message,
            MessageAttributes: {
                'AWS.SNS.SMS.SMSType': {
                    DataType: 'String',
                    StringValue: 'Transactional',
                },
            },
        });

        const result = await this.snsClient.send(command);
        return { success: true, messageId: result.MessageId };
    }

    private async sendWithTwilio(phoneNumber: string, message: string): Promise<SMSResult> {
        if (!this.twilioClient || !this.config.twilio?.phoneNumber) {
            throw new Error('Twilio not configured');
        }

        try {
            console.log('🔍 Twilio Debug Info:');
            console.log('- From:', this.config.twilio.phoneNumber);
            console.log('- To:', phoneNumber);
            console.log('- Message:', message);
            console.log('- Account SID:', this.config.twilio.accountSid);

            const result = await this.twilioClient.messages.create({
                body: message,
                from: this.config.twilio.phoneNumber,
                to: phoneNumber,
            });

            console.log('✅ Twilio Response:', {
                sid: result.sid,
                status: result.status,
                dateCreated: result.dateCreated,
                errorCode: result.errorCode,
                errorMessage: result.errorMessage,
            });

            return { success: true, messageId: result.sid };
        } catch (error) {
            console.error('❌ Twilio Error:', error);
            throw error;
        }
    }

    private checkIfBlocked(phoneNumber: string): { blocked: boolean; retryAfter?: number } {
        if (!this.isRateLimitingEnabled) return { blocked: false };

        const attempt = this.failedAttempts.get(phoneNumber);
        if (!attempt) return { blocked: false };

        const now = Date.now();

        if (attempt.blockedUntil && now < attempt.blockedUntil) {
            return {
                blocked: true,
                retryAfter: Math.ceil((attempt.blockedUntil - now) / 1000),
            };
        }

        if (now - attempt.lastFailure > this.FAILURE_WINDOW) {
            this.clearFailedAttempts(phoneNumber);
            return { blocked: false };
        }

        if (attempt.count >= this.MAX_FAILURES) {
            const blockedUntil = now + this.BLOCK_DURATION;
            this.failedAttempts.set(phoneNumber, {
                ...attempt,
                blockedUntil,
            });

            return {
                blocked: true,
                retryAfter: Math.ceil(this.BLOCK_DURATION / 1000),
            };
        }

        return { blocked: false };
    }

    private recordFailure(phoneNumber: string): void {
        if (!this.isRateLimitingEnabled) return;

        const now = Date.now();
        const existing = this.failedAttempts.get(phoneNumber);

        if (existing && now - existing.lastFailure < this.FAILURE_WINDOW) {
            this.failedAttempts.set(phoneNumber, {
                count: existing.count + 1,
                lastFailure: now,
            });
        } else {
            this.failedAttempts.set(phoneNumber, {
                count: 1,
                lastFailure: now,
            });
        }
    }

    private clearFailedAttempts(phoneNumber: string): void {
        this.failedAttempts.delete(phoneNumber);
    }

    private getRetryDelay(phoneNumber: string): number {
        if (!this.isRateLimitingEnabled) return 0;

        const attempt = this.failedAttempts.get(phoneNumber);
        if (!attempt) return 0;

        if (attempt.blockedUntil) {
            return Math.ceil((attempt.blockedUntil - Date.now()) / 1000);
        }

        const baseDelay = 30;
        return Math.min(baseDelay * attempt.count, 300);
    }

    public cleanup(): void {
        if (!this.isRateLimitingEnabled) return;

        const now = Date.now();
        const expiredThreshold = now - this.FAILURE_WINDOW;

        for (const [phoneNumber, attempt] of this.failedAttempts.entries()) {
            if (
                attempt.lastFailure < expiredThreshold &&
                (!attempt.blockedUntil || now > attempt.blockedUntil)
            ) {
                this.failedAttempts.delete(phoneNumber);
            }
        }
    }

    public isRateLimitingActive(): boolean {
        return this.isRateLimitingEnabled;
    }
}

let smsService: SMSService;

export function getSMSService(): SMSService {
    if (!smsService) {
        const provider = (process.env.SMS_PROVIDER as SMSProvider) || 'aws';

        console.log('🔍 SMS Service Configuration:');
        console.log('- Provider:', provider);

        if (provider === 'twilio') {
            console.log('- Account SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Missing');
            console.log('- Auth Token:', process.env.TWILIO_AUTH_TOKEN ? '✅ Set' : '❌ Missing');
            console.log(
                '- Phone Number:',
                process.env.TWILIO_PHONE_NUMBER ? '✅ Set' : '❌ Missing'
            );

            if (
                !process.env.TWILIO_ACCOUNT_SID ||
                !process.env.TWILIO_AUTH_TOKEN ||
                !process.env.TWILIO_PHONE_NUMBER
            ) {
                throw new Error('Twilio credentials not properly configured');
            }
        }

        smsService = new SMSService({
            provider,
            aws: {
                accessKeyId: process.env.AWS_SNS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SNS_SECRET_ACCESS_KEY!,
                region: process.env.AWS_SNS_REGION || 'us-east-1',
            },
            twilio: {
                accountSid: process.env.TWILIO_ACCOUNT_SID!,
                authToken: process.env.TWILIO_AUTH_TOKEN!,
                phoneNumber: process.env.TWILIO_PHONE_NUMBER!,
            },
        });
    }

    return smsService;
}
