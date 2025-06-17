'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, Columns, Filter, X } from 'lucide-react';
import { Table } from '@tanstack/react-table';

interface Ticket {
    id: string;
    title: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    category: 'TECHNICAL' | 'BILLING' | 'ACCOUNT' | 'GENERAL' | 'FEATURE_REQUEST' | 'BUG_REPORT';
    createdAt: Date;
    user: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
        role: 'User' | 'Admin' | 'Moderator';
    };
    assignedUser: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
        role: 'User' | 'Admin' | 'Moderator';
    } | null;
}

interface TicketFiltersProps {
    table: Table<Ticket>;
    globalFilter: string;
    onGlobalFilterChange: (value: string) => void;
}

export function TicketFilters({ table, globalFilter, onGlobalFilterChange }: TicketFiltersProps) {
    const statusOptions = [
        { value: 'all', label: 'Tüm Durumlar' },
        { value: 'OPEN', label: 'Açık' },
        { value: 'IN_PROGRESS', label: 'İşlemde' },
        { value: 'WAITING_FOR_USER', label: 'Kullanıcı Bekliyor' },
        { value: 'RESOLVED', label: 'Çözüldü' },
        { value: 'CLOSED', label: 'Kapalı' },
    ];

    const priorityOptions = [
        { value: 'all', label: 'Tüm Öncelikler' },
        { value: 'LOW', label: 'Düşük' },
        { value: 'MEDIUM', label: 'Orta' },
        { value: 'HIGH', label: 'Yüksek' },
        { value: 'URGENT', label: 'Acil' },
    ];

    const categoryOptions = [
        { value: 'all', label: 'Tüm Kategoriler' },
        { value: 'TECHNICAL', label: 'Teknik' },
        { value: 'BILLING', label: 'Faturalandırma' },
        { value: 'ACCOUNT', label: 'Hesap' },
        { value: 'GENERAL', label: 'Genel' },
        { value: 'FEATURE_REQUEST', label: 'Özellik İsteği' },
        { value: 'BUG_REPORT', label: 'Hata Bildirimi' },
    ];

    const pageSizeOptions = [
        { value: '10', label: '10 satır' },
        { value: '20', label: '20 satır' },
        { value: '50', label: '50 satır' },
        { value: '100', label: '100 satır' },
    ];

    // Helper functions to safely get filter values
    const getStatusFilterValue = (): string => {
        const value = table.getColumn('status')?.getFilterValue();
        return typeof value === 'string' ? value : '';
    };

    const getPriorityFilterValue = (): string => {
        const value = table.getColumn('priority')?.getFilterValue();
        return typeof value === 'string' ? value : '';
    };

    const getCategoryFilterValue = (): string => {
        const value = table.getColumn('category')?.getFilterValue();
        return typeof value === 'string' ? value : '';
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (globalFilter) count++;
        if (getStatusFilterValue()) count++;
        if (getPriorityFilterValue()) count++;
        if (getCategoryFilterValue()) count++;
        return count;
    };

    const clearAllFilters = () => {
        onGlobalFilterChange('');
        table.getColumn('status')?.setFilterValue('');
        table.getColumn('priority')?.setFilterValue('');
        table.getColumn('category')?.setFilterValue('');
    };

    const activeFiltersCount = getActiveFiltersCount();

    // Helper function to get filter label
    const getFilterLabel = (options: typeof statusOptions, value: string): string => {
        const option = options.find((opt) => opt.value === value);
        return option?.label || value;
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Filter className="h-5 w-5" />
                        Ticket Filtreleri
                        {activeFiltersCount > 0 && (
                            <span className="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium">
                                {activeFiltersCount}
                            </span>
                        )}
                    </CardTitle>
                    {activeFiltersCount > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearAllFilters}
                            className="h-8 px-2 text-xs"
                        >
                            <X className="mr-1 h-3 w-3" />
                            Temizle
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Global Search */}
                    <div className="relative">
                        <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        <Input
                            placeholder="Ticket ara (başlık, kullanıcı, ID)..."
                            value={globalFilter}
                            onChange={(event) => onGlobalFilterChange(event.target.value)}
                            className="h-10 pl-9"
                        />
                        {globalFilter && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onGlobalFilterChange('')}
                                className="absolute top-1 right-1 h-8 w-8 p-0"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>

                    {/* Filter Controls */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            {/* Status Filter */}
                            <Select
                                value={getStatusFilterValue() || 'all'}
                                onValueChange={(value) =>
                                    table
                                        .getColumn('status')
                                        ?.setFilterValue(value === 'all' ? '' : value)
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Durum seç" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Priority Filter */}
                            <Select
                                value={getPriorityFilterValue() || 'all'}
                                onValueChange={(value) =>
                                    table
                                        .getColumn('priority')
                                        ?.setFilterValue(value === 'all' ? '' : value)
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Öncelik seç" />
                                </SelectTrigger>
                                <SelectContent>
                                    {priorityOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Category Filter */}
                            <Select
                                value={getCategoryFilterValue() || 'all'}
                                onValueChange={(value) =>
                                    table
                                        .getColumn('category')
                                        ?.setFilterValue(value === 'all' ? '' : value)
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Kategori seç" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Page Size */}
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value));
                                }}
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Sayfa boyutu" />
                                </SelectTrigger>
                                <SelectContent>
                                    {pageSizeOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Column Visibility */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Columns className="mr-2 h-4 w-4" />
                                    Sütunlar
                                    <span className="bg-muted ml-1 rounded px-1.5 py-0.5 text-xs">
                                        {table.getVisibleLeafColumns().length}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuLabel>Görünür Sütunlar</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        const columnHeaders = {
                                            title: 'Başlık',
                                            user: 'Kullanıcı',
                                            status: 'Durum',
                                            priority: 'Öncelik',
                                            category: 'Kategori',
                                            assignedUser: 'Atanan Kişi',
                                            createdAt: 'Oluşturulma',
                                        };

                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(!!value)
                                                }
                                            >
                                                {columnHeaders[
                                                    column.id as keyof typeof columnHeaders
                                                ] || column.id}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Active Filters Summary */}
                    {activeFiltersCount > 0 && (
                        <div className="bg-muted/30 flex flex-wrap items-center gap-2 rounded-lg border p-3">
                            <span className="text-sm font-medium">Aktif filtreler:</span>
                            {globalFilter && (
                                <span className="bg-primary/10 rounded px-2 py-1 text-xs">
                                    Arama: &quot;{globalFilter}&quot;
                                </span>
                            )}
                            {getStatusFilterValue() && (
                                <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    Durum: {getFilterLabel(statusOptions, getStatusFilterValue())}
                                </span>
                            )}
                            {getPriorityFilterValue() && (
                                <span className="rounded bg-orange-100 px-2 py-1 text-xs text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                    Öncelik:{' '}
                                    {getFilterLabel(priorityOptions, getPriorityFilterValue())}
                                </span>
                            )}
                            {getCategoryFilterValue() && (
                                <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                    Kategori:{' '}
                                    {getFilterLabel(categoryOptions, getCategoryFilterValue())}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
