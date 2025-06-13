import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, User, Key, Shield, Monitor } from 'lucide-react';
import { SecurityStatus } from '@/lib/auth/security-status';
import { useTranslations } from 'next-intl';

interface User {
    emailVerified: Date | null;
    phoneVerified: boolean | null;
    password: string | null;
    role: string | null;
}

interface AccountStatusCardProps {
    user: User;
    securityStatus: SecurityStatus;
}

export const AccountStatusCard = ({ user, securityStatus }: AccountStatusCardProps) => {
    const t = useTranslations('dashboard.account.status');

    const getPasswordBadge = () => {
        if (!user.password) {
            return {
                variant: 'destructive' as const,
                className: 'bg-red-500 hover:bg-red-600',
                text: t('password.notSet'),
            };
        }

        switch (securityStatus.passwordStrength) {
            case 'strong':
                return {
                    variant: 'default' as const,
                    className: 'bg-green-500 hover:bg-green-600',
                    text: t('password.strong'),
                };
            case 'medium':
                return {
                    variant: 'secondary' as const,
                    className: 'bg-yellow-500 hover:bg-yellow-600',
                    text: t('password.medium'),
                };
            case 'weak':
                return {
                    variant: 'destructive' as const,
                    className: 'bg-red-500 hover:bg-red-600',
                    text: t('password.weak'),
                };
            default:
                return {
                    variant: 'secondary' as const,
                    className: 'bg-gray-500 hover:bg-gray-600',
                    text: t('password.unknown'),
                };
        }
    };

    const passwordBadge = getPasswordBadge();

    return (
        <Card className="bg-[url(/images/bg/bg-5.png)] bg-[length:700px] bg-[center_top_1.3rem] bg-no-repeat lg:col-span-2 dark:bg-[url(/images/bg/bg-5-dark.png)]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t('title')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Mail className="text-muted-foreground h-4 w-4" />
                            <span className="text-sm">{t('email.label')}</span>
                        </div>
                        <Badge
                            variant={user.emailVerified ? 'default' : 'destructive'}
                            className={
                                user.emailVerified
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : 'bg-red-500 hover:bg-red-600'
                            }
                        >
                            {user.emailVerified ? t('email.verified') : t('email.unverified')}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Phone className="text-muted-foreground h-4 w-4" />
                            <span className="text-sm">{t('phone.label')}</span>
                        </div>
                        <Badge
                            variant={user.phoneVerified ? 'default' : 'secondary'}
                            className={
                                user.phoneVerified
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : 'bg-gray-500 text-white hover:bg-gray-600'
                            }
                        >
                            {user.phoneVerified ? t('phone.verified') : t('phone.notAdded')}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Key className="text-muted-foreground h-4 w-4" />
                            <span className="text-sm">{t('twoFactor.label')}</span>
                        </div>
                        <Badge
                            variant={securityStatus.twoFactorEnabled ? 'default' : 'secondary'}
                            className={
                                securityStatus.twoFactorEnabled
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : 'bg-orange-500 hover:bg-orange-600'
                            }
                        >
                            {securityStatus.twoFactorEnabled
                                ? t('twoFactor.enabled')
                                : t('twoFactor.disabled')}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Shield className="text-muted-foreground h-4 w-4" />
                            <span className="text-sm">{t('password.label')}</span>
                        </div>
                        <Badge variant={passwordBadge.variant} className={passwordBadge.className}>
                            {passwordBadge.text}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Monitor className="text-muted-foreground h-4 w-4" />
                            <span className="text-sm">{t('sessions.label')}</span>
                        </div>
                        <Badge
                            variant="outline"
                            className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                            {t('sessions.active', { count: securityStatus.activeSessions })}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <User className="text-muted-foreground h-4 w-4" />
                            <span className="text-sm">{t('accountType.label')}</span>
                        </div>
                        <Badge
                            variant="outline"
                            className="border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
                        >
                            {user.role || 'User'}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
