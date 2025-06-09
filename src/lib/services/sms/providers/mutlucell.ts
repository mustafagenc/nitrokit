import { SMSProvider, SMSResult } from '../types';
import { logger } from '@/lib/services/logger';

export interface MutlucellConfig {
    username: string;
    password: string;
    sender: string;
}

export class MutlucellProvider implements SMSProvider {
    constructor(private config: MutlucellConfig) {
        this.validateConfig();
    }

    validateConfig(): void {
        if (!this.config.username) {
            throw new Error('Mutlucell username is required');
        }
        if (!this.config.password) {
            throw new Error('Mutlucell password is required');
        }
        if (!this.config.sender) {
            throw new Error('Mutlucell sender is required');
        }
    }

    private cleanPhoneNumber(phoneNumber: string): string {
        return phoneNumber.replace(/^\+90/, '').replace(/^90/, '');
    }

    async sendSMS(phoneNumber: string, message: string): Promise<SMSResult> {
        try {
            const cleanPhone = this.cleanPhoneNumber(phoneNumber);

            logger.info('Sending SMS via Mutlucell', {
                provider: 'mutlucell',
                phoneNumber: cleanPhone.slice(-4),
                messageLength: message.length,
            });

            const response = await fetch('https://smsgw.mutlucell.com/smsgw-ws/sndblkex', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    user: this.config.username,
                    pass: this.config.password,
                    gsm: cleanPhone,
                    text: message,
                    from: this.config.sender,
                }),
            });

            const result = await response.text();

            if (result.startsWith('ID:')) {
                const messageId = result.split(':')[1];

                logger.info('SMS sent successfully via Mutlucell', {
                    provider: 'mutlucell',
                    messageId,
                });

                return {
                    success: true,
                    messageId,
                };
            } else {
                const errorMessage = result.startsWith('ERROR:') ? result.split(':')[1] : result;
                throw new Error(`Mutlucell error: ${errorMessage}`);
            }
        } catch (error) {
            logger.error('Mutlucell SMS failed', error instanceof Error ? error : undefined, {
                provider: 'mutlucell',
                phoneNumber: phoneNumber.slice(-4),
            });

            throw error;
        }
    }
}
