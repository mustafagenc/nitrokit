'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, User, MessageSquare, Calendar, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/utils/helpers';

const notifications = [
    {
        id: 1,
        type: 'user',
        title: 'New user registered',
        message: 'John Doe has joined your workspace',
        time: '2 min ago',
        read: false,
        icon: User,
    },
    {
        id: 2,
        type: 'message',
        title: 'New message',
        message: 'You have a new message from Sarah',
        time: '5 min ago',
        read: false,
        icon: MessageSquare,
    },
    {
        id: 3,
        type: 'calendar',
        title: 'Meeting reminder',
        message: 'Team standup in 15 minutes',
        time: '10 min ago',
        read: true,
        icon: Calendar,
    },
    {
        id: 4,
        type: 'system',
        title: 'System update',
        message: 'New features are now available',
        time: '1 hour ago',
        read: true,
        icon: CheckCircle2,
    },
];

export function Notifications() {
    const [notificationList, setNotificationList] = useState(notifications);
    const unreadCount = notificationList.filter(n => !n.read).length;

    const markAsRead = (id: number) => {
        setNotificationList(prev =>
            prev.map(notification =>
                notification.id === id ? { ...notification, read: true } : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotificationList(prev => prev.map(notification => ({ ...notification, read: true })));
    };

    const removeNotification = (id: number) => {
        setNotificationList(prev => prev.filter(notification => notification.id !== id));
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
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
                <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-zinc-700">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="h-8 px-2 text-xs">
                            Mark all read
                        </Button>
                    )}
                </div>

                <div className="flex flex-col">
                    {notificationList.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-zinc-400">
                            <Bell className="mx-auto mb-2 h-8 w-8 opacity-50" />
                            <p>No notifications</p>
                        </div>
                    ) : (
                        <ScrollArea className="h-[318px]">
                            <div>
                                {notificationList.map(notification => {
                                    const Icon = notification.icon;

                                    return (
                                        <div
                                            key={notification.id}
                                            className={cn(
                                                'flex items-start space-x-3 border-b border-gray-100 p-4 transition-colors last:border-b-0 hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-800',
                                                !notification.read &&
                                                    'bg-blue-50/50 dark:bg-blue-900/10'
                                            )}>
                                            <div
                                                className={cn(
                                                    'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                                                    notification.type === 'user' &&
                                                        'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                                                    notification.type === 'message' &&
                                                        'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                                                    notification.type === 'calendar' &&
                                                        'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
                                                    notification.type === 'system' &&
                                                        'bg-gray-100 text-gray-600 dark:bg-zinc-800/50 dark:text-zinc-400'
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
                                                            {notification.time}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-shrink-0 items-center space-x-1">
                                                        {!notification.read && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    markAsRead(notification.id)
                                                                }
                                                                className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                                                                title="Mark as read">
                                                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                removeNotification(notification.id)
                                                            }
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
                    {notificationList.length > 0 && (
                        <div className="border-t border-gray-200 p-3 dark:border-zinc-700">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-full justify-center text-xs">
                                View all notifications
                            </Button>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
