/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useRouter } from '@/i18n/navigation';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Mail,
    Phone,
    Trash2,
    MoreHorizontal,
    Edit,
    CheckCircle2,
    XCircle,
    Search,
    ArrowUpDown,
    Calendar,
    Columns,
    UserCheck,
    Shield,
    Loader2,
    Eye,
    Users as UsersIcon,
} from 'lucide-react';
import { EditUserDialog } from './edit-user-dialog';
import { providers } from '@/lib/auth/providers';
import { localesWithFlag } from '@/constants/locale';

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

export function UsersTable({ users }: { users: User[] }) {
    const router = useRouter();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loadingActions, setLoadingActions] = useState<Set<string>>(new Set());

    const handleAction = async (action: () => Promise<void>, userId: string) => {
        setLoadingActions((prev) => new Set(prev).add(userId));
        try {
            await action();
        } finally {
            setLoadingActions((prev) => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    const columns: ColumnDef<User>[] = [
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
            accessorKey: 'name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-8 px-2 lg:px-3"
                >
                    Kullanıcı
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const firstName = row.original.firstName;
                const lastName = row.original.lastName;
                const image = row.original.image;
                const locale = row.original.locale;
                const localeInfo = localesWithFlag.find((l) => l.id === locale);

                const fullName =
                    [firstName, lastName].filter(Boolean).join(' ') || 'İsimsiz Kullanıcı';
                const initials = fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                return (
                    <div className="flex min-w-[200px] items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={image || ''} alt={fullName} />
                            <AvatarFallback className="text-sm font-medium">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{fullName}</span>
                                {localeInfo && (
                                    <img
                                        src={localeInfo.flag}
                                        alt={localeInfo.name}
                                        width={16}
                                        height={12}
                                        className="rounded-sm"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'contact',
            header: 'İletişim',
            cell: ({ row }) => {
                const email = row.original.email;
                const emailVerified = row.original.emailVerified;
                const phone = row.original.phone;
                const phoneVerified = row.original.phoneVerified;

                return (
                    <div className="min-w-[200px] space-y-2">
                        {/* Email */}
                        <div className="flex items-center gap-2">
                            <Mail className="text-muted-foreground h-3 w-3" />
                            <span className="max-w-[140px] truncate text-xs">{email}</span>
                            {emailVerified ? (
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                            ) : (
                                <XCircle className="h-3 w-3 text-red-500" />
                            )}
                        </div>
                        {/* Phone */}
                        {phone && (
                            <div className="flex items-center gap-2">
                                <Phone className="text-muted-foreground h-3 w-3" />
                                <span className="text-xs">{phone}</span>
                                {phoneVerified ? (
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                ) : (
                                    <XCircle className="h-3 w-3 text-red-500" />
                                )}
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'role',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-8 px-2 lg:px-3"
                >
                    Rol
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const role = row.getValue('role') as string;
                const config = {
                    Admin: {
                        label: 'Yönetici',
                        variant: 'destructive' as const,
                        icon: Shield,
                    },
                    Moderator: {
                        label: 'Moderatör',
                        variant: 'default' as const,
                        icon: UserCheck,
                    },
                    User: {
                        label: 'Kullanıcı',
                        variant: 'secondary' as const,
                        icon: Eye,
                    },
                };

                const roleConfig = config[role as keyof typeof config];
                const Icon = roleConfig.icon;

                return (
                    <div className="flex items-center gap-2">
                        <Icon className="h-3 w-3" />
                        <Badge variant={roleConfig.variant} className="text-xs">
                            {roleConfig.label}
                        </Badge>
                    </div>
                );
            },
        },
        {
            accessorKey: 'accounts',
            header: 'Bağlantılar',
            cell: ({ row }) => {
                const accounts = row.getValue('accounts') as { provider: string }[];
                const userProviders = accounts.map((account) => account.provider);

                return (
                    <div className="flex shrink-0 justify-start">
                        {accounts.length > 0 ? (
                            <div className="flex -space-x-2">
                                {providers.map((provider) => {
                                    if (userProviders.includes(provider.id)) {
                                        const Logo = provider.logo;
                                        return (
                                            <div key={provider.id} className="flex">
                                                <div
                                                    className="ring-background bg-background relative flex size-6 shrink-0 items-center justify-center rounded-full ring-1 hover:z-5"
                                                    title={provider.name}
                                                >
                                                    <Logo className="h-3 w-3" />
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        ) : (
                            <span className="text-muted-foreground text-xs">Bağlantı yok</span>
                        )}
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
                    Kayıt Tarihi
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

                return (
                    <div className="flex min-w-[120px] items-center gap-2">
                        <Calendar className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm">{formattedDate}</span>
                    </div>
                );
            },
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original;
                const isLoading = loadingActions.has(user.id);

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
                                <span className="sr-only">Menüyü aç</span>
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <MoreHorizontal className="h-4 w-4" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* Düzenle */}
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedUser(user);
                                    setEditDialogOpen(true);
                                }}
                                className="cursor-pointer"
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Düzenle
                            </DropdownMenuItem>

                            {/* E-posta Onayla - Sadece onaylanmamış kullanıcılar için */}
                            {!user.emailVerified && (
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleAction(async () => {
                                            const response = await fetch(
                                                `/api/admin/users/${user.id}/verify-email`,
                                                {
                                                    method: 'POST',
                                                }
                                            );
                                            if (!response.ok)
                                                throw new Error('E-posta onaylama başarısız');
                                            toast.success('E-posta başarıyla onaylandı');
                                            router.refresh();
                                        }, user.id)
                                    }
                                    className="cursor-pointer"
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    E-posta Onayla
                                </DropdownMenuItem>
                            )}

                            {/* Telefon Onayla - Sadece telefonu olan ve onaylanmamış kullanıcılar için */}
                            {user.phone && !user.phoneVerified && (
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleAction(async () => {
                                            const response = await fetch(
                                                `/api/admin/users/${user.id}/verify-phone`,
                                                {
                                                    method: 'POST',
                                                }
                                            );
                                            if (!response.ok)
                                                throw new Error('Telefon onaylama başarısız');
                                            toast.success('Telefon başarıyla onaylandı');
                                            router.refresh();
                                        }, user.id)
                                    }
                                    className="cursor-pointer"
                                >
                                    <Phone className="mr-2 h-4 w-4" />
                                    Telefon Onayla
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            {/* Sil */}
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedUser(user);
                                    setDeleteDialogOpen(true);
                                }}
                                className="text-destructive focus:text-destructive cursor-pointer"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Sil
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: users,
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

    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        try {
            const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Kullanıcı silme işlemi başarısız oldu');
            }

            toast.success('Kullanıcı başarıyla silindi');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Kullanıcı silme işlemi başarısız oldu');
        } finally {
            setDeleteDialogOpen(false);
            setSelectedUser(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Kullanıcı Filtreleri</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                            <Input
                                placeholder="Kullanıcı ara (isim, email)..."
                                value={globalFilter}
                                onChange={(event) => setGlobalFilter(event.target.value)}
                                className="h-10 pl-9"
                            />
                        </div>

                        {/* Filters Row */}
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                {/* Role Filter */}
                                <Select
                                    value={
                                        (table.getColumn('role')?.getFilterValue() as string) ?? ''
                                    }
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
                                        <SelectItem value="all">Tüm Roller</SelectItem>
                                        <SelectItem value="User">Kullanıcı</SelectItem>
                                        <SelectItem value="Moderator">Moderatör</SelectItem>
                                        <SelectItem value="Admin">Yönetici</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Page Size Selector */}
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
                                                <UsersIcon className="h-8 w-8" />
                                                <span>Kullanıcı bulunamadı.</span>
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
                        <div className="text-muted-foreground text-sm">
                            Toplam {users.length} kullanıcı
                        </div>
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

            {/* Delete Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Kullanıcıyı Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu işlem geri alınamaz. Bu kullanıcıyı silmek istediğinizden emin
                            misiniz?
                            <br />
                            <strong>{selectedUser?.email}</strong> kullanıcısı silinecek.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteUser}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Sil
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Dialog */}
            {selectedUser && (
                <EditUserDialog
                    user={selectedUser}
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                />
            )}
        </div>
    );
}
