import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { generatePageMetadata } from '@/lib';
import { SessionsTable } from './components/sessions-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
    return await generatePageMetadata({
        params: Promise.resolve({
            title: 'Active Sessions',
            description: 'Manage your active login sessions and security',
        }),
    });
}

export default async function ActiveSessionsPage() {
    const session = await auth();

    if (!session) {
        redirect('/signin');
    }

    // Get user's active sessions (you'll need to implement session tracking)
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            email: true,
            lastLoginAt: true,
        },
    });

    if (!user) {
        redirect('/signin');
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Active Sessions</h2>
                <p className="text-muted-foreground">
                    Monitor and manage your active login sessions across all devices.
                </p>
            </div>

            <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                    For security reasons, if you see any unfamiliar sessions, terminate them
                    immediately and change your password.
                </AlertDescription>
            </Alert>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Current Sessions
                        </CardTitle>
                        <CardDescription>
                            These are the devices and browsers currently signed into your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SessionsTable userId={user.id} currentSessionId={session.user.id} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            Security Tips
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Secure your account:</h4>
                            <ul className="text-muted-foreground space-y-1 text-sm">
                                <li>• Always sign out when using public computers</li>
                                <li>• Regularly review your active sessions</li>
                                <li>• Enable two-factor authentication for extra security</li>
                                <li>• Use strong, unique passwords</li>
                                <li>
                                    • Sign out of all sessions if you suspect unauthorized access
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
