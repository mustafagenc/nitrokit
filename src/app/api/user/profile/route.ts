import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateProfileSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    phone: z.string().optional(),
    image: z.string().url().optional().or(z.literal('')),
});

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const validatedData = updateProfileSchema.parse(body);

        const name = `${validatedData.firstName} ${validatedData.lastName}`;

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                name,
                phone: validatedData.phone || null,
                image: validatedData.image || null,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                name: true,
                email: true,
                phone: true,
                image: true,
                role: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
