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

        const body = await request.json().catch(() => ({}));
        const preserveCurrentSession = body.preserveCurrentSession !== false; // Default to true

        if (preserveCurrentSession && currentSessionToken) {
            await prisma.session.deleteMany({
                where: {
                    userId: session.user.id,
                    sessionToken: {
                        not: currentSessionToken,
                    },
                },
            });

            return NextResponse.json({
                success: true,
                currentSessionPreserved: true,
            });
        } else {
            await prisma.session.deleteMany({
                where: {
                    userId: session.user.id,
                },
            });

            const response = NextResponse.json({
                success: true,
                currentSessionPreserved: false,
            });

            response.cookies.delete('authjs.session-token');
            response.cookies.delete('__Secure-authjs.session-token');
            response.cookies.delete('authjs.csrf-token');
            response.cookies.delete('__Secure-authjs.csrf-token');

            return response;
        }
    } catch (error) {
        console.error('❌ Failed to terminate all sessions:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
