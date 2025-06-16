'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Calendar, Shield, Loader2, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
    firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
    lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
    email: z.string().email('Geçerli bir e-posta adresi giriniz'),
    role: z.enum(['User', 'Admin', 'Moderator']),
    phone: z.string().optional(),
});

interface User {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    image: string | null;
    role: 'User' | 'Admin' | 'Moderator';
    emailVerified: Date | null;
    phone: string | null;
    phoneVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    locale: string;
    accounts: {
        provider: string;
    }[];
}

interface EditUserDialogProps {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email,
            role: user.role,
            phone: user.phone || '',
        },
    });

    useEffect(() => {
        form.reset({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email,
            role: user.role,
            phone: user.phone || '',
        });
    }, [user, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Kullanıcı güncellenirken bir hata oluştu');
            }

            toast.success('Kullanıcı başarıyla güncellendi');
            router.refresh();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error('Kullanıcı güncellenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    }

    const fullName =
        [user.firstName, user.lastName].filter(Boolean).join(' ') || 'İsimsiz Kullanıcı';
    const initials = fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const roleConfig = {
        Admin: { label: 'Yönetici', color: 'bg-red-100 text-red-800' },
        Moderator: { label: 'Moderatör', color: 'bg-blue-100 text-blue-800' },
        User: { label: 'Kullanıcı', color: 'bg-gray-100 text-gray-800' },
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Kullanıcı Düzenle
                    </DialogTitle>
                    <DialogDescription>
                        Kullanıcı bilgilerini düzenleyin. Değişiklikler kaydedildikten sonra
                        uygulanacaktır.
                    </DialogDescription>
                </DialogHeader>

                {/* User Info Header */}
                <div className="bg-muted/30 flex items-center gap-4 rounded-lg p-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user.image || ''} alt={fullName} />
                        <AvatarFallback className="text-lg font-medium">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{fullName}</h3>
                            <Badge className={cn('text-xs', roleConfig[user.role].color)}>
                                {roleConfig[user.role].label}
                            </Badge>
                        </div>
                        <div className="text-muted-foreground flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                    Kayıt: {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ad</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Ad" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Soyad</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Soyad" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        E-posta
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="email@example.com"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Role and Phone */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <Shield className="h-4 w-4" />
                                            Rol
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Rol seçin" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="User">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4" />
                                                        Kullanıcı
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="Moderator">
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="h-4 w-4" />
                                                        Moderatör
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="Admin">
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="h-4 w-4 text-red-500" />
                                                        Yönetici
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            Telefon
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="+90 555 123 45 67" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={loading}
                            >
                                <X className="mr-2 h-4 w-4" />
                                İptal
                            </Button>
                            <Button type="submit" disabled={loading} className="min-w-[120px]">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Kaydediliyor
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Kaydet
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
