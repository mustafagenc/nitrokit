import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { TicketList } from './components/ticket-list';
import { TicketFilters } from './components/ticket-filters';

export const metadata: Metadata = {
    title: 'Destek Talepleri',
    description: 'Destek taleplerinizi yönetin',
};

export default async function SupportPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const session = await auth();
    if (!session?.user) {
        redirect('/auth/login');
    }

    const params = await searchParams;

    const page = typeof params.page === 'string' ? Number(params.page) : 1;
    const limit = typeof params.limit === 'string' ? Number(params.limit) : 10;
    const status =
        typeof params.status === 'string'
            ? (params.status as 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED')
            : undefined;
    const category =
        typeof params.category === 'string'
            ? (params.category as
                  | 'TECHNICAL'
                  | 'BILLING'
                  | 'ACCOUNT'
                  | 'GENERAL'
                  | 'FEATURE_REQUEST'
                  | 'BUG_REPORT')
            : undefined;

    const where = {
        ...(session.user.role === 'User' ? { userId: session.user.id } : {}),
        ...(status ? { status } : {}),
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
                    },
                },
                assignedUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
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
        <div className="container mx-auto space-y-6 py-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Destek Talepleri</h1>
                    <p className="text-muted-foreground">
                        Destek taleplerinizi yönetin ve takip edin
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/support/new">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Yeni Talep
                    </Link>
                </Button>
            </div>

            <TicketFilters />

            <TicketList tickets={tickets} total={total} page={page} limit={limit} />
        </div>
    );
}
