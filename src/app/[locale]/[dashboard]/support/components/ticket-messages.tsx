'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { FileUpload } from './file-upload';
import { MDXEditorComponent } from '@/components/ui/mdx-editor';
import { MDXPreview } from '@/components/ui/mdx-preview';

interface TicketMessage {
    id: string;
    message: string;
    createdAt: Date;
    user: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
    };
    attachments: {
        id: string;
        fileName: string;
        fileType: string;
        fileSize: number;
        fileUrl: string;
    }[];
}

interface Ticket {
    id: string;
    status: string;
    messages: TicketMessage[];
}

interface TicketMessagesProps {
    ticket: Ticket;
}

const formSchema = z.object({
    message: z.string().min(1, 'Mesaj boş olamaz'),
});

export function TicketMessages({ ticket }: TicketMessagesProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);

            // Önce mesajı gönder
            const messageResponse = await fetch(`/api/tickets/${ticket.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!messageResponse.ok) {
                throw new Error('Mesaj gönderilirken bir hata oluştu');
            }

            const messageData = await messageResponse.json();

            // Dosyaları yükle
            if (files.length > 0) {
                for (const file of files) {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('messageId', messageData.id);

                    const fileResponse = await fetch(`/api/tickets/${ticket.id}/attachments`, {
                        method: 'POST',
                        body: formData,
                    });

                    if (!fileResponse.ok) {
                        throw new Error('Dosya yüklenirken bir hata oluştu');
                    }
                }
            }

            toast.success('Mesaj başarıyla gönderildi');
            form.reset();
            setFiles([]);
            router.refresh();
        } catch (error) {
            console.error('Mesaj gönderilirken hata:', error);
            toast.error('Mesaj gönderilirken bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Mesajlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    {ticket.messages.map((message) => (
                        <div
                            key={message.id}
                            className="flex items-start gap-4 rounded-lg border p-4"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={message.user.image || undefined} />
                                <AvatarFallback>
                                    {message.user.name?.[0] || message.user.email[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium">
                                        {message.user.name || message.user.email}
                                    </p>
                                    <span className="text-muted-foreground text-sm">
                                        {format(message.createdAt, 'dd MMM yyyy HH:mm', {
                                            locale: tr,
                                        })}
                                    </span>
                                </div>
                                <div className="prose prose-sm max-w-none">
                                    <MDXPreview content={message.message} />
                                </div>
                                {message.attachments.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {message.attachments.map((attachment) => (
                                            <a
                                                key={attachment.id}
                                                href={attachment.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:bg-accent inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm"
                                            >
                                                <span className="truncate">
                                                    {attachment.fileName}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    ({(attachment.fileSize / 1024).toFixed(1)} KB)
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {ticket.status !== 'CLOSED' && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <MDXEditorComponent
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Mesajınızı yazın..."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FileUpload
                                files={files}
                                setFiles={setFiles}
                                maxSize={5 * 1024 * 1024} // 5MB
                                accept={{
                                    'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
                                    'application/pdf': ['.pdf'],
                                    'application/msword': ['.doc'],
                                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                                        ['.docx'],
                                    'text/plain': ['.txt'],
                                }}
                            />

                            <div className="flex justify-end">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Gönderiliyor...' : 'Gönder'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </CardContent>
        </Card>
    );
}
