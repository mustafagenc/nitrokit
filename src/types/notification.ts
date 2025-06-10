import {
    User,
    Lock,
    Image,
    MessageSquare,
    DollarSign,
    AlertTriangle,
    CheckCircle2,
} from 'lucide-react';

export const NOTIFICATION_TYPES = {
    PROFILE_UPDATED: 'PROFILE_UPDATED',
    PASSWORD_CHANGED: 'PASSWORD_CHANGED',
    PHONE_VERIFIED: 'PHONE_VERIFIED',
    AVATAR_UPDATED: 'AVATAR_UPDATED',
    AVATAR_REMOVED: 'AVATAR_REMOVED',
    SUPPORT_MESSAGE: 'SUPPORT_MESSAGE',
    INVOICE_CREATED: 'INVOICE_CREATED',
    INVOICE_PAID: 'INVOICE_PAID',
    SYSTEM_ALERT: 'SYSTEM_ALERT',
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

export const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case 'PROFILE_UPDATED':
            return User;
        case 'PASSWORD_CHANGED':
            return Lock;
        case 'AVATAR_UPDATED':
        case 'AVATAR_REMOVED':
            return Image;
        case 'SUPPORT_MESSAGE':
            return MessageSquare;
        case 'INVOICE_CREATED':
        case 'INVOICE_PAID':
            return DollarSign;
        case 'SYSTEM_ALERT':
            return AlertTriangle;
        default:
            return CheckCircle2;
    }
};

export const getNotificationColors = (type: NotificationType) => {
    switch (type) {
        case 'PROFILE_UPDATED':
            return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
        case 'PASSWORD_CHANGED':
            return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
        case 'AVATAR_UPDATED':
        case 'AVATAR_REMOVED':
            return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
        case 'SUPPORT_MESSAGE':
            return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
        case 'INVOICE_CREATED':
        case 'INVOICE_PAID':
            return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400';
        case 'SYSTEM_ALERT':
            return 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
        default:
            return 'bg-gray-100 text-gray-600 dark:bg-zinc-800/50 dark:text-zinc-400';
    }
};

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

export interface PhoneVerifiedData {
    [key: string]: unknown;
    phoneNumber: string;
    timestamp: string;
    verificationMethod: 'sms' | 'call';
    countryCode?: string;
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
    | PhoneVerifiedData
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
