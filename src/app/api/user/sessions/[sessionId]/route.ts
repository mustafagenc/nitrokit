import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
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

        const currentSessionToken =
            request.cookies.get('authjs.session-token')?.value ||
            request.cookies.get('__Secure-authjs.session-token')?.value;

        const sessionToDelete = await prisma.session.findFirst({
            where: {
                id: sessionId,
                userId: session.user.id,
            },
        });

        if (!sessionToDelete) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        const isDeletingCurrentSession = sessionToDelete.sessionToken === currentSessionToken;

        await prisma.session.delete({
            where: { id: sessionId },
        });

        if (isDeletingCurrentSession) {
            const response = NextResponse.json({
                success: true,
                currentSessionDeleted: true,
            });

            response.cookies.delete('authjs.session-token');
            response.cookies.delete('__Secure-authjs.session-token');
            response.cookies.delete('authjs.csrf-token');
            response.cookies.delete('__Secure-authjs.csrf-token');

            return response;
        }

        return NextResponse.json({ success: true, currentSessionDeleted: false });
    } catch (error) {
        console.error('❌ Failed to terminate session:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
