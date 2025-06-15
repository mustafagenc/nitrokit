import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { auth } from '@/lib/auth';

const updateTicketSchema = z.object({
    status: z.enum(['OPEN', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    assignedTo: z.string().optional(),
});

const createMessageSchema = z.object({
    message: z.string().min(1),
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const ticket = await prisma.ticket.findUnique({
            where: {
                id: params.id,
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
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        return NextResponse.json(ticket);
    } catch (error) {
        console.error('Error fetching ticket:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const ticket = await prisma.ticket.findUnique({
            where: { id: params.id },
        });

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        if (session.user.role === 'User' && ticket.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const validatedData = updateTicketSchema.parse(body);

        const updatedTicket = await prisma.ticket.update({
            where: { id: params.id },
            data: {
                ...validatedData,
                ...(validatedData.status === 'CLOSED' ? { closedAt: new Date() } : {}),
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
            },
        });

        return NextResponse.json(updatedTicket);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const ticket = await prisma.ticket.findUnique({
            where: { id: params.id },
        });

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        if (ticket.status === 'CLOSED') {
            return NextResponse.json(
                { error: 'Cannot add message to closed ticket' },
                { status: 400 }
            );
        }

        const body = await req.json();
        const validatedData = createMessageSchema.parse(body);

        const message = await prisma.ticketMessage.create({
            data: {
                ticketId: params.id,
                userId: session.user.id,
                message: validatedData.message,
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
            },
        });

        // Update ticket status to WAITING_FOR_USER if message is from support
        if (session.user.role !== 'User') {
            await prisma.ticket.update({
                where: { id: params.id },
                data: { status: 'WAITING_FOR_USER' },
            });
        } else {
            await prisma.ticket.update({
                where: { id: params.id },
                data: { status: 'IN_PROGRESS' },
            });
        }

        return NextResponse.json(message);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
