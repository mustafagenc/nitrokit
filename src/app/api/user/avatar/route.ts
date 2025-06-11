import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { del } from '@vercel/blob';

export async function DELETE() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { image: true },
        });

        if (currentUser?.image) {
            await del(currentUser.image); // Vercel Blob delete
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: null },
        });

        return NextResponse.json({
            success: true,
            message: 'Profile picture removed successfully',
        });
    } catch (error) {
        console.error('Remove avatar error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
