import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'Admin') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { userId } = await params;

        if (userId === session.user.id) {
            return new NextResponse('Cannot delete yourself', { status: 400 });
        }

        await prisma.user.delete({
            where: {
                id: userId,
            },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('[DELETE_USER]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'Admin') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { userId } = await params;
        const body = await request.json();
        const { firstName, lastName, email, role, phone } = body;

        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                firstName,
                lastName,
                email,
                role,
                phone,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('[UPDATE_USER]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
