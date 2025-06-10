import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PhoneVerificationService } from '@/lib/notifications/sms-notifications';
import { logger } from '@/lib/services/logger';
import {
    setLoggerContextFromRequest,
    clearLoggerContext,
} from '@/lib/services/logger/auth-middleware';
import { normalizeError } from '@/utils/error-handler';

export async function POST(request: NextRequest) {
    try {
        await setLoggerContextFromRequest(request);

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

        logger.info('Verifying phone code', {
            userId: session.user.id,
            phoneNumber: phoneNumber.substring(0, 3) + '***',
            codeLength: code.length,
        });

        const result = await PhoneVerificationService.verifyCode(
            session.user.id,
            phoneNumber,
            code
        );

        logger.info('Phone verification result', {
            userId: session.user.id,
            success: result.success,
            message: result.message,
        });

        return NextResponse.json(result);
    } catch (error) {
        logger.error('Phone verification API error', normalizeError(error));
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
            },
            { status: 500 }
        );
    } finally {
        clearLoggerContext();
    }
}
