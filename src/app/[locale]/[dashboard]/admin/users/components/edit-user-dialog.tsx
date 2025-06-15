'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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

    console.log('EditUserDialog user:', user); // Debug için

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

    // Form değerlerini user değiştiğinde güncelle
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Kullanıcı Düzenle</DialogTitle>
                    <DialogDescription>
                        Kullanıcı bilgilerini düzenleyin. Değişiklikler kaydedildikten sonra
                        uygulanacaktır.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ad</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-posta</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rol</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Rol seçin" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="User">Kullanıcı</SelectItem>
                                            <SelectItem value="Moderator">Moderatör</SelectItem>
                                            <SelectItem value="Admin">Yönetici</SelectItem>
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
                                    <FormLabel>Telefon</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                İptal
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Kaydediliyor...' : 'Kaydet'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
