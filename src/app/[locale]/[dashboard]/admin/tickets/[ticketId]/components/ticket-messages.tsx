'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
    Send,
    MessageSquare,
    File,
    Image as ImageIcon,
    FileText,
    Loader2,
    Paperclip,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Ticket } from 'prisma/generated/prisma';

interface TicketMessage {
    id: string;
    message: string;
    createdAt: Date;
    user: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
        role: string;
    };
    attachments: {
        id: string;
        fileName: string;
        fileType: string;
        fileSize: number;
        fileUrl: string;
    }[];
}

interface TicketMessagesProps {
    ticket: Ticket & {
        messages: TicketMessage[];
    };
}

export function TicketMessages({ ticket }: TicketMessagesProps) {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [messages, setMessages] = useState<TicketMessage[]>(ticket.messages);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() && files.length === 0) return;

        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('message', message);
            files.forEach((file) => {
                formData.append('files', file);
            });

            const response = await fetch(`/api/admin/tickets/${ticket.id}/messages`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Mesaj gönderilirken bir hata oluştu');
            }

            const newMessage = await response.json();
            setMessages([...messages, newMessage]);
            setMessage('');
            setFiles([]);
            toast.success('Mesaj gönderildi');
        } catch (error) {
            toast.error('Bir hata oluştu');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith('image/')) return ImageIcon;
        if (fileType === 'application/pdf') return FileText;
        return File;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            {/* Messages */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Mesajlar ({messages.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {messages.length === 0 ? (
                        <div className="text-muted-foreground py-12 text-center">
                            <MessageSquare className="mx-auto mb-4 h-16 w-16 opacity-30" />
                            <p className="text-lg font-medium">Henüz mesaj yok</p>
                            <p className="text-sm">İlk mesajı aşağıdaki formdan gönderebilirsin</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {messages.map((msg) => {
                                const displayName = msg.user.name || msg.user.email || 'Bilinmeyen';
                                const initials = displayName
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase()
                                    .slice(0, 2);
                                const isAdmin = msg.user.role === 'Admin';

                                return (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            'flex gap-4',
                                            isAdmin ? 'flex-row-reverse' : 'flex-row'
                                        )}
                                    >
                                        <Avatar className="mt-1 h-8 w-8 flex-shrink-0">
                                            <AvatarImage
                                                src={msg.user.image || ''}
                                                alt={displayName}
                                            />
                                            <AvatarFallback className="text-xs">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div
                                            className={cn(
                                                'max-w-[80%] flex-1 space-y-2',
                                                isAdmin ? 'text-right' : 'text-left'
                                            )}
                                        >
                                            {/* Header */}
                                            <div
                                                className={cn(
                                                    'flex items-center gap-2',
                                                    isAdmin ? 'justify-end' : 'justify-start'
                                                )}
                                            >
                                                <span className="text-sm font-medium">
                                                    {displayName}
                                                </span>
                                                <Badge
                                                    variant={isAdmin ? 'default' : 'secondary'}
                                                    className="text-xs"
                                                >
                                                    {msg.user.role}
                                                </Badge>
                                                <span className="text-muted-foreground text-xs">
                                                    {formatTime(msg.createdAt)}
                                                </span>
                                            </div>

                                            {/* Message */}
                                            <div
                                                className={cn(
                                                    'max-w-fit rounded-lg border p-3',
                                                    isAdmin
                                                        ? 'bg-primary text-primary-foreground border-primary ml-auto'
                                                        : 'bg-muted border-border mr-auto'
                                                )}
                                            >
                                                <div
                                                    className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed"
                                                    dangerouslySetInnerHTML={{
                                                        __html: msg.message,
                                                    }}
                                                />
                                            </div>

                                            {/* Attachments - Ultra Compact */}
                                            {msg.attachments.length > 0 && (
                                                <div
                                                    className={cn(
                                                        'mt-2 flex flex-wrap gap-1',
                                                        isAdmin ? 'justify-end' : 'justify-start'
                                                    )}
                                                >
                                                    {msg.attachments.map((attachment) => {
                                                        const FileIcon = getFileIcon(
                                                            attachment.fileType
                                                        );
                                                        return (
                                                            <a
                                                                key={attachment.id}
                                                                href={attachment.fileUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="hover:bg-muted/50 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors"
                                                                title={`${attachment.fileName} (${formatFileSize(attachment.fileSize)})`}
                                                            >
                                                                <FileIcon className="h-3 w-3" />
                                                                <span className="max-w-[80px] truncate">
                                                                    {attachment.fileName}
                                                                </span>
                                                            </a>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Reply Form */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Yanıt Gönder</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Message Input */}
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Mesajınızı buraya yazın..."
                            className="min-h-[120px] resize-none"
                            disabled={isLoading}
                        />

                        {/* File Upload */}
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

                        {/* Submit Area */}
                        <div className="flex items-center justify-between">
                            <div className="text-muted-foreground flex items-center gap-4 text-sm">
                                <span>{message.length}/1000 karakter</span>
                                {files.length > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Paperclip className="h-4 w-4" />
                                        <span>{files.length} dosya</span>
                                    </div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading || (!message.trim() && files.length === 0)}
                                className="min-w-[120px]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Gönderiliyor
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Gönder
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
