import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { UsersTable } from './components/users-table';
import { UserStats } from './components/user-stats';

export const metadata: Metadata = {
    title: 'Kullanıcı Yönetimi - Admin Panel',
    description: 'Kullanıcıları yönetin, düzenleyin ve roller atayın',
};

export default async function AdminUsersPage({
    searchParams: _searchParams,
}: {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        role?: string;
        verified?: string;
    }>;
}) {
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

    const totalUsers = users.length;
    const verifiedUsers = users.filter((u) => u.emailVerified).length;
    const unverifiedUsers = totalUsers - verifiedUsers;
    const adminUsers = users.filter((u) => u.role === 'Admin').length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Kullanıcı Yönetimi</h2>
                    <p className="text-muted-foreground">
                        Sistem kullanıcılarını yönetin, düzenleyin ve yetkilendirin
                    </p>
                </div>
            </div>

            <UserStats
                totalUsers={totalUsers}
                verifiedUsers={verifiedUsers}
                unverifiedUsers={unverifiedUsers}
                adminUsers={adminUsers}
            />

            <UsersTable users={users} />
        </div>
    );
}
