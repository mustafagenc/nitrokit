import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiRateLimit, getRateLimitHeaders } from '@/lib/security/rate-limit';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.json({ success: false, error: 'Token bulunamadı.' }, { status: 400 });
    }

    // Rate limit: 10 istek/saat/token
    if (!apiRateLimit) {
        return NextResponse.json(
            { success: false, error: 'Rate limit servisi kullanılamıyor.' },
            { status: 500 }
        );
    }
    const rate = await apiRateLimit.limit(`newsletter-confirm-${token}`);
    if (!rate.success) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                error: 'Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.',
            }),
            {
                status: 429,
                headers: getRateLimitHeaders(rate),
            }
        );
    }

    const subscriber = await prisma.newsletterSubscriber.findFirst({ where: { token } });
    if (!subscriber) {
        return NextResponse.json(
            { success: false, error: 'Geçersiz veya süresi dolmuş bağlantı.' },
            { status: 404 }
        );
    }

    if (subscriber.verified) {
        return NextResponse.json({ success: true, message: 'Abonelik zaten onaylanmış.' });
    }

    await prisma.newsletterSubscriber.update({
        where: { id: subscriber.id },
        data: { verified: true, verifiedAt: new Date(), token: null },
    });

    return NextResponse.json({ success: true, message: 'Aboneliğiniz başarıyla onaylandı!' });
}
