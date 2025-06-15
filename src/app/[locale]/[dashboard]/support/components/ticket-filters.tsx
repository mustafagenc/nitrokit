'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export function TicketFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    return (
        <div className="flex gap-4">
            {/* Status Filter */}
            <Select
                value={searchParams.get('status') || 'all'} // 👈 Default value
                onValueChange={(value) => {
                    const params = new URLSearchParams(searchParams);
                    if (value === 'all') {
                        params.delete('status');
                    } else {
                        params.set('status', value);
                    }
                    router.push(`?${params.toString()}`);
                }}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status seçin" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem> {/* 👈 'all' value */}
                    <SelectItem value="open">Açık</SelectItem>
                    <SelectItem value="in_progress">Devam Ediyor</SelectItem>
                    <SelectItem value="resolved">Çözüldü</SelectItem>
                    <SelectItem value="closed">Kapatıldı</SelectItem>
                </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select
                value={searchParams.get('priority') || 'all'}
                onValueChange={(value) => {
                    const params = new URLSearchParams(searchParams);
                    if (value === 'all') {
                        params.delete('priority');
                    } else {
                        params.set('priority', value);
                    }
                    router.push(`?${params.toString()}`);
                }}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Öncelik seçin" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem> {/* 👈 'all' value */}
                    <SelectItem value="low">Düşük</SelectItem>
                    <SelectItem value="medium">Orta</SelectItem>
                    <SelectItem value="high">Yüksek</SelectItem>
                    <SelectItem value="urgent">Acil</SelectItem>
                </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select
                value={searchParams.get('category') || 'all'}
                onValueChange={(value) => {
                    const params = new URLSearchParams(searchParams);
                    if (value === 'all') {
                        params.delete('category');
                    } else {
                        params.set('category', value);
                    }
                    router.push(`?${params.toString()}`);
                }}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem> {/* 👈 'all' value */}
                    <SelectItem value="technical">Teknik</SelectItem>
                    <SelectItem value="billing">Faturalama</SelectItem>
                    <SelectItem value="account">Hesap</SelectItem>
                    <SelectItem value="general">Genel</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
