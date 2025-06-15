import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { TicketCategory, TicketStatus, Prisma } from 'prisma/generated/prisma';

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
        console.log('📥 Request body:', body);

        const validatedData = createTicketSchema.parse(body);
        console.log('✅ Validated data:', validatedData);

        // Bugünün tarihini al
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD formatı

        // Bugünün son ticket'ını bul
        const lastTicket = await prisma.ticket.findFirst({
            where: {
                id: {
                    startsWith: `NKT-${dateStr}`,
                },
            },
            orderBy: {
                id: 'desc',
            },
        });

        // Yeni ID formatı: NKT-YYYYMMDD-XXX
        let sequence = 1;
        if (lastTicket) {
            const lastSequence = parseInt(lastTicket.id.split('-')[2]);
            sequence = lastSequence + 1;
        }

        const newId = `NKT-${dateStr}-${String(sequence).padStart(3, '0')}`;

        const ticket = await prisma.ticket.create({
            data: {
                id: newId,
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

        console.log('🎫 Created ticket:', ticket);
        return NextResponse.json(ticket);
    } catch (error) {
        console.error('❌ Error creating ticket:', error);
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
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        const where = {
            ...(session.user.role === 'User' ? { userId: session.user.id } : {}),
            ...(status ? { status: status as TicketStatus } : {}),
            ...(category ? { category: category as TicketCategory } : {}),
            ...(search
                ? {
                      OR: [
                          { title: { contains: search, mode: 'insensitive' as const } },
                          { description: { contains: search, mode: 'insensitive' as const } },
                      ],
                  }
                : {}),
        } satisfies Prisma.TicketWhereInput;

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
