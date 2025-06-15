import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { TicketDetails } from '../components/ticket-details';
import { TicketMessages } from '../components/ticket-messages';
import { TicketActions } from '../components/ticket-actions';

export const metadata: Metadata = {
    title: 'Destek Talebi Detayı',
    description: 'Destek talebi detaylarını görüntüleyin',
};

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
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
            messages: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
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
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Destek Talebi #{ticket.id}
                    </h1>
                    <p className="text-muted-foreground">{ticket.title}</p>
                </div>
                <TicketActions ticket={ticket} />
            </div>
            <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <TicketDetails ticket={ticket} />
                    <TicketMessages ticket={ticket} />
                </div>
            </div>
        </div>
    );
}
