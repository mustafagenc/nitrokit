'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { Copy, Download, AlertTriangle, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface TwoFactorSetupDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onComplete: () => void;
}

interface SetupData {
    secret: string;
    qrCodeUrl: string;
    manualEntryKey: string;
    backupCodes: string[];
}

export function TwoFactorSetupDialog({
    open,
    onOpenChange,
    onComplete,
}: TwoFactorSetupDialogProps) {
    const [step, setStep] = useState<'loading' | 'setup' | 'verify' | 'backup'>('loading');
    const [setupData, setSetupData] = useState<SetupData | null>(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const t = useTranslations('dashboard.account.security.twoFactor.setup');

    const handleSetupStart = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch('/api/auth/2fa/setup', {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(t('messages.setupFailed'));
            }

            const data = await response.json();
            setSetupData(data);
            setStep('setup');
        } catch (error) {
            setError(t('messages.setupError'));
            console.error('2FA setup error:', error);
        } finally {
            setLoading(false);
        }
    }, [t, setLoading, setError, setSetupData, setStep]);

    useEffect(() => {
        if (open && step === 'loading') {
            handleSetupStart();
        }
    }, [handleSetupStart, open, step]);

    const handleVerify = async () => {
        if (!setupData || verificationCode.length !== 6) {
            setError(t('validation.validCode'));
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await fetch('/api/auth/2fa/enable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    secret: setupData.secret,
                    token: verificationCode,
                    backupCodes: setupData.backupCodes,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || t('messages.verifyFailed'));
            }

            setStep('backup');
        } catch (error) {
            setError(error instanceof Error ? error.message : t('messages.verifyError'));
        } finally {
            setLoading(false);
        }
    };

    // Manual entry key'i kopyala
    const copyManualKey = () => {
        if (setupData?.manualEntryKey) {
            navigator.clipboard.writeText(setupData.manualEntryKey);
            toast.success(t('messages.keyCopied'));
        }
    };

    // Backup kodları indir
    const downloadBackupCodes = () => {
        if (setupData?.backupCodes) {
            const content = `${t('download.title')}

${t('download.warning')}

${setupData.backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n')}

${t('download.generatedOn', { date: new Date().toLocaleDateString() })}
`;

            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'nitrokit-backup-codes.txt';
            a.click();
            URL.revokeObjectURL(url);

            toast.success(t('messages.codesDownloaded'));
        }
    };

    // Dialog'u kapat ve reset et
    const handleClose = () => {
        setStep('loading');
        setSetupData(null);
        setVerificationCode('');
        setError('');
        onOpenChange(false);
    };

    const getStepTitle = () => {
        switch (step) {
            case 'setup':
                return t('steps.setup.title');
            case 'verify':
                return t('steps.verify.title');
            case 'backup':
                return t('steps.backup.title');
            case 'loading':
            default:
                return t('steps.loading.title');
        }
    };

    const getStepDescription = () => {
        switch (step) {
            case 'setup':
                return t('steps.setup.description');
            case 'verify':
                return t('steps.verify.description');
            case 'backup':
                return t('steps.backup.description');
            case 'loading':
            default:
                return t('steps.loading.description');
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        {getStepTitle()}
                    </DialogTitle>
                    <DialogDescription>{getStepDescription()}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Loading Step */}
                    {step === 'loading' && (
                        <div className="flex items-center justify-center py-8">
                            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
                        </div>
                    )}

                    {/* Setup Step */}
                    {step === 'setup' && setupData && (
                        <div className="space-y-4">
                            {/* QR Code */}
                            <Card>
                                <CardContent className="flex items-center justify-center p-6">
                                    <Image
                                        src={setupData.qrCodeUrl}
                                        alt={t('qr.alt')}
                                        width={200}
                                        height={200}
                                        className="rounded-lg"
                                    />
                                </CardContent>
                            </Card>

                            {/* Manual Entry */}
                            <div className="space-y-2">
                                <Label htmlFor="manual-key">{t('manualEntry.label')}</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="manual-key"
                                        value={setupData.manualEntryKey}
                                        readOnly
                                        className="font-mono text-xs"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={copyManualKey}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <Button onClick={() => setStep('verify')} className="w-full">
                                {t('buttons.accountAdded')}
                            </Button>
                        </div>
                    )}

                    {/* Verify Step */}
                    {step === 'verify' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="verification-code">{t('verify.codeLabel')}</Label>
                                <Input
                                    id="verification-code"
                                    type="text"
                                    placeholder={t('verify.codePlaceholder')}
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
                                    onClick={() => setStep('setup')}
                                    className="flex-1"
                                >
                                    {t('buttons.back')}
                                </Button>
                                <Button
                                    onClick={handleVerify}
                                    disabled={loading || verificationCode.length !== 6}
                                    className="flex-1"
                                >
                                    {loading ? t('buttons.verifying') : t('buttons.verify')}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Backup Codes Step */}
                    {step === 'backup' && setupData && (
                        <div className="space-y-4">
                            <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{t('backup.warning')}</AlertDescription>
                            </Alert>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                                        {setupData.backupCodes.map((code, index) => (
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
                                    onClick={downloadBackupCodes}
                                    className="flex-1"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    {t('buttons.download')}
                                </Button>
                                <Button
                                    onClick={() => {
                                        onComplete();
                                        handleClose();
                                    }}
                                    className="flex-1"
                                >
                                    {t('buttons.complete')}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
