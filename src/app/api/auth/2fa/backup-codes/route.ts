import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { TwoFactorService } from '@/lib/auth/two-factor-service';
import { z } from 'zod';

const regenerateSchema = z.object({
    token: z.string().length(6),
});

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { token } = regenerateSchema.parse(body);

        const newCodes = await TwoFactorService.regenerateBackupCodes(session.user.id, token);

        if (!newCodes) {
            return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
        }

        return NextResponse.json({ backupCodes: newCodes });
    } catch (error) {
        console.error('❌ Backup codes regeneration error:', error);
        return NextResponse.json({ error: 'Failed to regenerate backup codes' }, { status: 500 });
    }
}
