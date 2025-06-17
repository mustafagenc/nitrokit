import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { TicketDetails } from './components/ticket-details';
import { TicketMessages } from './components/ticket-messages';

export const metadata: Metadata = {
    title: 'Ticket Detayları - Admin Panel',
    description: 'Ticket detay ve mesaj yönetimi sayfası',
};

export default async function TicketPage({
    params,
}: {
    params: Promise<{ ticketId: string; locale: string }>;
}) {
    const session = await auth();
    const { ticketId } = await params;

    if (!session?.user || session.user.role !== 'Admin') {
        redirect('/dashboard');
    }

    const ticket = await prisma.ticket.findUnique({
        where: {
            id: ticketId,
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
        },
    });

    if (!ticket) {
        redirect('/dashboard/admin/tickets');
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Ticket Detayları</h2>
                    <p className="text-muted-foreground">
                        Ticket bilgilerini düzenleyin ve mesajları yönetin
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-1">
                <TicketDetails ticket={ticket} />
                <TicketMessages ticket={ticket} />
            </div>
        </div>
    );
}
