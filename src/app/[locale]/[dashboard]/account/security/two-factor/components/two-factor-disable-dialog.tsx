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

    const handleDisable = async () => {
        if (verificationCode.length !== 6) {
            setError('Please enter a valid 6-digit code');
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
                throw new Error(errorData.error || 'Failed to disable 2FA');
            }

            onComplete();
            handleClose();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to disable 2FA');
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
                        Disable Two-Factor Authentication
                    </DialogTitle>
                    <DialogDescription>
                        This will remove the extra security layer from your account.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            Warning: Disabling 2FA will make your account less secure. We recommend
                            keeping it enabled.
                        </AlertDescription>
                    </Alert>

                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="disable-code">
                            Enter your authentication code to confirm:
                        </Label>
                        <Input
                            id="disable-code"
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
                        <Button variant="outline" onClick={handleClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDisable}
                            disabled={loading || verificationCode.length !== 6}
                            className="flex-1"
                        >
                            {loading ? 'Disabling...' : 'Disable 2FA'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
