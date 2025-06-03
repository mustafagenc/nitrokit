import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { verifyPasswordResetToken } from '@/lib/tokens';

const confirmResetSchema = z.object({
    token: z.string(),
    password: z.string().min(8),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = confirmResetSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }

        const { token, password } = result.data;

        // Verify token
        const verification = await verifyPasswordResetToken(token);

        if (!verification.valid) {
            return NextResponse.json(
                { error: verification.error || 'Invalid or expired token' },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update user password
        await prisma.user.update({
            where: { email: verification.email },
            data: {
                password: hashedPassword,
                // Reset email verification if needed
                emailVerified: new Date(),
            },
        });

        // Delete the reset token
        await prisma.passwordResetToken.delete({
            where: { token },
        });

        return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
    } catch (error) {
        console.error('Password reset confirm error:', error);
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }
}
