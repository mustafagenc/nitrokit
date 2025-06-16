import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

const updateTicketSchema = z.object({
    status: z.enum(['OPEN', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    assignedTo: z.string().optional(),
});

const ticketMessageFormSchema = z.object({
    message: z.string().min(1, 'Mesaj boş olamaz'),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        return NextResponse.json(ticket);
    } catch (error) {
        console.error('Error fetching ticket:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { id } = await params;
        const ticket = await prisma.ticket.findUnique({
            where: { id: id },
        });

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        if (session.user.role === 'User' && ticket.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const validatedData = updateTicketSchema.parse(body);

        const updatedTicket = await prisma.ticket.update({
            where: { id: id },
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

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();

        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const { id } = await params;
        const contentType = request.headers.get('content-type') || '';
        let message = '';
        let files: File[] = [];

        if (contentType.includes('application/json')) {
            const body = await request.json();
            message = body.message;
        } else if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            message = formData.get('message') as string;
            files = formData.getAll('files') as File[];
        } else {
            return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 400 });
        }

        const validatedData = ticketMessageFormSchema.parse({ message });

        const messageId = crypto.randomUUID();
        const attachments = [];

        for (const file of files) {
            const fileName = `${uuidv4()}-${file.name}`;
            const { url } = await put(fileName, file, {
                access: 'public',
            });

            attachments.push({
                id: crypto.randomUUID(),
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                fileUrl: url,
            });
        }

        const ticketMessage = await prisma.ticketMessage.create({
            data: {
                id: messageId,
                message: validatedData.message,
                ticketId: id,
                userId: session.user.id,
                attachments: {
                    create: attachments,
                },
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
                attachments: true,
            },
        });

        return NextResponse.json(ticketMessage);
    } catch (error) {
        console.error('[TICKET_MESSAGE_POST]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
