'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { MDXPreview } from '@/components/ui/mdx-preview';

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
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusChange = async (value: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/tickets/${ticket.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: value }),
            });

            if (!response.ok) {
                throw new Error('Durum güncellenirken bir hata oluştu');
            }

            toast.success('Durum başarıyla güncellendi');
            router.refresh();
        } catch (error) {
            console.error('Durum güncellenirken hata:', error);
            toast.error('Durum güncellenirken bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePriorityChange = async (value: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/tickets/${ticket.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priority: value }),
            });

            if (!response.ok) {
                throw new Error('Öncelik güncellenirken bir hata oluştu');
            }

            toast.success('Öncelik başarıyla güncellendi');
            router.refresh();
        } catch (error) {
            console.error('Öncelik güncellenirken hata:', error);
            toast.error('Öncelik güncellenirken bir hata oluştu');
        } finally {
            setIsLoading(false);
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
                            <Select
                                value={ticket.status}
                                onValueChange={handleStatusChange}
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="OPEN">Açık</SelectItem>
                                    <SelectItem value="IN_PROGRESS">İşlemde</SelectItem>
                                    <SelectItem value="WAITING">Beklemede</SelectItem>
                                    <SelectItem value="CLOSED">Kapalı</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Öncelik</label>
                            <Select
                                value={ticket.priority}
                                onValueChange={handlePriorityChange}
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOW">Düşük</SelectItem>
                                    <SelectItem value="MEDIUM">Orta</SelectItem>
                                    <SelectItem value="HIGH">Yüksek</SelectItem>
                                    <SelectItem value="URGENT">Acil</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Kategori</label>
                            <p className="text-muted-foreground text-sm">
                                {ticket.category === 'TECHNICAL' && 'Teknik'}
                                {ticket.category === 'BILLING' && 'Fatura'}
                                {ticket.category === 'ACCOUNT' && 'Hesap'}
                                {ticket.category === 'GENERAL' && 'Genel'}
                                {ticket.category === 'FEATURE_REQUEST' && 'Özellik İsteği'}
                                {ticket.category === 'BUG_REPORT' && 'Hata Raporu'}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Oluşturulma Tarihi</label>
                            <p className="text-muted-foreground text-sm">
                                {new Date(ticket.createdAt).toLocaleString('tr-TR')}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
