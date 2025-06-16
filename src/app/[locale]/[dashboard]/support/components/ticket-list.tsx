'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    Row,
    HeaderGroup,
    Header,
} from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getTicketStatusColor, getTicketPriorityColor } from '../utils';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useCallback } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp, ChevronsLeft, ChevronsRight } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useFormatter } from 'next-intl';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Ticket, TicketListProps } from '@/types/ticket';

export function TicketList({ tickets, total, page, limit }: TicketListProps) {
    const router = useRouter();
    const format = useFormatter();
    const searchParams = useSearchParams();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pageSize, setPageSize] = useState(limit);

    const columns: ColumnDef<Ticket>[] = [
        {
            accessorKey: 'id',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="font-medium"
                    >
                        ID
                        {column.getIsSorted() === 'asc' ? (
                            <ChevronUp className="ml-2 h-4 w-4" />
                        ) : column.getIsSorted() === 'desc' ? (
                            <ChevronDown className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                );
            },
            cell: ({ row }: { row: Row<Ticket> }) => (
                <span className="text-muted-foreground text-sm">#{row.original.id}</span>
            ),
        },
        {
            accessorKey: 'title',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="font-medium"
                    >
                        Başlık
                        {column.getIsSorted() === 'asc' ? (
                            <ChevronUp className="ml-2 h-4 w-4" />
                        ) : column.getIsSorted() === 'desc' ? (
                            <ChevronDown className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                );
            },
            cell: ({ row }: { row: Row<Ticket> }) => (
                <Link
                    href={`/dashboard/support/${row.original.id}`}
                    className="font-medium hover:underline"
                >
                    {row.original.title}
                </Link>
            ),
        },
        {
            accessorKey: 'status',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="font-medium"
                    >
                        Durum
                        {column.getIsSorted() === 'asc' ? (
                            <ChevronUp className="ml-2 h-4 w-4" />
                        ) : column.getIsSorted() === 'desc' ? (
                            <ChevronDown className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                );
            },
            cell: ({ row }: { row: Row<Ticket> }) => (
                <Badge variant={getTicketStatusColor(row.original.status)}>
                    {row.original.status === 'OPEN' && 'Açık'}
                    {row.original.status === 'IN_PROGRESS' && 'İşlemde'}
                    {row.original.status === 'WAITING_FOR_USER' && 'Beklemede'}
                    {row.original.status === 'RESOLVED' && 'Çözüldü'}
                    {row.original.status === 'CLOSED' && 'Kapalı'}
                </Badge>
            ),
        },
        {
            accessorKey: 'priority',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="font-medium"
                    >
                        Öncelik
                        {column.getIsSorted() === 'asc' ? (
                            <ChevronUp className="ml-2 h-4 w-4" />
                        ) : column.getIsSorted() === 'desc' ? (
                            <ChevronDown className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                );
            },
            cell: ({ row }: { row: Row<Ticket> }) => (
                <Badge variant={getTicketPriorityColor(row.original.priority)}>
                    {row.original.priority === 'LOW' && 'Düşük'}
                    {row.original.priority === 'MEDIUM' && 'Orta'}
                    {row.original.priority === 'HIGH' && 'Yüksek'}
                    {row.original.priority === 'URGENT' && 'Acil'}
                </Badge>
            ),
        },
        {
            accessorKey: 'user',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="font-medium"
                    >
                        Kullanıcılar
                        {column.getIsSorted() === 'asc' ? (
                            <ChevronUp className="ml-2 h-4 w-4" />
                        ) : column.getIsSorted() === 'desc' ? (
                            <ChevronDown className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                );
            },
            cell: ({ row }: { row: Row<Ticket> }) => (
                <div className="flex justify-center">
                    <div className="relative">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={row.original.user.image || undefined} />
                                        <AvatarFallback>
                                            {row.original.user.name?.[0] ||
                                                row.original.user.email[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        Oluşturan:{' '}
                                        {row.original.user.name || row.original.user.email}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        {row.original.assignedUser && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Avatar className="border-background absolute -top-2 -right-2 h-6 w-6 border-2">
                                            <AvatarImage
                                                src={row.original.assignedUser.image || undefined}
                                            />
                                            <AvatarFallback>
                                                {row.original.assignedUser.name?.[0] ||
                                                    row.original.assignedUser.email[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            Atanan:{' '}
                                            {row.original.assignedUser.name ||
                                                row.original.assignedUser.email}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="font-medium"
                    >
                        Tarih
                        {column.getIsSorted() === 'asc' ? (
                            <ChevronUp className="ml-2 h-4 w-4" />
                        ) : column.getIsSorted() === 'desc' ? (
                            <ChevronDown className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                );
            },
            cell: ({ row }: { row: Row<Ticket> }) =>
                format.dateTime(row.original.createdAt, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
        },
    ];

    const createQueryString = useCallback(
        (params: Record<string, string | number | null>) => {
            const newParams = new URLSearchParams(searchParams.toString());

            Object.entries(params).forEach(([key, value]) => {
                if (value === null) {
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
        const search = searchParams.get('search');
        const status = searchParams.get('status');
        const category = searchParams.get('category');
        const priority = searchParams.get('priority');
        const currentPage = searchParams.get('page');

        if (search && !currentPage) {
            router.push(
                `/dashboard/support?${createQueryString({
                    page: 1,
                    limit: pageSize,
                    search,
                    status,
                    category,
                    priority,
                })}`
            );
        }
    }, [searchParams, pageSize, router, createQueryString]);

    const handlePageChange = (newPage: number) => {
        router.push(
            `/dashboard/support?${createQueryString({
                page: newPage,
                limit: pageSize,
            })}`
        );
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        router.push(
            `/dashboard/support?${createQueryString({
                page: 1,
                limit: newPageSize,
            })}`
        );
    };

    const table = useReactTable({
        data: tickets,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
            pagination: {
                pageIndex: page - 1,
                pageSize,
            },
        },
        pageCount: Math.ceil(total / pageSize),
        manualPagination: true,
    });

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup: HeaderGroup<Ticket>) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header: Header<Ticket, unknown>) => (
                                    <TableHead key={header.id}>
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
                            table.getRowModel().rows.map((row: Row<Ticket>) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Sonuç bulunamadı.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <p className="text-muted-foreground text-sm">Sayfa başına satır</p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => {
                            handlePageSizeChange(Number(value));
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-6 lg:gap-8">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">Sayfa</p>
                        <span className="text-muted-foreground text-sm">
                            {page} / {Math.ceil(total / pageSize)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => handlePageChange(1)}
                            disabled={page === 1}
                        >
                            <span className="sr-only">İlk sayfa</span>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                        >
                            <span className="sr-only">Önceki sayfa</span>
                            <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= Math.ceil(total / pageSize)}
                        >
                            <span className="sr-only">Sonraki sayfa</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => handlePageChange(Math.ceil(total / pageSize))}
                            disabled={page >= Math.ceil(total / pageSize)}
                        >
                            <span className="sr-only">Son sayfa</span>
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
