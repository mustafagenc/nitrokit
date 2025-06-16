import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { TicketDetails } from './components/ticket-details';
import { TicketMessages } from './components/ticket-messages';
import { TicketInfo } from './components/ticket-info';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Destek Talebi Detayı',
    description: 'Destek talebi detaylarını görüntüleyin',
};

export default async function SupportDetailPage({
    params,
    searchParams: _searchParams,
}: {
    params: Promise<{ id: string; locale: string }>;
    searchParams: Promise<{
        view?: string;
        tab?: string;
    }>;
}) {
    const session = await auth();
    if (!session?.user) {
        redirect('/auth/login');
    }

    const { id } = await params;

    const ticket = await prisma.ticket.findUnique({
        where: {
            id: id,
            ...(session.user.role === 'User' ? { userId: session.user.id } : {}),
        },
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
            messages: {
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
                    attachments: true,
                },
                orderBy: {
                    createdAt: 'asc',
                },
            },
            attachments: true,
        },
    });

    if (!ticket) {
        notFound();
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between px-6">
                <div className="space-y-4">
                    <Button variant="ghost" asChild className="gap-2">
                        <Link href="/dashboard/support">
                            <ArrowLeft className="h-4 w-4" />
                            Geri Dön
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Destek Talebi #{ticket.id}
                        </h1>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
                <div className="order-2 space-y-6 lg:order-1 lg:col-span-2">
                    <TicketDetails ticket={ticket} />
                    <TicketMessages ticket={ticket} />
                </div>
                <div className="order-1 lg:order-2 lg:col-span-1">
                    <div className="sticky top-6">
                        <TicketInfo ticket={ticket} />
                    </div>
                </div>
            </div>
        </div>
    );
}
