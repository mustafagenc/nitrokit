import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import twilio, { Twilio } from 'twilio';

export type SMSProvider =
    | 'aws'
    | 'twilio'
    | 'vonage'
    | 'messagebird'
    | 'plivo'
    | 'clickatell'
    | 'iletimerkezi'
    | 'netgsm'
    | 'mutlucell';

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
    vonage?: {
        apiKey: string;
        apiSecret: string;
        from: string;
    };
    messagebird?: {
        accessKey: string;
        originator: string;
    };
    plivo?: {
        authId: string;
        authToken: string;
        src: string;
    };
    iletimerkezi?: {
        username: string;
        password: string;
        sender: string;
    };
    netgsm?: {
        username: string;
        password: string;
        sender: string;
    };
    mutlucell?: {
        username: string;
        password: string;
        sender: string;
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
        try {
            let result: SMSResult;

            switch (this.config.provider) {
                case 'twilio':
                    result = await this.sendWithTwilio(phoneNumber, message);
                    break;
                case 'aws':
                    result = await this.sendWithAWS(phoneNumber, message);
                    break;
                case 'vonage':
                    result = await this.sendWithVonage(phoneNumber, message);
                    break;
                case 'messagebird':
                    result = await this.sendWithMessageBird(phoneNumber, message);
                    break;
                case 'plivo':
                    result = await this.sendWithPlivo(phoneNumber, message);
                    break;
                case 'iletimerkezi':
                    result = await this.sendWithIletimerkezi(phoneNumber, message);
                    break;
                case 'netgsm':
                    result = await this.sendWithNetgsm(phoneNumber, message);
                    break;
                case 'mutlucell':
                    result = await this.sendWithMutlucell(phoneNumber, message);
                    break;
                default:
                    throw new Error(`Unsupported SMS provider: ${this.config.provider}`);
            }

            return result;
        } catch (error) {
            console.error(`SMS Service Error (${this.config.provider}):`, error);
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

    private async sendWithVonage(phoneNumber: string, messageText: string): Promise<SMSResult> {
        if (!this.config.vonage) throw new Error('Vonage not configured');

        const { Vonage } = await import('@vonage/server-sdk');
        const { Auth } = await import('@vonage/auth');

        const auth = new Auth({
            apiKey: this.config.vonage.apiKey,
            apiSecret: this.config.vonage.apiSecret,
        });

        const vonage = new Vonage(auth);

        try {
            console.log('🔍 Vonage Debug Info:');
            console.log('- From:', this.config.vonage.from);
            console.log('- To:', phoneNumber);
            console.log('- Message:', messageText);

            const result = await vonage.sms.send({
                to: phoneNumber,
                from: this.config.vonage.from,
                text: messageText,
            });

            console.log('Vonage Full Response:', JSON.stringify(result, null, 2));

            if (!result.messages || result.messages.length === 0) {
                throw new Error('No messages in Vonage response');
            }

            const smsMessage = result.messages[0];

            console.log('Vonage Response:', {
                messageId: smsMessage.messageId,
                status: smsMessage.status,
                errorText: smsMessage.errorText,
                remainingBalance: smsMessage.remainingBalance,
                messagePrice: smsMessage.messagePrice,
                network: smsMessage.network,
            });

            if (smsMessage.status === '0') {
                return {
                    success: true,
                    messageId: smsMessage.messageId || 'unknown',
                };
            } else {
                const errorText = smsMessage.errorText || 'Unknown Vonage error';
                const statusCode = smsMessage.status;

                let userFriendlyMessage = errorText;

                switch (statusCode) {
                    case '1':
                        userFriendlyMessage = 'Message throttled - rate limit exceeded';
                        break;
                    case '2':
                        userFriendlyMessage = 'Missing parameters';
                        break;
                    case '3':
                        userFriendlyMessage = 'Invalid credentials';
                        break;
                    case '4':
                        userFriendlyMessage = 'Invalid phone number format';
                        break;
                    case '5':
                        userFriendlyMessage = 'Internal error';
                        break;
                    case '6':
                        userFriendlyMessage = 'Invalid message format';
                        break;
                    case '7':
                        userFriendlyMessage = 'Number barred';
                        break;
                    case '8':
                        userFriendlyMessage = 'Partner account barred';
                        break;
                    case '9':
                        userFriendlyMessage = 'Partner quota exceeded';
                        break;
                    case '11':
                        userFriendlyMessage = 'Account not enabled for REST';
                        break;
                    case '12':
                        userFriendlyMessage = 'Message too long';
                        break;
                    case '14':
                        userFriendlyMessage = 'Invalid signature';
                        break;
                    case '15':
                        userFriendlyMessage = 'Invalid sender address';
                        break;
                    case '22':
                        userFriendlyMessage = 'Invalid network code';
                        break;
                    case '23':
                        userFriendlyMessage = 'Invalid callback URL';
                        break;
                    case '29':
                        userFriendlyMessage = 'Non-whitelisted destination';
                        break;
                    default:
                        userFriendlyMessage = `Vonage error: ${errorText} (Status: ${statusCode})`;
                }

                throw new Error(userFriendlyMessage);
            }
        } catch (error) {
            console.error('❌ Vonage Error:', error);

            if (error instanceof Error) {
                console.error('❌ Error Message:', error.message);
                console.error('❌ Error Stack:', error.stack);
            }

            throw error;
        }
    }

    private async sendWithMessageBird(phoneNumber: string, message: string): Promise<SMSResult> {
        if (!this.config.messagebird) throw new Error('MessageBird not configured');

        const response = await fetch('https://rest.messagebird.com/messages', {
            method: 'POST',
            headers: {
                Authorization: `AccessKey ${this.config.messagebird.accessKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recipients: [phoneNumber],
                originator: this.config.messagebird.originator,
                body: message,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.errors?.[0]?.description || 'MessageBird error');
        }

        return {
            success: true,
            messageId: result.id,
        };
    }

    private async sendWithPlivo(phoneNumber: string, message: string): Promise<SMSResult> {
        if (!this.config.plivo) throw new Error('Plivo not configured');

        const plivo = await import('plivo');
        const client = new plivo.Client(this.config.plivo.authId, this.config.plivo.authToken);

        try {
            console.log('🔍 Plivo Debug Info:');
            console.log('- From:', this.config.plivo.src);
            console.log('- To:', phoneNumber);
            console.log('- Message:', message);

            const result = await client.messages.create(
                this.config.plivo.src,
                phoneNumber,
                message,
                {},
                'sms'
            );

            console.log('✅ Plivo Response:', {
                messageUuid: result.messageUuid,
                apiId: result.apiId,
                message: result.message,
            });

            return {
                success: true,
                messageId: Array.isArray(result.messageUuid)
                    ? result.messageUuid[0]
                    : result.messageUuid,
            };
        } catch (error) {
            console.error('❌ Plivo Error:', error);
            throw error;
        }
    }

    private async sendWithIletimerkezi(phoneNumber: string, message: string): Promise<SMSResult> {
        if (!this.config.iletimerkezi) throw new Error('İletimerkezi not configured');

        const cleanPhone = phoneNumber.replace(/^\+90/, '');

        const response = await fetch('https://api.iletimerkezi.com/v1/send-sms/get/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.config.iletimerkezi.username,
                password: this.config.iletimerkezi.password,
                text: message,
                receipients: cleanPhone,
                sender: this.config.iletimerkezi.sender,
            }),
        });

        const result = await response.json();

        if (result.status !== 'success') {
            throw new Error(result.message || 'İletimerkezi error');
        }

        return {
            success: true,
            messageId: result.id,
        };
    }

    private async sendWithNetgsm(phoneNumber: string, message: string): Promise<SMSResult> {
        if (!this.config.netgsm) throw new Error('NetGSM not configured');

        const cleanPhone = phoneNumber.replace(/^\+90/, '').replace(/^90/, '');

        await fetch('https://api.netgsm.com.tr/sms/send/get', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const url = new URL('https://api.netgsm.com.tr/sms/send/get');
        url.searchParams.append('usercode', this.config.netgsm.username);
        url.searchParams.append('password', this.config.netgsm.password);
        url.searchParams.append('gsmno', cleanPhone);
        url.searchParams.append('message', message);
        url.searchParams.append('msgheader', this.config.netgsm.sender);

        const finalResponse = await fetch(url.toString());
        const result = await finalResponse.text();

        // NetGSM returns message ID on success, or error code
        if (result.startsWith('0') || result.startsWith('1') || result.startsWith('2')) {
            // Error codes
            const errorMessages: Record<string, string> = {
                '20': 'Message text not found',
                '30': 'Invalid username/password',
                '40': 'Message header not found',
                '70': 'Insufficient credits',
            };

            const errorMsg = errorMessages[result] || `NetGSM error code: ${result}`;
            throw new Error(errorMsg);
        } else {
            // Success - result contains message ID
            return {
                success: true,
                messageId: result.trim(),
            };
        }
    }

    private async sendWithMutlucell(phoneNumber: string, message: string): Promise<SMSResult> {
        if (!this.config.mutlucell) throw new Error('Mutlucell not configured');

        const cleanPhone = phoneNumber.replace(/^\+90/, '').replace(/^90/, '');

        const response = await fetch('https://smsgw.mutlucell.com/smsgw-ws/sndblkex', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                user: this.config.mutlucell.username,
                pass: this.config.mutlucell.password,
                gsm: cleanPhone,
                text: message,
                from: this.config.mutlucell.sender,
            }),
        });

        const result = await response.text();

        // Mutlucell returns: "ID:MESSAGE_ID" on success or "ERROR:ERROR_MESSAGE" on failure
        if (result.startsWith('ID:')) {
            const messageId = result.split(':')[1];
            return {
                success: true,
                messageId: messageId,
            };
        } else {
            const errorMessage = result.startsWith('ERROR:') ? result.split(':')[1] : result;
            throw new Error(`Mutlucell error: ${errorMessage}`);
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

        if (provider === 'vonage') {
            console.log('- API Key:', process.env.VONAGE_API_KEY ? '✅ Set' : '❌ Missing');
            console.log('- API Secret:', process.env.VONAGE_API_SECRET ? '✅ Set' : '❌ Missing');
            console.log('- From Number:', process.env.VONAGE_FROM_NUMBER ? '✅ Set' : '❌ Missing');

            if (
                !process.env.VONAGE_API_KEY ||
                !process.env.VONAGE_API_SECRET ||
                !process.env.VONAGE_FROM_NUMBER
            ) {
                throw new Error('Vonage credentials not properly configured');
            }
        }

        if (provider === 'plivo') {
            console.log('- Auth ID:', process.env.PLIVO_AUTH_ID ? '✅ Set' : '❌ Missing');
            console.log('- Auth Token:', process.env.PLIVO_AUTH_TOKEN ? '✅ Set' : '❌ Missing');
            console.log('- Source Number:', process.env.PLIVO_SRC_NUMBER ? '✅ Set' : '❌ Missing');

            if (
                !process.env.PLIVO_AUTH_ID ||
                !process.env.PLIVO_AUTH_TOKEN ||
                !process.env.PLIVO_SRC_NUMBER
            ) {
                throw new Error('Plivo credentials not properly configured');
            }
        }

        if (provider === 'iletimerkezi') {
            if (
                !process.env.ILETIMERKEZI_USERNAME ||
                !process.env.ILETIMERKEZI_PASSWORD ||
                !process.env.ILETIMERKEZI_SENDER
            ) {
                throw new Error('Iletimerkezi credentials not properly configured');
            }
        }

        if (provider === 'netgsm') {
            if (
                !process.env.NETGSM_USERNAME ||
                !process.env.NETGSM_PASSWORD ||
                !process.env.NETGSM_SENDER
            ) {
                throw new Error('NetGSM credentials not properly configured');
            }
        }

        if (provider === 'mutlucell') {
            if (
                !process.env.MUTLUCELL_USERNAME ||
                !process.env.MUTLUCELL_PASSWORD ||
                !process.env.MUTLUCELL_SENDER
            ) {
                throw new Error('Mutlucell credentials not properly configured');
            }
        }

        const smsConfig: SMSConfig = { provider };

        switch (provider) {
            case 'aws':
                smsConfig.aws = {
                    accessKeyId: process.env.AWS_SNS_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.AWS_SNS_SECRET_ACCESS_KEY!,
                    region: process.env.AWS_SNS_REGION || 'us-east-1',
                };
                break;

            case 'twilio':
                smsConfig.twilio = {
                    accountSid: process.env.TWILIO_ACCOUNT_SID!,
                    authToken: process.env.TWILIO_AUTH_TOKEN!,
                    phoneNumber: process.env.TWILIO_PHONE_NUMBER!,
                };
                break;

            case 'vonage':
                smsConfig.vonage = {
                    apiKey: process.env.VONAGE_API_KEY!,
                    apiSecret: process.env.VONAGE_API_SECRET!,
                    from: process.env.VONAGE_FROM_NUMBER || 'Nitrokit',
                };
                break;

            case 'plivo':
                smsConfig.plivo = {
                    authId: process.env.PLIVO_AUTH_ID!,
                    authToken: process.env.PLIVO_AUTH_TOKEN!,
                    src: process.env.PLIVO_SRC_NUMBER!,
                };
                break;

            case 'messagebird':
                smsConfig.messagebird = {
                    accessKey: process.env.MESSAGEBIRD_ACCESS_KEY!,
                    originator: process.env.MESSAGEBIRD_ORIGINATOR!,
                };
                break;

            case 'iletimerkezi':
                smsConfig.iletimerkezi = {
                    username: process.env.ILETIMERKEZI_USERNAME!,
                    password: process.env.ILETIMERKEZI_PASSWORD!,
                    sender: process.env.ILETIMERKEZI_SENDER!,
                };
                break;

            case 'netgsm':
                smsConfig.netgsm = {
                    username: process.env.NETGSM_USERNAME!,
                    password: process.env.NETGSM_PASSWORD!,
                    sender: process.env.NETGSM_SENDER!,
                };
                break;
            case 'mutlucell':
                smsConfig.mutlucell = {
                    username: process.env.MUTLUCELL_USERNAME!,
                    password: process.env.MUTLUCELL_PASSWORD!,
                    sender: process.env.MUTLUCELL_SENDER!,
                };
                break;
            default:
                throw new Error(`Unsupported SMS provider: ${provider}`);
        }

        smsService = new SMSService(smsConfig);
    }

    return smsService;
}
