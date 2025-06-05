import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';
import { generateVerificationToken } from '@/lib/tokens';

const registerSchema = z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    password: z
        .string()
        .min(6)
        .max(20)
        .refine(password => /[A-Z]/.test(password), {
            message: 'Password must contain at least one uppercase letter',
        })
        .refine(password => /[a-z]/.test(password), {
            message: 'Password must contain at least one lowercase letter',
        })
        .refine(password => /[0-9]/.test(password), {
            message: 'Password must contain at least one number',
        })
        .refine(password => /[!@#$%^&*]/.test(password), {
            message: 'Password must contain at least one special character',
        }),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = registerSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: 'Invalid input data',
                    details: result.error.errors,
                },
                { status: 400 }
            );
        }

        const { firstName, lastName, email, password } = result.data;
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'A user with this email already exists' },
                { status: 400 }
            );
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const verificationToken = await generateVerificationToken(email.toLowerCase());
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                name: `${firstName} ${lastName}`,
                email: email.toLowerCase(),
                password: hashedPassword,
                role: 'USER',
                isActive: true,
                emailVerified: null,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        try {
            await sendVerificationEmail({
                email: user.email,
                name: user.name || 'User',
                token: verificationToken.token,
            });
        } catch (emailError) {
            await prisma.user.delete({
                where: { id: user.id },
            });
            await prisma.verificationToken.delete({
                where: { token: verificationToken.token },
            });
            return NextResponse.json(
                {
                    error: 'Failed to send verification email. Please try again or contact support.',
                    details:
                        emailError instanceof Error ? emailError.message : 'Email service error',
                },
                { status: 500 }
            );
        }
        return NextResponse.json(
            {
                message:
                    'Account created successfully! Please check your email to verify your account.',
                user: user,
                requiresVerification: true,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('❌ Registration error details:');
        console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
        console.error('Error message:', error instanceof Error ? error.message : error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');

        if (error instanceof Error && error.message.includes('Prisma')) {
            console.error('🗃️ This appears to be a Prisma error');
        }

        return NextResponse.json(
            {
                error: 'Internal server error',
                ...(process.env.NODE_ENV === 'development' && {
                    details: error instanceof Error ? error.message : String(error),
                }),
            },
            { status: 500 }
        );
    }
}
