'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Activity, XCircle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface TicketStatusDistributionProps {
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    urgentTickets: number;
}

export function TicketStatusDistribution({
    totalTickets,
    openTickets,
    inProgressTickets,
    resolvedTickets,
    urgentTickets,
}: TicketStatusDistributionProps) {
    const calculatePercentage = (value: number) => {
        return totalTickets > 0 ? Math.round((value / totalTickets) * 100) : 0;
    };

    const statusItems = [
        {
            icon: XCircle,
            label: 'Açık',
            value: openTickets,
            color: 'text-red-500',
            variant: 'destructive' as const,
        },
        {
            icon: Clock,
            label: 'İşlemde',
            value: inProgressTickets,
            color: 'text-blue-500',
            variant: 'default' as const,
        },
        {
            icon: CheckCircle2,
            label: 'Çözüldü',
            value: resolvedTickets,
            color: 'text-green-500',
            variant: 'outline' as const,
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Ticket Durum Dağılımı
                </CardTitle>
                <CardDescription>Ticket durumlarının detaylı analizi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {statusItems.map((item) => {
                        const Icon = item.icon;
                        const percentage = calculatePercentage(item.value);
                        return (
                            <div key={item.label} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Icon className={`h-4 w-4 ${item.color}`} />
                                    <span className="text-sm">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{item.value}</span>
                                    <Badge variant={item.variant} className="text-xs">
                                        {percentage}%
                                    </Badge>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Acil Öncelik</span>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="font-medium text-red-600">{urgentTickets} ticket</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
