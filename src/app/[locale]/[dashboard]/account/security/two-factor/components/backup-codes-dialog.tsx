'use client';

import { useState } from 'react';
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

    const downloadCodes = () => {
        if (backupCodes.length === 0) return;

        const content = `Nitrokit Two-Factor Authentication Backup Codes

IMPORTANT: Save these codes in a secure location. 
Each code can only be used once.

${backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n')}

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
    };

    const regenerateCodes = async () => {
        if (verificationCode.length !== 6) {
            setError('Please enter a valid 6-digit code');
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
                throw new Error(errorData.error || 'Failed to regenerate codes');
            }

            const data = await response.json();
            setBackupCodes(data.backupCodes);
            setShowRegenerate(false);
            setVerificationCode('');
            toast.success('New backup codes generated');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to regenerate codes');
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
                    <DialogTitle>Backup Codes</DialogTitle>
                    <DialogDescription>
                        Use these codes if you lose access to your authenticator app.
                    </DialogDescription>
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
                                <AlertDescription>
                                    To view or regenerate your backup codes, you need to verify your
                                    identity.
                                </AlertDescription>
                            </Alert>

                            <Button onClick={() => setShowRegenerate(true)} className="w-full">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Generate New Backup Codes
                            </Button>
                        </div>
                    )}

                    {showRegenerate && (
                        <div className="space-y-4">
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    Generating new codes will invalidate all previous backup codes.
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-2">
                                <Label htmlFor="verify-code">Enter your authentication code:</Label>
                                <Input
                                    id="verify-code"
                                    type="text"
                                    placeholder="000000"
                                    value={verificationCode}
                                    onChange={e => {
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
                                    className="flex-1">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={regenerateCodes}
                                    disabled={loading || verificationCode.length !== 6}
                                    className="flex-1">
                                    {loading ? 'Generating...' : 'Generate'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {backupCodes.length > 0 && (
                        <div className="space-y-4">
                            <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    Save these codes in a secure location. Each code can only be
                                    used once.
                                </AlertDescription>
                            </Alert>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                                        {backupCodes.map((code, index) => (
                                            <div
                                                key={index}
                                                className="bg-muted rounded p-2 text-center">
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
                                    className="flex-1">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Button>
                                <Button onClick={() => setShowRegenerate(true)} className="flex-1">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Regenerate
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
