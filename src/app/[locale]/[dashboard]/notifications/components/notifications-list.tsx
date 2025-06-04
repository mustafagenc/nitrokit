'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib';
import { Bell, Check, Trash2, RefreshCw } from 'lucide-react';

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
    } = useNotifications();

    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'unread') return !notification.read;
        return true;
    });

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                        {unreadCount > 0 && <Badge variant="secondary">{unreadCount} unread</Badge>}
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
                                onClick={markAllAsRead}
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
                        <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
                        <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                    </TabsList>

                    <TabsContent value={filter} className="mt-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
                            </div>
                        ) : error ? (
                            <div className="py-8 text-center">
                                <p className="text-destructive mb-4">{error}</p>
                                <Button onClick={refresh} variant="outline">
                                    Try Again
                                </Button>
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="text-muted-foreground py-8 text-center">
                                <Bell className="mx-auto mb-4 h-12 w-12 opacity-20" />
                                <p>
                                    {filter === 'unread'
                                        ? 'No unread notifications'
                                        : 'No notifications yet'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredNotifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            'rounded-lg border p-4 transition-colors',
                                            !notification.read
                                                ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20'
                                                : 'bg-muted/30 border-muted'
                                        )}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <h3 className="text-sm font-medium">
                                                        {notification.title}
                                                    </h3>
                                                    {!notification.read && (
                                                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                                                    )}
                                                </div>
                                                <p className="text-muted-foreground mb-2 text-sm">
                                                    {notification.message}
                                                </p>
                                                <p className="text-muted-foreground text-xs">
                                                    {formatDistanceToNow(
                                                        new Date(notification.createdAt),
                                                        {
                                                            addSuffix: true,
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {!notification.read && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => markAsRead(notification.id)}
                                                        title="Mark as read">
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        deleteNotification(notification.id)
                                                    }
                                                    title="Delete notification"
                                                    className="hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
