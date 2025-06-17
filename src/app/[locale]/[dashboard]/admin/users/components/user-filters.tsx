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

interface User {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    image: string | null;
    role: 'User' | 'Admin' | 'Moderator';
    emailVerified: Date | null;
    phone: string | null;
    phoneVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    locale: string;
    accounts: {
        provider: string;
    }[];
}

interface UserFiltersProps {
    table: Table<User>;
    globalFilter: string;
    onGlobalFilterChange: (value: string) => void;
}

export function UserFilters({ table, globalFilter, onGlobalFilterChange }: UserFiltersProps) {
    const roleOptions = [
        { value: 'all', label: 'Tüm Roller' },
        { value: 'User', label: 'Kullanıcı' },
        { value: 'Moderator', label: 'Moderatör' },
        { value: 'Admin', label: 'Yönetici' },
    ];

    const pageSizeOptions = [
        { value: '10', label: '10 satır' },
        { value: '20', label: '20 satır' },
        { value: '50', label: '50 satır' },
        { value: '100', label: '100 satır' },
    ];

    // Helper functions to safely get filter values
    const getRoleFilterValue = (): string => {
        const value = table.getColumn('role')?.getFilterValue();
        return typeof value === 'string' ? value : '';
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (globalFilter) count++;
        if (getRoleFilterValue()) count++;
        return count;
    };

    const clearAllFilters = () => {
        onGlobalFilterChange('');
        table.getColumn('role')?.setFilterValue('');
    };

    const activeFiltersCount = getActiveFiltersCount();

    // Helper function to get filter label
    const getFilterLabel = (options: typeof roleOptions, value: string): string => {
        const option = options.find((opt) => opt.value === value);
        return option?.label || value;
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Filter className="h-5 w-5" />
                        Kullanıcı Filtreleri
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
                            placeholder="Kullanıcı ara (isim, email)..."
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
                            {/* Role Filter */}
                            <Select
                                value={getRoleFilterValue() || 'all'}
                                onValueChange={(value) =>
                                    table
                                        .getColumn('role')
                                        ?.setFilterValue(value === 'all' ? '' : value)
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Rol seç" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roleOptions.map((option) => (
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
                                            name: 'Kullanıcı',
                                            contact: 'İletişim',
                                            role: 'Rol',
                                            accounts: 'Bağlantılar',
                                            createdAt: 'Kayıt Tarihi',
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
                            {getRoleFilterValue() && (
                                <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    Rol: {getFilterLabel(roleOptions, getRoleFilterValue())}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
