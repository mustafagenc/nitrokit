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
import { AlertTriangle } from 'lucide-react';

interface TwoFactorDisableDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onComplete: () => void;
}

export function TwoFactorDisableDialog({
    open,
    onOpenChange,
    onComplete,
}: TwoFactorDisableDialogProps) {
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const t = useTranslations('dashboard.account.security.twoFactor.disable');

    const handleDisable = async () => {
        if (verificationCode.length !== 6) {
            setError(t('validation.validCode'));
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await fetch('/api/auth/2fa/disable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: verificationCode }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || t('messages.disableFailed'));
            }

            onComplete();
            handleClose();
        } catch (error) {
            setError(error instanceof Error ? error.message : t('messages.disableError'));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setVerificationCode('');
        setError('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="text-destructive h-5 w-5" />
                        {t('dialog.title')}
                    </DialogTitle>
                    <DialogDescription>{t('dialog.description')}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{t('warning.message')}</AlertDescription>
                    </Alert>

                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="disable-code">{t('form.verificationCode.label')}</Label>
                        <Input
                            id="disable-code"
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
                        <Button variant="outline" onClick={handleClose} className="flex-1">
                            {t('buttons.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDisable}
                            disabled={loading || verificationCode.length !== 6}
                            className="flex-1"
                        >
                            {loading ? t('buttons.disabling') : t('buttons.disable')}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
