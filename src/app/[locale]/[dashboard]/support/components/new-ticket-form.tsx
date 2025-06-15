'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import { toast } from 'sonner';
import { MDXEditorComponent } from '@/components/ui/mdx-editor';

const formSchema = z.object({
    title: z.string().min(3, 'Başlık en az 3 karakter olmalıdır').max(100),
    description: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır'),
    category: z.enum([
        'TECHNICAL',
        'BILLING',
        'ACCOUNT',
        'GENERAL',
        'FEATURE_REQUEST',
        'BUG_REPORT',
    ]),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
});

export function NewTicketForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            category: 'GENERAL',
            priority: 'MEDIUM',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);
            const response = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Destek talebi oluşturulurken bir hata oluştu');
            }

            const data = await response.json();
            toast.success('Destek talebi başarıyla oluşturuldu');
            router.push(`/dashboard/support/${data.id}`);
        } catch (error) {
            console.error('Destek talebi oluşturulurken hata:', error);
            toast.error('Destek talebi oluşturulurken bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Başlık</FormLabel>
                            <FormControl>
                                <Input placeholder="Destek talebinizin başlığı" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Açıklama</FormLabel>
                            <FormControl>
                                <MDXEditorComponent
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Destek talebinizin detaylı açıklaması"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kategori</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Kategori seçin" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="TECHNICAL">Teknik</SelectItem>
                                        <SelectItem value="BILLING">Fatura</SelectItem>
                                        <SelectItem value="ACCOUNT">Hesap</SelectItem>
                                        <SelectItem value="GENERAL">Genel</SelectItem>
                                        <SelectItem value="FEATURE_REQUEST">
                                            Özellik İsteği
                                        </SelectItem>
                                        <SelectItem value="BUG_REPORT">Hata Raporu</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Öncelik</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Öncelik seçin" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="LOW">Düşük</SelectItem>
                                        <SelectItem value="MEDIUM">Orta</SelectItem>
                                        <SelectItem value="HIGH">Yüksek</SelectItem>
                                        <SelectItem value="URGENT">Acil</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isLoading}
                    >
                        İptal
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Oluşturuluyor...' : 'Oluştur'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
