import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Link } from '@/lib/i18n/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generatePageMetadata } from '@/lib';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Shield,
    Calendar,
    Mail,
    Phone,
    User,
    Key,
    Monitor,
    AlertTriangle,
    CheckCircle,
    Clock,
    Settings,
    Edit,
} from 'lucide-react';
import { getSafeSecurityStatus } from '@/lib/auth/security-status';

export async function generateMetadata(): Promise<Metadata> {
    return await generatePageMetadata({
        params: Promise.resolve({
            title: 'Account Overview',
            description: 'Your account status and overview',
        }),
    });
}

export default async function AccountOverviewPage() {
    const session = await auth();

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
        const activities = [];

        if (user.sessions && user.sessions.length > 0) {
            user.sessions.slice(0, 2).forEach((session, index) => {
                activities.push({
                    id: session.id,
                    type: 'session',
                    title: index === 0 ? 'Current Session' : 'Session Login',
                    description: `Active until ${new Date(session.expires).toLocaleDateString()}`,
                    timestamp: session.createdAt,
                    icon: Monitor,
                    status: index === 0 ? 'active' : 'expires-soon',
                });
            });
        }

        activities.push({
            id: 'account-created',
            type: 'account',
            title: 'Account Created',
            description: 'Welcome to the platform!',
            timestamp: user.createdAt,
            icon: User,
            status: 'completed',
        });

        if (user.emailVerified) {
            activities.push({
                id: 'email-verified',
                type: 'security',
                title: 'Email Verified',
                description: 'Email address confirmed',
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
                title: `${account.provider.charAt(0).toUpperCase() + account.provider.slice(1)} Connected`,
                description: `${account.type} account linked`,
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
                title: 'Verify your email',
                description: 'Secure your account by verifying your email address',
                action: 'Verify Email',
                href: '/dashboard/account/email/verify',
            });
        }

        if (!user.password) {
            recommendations.push({
                type: 'warning',
                title: 'Set account password',
                description: 'Add a password to enable backup login method and enhance security',
                action: 'Set Password',
                href: '/dashboard/account/security/password',
            });
        } else if (securityStatus.passwordStrength === 'weak') {
            recommendations.push({
                type: 'error',
                title: 'Weak password detected',
                description: 'Your password is weak and should be updated',
                action: 'Change Password',
                href: '/dashboard/account/security/password',
            });
        }

        if (!securityStatus.twoFactorEnabled) {
            recommendations.push({
                type: 'warning',
                title: 'Enable two-factor authentication',
                description: 'Add an extra layer of security to your account',
                action: 'Enable 2FA',
                href: '/dashboard/account/security/two-factor',
            });
        }

        if (!user.phoneVerified) {
            recommendations.push({
                type: 'info',
                title: 'Add phone number',
                description: 'Add a phone number for account recovery',
                action: 'Add Phone',
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
                    <h2 className="text-2xl font-bold tracking-tight">Account Overview</h2>
                    <p className="text-muted-foreground">
                        Your account status and security overview at a glance.
                    </p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/dashboard/account/profile">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Link>
                </Button>
            </div>

            {recommendations.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Security Recommendations</h3>
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
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Security Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold">{securityScore}%</div>
                            <p className="text-muted-foreground text-sm">Overall Security</p>
                        </div>
                        <Progress value={securityScore} className="h-2" />
                        <div className="text-center">
                            <Badge
                                variant={
                                    securityScore >= 80
                                        ? 'default'
                                        : securityScore >= 60
                                          ? 'secondary'
                                          : 'destructive'
                                }
                                className={
                                    securityScore >= 80
                                        ? 'bg-green-500 hover:bg-green-600'
                                        : securityScore >= 60
                                          ? 'bg-yellow-500 hover:bg-yellow-600'
                                          : 'bg-red-500 hover:bg-red-600'
                                }
                            >
                                {securityScore >= 80
                                    ? 'Excellent'
                                    : securityScore >= 60
                                      ? 'Good'
                                      : 'Needs Improvement'}
                            </Badge>
                        </div>
                        <Button asChild className="w-full" variant="outline">
                            <Link href="/dashboard/account/security">
                                <Settings className="mr-2 h-4 w-4" />
                                Security Settings
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Account Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Mail className="text-muted-foreground h-4 w-4" />
                                    <span className="text-sm">Email</span>
                                </div>
                                <Badge
                                    variant={user.emailVerified ? 'default' : 'destructive'}
                                    className={
                                        user.emailVerified
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : 'bg-red-500 hover:bg-red-600'
                                    }
                                >
                                    {user.emailVerified ? 'Verified' : 'Unverified'}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Phone className="text-muted-foreground h-4 w-4" />
                                    <span className="text-sm">Phone</span>
                                </div>
                                <Badge
                                    variant={user.phoneVerified ? 'default' : 'secondary'}
                                    className={
                                        user.phoneVerified
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : 'bg-gray-500 hover:bg-gray-600'
                                    }
                                >
                                    {user.phoneVerified ? 'Verified' : 'Not Added'}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Key className="text-muted-foreground h-4 w-4" />
                                    <span className="text-sm">Two-Factor Auth</span>
                                </div>
                                <Badge
                                    variant={
                                        securityStatus.twoFactorEnabled ? 'default' : 'secondary'
                                    }
                                    className={
                                        securityStatus.twoFactorEnabled
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : 'bg-orange-500 hover:bg-orange-600'
                                    }
                                >
                                    {securityStatus.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Shield className="text-muted-foreground h-4 w-4" />
                                    <span className="text-sm">Password</span>
                                </div>
                                <Badge
                                    variant={
                                        !user.password
                                            ? 'destructive'
                                            : securityStatus.passwordStrength === 'strong'
                                              ? 'default'
                                              : securityStatus.passwordStrength === 'medium'
                                                ? 'secondary'
                                                : 'destructive'
                                    }
                                    className={
                                        !user.password
                                            ? 'bg-red-500 hover:bg-red-600'
                                            : securityStatus.passwordStrength === 'strong'
                                              ? 'bg-green-500 hover:bg-green-600'
                                              : securityStatus.passwordStrength === 'medium'
                                                ? 'bg-yellow-500 hover:bg-yellow-600'
                                                : securityStatus.passwordStrength === 'weak'
                                                  ? 'bg-red-500 hover:bg-red-600'
                                                  : 'bg-gray-500 hover:bg-gray-600'
                                    }
                                >
                                    {!user.password
                                        ? 'Not Set'
                                        : securityStatus.passwordStrength === 'strong'
                                          ? 'Strong'
                                          : securityStatus.passwordStrength === 'medium'
                                            ? 'Medium'
                                            : securityStatus.passwordStrength === 'weak'
                                              ? 'Weak'
                                              : 'Unknown'}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Monitor className="text-muted-foreground h-4 w-4" />
                                    <span className="text-sm">Active Sessions</span>
                                </div>
                                <Badge
                                    variant="outline"
                                    className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                >
                                    {securityStatus.activeSessions} Active
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <User className="text-muted-foreground h-4 w-4" />
                                    <span className="text-sm">Account Type</span>
                                </div>
                                <Badge
                                    variant="outline"
                                    className="border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
                                >
                                    {user.role || 'User'}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-muted-foreground text-sm font-medium">
                                Full Name
                            </label>
                            <p className="text-sm">{user.name || 'Not set'}</p>
                        </div>

                        <div>
                            <label className="text-muted-foreground text-sm font-medium">
                                Email Address
                            </label>
                            <p className="text-sm">{user.email}</p>
                        </div>

                        <div>
                            <label className="text-muted-foreground text-sm font-medium">
                                Phone Number
                            </label>
                            <p className="text-sm">{user.phone || 'Not added'}</p>
                        </div>

                        <div>
                            <label className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
                                <Calendar className="h-3 w-3" />
                                Member Since
                            </label>
                            <p className="text-sm">
                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((activity) => {
                                    const IconComponent = activity.icon;
                                    return (
                                        <div
                                            key={activity.id}
                                            className="border-muted flex items-center justify-between border-l-2 py-2 pl-4"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`rounded-full p-2 ${
                                                        activity.status === 'active'
                                                            ? 'bg-green-100 text-green-600'
                                                            : activity.status === 'completed'
                                                              ? 'bg-blue-100 text-blue-600'
                                                              : activity.status === 'expires-soon'
                                                                ? 'bg-yellow-100 text-yellow-600'
                                                                : 'bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    <IconComponent className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {activity.title}
                                                    </p>
                                                    <p className="text-muted-foreground text-xs">
                                                        {activity.description}
                                                    </p>
                                                    <p className="text-muted-foreground text-xs">
                                                        {new Date(
                                                            activity.timestamp
                                                        ).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${
                                                    activity.status === 'active'
                                                        ? 'border-green-200 bg-green-50 text-green-700'
                                                        : activity.status === 'completed'
                                                          ? 'border-blue-200 bg-blue-50 text-blue-700'
                                                          : activity.status === 'expires-soon'
                                                            ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                                                            : 'border-gray-200 bg-gray-50 text-gray-700'
                                                }`}
                                            >
                                                {activity.status === 'active'
                                                    ? 'Active'
                                                    : activity.status === 'completed'
                                                      ? 'Completed'
                                                      : activity.status === 'expires-soon'
                                                        ? 'Expires Soon'
                                                        : 'Unknown'}
                                            </Badge>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-8 text-center">
                                    <Clock className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                                    <p className="text-muted-foreground text-sm">
                                        No recent activity
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="pt-2">
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/dashboard/account/security/sessions">
                                    View All Sessions
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
