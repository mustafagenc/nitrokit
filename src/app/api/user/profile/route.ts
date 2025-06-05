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

interface UserUpdateData {
    firstName: string;
    lastName: string;
    name: string;
    phone: string | null;
    image: string | null;
    phoneVerified?: boolean;
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const validatedData = updateProfileSchema.parse(body);

        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                phone: true,
                phoneVerified: true,
            },
        });

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const name = `${validatedData.firstName} ${validatedData.lastName}`;

        const isPhoneChanging = validatedData.phone !== currentUser.phone;

        const updateData: UserUpdateData = {
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            name,
            phone: validatedData.phone || null,
            image: validatedData.image || null,
        };

        if (isPhoneChanging && currentUser.phoneVerified) {
            updateData.phoneVerified = false;
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                name: true,
                email: true,
                phone: true,
                phoneVerified: true,
                image: true,
                role: true,
            },
        });

        const response = {
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser,
            phoneVerificationReset: isPhoneChanging && currentUser.phoneVerified,
        };

        return NextResponse.json(response);
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
