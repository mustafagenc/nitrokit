import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/notifications/auth-emails';

const sendVerificationSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { email } = sendVerificationSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { id: true, email: true, emailVerified: true, name: true },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (user.email !== email) {
            return NextResponse.json({ message: 'Email address does not match' }, { status: 400 });
        }

        if (user.emailVerified) {
            return NextResponse.json({ message: 'Email already verified' }, { status: 400 });
        }

        const recentEmails = await prisma.verificationToken.count({
            where: {
                identifier: email,
                expires: { gt: new Date(Date.now() - 5 * 60 * 1000) },
            },
        });

        if (recentEmails >= 3) {
            return NextResponse.json(
                { message: 'Too many verification emails sent. Please wait before trying again.' },
                { status: 429 }
            );
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 saat

        await prisma.verificationToken.deleteMany({
            where: { identifier: email },
        });

        const verificationToken = await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires,
            },
        });

        await sendVerificationEmail({
            email: user.email,
            name: user.name || 'User',
            token: verificationToken.token,
        });

        return NextResponse.json({
            message: 'Verification email sent successfully',
            success: true,
        });
    } catch (error) {
        console.error('Send verification email error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
        }

        if (error instanceof Error) {
            if (error.message.includes('Email service')) {
                return NextResponse.json(
                    { message: 'Failed to send email. Please try again later.' },
                    { status: 503 }
                );
            }
        }

        return NextResponse.json({ message: 'Failed to send verification email' }, { status: 500 });
    }
}
