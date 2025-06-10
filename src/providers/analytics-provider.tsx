'use client';

import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { env } from '@/lib/env';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useCookieConsent } from '@/hooks/useCookieConsent';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    const { canUseAnalytics, canUseFunctional, isLoading } = useCookieConsent();

    if (isLoading) {
        return <>{children}</>;
    }

    return (
        <>
            {children}
            {canUseAnalytics && <Analytics />}
            {canUseFunctional && <SpeedInsights />}
            {canUseAnalytics && env.GOOGLE_ANALYTICS && (
                <GoogleAnalytics measurementId={env.GOOGLE_ANALYTICS} />
            )}
        </>
    );
}
