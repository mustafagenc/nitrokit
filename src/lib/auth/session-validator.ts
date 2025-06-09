import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function validateSession(request: NextRequest) {
    try {
        const sessionToken =
            request.cookies.get('authjs.session-token')?.value ||
            request.cookies.get('__Secure-authjs.session-token')?.value;

        if (!sessionToken) {
            return false;
        }

        const sessionExists = await prisma.session.findUnique({
            where: { sessionToken },
        });

        return !!sessionExists;
    } catch (error) {
        console.error('Session validation error:', error);
        return false;
    }
}
