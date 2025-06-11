import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateNotificationPreferencesSchema = z.object({
    // Email notifications
    emailAccountSecurity: z.boolean(),
    emailLoginAlerts: z.boolean(),
    emailPasswordChanges: z.boolean(),
    emailProfileUpdates: z.boolean(),
    emailMarketing: z.boolean(),
    emailNewsletters: z.boolean(),
    // SMS notifications
    smsAccountSecurity: z.boolean(),
    smsLoginAlerts: z.boolean(),
    smsPasswordChanges: z.boolean(),
    smsProfileUpdates: z.boolean(),
    smsMarketing: z.boolean(),
    // App notifications
    appAccountSecurity: z.boolean(),
    appLoginAlerts: z.boolean(),
    appPasswordChanges: z.boolean(),
    appProfileUpdates: z.boolean(),
    appSystemUpdates: z.boolean(),
    appMarketing: z.boolean(),
});

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const preferences = await prisma.notificationPreferences.findUnique({
            where: { userId: session.user.id },
        });

        if (!preferences) {
            // Create default preferences
            const newPreferences = await prisma.notificationPreferences.create({
                data: { userId: session.user.id },
            });
            return NextResponse.json(newPreferences);
        }

        return NextResponse.json(preferences);
    } catch (error) {
        console.error('Get notification preferences error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const validatedData = updateNotificationPreferencesSchema.parse(body);

        const updatedPreferences = await prisma.notificationPreferences.upsert({
            where: { userId: session.user.id },
            update: validatedData,
            create: {
                userId: session.user.id,
                ...validatedData,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Notification preferences updated successfully',
            preferences: updatedPreferences,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Update notification preferences error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
