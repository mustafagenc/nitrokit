import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'Admin') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { userId } = await params;

        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                phoneVerified: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('[VERIFY_PHONE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
