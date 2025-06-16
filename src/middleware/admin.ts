import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function adminMiddleware(request: Request) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXT_SECRET,
    });
    if (!token || token.role !== 'Admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
}
