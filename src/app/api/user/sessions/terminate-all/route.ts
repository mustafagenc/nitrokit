import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const currentSessionToken =
            request.cookies.get('authjs.session-token')?.value ||
            request.cookies.get('__Secure-authjs.session-token')?.value;

        await prisma.session.deleteMany({
            where: {
                userId: session.user.id,
                sessionToken: {
                    not: currentSessionToken,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ Failed to terminate all sessions:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
