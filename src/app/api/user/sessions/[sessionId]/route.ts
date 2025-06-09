import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { sessionId } = await params;

        const sessionToDelete = await prisma.session.findFirst({
            where: {
                id: sessionId,
                userId: session.user.id,
            },
        });

        if (!sessionToDelete) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        await prisma.session.delete({
            where: { id: sessionId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ Failed to terminate session:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
