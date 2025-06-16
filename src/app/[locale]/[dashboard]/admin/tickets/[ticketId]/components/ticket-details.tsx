'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    Clock,
    Calendar,
    MessageSquare,
    ArrowLeft,
    RefreshCw,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Users,
    Loader2,
} from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Ticket {
    id: string;
    title: string;
    description: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    category: 'TECHNICAL' | 'BILLING' | 'ACCOUNT' | 'GENERAL' | 'FEATURE_REQUEST' | 'BUG_REPORT';
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
        role: 'User' | 'Admin' | 'Moderator';
    };
    assignedUser: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
        role: 'User' | 'Admin' | 'Moderator';
    } | null;
}

interface TicketDetailsProps {
    ticket: Ticket;
}

export function TicketDetails({ ticket }: TicketDetailsProps) {
    const router = useRouter();
    const [status, setStatus] = useState(ticket.status);
    const [priority, setPriority] = useState(ticket.priority);
    const [category, setCategory] = useState(ticket.category);
    const [isLoading, setIsLoading] = useState(false);

    const statusConfig = {
        OPEN: {
            label: 'Açık',
            variant: 'default' as const,
            icon: AlertTriangle,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 border-blue-200',
        },
        IN_PROGRESS: {
            label: 'İşlemde',
            variant: 'secondary' as const,
            icon: RefreshCw,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50 border-yellow-200',
        },
        WAITING_FOR_USER: {
            label: 'Kullanıcı Bekliyor',
            variant: 'outline' as const,
            icon: Clock,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50 border-orange-200',
        },
        RESOLVED: {
            label: 'Çözüldü',
            variant: 'secondary' as const,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50 border-green-200',
        },
        CLOSED: {
            label: 'Kapalı',
            variant: 'destructive' as const,
            icon: XCircle,
            color: 'text-gray-600',
            bgColor: 'bg-gray-50 border-gray-200',
        },
    };

    const priorityConfig = {
        LOW: {
            label: 'Düşük',
            variant: 'outline' as const,
            color: 'text-gray-600',
            bgColor: 'bg-gray-50',
        },
        MEDIUM: {
            label: 'Orta',
            variant: 'default' as const,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        HIGH: {
            label: 'Yüksek',
            variant: 'secondary' as const,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        URGENT: {
            label: 'Acil',
            variant: 'destructive' as const,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
        },
    };

    const categoryMap: Record<Ticket['category'], { label: string; color: string }> = {
        TECHNICAL: { label: 'Teknik', color: 'bg-purple-100 text-purple-800' },
        BILLING: { label: 'Faturalandırma', color: 'bg-green-100 text-green-800' },
        ACCOUNT: { label: 'Hesap', color: 'bg-blue-100 text-blue-800' },
        GENERAL: { label: 'Genel', color: 'bg-gray-100 text-gray-800' },
        FEATURE_REQUEST: { label: 'Özellik İsteği', color: 'bg-indigo-100 text-indigo-800' },
        BUG_REPORT: { label: 'Hata Bildirimi', color: 'bg-red-100 text-red-800' },
    };

    const handleUpdate = async (field: string, value: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/admin/tickets/${ticket.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [field]: value }),
            });

            if (!response.ok) {
                throw new Error(`${field} güncellenirken bir hata oluştu`);
            }

            if (field === 'status') setStatus(value as Ticket['status']);
            if (field === 'priority') setPriority(value as Ticket['priority']);
            if (field === 'category') setCategory(value as Ticket['category']);

            toast.success(
                `Ticket ${field === 'status' ? 'durumu' : field === 'priority' ? 'önceliği' : 'kategorisi'} güncellendi`
            );
            router.refresh();
        } catch (error) {
            toast.error('Bir hata oluştu');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const StatusIcon = statusConfig[status].icon;
    const userDisplayName = ticket.user.name || ticket.user.email;
    const userInitials = userDisplayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/dashboard/admin/tickets')}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Ticketlara Dön
                </Button>
            </div>

            {/* Main Ticket Card */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <CardTitle className="text-2xl">{ticket.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <span>#{ticket.id}</span>
                                <span>•</span>
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {new Date(ticket.createdAt).toLocaleDateString('tr-TR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </CardDescription>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className={cn('rounded-full p-1', statusConfig[status].bgColor)}
                                >
                                    <StatusIcon
                                        className={cn('h-3 w-3', statusConfig[status].color)}
                                    />
                                </div>
                                <Badge variant={statusConfig[status].variant}>
                                    {statusConfig[status].label}
                                </Badge>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant={priorityConfig[priority].variant}>
                                    {priorityConfig[priority].label}
                                </Badge>
                                <span
                                    className={cn(
                                        'rounded-full px-2 py-1 text-xs font-medium',
                                        categoryMap[category].color
                                    )}
                                >
                                    {categoryMap[category].label}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* User Info */}
                    <div className="bg-muted/30 flex items-center gap-4 rounded-lg p-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={ticket.user.image || ''} alt={userDisplayName} />
                            <AvatarFallback className="font-medium">{userInitials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{userDisplayName}</h3>
                                <Badge variant="outline" className="text-xs">
                                    {ticket.user.role}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">{ticket.user.email}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium">Ticket Sahibi</p>
                            <p className="text-muted-foreground text-xs">
                                Son güncelleme:{' '}
                                {new Date(ticket.updatedAt).toLocaleDateString('tr-TR')}
                            </p>
                        </div>
                    </div>

                    {/* Assigned User */}
                    {ticket.assignedUser && (
                        <div className="flex items-center gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <div className="rounded-full bg-blue-100 p-2">
                                <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-blue-900">Atanan Kişi</h4>
                                <p className="text-sm text-blue-700">
                                    {ticket.assignedUser.name || ticket.assignedUser.email}
                                </p>
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Description */}
                    <div className="space-y-3">
                        <h4 className="flex items-center gap-2 font-semibold">
                            <MessageSquare className="h-4 w-4" />
                            Açıklama
                        </h4>
                        <div className="bg-muted/30 rounded-lg p-4">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {ticket.description}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Controls */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Status Control */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Durum</label>
                            <Select
                                value={status}
                                onValueChange={(value) => handleUpdate('status', value)}
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue>
                                        <div className="flex items-center gap-2">
                                            <StatusIcon className="h-4 w-4" />
                                            <span>{statusConfig[status].label}</span>
                                        </div>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(statusConfig).map(([value, config]) => {
                                        const Icon = config.icon;
                                        return (
                                            <SelectItem key={value} value={value}>
                                                <div className="flex items-center gap-2">
                                                    <Icon className="h-4 w-4" />
                                                    <span>{config.label}</span>
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Priority Control */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Öncelik</label>
                            <Select
                                value={priority}
                                onValueChange={(value) => handleUpdate('priority', value)}
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue>
                                        <Badge variant={priorityConfig[priority].variant}>
                                            {priorityConfig[priority].label}
                                        </Badge>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(priorityConfig).map(([value, config]) => (
                                        <SelectItem key={value} value={value}>
                                            <Badge variant={config.variant}>{config.label}</Badge>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Category Control */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Kategori</label>
                            <Select
                                value={category}
                                onValueChange={(value) => handleUpdate('category', value)}
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue>
                                        <span
                                            className={cn(
                                                'rounded-full px-2 py-1 text-xs font-medium',
                                                categoryMap[category].color
                                            )}
                                        >
                                            {categoryMap[category].label}
                                        </span>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(categoryMap).map(([value, config]) => (
                                        <SelectItem key={value} value={value}>
                                            <span
                                                className={cn(
                                                    'rounded-full px-2 py-1 text-xs font-medium',
                                                    config.color
                                                )}
                                            >
                                                {config.label}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Loading Overlay */}
                    {isLoading && (
                        <div className="bg-background/50 absolute inset-0 flex items-center justify-center rounded-lg">
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Güncelleniyor...</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
