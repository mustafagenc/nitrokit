import { prisma } from '@/lib/prisma';

import {
    NotificationType,
    NotificationData,
    ProfileUpdateData,
    PasswordChangeData,
    AvatarUpdateData,
    NOTIFICATION_TYPES,
} from '@/types/notification';
import { Prisma } from 'generated/prisma';

export interface CreateNotificationData {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: NotificationData;
}

export class NotificationService {
    static async create(data: CreateNotificationData) {
        try {
            const notification = await prisma.notification.create({
                data: {
                    userId: data.userId,
                    type: data.type,
                    title: data.title,
                    message: data.message,
                    data: (data.data || {}) as Prisma.InputJsonValue,
                },
            });

            return notification;
        } catch (error) {
            console.error('Failed to create notification:', error);
            throw error;
        }
    }

    static async getByUserId(
        userId: string,
        options?: {
            unreadOnly?: boolean;
            limit?: number;
            offset?: number;
        }
    ) {
        const { unreadOnly = false, limit = 20, offset = 0 } = options || {};

        return await prisma.notification.findMany({
            where: {
                userId,
                ...(unreadOnly && { read: false }),
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
    }

    static async markAsRead(notificationId: string, userId: string) {
        return await prisma.notification.update({
            where: {
                id: notificationId,
                userId,
            },
            data: { read: true },
        });
    }

    static async markAllAsRead(userId: string) {
        return await prisma.notification.updateMany({
            where: {
                userId,
                read: false,
            },
            data: { read: true },
        });
    }

    static async delete(notificationId: string, userId: string) {
        return await prisma.notification.delete({
            where: {
                id: notificationId,
                userId,
            },
        });
    }

    static async getUnreadCount(userId: string) {
        return await prisma.notification.count({
            where: {
                userId,
                read: false,
            },
        });
    }

    // Type-safe notification creators
    static async createProfileUpdateNotification(userId: string, changes: string[]) {
        const data: ProfileUpdateData = {
            changes,
            timestamp: new Date().toISOString(),
            type: 'profile_update',
        };

        return this.create({
            userId,
            type: NOTIFICATION_TYPES.PROFILE_UPDATED,
            title: 'Profile Updated',
            message: `Your profile has been updated. Changes: ${changes.join(', ')}`,
            data,
        });
    }

    static async createPasswordChangeNotification(userId: string) {
        const data: PasswordChangeData = {
            timestamp: new Date().toISOString(),
            type: 'password_change',
        };

        return this.create({
            userId,
            type: NOTIFICATION_TYPES.PASSWORD_CHANGED,
            title: 'Password Changed',
            message: 'Your password has been successfully changed.',
            data,
        });
    }

    static async createAvatarUpdateNotification(userId: string, action: 'updated' | 'removed') {
        const data: AvatarUpdateData = {
            action,
            timestamp: new Date().toISOString(),
            type: 'avatar_update',
        };

        return this.create({
            userId,
            type:
                action === 'updated'
                    ? NOTIFICATION_TYPES.AVATAR_UPDATED
                    : NOTIFICATION_TYPES.AVATAR_REMOVED,
            title: `Profile Picture ${action === 'updated' ? 'Updated' : 'Removed'}`,
            message: `Your profile picture has been ${action}.`,
            data,
        });
    }
}
