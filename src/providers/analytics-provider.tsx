'use client';

import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useCookieConsent } from '@/hooks/useCookieConsent';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    const { canUseAnalytics, canUseFunctional, isLoading } = useCookieConsent();
    const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

    if (isLoading) {
        return <>{children}</>;
    }

    return (
        <>
            {children}
            {canUseAnalytics && <Analytics />}
            {canUseFunctional && <SpeedInsights />}
            {canUseAnalytics && googleAnalyticsId && (
                <GoogleAnalytics measurementId={googleAnalyticsId} />
            )}
        </>
    );
}
