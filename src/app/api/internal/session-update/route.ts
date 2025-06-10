import { NextRequest, NextResponse } from 'next/server';
import { updateSessionInfo } from '@/lib/auth/session-tracking';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { sessionToken, userAgent, ip } = body;

        if (!sessionToken) {
            return NextResponse.json({ error: 'Missing session token' }, { status: 400 });
        }

        const fakeRequest = {
            headers: {
                get: (name: string) => {
                    switch (name) {
                        case 'user-agent':
                            return userAgent;
                        case 'x-forwarded-for':
                        case 'x-real-ip':
                            return ip;
                        default:
                            return null;
                    }
                },
            },
        } as NextRequest;

        await updateSessionInfo(sessionToken, fakeRequest);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Session update error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
