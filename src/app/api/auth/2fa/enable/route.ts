import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { TwoFactorService } from '@/lib/auth/two-factor-service';
import { z } from 'zod';

const enableSchema = z.object({
    secret: z.string(),
    token: z.string().length(6),
    backupCodes: z.array(z.string()),
});

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { secret, token, backupCodes } = enableSchema.parse(body);

        const success = await TwoFactorService.enable(session.user.id, secret, token, backupCodes);

        if (!success) {
            return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid data', details: error.errors },
                { status: 400 }
            );
        }

        console.error('❌ 2FA enable error:', error);
        return NextResponse.json({ error: 'Failed to enable 2FA' }, { status: 500 });
    }
}
