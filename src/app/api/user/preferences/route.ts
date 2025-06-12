import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/services/logger';
import { z } from 'zod';

const updatePreferencesSchema = z.object({
    locale: z.string().min(2).max(5).optional(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
});

export async function PUT(req: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    error: 'Authentication required',
                    code: 'UNAUTHORIZED',
                },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { locale, theme } = updatePreferencesSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                locale: true,
                theme: true,
                email: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                {
                    error: 'User not found',
                    code: 'USER_NOT_FOUND',
                },
                { status: 404 }
            );
        }

        const changes = {
            locale: locale && locale !== user.locale,
            theme: theme && theme !== user.theme,
        };

        const updateData: any = {};
        if (locale !== undefined && locale !== user.locale) {
            updateData.locale = locale;
        }
        if (theme !== undefined && theme !== user.theme) {
            updateData.theme = theme;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No changes to update',
                localeChanged: false,
                themeChanged: false,
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
            select: {
                id: true,
                locale: true,
                theme: true,
                email: true,
            },
        });

        logger.info('User preferences updated', {
            userId: session.user.id,
            changes: updateData,
            localeChanged: changes.locale,
            themeChanged: changes.theme,
        });

        return NextResponse.json({
            success: true,
            message: 'Preferences updated successfully',
            user: {
                id: updatedUser.id,
                locale: updatedUser.locale,
                theme: updatedUser.theme,
            },
            localeChanged: changes.locale,
            themeChanged: changes.theme,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: 'Invalid request data',
                    code: 'VALIDATION_ERROR',
                    details: error.errors,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                error: 'Internal server error',
                code: 'INTERNAL_ERROR',
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    error: 'Authentication required',
                    code: 'UNAUTHORIZED',
                },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                locale: true,
                theme: true,
                email: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                {
                    error: 'User not found',
                    code: 'USER_NOT_FOUND',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            preferences: {
                locale: user.locale || 'en',
                theme: user.theme || 'system',
            },
        });
    } catch (error) {
        console.error('Error fetching user preferences:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                code: 'INTERNAL_ERROR',
            },
            { status: 500 }
        );
    }
}
