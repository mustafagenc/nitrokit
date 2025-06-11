'use client';

import { useState, useEffect } from 'react';
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

    // Setup başlat
    const handleSetupStart = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch('/api/auth/2fa/setup', {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to setup 2FA');
            }

            const data = await response.json();
            setSetupData(data);
            setStep('setup');
        } catch (error) {
            setError('Failed to initialize 2FA setup. Please try again.');
            console.error('2FA setup error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Dialog açıldığında setup başlat
    useEffect(() => {
        if (open && step === 'loading') {
            handleSetupStart();
        }
    }, [open, step]);

    // Verification kod doğrula
    const handleVerify = async () => {
        if (!setupData || verificationCode.length !== 6) {
            setError('Please enter a valid 6-digit code');
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
                throw new Error(errorData.error || 'Verification failed');
            }

            setStep('backup');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    // Manual entry key'i kopyala
    const copyManualKey = () => {
        if (setupData?.manualEntryKey) {
            navigator.clipboard.writeText(setupData.manualEntryKey);
            toast.success('Setup key copied to clipboard');
        }
    };

    // Backup kodları indir
    const downloadBackupCodes = () => {
        if (setupData?.backupCodes) {
            const content = `Nitrokit Two-Factor Authentication Backup Codes

IMPORTANT: Save these codes in a secure location. 
Each code can only be used once.

${setupData.backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
`;

            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'nitrokit-backup-codes.txt';
            a.click();
            URL.revokeObjectURL(url);

            toast.success('Backup codes downloaded');
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

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        {step === 'setup' && 'Set up Two-Factor Authentication'}
                        {step === 'verify' && 'Verify Your Setup'}
                        {step === 'backup' && 'Save Your Backup Codes'}
                        {step === 'loading' && 'Setting up 2FA...'}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 'setup' && 'Scan the QR code with your authenticator app'}
                        {step === 'verify' && 'Enter the code from your authenticator app'}
                        {step === 'backup' && 'Save these codes in a secure location'}
                        {step === 'loading' && 'Please wait while we prepare your setup...'}
                    </DialogDescription>
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
                                        alt="2FA QR Code"
                                        width={200}
                                        height={200}
                                        className="rounded-lg"
                                    />
                                </CardContent>
                            </Card>

                            {/* Manual Entry */}
                            <div className="space-y-2">
                                <Label htmlFor="manual-key">
                                    Can&apos;t scan? Enter this key manually:
                                </Label>
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
                                I&apos;ve Added the Account
                            </Button>
                        </div>
                    )}

                    {/* Verify Step */}
                    {step === 'verify' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="verification-code">
                                    Enter the 6-digit code from your app:
                                </Label>
                                <Input
                                    id="verification-code"
                                    type="text"
                                    placeholder="000000"
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
                                    Back
                                </Button>
                                <Button
                                    onClick={handleVerify}
                                    disabled={loading || verificationCode.length !== 6}
                                    className="flex-1"
                                >
                                    {loading ? 'Verifying...' : 'Verify'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Backup Codes Step */}
                    {step === 'backup' && setupData && (
                        <div className="space-y-4">
                            <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    Save these backup codes in a secure location. Each code can only
                                    be used once.
                                </AlertDescription>
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
                                    Download
                                </Button>
                                <Button
                                    onClick={() => {
                                        onComplete();
                                        handleClose();
                                    }}
                                    className="flex-1"
                                >
                                    Complete Setup
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
