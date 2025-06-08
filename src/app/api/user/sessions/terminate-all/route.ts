import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log(request);

        // TODO: Implement terminating all other sessions
        console.log('Terminating all other sessions for user:', session.user.id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ Failed to terminate all sessions:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
