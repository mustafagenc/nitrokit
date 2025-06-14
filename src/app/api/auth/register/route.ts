import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { generateVerificationToken } from '@/lib/auth/tokens';
import { sendVerificationEmail, sendWelcomeEmail } from '@/lib/notifications/auth-emails';
import {
    clearLoggerContext,
    setLoggerContextFromRequest,
} from '@/lib/services/logger/auth-middleware';
import { logger } from '@/lib/services/logger';

const registerSchema = z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    password: z
        .string()
        .min(6)
        .max(20)
        .refine((password) => /[A-Z]/.test(password), {
            message: 'Password must contain at least one uppercase letter',
        })
        .refine((password) => /[a-z]/.test(password), {
            message: 'Password must contain at least one lowercase letter',
        })
        .refine((password) => /[0-9]/.test(password), {
            message: 'Password must contain at least one number',
        })
        .refine((password) => /[!@#$%^&*]/.test(password), {
            message: 'Password must contain at least one special character',
        }),
    receiveUpdates: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
    try {
        await setLoggerContextFromRequest(request);

        const body = await request.json();
        const result = registerSchema.safeParse(body);

        if (!result.success) {
            const validationErrors = result.error.errors.reduce(
                (acc, err) => {
                    const field = err.path.join('.');
                    acc[field] = err.message;
                    return acc;
                },
                {} as Record<string, string>
            );

            logger.warn('Invalid registration data provided', {
                ...validationErrors,
                action: 'validation_failed',
                errorCount: result.error.errors.length,
                fields: result.error.errors.map((err) => err.path.join('.')).join(', '),
            });

            return NextResponse.json(
                {
                    error: 'Invalid input data',
                    details: result.error.errors,
                },
                { status: 400 }
            );
        }

        const { firstName, lastName, email, password, receiveUpdates } = result.data;
        const normalizedEmail = email.toLowerCase();

        logger.info('Registration data validated successfully', {
            email: email.split('@')[0] + '@***',
            hasFirstName: !!firstName,
            hasLastName: !!lastName,
            passwordLength: password.length,
            receiveUpdates: receiveUpdates,
        });

        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            logger.warn('Registration attempt with existing email', {
                email: email.split('@')[0] + '@***',
                existingUserId: existingUser.id,
                action: 'duplicate_email_attempt',
            });

            logger.logSecurityEvent('duplicate_registration_attempt', {
                severity: 'low',
                email: email.split('@')[0] + '@***',
                ip: logger.getContext().ip,
                userAgent: logger.getContext().userAgent,
            });

            return NextResponse.json(
                { error: 'A user with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        logger.debug('Hashing password', {
            action: 'password_hashing',
        });

        const hashedPassword = await bcrypt.hash(password, 12);

        // Generate verification token
        const verificationToken = await generateVerificationToken(normalizedEmail);

        logger.info('Verification token generated', {
            tokenLength: verificationToken.token.length,
            expiresAt: verificationToken.expires.toISOString(),
        });

        // Create user
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                name: `${firstName} ${lastName}`,
                email: normalizedEmail,
                password: hashedPassword,
                role: 'User',
                isActive: true,
                emailVerified: null,
                receiveUpdates: receiveUpdates,
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
                receiveUpdates: true,
            },
        });

        // Set user context for logging
        logger.setUserId(user.id);

        logger.info('User created successfully', {
            userId: user.id,
            email: email.split('@')[0] + '@***',
            name: user.name,
            action: 'user_created',
        });

        // Log user action
        logger.logUserAction('user_registered', 'auth', {
            email: email.split('@')[0] + '@***',
            firstName,
            lastName,
            registrationMethod: 'email',
        });

        // Send verification email
        try {
            logger.info('Sending verification email', {
                action: 'send_verification_email',
            });

            const emailResult = await sendVerificationEmail({
                email: user.email,
                name: user.name || 'User',
                token: verificationToken.token,
                userId: user.id,
            });

            logger.info('Verification email sent successfully', {
                messageId: emailResult.id,
                action: 'verification_email_sent',
            });

            // Send welcome email asynchronously (non-blocking)
            sendWelcomeEmail({
                email: user.email,
                name: user.name || 'User',
                userId: user.id,
            }).catch((error) => {
                // Welcome email failure shouldn't block registration
                logger.warn('Welcome email failed but registration succeeded', {
                    error: error instanceof Error ? error.message : 'Unknown error',
                    userId: user.id,
                    action: 'welcome_email_failed',
                });
            });
        } catch (emailError) {
            logger.error(
                'Verification email failed to send',
                emailError instanceof Error ? emailError : undefined,
                {
                    userId: user.id,
                    email: email.split('@')[0] + '@***',
                    action: 'verification_email_failed',
                }
            );

            // Rollback user creation if verification email fails
            try {
                await Promise.all([
                    prisma.user.delete({
                        where: { id: user.id },
                    }),
                    prisma.verificationToken.delete({
                        where: { token: verificationToken.token },
                    }),
                ]);

                logger.info('User and token deleted due to email failure', {
                    userId: user.id,
                    action: 'registration_rollback',
                });
            } catch (cleanupError) {
                logger.error(
                    'Failed to cleanup after email error',
                    cleanupError instanceof Error ? cleanupError : undefined,
                    {
                        userId: user.id,
                        originalEmailError:
                            emailError instanceof Error ? emailError.message : 'Unknown',
                    }
                );
            }

            return NextResponse.json(
                {
                    error: 'Failed to send verification email. Please try again or contact support.',
                    details:
                        emailError instanceof Error ? emailError.message : 'Email service error',
                },
                { status: 500 }
            );
        }

        logger.info('User registration completed successfully', {
            userId: user.id,
            email: email.split('@')[0] + '@***',
            action: 'registration_completed',
        });

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
        logger.error('User registration error', error instanceof Error ? error : undefined, {
            action: 'registration_error',
            errorType: error instanceof Error ? error.name : 'Unknown',
        });

        // Enhanced error logging for development
        if (process.env.NODE_ENV === 'development') {
            logger.debug('Detailed registration error', {
                errorName: error instanceof Error ? error.name : 'Unknown',
                errorMessage: error instanceof Error ? error.message : String(error),
                errorStack: error instanceof Error ? error.stack : 'No stack',
                isPrismaError: error instanceof Error && error.message.includes('Prisma'),
            });
        }

        // Log security event for registration errors
        logger.logSecurityEvent('registration_error', {
            severity: 'medium',
            errorType: error instanceof Error ? error.name : 'Unknown',
            ip: logger.getContext().ip,
            userAgent: logger.getContext().userAgent,
        });

        return NextResponse.json(
            {
                error: 'Internal server error',
                ...(process.env.NODE_ENV === 'development' && {
                    details: error instanceof Error ? error.message : String(error),
                }),
            },
            { status: 500 }
        );
    } finally {
        clearLoggerContext();
    }
}
