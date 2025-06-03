import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';
import { generateVerificationToken } from '@/lib/tokens';
import { emailResendRateLimit } from '@/lib/ratelimit';

const resendSchema = z.object({
    email: z.string().email(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = resendSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        const { email } = result.data;

        if (!emailResendRateLimit) {
            return NextResponse.json(
                { error: 'Internal server error: Rate limit service unavailable' },
                { status: 500 }
            );
        }

        const { success, limit, remaining, reset } = await emailResendRateLimit.limit(email);

        if (!success) {
            return NextResponse.json(
                {
                    error: `Too many resend attempts. Try again after ${new Date(reset).toLocaleTimeString()}`,
                    rateLimit: {
                        limit,
                        remaining: 0,
                        reset: new Date(reset).toISOString(),
                    },
                },
                { status: 429 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.emailVerified) {
            return NextResponse.json({ error: 'Email already verified' }, { status: 400 });
        }

        const verificationToken = await generateVerificationToken(email.toLowerCase());

        await sendVerificationEmail({
            email: user.email,
            name: user.name || 'User',
            token: verificationToken.token,
        });

        return NextResponse.json(
            {
                message: 'Verification email sent successfully',
                rateLimit: {
                    limit,
                    remaining: remaining - 1,
                    reset: new Date(reset).toISOString(),
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Resend verification error:', error);
        return NextResponse.json({ error: 'Failed to resend verification email' }, { status: 500 });
    }
}
