'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Bell, AlertTriangle, X, Search, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib';
import { useInAppNotificationContext } from '@/contexts/inapp-notification-context';
import { getNotificationColors, getNotificationIcon } from '@/types/notification';
import { useFormatter, useNow } from 'next-intl';

export function Notifications() {
    const format = useFormatter();
    const now = useNow();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const {
        notifications,
        unreadCount,
        isLoading,
        error,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refresh,
        triggerRefresh,
    } = useInAppNotificationContext();

    const recentNotifications = useMemo(() => {
        return notifications.slice(0, 10);
    }, [notifications]);

    const filteredNotifications = useMemo(() => {
        return notifications.filter((notification) => {
            const matchesSearch =
                notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                notification.message.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType = filterType === 'all' || notification.type === filterType;

            const matchesStatus =
                filterStatus === 'all' ||
                (filterStatus === 'unread' && !notification.read) ||
                (filterStatus === 'read' && notification.read);

            return matchesSearch && matchesType && matchesStatus;
        });
    }, [notifications, searchQuery, filterType, filterStatus]);

    useEffect(() => {
        const handleNotificationCreated = () => {
            setTimeout(() => {
                triggerRefresh();
            }, 500);
        };

        const handleProfileUpdated = () => {
            setTimeout(() => {
                triggerRefresh();
            }, 500);
        };

        const handlePasswordChanged = () => {
            setTimeout(() => {
                triggerRefresh();
            }, 500);
        };

        window.addEventListener('notificationCreated', handleNotificationCreated);
        window.addEventListener('profileUpdated', handleProfileUpdated);
        window.addEventListener('passwordChanged', handlePasswordChanged);

        return () => {
            window.removeEventListener('notificationCreated', handleNotificationCreated);
            window.removeEventListener('profileUpdated', handleProfileUpdated);
            window.removeEventListener('passwordChanged', handlePasswordChanged);
        };
    }, [triggerRefresh]);

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

    const handleViewAllNotifications = () => {
        setIsSheetOpen(true);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setFilterType('all');
        setFilterStatus('all');
    };

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="relative h-9 w-9 rounded-full hover:bg-white hover:shadow-sm dark:hover:bg-zinc-800"
                        aria-label="Notifications"
                    >
                        <Bell className="h-7 w-7" />
                        {unreadCount > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute top-0 -right-1 h-4 w-4 animate-pulse rounded-full p-0 text-xs"
                            >
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
                                    title="Retry"
                                >
                                    ↻
                                </Button>
                            )}
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleMarkAllAsRead}
                                    className="h-8 px-2 text-xs"
                                    disabled={isLoading}
                                >
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
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={refresh}
                                    className="mt-2"
                                >
                                    Try Again
                                </Button>
                            </div>
                        ) : recentNotifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-zinc-400">
                                <Bell className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                <p>No notifications</p>
                            </div>
                        ) : (
                            <ScrollArea className="h-[318px]">
                                <div>
                                    {recentNotifications.map((notification) => {
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
                                                }
                                            >
                                                <div
                                                    className={cn(
                                                        'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                                                        colors
                                                    )}
                                                >
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
                                                                {format.relativeTime(
                                                                    new Date(
                                                                        notification.createdAt
                                                                    ),
                                                                    now
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-shrink-0 items-center space-x-1">
                                                            {!notification.read && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        markAsRead(notification.id);
                                                                    }}
                                                                    className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                                                                    title="Mark as read"
                                                                >
                                                                    <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRemoveNotification(
                                                                        notification.id
                                                                    );
                                                                }}
                                                                className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                                                                title="Remove notification"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {notifications.length > 10 && (
                                        <div className="border-t border-gray-200 bg-gray-50 p-3 text-center dark:border-zinc-700 dark:bg-zinc-800/50">
                                            <p className="text-xs text-gray-600 dark:text-zinc-400">
                                                Showing recent 10 of {notifications.length}{' '}
                                                notifications
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        )}
                        {notifications.length > 0 && (
                            <div className="border-t border-gray-200 p-3 dark:border-zinc-700">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-full justify-center text-xs"
                                    onClick={handleViewAllNotifications}
                                >
                                    View all notifications
                                    {notifications.length > 10 && (
                                        <span className="text-muted-foreground ml-1">
                                            ({notifications.length})
                                        </span>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-full px-6 py-6 sm:w-[540px] sm:max-w-[540px]">
                    <SheetHeader className="space-y-4">
                        <div className="flex items-center justify-between">
                            <SheetTitle className="text-xl font-semibold">
                                All Notifications
                            </SheetTitle>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                        {unreadCount} unread
                                    </Badge>
                                )}
                                {unreadCount > 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleMarkAllAsRead}
                                        className="h-8 text-xs"
                                        disabled={isLoading}
                                    >
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                        Mark all read
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="relative">
                                <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                                <Input
                                    placeholder="Search notifications..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8"
                                />
                            </div>

                            <div className="flex gap-2">
                                <Select value={filterType} onValueChange={setFilterType}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="security">Security</SelectItem>
                                        <SelectItem value="profile">Profile</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                        <SelectItem value="billing">Billing</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="unread">Unread</SelectItem>
                                        <SelectItem value="read">Read</SelectItem>
                                    </SelectContent>
                                </Select>

                                {(searchQuery ||
                                    filterType !== 'all' ||
                                    filterStatus !== 'all') && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="h-9 px-3"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        <SheetDescription className="text-muted-foreground text-sm">
                            {filteredNotifications.length === notifications.length
                                ? `${notifications.length} notifications total`
                                : `${filteredNotifications.length} of ${notifications.length} notifications`}
                        </SheetDescription>
                    </SheetHeader>

                    <div>
                        {isLoading ? (
                            <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
                                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent opacity-50" />
                                <p>Loading notifications...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-12 text-red-500">
                                <AlertTriangle className="mb-4 h-8 w-8 opacity-50" />
                                <p className="text-sm">{error}</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={refresh}
                                    className="mt-4"
                                >
                                    Try Again
                                </Button>
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
                                <Bell className="mb-4 h-8 w-8 opacity-50" />
                                <p>
                                    {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                                        ? 'No notifications match your filters'
                                        : 'No notifications yet'}
                                </p>
                                {(searchQuery ||
                                    filterType !== 'all' ||
                                    filterStatus !== 'all') && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="mt-2"
                                    >
                                        Clear filters
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <ScrollArea className="h-[calc(100vh-280px)]">
                                <div className="space-y-2">
                                    {filteredNotifications.map((notification) => {
                                        const Icon = getNotificationIcon(notification.type);
                                        const colors = getNotificationColors(notification.type);

                                        return (
                                            <div
                                                key={notification.id}
                                                className={cn(
                                                    'hover:bg-muted/50 flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-all',
                                                    !notification.read &&
                                                        'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/10'
                                                )}
                                                onClick={() =>
                                                    handleNotificationClick(
                                                        notification.id,
                                                        notification.read
                                                    )
                                                }
                                            >
                                                <div
                                                    className={cn(
                                                        'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
                                                        colors
                                                    )}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-foreground font-medium">
                                                                    {notification.title}
                                                                </p>
                                                                {!notification.read && (
                                                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                                                )}
                                                            </div>
                                                            <p className="text-muted-foreground text-sm">
                                                                {notification.message}
                                                            </p>
                                                            <div className="mt-2 flex items-center gap-2">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs capitalize"
                                                                >
                                                                    {notification.type}
                                                                </Badge>
                                                                <span className="text-muted-foreground text-xs">
                                                                    {format.relativeTime(
                                                                        new Date(
                                                                            notification.createdAt
                                                                        ),
                                                                        now
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-shrink-0 items-center space-x-1">
                                                            {!notification.read && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        markAsRead(notification.id);
                                                                    }}
                                                                    className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                                                                    title="Mark as read"
                                                                >
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRemoveNotification(
                                                                        notification.id
                                                                    );
                                                                }}
                                                                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                                                                title="Remove notification"
                                                            >
                                                                <X className="h-4 w-4" />
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
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
