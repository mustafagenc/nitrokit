import { Metadata } from 'next';
import { Link } from '@/lib/i18n/navigation';

import { auth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserSecurityStatus } from '@/lib/auth/security-status';

export const metadata: Metadata = {
    title: 'Security Settings',
    description: 'Manage your account security settings',
};

export default async function SecurityPage() {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    // ✅ Gerçek security status'unu çek
    const securityStatus = await getUserSecurityStatus(session.user.id);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Security</h1>
                    <p className="text-muted-foreground">
                        Manage your password, two-factor authentication, and active sessions
                    </p>
                </div>
            </div>

            {/* Security Navigation Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Password Management */}
                <Link href="/dashboard/account/security/password" className="block">
                    <Card className="cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <svg
                                    className="text-primary h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                                Password
                            </CardTitle>
                            <CardDescription>
                                Change your password and manage password security
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span
                                    className={`text-sm font-medium ${
                                        securityStatus.passwordStrength === 'strong'
                                            ? 'text-green-600'
                                            : securityStatus.passwordStrength === 'medium'
                                              ? 'text-yellow-600'
                                              : 'text-red-600'
                                    }`}
                                >
                                    {securityStatus.passwordStrength === 'strong' && 'Strong'}
                                    {securityStatus.passwordStrength === 'medium' && 'Medium'}
                                    {securityStatus.passwordStrength === 'weak' && 'Weak'}
                                    {securityStatus.passwordStrength === 'unknown' && 'Unknown'}
                                </span>
                                <svg
                                    className="text-muted-foreground h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* Two-Factor Authentication */}
                <Link href="/dashboard/account/security/two-factor" className="block">
                    <Card className="cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <svg
                                    className="text-primary h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                                Two-Factor Authentication
                            </CardTitle>
                            <CardDescription>
                                Add an extra layer of security to your account
                            </CardDescription>
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
                                    {securityStatus.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                </span>
                                <svg
                                    className="text-muted-foreground h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* Session Management */}
                <Link href="/dashboard/account/security/sessions" className="block">
                    <Card className="cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <svg
                                    className="text-primary h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                Active Sessions
                            </CardTitle>
                            <CardDescription>
                                View and manage your active login sessions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-600">
                                    {securityStatus.activeSessions} Active
                                </span>
                                <svg
                                    className="text-muted-foreground h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Security Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <svg
                            className="text-primary h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                        Security Overview
                    </CardTitle>
                    <CardDescription>Current status of your account security</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border p-4 text-center">
                            <div
                                className={`text-2xl font-bold ${
                                    securityStatus.passwordStrength === 'strong'
                                        ? 'text-green-600'
                                        : securityStatus.passwordStrength === 'medium'
                                          ? 'text-yellow-600'
                                          : 'text-red-600'
                                }`}
                            >
                                {securityStatus.passwordStrength === 'strong' && 'Strong'}
                                {securityStatus.passwordStrength === 'medium' && 'Medium'}
                                {securityStatus.passwordStrength === 'weak' && 'Weak'}
                                {securityStatus.passwordStrength === 'unknown' && 'Unknown'}
                            </div>
                            <div className="text-muted-foreground text-sm">Password Strength</div>
                        </div>
                        <div className="rounded-lg border p-4 text-center">
                            <div
                                className={`text-2xl font-bold ${
                                    securityStatus.twoFactorEnabled
                                        ? 'text-green-600'
                                        : 'text-yellow-600'
                                }`}
                            >
                                {securityStatus.twoFactorEnabled ? 'On' : 'Off'}
                            </div>
                            <div className="text-muted-foreground text-sm">Two-Factor Auth</div>
                        </div>
                        <div className="rounded-lg border p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {securityStatus.activeSessions}
                            </div>
                            <div className="text-muted-foreground text-sm">Active Sessions</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
