import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';
import { getEmailService } from '@/lib/services/email';
import { NewsletterFormSchema } from '@/lib/validations/newsletter';
import { getBaseUrl } from '@/lib/config';
import { render } from '@react-email/render';
import { NewsletterConfirmationEmail } from '@/components/emails/newsletter-confirmation';
import { emailResendRateLimit, getRateLimitHeaders } from '@/lib/security/rate-limit';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const t = (key: string) => key;
        const schema = NewsletterFormSchema(t);
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: parsed.error.errors[0].message },
                { status: 400 }
            );
        }
        const { email } = parsed.data;

        // Rate limit: 3 istek/saat/email
        if (!emailResendRateLimit) {
            return NextResponse.json(
                { success: false, error: 'Rate limit servisi kullanılamıyor.' },
                { status: 500 }
            );
        }
        const rate = await emailResendRateLimit.limit(email);
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

        const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
        if (existing && existing.verified) {
            return NextResponse.json(
                { success: false, error: 'Bu e-posta zaten abone.' },
                { status: 409 }
            );
        }

        const token = randomUUID();
        await prisma.newsletterSubscriber.upsert({
            where: { email },
            update: { token, verified: false },
            create: { email, token },
        });

        const emailService = getEmailService();
        const confirmUrl = `${getBaseUrl()}?newsletter_confirm=${token}`;
        const emailHtml = await render(NewsletterConfirmationEmail({ confirmUrl }));
        await emailService.sendEmail({
            to: email,
            subject: 'Haber Bülteni Aboneliği Onayı',
            html: emailHtml,
            text: `Haber bültenimize abone olmak için şu linke tıklayın: ${confirmUrl}`,
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false, error: 'Bir hata oluştu.' }, { status: 500 });
    }
}
