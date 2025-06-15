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
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
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
import { Mail, Phone, Trash2, MoreHorizontal, Pencil, CheckCircle2, XCircle } from 'lucide-react';
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
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const columns: ColumnDef<User>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Tümünü seç"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Satırı seç"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'name',
            header: 'Ad Soyad',
            cell: ({ row }) => {
                const firstName = row.original.firstName;
                const lastName = row.original.lastName;
                const image = row.original.image;
                const locale = row.original.locale;
                const localeInfo = localesWithFlag.find((l) => l.id === locale);

                const fullName = [firstName, lastName].filter(Boolean).join(' ') || '-';

                return (
                    <div className="flex w-full items-center justify-between">
                        <div>{fullName}</div>
                        <div className="flex items-center gap-2">
                            {localeInfo && (
                                <img
                                    src={localeInfo.flag}
                                    alt={localeInfo.name}
                                    width={16}
                                    height={16}
                                    className="shadow-xs"
                                />
                            )}
                            {image && (
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <div className="ring-background bg-background border-border relative size-8 shrink-0 cursor-pointer overflow-hidden rounded-full border ring-1">
                                            <img
                                                src={image}
                                                alt={fullName}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-80 p-0">
                                        <img
                                            src={image}
                                            alt={fullName}
                                            className="h-full w-full rounded-lg object-cover"
                                        />
                                    </HoverCardContent>
                                </HoverCard>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'email',
            header: 'İletişim',
            cell: ({ row }) => {
                const email = row.getValue('email') as string;
                const emailVerified = row.original.emailVerified;
                const phone = row.original.phone;
                const phoneVerified = row.original.phoneVerified;

                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Mail className="text-muted-foreground h-4 w-4" />
                            <span>{email}</span>
                            {emailVerified ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                            )}
                        </div>
                        {phone && (
                            <div className="flex items-center gap-2">
                                <Phone className="text-muted-foreground h-4 w-4" />
                                <span>{phone}</span>
                                {phoneVerified ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                )}
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'role',
            header: 'Rol',
            cell: ({ row }) => {
                const role = row.getValue('role') as string;
                return (
                    <Badge
                        variant={
                            role === 'Admin'
                                ? 'destructive'
                                : role === 'Moderator'
                                  ? 'default'
                                  : 'secondary'
                        }
                    >
                        {role === 'Admin'
                            ? 'Yönetici'
                            : role === 'Moderator'
                              ? 'Moderatör'
                              : 'Kullanıcı'}
                    </Badge>
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
                    <div className="flex shrink-0 justify-end rtl:justify-start">
                        <div className="flex -space-x-2">
                            {providers.map((provider) => {
                                if (userProviders.includes(provider.id)) {
                                    const Logo = provider.logo;
                                    return (
                                        <div key={provider.id} className="flex">
                                            <div
                                                className="ring-background bg-background border-border relative size-7 shrink-0 rounded-full border ring-1 hover:z-5"
                                                title={provider.name}
                                            >
                                                <div className="flex h-full items-center justify-center">
                                                    <Logo className="h-7 w-7 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'createdAt',
            header: 'Kayıt Tarihi',
            cell: ({ row }) => {
                const date = row.getValue('createdAt') as Date;
                return <div>{date.toLocaleDateString()}</div>;
            },
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Menüyü aç</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuCheckboxItem
                                onClick={() => {
                                    console.log('Selected user:', user); // Debug için
                                    setSelectedUser({
                                        ...user,
                                        firstName: user.firstName || '',
                                        lastName: user.lastName || '',
                                    });
                                    setEditDialogOpen(true);
                                }}
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Düzenle</span>
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                onClick={async () => {
                                    try {
                                        const response = await fetch(
                                            `/api/admin/users/${user.id}/verify-email`,
                                            {
                                                method: 'POST',
                                            }
                                        );

                                        if (!response.ok) {
                                            throw new Error(
                                                'E-posta onaylama işlemi başarısız oldu'
                                            );
                                        }

                                        toast.success('E-posta başarıyla onaylandı');
                                        router.refresh();
                                    } catch (error) {
                                        console.error(error);
                                        toast.error('E-posta onaylama işlemi başarısız oldu');
                                    }
                                }}
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                <span>E-posta Onayla</span>
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                onClick={async () => {
                                    try {
                                        const response = await fetch(
                                            `/api/admin/users/${user.id}/verify-phone`,
                                            {
                                                method: 'POST',
                                            }
                                        );

                                        if (!response.ok) {
                                            throw new Error(
                                                'Telefon onaylama işlemi başarısız oldu'
                                            );
                                        }

                                        toast.success('Telefon başarıyla onaylandı');
                                        router.refresh();
                                    } catch (error) {
                                        console.error(error);
                                        toast.error('Telefon onaylama işlemi başarısız oldu');
                                    }
                                }}
                            >
                                <Phone className="mr-2 h-4 w-4" />
                                <span>Telefon Onayla</span>
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                onClick={() => {
                                    setSelectedUser(user);
                                    setDeleteDialogOpen(true);
                                }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Sil</span>
                            </DropdownMenuCheckboxItem>
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
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
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
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Input
                    placeholder="Kullanıcı ara..."
                    value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                    onChange={(event) =>
                        table.getColumn('name')?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Sütunlar
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
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
                                    Kullanıcı bulunamadı.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} satır seçildi
                </div>
                <div className="space-x-2">
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
                </div>
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Kullanıcıyı Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu işlem geri alınamaz. Bu kullanıcıyı silmek istediğinizden emin
                            misiniz?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteUser}>Sil</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
