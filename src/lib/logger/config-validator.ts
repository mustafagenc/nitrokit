interface LoggerConfig {
    provider: string;
    level: string;
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

export function validateLoggerConfig(): LoggerConfig {
    const config: LoggerConfig = {
        provider: process.env.NEXT_PUBLIC_LOG_PROVIDER || 'console',
        level: process.env.LOG_LEVEL || 'info',
        isValid: true,
        errors: [],
        warnings: [],
    };

    // Validate provider
    const validProviders = ['sentry', 'logrocket', 'mixpanel', 'posthog', 'console'];
    if (!validProviders.includes(config.provider)) {
        config.errors.push(
            `Invalid LOG_PROVIDER: ${config.provider}. Must be one of: ${validProviders.join(', ')}`
        );
        config.isValid = false;
    }

    // Validate level
    const validLevels = ['debug', 'info', 'warn', 'error', 'critical'];
    if (!validLevels.includes(config.level)) {
        config.errors.push(
            `Invalid LOG_LEVEL: ${config.level}. Must be one of: ${validLevels.join(', ')}`
        );
        config.isValid = false;
    }

    // Provider-specific validation
    switch (config.provider) {
        case 'sentry':
            if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
                config.errors.push('NEXT_PUBLIC_SENTRY_DSN is required when using Sentry provider');
                config.isValid = false;
            }
            break;

        case 'logrocket':
            if (!process.env.NEXT_PUBLIC_LOGROCKET_APP_ID) {
                config.errors.push(
                    'NEXT_PUBLIC_LOGROCKET_APP_ID is required when using LogRocket provider'
                );
                config.isValid = false;
            }
            break;

        case 'mixpanel':
            if (!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
                config.errors.push(
                    'NEXT_PUBLIC_MIXPANEL_TOKEN is required when using Mixpanel provider'
                );
                config.isValid = false;
            }
            break;

        case 'posthog':
            if (!process.env.NEXT_PUBLIC_POSTHOG_API_KEY) {
                config.errors.push(
                    'NEXT_PUBLIC_POSTHOG_API_KEY is required when using PostHog provider'
                );
                config.isValid = false;
            }
            break;
    }

    if (process.env.NODE_ENV === 'production') {
        if (config.provider === 'console') {
            config.warnings.push('Using console provider in production is not recommended');
        }

        if (config.level === 'debug') {
            config.warnings.push('Debug log level in production may impact performance');
        }
    }

    return config;
}

const configValidation = validateLoggerConfig();
if (!configValidation.isValid) {
    console.error('❌ Logger Configuration Errors:', configValidation.errors);
}
if (configValidation.warnings.length > 0) {
    console.warn('⚠️ Logger Configuration Warnings:', configValidation.warnings);
}
