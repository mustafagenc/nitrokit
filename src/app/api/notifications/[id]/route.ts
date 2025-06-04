import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { NotificationService } from '@/lib/services/notification-service';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { read } = body;

        if (read) {
            await NotificationService.markAsRead(params.id, session.user.id);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update notification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await NotificationService.delete(params.id, session.user.id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete notification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
