// src/types/notification.ts
export const NOTIFICATION_TYPES = {
    PROFILE_UPDATED: 'PROFILE_UPDATED',
    PASSWORD_CHANGED: 'PASSWORD_CHANGED',
    AVATAR_UPDATED: 'AVATAR_UPDATED',
    AVATAR_REMOVED: 'AVATAR_REMOVED',
    SUPPORT_MESSAGE: 'SUPPORT_MESSAGE',
    INVOICE_CREATED: 'INVOICE_CREATED',
    INVOICE_PAID: 'INVOICE_PAID',
    SYSTEM_ALERT: 'SYSTEM_ALERT',
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

export interface ClientNotificationData {
    type: NotificationType;
    title: string;
    message: string;
    data?: NotificationData;
}

export interface NotificationMetadata {
    timestamp?: string;
    changeSource?: string;
    ipAddress?: string;
    userAgent?: string;
    [key: string]: unknown;
}

export interface ProfileUpdateData {
    [key: string]: unknown;
    changes: string[];
}

export interface PasswordChangeData {
    [key: string]: unknown;
    timestamp: string;
}

export interface AvatarUpdateData {
    [key: string]: unknown;
    action: 'updated' | 'removed';
    timestamp: string;
}

export interface SupportMessageData {
    [key: string]: unknown;
    ticketId: string;
    messageId: string;
    priority: 'low' | 'medium' | 'high';
}

export interface InvoiceData {
    [key: string]: unknown;
    invoiceId: string;
    amount: number;
    currency: string;
    status: 'created' | 'paid' | 'overdue';
}

export interface SystemAlertData {
    [key: string]: unknown;
    severity: 'info' | 'warning' | 'error';
    category: string;
}

export type NotificationData =
    | ProfileUpdateData
    | PasswordChangeData
    | AvatarUpdateData
    | SupportMessageData
    | InvoiceData
    | SystemAlertData
    | Record<string, unknown>;

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: NotificationData | null;
    read: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    refresh: () => void;
    triggerRefresh: () => void;
}

export function isProfileUpdateData(data: unknown): data is ProfileUpdateData {
    return (
        typeof data === 'object' &&
        data !== null &&
        'changes' in data &&
        Array.isArray((data as ProfileUpdateData).changes)
    );
}

export function isPasswordChangeData(data: unknown): data is PasswordChangeData {
    return (
        typeof data === 'object' &&
        data !== null &&
        'timestamp' in data &&
        typeof (data as PasswordChangeData).timestamp === 'string'
    );
}

export function isAvatarUpdateData(data: unknown): data is AvatarUpdateData {
    return (
        typeof data === 'object' &&
        data !== null &&
        'action' in data &&
        ['updated', 'removed'].includes((data as AvatarUpdateData).action)
    );
}

// Safe data extraction utility
export function safeGetNotificationData<T>(
    data: unknown,
    guard: (data: unknown) => data is T
): T | null {
    try {
        return guard(data) ? data : null;
    } catch {
        return null;
    }
}
