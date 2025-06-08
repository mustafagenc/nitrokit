import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { TwoFactorService } from '@/lib/auth/two-factor-service';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const status = await TwoFactorService.getStatus(session.user.id);
        return NextResponse.json(status);
    } catch (error) {
        console.error('❌ 2FA status error:', error);
        return NextResponse.json({ error: 'Failed to get 2FA status' }, { status: 500 });
    }
}
