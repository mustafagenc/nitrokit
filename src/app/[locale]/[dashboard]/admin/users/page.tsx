import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { UsersTable } from './components/users-table';

export const metadata: Metadata = {
    title: 'Kullanıcı Yönetimi',
    description: 'Kullanıcıları yönetin ve düzenleyin',
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

    console.log(
        'Users with accounts:',
        users.map((user) => ({
            email: user.email,
            accounts: user.accounts,
        }))
    );

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between px-6">
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold tracking-tight">Kullanıcı Yönetimi</h1>
                </div>
            </div>
            <div className="p-6">
                <UsersTable users={users} />
            </div>
        </div>
    );
}
