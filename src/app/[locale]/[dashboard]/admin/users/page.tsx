import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { UsersTable } from './components/users-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, Shield } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Kullanıcı Yönetimi - Admin Panel',
    description: 'Kullanıcıları yönetin, düzenleyin ve roller atayın',
};

export default async function UsersPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== 'Admin') {
        redirect('/dashboard');
    }

    const users = await prisma.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            role: true,
            emailVerified: true,
            phone: true,
            phoneVerified: true,
            createdAt: true,
            updatedAt: true,
            locale: true,
            accounts: {
                select: {
                    provider: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    // İstatistikler
    const totalUsers = users.length;
    const verifiedUsers = users.filter((u) => u.emailVerified).length;
    const unverifiedUsers = totalUsers - verifiedUsers;
    const adminUsers = users.filter((u) => u.role === 'Admin').length;

    return (
        <div className="container mx-auto space-y-6 py-6">
            {/* Page Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Kullanıcı Yönetimi</h1>
                <p className="text-muted-foreground">
                    Sistem kullanıcılarını yönetin, düzenleyin ve yetkilendirin
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
                        <Users className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <p className="text-muted-foreground text-xs">Kayıtlı kullanıcılar</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Onaylı Kullanıcı</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{verifiedUsers}</div>
                        <p className="text-muted-foreground text-xs">E-posta onaylı</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bekleyen Onay</CardTitle>
                        <UserX className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{unverifiedUsers}</div>
                        <p className="text-muted-foreground text-xs">Onay bekleyen</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Yönetici</CardTitle>
                        <Shield className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{adminUsers}</div>
                        <p className="text-muted-foreground text-xs">Admin yetkisi</p>
                    </CardContent>
                </Card>
            </div>

            {/* Users Table */}
            <UsersTable users={users} />
        </div>
    );
}
