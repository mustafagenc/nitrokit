import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { LoggerProvider, LogMetadata, UserInfo } from '../types';

export class LogRocketProvider implements LoggerProvider {
    private initialized = false;

    constructor() {
        if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_LOGROCKET_APP_ID) {
            try {
                LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID, {
                    release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
                    console: {
                        shouldAggregateConsoleErrors: true,
                    },
                    network: {
                        requestSanitizer: request => {
                            // Don't log sensitive headers
                            if (request.headers && request.headers['authorization']) {
                                request.headers['authorization'] = '[REDACTED]';
                            }
                            return request;
                        },
                    },
                });

                setupLogRocketReact(LogRocket);
                this.initialized = true;
            } catch (error) {
                console.error('Failed to initialize LogRocket:', error);
            }
        }
    }

    private sanitizeMetadata(metadata?: LogMetadata): Record<string, string | number | boolean> {
        if (!metadata) return {};

        const sanitized: Record<string, string | number | boolean> = {};

        for (const [key, value] of Object.entries(metadata)) {
            if (value === null || value === undefined) {
                sanitized[key] = String(value);
            } else if (typeof value === 'object') {
                sanitized[key] = JSON.stringify(value);
            } else {
                sanitized[key] = value;
            }
        }

        return sanitized;
    }

    info(message: string, metadata?: LogMetadata): void {
        if (this.initialized) {
            LogRocket.log(message, this.sanitizeMetadata(metadata));
        }
        console.info(`ℹ️ ${message}`, metadata);
    }

    warn(message: string, metadata?: LogMetadata): void {
        if (this.initialized) {
            LogRocket.log(`⚠️ ${message}`, this.sanitizeMetadata(metadata));
        }
        console.warn(`⚠️ ${message}`, metadata);
    }

    error(message: string, error?: Error, metadata?: LogMetadata): void {
        console.error(`❌ ${message}`, error, metadata);

        if (this.initialized) {
            if (error) {
                LogRocket.captureException(error);
            }

            LogRocket.log(`❌ ${message}`, {
                ...this.sanitizeMetadata(metadata),
                error: error
                    ? {
                          name: error.name,
                          message: error.message,
                          stack: error.stack || 'No stack trace',
                      }
                    : 'No error object',
            });
        }
    }

    logUserAction(userId: string, action: string, resource?: string, metadata?: LogMetadata): void {
        if (this.initialized) {
            LogRocket.identify(userId);

            LogRocket.track(action, {
                resource: resource || '',
                userId,
                timestamp: new Date().toISOString(),
                ...this.sanitizeMetadata(metadata),
            });
        }

        const actionDescription = resource
            ? `User ${userId} performed ${action} on ${resource}`
            : `User ${userId} performed ${action}`;
        console.info(`👤 ${actionDescription}`, metadata);
    }

    setUser(userId: string, userInfo: UserInfo): void {
        if (this.initialized) {
            const userPayload: Record<string, string | number | boolean> = {
                userId,
            };

            if (userInfo.email) userPayload.email = userInfo.email;
            if (userInfo.name) userPayload.name = userInfo.name;
            if (userInfo.role) userPayload.role = userInfo.role;
            if (userInfo.lastLoginAt) {
                userPayload.lastLoginAt =
                    userInfo.lastLoginAt instanceof Date
                        ? userInfo.lastLoginAt.toISOString()
                        : String(userInfo.lastLoginAt);
            }

            LogRocket.identify(userId, userPayload);
        }
        console.info(`👤 User identified: ${userId}`, userInfo);
    }
}
