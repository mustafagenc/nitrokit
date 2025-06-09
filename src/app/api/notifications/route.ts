import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { InAppNotificationService } from '@/lib/services/inapp-notification-service';
import { logger } from '@/lib/logger';
import { normalizeError } from '@/lib';
import { setLoggerContextFromRequest } from '@/lib/logger/auth-middleware';

export async function GET(request: NextRequest) {
    try {
        await setLoggerContextFromRequest(request);
        const session = await auth();

        if (!session?.user?.id) {
            logger.warn('Unauthorized access attempt to notifications API');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const unreadOnly = searchParams.get('unreadOnly') === 'true';
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');

        logger.logUserAction('fetch_notifications', 'notifications', {
            unreadOnly,
            limit,
            offset,
        });

        const notifications = await InAppNotificationService.getByUserId(session.user.id, {
            unreadOnly,
            limit,
            offset,
        });

        const unreadCount = await InAppNotificationService.getUnreadCount(session.user.id);

        logger.info('Notifications fetched successfully', {
            count: notifications.length,
            unreadCount,
        });

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
            logger.warn('Unauthorized attempt to create notification');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { type, title, message, data } = body;

        if (!type || !title || !message) {
            logger.warn('Invalid notification creation request', {
                missingFields: { type: !type, title: !title, message: !message },
            });
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

        logger.logUserAction('create_notification', notification.id, {
            type,
            title,
            hasData: !!data,
        });

        logger.info('Notification created successfully', {
            notificationId: notification.id,
            type,
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
