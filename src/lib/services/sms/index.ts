import { SMSService } from './sms-service';
import { SMSProviderType, SMSProviderConfig } from './providers';
import { logger } from '@/lib/services/logger';

let smsService: SMSService;

export function getSMSService(): SMSService {
    if (!smsService) {
        const providerType = (process.env.SMS_PROVIDER as SMSProviderType) || 'aws';

        logger.info('Initializing SMS Service', { provider: providerType });

        const config: SMSProviderConfig = {};

        switch (providerType) {
            case 'aws':
                config.aws = {
                    accessKeyId: process.env.AWS_SNS_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.AWS_SNS_SECRET_ACCESS_KEY!,
                    region: process.env.AWS_SNS_REGION || 'us-east-1',
                };
                break;

            case 'twilio':
                config.twilio = {
                    accountSid: process.env.TWILIO_ACCOUNT_SID!,
                    authToken: process.env.TWILIO_AUTH_TOKEN!,
                    phoneNumber: process.env.TWILIO_PHONE_NUMBER!,
                };
                break;

            case 'iletimerkezi':
                config.iletimerkezi = {
                    username: process.env.ILETIMERKEZI_USERNAME!,
                    password: process.env.ILETIMERKEZI_PASSWORD!,
                    sender: process.env.ILETIMERKEZI_SENDER!,
                };
                break;

            case 'netgsm':
                config.netgsm = {
                    username: process.env.NETGSM_USERNAME!,
                    password: process.env.NETGSM_PASSWORD!,
                    sender: process.env.NETGSM_SENDER!,
                };
                break;

            case 'mutlucell':
                config.mutlucell = {
                    username: process.env.MUTLUCELL_USERNAME!,
                    password: process.env.MUTLUCELL_PASSWORD!,
                    sender: process.env.MUTLUCELL_SENDER!,
                };
                break;

            default:
                throw new Error(`Unsupported SMS provider: ${providerType}`);
        }

        smsService = new SMSService(providerType, config);
    }

    return smsService;
}

export * from './types';
export * from './providers';
export { SMSService } from './sms-service';
