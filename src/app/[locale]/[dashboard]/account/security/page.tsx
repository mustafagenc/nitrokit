import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import { auth } from '@/lib/auth';
import { generatePageMetadata } from '@/lib';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserSecurityStatus } from '@/lib/auth/security-status';
import { Shield, Lock, Monitor, BarChart3, ChevronRight } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('dashboard.account.security');
    return await generatePageMetadata({
        params: Promise.resolve({
            title: t('page.title'),
            description: t('page.description'),
        }),
    });
}

export default async function SecurityPage() {
    const session = await auth();
    const t = await getTranslations('dashboard.account.security');

    if (!session?.user) {
        redirect('/signin');
    }

    const securityStatus = await getUserSecurityStatus(session.user.id);

    const getPasswordStrengthText = (strength: string) => {
        switch (strength) {
            case 'strong':
                return t('passwordStrength.strong');
            case 'medium':
                return t('passwordStrength.medium');
            case 'weak':
                return t('passwordStrength.weak');
            default:
                return t('passwordStrength.unknown');
        }
    };

    const getPasswordStrengthColor = (strength: string) => {
        switch (strength) {
            case 'strong':
                return 'text-green-600';
            case 'medium':
                return 'text-yellow-600';
            case 'weak':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('page.heading')}</h1>
                    <p className="text-muted-foreground">{t('page.subheading')}</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/dashboard/account/security/password" className="block">
                    <Card className="cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="text-primary h-5 w-5" />
                                {t('cards.password.title')}
                            </CardTitle>
                            <CardDescription>{t('cards.password.description')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span
                                    className={`text-sm font-medium ${getPasswordStrengthColor(
                                        securityStatus.passwordStrength
                                    )}`}
                                >
                                    {getPasswordStrengthText(securityStatus.passwordStrength)}
                                </span>
                                <ChevronRight className="text-muted-foreground h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/account/security/two-factor" className="block">
                    <Card className="cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="text-primary h-5 w-5" />
                                {t('cards.twoFactor.title')}
                            </CardTitle>
                            <CardDescription>{t('cards.twoFactor.description')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span
                                    className={`text-sm font-medium ${
                                        securityStatus.twoFactorEnabled
                                            ? 'text-green-600'
                                            : 'text-yellow-600'
                                    }`}
                                >
                                    {securityStatus.twoFactorEnabled
                                        ? t('status.enabled')
                                        : t('status.disabled')}
                                </span>
                                <ChevronRight className="text-muted-foreground h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/account/security/sessions" className="block">
                    <Card className="cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Monitor className="text-primary h-5 w-5" />
                                {t('cards.sessions.title')}
                            </CardTitle>
                            <CardDescription>{t('cards.sessions.description')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-600">
                                    {t('cards.sessions.activeCount', {
                                        count: securityStatus.activeSessions,
                                    })}
                                </span>
                                <ChevronRight className="text-muted-foreground h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="text-primary h-5 w-5" />
                        {t('overview.title')}
                    </CardTitle>
                    <CardDescription>{t('overview.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border p-4 text-center">
                            <div
                                className={`text-2xl font-bold ${getPasswordStrengthColor(
                                    securityStatus.passwordStrength
                                )}`}
                            >
                                {getPasswordStrengthText(securityStatus.passwordStrength)}
                            </div>
                            <div className="text-muted-foreground text-sm">
                                {t('overview.metrics.passwordStrength')}
                            </div>
                        </div>
                        <div className="rounded-lg border p-4 text-center">
                            <div
                                className={`text-2xl font-bold ${
                                    securityStatus.twoFactorEnabled
                                        ? 'text-green-600'
                                        : 'text-yellow-600'
                                }`}
                            >
                                {securityStatus.twoFactorEnabled
                                    ? t('overview.metrics.twoFactorOn')
                                    : t('overview.metrics.twoFactorOff')}
                            </div>
                            <div className="text-muted-foreground text-sm">
                                {t('overview.metrics.twoFactorAuth')}
                            </div>
                        </div>
                        <div className="rounded-lg border p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {securityStatus.activeSessions}
                            </div>
                            <div className="text-muted-foreground text-sm">
                                {t('overview.metrics.activeSessions')}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
