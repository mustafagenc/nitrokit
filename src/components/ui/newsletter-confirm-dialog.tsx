import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { CheckCircle2, XCircle } from 'lucide-react';
import React from 'react';

interface NewsletterConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    status: 'success' | 'error' | null;
    message: string;
    loading: boolean;
}

export function NewsletterConfirmDialog({
    open,
    onOpenChange,
    status,
    message,
    loading,
}: NewsletterConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-md">
                <DialogHeader className="flex flex-col items-center justify-center gap-2">
                    {loading ? (
                        <div className="flex flex-col items-center gap-2 py-6">
                            <div className="animate-spin text-blue-500">
                                <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="#6366f1"
                                        strokeWidth="4"
                                        strokeDasharray="60"
                                        strokeDashoffset="20"
                                    />
                                </svg>
                            </div>
                            <DialogTitle>Abonelik Onaylanıyor...</DialogTitle>
                            <DialogDescription>Lütfen bekleyin.</DialogDescription>
                        </div>
                    ) : status === 'success' ? (
                        <div className="flex flex-col items-center gap-2 py-6">
                            <CheckCircle2 className="mb-2 h-12 w-12 text-green-500" />
                            <DialogTitle>Abonelik Onaylandı</DialogTitle>
                            <DialogDescription>{message}</DialogDescription>
                        </div>
                    ) : status === 'error' ? (
                        <div className="flex flex-col items-center gap-2 py-6">
                            <XCircle className="mb-2 h-12 w-12 text-red-500" />
                            <DialogTitle>Abonelik Onayı Hatası</DialogTitle>
                            <DialogDescription>{message}</DialogDescription>
                        </div>
                    ) : null}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
