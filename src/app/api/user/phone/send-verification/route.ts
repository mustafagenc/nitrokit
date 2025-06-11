import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PhoneVerificationService } from '@/lib/notifications/sms-notifications';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { phoneNumber } = await request.json();

        if (!phoneNumber) {
            return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
        }

        const result = await PhoneVerificationService.sendVerificationCode(
            session.user.id,
            phoneNumber
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error('Send verification API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
