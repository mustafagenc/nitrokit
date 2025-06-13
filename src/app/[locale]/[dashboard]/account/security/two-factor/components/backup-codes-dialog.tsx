'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Download, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface BackupCodesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BackupCodesDialog({ open, onOpenChange }: BackupCodesDialogProps) {
    const [backupCodes, setBackupCodes] = useState<string[]>([]);
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showRegenerate, setShowRegenerate] = useState(false);
    const t = useTranslations('dashboard.account.security.twoFactor.backupCodes');

    const downloadCodes = () => {
        if (backupCodes.length === 0) return;

        const content = `${t('download.title')}

${t('download.warning')}

${backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n')}

${t('download.generatedOn', { date: new Date().toLocaleDateString() })}
`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nitrokit-backup-codes.txt';
        a.click();
        URL.revokeObjectURL(url);

        toast.success(t('messages.downloaded'));
    };

    const regenerateCodes = async () => {
        if (verificationCode.length !== 6) {
            setError(t('validation.validCode'));
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await fetch('/api/auth/2fa/backup-codes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: verificationCode }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || t('messages.regenerateFailed'));
            }

            const data = await response.json();
            setBackupCodes(data.backupCodes);
            setShowRegenerate(false);
            setVerificationCode('');
            toast.success(t('messages.regenerateSuccess'));
        } catch (error) {
            setError(error instanceof Error ? error.message : t('messages.regenerateError'));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setBackupCodes([]);
        setVerificationCode('');
        setError('');
        setShowRegenerate(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('dialog.title')}</DialogTitle>
                    <DialogDescription>{t('dialog.description')}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {!showRegenerate && backupCodes.length === 0 && (
                        <div className="space-y-4">
                            <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{t('alerts.verifyIdentity')}</AlertDescription>
                            </Alert>

                            <Button onClick={() => setShowRegenerate(true)} className="w-full">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                {t('buttons.generateNew')}
                            </Button>
                        </div>
                    )}

                    {showRegenerate && (
                        <div className="space-y-4">
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    {t('alerts.invalidatePrevious')}
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-2">
                                <Label htmlFor="verify-code">
                                    {t('form.verificationCode.label')}
                                </Label>
                                <Input
                                    id="verify-code"
                                    type="text"
                                    placeholder={t('form.verificationCode.placeholder')}
                                    value={verificationCode}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        setVerificationCode(value);
                                    }}
                                    className="text-center font-mono text-lg tracking-widest"
                                    maxLength={6}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowRegenerate(false)}
                                    className="flex-1"
                                >
                                    {t('buttons.cancel')}
                                </Button>
                                <Button
                                    onClick={regenerateCodes}
                                    disabled={loading || verificationCode.length !== 6}
                                    className="flex-1"
                                >
                                    {loading ? t('buttons.generating') : t('buttons.generate')}
                                </Button>
                            </div>
                        </div>
                    )}

                    {backupCodes.length > 0 && (
                        <div className="space-y-4">
                            <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{t('alerts.saveCodes')}</AlertDescription>
                            </Alert>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                                        {backupCodes.map((code, index) => (
                                            <div
                                                key={index}
                                                className="bg-muted rounded p-2 text-center"
                                            >
                                                {code}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={downloadCodes}
                                    className="flex-1"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    {t('buttons.download')}
                                </Button>
                                <Button onClick={() => setShowRegenerate(true)} className="flex-1">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    {t('buttons.regenerate')}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
