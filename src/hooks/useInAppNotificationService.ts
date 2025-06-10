'use client';

import { useCallback } from 'react';
import { useInAppNotificationContext } from '@/contexts/inapp-notification-context';
import { NOTIFICATION_TYPES, NotificationData, NotificationMetadata } from '@/types/notification';

export function useInAppNotificationService() {
    const { triggerRefresh } = useInAppNotificationContext();

    const createNotification = useCallback(
        async (type: string, title: string, message: string, data?: NotificationData) => {
            try {
                const response = await fetch('/api/notifications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type,
                        title,
                        message,
                        data: {
                            timestamp: new Date().toISOString(),
                            ...data,
                        },
                    }),
                });

                if (response.ok) {
                    setTimeout(triggerRefresh, 300);
                    return true;
                }

                console.warn('Failed to create notification');
                return false;
            } catch (error) {
                console.error('Notification service error:', error);
                return false;
            }
        },
        [triggerRefresh]
    );

    const createProfileUpdated = useCallback(
        async (changes: string[]) => {
            return await createNotification(
                NOTIFICATION_TYPES.PROFILE_UPDATED,
                'Profile Updated',
                `Your profile has been updated. Changes: ${changes.join(', ')}`,
                { changes, changeSource: 'settings_page' }
            );
        },
        [createNotification]
    );

    const createPasswordChanged = useCallback(
        async (metadata?: NotificationMetadata) => {
            return await createNotification(
                NOTIFICATION_TYPES.PASSWORD_CHANGED,
                'Password Changed',
                'Your password has been successfully changed for security.',
                { changeSource: 'settings_page', ...metadata }
            );
        },
        [createNotification]
    );

    const createAvatarUpdated = useCallback(async () => {
        return await createNotification(
            NOTIFICATION_TYPES.AVATAR_UPDATED,
            'Avatar Updated',
            'Your profile picture has been updated successfully.',
            { changeSource: 'settings_page' }
        );
    }, [createNotification]);

    const createAvatarRemoved = useCallback(async () => {
        return await createNotification(
            NOTIFICATION_TYPES.AVATAR_REMOVED,
            'Avatar Removed',
            'Your profile picture has been removed.',
            { changeSource: 'settings_page' }
        );
    }, [createNotification]);

    return {
        createNotification,
        createProfileUpdated,
        createPasswordChanged,
        createAvatarUpdated,
        createAvatarRemoved,
    };
}
