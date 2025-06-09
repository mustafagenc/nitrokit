import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/tokens';
import { sendWelcomeEmail } from '@/lib/notifications/auth-emails';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.json({ error: 'Missing verification token' }, { status: 400 });
    }

    try {
        const verification = await verifyToken(token);

        if (!verification.valid) {
            return NextResponse.json({ error: verification.error }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { email: verification.email },
            data: {
                emailVerified: new Date(),
                isActive: true,
            },
        });

        await prisma.verificationToken.delete({
            where: { token },
        });

        try {
            await sendWelcomeEmail({
                email: user.email,
                name: user.name || 'User',
            });
        } catch (welcomeError) {
            console.error('⚠️ Welcome email failed (continuing):', welcomeError);
        }

        return NextResponse.redirect(new URL('/email-verified', request.url));
    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
