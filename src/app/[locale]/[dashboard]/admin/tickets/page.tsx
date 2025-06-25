import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { TicketsTable } from './components/tickets-table';
import { TicketCategory, TicketPriority, TicketStatus } from '@/prisma/client';
import { TicketStats } from './components/ticket-stats';

export const metadata: Metadata = {
    title: 'Ticket Yönetimi',
    description: 'Ticket yönetim paneli',
};

export default async function TicketsPage({
    searchParams,
}: {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        status?: string;
        priority?: string;
        category?: string;
    }>;
}) {
    const session = await auth();
    const params = await searchParams;

    if (!session?.user || session.user.role !== 'Admin') {
        redirect('/dashboard/support');
    }

    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 10;
    const status = params?.status;
    const priority = params?.priority;
    const category = params?.category;

    const where = {
        ...(status ? { status: status as TicketStatus } : {}),
        ...(priority ? { priority: priority as TicketPriority } : {}),
        ...(category ? { category: category as TicketCategory } : {}),
    };

    const tickets = await prisma.ticket.findMany({
        where,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                },
            },
            assignedUser: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    const total = await prisma.ticket.count({ where });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Ticket Yönetimi</h2>
                    <p className="text-muted-foreground">...</p>
                </div>
            </div>
            <TicketStats tickets={tickets} total={total} />
            <TicketsTable tickets={tickets} total={total} page={page} limit={limit} />
        </div>
    );
}
