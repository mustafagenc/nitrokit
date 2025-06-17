'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MessageSquare, Eye, XCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';

interface TicketWithUser {
    id: string;
    title: string;
    status: string;
    priority: string;
    user: {
        firstName: string | null;
        lastName: string | null;
        email: string;
        image: string | null;
    };
    _count: {
        messages: number;
    };
}

interface RecentActivitiesProps {
    recentTickets: TicketWithUser[];
}

export function RecentActivities({ recentTickets }: RecentActivitiesProps) {
    const getStatusConfig = (status: string) => {
        const configs = {
            OPEN: { label: 'Açık', variant: 'destructive' as const, icon: XCircle },
            IN_PROGRESS: { label: 'İşlemde', variant: 'default' as const, icon: Clock },
            WAITING_FOR_USER: {
                label: 'Kullanıcı Bekliyor',
                variant: 'secondary' as const,
                icon: Clock,
            },
            RESOLVED: { label: 'Çözüldü', variant: 'default' as const, icon: CheckCircle2 },
            CLOSED: { label: 'Kapalı', variant: 'outline' as const, icon: CheckCircle2 },
        };
        return configs[status as keyof typeof configs] || configs.OPEN;
    };

    const getPriorityConfig = (priority: string) => {
        const configs = {
            LOW: { label: 'Düşük', color: 'text-green-600' },
            MEDIUM: { label: 'Orta', color: 'text-yellow-600' },
            HIGH: { label: 'Yüksek', color: 'text-orange-600' },
            URGENT: { label: 'Acil', color: 'text-red-600' },
        };
        return configs[priority as keyof typeof configs] || configs.LOW;
    };

    const getUserDisplayInfo = (user: TicketWithUser['user']) => {
        const userName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;

        const initials = userName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

        return { userName, initials };
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Son Aktiviteler
                </CardTitle>
                <CardDescription>En son oluşturulan ticket&apos;lar</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentTickets.length > 0 ? (
                        recentTickets.map((ticket) => {
                            const { userName, initials } = getUserDisplayInfo(ticket.user);
                            const statusConfig = getStatusConfig(ticket.status);
                            const priorityConfig = getPriorityConfig(ticket.priority);

                            return (
                                <div
                                    key={ticket.id}
                                    className="group hover:bg-muted/30 flex items-center gap-3 rounded-lg border p-3 transition-colors"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={ticket.user.image || ''} alt={userName} />
                                        <AvatarFallback className="text-xs">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 flex items-center gap-2">
                                            <h4 className="group-hover:text-primary truncate text-sm font-medium transition-colors">
                                                {ticket.title}
                                            </h4>
                                            <Badge
                                                variant={statusConfig.variant}
                                                className="text-xs"
                                            >
                                                {statusConfig.label}
                                            </Badge>
                                        </div>
                                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                            <span className="truncate">{userName}</span>
                                            <span>•</span>
                                            <span className={`font-medium ${priorityConfig.color}`}>
                                                {priorityConfig.label}
                                            </span>
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <MessageSquare className="h-3 w-3" />
                                                <span>{ticket._count.messages}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Link href={`/dashboard/admin/tickets/${ticket.id}`}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span className="sr-only">
                                                Ticket detayını görüntüle
                                            </span>
                                        </Button>
                                    </Link>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-muted-foreground py-12 text-center">
                            <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
                            <h3 className="mb-2 text-sm font-medium">Henüz aktivite yok</h3>
                            <p className="text-xs">Ticket oluşturulduğunda burada görünecek</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
