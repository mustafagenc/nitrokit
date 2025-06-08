import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log(request);

        // TODO: Implement actual session tracking
        // For now, return mock data
        const sessions = [
            {
                id: '1',
                deviceType: 'desktop',
                browser: 'Chrome 120',
                os: 'macOS',
                location: 'Istanbul, Turkey',
                ipAddress: '192.168.1.100',
                lastActive: new Date(),
                isCurrent: true,
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            },
        ];

        return NextResponse.json({ sessions });
    } catch (error) {
        console.error('❌ Failed to fetch sessions:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
