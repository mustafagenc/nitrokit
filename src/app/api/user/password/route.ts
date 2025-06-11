import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const passwordChangeAttempts = new Map<string, { count: number; lastAttempt: number }>();

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const now = Date.now();
        const userAttempts = passwordChangeAttempts.get(userId);

        if (userAttempts) {
            if (now - userAttempts.lastAttempt > 3600000) {
                passwordChangeAttempts.delete(userId);
            } else if (userAttempts.count >= 5) {
                return NextResponse.json(
                    { error: 'Too many password change attempts. Please try again later.' },
                    { status: 429 }
                );
            }
        }

        const body = await request.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Current password and new password are required' },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: 'New password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { id: true, password: true },
        });

        if (!user || !user.password) {
            return NextResponse.json(
                { error: 'User not found or no password set' },
                { status: 404 }
            );
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            const attempts = passwordChangeAttempts.get(userId) || { count: 0, lastAttempt: 0 };
            passwordChangeAttempts.set(userId, { count: attempts.count + 1, lastAttempt: now });

            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedNewPassword },
        });

        passwordChangeAttempts.delete(userId);

        return NextResponse.json({
            success: true,
            message: 'Password updated successfully',
        });
    } catch (error) {
        console.error('Password update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
