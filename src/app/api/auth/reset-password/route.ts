import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { generatePasswordResetToken } from '@/lib/tokens';
import { sendPasswordResetEmail } from '@/lib/notifications/auth-emails';

const resetPasswordSchema = z.object({
    email: z.string().email(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = resetPasswordSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        const { email } = result.data;

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        // Always return success for security (don't reveal if email exists)
        if (!user) {
            return NextResponse.json(
                {
                    message:
                        'If an account with that email exists, we have sent a password reset link.',
                },
                { status: 200 }
            );
        }

        // Generate password reset token
        const resetToken = await generatePasswordResetToken(email.toLowerCase());

        // Send password reset email
        await sendPasswordResetEmail({
            email: user.email,
            name: user.name || 'User',
            token: resetToken.token,
        });

        return NextResponse.json(
            { message: 'Password reset email sent successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            { error: 'Failed to process password reset request' },
            { status: 500 }
        );
    }
}
