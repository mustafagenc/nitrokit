import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const createPasswordSchema = z.object({
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { password } = createPasswordSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { id: true, email: true, password: true },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (user.password) {
            return NextResponse.json(
                { message: 'Password already exists. Use password change instead.' },
                { status: 400 }
            );
        }

        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json(
            {
                message: 'Password created successfully',
                success: true,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Password creation error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    message: 'Invalid password format',
                    errors: error.errors,
                },
                { status: 400 }
            );
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
