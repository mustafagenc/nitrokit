import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const requestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = requestSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { email, isActive: true },
            select: {
                id: true,
                password: true,
                twoFactorEnabled: true,
                emailVerified: true,
            },
        });

        if (!user || !user.password || !user.emailVerified) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        return NextResponse.json({
            requiresTwoFactor: user.twoFactorEnabled,
            userId: user.id,
        });
    } catch (error) {
        console.error('❌ Failed to check 2FA status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
