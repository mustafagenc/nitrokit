import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { NotificationService } from '@/lib/services/notification-service';

export async function POST() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await NotificationService.markAllAsRead(session.user.id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Mark all read error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
