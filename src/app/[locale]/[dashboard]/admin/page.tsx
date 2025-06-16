import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    Users,
    Ticket,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Calendar,
    MessageSquare,
    Shield,
    Eye,
    ArrowRight,
    Activity,
    BarChart3,
} from 'lucide-react';
import { generatePageMetadata } from '@/lib';
import { Link } from '@/i18n/navigation';

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

    // Ticket İstatistikleri
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

    // Kullanıcı İstatistikleri
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

    // Hesaplamalar
    const pendingTickets = openTickets + inProgressTickets;
    const completedTickets = resolvedTickets + closedTickets;
    const unverifiedUsers = totalUsers - verifiedUsers;
    const ticketCompletionRate =
        totalTickets > 0 ? Math.round((completedTickets / totalTickets) * 100) : 0;
    const userVerificationRate =
        totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0;

    const getStatusConfig = (status: string) => {
        const configs = {
            OPEN: { label: 'Açık', variant: 'destructive' as const, icon: XCircle },
            IN_PROGRESS: { label: 'İşlemde', variant: 'default' as const, icon: Clock },
            WAITING_FOR_USER: {
                label: 'Kullanıcı Bekliyor',
                variant: 'secondary' as const,
                icon: Clock,
            },
            RESOLVED: { label: 'Çözüldü', variant: 'default' as const, icon: CheckCircle2 },
            CLOSED: { label: 'Kapalı', variant: 'outline' as const, icon: CheckCircle2 },
        };
        return configs[status as keyof typeof configs] || configs.OPEN;
    };

    const getPriorityConfig = (priority: string) => {
        const configs = {
            LOW: { label: 'Düşük', color: 'text-green-600' },
            MEDIUM: { label: 'Orta', color: 'text-yellow-600' },
            HIGH: { label: 'Yüksek', color: 'text-orange-600' },
            URGENT: { label: 'Acil', color: 'text-red-600' },
        };
        return configs[priority as keyof typeof configs] || configs.LOW;
    };

    return (
        <div className="container mx-auto space-y-8 py-6">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Sistem genel görünümü ve önemli istatistikler
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Tickets */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Ticket</CardTitle>
                        <Ticket className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTickets}</div>
                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                            <span>{pendingTickets} beklemede</span>
                            <span>•</span>
                            <span>{urgentTickets} acil</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Users */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
                        <Users className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                            <span>{verifiedUsers} onaylı</span>
                            <span>•</span>
                            <span>{adminUsers} admin</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Ticket Completion Rate */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Çözüm Oranı</CardTitle>
                        <BarChart3 className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{ticketCompletionRate}%</div>
                        <Progress value={ticketCompletionRate} className="mt-2" />
                        <p className="text-muted-foreground mt-2 text-xs">
                            {completedTickets}/{totalTickets} ticket çözüldü
                        </p>
                    </CardContent>
                </Card>

                {/* User Verification Rate */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Onay Oranı</CardTitle>
                        <Shield className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userVerificationRate}%</div>
                        <Progress value={userVerificationRate} className="mt-2" />
                        <p className="text-muted-foreground mt-2 text-xs">
                            {unverifiedUsers} kullanıcı onay bekliyor
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Stats */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Ticket Status Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Ticket Durum Dağılımı
                        </CardTitle>
                        <CardDescription>Ticket durumlarının detaylı analizi</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <XCircle className="h-4 w-4 text-red-500" />
                                    <span className="text-sm">Açık</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{openTickets}</span>
                                    <Badge variant="destructive" className="text-xs">
                                        {totalTickets > 0
                                            ? Math.round((openTickets / totalTickets) * 100)
                                            : 0}
                                        %
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm">İşlemde</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{inProgressTickets}</span>
                                    <Badge variant="default" className="text-xs">
                                        {totalTickets > 0
                                            ? Math.round((inProgressTickets / totalTickets) * 100)
                                            : 0}
                                        %
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">Çözüldü</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{resolvedTickets}</span>
                                    <Badge variant="outline" className="text-xs">
                                        {totalTickets > 0
                                            ? Math.round((resolvedTickets / totalTickets) * 100)
                                            : 0}
                                        %
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Acil Öncelik</span>
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <span className="font-medium text-red-600">
                                    {urgentTickets} ticket
                                </span>
                            </div>
                        </div>

                        <Link href="/dashboard/admin/tickets">
                            <Button variant="outline" className="w-full">
                                <Ticket className="mr-2 h-4 w-4" />
                                Tüm Ticket&apos;ları Görüntüle
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Son Aktiviteler
                        </CardTitle>
                        <CardDescription>En son oluşturulan ticket&apos;lar</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTickets.length > 0 ? (
                                recentTickets.map((ticket) => {
                                    const userName =
                                        [ticket.user.firstName, ticket.user.lastName]
                                            .filter(Boolean)
                                            .join(' ') || ticket.user.email;
                                    const initials = userName
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .toUpperCase()
                                        .slice(0, 2);
                                    const statusConfig = getStatusConfig(ticket.status);
                                    const priorityConfig = getPriorityConfig(ticket.priority);

                                    return (
                                        <div
                                            key={ticket.id}
                                            className="flex items-center gap-3 rounded-lg border p-3"
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={ticket.user.image || ''}
                                                    alt={userName}
                                                />
                                                <AvatarFallback className="text-xs">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <h4 className="truncate text-sm font-medium">
                                                        {ticket.title}
                                                    </h4>
                                                    <Badge
                                                        variant={statusConfig.variant}
                                                        className="text-xs"
                                                    >
                                                        {statusConfig.label}
                                                    </Badge>
                                                </div>
                                                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                                    <span>{userName}</span>
                                                    <span>•</span>
                                                    <span className={priorityConfig.color}>
                                                        {priorityConfig.label}
                                                    </span>
                                                    <span>•</span>
                                                    <div className="flex items-center gap-1">
                                                        <MessageSquare className="h-3 w-3" />
                                                        <span>{ticket._count.messages}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Link href={`/dashboard/admin/tickets/${ticket.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-muted-foreground py-8 text-center">
                                    <Ticket className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <p>Henüz ticket yok</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Users */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Son Kayıt Olan Kullanıcılar
                    </CardTitle>
                    <CardDescription>En son sisteme katılan kullanıcılar</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        {recentUsers.length > 0 ? (
                            recentUsers.map((user) => {
                                const userName =
                                    [user.firstName, user.lastName].filter(Boolean).join(' ') ||
                                    'İsimsiz Kullanıcı';
                                const initials = userName
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase()
                                    .slice(0, 2);

                                const roleConfig = {
                                    Admin: { label: 'Yönetici', variant: 'destructive' as const },
                                    Moderator: { label: 'Moderatör', variant: 'default' as const },
                                    User: { label: 'Kullanıcı', variant: 'secondary' as const },
                                };

                                return (
                                    <div
                                        key={user.id}
                                        className="flex flex-col items-center rounded-lg border p-4"
                                    >
                                        <Avatar className="mb-3 h-12 w-12">
                                            <AvatarImage src={user.image || ''} alt={userName} />
                                            <AvatarFallback>{initials}</AvatarFallback>
                                        </Avatar>

                                        <h4 className="mb-2 text-center text-sm font-medium">
                                            {userName}
                                        </h4>

                                        <div className="flex flex-col items-center gap-2">
                                            <Badge
                                                variant={
                                                    roleConfig[user.role as keyof typeof roleConfig]
                                                        .variant
                                                }
                                                className="text-xs"
                                            >
                                                {
                                                    roleConfig[user.role as keyof typeof roleConfig]
                                                        .label
                                                }
                                            </Badge>

                                            <div className="flex items-center gap-1">
                                                {user.emailVerified ? (
                                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                                ) : (
                                                    <XCircle className="h-3 w-3 text-red-500" />
                                                )}
                                                <span className="text-muted-foreground text-xs">
                                                    {user.emailVerified ? 'Onaylı' : 'Beklemede'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-muted-foreground col-span-full py-8 text-center">
                                <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                <p>Henüz kullanıcı yok</p>
                            </div>
                        )}
                    </div>

                    {recentUsers.length > 0 && (
                        <div className="mt-6">
                            <Link href="/dashboard/admin/users">
                                <Button variant="outline" className="w-full">
                                    <Users className="mr-2 h-4 w-4" />
                                    Tüm Kullanıcıları Görüntüle
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
