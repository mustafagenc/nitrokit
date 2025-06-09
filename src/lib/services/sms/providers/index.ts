import { SMSProvider } from '../types';
import { AWSProvider, AWSConfig } from './aws';
import { TwilioProvider, TwilioConfig } from './twilio';
import { IletimMerkeziProvider, IletimMerkeziConfig } from './iletimerkezi';
import { NetGSMProvider, NetGSMConfig } from './netgsm';
import { MutlucellProvider, MutlucellConfig } from './mutlucell';

export type SMSProviderType = 'aws' | 'twilio' | 'iletimerkezi' | 'netgsm' | 'mutlucell';

export interface SMSProviderConfig {
    aws?: AWSConfig;
    twilio?: TwilioConfig;
    iletimerkezi?: IletimMerkeziConfig;
    netgsm?: NetGSMConfig;
    mutlucell?: MutlucellConfig;
}

export function createSMSProvider(
    providerType: SMSProviderType,
    config: SMSProviderConfig
): SMSProvider {
    switch (providerType) {
        case 'aws':
            if (!config.aws) throw new Error('AWS config is required');
            return new AWSProvider(config.aws);

        case 'twilio':
            if (!config.twilio) throw new Error('Twilio config is required');
            return new TwilioProvider(config.twilio);

        case 'iletimerkezi':
            if (!config.iletimerkezi) throw new Error('İletim Merkezi config is required');
            return new IletimMerkeziProvider(config.iletimerkezi);

        case 'netgsm':
            if (!config.netgsm) throw new Error('NetGSM config is required');
            return new NetGSMProvider(config.netgsm);

        case 'mutlucell':
            if (!config.mutlucell) throw new Error('Mutlucell config is required');
            return new MutlucellProvider(config.mutlucell);

        default:
            throw new Error(`Unsupported SMS provider: ${providerType}`);
    }
}

export { AWSProvider, TwilioProvider, IletimMerkeziProvider, NetGSMProvider, MutlucellProvider };
