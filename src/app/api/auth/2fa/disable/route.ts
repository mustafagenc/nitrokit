import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { TwoFactorService } from '@/lib/auth/two-factor-service';
import { z } from 'zod';

const disableSchema = z.object({
    token: z.string().length(6),
});

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { token } = disableSchema.parse(body);

        const success = await TwoFactorService.disable(session.user.id, token);

        if (!success) {
            return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ 2FA disable error:', error);
        return NextResponse.json({ error: 'Failed to disable 2FA' }, { status: 500 });
    }
}
