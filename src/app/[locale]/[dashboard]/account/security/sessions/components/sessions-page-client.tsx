'use client';

import { useTranslations } from 'next-intl';
import { useSessionCheck } from '@/hooks/useSessionCheck';
import { SessionsTable } from './sessions-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

export function SessionsPageClient() {
    useSessionCheck();
    const t = useTranslations('dashboard.account.security.sessions');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">{t('client.heading')}</h2>
                <p className="text-muted-foreground">{t('client.subheading')}</p>
            </div>

            <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>{t('client.securityAlert')}</AlertDescription>
            </Alert>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            {t('client.currentSessions.title')}
                        </CardTitle>
                        <CardDescription>{t('client.currentSessions.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SessionsTable />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            {t('client.securityTips.title')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">
                                {t('client.securityTips.subtitle')}
                            </h4>
                            <ul className="text-muted-foreground space-y-1 text-sm">
                                <li>• {t('client.securityTips.tips.publicComputers')}</li>
                                <li>• {t('client.securityTips.tips.reviewSessions')}</li>
                                <li>• {t('client.securityTips.tips.twoFactor')}</li>
                                <li>• {t('client.securityTips.tips.strongPasswords')}</li>
                                <li>• {t('client.securityTips.tips.signOutAll')}</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
