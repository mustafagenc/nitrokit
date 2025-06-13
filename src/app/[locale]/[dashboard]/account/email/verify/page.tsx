import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generatePageMetadata } from '@/lib';
import { EmailVerifyForm } from './components/email-verify-form';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('dashboard.account.email.verify');
    return await generatePageMetadata({
        params: Promise.resolve({
            title: t('page.title'),
            description: t('page.description'),
        }),
    });
}

export default async function EmailVerifyPage() {
    const session = await auth();
    const t = await getTranslations('dashboard.account.email.verify');

    if (!session) {
        redirect('/signin');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            email: true,
            emailVerified: true,
            name: true,
        },
    });

    if (!user) {
        redirect('/signin');
    }

    if (user.emailVerified) {
        redirect('/dashboard/account?message=email-already-verified');
    }

    return (
        <div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{t('page.heading')}</h1>
                <p className="text-muted-foreground mt-2">{t('page.subheading')}</p>
            </div>

            <EmailVerifyForm user={user} />
        </div>
    );
}
