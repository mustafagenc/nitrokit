'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import type { Notification } from '@/types/notification';

interface UseNotificationsReturn {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
}

interface NotificationsResponse {
    notifications: Notification[];
    unreadCount: number;
    hasMore: boolean;
}

export function useNotifications(): UseNotificationsReturn {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = useCallback(async () => {
        if (!session?.user) {
            setIsLoading(false);
            return;
        }

        try {
            setError(null);
            const response = await fetch('/api/notifications');

            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }

            const data: NotificationsResponse = await response.json();
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            console.error('Fetch notifications error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [session?.user]);

    const markAsRead = useCallback(async (id: string) => {
        try {
            const response = await fetch(`/api/notifications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ read: true }),
            });

            if (!response.ok) {
                throw new Error('Failed to mark notification as read');
            }

            setNotifications(prev =>
                prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Mark as read error:', err);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            const response = await fetch('/api/notifications/mark-all-read', {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to mark all notifications as read');
            }

            setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Mark all as read error:', err);
        }
    }, []);

    const deleteNotification = useCallback(
        async (id: string) => {
            try {
                const response = await fetch(`/api/notifications/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete notification');
                }

                const wasUnread = notifications.find(n => n.id === id)?.read === false;
                setNotifications(prev => prev.filter(notif => notif.id !== id));
                if (wasUnread) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            } catch (err) {
                console.error('Delete notification error:', err);
            }
        },
        [notifications]
    );

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return {
        notifications,
        unreadCount,
        isLoading,
        error,
        refresh: fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    };
}
