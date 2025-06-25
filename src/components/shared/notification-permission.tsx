'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export function NotificationPermission() {
    const t = useTranslations('notificationPermission');
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
        if (Notification.permission === 'denied') {
            navigator.serviceWorker.ready.then(async (registration) => {
                const existing = await registration.pushManager.getSubscription();
                if (existing) {
                    await existing.unsubscribe();
                    await fetch('/api/notifications/unsubscribe', { method: 'POST' });
                }
                setSubscribed(false);
            });
            return;
        }
        navigator.serviceWorker.ready.then(async (registration) => {
            const existing = await registration.pushManager.getSubscription();
            setSubscribed(!!existing);
            if (!existing && !localStorage.getItem('notification-banner-closed')) {
                setShowBanner(true);
            }
        });
    }, []);

    const subscribe = async () => {
        setLoading(true);
        setError(null);
        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                setError(t('error.permission'));
                setLoading(false);
                return;
            }
            const registration = await navigator.serviceWorker.ready;
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
                ),
            });
            await fetch('/api/notifications/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sub),
            });
            setSubscribed(true);
            setShowBanner(false);
            localStorage.setItem('notification-banner-closed', 'true');
        } catch (e) {
            console.error('Subscription failed:', e);
            setError(t('error.subscribe'));
        } finally {
            setLoading(false);
        }
    };

    const handleCloseBanner = () => {
        setShowBanner(false);
        localStorage.setItem('notification-banner-closed', 'true');
    };

    return (
        showBanner &&
        !subscribed && (
            <div
                className="fixed top-20 left-0 z-50 flex w-full justify-center"
                style={{ pointerEvents: 'none' }}
            >
                <div
                    className="m-2 flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    style={{ pointerEvents: 'auto', maxWidth: 480 }}
                >
                    <div className="flex-1 text-left">
                        <strong>{t('title')}</strong>
                        <div className="text-sm">{t('description')}</div>
                        {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
                    </div>
                    <button
                        onClick={subscribe}
                        disabled={loading}
                        className="rounded bg-blue-600 px-3 py-1 text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        {t('allow')}
                    </button>
                    <button
                        onClick={handleCloseBanner}
                        disabled={loading}
                        className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        aria-label={t('later')}
                    >
                        ✕
                    </button>
                </div>
            </div>
        )
    );
}

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
