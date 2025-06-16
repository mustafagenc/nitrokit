'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    MessageSquare,
    User,
    Clock,
    MoreHorizontal,
    Search,
    RefreshCw,
    Eye,
    Trash2,
    ArrowUpDown,
    Calendar,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Columns,
    Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from '@/i18n/navigation';

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

interface TicketsTableProps {
    tickets: Ticket[];
    total: number;
    page: number;
    limit: number;
}

export function TicketsTable({ tickets, total }: TicketsTableProps) {
    const router = useRouter();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState('');
    const [deletingTickets, setDeletingTickets] = useState<Set<string>>(new Set()); // 👈 Silme durumu

    const statusConfig = {
        OPEN: {
            label: 'Açık',
            variant: 'default' as const,
            icon: AlertTriangle,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 border-blue-200',
        },
        IN_PROGRESS: {
            label: 'İşlemde',
            variant: 'secondary' as const,
            icon: RefreshCw,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50 border-yellow-200',
        },
        WAITING_FOR_USER: {
            label: 'Kullanıcı Bekliyor',
            variant: 'outline' as const,
            icon: Clock,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50 border-orange-200',
        },
        RESOLVED: {
            label: 'Çözüldü',
            variant: 'secondary' as const,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50 border-green-200',
        },
        CLOSED: {
            label: 'Kapalı',
            variant: 'destructive' as const,
            icon: XCircle,
            color: 'text-gray-600',
            bgColor: 'bg-gray-50 border-gray-200',
        },
    };

    const priorityConfig = {
        LOW: {
            label: 'Düşük',
            variant: 'outline' as const,
            color: 'text-gray-600',
            bgColor: 'bg-gray-50',
        },
        MEDIUM: {
            label: 'Orta',
            variant: 'default' as const,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        HIGH: {
            label: 'Yüksek',
            variant: 'secondary' as const,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        URGENT: {
            label: 'Acil',
            variant: 'destructive' as const,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
        },
    };

    const categoryConfig = {
        TECHNICAL: { label: 'Teknik', color: 'bg-purple-100 text-purple-800' },
        BILLING: { label: 'Faturalandırma', color: 'bg-green-100 text-green-800' },
        ACCOUNT: { label: 'Hesap', color: 'bg-blue-100 text-blue-800' },
        GENERAL: { label: 'Genel', color: 'bg-gray-100 text-gray-800' },
        FEATURE_REQUEST: { label: 'Özellik İsteği', color: 'bg-indigo-100 text-indigo-800' },
        BUG_REPORT: { label: 'Hata Bildirimi', color: 'bg-red-100 text-red-800' },
    };

    const handleDeleteTicket = async (ticketId: string) => {
        if (!confirm("Bu ticket'ı silmek istediğinizden emin misiniz?")) {
            return;
        }

        setDeletingTickets((prev) => new Set(prev).add(ticketId));

        try {
            const response = await fetch(`/api/admin/tickets/${ticketId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Ticket silinirken hata oluştu');
            }

            toast.success('Ticket başarıyla silindi');
            router.refresh(); // Sayfayı yenile
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Ticket silinirken hata oluştu');
        } finally {
            setDeletingTickets((prev) => {
                const newSet = new Set(prev);
                newSet.delete(ticketId);
                return newSet;
            });
        }
    };

    const columns: ColumnDef<Ticket>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Tümünü seç"
                    className="translate-y-[2px]"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Satırı seç"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'title',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-8 px-2 lg:px-3"
                >
                    Başlık
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const ticket = row.original;
                return (
                    <div className="flex max-w-[300px] flex-col gap-1">
                        <div
                            className="hover:text-primary cursor-pointer truncate text-sm font-medium transition-colors"
                            title={ticket.title}
                            onClick={() => router.push(`/dashboard/admin/tickets/${ticket.id}`)}
                        >
                            {ticket.title}
                        </div>
                        <div className="text-muted-foreground text-xs">ID: {ticket.id}</div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'user',
            header: 'Kullanıcı',
            cell: ({ row }) => {
                const user = row.original.user;
                const displayName = user?.name || 'Bilinmeyen Kullanıcı';
                const initials = displayName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                return (
                    <div className="flex min-w-[180px] items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.image || ''} alt={displayName} />
                            <AvatarFallback className="text-xs font-medium">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{displayName}</span>
                            <span className="text-muted-foreground max-w-[120px] truncate text-xs">
                                {user?.email}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'status',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-8 px-2 lg:px-3"
                >
                    Durum
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const status = row.getValue('status') as Ticket['status'];
                const config = statusConfig[status];
                const Icon = config.icon;

                return (
                    <div className="flex items-center gap-2">
                        <div className={cn('rounded-full p-1', config.bgColor)}>
                            <Icon className={cn('h-3 w-3', config.color)} />
                        </div>
                        <Badge variant={config.variant} className="text-xs">
                            {config.label}
                        </Badge>
                    </div>
                );
            },
        },
        {
            accessorKey: 'priority',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-8 px-2 lg:px-3"
                >
                    Öncelik
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const priority = row.getValue('priority') as Ticket['priority'];
                const config = priorityConfig[priority];

                return (
                    <Badge variant={config.variant} className="text-xs font-medium">
                        {config.label}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'category',
            header: 'Kategori',
            cell: ({ row }) => {
                const category = row.getValue('category') as Ticket['category'];
                const config = categoryConfig[category];

                return (
                    <span
                        className={cn('rounded-full px-2 py-1 text-xs font-medium', config.color)}
                    >
                        {config.label}
                    </span>
                );
            },
        },
        {
            accessorKey: 'assignedUser',
            header: 'Atanan Kişi',
            cell: ({ row }) => {
                const assignedUser = row.original.assignedUser;

                if (!assignedUser) {
                    return (
                        <div className="text-muted-foreground flex items-center gap-2">
                            <div className="bg-muted/50 flex h-8 w-8 items-center justify-center rounded-full">
                                <User className="h-4 w-4" />
                            </div>
                            <span className="text-sm">Atanmamış</span>
                        </div>
                    );
                }

                const displayName = assignedUser.name || 'Bilinmeyen';
                const initials = displayName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                return (
                    <div className="flex min-w-[180px] items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={assignedUser.image || ''} alt={displayName} />
                            <AvatarFallback className="text-xs font-medium">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{displayName}</span>
                            <span className="text-muted-foreground max-w-[120px] truncate text-xs">
                                {assignedUser.email}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'createdAt',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-8 px-2 lg:px-3"
                >
                    Oluşturulma
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const date = row.getValue('createdAt') as Date;
                const formattedDate = new Date(date).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
                const formattedTime = new Date(date).toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit',
                });

                return (
                    <div className="flex min-w-[140px] items-center gap-2">
                        <Calendar className="text-muted-foreground h-4 w-4" />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{formattedDate}</span>
                            <span className="text-muted-foreground text-xs">{formattedTime}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const ticket = row.original;
                const isDeleting = deletingTickets.has(ticket.id);

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeleting}>
                                <span className="sr-only">Menüyü aç</span>
                                {isDeleting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <MoreHorizontal className="h-4 w-4" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => router.push(`/dashboard/admin/tickets/${ticket.id}`)}
                                className="cursor-pointer"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Görüntüle
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive cursor-pointer"
                                onClick={() => handleDeleteTicket(ticket.id)} // 👈 Sil fonksiyonu
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash2 className="mr-2 h-4 w-4" />
                                )}
                                Sil
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: tickets,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    });

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Ticket</CardTitle>
                        <MessageSquare className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{total}</div>
                        <p className="text-muted-foreground text-xs">Aktif ticketlar</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Açık</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {tickets.filter((t) => t.status === 'OPEN').length}
                        </div>
                        <p className="text-muted-foreground text-xs">Yeni ticketlar</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">İşlemde</CardTitle>
                        <RefreshCw className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {tickets.filter((t) => t.status === 'IN_PROGRESS').length}
                        </div>
                        <p className="text-muted-foreground text-xs">Devam eden</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Çözüldü</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {tickets.filter((t) => t.status === 'RESOLVED').length}
                        </div>
                        <p className="text-muted-foreground text-xs">Bu sayfada</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters & Search */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Ticket Filtreleri</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Search Row - Full Width */}
                        <div className="relative">
                            <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                            <Input
                                placeholder="Ticket ara (başlık, kullanıcı, ID)..."
                                value={globalFilter}
                                onChange={(event) => setGlobalFilter(event.target.value)}
                                className="h-10 pl-9"
                            />
                        </div>

                        {/* Filters Row */}
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                {/* Status Filter */}
                                <Select
                                    value={
                                        (table.getColumn('status')?.getFilterValue() as string) ??
                                        ''
                                    }
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
                                        <SelectItem value="all">Tüm Durumlar</SelectItem>
                                        <SelectItem value="OPEN">Açık</SelectItem>
                                        <SelectItem value="IN_PROGRESS">İşlemde</SelectItem>
                                        <SelectItem value="WAITING_FOR_USER">
                                            Kullanıcı Bekliyor
                                        </SelectItem>
                                        <SelectItem value="RESOLVED">Çözüldü</SelectItem>
                                        <SelectItem value="CLOSED">Kapalı</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Priority Filter */}
                                <Select
                                    value={
                                        (table.getColumn('priority')?.getFilterValue() as string) ??
                                        ''
                                    }
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
                                        <SelectItem value="all">Tüm Öncelikler</SelectItem>
                                        <SelectItem value="LOW">Düşük</SelectItem>
                                        <SelectItem value="MEDIUM">Orta</SelectItem>
                                        <SelectItem value="HIGH">Yüksek</SelectItem>
                                        <SelectItem value="URGENT">Acil</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Page Size Selector - users-table'dan eklenen */}
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
                                        <SelectItem value="10">10 satır</SelectItem>
                                        <SelectItem value="20">20 satır</SelectItem>
                                        <SelectItem value="50">50 satır</SelectItem>
                                        <SelectItem value="100">100 satır</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Column Visibility */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Columns className="mr-2 h-4 w-4" />
                                        Sütunlar
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[200px]">
                                    <DropdownMenuLabel>Görünür Sütunlar</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {table
                                        .getAllColumns()
                                        .filter((column) => column.getCanHide())
                                        .map((column) => {
                                            return (
                                                <DropdownMenuCheckboxItem
                                                    key={column.id}
                                                    className="capitalize"
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={(value) =>
                                                        column.toggleVisibility(!!value)
                                                    }
                                                >
                                                    {column.id}
                                                </DropdownMenuCheckboxItem>
                                            );
                                        })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Data Table */}
            <Card className="p-0">
                {' '}
                {/* 👈 Card'da da p-0 eklendi */}
                <CardContent className="p-0">
                    <div className="rounded-md border-0">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="bg-muted/50 border-b">
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id} className="font-semibold">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && 'selected'}
                                            className="hover:bg-muted/30 transition-colors"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="py-4">
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            <div className="text-muted-foreground flex flex-col items-center gap-2">
                                                <MessageSquare className="h-8 w-8" />
                                                <span>Henüz ticket bulunamadı.</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Pagination */}
            <Card>
                <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                        <div className="text-muted-foreground text-sm">
                            {table.getFilteredSelectedRowModel().rows.length} /{' '}
                            {table.getFilteredRowModel().rows.length} satır seçildi
                        </div>
                        <div className="text-muted-foreground text-sm">Toplam {total} ticket</div>
                        <div className="text-muted-foreground text-sm">
                            Sayfa {table.getState().pagination.pageIndex + 1} /{' '}
                            {table.getPageCount()}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            İlk
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Önceki
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Sonraki
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            Son
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
