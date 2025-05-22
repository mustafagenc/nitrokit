import { env } from '@/lib/env';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Analytics />
            <SpeedInsights />
            {env.GOOGLE_ANALYTICS && <GoogleAnalytics gaId={env.GOOGLE_ANALYTICS} />}
        </>
    );
}
