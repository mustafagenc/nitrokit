import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { endpoint, keys } = body;
        if (!endpoint || !keys?.p256dh || !keys?.auth) {
            return NextResponse.json(
                { success: false, error: 'Eksik parametre.' },
                { status: 400 }
            );
        }
        await prisma.notificationSubscription.upsert({
            where: { endpoint },
            update: { p256dh: keys.p256dh, auth: keys.auth },
            create: { endpoint, p256dh: keys.p256dh, auth: keys.auth },
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ success: false, error: 'Kayıt başarısız.' }, { status: 500 });
    }
}
