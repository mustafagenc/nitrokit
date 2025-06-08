import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { InAppNotificationService } from '@/lib/services/inapp-notification-service';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const unreadOnly = searchParams.get('unreadOnly') === 'true';
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');

        const notifications = await InAppNotificationService.getByUserId(session.user.id, {
            unreadOnly,
            limit,
            offset,
        });

        const unreadCount = await InAppNotificationService.getUnreadCount(session.user.id);

        return NextResponse.json({
            notifications,
            unreadCount,
            hasMore: notifications.length === limit,
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { type, title, message, data } = body;

        // Validation
        if (!type || !title || !message) {
            return NextResponse.json(
                { error: 'Type, title, and message are required' },
                { status: 400 }
            );
        }

        // Create notification
        const notification = await InAppNotificationService.create({
            userId: session.user.id,
            type,
            title,
            message,
            data: data || {},
        });

        return NextResponse.json({
            success: true,
            notification,
        });
    } catch (error) {
        console.error('Create notification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
