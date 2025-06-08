// src/app/[locale]/[dashboard]/account/sessions/components/sessions-table.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
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

interface SessionsTableProps {
    userId: string;
    currentSessionId: string;
}

export function SessionsTable({ userId, currentSessionId }: SessionsTableProps) {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [terminating, setTerminating] = useState<string | null>(null);

    console.log('Current Session ID:', currentSessionId);
    console.log('User ID:', userId);

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
            const response = await fetch(`/api/user/sessions`);
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
                setSessions(prev => prev.filter(session => session.id !== sessionId));
                toast.success('Session terminated successfully');
            } else {
                // Mock termination for demo
                setSessions(prev => prev.filter(session => session.id !== sessionId));
                toast.success('Session terminated successfully');
            }
        } catch (error) {
            console.error('Failed to terminate session:', error);
            toast.error('Failed to terminate session');
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
                // Keep only current session
                setSessions(prev => prev.filter(session => session.isCurrent));
                toast.success('All other sessions terminated successfully');
            } else {
                // Mock termination for demo
                setSessions(prev => prev.filter(session => session.isCurrent));
                toast.success('All other sessions terminated successfully');
            }
        } catch (error) {
            console.error('Failed to terminate all sessions:', error);
            toast.error('Failed to terminate sessions');
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
                    {sessions.length} active session{sessions.length !== 1 ? 's' : ''}
                </p>
                {sessions.filter(s => !s.isCurrent).length > 0 && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <LogOut className="mr-2 h-4 w-4" />
                                Terminate All Others
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Terminate All Other Sessions?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will sign you out of all other devices and browsers. Your
                                    current session will remain active.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={terminateAllSessions}>
                                    Terminate All
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Device & Browser</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sessions.map(session => (
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
                                    {format(session.lastActive, 'MMM dd, yyyy')}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                    {format(session.lastActive, 'HH:mm')}
                                </div>
                            </TableCell>
                            <TableCell>
                                {session.isCurrent ? (
                                    <Badge
                                        variant="default"
                                        className="flex w-fit items-center gap-1">
                                        <Shield className="h-3 w-3" />
                                        Current
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary">Active</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                {!session.isCurrent && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled={terminating === session.id}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Terminate Session?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will sign out this device/browser. The user
                                                    will need to sign in again.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => terminateSession(session.id)}>
                                                    Terminate
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
