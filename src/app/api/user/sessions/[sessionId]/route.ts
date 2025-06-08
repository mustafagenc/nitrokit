import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function DELETE(request: NextRequest, { params }: { params: { sessionId: string } }) {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { sessionId } = params;

        // TODO: Implement session termination
        console.log('Terminating session:', sessionId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ Failed to terminate session:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
