'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
    Mail,
    MessageSquare,
    Bell,
    Shield,
    LogIn,
    Key,
    User,
    Megaphone,
    Newspaper,
    Settings,
    Save,
    Loader2,
    type LucideIcon,
} from 'lucide-react';

interface NotificationPreferences {
    id: string;
    userId: string;
    // Email notifications
    emailAccountSecurity: boolean;
    emailLoginAlerts: boolean;
    emailPasswordChanges: boolean;
    emailProfileUpdates: boolean;
    emailMarketing: boolean;
    emailNewsletters: boolean;
    // SMS notifications
    smsAccountSecurity: boolean;
    smsLoginAlerts: boolean;
    smsPasswordChanges: boolean;
    smsProfileUpdates: boolean;
    smsMarketing: boolean;
    // App notifications
    appAccountSecurity: boolean;
    appLoginAlerts: boolean;
    appPasswordChanges: boolean;
    appProfileUpdates: boolean;
    appSystemUpdates: boolean;
    appMarketing: boolean;
}

// ✅ New structure for unified notification settings
interface NotificationSetting {
    key: string;
    label: string;
    description: string;
    icon: LucideIcon;
    recommended?: boolean;
    channels: {
        email?: keyof NotificationPreferences;
        sms?: keyof NotificationPreferences;
        app?: keyof NotificationPreferences;
    };
}

interface NotificationCategory {
    title: string;
    settings: NotificationSetting[];
}

interface NotificationSettingsFormProps {
    preferences: NotificationPreferences;
}

export function NotificationSettingsForm({
    preferences: initialPreferences,
}: NotificationSettingsFormProps) {
    const [preferences, setPreferences] = useState(initialPreferences);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const t = useTranslations('dashboard.account.notifications');

    const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
        setPreferences((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const getPreferenceValue = (key: keyof NotificationPreferences): boolean => {
        const value = preferences[key];
        if (typeof value === 'string') {
            return value === 'true';
        }
        return Boolean(value);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/user/notification-preferences', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preferences),
            });

            if (!response.ok) {
                throw new Error('Failed to save preferences');
            }

            toast.success(t('form.saveSuccess'));
            router.refresh();
        } catch (error) {
            toast.error(t('form.saveError'));
            console.error('Save preferences error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const notificationCategories: NotificationCategory[] = [
        {
            title: t('categories.security.title'),
            settings: [
                {
                    key: 'accountSecurity',
                    label: t('categories.security.settings.accountSecurity.label'),
                    description: t('categories.security.settings.accountSecurity.description'),
                    icon: Shield,
                    recommended: true,
                    channels: {
                        email: 'emailAccountSecurity',
                        sms: 'smsAccountSecurity',
                        app: 'appAccountSecurity',
                    },
                },
                {
                    key: 'loginAlerts',
                    label: t('categories.security.settings.loginAlerts.label'),
                    description: t('categories.security.settings.loginAlerts.description'),
                    icon: LogIn,
                    recommended: true,
                    channels: {
                        email: 'emailLoginAlerts',
                        sms: 'smsLoginAlerts',
                        app: 'appLoginAlerts',
                    },
                },
                {
                    key: 'passwordChanges',
                    label: t('categories.security.settings.passwordChanges.label'),
                    description: t('categories.security.settings.passwordChanges.description'),
                    icon: Key,
                    recommended: true,
                    channels: {
                        email: 'emailPasswordChanges',
                        sms: 'smsPasswordChanges',
                        app: 'appPasswordChanges',
                    },
                },
                {
                    key: 'profileUpdates',
                    label: t('categories.security.settings.profileUpdates.label'),
                    description: t('categories.security.settings.profileUpdates.description'),
                    icon: User,
                    channels: {
                        email: 'emailProfileUpdates',
                        sms: 'smsProfileUpdates',
                        app: 'appProfileUpdates',
                    },
                },
            ],
        },
        {
            title: t('categories.marketing.title'),
            settings: [
                {
                    key: 'marketing',
                    label: t('categories.marketing.settings.marketing.label'),
                    description: t('categories.marketing.settings.marketing.description'),
                    icon: Megaphone,
                    channels: {
                        email: 'emailMarketing',
                        sms: 'smsMarketing',
                        app: 'appMarketing',
                    },
                },
                {
                    key: 'newsletters',
                    label: t('categories.marketing.settings.newsletters.label'),
                    description: t('categories.marketing.settings.newsletters.description'),
                    icon: Newspaper,
                    channels: {
                        email: 'emailNewsletters',
                    },
                },
                {
                    key: 'systemUpdates',
                    label: t('categories.marketing.settings.systemUpdates.label'),
                    description: t('categories.marketing.settings.systemUpdates.description'),
                    icon: Settings,
                    recommended: true,
                    channels: {
                        app: 'appSystemUpdates',
                    },
                },
            ],
        },
    ];

    return (
        <div className="space-y-8">
            <Card>
                <CardContent className="space-y-8">
                    <div className="grid grid-cols-[1fr_100px_100px_100px] gap-4">
                        <div className="text-muted-foreground text-sm font-medium">
                            {t('headers.notificationType')}
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-sm font-medium">
                                <Mail className="h-4 w-4" />
                                {t('headers.email')}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-sm font-medium">
                                <MessageSquare className="h-4 w-4" />
                                {t('headers.sms')}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-sm font-medium">
                                <Bell className="h-4 w-4" />
                                {t('headers.inApp')}
                            </div>
                        </div>
                    </div>

                    {notificationCategories.map((category, categoryIndex) => (
                        <div key={category.title}>
                            {categoryIndex > 0 && <Separator className="mb-8" />}

                            <div className="mb-6">
                                <h3 className="mb-2 text-lg font-semibold">{category.title}</h3>
                            </div>

                            <div className="space-y-4">
                                {category.settings.map((setting) => {
                                    const SettingIcon = setting.icon;

                                    return (
                                        <div
                                            key={setting.key}
                                            className="grid grid-cols-[1fr_100px_100px_100px] items-center gap-4 rounded-lg border px-4 py-4"
                                        >
                                            <div className="flex items-start space-x-3">
                                                <SettingIcon className="text-muted-foreground mt-0.5 h-5 w-5 flex-shrink-0" />
                                                <div className="min-w-0 flex-1 space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Label className="leading-none font-medium">
                                                            {setting.label}
                                                        </Label>
                                                        {setting.recommended && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="flex-shrink-0 text-xs"
                                                            >
                                                                {t('badges.recommended')}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                                        {setting.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex justify-center">
                                                {setting.channels.email ? (
                                                    <Switch
                                                        id={`${setting.key}-email`}
                                                        checked={getPreferenceValue(
                                                            setting.channels.email
                                                        )}
                                                        onCheckedChange={(checked) =>
                                                            updatePreference(
                                                                setting.channels.email!,
                                                                checked
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <div className="text-muted-foreground text-sm">
                                                        —
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex justify-center">
                                                {setting.channels.sms ? (
                                                    <Switch
                                                        id={`${setting.key}-sms`}
                                                        checked={getPreferenceValue(
                                                            setting.channels.sms
                                                        )}
                                                        onCheckedChange={(checked) =>
                                                            updatePreference(
                                                                setting.channels.sms!,
                                                                checked
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <div className="text-muted-foreground text-sm">
                                                        —
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex justify-center">
                                                {setting.channels.app ? (
                                                    <Switch
                                                        id={`${setting.key}-app`}
                                                        checked={getPreferenceValue(
                                                            setting.channels.app
                                                        )}
                                                        onCheckedChange={(checked) =>
                                                            updatePreference(
                                                                setting.channels.app!,
                                                                checked
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <div className="text-muted-foreground text-sm">
                                                        —
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <div className="border-t pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="mb-1 font-medium">{t('quickActions.title')}</h4>
                                <p className="text-muted-foreground text-sm">
                                    {t('quickActions.description')}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const emailKeys: (keyof NotificationPreferences)[] = [
                                            'emailAccountSecurity',
                                            'emailLoginAlerts',
                                            'emailPasswordChanges',
                                            'emailProfileUpdates',
                                            'emailMarketing',
                                            'emailNewsletters',
                                        ];
                                        emailKeys.forEach((key) => updatePreference(key, true));
                                        toast.success(t('quickActions.enableAllEmailSuccess'));
                                    }}
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    {t('quickActions.enableAllEmail')}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const essentialKeys: (keyof NotificationPreferences)[] = [
                                            'emailAccountSecurity',
                                            'emailLoginAlerts',
                                            'emailPasswordChanges',
                                            'smsAccountSecurity',
                                            'smsLoginAlerts',
                                            'appAccountSecurity',
                                            'appLoginAlerts',
                                            'appPasswordChanges',
                                            'appSystemUpdates',
                                        ];

                                        Object.keys(preferences).forEach((key) => {
                                            if (key !== 'id' && key !== 'userId') {
                                                updatePreference(
                                                    key as keyof NotificationPreferences,
                                                    false
                                                );
                                            }
                                        });

                                        essentialKeys.forEach((key) => updatePreference(key, true));
                                        toast.success(t('quickActions.essentialOnlySuccess'));
                                    }}
                                >
                                    <Shield className="mr-2 h-4 w-4" />
                                    {t('quickActions.essentialOnly')}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <Button onClick={handleSave} disabled={isLoading} className="min-w-32">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('form.saving')}
                                </>
                            ) : (
                                <>
                                    <Save className="mr-1 h-4 w-4" />
                                    {t('form.savePreferences')}
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
