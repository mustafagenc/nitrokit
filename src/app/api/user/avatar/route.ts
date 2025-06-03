import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
