import { useTheme } from 'next-themes';
import { useEffect, useState, useRef, useCallback } from 'react';

export default function useNextTheme() {
    const { theme, setTheme: setNextTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const hasLoadedPrefs = useRef(false);
    const isUserAction = useRef(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Stable callback with useCallback
    const loadUserTheme = useCallback(async () => {
        // Önce koşulları kontrol et
        if (!mounted || hasLoadedPrefs.current || isUserAction.current) {
            return;
        }

        console.log('🔄 Loading user theme preferences...');

        try {
            const response = await fetch('/api/user/preferences');
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.preferences.theme) {
                    const userTheme = result.preferences.theme;
                    console.log('✅ User theme loaded:', userTheme, 'Current:', theme);

                    // Sadece farklı ise set et
                    if (userTheme !== theme) {
                        setNextTheme(userTheme);
                    }
                }
            }
        } catch (error) {
            console.error('❌ Failed to load user theme:', error);
        } finally {
            hasLoadedPrefs.current = true;
        }
    }, [mounted, theme, setNextTheme]);

    // Sadece mount olduğunda bir kez çalış
    useEffect(() => {
        if (mounted && !hasLoadedPrefs.current) {
            const timeoutId = setTimeout(loadUserTheme, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [mounted, loadUserTheme]);

    // Enhanced setTheme with user sync
    const setThemeWithSync = useCallback(
        async (newTheme: string) => {
            console.log('🎨 Setting theme to:', newTheme);

            // User action olduğunu işaretle
            isUserAction.current = true;

            // Anında tema değiştir
            setNextTheme(newTheme);

            try {
                const response = await fetch('/api/user/preferences', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ theme: newTheme }),
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.themeChanged) {
                        console.log('💾 Theme preference saved to database');
                    }
                }
            } catch (error) {
                console.debug('⚠️ Theme sync failed:', error);
            } finally {
                // 2 saniye sonra user action flag'ini sıfırla
                setTimeout(() => {
                    isUserAction.current = false;
                }, 2000);
            }
        },
        [setNextTheme]
    );

    return [theme || 'light', mounted, setThemeWithSync, resolvedTheme || 'light'] as const;
}
