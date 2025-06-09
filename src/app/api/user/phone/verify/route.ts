import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PhoneVerificationService } from '@/lib/notifications/sms-notifications';
import { logger } from '@/lib/services/logger';
import {
    setLoggerContextFromRequest,
    clearLoggerContext,
} from '@/lib/services/logger/auth-middleware';

export async function POST(request: NextRequest) {
    try {
        await setLoggerContextFromRequest(request);

        const session = await auth();
        if (!session?.user?.id) {
            logger.warn('Unauthorized phone verification attempt');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { phoneNumber, code, action } = await request.json();

        if (action === 'send') {
            if (!phoneNumber) {
                logger.warn('Phone verification request missing phone number');
                return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
            }

            const result = await PhoneVerificationService.sendVerificationCode(
                session.user.id,
                phoneNumber
            );

            logger.logUserAction('request_phone_verification', 'auth', {
                success: result.success,
                phoneNumber: phoneNumber.slice(-4),
            });

            return NextResponse.json(result);
        }

        if (action === 'verify') {
            if (!phoneNumber || !code) {
                logger.warn('Phone verification missing required fields');
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

            logger.logUserAction('verify_phone_code', 'auth', {
                success: result.success,
                verified: result.verified,
                phoneNumber: phoneNumber.slice(-4),
            });

            return NextResponse.json(result);
        }

        logger.warn('Invalid phone verification action', { action });
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        logger.error('Phone verification API error', error instanceof Error ? error : undefined);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        clearLoggerContext();
    }
}
