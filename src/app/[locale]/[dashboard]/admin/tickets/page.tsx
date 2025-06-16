import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { TicketsTable } from './components/tickets-table';
import { TicketCategory, TicketPriority, TicketStatus } from '@prisma/client';

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
        <div className="container mx-auto py-10">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Ticket Yönetimi</h1>
            </div>
            <TicketsTable tickets={tickets} total={total} page={page} limit={limit} />
        </div>
    );
}
