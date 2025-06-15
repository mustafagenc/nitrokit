'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    MessageSquare,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { useFormatter } from 'next-intl';
import { TicketDetailsProps } from '@/types/ticket';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function TicketInfo({ ticket }: TicketDetailsProps) {
    const format = useFormatter();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            setIsOpen(window.innerWidth >= 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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

    const formatDate = (date: Date) => {
        return format.dateTime(date, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const firstStaffResponse = ticket.messages?.find(
        (message) => message.user.role === 'Admin' || message.user.role === 'Moderator'
    );

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Detaylar</CardTitle>
                {isMobile && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </Button>
                )}
            </CardHeader>
            <CardContent className={cn('space-y-4', isMobile && !isOpen && 'hidden', 'lg:block')}>
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
                            {formatDate(ticket.createdAt)}
                        </span>
                    </div>
                </div>

                {firstStaffResponse && (
                    <div>
                        <label className="text-sm font-medium">İlk Cevap Tarihi</label>
                        <div className="mt-1 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-gray-500" />
                            <span className="text-muted-foreground text-sm">
                                {formatDate(firstStaffResponse.createdAt)}
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
