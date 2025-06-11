import { prisma } from '@/lib/prisma';
import {
    NotificationType,
    NotificationData,
    ProfileUpdateData,
    PasswordChangeData,
    AvatarUpdateData,
    PhoneVerifiedData,
    NOTIFICATION_TYPES,
    ClientNotificationData,
    NotificationMetadata,
} from '@/types/notification';
import { Prisma } from 'generated/prisma';

export interface CreateNotificationData {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: NotificationData;
}

export class InAppNotificationService {
    // ========================================
    // SERVER-SIDE METHODS (Database Operations)
    // ========================================

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

    // ========================================
    // SERVER-SIDE TYPE-SAFE NOTIFICATION CREATORS
    // ========================================

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

    static async createPasswordChangeNotification(userId: string, metadata?: NotificationMetadata) {
        const data: PasswordChangeData = {
            timestamp: new Date().toISOString(),
            type: 'password_change',
            ...metadata,
        };

        return this.create({
            userId,
            type: NOTIFICATION_TYPES.PASSWORD_CHANGED,
            title: 'Password Changed',
            message: 'Your password has been successfully changed for security.',
            data,
        });
    }

    static async createPhoneVerifiedNotification(
        userId: string,
        phoneNumber: string,
        countryCode?: string
    ) {
        const data: PhoneVerifiedData = {
            phoneNumber,
            timestamp: new Date().toISOString(),
            verificationMethod: 'sms' as const,
            countryCode,
            type: 'phone_verified',
        };

        return this.create({
            userId,
            type: NOTIFICATION_TYPES.PHONE_VERIFIED,
            title: 'Phone Number Verified',
            message: `Your phone number ${phoneNumber} has been successfully verified.`,
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

    static async createSupportMessageNotification(
        userId: string,
        title: string,
        message: string,
        ticketId?: string
    ) {
        return this.create({
            userId,
            type: NOTIFICATION_TYPES.SUPPORT_MESSAGE,
            title,
            message,
            data: {
                ticketId,
                source: 'support_system',
                timestamp: new Date().toISOString(),
                type: 'support_message',
            },
        });
    }

    static async createInvoiceCreatedNotification(
        userId: string,
        invoiceId: string,
        amount: number
    ) {
        return this.create({
            userId,
            type: NOTIFICATION_TYPES.INVOICE_CREATED,
            title: 'Invoice Created',
            message: `A new invoice of $${amount} has been created.`,
            data: {
                invoiceId,
                amount,
                source: 'billing_system',
                timestamp: new Date().toISOString(),
                type: 'invoice_created',
            },
        });
    }

    static async createInvoicePaidNotification(userId: string, invoiceId: string, amount: number) {
        return this.create({
            userId,
            type: NOTIFICATION_TYPES.INVOICE_PAID,
            title: 'Payment Received',
            message: `Payment of $${amount} has been received. Thank you!`,
            data: {
                invoiceId,
                amount,
                source: 'billing_system',
                timestamp: new Date().toISOString(),
                type: 'invoice_paid',
            },
        });
    }

    static async createSystemAlertNotification(
        userId: string,
        title: string,
        message: string,
        alertLevel: 'info' | 'warning' | 'error' = 'info',
        data?: NotificationData
    ) {
        return this.create({
            userId,
            type: NOTIFICATION_TYPES.SYSTEM_ALERT,
            title,
            message,
            data: {
                alertLevel,
                source: 'system',
                timestamp: new Date().toISOString(),
                type: 'system_alert',
                ...data,
            },
        });
    }

    // ========================================
    // CLIENT-SIDE METHODS (API Calls)
    // ========================================

    // Generic client-side notification creator
    static async createFromClient(notificationData: ClientNotificationData): Promise<boolean> {
        try {
            const response = await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...notificationData,
                    data: {
                        timestamp: new Date().toISOString(),
                        ...notificationData.data,
                    },
                }),
            });

            if (response.ok) {
                // Trigger refresh event for real-time updates
                window.dispatchEvent(new CustomEvent('notificationCreated'));
                return true;
            }

            console.warn('Failed to create notification:', await response.text());
            return false;
        } catch (error) {
            console.error('Client notification service error:', error);
            return false;
        }
    }

    // Client-side specific notification creators
    static async createProfileUpdatedFromClient(changes: string[]): Promise<boolean> {
        return this.createFromClient({
            type: NOTIFICATION_TYPES.PROFILE_UPDATED,
            title: 'Profile Updated',
            message: `Your profile has been updated. Changes: ${changes.join(', ')}`,
            data: {
                changes,
                changeSource: 'settings_page',
            },
        });
    }

    static async createPasswordChangedFromClient(
        metadata?: NotificationMetadata
    ): Promise<boolean> {
        return this.createFromClient({
            type: NOTIFICATION_TYPES.PASSWORD_CHANGED,
            title: 'Password Changed',
            message: 'Your password has been successfully changed for security.',
            data: {
                changeSource: 'settings_page',
                ...metadata,
            },
        });
    }

    static async createPhoneVerifiedFromClient(
        phoneNumber: string,
        countryCode?: string
    ): Promise<boolean> {
        return this.createFromClient({
            type: NOTIFICATION_TYPES.PHONE_VERIFIED,
            title: 'Phone Number Verified',
            message: `Your phone number ${phoneNumber} has been successfully verified.`,
            data: {
                phoneNumber,
                verificationMethod: 'sms' as const,
                countryCode,
                changeSource: 'settings_page',
            },
        });
    }

    static async createAvatarUpdatedFromClient(): Promise<boolean> {
        return this.createFromClient({
            type: NOTIFICATION_TYPES.AVATAR_UPDATED,
            title: 'Avatar Updated',
            message: 'Your profile picture has been updated successfully.',
            data: {
                changeSource: 'settings_page',
            },
        });
    }

    static async createAvatarRemovedFromClient(): Promise<boolean> {
        return this.createFromClient({
            type: NOTIFICATION_TYPES.AVATAR_REMOVED,
            title: 'Avatar Removed',
            message: 'Your profile picture has been removed.',
            data: {
                changeSource: 'settings_page',
            },
        });
    }

    static async createSystemAlertFromClient(
        title: string,
        message: string,
        alertLevel: 'info' | 'warning' | 'error' = 'info',
        data?: NotificationData
    ): Promise<boolean> {
        return this.createFromClient({
            type: NOTIFICATION_TYPES.SYSTEM_ALERT,
            title,
            message,
            data: {
                alertLevel,
                source: 'client',
                ...data,
            },
        });
    }

    // ========================================
    // UTILITY METHODS
    // ========================================

    // Bulk create notifications (useful for system-wide announcements)
    static async createBulkNotifications(
        userIds: string[],
        notificationData: Omit<CreateNotificationData, 'userId'>
    ) {
        try {
            const notifications = userIds.map((userId) => ({
                userId,
                type: notificationData.type,
                title: notificationData.title,
                message: notificationData.message,
                data: (notificationData.data || {}) as Prisma.InputJsonValue,
            }));

            return await prisma.notification.createMany({
                data: notifications,
            });
        } catch (error) {
            console.error('Failed to create bulk notifications:', error);
            throw error;
        }
    }

    // Get notification statistics
    static async getNotificationStats(userId: string) {
        const [total, unread, byType] = await Promise.all([
            // Total notifications
            prisma.notification.count({
                where: { userId },
            }),
            // Unread count
            prisma.notification.count({
                where: { userId, read: false },
            }),
            // Count by type
            prisma.notification.groupBy({
                by: ['type'],
                where: { userId },
                _count: { type: true },
            }),
        ]);

        return {
            total,
            unread,
            byType: byType.reduce(
                (acc, item) => {
                    acc[item.type] = item._count.type;
                    return acc;
                },
                {} as Record<string, number>
            ),
        };
    }

    // Clean old notifications (useful for maintenance)
    static async cleanOldNotifications(olderThanDays: number = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

        return await prisma.notification.deleteMany({
            where: {
                createdAt: {
                    lt: cutoffDate,
                },
                read: true, // Only delete read notifications
            },
        });
    }

    // Search notifications
    static async searchNotifications(
        userId: string,
        searchTerm: string,
        options?: {
            limit?: number;
            offset?: number;
        }
    ) {
        const { limit = 20, offset = 0 } = options || {};

        return await prisma.notification.findMany({
            where: {
                userId,
                OR: [
                    { title: { contains: searchTerm, mode: 'insensitive' } },
                    { message: { contains: searchTerm, mode: 'insensitive' } },
                ],
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
    }
}
