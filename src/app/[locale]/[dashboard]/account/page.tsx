import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generatePageMetadata } from '@/lib';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, User, Monitor, AlertTriangle, CheckCircle, Edit } from 'lucide-react';
import { getSafeSecurityStatus } from '@/lib/auth/security-status';
import { SecurityScoreCard } from './components/security-score-card';
import { AccountStatusCard } from './components/account-status-card';
import { PersonalInfoCard } from './components/personal-information-card';
import { RecentActivityCard } from './components/recent-activity-card';
import { UserActivity } from '@/types/activity';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('dashboard.account.overview');
    return await generatePageMetadata({
        params: Promise.resolve({
            title: t('title'),
            description: t('description'),
        }),
    });
}

export default async function AccountOverviewPage() {
    const session = await auth();
    const t = await getTranslations('dashboard.account');

    if (!session) {
        redirect('/signin');
    }

    const [user, securityStatus] = await Promise.all([
        prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                accounts: {
                    select: {
                        provider: true,
                        type: true,
                        createdAt: true,
                    },
                },
                sessions: {
                    where: {
                        expires: {
                            gt: new Date(),
                        },
                    },
                    select: {
                        id: true,
                        expires: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        }),
        getSafeSecurityStatus(session.user.id),
    ]);

    if (!user) {
        redirect('/signin');
    }

    const getRecentActivity = () => {
        const activities: UserActivity[] = [];

        if (user.sessions && user.sessions.length > 0) {
            user.sessions.slice(0, 2).forEach((session, index) => {
                activities.push({
                    id: session.id,
                    type: 'session',
                    title:
                        index === 0
                            ? t('recentActivity.currentSession')
                            : t('recentActivity.sessionLogin'),
                    description: t('recentActivity.activeTill', {
                        date: new Date(session.expires).toLocaleDateString(),
                    }),
                    timestamp: session.createdAt,
                    icon: Monitor,
                    status: index === 0 ? 'active' : 'expires-soon',
                });
            });
        }

        activities.push({
            id: 'account-created',
            type: 'account',
            title: t('recentActivity.accountCreated'),
            description: t('recentActivity.welcome'),
            timestamp: user.createdAt,
            icon: User,
            status: 'completed',
        });

        if (user.emailVerified) {
            activities.push({
                id: 'email-verified',
                type: 'security',
                title: t('recentActivity.emailVerified'),
                description: t('recentActivity.emailConfirmed'),
                timestamp: user.emailVerified,
                icon: Mail,
                status: 'completed',
            });
        }

        if (user.accounts.length > 0) {
            const account = user.accounts[0];
            activities.push({
                id: 'account-0',
                type: 'connection',
                title: t('recentActivity.connectedProvider', {
                    provider: account.provider.charAt(0).toUpperCase() + account.provider.slice(1),
                }),
                description: t('recentActivity.accountLinked', { type: account.type }),
                timestamp: account.createdAt,
                icon: CheckCircle,
                status: 'completed',
            });
        }

        return activities
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 3);
    };

    const recentActivity = getRecentActivity();

    const calculateSecurityScore = () => {
        let score = 0;
        const maxScore = 100;

        if (user.emailVerified) score += 25;

        if (!user.password) {
            score += 0;
        } else if (securityStatus.passwordStrength === 'strong') {
            score += 30;
        } else if (securityStatus.passwordStrength === 'medium') {
            score += 20;
        } else if (securityStatus.passwordStrength === 'weak') {
            score += 10;
        }

        if (securityStatus.twoFactorEnabled) score += 25;

        if (user.phoneVerified) score += 10;

        if (securityStatus.activeSessions <= 3) score += 10;

        return Math.min(score, maxScore);
    };

    const securityScore = calculateSecurityScore();

    const getSecurityRecommendations = () => {
        const recommendations = [];

        if (!user.emailVerified) {
            recommendations.push({
                type: 'warning',
                title: t('security.recommendations.verifyEmail.title'),
                description: t('security.recommendations.verifyEmail.description'),
                action: t('security.recommendations.verifyEmail.action'),
                href: '/dashboard/account/email/verify',
            });
        }

        if (!user.password) {
            recommendations.push({
                type: 'warning',
                title: t('security.recommendations.setPassword.title'),
                description: t('security.recommendations.setPassword.description'),
                action: t('security.recommendations.setPassword.action'),
                href: '/dashboard/account/security/password',
            });
        } else if (securityStatus.passwordStrength === 'weak') {
            recommendations.push({
                type: 'error',
                title: t('security.recommendations.weakPassword.title'),
                description: t('security.recommendations.weakPassword.description'),
                action: t('security.recommendations.weakPassword.action'),
                href: '/dashboard/account/security/password',
            });
        }

        if (!securityStatus.twoFactorEnabled) {
            recommendations.push({
                type: 'warning',
                title: t('security.recommendations.enableTwoFactor.title'),
                description: t('security.recommendations.enableTwoFactor.description'),
                action: t('security.recommendations.enableTwoFactor.action'),
                href: '/dashboard/account/security/two-factor',
            });
        }

        if (!user.phoneVerified) {
            recommendations.push({
                type: 'info',
                title: t('security.recommendations.addPhone.title'),
                description: t('security.recommendations.addPhone.description'),
                action: t('security.recommendations.addPhone.action'),
                href: '/dashboard/account/profile',
            });
        }

        return recommendations;
    };

    const recommendations = getSecurityRecommendations();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{t('overview.title')}</h2>
                    <p className="text-muted-foreground">{t('overview.description')}</p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/dashboard/account/profile">
                        <Edit className="mr-2 h-4 w-4" />
                        {t('overview.editProfile')}
                    </Link>
                </Button>
            </div>

            {recommendations.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold">{t('security.recommendations.title')}</h3>
                    {recommendations.map((rec, index) => (
                        <Alert
                            key={index}
                            variant={rec.type === 'error' ? 'destructive' : 'default'}
                        >
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="flex items-center justify-between">
                                <div>
                                    <strong>{rec.title}</strong>
                                    <p className="mt-1 text-sm">{rec.description}</p>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href={rec.href}>{rec.action}</Link>
                                </Button>
                            </AlertDescription>
                        </Alert>
                    ))}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                <SecurityScoreCard securityScore={securityScore} />
                <AccountStatusCard
                    user={{
                        emailVerified: user.emailVerified,
                        phoneVerified: user.phoneVerified,
                        password: user.password,
                        role: user.role,
                    }}
                    securityStatus={securityStatus}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <PersonalInfoCard user={user} />
                <RecentActivityCard activities={recentActivity} />
            </div>
        </div>
    );
}
