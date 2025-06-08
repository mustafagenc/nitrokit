import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { TwoFactorService } from '@/lib/auth/two-factor-service';

export async function POST() {
    try {
        const session = await auth();
        if (!session?.user?.id || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const setup = await TwoFactorService.generateSetup(session.user.id, session.user.email);

        return NextResponse.json(setup);
    } catch (error) {
        console.error('❌ 2FA setup error:', error);
        return NextResponse.json({ error: 'Failed to setup 2FA' }, { status: 500 });
    }
}
