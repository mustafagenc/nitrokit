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

interface TicketPageProps {
    params: {
        ticketId: string;
    };
}

export default async function TicketPage({ params }: TicketPageProps) {
    const session = await auth();

    if (!session?.user || session.user.role !== 'Admin') {
        redirect('/dashboard');
    }

    const { ticketId } = await params;

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
        <div className="container mx-auto space-y-6 py-6">
            {/* Page Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Ticket Detayları</h1>
                <p className="text-muted-foreground">
                    Ticket bilgilerini düzenleyin ve mesajları yönetin
                </p>
            </div>

            {/* Content */}
            <div className="grid gap-6 lg:grid-cols-1">
                <TicketDetails ticket={ticket} />
                <TicketMessages ticket={ticket} />
            </div>
        </div>
    );
}
