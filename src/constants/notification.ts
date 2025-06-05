import {
    User,
    Lock,
    Image,
    MessageSquare,
    DollarSign,
    AlertTriangle,
    CheckCircle2,
} from 'lucide-react';
import type { NotificationType } from '@/types/notification';

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
