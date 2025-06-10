import mixpanel from 'mixpanel-browser';
import { LoggerProvider, LogMetadata, UserInfo } from '../types';

export class MixpanelProvider implements LoggerProvider {
    private initialized = false;

    constructor() {
        if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
            try {
                mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
                    debug: process.env.NODE_ENV === 'development',
                    track_pageview: true,
                    persistence: 'localStorage',
                    api_host: 'https://api-eu.mixpanel.com', // EU compliance
                    opt_out_tracking_by_default: false,
                    loaded: () => {
                        console.info('✅ Mixpanel initialized successfully');
                    },
                });
                this.initialized = true;
            } catch (error) {
                console.error('Failed to initialize Mixpanel:', error);
            }
        }
    }

    private sanitizeProperties(
        metadata?: LogMetadata
    ): Record<string, string | number | boolean | Date> {
        if (!metadata) return {};

        const sanitized: Record<string, string | number | boolean | Date> = {};

        for (const [key, value] of Object.entries(metadata)) {
            if (value === null || value === undefined) {
                sanitized[key] = String(value);
            } else if (typeof value === 'object') {
                if (value instanceof Date) {
                    sanitized[key] = value;
                } else {
                    sanitized[key] = JSON.stringify(value);
                }
            } else if (
                typeof value === 'string' ||
                typeof value === 'number' ||
                typeof value === 'boolean'
            ) {
                sanitized[key] = value;
            } else {
                sanitized[key] = String(value);
            }
        }

        return sanitized;
    }

    info(message: string, metadata?: LogMetadata): void {
        if (this.initialized) {
            mixpanel.track('Info Log', {
                message,
                level: 'info',
                timestamp: new Date().toISOString(),
                ...this.sanitizeProperties(metadata),
            });
        }
        console.info(`ℹ️ ${message}`, metadata);
    }

    warn(message: string, metadata?: LogMetadata): void {
        if (this.initialized) {
            mixpanel.track('Warning Log', {
                message,
                level: 'warning',
                timestamp: new Date().toISOString(),
                ...this.sanitizeProperties(metadata),
            });
        }
        console.warn(`⚠️ ${message}`, metadata);
    }

    error(message: string, error?: Error, metadata?: LogMetadata): void {
        console.error(`❌ ${message}`, error, metadata);

        if (this.initialized) {
            mixpanel.track('Error Log', {
                message,
                level: 'error',
                timestamp: new Date().toISOString(),
                error_name: error?.name || 'Unknown',
                error_message: error?.message || 'No error message',
                has_stack: !!error?.stack,
                ...this.sanitizeProperties(metadata),
            });
        }
    }

    logUserAction(userId: string, action: string, resource?: string, metadata?: LogMetadata): void {
        if (this.initialized) {
            mixpanel.identify(userId);
            mixpanel.track(action, {
                resource: resource || '',
                user_id: userId,
                timestamp: new Date().toISOString(),
                ...this.sanitizeProperties(metadata),
            });
        }

        const actionDescription = resource
            ? `User ${userId} performed ${action} on ${resource}`
            : `User ${userId} performed ${action}`;
        console.info(`👤 ${actionDescription}`, metadata);
    }

    setUser(userId: string, userInfo: UserInfo): void {
        if (this.initialized) {
            mixpanel.identify(userId);

            const userProperties: Record<string, string | number | boolean | Date> = {};

            if (userInfo.email) userProperties.$email = userInfo.email;
            if (userInfo.name) userProperties.$name = userInfo.name;
            if (userInfo.role) userProperties.role = userInfo.role;
            if (userInfo.lastLoginAt) {
                userProperties.last_login =
                    userInfo.lastLoginAt instanceof Date
                        ? userInfo.lastLoginAt
                        : new Date(userInfo.lastLoginAt);
            }

            userProperties.user_id = userId;
            userProperties.updated_at = new Date();

            mixpanel.people.set(userProperties);
        }
        // console.info(`👤 User identified: ${userId}`, userInfo);
    }
}
