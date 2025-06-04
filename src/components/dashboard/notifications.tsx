'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Bell,
    User,
    Lock,
    Image,
    MessageSquare,
    DollarSign,
    AlertTriangle,
    CheckCircle2,
    X,
} from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import type { NotificationType } from '@/types/notification';

// Icon mapping for notification types
const getNotificationIcon = (type: NotificationType) => {
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

// Color mapping for notification types
const getNotificationColors = (type: NotificationType) => {
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

export function Notifications() {
    const {
        notifications,
        unreadCount,
        isLoading,
        error,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refresh,
    } = useNotifications();

    const handleNotificationClick = async (notificationId: string, read: boolean) => {
        if (!read) {
            await markAsRead(notificationId);
        }
    };

    const handleRemoveNotification = async (notificationId: string) => {
        await deleteNotification(notificationId);
    };

    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="relative h-8 w-8 rounded-full hover:bg-white hover:shadow-sm dark:hover:bg-zinc-800"
                    aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
                <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-zinc-700">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    <div className="flex items-center gap-2">
                        {error && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={refresh}
                                className="h-8 px-2 text-xs text-orange-600"
                                title="Retry">
                                ↻
                            </Button>
                        )}
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleMarkAllAsRead}
                                className="h-8 px-2 text-xs"
                                disabled={isLoading}>
                                Mark all read
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-500 dark:text-zinc-400">
                            <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent opacity-50" />
                            <p>Loading notifications...</p>
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-500 dark:text-red-400">
                            <AlertTriangle className="mx-auto mb-2 h-8 w-8 opacity-50" />
                            <p className="text-sm">{error}</p>
                            <Button variant="outline" size="sm" onClick={refresh} className="mt-2">
                                Try Again
                            </Button>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-zinc-400">
                            <Bell className="mx-auto mb-2 h-8 w-8 opacity-50" />
                            <p>No notifications</p>
                        </div>
                    ) : (
                        <ScrollArea className="h-[318px]">
                            <div>
                                {notifications.map(notification => {
                                    const Icon = getNotificationIcon(notification.type);
                                    const colors = getNotificationColors(notification.type);

                                    return (
                                        <div
                                            key={notification.id}
                                            className={cn(
                                                'flex cursor-pointer items-start space-x-3 border-b border-gray-100 p-4 transition-colors last:border-b-0 hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-800',
                                                !notification.read &&
                                                    'bg-blue-50/50 dark:bg-blue-900/10'
                                            )}
                                            onClick={() =>
                                                handleNotificationClick(
                                                    notification.id,
                                                    notification.read
                                                )
                                            }>
                                            <div
                                                className={cn(
                                                    'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                                                    colors
                                                )}>
                                                <Icon className="h-4 w-4" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium text-gray-900 dark:text-zinc-100">
                                                            {notification.title}
                                                        </p>
                                                        <p className="line-clamp-2 text-sm text-gray-600 dark:text-zinc-400">
                                                            {notification.message}
                                                        </p>
                                                        <p className="mt-1 text-xs text-gray-500 dark:text-zinc-500">
                                                            {formatDistanceToNow(
                                                                new Date(notification.createdAt),
                                                                {
                                                                    addSuffix: true,
                                                                }
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-shrink-0 items-center space-x-1">
                                                        {!notification.read && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={e => {
                                                                    e.stopPropagation();
                                                                    markAsRead(notification.id);
                                                                }}
                                                                className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                                                                title="Mark as read">
                                                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                handleRemoveNotification(
                                                                    notification.id
                                                                );
                                                            }}
                                                            className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                                                            title="Remove notification">
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    )}
                    {notifications.length > 0 && (
                        <div className="border-t border-gray-200 p-3 dark:border-zinc-700">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-full justify-center text-xs"
                                asChild>
                                <Link href={'/dashboard/notifications'}>
                                    View all notifications
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
