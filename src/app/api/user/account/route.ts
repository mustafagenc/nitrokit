import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { del } from '@vercel/blob';
import bcrypt from 'bcryptjs';

export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { password, confirmText } = body;

        if (confirmText !== 'DELETE') {
            return NextResponse.json(
                { error: 'Please type "DELETE" to confirm account deletion' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                password: true,
                image: true,
                email: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.password && password) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return NextResponse.json({ error: 'Incorrect password' }, { status: 400 });
            }
        } else if (user.password && !password) {
            return NextResponse.json({ error: 'Password is required' }, { status: 400 });
        }

        if (user.image) {
            try {
                await del(user.image);
            } catch (error) {
                console.error('Failed to delete avatar:', error);
            }
        }

        await prisma.$transaction(async (tx) => {
            await tx.session.deleteMany({
                where: { userId: session.user.id },
            });
            await tx.account.deleteMany({
                where: { userId: session.user.id },
            });
            // Add any other related data cleanup here
            // Example: Posts, Comments, etc.
            await tx.user.delete({
                where: { id: session.user.id },
            });
        });

        return NextResponse.json({
            success: true,
            message: 'Account deleted successfully',
        });
    } catch (error) {
        console.error('Account deletion error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
