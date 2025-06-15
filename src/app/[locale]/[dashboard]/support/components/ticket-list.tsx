import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getTicketStatusColor, getTicketPriorityColor } from '../utils';

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
    };
    assignedUser: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
    } | null;
}

interface TicketListProps {
    tickets: Ticket[];
    total: number;
    page: number;
    limit: number;
}

export function TicketList({ tickets, total, page, limit }: TicketListProps) {
    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Başlık</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead>Öncelik</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Oluşturan</TableHead>
                            <TableHead>Atanan</TableHead>
                            <TableHead>Tarih</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets.map((ticket) => (
                            <TableRow key={ticket.id}>
                                <TableCell>
                                    <Link
                                        href={`/dashboard/support/${ticket.id}`}
                                        className="font-medium hover:underline"
                                    >
                                        {ticket.title}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getTicketStatusColor(ticket.status)}>
                                        {ticket.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getTicketPriorityColor(ticket.priority)}>
                                        {ticket.priority}
                                    </Badge>
                                </TableCell>
                                <TableCell>{ticket.category}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={ticket.user.image || undefined} />
                                            <AvatarFallback>
                                                {ticket.user.name?.[0] || ticket.user.email[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">
                                            {ticket.user.name || ticket.user.email}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {ticket.assignedUser ? (
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage
                                                    src={ticket.assignedUser.image || undefined}
                                                />
                                                <AvatarFallback>
                                                    {ticket.assignedUser.name?.[0] ||
                                                        ticket.assignedUser.email[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm">
                                                {ticket.assignedUser.name ||
                                                    ticket.assignedUser.email}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground text-sm">
                                            Atanmamış
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {format(ticket.createdAt, 'dd MMM yyyy HH:mm', {
                                        locale: tr,
                                    })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    baseUrl="/dashboard/support"
                />
            )}
        </div>
    );
}
