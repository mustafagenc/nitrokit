import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { generatePageMetadata } from '@/lib';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Calendar, Mail, Phone, User, Key } from 'lucide-react';

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

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) {
        redirect('/signin');
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Account Overview</h2>
                <p className="text-muted-foreground">
                    Your account status and basic information at a glance.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Account Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Account Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Mail className="text-muted-foreground h-4 w-4" />
                                <span className="text-sm">Email</span>
                            </div>
                            <Badge variant={user.emailVerified ? 'default' : 'destructive'}>
                                {user.emailVerified ? 'Verified' : 'Unverified'}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Phone className="text-muted-foreground h-4 w-4" />
                                <span className="text-sm">Phone</span>
                            </div>
                            <Badge variant={user.phoneVerified ? 'default' : 'secondary'}>
                                {user.phoneVerified ? 'Verified' : 'Not Added'}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Key className="text-muted-foreground h-4 w-4" />
                                <span className="text-sm">Two-Factor Auth</span>
                            </div>
                            <Badge variant={user.twoFactorEnabled ? 'default' : 'secondary'}>
                                {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <User className="text-muted-foreground h-4 w-4" />
                                <span className="text-sm">Account Type</span>
                            </div>
                            <Badge variant="outline">{user.role}</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Account Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-muted-foreground text-sm font-medium">
                                Name
                            </label>
                            <p className="text-sm">{user.name || 'Not set'}</p>
                        </div>

                        <div>
                            <label className="text-muted-foreground text-sm font-medium">
                                Email
                            </label>
                            <p className="text-sm">{user.email}</p>
                        </div>

                        <div>
                            <label className="text-muted-foreground text-sm font-medium">
                                Phone
                            </label>
                            <p className="text-sm">{user.phone || 'Not added'}</p>
                        </div>

                        <div>
                            <label className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
                                <Calendar className="h-3 w-3" />
                                Member Since
                            </label>
                            <p className="text-sm">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
