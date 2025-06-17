'use client';

import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';

interface Ticket {
    id: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED';
}

interface TicketStatsProps {
    tickets: Ticket[];
    total: number;
}

export function TicketStats({ tickets, total }: TicketStatsProps) {
    const openTickets = tickets.filter((t) => t.status === 'OPEN').length;
    const inProgressTickets = tickets.filter((t) => t.status === 'IN_PROGRESS').length;
    const resolvedTickets = tickets.filter((t) => t.status === 'RESOLVED').length;

    const statsData = [
        {
            title: 'Toplam Ticket',
            value: total,
            subtitle: 'aktif',
            icon: MessageSquare,
            gradient: 'from-blue-50/50 to-blue-100/30',
            darkGradient: 'dark:from-blue-950/20 dark:to-blue-900/10',
            hoverShadow: 'hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20',
            textColor: 'text-blue-600/70 dark:text-blue-400/70',
            iconBg: 'bg-blue-500/10 group-hover:bg-blue-500/20 dark:bg-blue-400/10 dark:group-hover:bg-blue-400/20',
            iconColor: 'text-blue-600 dark:text-blue-400',
            dotColor: 'bg-blue-500',
            info: `Bu sayfada ${tickets.length}`,
        },
        {
            title: 'Açık Ticket',
            value: openTickets,
            subtitle: 'yeni',
            icon: AlertTriangle,
            gradient: 'from-red-50/50 to-red-100/30',
            darkGradient: 'dark:from-red-950/20 dark:to-red-900/10',
            hoverShadow: 'hover:shadow-red-100/50 dark:hover:shadow-red-900/20',
            textColor: 'text-red-600/70 dark:text-red-400/70',
            iconBg: 'bg-red-500/10 group-hover:bg-red-500/20 dark:bg-red-400/10 dark:group-hover:bg-red-400/20',
            iconColor: 'text-red-600 dark:text-red-400',
            dotColor: 'bg-red-500',
            info: 'Acil müdahale',
            animate: true,
        },
        {
            title: 'İşlemde',
            value: inProgressTickets,
            subtitle: 'devam eden',
            icon: RefreshCw,
            gradient: 'from-orange-50/50 to-orange-100/30',
            darkGradient: 'dark:from-orange-950/20 dark:to-orange-900/10',
            hoverShadow: 'hover:shadow-orange-100/50 dark:hover:shadow-orange-900/20',
            textColor: 'text-orange-600/70 dark:text-orange-400/70',
            iconBg: 'bg-orange-500/10 group-hover:bg-orange-500/20 dark:bg-orange-400/10 dark:group-hover:bg-orange-400/20',
            iconColor: 'text-orange-600 dark:text-orange-400',
            dotColor: 'bg-orange-500',
            info: 'Aktif çalışma',
            animate: true,
        },
        {
            title: 'Çözüldü',
            value: resolvedTickets,
            subtitle: 'tamamlandı',
            icon: CheckCircle,
            gradient: 'from-green-50/50 to-green-100/30',
            darkGradient: 'dark:from-green-950/20 dark:to-green-900/10',
            hoverShadow: 'hover:shadow-green-100/50 dark:hover:shadow-green-900/20',
            textColor: 'text-green-600/70 dark:text-green-400/70',
            iconBg: 'bg-green-500/10 group-hover:bg-green-500/20 dark:bg-green-400/10 dark:group-hover:bg-green-400/20',
            iconColor: 'text-green-600 dark:text-green-400',
            dotColor: 'bg-green-500',
            info: 'Bu sayfada',
        },
    ];

    return (
        <div className="grid gap-3 md:grid-cols-4">
            {statsData.map((stat) => {
                const Icon = stat.icon;

                return (
                    <Card
                        key={stat.title}
                        className={`group relative overflow-hidden border-0 bg-gradient-to-br ${stat.gradient} p-0 shadow-sm transition-all duration-300 hover:shadow-md ${stat.hoverShadow} ${stat.darkGradient}`}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p
                                        className={`text-xs font-medium tracking-wide uppercase ${stat.textColor}`}
                                    >
                                        {stat.title}
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                            {stat.value}
                                        </p>
                                        <span
                                            className={`text-xs font-medium ${stat.textColor.replace('/70', '')}`}
                                        >
                                            {stat.subtitle}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${stat.iconBg}`}
                                >
                                    <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                                </div>
                            </div>
                            <div className="text-muted-foreground mt-3 flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <div
                                        className={`h-2 w-2 rounded-full shadow-sm ${stat.dotColor} ${stat.animate ? 'animate-pulse' : ''}`}
                                    />
                                    <span>{stat.info}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
