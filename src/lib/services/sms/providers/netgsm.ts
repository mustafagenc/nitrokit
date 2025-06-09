import { SMSProvider, SMSResult } from '../types';
import { logger } from '@/lib/logger';

export interface NetGSMConfig {
    username: string;
    password: string;
    sender: string;
}

export class NetGSMProvider implements SMSProvider {
    private readonly errorMessages: Record<string, string> = {
        '20': 'Message text not found',
        '30': 'Invalid username/password',
        '40': 'Message header not found',
        '70': 'Insufficient credits',
    };

    constructor(private config: NetGSMConfig) {
        this.validateConfig();
    }

    validateConfig(): void {
        if (!this.config.username) {
            throw new Error('NetGSM username is required');
        }
        if (!this.config.password) {
            throw new Error('NetGSM password is required');
        }
        if (!this.config.sender) {
            throw new Error('NetGSM sender is required');
        }
    }

    private cleanPhoneNumber(phoneNumber: string): string {
        return phoneNumber.replace(/^\+90/, '').replace(/^90/, '');
    }

    async sendSMS(phoneNumber: string, message: string): Promise<SMSResult> {
        try {
            const cleanPhone = this.cleanPhoneNumber(phoneNumber);

            logger.info('Sending SMS via NetGSM', {
                provider: 'netgsm',
                phoneNumber: cleanPhone.slice(-4),
                messageLength: message.length,
            });

            const url = new URL('https://api.netgsm.com.tr/sms/send/get');
            url.searchParams.append('usercode', this.config.username);
            url.searchParams.append('password', this.config.password);
            url.searchParams.append('gsmno', cleanPhone);
            url.searchParams.append('message', message);
            url.searchParams.append('msgheader', this.config.sender);

            const response = await fetch(url.toString());
            const result = await response.text();

            // NetGSM returns message ID on success, or error code
            if (result.startsWith('0') || result.startsWith('1') || result.startsWith('2')) {
                const errorMsg = this.errorMessages[result] || `NetGSM error code: ${result}`;
                throw new Error(errorMsg);
            }

            logger.info('SMS sent successfully via NetGSM', {
                provider: 'netgsm',
                messageId: result.trim(),
            });

            return {
                success: true,
                messageId: result.trim(),
            };
        } catch (error) {
            logger.error('NetGSM SMS failed', error instanceof Error ? error : undefined, {
                provider: 'netgsm',
                phoneNumber: phoneNumber.slice(-4),
            });

            throw error;
        }
    }
}
