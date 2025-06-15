'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export function TicketFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const debouncedSearch = useDebounce(search, 300);

    const createQueryString = useCallback(
        (params: Record<string, string | number | null>) => {
            const newParams = new URLSearchParams(searchParams.toString());

            Object.entries(params).forEach(([key, value]) => {
                if (value === null || value === '') {
                    newParams.delete(key);
                } else {
                    newParams.set(key, String(value));
                }
            });

            return newParams.toString();
        },
        [searchParams]
    );

    useEffect(() => {
        router.push(`?${createQueryString({ search: debouncedSearch })}`);
    }, [debouncedSearch, createQueryString, router]);

    return (
        <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                <Input
                    placeholder="Destek talebi ara..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                />
            </div>

            <div className="flex gap-4">
                {/* Status Filter */}
                <Select
                    value={searchParams.get('status') || 'all'}
                    onValueChange={(value) => {
                        router.push(
                            `?${createQueryString({
                                status: value === 'all' ? null : value,
                            })}`
                        );
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        <SelectItem value="OPEN">Açık</SelectItem>
                        <SelectItem value="IN_PROGRESS">Devam Ediyor</SelectItem>
                        <SelectItem value="WAITING_FOR_USER">Kullanıcı Bekliyor</SelectItem>
                        <SelectItem value="RESOLVED">Çözüldü</SelectItem>
                        <SelectItem value="CLOSED">Kapatıldı</SelectItem>
                    </SelectContent>
                </Select>

                {/* Priority Filter */}
                <Select
                    value={searchParams.get('priority') || 'all'}
                    onValueChange={(value) => {
                        router.push(
                            `?${createQueryString({
                                priority: value === 'all' ? null : value,
                            })}`
                        );
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Öncelik seçin" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        <SelectItem value="LOW">Düşük</SelectItem>
                        <SelectItem value="MEDIUM">Orta</SelectItem>
                        <SelectItem value="HIGH">Yüksek</SelectItem>
                        <SelectItem value="URGENT">Acil</SelectItem>
                    </SelectContent>
                </Select>

                {/* Category Filter */}
                <Select
                    value={searchParams.get('category') || 'all'}
                    onValueChange={(value) => {
                        router.push(
                            `?${createQueryString({
                                category: value === 'all' ? null : value,
                            })}`
                        );
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        <SelectItem value="TECHNICAL">Teknik</SelectItem>
                        <SelectItem value="BILLING">Faturalama</SelectItem>
                        <SelectItem value="ACCOUNT">Hesap</SelectItem>
                        <SelectItem value="GENERAL">Genel</SelectItem>
                        <SelectItem value="FEATURE_REQUEST">Özellik İsteği</SelectItem>
                        <SelectItem value="BUG_REPORT">Hata Raporu</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
