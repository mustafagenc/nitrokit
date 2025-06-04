import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PhoneVerificationService } from '@/lib/services/phone-verification-service';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { phoneNumber, code } = await request.json();

        if (!phoneNumber || !code) {
            return NextResponse.json(
                { error: 'Phone number and code are required' },
                { status: 400 }
            );
        }

        const result = await PhoneVerificationService.verifyCode(
            session.user.id,
            phoneNumber,
            code
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error('Verify code API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
