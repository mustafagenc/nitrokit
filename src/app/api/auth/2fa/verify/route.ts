import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { TwoFactorService } from '@/lib/auth/two-factor-service';
import { z } from 'zod';

const verifySchema = z.object({
    token: z.string().min(6),
});

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { token } = verifySchema.parse(body);

        const result = await TwoFactorService.verifyToken(session.user.id, token);

        if (!result.success) {
            return NextResponse.json({ error: result.error || 'Invalid token' }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            backupCodeUsed: result.backupCodeUsed,
        });
    } catch (error) {
        console.error('❌ 2FA verify error:', error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
