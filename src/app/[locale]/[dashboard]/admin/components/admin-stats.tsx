'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, Ticket, Shield, BarChart3 } from 'lucide-react';

interface AdminStatsProps {
    totalTickets: number;
    pendingTickets: number;
    urgentTickets: number;
    totalUsers: number;
    verifiedUsers: number;
    adminUsers: number;
    ticketCompletionRate: number;
    completedTickets: number;
    userVerificationRate: number;
    unverifiedUsers: number;
}

export function AdminStats({
    totalTickets,
    pendingTickets,
    urgentTickets,
    totalUsers,
    verifiedUsers,
    adminUsers,
    ticketCompletionRate,
    completedTickets,
    userVerificationRate,
    unverifiedUsers,
}: AdminStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Toplam Ticket */}
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50/50 to-blue-100/30 p-0 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 dark:hover:shadow-blue-900/20">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium tracking-wide text-blue-600/70 uppercase dark:text-blue-400/70">
                                Toplam Ticket
                            </p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {totalTickets}
                                </p>
                                <span className="text-xs font-medium text-blue-600">
                                    {totalTickets > 0
                                        ? `+${Math.round((pendingTickets / totalTickets) * 100)}% beklemede`
                                        : 'beklemede'}
                                </span>
                            </div>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 transition-colors group-hover:bg-blue-500/20 dark:bg-blue-400/10 dark:group-hover:bg-blue-400/20">
                            <Ticket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div className="text-muted-foreground mt-3 flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-orange-500 shadow-sm" />
                            <span>{pendingTickets} beklemede</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-sm" />
                            <span className="font-medium">{urgentTickets} acil</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Toplam Kullanıcı */}
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-green-50/50 to-green-100/30 p-0 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-green-100/50 dark:from-green-950/20 dark:to-green-900/10 dark:hover:shadow-green-900/20">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium tracking-wide text-green-600/70 uppercase dark:text-green-400/70">
                                Toplam Kullanıcı
                            </p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {totalUsers}
                                </p>
                                <span className="text-xs font-medium text-green-600">
                                    {totalUsers > 0
                                        ? `${Math.round((verifiedUsers / totalUsers) * 100)}% onaylı`
                                        : 'onaylı'}
                                </span>
                            </div>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 transition-colors group-hover:bg-green-500/20 dark:bg-green-400/10 dark:group-hover:bg-green-400/20">
                            <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <div className="text-muted-foreground mt-3 flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-green-500 shadow-sm" />
                            <span>{verifiedUsers} onaylı</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-purple-500 shadow-sm" />
                            <span>{adminUsers} admin</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Çözüm Oranı */}
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-purple-50/50 to-purple-100/30 p-0 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 dark:hover:shadow-purple-900/20">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium tracking-wide text-purple-600/70 uppercase dark:text-purple-400/70">
                                Çözüm Oranı
                            </p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {ticketCompletionRate}%
                                </p>
                                <span className="text-xs font-medium text-purple-600">
                                    {ticketCompletionRate > 70
                                        ? '✓ İyi'
                                        : ticketCompletionRate > 50
                                          ? '⚠ Orta'
                                          : '⚡ Düşük'}
                                </span>
                            </div>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 transition-colors group-hover:bg-purple-500/20 dark:bg-purple-400/10 dark:group-hover:bg-purple-400/20">
                            <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2">
                            <Progress value={ticketCompletionRate} className="h-2 flex-1" />
                            <span className="font-mono text-xs text-purple-600 dark:text-purple-400">
                                {ticketCompletionRate}%
                            </span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                            {completedTickets}/{totalUsers > 0 ? totalTickets : 0} ticket çözüldü
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Onay Oranı */}
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-orange-50/50 to-orange-100/30 p-0 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10 dark:hover:shadow-orange-900/20">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium tracking-wide text-orange-600/70 uppercase dark:text-orange-400/70">
                                Onay Oranı
                            </p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {userVerificationRate}%
                                </p>
                                <span className="text-xs font-medium text-orange-600">
                                    {unverifiedUsers} bekliyor
                                </span>
                            </div>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 transition-colors group-hover:bg-orange-500/20 dark:bg-orange-400/10 dark:group-hover:bg-orange-400/20">
                            <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                    </div>
                    <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2">
                            <Progress value={userVerificationRate} className="h-2 flex-1" />
                            <span className="font-mono text-xs text-orange-600 dark:text-orange-400">
                                {userVerificationRate}%
                            </span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                            {unverifiedUsers} kullanıcı onay bekliyor
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
