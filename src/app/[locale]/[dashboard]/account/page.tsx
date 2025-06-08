import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { generatePageMetadata } from '@/lib';
import { ProfileForm } from './components/profile-form';
import { PasswordForm } from './components/password-form';
import { DeleteAccountForm } from './components/delete-account-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Calendar } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
    return await generatePageMetadata({
        params: Promise.resolve({
            title: 'Account Settings',
            description: 'Manage your account information and preferences',
        }),
    });
}

export default async function AccountPage() {
    const session = await auth();

    if (!session) {
        redirect('/signin');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            email: true,
            name: true,
            firstName: true,
            lastName: true,
            image: true,
            phone: true,
            phoneVerified: true,
            emailVerified: true,
            role: true,
            password: true,
            createdAt: true,
            updatedAt: true,
            isActive: true,
        },
    });

    if (!user) {
        redirect('/signin');
    }

    return (
        <div className="container mx-auto max-w-4xl space-y-8 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Account Overview
                    </CardTitle>
                    <CardDescription>Your account status and basic information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <div className="text-muted-foreground text-sm">Email Status</div>
                            <Badge variant={user.emailVerified ? 'default' : 'secondary'}>
                                {user.emailVerified ? 'Verified' : 'Unverified'}
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            <div className="text-muted-foreground text-sm">Phone Status</div>
                            <Badge variant={user.phoneVerified ? 'default' : 'secondary'}>
                                {user.phoneVerified ? 'Verified' : 'Unverified'}
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            <div className="text-muted-foreground text-sm">Role</div>
                            <Badge variant="outline">{user.role}</Badge>
                        </div>

                        <div className="space-y-2">
                            <div className="text-muted-foreground flex items-center gap-1 text-sm">
                                <Calendar className="h-3 w-3" />
                                Member Since
                            </div>
                            <div className="text-sm font-medium">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <ProfileForm user={user} />
            {user.password && <PasswordForm />}
            <DeleteAccountForm hasPassword={!!user.password} userEmail={user.email} />
        </div>
    );
}
