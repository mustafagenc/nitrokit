import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { TicketsTable } from './components/tickets-table';
import type { TicketStatus, TicketPriority, TicketCategory } from 'prisma/generated/prisma';

export const metadata: Metadata = {
    title: 'Ticket Yönetimi',
    description: 'Ticket yönetim paneli',
};

export default async function TicketsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const session = await auth();

    if (!session?.user || session.user.role !== 'Admin') {
        redirect('/dashboard/support');
    }

    const page = Number(searchParams?.page) || 1;
    const limit = Number(searchParams?.limit) || 10;
    const status = searchParams?.status;
    const priority = searchParams?.priority;
    const category = searchParams?.category;

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
