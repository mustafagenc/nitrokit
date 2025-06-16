import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/services/logger';
import { z } from 'zod';

// GET - Ticket detayını getir
export async function GET(req: NextRequest, { params }: { params: { ticketId: string } }) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        // Admin yetkisi kontrolü
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        if (user?.role !== 'Admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const ticket = await prisma.ticket.findUnique({
            where: { id: params.ticketId },
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
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            ticket,
        });
    } catch (error) {
        console.error('Admin ticket detail error', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Ticket güncelle
export async function PUT(req: NextRequest, { params }: { params: { ticketId: string } }) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        // Admin yetkisi kontrolü
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        if (user?.role !== 'Admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const body = await req.json();

        const updateSchema = z.object({
            status: z
                .enum(['OPEN', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED'])
                .optional(),
            priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
            category: z
                .enum([
                    'TECHNICAL',
                    'BILLING',
                    'ACCOUNT',
                    'GENERAL',
                    'FEATURE_REQUEST',
                    'BUG_REPORT',
                ])
                .optional(),
            assignedUserId: z.string().uuid().nullable().optional(),
            title: z.string().min(1).max(255).optional(),
        });

        const validatedData = updateSchema.parse(body);

        // Ticket'ın var olup olmadığını kontrol et
        const existingTicket = await prisma.ticket.findUnique({
            where: { id: params.ticketId },
        });

        if (!existingTicket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        // Atanan kullanıcının var olup olmadığını kontrol et
        if (validatedData.assignedUserId) {
            const assignedUser = await prisma.user.findUnique({
                where: { id: validatedData.assignedUserId },
            });

            if (!assignedUser) {
                return NextResponse.json({ error: 'Assigned user not found' }, { status: 400 });
            }
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id: params.ticketId },
            data: validatedData,
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
        });

        logger.info('Admin ticket updated', {
            ticketId: params.ticketId,
            adminId: session.user.id,
            changes: validatedData,
        });

        return NextResponse.json({
            success: true,
            message: 'Ticket updated successfully',
            ticket: updatedTicket,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: 'Invalid request data',
                    details: error.errors,
                },
                { status: 400 }
            );
        }
        console.error('Admin ticket update error', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Ticket sil 👈 YENİ!
export async function DELETE(req: NextRequest, { params }: { params: { ticketId: string } }) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        // Admin yetkisi kontrolü
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        if (user?.role !== 'Admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        // Ticket'ın var olup olmadığını kontrol et
        const existingTicket = await prisma.ticket.findUnique({
            where: { id: params.ticketId },
            select: {
                id: true,
                title: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!existingTicket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        // Transaction ile ticket ve mesajlarını sil
        await prisma.$transaction(async (tx) => {
            // Önce ticket mesajlarını sil
            await tx.ticketMessage.deleteMany({
                where: { ticketId: params.ticketId },
            });

            // Sonra ticket'ı sil
            await tx.ticket.delete({
                where: { id: params.ticketId },
            });
        });

        logger.info('Admin ticket deleted', {
            ticketId: params.ticketId,
            ticketTitle: existingTicket.title,
            adminId: session.user.id,
            userEmail: existingTicket.user.email,
        });

        return NextResponse.json({
            success: true,
            message: 'Ticket deleted successfully',
        });
    } catch (error) {
        console.error('Admin ticket delete error', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
