'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Smartphone, Key, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { TwoFactorSetupDialog } from './two-factor-setup-dialog';
import { TwoFactorDisableDialog } from './two-factor-disable-dialog';
import { BackupCodesDialog } from './backup-codes-dialog';

interface TwoFactorManagementProps {
    userId: string;
    twoFactorEnabled: boolean;
    twoFactorVerifiedAt: Date | null;
}

interface TwoFactorStatus {
    enabled: boolean;
    verifiedAt: Date | null;
    backupCodesCount: number;
}

export function TwoFactorManagement({
    userId,
    twoFactorEnabled: initialEnabled,
    twoFactorVerifiedAt: initialVerifiedAt,
}: TwoFactorManagementProps) {
    const [status, setStatus] = useState<TwoFactorStatus>({
        enabled: initialEnabled,
        verifiedAt: initialVerifiedAt,
        backupCodesCount: 0,
    });
    const [setupDialogOpen, setSetupDialogOpen] = useState(false);
    const [disableDialogOpen, setDisableDialogOpen] = useState(false);
    const [backupCodesDialogOpen, setBackupCodesDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const t = useTranslations('dashboard.account.security.twoFactor.management');

    console.log(`Two factor management ${userId}`);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch('/api/auth/2fa/status');
                if (response.ok) {
                    const data = await response.json();
                    setStatus(data);
                }
            } catch (error) {
                console.error('Failed to fetch 2FA status:', error);
            }
        };
        setLoading(false);
        fetchStatus();
    }, []);

    const handleSetupComplete = () => {
        setStatus((prev) => ({ ...prev, enabled: true, verifiedAt: new Date() }));
        setSetupDialogOpen(false);
        toast.success(t('messages.enableSuccess'));
    };

    const handleDisableComplete = () => {
        setStatus((prev) => ({
            ...prev,
            enabled: false,
            verifiedAt: null,
            backupCodesCount: 0,
        }));
        setDisableDialogOpen(false);
        toast.success(t('messages.disableSuccess'));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {t('card.title')}
                </CardTitle>
                <CardDescription>{t('card.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Status Overview */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`rounded-full p-2 ${
                                status.enabled
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                            <Smartphone className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="font-medium">{t('status.title')}</div>
                            <div className="text-muted-foreground text-sm">
                                {status.enabled
                                    ? t('status.enabled', {
                                          date: status.verifiedAt
                                              ? new Date(status.verifiedAt).toLocaleDateString()
                                              : t('status.unknown'),
                                      })
                                    : t('status.notEnabled')}
                            </div>
                        </div>
                    </div>
                    <Badge variant={status.enabled ? 'default' : 'secondary'}>
                        {status.enabled ? t('badge.enabled') : t('badge.disabled')}
                    </Badge>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    {!status.enabled ? (
                        <div className="space-y-4">
                            <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{t('alerts.recommendation')}</AlertDescription>
                            </Alert>

                            <Button
                                onClick={() => setSetupDialogOpen(true)}
                                disabled={loading}
                                className="w-full sm:w-auto"
                            >
                                <Shield className="mr-2 h-4 w-4" />
                                {t('buttons.enable')}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Alert className="border-green-200 bg-green-50">
                                <Shield className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    {t('alerts.protected')}
                                    {status.backupCodesCount > 0 && (
                                        <span className="mt-1 block">
                                            {t('alerts.backupCodes', {
                                                count: status.backupCodesCount,
                                            })}
                                        </span>
                                    )}
                                </AlertDescription>
                            </Alert>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Button
                                    variant="outline"
                                    onClick={() => setBackupCodesDialogOpen(true)}
                                    disabled={loading}
                                >
                                    <Key className="mr-2 h-4 w-4" />
                                    {t('buttons.viewBackupCodes')}
                                </Button>

                                <Button
                                    variant="destructive"
                                    onClick={() => setDisableDialogOpen(true)}
                                    disabled={loading}
                                >
                                    {t('buttons.disable')}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* How it works */}
                <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="mb-2 font-medium">{t('howItWorks.title')}</h4>
                    <ul className="text-muted-foreground space-y-1 text-sm">
                        <li>• {t('howItWorks.steps.download')}</li>
                        <li>• {t('howItWorks.steps.scan')}</li>
                        <li>• {t('howItWorks.steps.verify')}</li>
                        <li>• {t('howItWorks.steps.backup')}</li>
                    </ul>
                </div>
            </CardContent>

            {/* Dialogs */}
            <TwoFactorSetupDialog
                open={setupDialogOpen}
                onOpenChange={setSetupDialogOpen}
                onComplete={handleSetupComplete}
            />

            <TwoFactorDisableDialog
                open={disableDialogOpen}
                onOpenChange={setDisableDialogOpen}
                onComplete={handleDisableComplete}
            />

            <BackupCodesDialog
                open={backupCodesDialogOpen}
                onOpenChange={setBackupCodesDialogOpen}
            />
        </Card>
    );
}
