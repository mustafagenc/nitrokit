'use client';

import { NotificationContextType, Notification } from '@/types/notification';
import { createContext, useContext, useCallback, ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function useInAppNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = useCallback(async (showLoading = false) => {
        try {
            if (showLoading) setIsLoading(true);
            setError(null);

            const response = await fetch('/api/notifications');

            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }

            const data = await response.json();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (err) {
            console.error('Fetch notifications error:', err);
            setError(err instanceof Error ? err.message : 'Failed to load notifications');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Mark as read
    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            const response = await fetch(`/api/notifications/${notificationId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ read: true }),
            });

            if (response.ok) {
                setNotifications((prev) =>
                    prev.map((notification) =>
                        notification.id === notificationId
                            ? { ...notification, read: true }
                            : notification
                    )
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Mark as read error:', error);
            toast.error('Failed to mark notification as read');
        }
    }, []);

    // Mark all as read
    const markAllAsRead = useCallback(async () => {
        try {
            const response = await fetch('/api/notifications/mark-all-read', {
                method: 'POST',
            });

            if (response.ok) {
                setNotifications((prev) =>
                    prev.map((notification) => ({ ...notification, read: true }))
                );
                setUnreadCount(0);
                toast.success('All notifications marked as read');
            }
        } catch (error) {
            console.error('Mark all as read error:', error);
            toast.error('Failed to mark all as read');
        }
    }, []);

    // Delete notification
    const deleteNotification = useCallback(
        async (notificationId: string) => {
            try {
                const response = await fetch(`/api/notifications/${notificationId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    const deletedNotification = notifications.find((n) => n.id === notificationId);
                    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

                    if (deletedNotification && !deletedNotification.read) {
                        setUnreadCount((prev) => Math.max(0, prev - 1));
                    }

                    toast.success('Notification deleted');
                }
            } catch (error) {
                console.error('Delete notification error:', error);
                toast.error('Failed to delete notification');
            }
        },
        [notifications]
    );

    // Refresh
    const refresh = useCallback(() => {
        fetchNotifications(true);
    }, [fetchNotifications]);

    // Auto-refresh
    useEffect(() => {
        fetchNotifications(true);

        const interval = setInterval(() => {
            fetchNotifications(false);
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchNotifications]);

    // Window focus refresh
    useEffect(() => {
        const handleFocus = () => {
            fetchNotifications(false);
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [fetchNotifications]);

    return {
        notifications,
        unreadCount,
        isLoading,
        error,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refresh,
        refetch: fetchNotifications,
    };
}

export function InAppNotificationProvider({ children }: { children: ReactNode }) {
    const notificationHook = useInAppNotifications();

    const triggerRefresh = useCallback(() => {
        notificationHook.refetch(false);
    }, [notificationHook]);

    const contextValue = {
        ...notificationHook,
        triggerRefresh,
    };

    return (
        <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
    );
}

export function useInAppNotificationContext() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error(
            'useInAppNotificationContext must be used within a InAppNotificationProvider'
        );
    }
    return context;
}
