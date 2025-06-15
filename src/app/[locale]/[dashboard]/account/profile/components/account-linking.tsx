'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Users, AlertTriangle, ExternalLink, Unlink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { providers } from '@/lib/auth/providers';

interface Account {
    id: string;
    provider: string;
    providerAccountId: string;
    createdAt?: string;
    user?: {
        email?: string;
    };
}

interface AccountLinkingProps {
    accounts: Account[];
    className?: string;
}

export function AccountLinking({ accounts, className }: AccountLinkingProps) {
    const [loading, setLoading] = useState<string | null>(null);
    const t = useTranslations('dashboard.account.profile.accountLinking');
    const handleConnect = async (provider: string) => {
        try {
            setLoading(provider);
            await signIn(provider, {
                callbackUrl: `/dashboard/account/profile?connected=${provider}`,
                redirect: true,
            });
        } catch (error) {
            console.error('Account Linking', error);
            toast.error(t('messages.connectFailed'));
        } finally {
            setLoading(null);
        }
    };

    const handleDisconnect = async (provider: string) => {
        if (accounts.length <= 1) {
            toast.error(t('messages.cannotRemoveLast'));
            return;
        }

        try {
            setLoading(provider);

            const response = await fetch('/api/auth/account-linking', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider }),
            });

            if (!response.ok) throw new Error('Failed to disconnect');

            toast.success(t('messages.disconnectSuccess'));
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            console.error('Account Linking handle disconnect', error);
            toast.error(t('messages.disconnectFailed'));
        } finally {
            setLoading(null);
        }
    };

    const isConnected = (providerId: string) => accounts.some((acc) => acc.provider === providerId);
    console.log(accounts);
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {t('title')}
                </CardTitle>
                <CardDescription>{t('description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {accounts.length < 1 && (
                    <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                            {t('warning.keepOneAccount')}
                        </p>
                    </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                    {providers.map((provider) => {
                        const connected = isConnected(provider.id);
                        const isLoading = loading === provider.id;
                        const account = accounts.find((acc) => acc.provider === provider.id);

                        return (
                            <div
                                key={provider.id}
                                className="border-border hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full">
                                        <provider.logo className="h-7 w-7 text-black dark:text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium">{provider.name}</p>
                                        </div>
                                        {connected && (
                                            <p className="text-muted-foreground text-xs">
                                                {t('status.activeSince', {
                                                    date: account?.createdAt
                                                        ? new Date(account!.createdAt!)
                                                        : t('status.recently'),
                                                })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant={connected ? 'outline' : 'default'}
                                    size="sm"
                                    onClick={() =>
                                        connected
                                            ? handleDisconnect(provider.id)
                                            : handleConnect(provider.id)
                                    }
                                    disabled={isLoading}
                                    className={cn(
                                        'min-w-[90px]',
                                        connected &&
                                            'text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/20'
                                    )}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {connected
                                                ? t('buttons.removing')
                                                : t('buttons.connecting')}
                                        </>
                                    ) : connected ? (
                                        <>
                                            <Unlink className="mr-2 h-4 w-4" />
                                            {t('buttons.disconnect')}
                                        </>
                                    ) : (
                                        <>
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            {t('buttons.connect')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
