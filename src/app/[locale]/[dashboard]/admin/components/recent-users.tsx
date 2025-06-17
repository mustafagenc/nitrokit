'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, CheckCircle2, XCircle, UserPlus } from 'lucide-react';

interface RecentUser {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    image: string | null;
    role: string;
    emailVerified: Date | null;
    createdAt: Date;
}

interface RecentUsersProps {
    recentUsers: RecentUser[];
}

export function RecentUsers({ recentUsers }: RecentUsersProps) {
    const getRoleConfig = (role: string) => {
        const configs = {
            Admin: { label: 'Yönetici', variant: 'destructive' as const },
            Moderator: { label: 'Moderatör', variant: 'default' as const },
            User: { label: 'Kullanıcı', variant: 'secondary' as const },
        };
        return configs[role as keyof typeof configs] || configs.User;
    };

    const getUserDisplayInfo = (user: RecentUser) => {
        const userName =
            [user.firstName, user.lastName].filter(Boolean).join(' ') || 'İsimsiz Kullanıcı';

        const initials = userName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

        return { userName, initials };
    };

    const formatJoinDate = (date: Date) => {
        return new Intl.DateTimeFormat('tr-TR', {
            day: 'numeric',
            month: 'short',
        }).format(new Date(date));
    };

    return (
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
                            const { userName, initials } = getUserDisplayInfo(user);
                            const roleConfig = getRoleConfig(user.role);

                            return (
                                <div
                                    key={user.id}
                                    className="group hover:bg-muted/30 flex flex-col items-center rounded-lg border p-4 transition-all duration-200 hover:shadow-sm"
                                >
                                    <div className="relative mb-3">
                                        <Avatar className="h-12 w-12 transition-transform group-hover:scale-105">
                                            <AvatarImage src={user.image || ''} alt={userName} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-gray-700 dark:from-blue-900 dark:to-purple-900 dark:text-gray-300">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* Online indicator for verified users */}
                                        {user.emailVerified && (
                                            <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white bg-green-500 dark:border-gray-800" />
                                        )}
                                    </div>

                                    <div className="w-full text-center">
                                        <h4 className="group-hover:text-primary mb-1 truncate text-sm font-medium transition-colors">
                                            {userName}
                                        </h4>

                                        <p className="text-muted-foreground mb-2 text-xs">
                                            {formatJoinDate(user.createdAt)} tarihinde katıldı
                                        </p>
                                    </div>

                                    <div className="flex w-full flex-col items-center gap-2">
                                        <Badge variant={roleConfig.variant} className="text-xs">
                                            {roleConfig.label}
                                        </Badge>

                                        <div className="flex items-center gap-1.5">
                                            {user.emailVerified ? (
                                                <>
                                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                                        Onaylı
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-3 w-3 text-red-500" />
                                                    <span className="text-xs font-medium text-red-600 dark:text-red-400">
                                                        Beklemede
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-muted-foreground col-span-full py-12 text-center">
                            <div className="bg-muted/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                                <UserPlus className="h-8 w-8 opacity-50" />
                            </div>
                            <h3 className="mb-2 text-sm font-medium">Henüz kullanıcı yok</h3>
                            <p className="text-xs">
                                Yeni kullanıcılar kayıt olduğunda burada görünecek
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
