import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { InAppNotificationService } from '@/lib/services/inapp-notification-service';
import { logger } from '@/lib/services/logger';
import { normalizeError } from '@/lib/utils/error-handler';
import { setLoggerContextFromRequest } from '@/lib/services/logger/auth-middleware';

export async function GET(request: NextRequest) {
    try {
        await setLoggerContextFromRequest(request);
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
        logger.error('Get notifications error', normalizeError(error));
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

        if (!type || !title || !message) {
            return NextResponse.json(
                { error: 'Type, title, and message are required' },
                { status: 400 }
            );
        }

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
        logger.error('Create notification error', normalizeError(error));
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
