'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MDXPreview } from '@/components/ui/mdx-preview';
import { Badge } from '@/components/ui/badge';
import {
    AlertCircle,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowDown,
    ArrowUp,
    AlertTriangle,
    Zap,
    Tag,
    Calendar,
    Wrench,
    Receipt,
    User,
    HelpCircle,
    Lightbulb,
    Bug,
} from 'lucide-react';
import { useFormatter } from 'next-intl';

interface Ticket {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

interface TicketDetailsProps {
    ticket: Ticket;
}

export function TicketDetails({ ticket }: TicketDetailsProps) {
    const format = useFormatter();

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'OPEN':
                return <AlertCircle className="h-4 w-4 text-blue-500" />;
            case 'IN_PROGRESS':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'WAITING':
                return <Clock className="h-4 w-4 text-orange-500" />;
            case 'CLOSED':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            default:
                return <XCircle className="h-4 w-4 text-red-500" />;
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'LOW':
                return <ArrowDown className="h-4 w-4 text-green-500" />;
            case 'MEDIUM':
                return <ArrowUp className="h-4 w-4 text-yellow-500" />;
            case 'HIGH':
                return <AlertTriangle className="h-4 w-4 text-orange-500" />;
            case 'URGENT':
                return <Zap className="h-4 w-4 text-red-500" />;
            default:
                return <ArrowUp className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'OPEN':
                return 'Açık';
            case 'IN_PROGRESS':
                return 'İşlemde';
            case 'WAITING':
                return 'Beklemede';
            case 'CLOSED':
                return 'Kapalı';
            default:
                return status;
        }
    };

    const getPriorityText = (priority: string) => {
        switch (priority) {
            case 'LOW':
                return 'Düşük';
            case 'MEDIUM':
                return 'Orta';
            case 'HIGH':
                return 'Yüksek';
            case 'URGENT':
                return 'Acil';
            default:
                return priority;
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'TECHNICAL':
                return <Wrench className="h-4 w-4 text-blue-500" />;
            case 'BILLING':
                return <Receipt className="h-4 w-4 text-green-500" />;
            case 'ACCOUNT':
                return <User className="h-4 w-4 text-purple-500" />;
            case 'GENERAL':
                return <HelpCircle className="h-4 w-4 text-gray-500" />;
            case 'FEATURE_REQUEST':
                return <Lightbulb className="h-4 w-4 text-yellow-500" />;
            case 'BUG_REPORT':
                return <Bug className="h-4 w-4 text-red-500" />;
            default:
                return <Tag className="h-4 w-4 text-gray-500" />;
        }
    };

    const getCategoryText = (category: string) => {
        switch (category) {
            case 'TECHNICAL':
                return 'Teknik';
            case 'BILLING':
                return 'Fatura';
            case 'ACCOUNT':
                return 'Hesap';
            case 'GENERAL':
                return 'Genel';
            case 'FEATURE_REQUEST':
                return 'Özellik İsteği';
            case 'BUG_REPORT':
                return 'Hata Raporu';
            default:
                return category;
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Destek Talebi Detayları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold">{ticket.title}</h3>
                        <div className="prose prose-sm mt-2 max-w-none">
                            <MDXPreview content={ticket.description} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Durum</label>
                            <div className="mt-1 flex items-center gap-2">
                                {getStatusIcon(ticket.status)}
                                <Badge variant="outline" className="font-normal">
                                    {getStatusText(ticket.status)}
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Öncelik</label>
                            <div className="mt-1 flex items-center gap-2">
                                {getPriorityIcon(ticket.priority)}
                                <Badge variant="outline" className="font-normal">
                                    {getPriorityText(ticket.priority)}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Kategori</label>
                            <div className="mt-1 flex items-center gap-2">
                                {getCategoryIcon(ticket.category)}
                                <Badge variant="outline" className="font-normal">
                                    {getCategoryText(ticket.category)}
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Oluşturulma Tarihi</label>
                            <div className="mt-1 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-muted-foreground text-sm">
                                    {format.dateTime(ticket.createdAt, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
