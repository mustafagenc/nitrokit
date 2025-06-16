import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { TicketList } from './components/ticket-list';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { TicketCategory, TicketPriority, TicketStatus } from '@prisma/client';

export const metadata: Metadata = {
    title: 'Destek Talepleri',
    description: 'Destek taleplerinizi görüntüleyin ve yönetin',
};

export default async function SupportPage({
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
    if (!session?.user) {
        redirect('/auth/login');
    }

    const params = await searchParams;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const status = params.status as TicketStatus | undefined;
    const priority = params.priority as TicketPriority | undefined;
    const category = params.category as TicketCategory | undefined;

    const where = {
        ...(session.user.role === 'User' ? { userId: session.user.id } : {}),
        ...(status ? { status } : {}),
        ...(priority ? { priority } : {}),
        ...(category ? { category } : {}),
    };

    const [tickets, total] = await Promise.all([
        prisma.ticket.findMany({
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
        }),
        prisma.ticket.count({ where }),
    ]);

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between px-6">
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold tracking-tight">Destek Talepleri</h1>
                </div>
                <Button asChild>
                    <Link href="/dashboard/support/new">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Yeni Talep
                    </Link>
                </Button>
            </div>
            <div className="p-6">
                <TicketList tickets={tickets} total={total} page={page} limit={limit} />
            </div>
        </div>
    );
}
