import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { CheckCircle2, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface NewsletterConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NewsletterConfirmDialog({ open, onOpenChange }: NewsletterConfirmDialogProps) {
    const searchParams = useSearchParams();
    const t = useTranslations();
    const [status, setStatus] = useState<'success' | 'error' | null>(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;
        const token = searchParams.get('newsletter_confirm');
        if (token) {
            setLoading(true);
            setStatus(null);
            setMessage('');
            fetch(`/api/newsletter/confirm?token=${token}`)
                .then(async (res) => {
                    const data = await res.json();
                    if (data.success) {
                        setStatus('success');
                        setMessage(t('newsletter.confirmSuccess'));
                    } else {
                        setStatus('error');
                        setMessage(t('newsletter.confirmError', { error: data.error }));
                    }
                })
                .catch(() => {
                    setStatus('error');
                    setMessage(t('newsletter.commonError'));
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [open, searchParams, t]);

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
                            <DialogTitle>{t('newsletter.confirmDialogTitleLoading')}</DialogTitle>
                            <DialogDescription>
                                {t('newsletter.confirmDialogDescLoading')}
                            </DialogDescription>
                        </div>
                    ) : status === 'success' ? (
                        <div className="flex flex-col items-center gap-2 py-6">
                            <CheckCircle2 className="mb-2 h-12 w-12 text-green-500" />
                            <DialogTitle>{t('newsletter.confirmDialogTitleSuccess')}</DialogTitle>
                            <DialogDescription>{message}</DialogDescription>
                        </div>
                    ) : status === 'error' ? (
                        <div className="flex flex-col items-center gap-2 py-6">
                            <XCircle className="mb-2 h-12 w-12 text-red-500" />
                            <DialogTitle>{t('newsletter.confirmDialogTitleError')}</DialogTitle>
                            <DialogDescription>{message}</DialogDescription>
                        </div>
                    ) : null}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
