// src/app/[locale]/[dashboard]/notifications/components/notifications-list.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib';
import { Bell, Check, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import { useInAppNotificationContext } from '@/contexts/inapp-notification-context';
import { getNotificationColors, getNotificationIcon } from '@/constants/notification';
import { Notification } from '@/types/notification';

export function NotificationsList() {
    const {
        notifications,
        unreadCount,
        isLoading,
        error,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refresh,
    } = useInAppNotificationContext();

    const [filter, setFilter] = useState<'all' | 'unread'>('unread');

    const filteredNotifications = (notifications as Notification[]).filter(notification => {
        if (filter === 'unread') return !notification.read;
        return true;
    });

    const handleMarkAsRead = async (notificationId: string) => {
        await markAsRead(notificationId);
    };

    const handleDeleteNotification = async (notificationId: string) => {
        await deleteNotification(notificationId);
    };

    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                        {unreadCount > 0 && (
                            <Badge variant="destructive" className="animate-pulse">
                                {unreadCount} unread
                            </Badge>
                        )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={refresh}
                            disabled={isLoading}
                            className="flex items-center gap-2">
                            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
                            Refresh
                        </Button>
                        {unreadCount > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleMarkAllAsRead}
                                disabled={isLoading}
                                className="flex items-center gap-2">
                                <Check className="h-4 w-4" />
                                Mark All Read
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs value={filter} onValueChange={value => setFilter(value as 'all' | 'unread')}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="unread">
                            Unread
                            {unreadCount > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {unreadCount}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="all">
                            All
                            <Badge variant="secondary" className="ml-2">
                                {notifications.length}
                            </Badge>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value={filter} className="mt-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
                                    <p className="text-muted-foreground text-sm">
                                        Loading notifications...
                                    </p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="py-12 text-center">
                                <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500 opacity-50" />
                                <p className="text-destructive mb-4 font-medium">{error}</p>
                                <Button onClick={refresh} variant="outline">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Try Again
                                </Button>
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="text-muted-foreground py-12 text-center">
                                <Bell className="mx-auto mb-4 h-16 w-16 opacity-20" />
                                <h3 className="mb-2 text-lg font-medium">
                                    {filter === 'unread'
                                        ? 'No unread notifications'
                                        : 'No notifications yet'}
                                </h3>
                                <p className="text-sm">
                                    {filter === 'unread'
                                        ? 'All caught up! You have no unread notifications.'
                                        : 'Notifications will appear here when you receive them.'}
                                </p>
                                {filter === 'unread' && notifications.length > 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFilter('all')}
                                        className="mt-4">
                                        View All Notifications
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {/* ✅ Type-safe mapping */}
                                {filteredNotifications.map((notification: Notification) => {
                                    const Icon = getNotificationIcon(notification.type);
                                    const isUnread = !notification.read;

                                    return (
                                        <div
                                            key={notification.id}
                                            className={cn(
                                                'rounded-lg border p-4 transition-all duration-200 hover:shadow-sm',
                                                isUnread
                                                    ? 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20'
                                                    : 'bg-background border-border hover:bg-muted/30'
                                            )}>
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex min-w-0 flex-1 items-start gap-3">
                                                    {/* Notification Icon */}
                                                    <div
                                                        className={cn(
                                                            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
                                                            getNotificationColors(notification.type)
                                                        )}>
                                                        <Icon className="h-5 w-5" />
                                                    </div>

                                                    {/* Notification Content */}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="mb-1 flex items-center gap-2">
                                                            <h3
                                                                className={cn(
                                                                    'truncate text-sm font-medium',
                                                                    isUnread && 'font-semibold'
                                                                )}>
                                                                {notification.title}
                                                            </h3>
                                                            {isUnread && (
                                                                <div className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-blue-500" />
                                                            )}
                                                        </div>
                                                        <p className="text-muted-foreground mb-2 text-sm leading-relaxed">
                                                            {notification.message}
                                                        </p>
                                                        <div className="text-muted-foreground flex items-center gap-4 text-xs">
                                                            <span>
                                                                {formatDistanceToNow(
                                                                    new Date(
                                                                        notification.createdAt
                                                                    ),
                                                                    { addSuffix: true }
                                                                )}
                                                            </span>
                                                            {notification.type && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs">
                                                                    {notification.type
                                                                        .replace(/_/g, ' ')
                                                                        .toLowerCase()}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-shrink-0 items-center gap-1">
                                                    {isUnread && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleMarkAsRead(notification.id)
                                                            }
                                                            title="Mark as read"
                                                            className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20">
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeleteNotification(
                                                                notification.id
                                                            )
                                                        }
                                                        title="Delete notification"
                                                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
