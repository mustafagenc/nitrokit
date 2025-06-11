import * as Sentry from '@sentry/nextjs';
import { LoggerProvider, LogMetadata, UserInfo } from '../types';

export class SentryProvider implements LoggerProvider {
    private initialized = false;

    constructor() {
        if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
            Sentry.init({
                dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
                environment: process.env.NODE_ENV,
                tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
                debug: process.env.NODE_ENV === 'development',
                beforeSend(event) {
                    if (process.env.NODE_ENV === 'production') {
                        const errorMessage = event.exception?.values?.[0]?.value;
                        if (errorMessage?.includes('Network Error')) {
                            return null;
                        }
                    }
                    return event;
                },
                _experiments: { enableLogs: true },
            });
            this.initialized = true;
        }
    }

    private convertMetadataForSentry(
        metadata?: LogMetadata
    ): Record<string, string | number | boolean> {
        if (!metadata) return {};

        const converted: Record<string, string | number | boolean> = {};

        for (const [key, value] of Object.entries(metadata)) {
            if (value === null || value === undefined) {
                converted[key] = String(value);
            } else if (typeof value === 'object') {
                converted[key] = JSON.stringify(value);
            } else {
                converted[key] = value;
            }
        }

        return converted;
    }

    info(message: string, metadata?: LogMetadata): void {
        if (this.initialized) {
            Sentry.addBreadcrumb({
                message,
                level: 'info',
                data: this.convertMetadataForSentry(metadata),
                timestamp: Date.now() / 1000,
            });
        }
        console.info(`ℹ️ ${message}`, metadata);
    }

    warn(message: string, metadata?: LogMetadata): void {
        if (this.initialized) {
            Sentry.addBreadcrumb({
                message,
                level: 'warning',
                data: this.convertMetadataForSentry(metadata),
                timestamp: Date.now() / 1000,
            });
        }
        console.warn(`⚠️ ${message}`, metadata);
    }

    error(message: string, error?: Error, metadata?: LogMetadata): void {
        console.error(`❌ ${message}`, error, metadata);

        if (this.initialized) {
            Sentry.withScope((scope) => {
                if (metadata) {
                    scope.setContext('metadata', this.convertMetadataForSentry(metadata));
                }

                if (error) {
                    Sentry.captureException(error);
                } else {
                    Sentry.captureMessage(message, 'error');
                }
            });
        }
    }

    logUserAction(userId: string, action: string, resource?: string, metadata?: LogMetadata): void {
        if (this.initialized) {
            Sentry.setUser({ id: userId });
            Sentry.addBreadcrumb({
                message: `User Action: ${action}`,
                level: 'info',
                category: 'user.action',
                data: {
                    action,
                    resource: resource || '',
                    userId,
                    ...this.convertMetadataForSentry(metadata),
                },
                timestamp: Date.now() / 1000,
            });
        }

        const actionDescription = resource
            ? `User ${userId} performed ${action} on ${resource}`
            : `User ${userId} performed ${action}`;
        console.info(`👤 ${actionDescription}`, metadata);
    }

    setUser(userId: string, userInfo: UserInfo): void {
        if (this.initialized) {
            const sentryUser: Sentry.User = {
                id: userId,
                email: userInfo.email,
                username: userInfo.name,
            };

            const extras: Record<string, string | undefined> = {};
            if (userInfo.role) extras.role = userInfo.role;
            if (userInfo.lastLoginAt) {
                extras.lastLoginAt =
                    userInfo.lastLoginAt instanceof Date
                        ? userInfo.lastLoginAt.toISOString()
                        : String(userInfo.lastLoginAt);
            }

            if (Object.keys(extras).length > 0) {
                sentryUser.extra = extras;
            }

            Sentry.setUser(sentryUser);
        }
        // console.info(`👤 User identified: ${userId}`, userInfo);
    }
}
