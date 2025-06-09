import { LogLevel, LoggerProvider, LogMetadata, UserInfo } from './types';
import { createLoggerProvider } from './providers';

interface DeviceInfo {
    deviceType: 'desktop' | 'mobile' | 'tablet';
    browser: string;
    os: string;
}

interface SecurityEventDetails {
    ip?: string;
    userAgent?: string;
    location?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    [key: string]: string | number | boolean | undefined;
}

class Logger {
    private provider: LoggerProvider;
    private level: LogLevel;

    constructor() {
        const providerName = process.env.NEXT_PUBLIC_LOG_PROVIDER || 'console';
        this.level = (process.env.LOG_LEVEL as LogLevel) || 'info';
        this.provider = createLoggerProvider(providerName);
    }

    private shouldLog(level: LogLevel): boolean {
        const levels: Record<LogLevel, number> = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3,
            critical: 4,
        };
        return levels[level] >= levels[this.level];
    }

    debug(message: string, metadata?: LogMetadata): void {
        if (this.shouldLog('debug')) {
            console.debug(`🐛 [DEBUG] ${message}`, metadata);
        }
    }

    info(message: string, metadata?: LogMetadata): void {
        if (this.shouldLog('info')) {
            this.provider.info(message, metadata);
        }
    }

    warn(message: string, metadata?: LogMetadata): void {
        if (this.shouldLog('warn')) {
            this.provider.warn(message, metadata);
        }
    }

    error(message: string, error?: Error, metadata?: LogMetadata): void {
        this.provider.error(message, error, metadata);
    }

    critical(message: string, error?: Error, metadata?: LogMetadata): void {
        console.error(`🚨 CRITICAL: ${message}`, error, metadata);
        this.provider.error(`CRITICAL: ${message}`, error, metadata);
    }

    logUserAction(userId: string, action: string, resource?: string, metadata?: LogMetadata): void {
        this.provider.logUserAction(userId, action, resource, metadata);
    }

    setUser(userId: string, userInfo: UserInfo): void {
        this.provider.setUser(userId, userInfo);
    }

    logSessionCreate(userId: string, sessionId: string, deviceInfo: DeviceInfo): void {
        this.logUserAction(userId, 'session_create', sessionId, {
            deviceType: deviceInfo.deviceType,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
        });
    }

    logSessionTerminate(userId: string, sessionId: string, terminatedBy: string): void {
        this.logUserAction(userId, 'session_terminate', sessionId, {
            terminatedBy,
            timestamp: new Date().toISOString(),
        });
    }

    logSecurityEvent(userId: string, event: string, details: SecurityEventDetails): void {
        this.warn(`Security Event: ${event}`, {
            userId,
            event,
            ...details,
        });
    }
}

export const logger = new Logger();
