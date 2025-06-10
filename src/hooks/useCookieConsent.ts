'use client';

import { useEffect, useState } from 'react';

interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
}

export function useCookieConsent() {
    const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
    const [hasConsent, setHasConsent] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const consent = localStorage.getItem('nitrokit-cookie-consent');
        const savedPreferences = localStorage.getItem('nitrokit-cookie-preferences');

        if (consent && savedPreferences) {
            const parsedPreferences = JSON.parse(savedPreferences) as CookiePreferences;
            setPreferences(parsedPreferences);
            setHasConsent(true);
        }

        setIsLoading(false);

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'nitrokit-cookie-preferences' && e.newValue) {
                const newPreferences = JSON.parse(e.newValue) as CookiePreferences;
                setPreferences(newPreferences);
                setHasConsent(true);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return {
        preferences,
        hasConsent,
        isLoading,
        canUseAnalytics: hasConsent && preferences?.analytics,
        canUseMarketing: hasConsent && preferences?.marketing,
        canUseFunctional: hasConsent && preferences?.functional,
    };
}
