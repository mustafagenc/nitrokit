import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function validateSession(request: NextRequest) {
    try {
        const sessionToken =
            request.cookies.get('authjs.session-token')?.value ||
            request.cookies.get('__Secure-authjs.session-token')?.value ||
            request.cookies.get('next-auth.session-token')?.value ||
            request.cookies.get('__Secure-next-auth.session-token')?.value;

        if (!sessionToken) {
            console.log('No session token found in cookies');
            return false;
        }

        const sessionExists = await prisma.session.findUnique({
            where: { sessionToken },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        isActive: true,
                    },
                },
            },
        });

        if (!sessionExists || !sessionExists.user?.isActive) {
            console.log('Session not found or user not active');
            return false;
        }

        if (sessionExists.expires < new Date()) {
            console.log('Session expired');
            return false;
        }

        return true;
    } catch (error) {
        console.error('Session validation error:', error);
        return false;
    }
}
