import { SMSProvider, SMSResult } from '../types';
import { logger } from '@/lib/services/logger';

export interface IletimMerkeziConfig {
    username: string;
    password: string;
    sender: string;
}

export class IletimMerkeziProvider implements SMSProvider {
    constructor(private config: IletimMerkeziConfig) {
        this.validateConfig();
    }

    validateConfig(): void {
        if (!this.config.username) {
            throw new Error('İletim Merkezi username is required');
        }
        if (!this.config.password) {
            throw new Error('İletim Merkezi password is required');
        }
        if (!this.config.sender) {
            throw new Error('İletim Merkezi sender is required');
        }
    }

    private cleanPhoneNumber(phoneNumber: string): string {
        return phoneNumber.replace(/^\+90/, '').replace(/^90/, '');
    }

    async sendSMS(phoneNumber: string, message: string): Promise<SMSResult> {
        try {
            const cleanPhone = this.cleanPhoneNumber(phoneNumber);

            logger.info('Sending SMS via İletim Merkezi', {
                provider: 'iletimerkezi',
                phoneNumber: cleanPhone.slice(-4),
                messageLength: message.length,
            });

            const response = await fetch('https://api.iletimerkezi.com/v1/send-sms/get/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.config.username,
                    password: this.config.password,
                    text: message,
                    receipients: cleanPhone,
                    sender: this.config.sender,
                }),
            });

            const result = await response.json();

            if (result.status !== 'success') {
                throw new Error(result.message || 'İletim Merkezi error');
            }

            logger.info('SMS sent successfully via İletim Merkezi', {
                provider: 'iletimerkezi',
                messageId: result.id,
            });

            return {
                success: true,
                messageId: result.id,
            };
        } catch (error) {
            logger.error('İletim Merkezi SMS failed', error instanceof Error ? error : undefined, {
                provider: 'iletimerkezi',
                phoneNumber: phoneNumber.slice(-4),
            });

            throw error;
        }
    }
}
