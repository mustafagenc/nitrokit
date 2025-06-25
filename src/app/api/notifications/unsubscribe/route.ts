import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { endpoint } = body;
        if (!endpoint) {
            return NextResponse.json(
                { success: false, error: 'Eksik parametre.' },
                { status: 400 }
            );
        }
        await prisma.notificationSubscription.deleteMany({ where: { endpoint } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        return NextResponse.json({ success: false, error: 'Silme başarısız.' }, { status: 500 });
    }
}
