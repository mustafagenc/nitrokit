import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { TicketCategory, TicketStatus } from 'generated/prisma';

const createTicketSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10),
    category: z.enum([
        'TECHNICAL',
        'BILLING',
        'ACCOUNT',
        'GENERAL',
        'FEATURE_REQUEST',
        'BUG_REPORT',
    ]),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = createTicketSchema.parse(body);

        const ticket = await prisma.ticket.create({
            data: {
                ...validatedData,
                userId: session.user.id,
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

        return NextResponse.json(ticket);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const category = searchParams.get('category');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        const where = {
            ...(session.user.role === 'User' ? { userId: session.user.id } : {}),
            ...(status ? { status: status as TicketStatus } : {}),
            ...(category ? { category: category as TicketCategory } : {}),
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

        return NextResponse.json({
            tickets,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit,
            },
        });
    } catch (error) {
        console.error('❌ Failed to fetch tickets:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
