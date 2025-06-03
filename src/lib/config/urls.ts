/**
 * Retrieves the base URL for the application.
 * It checks for the following environment variables in order:
 * 1. NEXT_PUBLIC_APP_URL
 * 2. VERCEL_PROJECT_PRODUCTION_URL (if VERCEL_ENV is 'production')
 * 3. VERCEL_URL
 * If none of these are set, it defaults to 'http://localhost:3000'.
 * @returns {string} The base URL.
 */
export function getBaseUrl(): string {
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL;
    }

    if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    return 'http://localhost:3000';
}

/**
 * Gets the Storybook URL based on environment configuration.
 *
 * @returns The Storybook URL string. Priority order:
 *   1. `NEXT_PUBLIC_APP_URL/storybook` if available
 *   2. `https://{VERCEL_PROJECT_PRODUCTION_URL}/storybook` if in Vercel production
 *   3. `https://{VERCEL_URL}/storybook` if VERCEL_URL is available
 *   4. `http://localhost:6006` as fallback for local development
 */
export function getStroybookUrl(): string {
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return `${process.env.NEXT_PUBLIC_APP_URL}/storybook`;
    }

    if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/storybook`;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}/storybook`;
    }

    return 'http://localhost:6006';
}
