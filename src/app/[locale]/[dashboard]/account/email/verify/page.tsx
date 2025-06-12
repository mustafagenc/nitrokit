import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EmailVerifyForm } from './components/email-verify-form';

export const metadata: Metadata = {
    title: 'Verify Email',
    description: 'Verify your email address to secure your account',
};

export default async function EmailVerifyPage() {
    const session = await auth();

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
                <h1 className="text-2xl font-bold tracking-tight">Verify Email Address</h1>
                <p className="text-muted-foreground mt-2">
                    We need to verify your email address to secure your account and enable all
                    features.
                </p>
            </div>

            <EmailVerifyForm user={user} />
        </div>
    );
}
