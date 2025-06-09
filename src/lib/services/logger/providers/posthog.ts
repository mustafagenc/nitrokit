import { PostHog } from 'posthog-node';
import { LoggerProvider, LogMetadata, UserInfo } from '../types';

export class PosthogProvider implements LoggerProvider {
    private client: PostHog | null = null;
    private initialized = false;

    constructor() {
        if (process.env.NEXT_PUBLIC_POSTHOG_API_KEY) {
            try {
                this.client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_API_KEY, {
                    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
                    flushAt: 10,
                    flushInterval: 10000,
                    personalApiKey: process.env.POSTHOG_PERSONAL_API_KEY,
                });
                this.initialized = true;
            } catch (error) {
                console.error('Failed to initialize PostHog:', error);
            }
        }
    }

    private sanitizeProperties(
        metadata?: LogMetadata
    ): Record<string, string | number | boolean | null> {
        if (!metadata) return {};

        const sanitized: Record<string, string | number | boolean | null> = {};

        for (const [key, value] of Object.entries(metadata)) {
            if (value === null || value === undefined) {
                sanitized[key] = null;
            } else if (typeof value === 'object') {
                sanitized[key] = JSON.stringify(value);
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

    private getDistinctId(): string {
        return typeof window !== 'undefined'
            ? localStorage.getItem('posthog_distinct_id') || 'anonymous'
            : 'server';
    }

    info(message: string, metadata?: LogMetadata): void {
        if (this.initialized && this.client) {
            this.client.capture({
                distinctId: this.getDistinctId(),
                event: 'Info Log',
                properties: {
                    message,
                    level: 'info',
                    timestamp: new Date().toISOString(),
                    ...this.sanitizeProperties(metadata),
                },
            });
        }
        console.info(`ℹ️ ${message}`, metadata);
    }

    warn(message: string, metadata?: LogMetadata): void {
        if (this.initialized && this.client) {
            this.client.capture({
                distinctId: this.getDistinctId(),
                event: 'Warning Log',
                properties: {
                    message,
                    level: 'warning',
                    timestamp: new Date().toISOString(),
                    ...this.sanitizeProperties(metadata),
                },
            });
        }
        console.warn(`⚠️ ${message}`, metadata);
    }

    error(message: string, error?: Error, metadata?: LogMetadata): void {
        console.error(`❌ ${message}`, error, metadata);

        if (this.initialized && this.client) {
            this.client.capture({
                distinctId: this.getDistinctId(),
                event: 'Error Log',
                properties: {
                    message,
                    level: 'error',
                    timestamp: new Date().toISOString(),
                    error_name: error?.name || null,
                    error_message: error?.message || null,
                    has_stack: error?.stack ? true : false,
                    ...this.sanitizeProperties(metadata),
                },
            });
        }
    }

    logUserAction(userId: string, action: string, resource?: string, metadata?: LogMetadata): void {
        if (this.initialized && this.client) {
            this.client.capture({
                distinctId: userId,
                event: action,
                properties: {
                    resource: resource || null,
                    user_id: userId,
                    timestamp: new Date().toISOString(),
                    ...this.sanitizeProperties(metadata),
                },
            });
        }

        const actionDescription = resource
            ? `User ${userId} performed ${action} on ${resource}`
            : `User ${userId} performed ${action}`;
        console.info(`👤 ${actionDescription}`, metadata);
    }

    setUser(userId: string, userInfo: UserInfo): void {
        if (this.initialized && this.client) {
            const userProperties: Record<string, string | number | boolean | null> = {
                user_id: userId,
            };

            if (userInfo.email) userProperties.email = userInfo.email;
            if (userInfo.name) userProperties.name = userInfo.name;
            if (userInfo.role) userProperties.role = userInfo.role;
            if (userInfo.lastLoginAt) {
                userProperties.last_login =
                    userInfo.lastLoginAt instanceof Date
                        ? userInfo.lastLoginAt.toISOString()
                        : String(userInfo.lastLoginAt);
            }

            userProperties.updated_at = new Date().toISOString();

            this.client.identify({
                distinctId: userId,
                properties: userProperties,
            });
        }
        console.info(`👤 User identified: ${userId}`, userInfo);
    }

    async shutdown(): Promise<void> {
        if (this.client) {
            await this.client.shutdown();
        }
    }
}
