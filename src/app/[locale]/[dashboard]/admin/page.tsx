import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { generatePageMetadata } from '@/lib';
import { AdminStats } from './components/admin-stats';
import { TicketStatusDistribution } from './components/ticket-status-distribution';
import { RecentActivities } from './components/recent-activities';
import { RecentUsers } from './components/recent-users';

export async function generateMetadata(): Promise<Metadata> {
    return await generatePageMetadata({
        params: Promise.resolve({
            title: 'Admin Dashboard',
            description: 'Admin panel genel görünüm ve istatistikler',
        }),
    });
}

export default async function AdminDashboard() {
    const session = await auth();
    if (!session?.user || session.user.role !== 'Admin') {
        redirect('/dashboard');
    }

    const [
        totalTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets,
        closedTickets,
        urgentTickets,
        recentTickets,
    ] = await Promise.all([
        prisma.ticket.count(),
        prisma.ticket.count({ where: { status: 'OPEN' } }),
        prisma.ticket.count({ where: { status: 'IN_PROGRESS' } }),
        prisma.ticket.count({ where: { status: 'RESOLVED' } }),
        prisma.ticket.count({ where: { status: 'CLOSED' } }),
        prisma.ticket.count({ where: { priority: 'URGENT' } }),
        prisma.ticket.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        image: true,
                    },
                },
                _count: {
                    select: { messages: true },
                },
            },
        }),
    ]);

    const [totalUsers, verifiedUsers, adminUsers, recentUsers] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { emailVerified: { not: null } } }),
        prisma.user.count({ where: { role: 'Admin' } }),
        prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                image: true,
                role: true,
                emailVerified: true,
                createdAt: true,
            },
        }),
    ]);

    const pendingTickets = openTickets + inProgressTickets;
    const completedTickets = resolvedTickets + closedTickets;
    const unverifiedUsers = totalUsers - verifiedUsers;
    const ticketCompletionRate =
        totalTickets > 0 ? Math.round((completedTickets / totalTickets) * 100) : 0;
    const userVerificationRate =
        totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
                    <p className="text-muted-foreground">
                        Sistem genel görünümü ve önemli istatistikler
                    </p>
                </div>
            </div>
            <AdminStats
                totalTickets={totalTickets}
                pendingTickets={pendingTickets}
                urgentTickets={urgentTickets}
                totalUsers={totalUsers}
                verifiedUsers={verifiedUsers}
                adminUsers={adminUsers}
                ticketCompletionRate={ticketCompletionRate}
                completedTickets={completedTickets}
                userVerificationRate={userVerificationRate}
                unverifiedUsers={unverifiedUsers}
            />
            <div className="grid gap-6 md:grid-cols-2">
                <TicketStatusDistribution
                    totalTickets={totalTickets}
                    openTickets={openTickets}
                    inProgressTickets={inProgressTickets}
                    resolvedTickets={resolvedTickets}
                    urgentTickets={urgentTickets}
                />
                <RecentActivities recentTickets={recentTickets} />
            </div>
            <RecentUsers recentUsers={recentUsers} />
        </div>
    );
}
