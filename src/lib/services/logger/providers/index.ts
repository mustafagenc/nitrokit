import { LoggerProvider } from '../types';
import { SentryProvider } from './sentry';
import { MixpanelProvider } from './mixpanel';
import { PosthogProvider } from './posthog';
import { ConsoleProvider } from './console';

export function createLoggerProvider(provider: string): LoggerProvider {
    switch (provider.toLowerCase()) {
        case 'sentry':
            return new SentryProvider();
        case 'mixpanel':
            return new MixpanelProvider();
        case 'posthog':
            return new PosthogProvider();
        case 'console':
        default:
            return new ConsoleProvider();
    }
}

export { SentryProvider, MixpanelProvider, PosthogProvider, ConsoleProvider };
