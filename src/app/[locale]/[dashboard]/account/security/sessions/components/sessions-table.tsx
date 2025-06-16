'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Monitor, Smartphone, Tablet, MapPin, Trash2, LogOut, Shield } from 'lucide-react';

interface Session {
    id: string;
    deviceType: 'desktop' | 'mobile' | 'tablet';
    browser: string;
    os: string;
    location: string;
    ipAddress: string;
    lastActive: Date;
    isCurrent: boolean;
    userAgent: string;
}

export function SessionsTable() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [terminating, setTerminating] = useState<string | null>(null);
    const t = useTranslations('dashboard.account.security.sessions.table');
    const format = useFormatter();

    const getMockSessions = useCallback(
        (): Session[] => [
            {
                id: '1',
                deviceType: 'desktop',
                browser: 'Chrome 120',
                os: 'macOS',
                location: 'Istanbul, Turkey',
                ipAddress: '192.168.1.100',
                lastActive: new Date(),
                isCurrent: true,
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            },
            {
                id: '2',
                deviceType: 'mobile',
                browser: 'Safari Mobile',
                os: 'iOS 17',
                location: 'Istanbul, Turkey',
                ipAddress: '192.168.1.101',
                lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
                isCurrent: false,
                userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
            },
            {
                id: '3',
                deviceType: 'desktop',
                browser: 'Firefox 119',
                os: 'Windows 11',
                location: 'Ankara, Turkey',
                ipAddress: '10.0.0.50',
                lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
                isCurrent: false,
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:119.0)',
            },
        ],
        []
    );

    const fetchSessions = useCallback(async () => {
        try {
            const response = await fetch('/api/user/sessions');
            if (response.ok) {
                const data = await response.json();
                setSessions(data.sessions || getMockSessions());
            } else {
                // Fallback to mock data if API not implemented
                setSessions(getMockSessions());
            }
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
            setSessions(getMockSessions());
        } finally {
            setLoading(false);
        }
    }, [getMockSessions]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    const terminateSession = async (sessionId: string) => {
        setTerminating(sessionId);
        try {
            const response = await fetch(`/api/user/sessions/${sessionId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const data = await response.json();

                if (data.currentSessionDeleted) {
                    toast.success(t('messages.currentSessionTerminated'));

                    setTimeout(() => {
                        window.location.href = '/signin';
                    }, 1500);

                    return;
                }

                setSessions((prev) => prev.filter((session) => session.id !== sessionId));
                toast.success(t('messages.sessionTerminated'));
            } else {
                toast.error(t('messages.terminateFailed'));
            }
        } catch (error) {
            console.error('Failed to terminate session:', error);
            toast.error(t('messages.terminateError'));
        } finally {
            setTerminating(null);
        }
    };

    const terminateAllSessions = async () => {
        try {
            const response = await fetch('/api/user/sessions/terminate-all', {
                method: 'POST',
            });

            if (response.ok) {
                const data = await response.json();

                if (data.currentSessionPreserved) {
                    setSessions((prev) => prev.filter((session) => session.isCurrent));
                    toast.success(t('messages.allOthersTerminated'));
                } else {
                    toast.success(t('messages.allSessionsTerminated'));
                    setTimeout(() => {
                        window.location.href = '/signin';
                    }, 1500);
                }
            } else {
                toast.error(t('messages.terminateAllFailed'));
            }
        } catch (error) {
            console.error('Failed to terminate all sessions:', error);
            toast.error(t('messages.terminateAllError'));
        }
    };

    const getDeviceIcon = (deviceType: string) => {
        switch (deviceType) {
            case 'mobile':
                return <Smartphone className="h-4 w-4" />;
            case 'tablet':
                return <Tablet className="h-4 w-4" />;
            default:
                return <Monitor className="h-4 w-4" />;
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="h-16 animate-pulse rounded bg-gray-100 dark:bg-gray-800"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">
                    {t('sessionCount', {
                        count: sessions.length,
                        plural: sessions.length !== 1 ? 's' : '',
                    })}
                </p>
                {sessions.filter((s) => !s.isCurrent).length > 0 && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <LogOut className="mr-2 h-4 w-4" />
                                {t('buttons.terminateAllOthers')}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    {t('dialogs.terminateAll.title')}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t('dialogs.terminateAll.description')}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t('buttons.cancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={terminateAllSessions}>
                                    {t('buttons.terminateAll')}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('headers.deviceBrowser')}</TableHead>
                        <TableHead>{t('headers.location')}</TableHead>
                        <TableHead>{t('headers.lastActive')}</TableHead>
                        <TableHead>{t('headers.status')}</TableHead>
                        <TableHead className="w-[100px]">{t('headers.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sessions.map((session) => (
                        <TableRow key={session.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    {getDeviceIcon(session.deviceType)}
                                    <div>
                                        <div className="font-medium">{session.browser}</div>
                                        <div className="text-muted-foreground text-sm">
                                            {session.os}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <MapPin className="text-muted-foreground h-4 w-4" />
                                    <div>
                                        <div className="text-sm">{session.location}</div>
                                        <div className="text-muted-foreground text-xs">
                                            {session.ipAddress}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="text-sm">
                                    {format.dateTime(new Date(session.lastActive), {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </div>
                            </TableCell>
                            <TableCell>
                                {session.isCurrent ? (
                                    <Badge
                                        variant="default"
                                        className="flex w-fit items-center gap-1"
                                    >
                                        <Shield className="h-3 w-3" />
                                        {t('status.current')}
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary">{t('status.active')}</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                {!session.isCurrent && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled={terminating === session.id}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    {t('dialogs.terminateSession.title')}
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {t('dialogs.terminateSession.description')}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    {t('buttons.cancel')}
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => terminateSession(session.id)}
                                                >
                                                    {t('buttons.terminate')}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
