'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/i18n/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

            toast.success('Notification preferences saved successfully!');
            router.refresh();
        } catch (error) {
            toast.error('Failed to save preferences. Please try again.');
            console.error('Save preferences error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Unified notification configuration
    const notificationCategories: NotificationCategory[] = [
        {
            title: 'Security & Account',
            settings: [
                {
                    key: 'accountSecurity',
                    label: 'Account Security',
                    description: 'Important security updates and alerts',
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
                    label: 'Login Alerts',
                    description: 'New login notifications from different devices',
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
                    label: 'Password Changes',
                    description: 'Password reset and change confirmations',
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
                    label: 'Profile Updates',
                    description: 'Profile and account information changes',
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
            title: 'Marketing & Updates',
            settings: [
                {
                    key: 'marketing',
                    label: 'Marketing Communications',
                    description: 'Product updates and promotional content',
                    icon: Megaphone,
                    channels: {
                        email: 'emailMarketing',
                        sms: 'smsMarketing',
                        app: 'appMarketing',
                    },
                },
                {
                    key: 'newsletters',
                    label: 'Newsletters',
                    description: 'Weekly newsletters and tips',
                    icon: Newspaper,
                    channels: {
                        email: 'emailNewsletters',
                    },
                },
                {
                    key: 'systemUpdates',
                    label: 'System Updates',
                    description: 'App updates and maintenance notices',
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
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Bell className="h-5 w-5" />
                        Notification Preferences
                    </CardTitle>
                    <CardDescription>
                        Choose how you want to receive notifications for different types of events.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* ✅ Channel Headers - Adjusted column widths */}
                    <div className="grid grid-cols-[1fr_100px_100px_100px] gap-4">
                        <div className="text-muted-foreground text-sm font-medium">
                            Notification Type
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-sm font-medium">
                                <Mail className="h-4 w-4" />
                                Email
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-sm font-medium">
                                <MessageSquare className="h-4 w-4" />
                                SMS
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-sm font-medium">
                                <Bell className="h-4 w-4" />
                                In-App
                            </div>
                        </div>
                    </div>

                    {notificationCategories.map((category, categoryIndex) => (
                        <div key={category.title}>
                            {categoryIndex > 0 && <Separator className="mb-8" />}

                            {/* ✅ Category Title */}
                            <div className="mb-6">
                                <h3 className="mb-2 text-lg font-semibold">{category.title}</h3>
                            </div>

                            {/* ✅ Settings Grid - Adjusted column widths */}
                            <div className="space-y-4">
                                {category.settings.map((setting) => {
                                    const SettingIcon = setting.icon;

                                    return (
                                        <div
                                            key={setting.key}
                                            className="grid grid-cols-[1fr_100px_100px_100px] items-center gap-4 rounded-lg border px-4 py-4"
                                        >
                                            {/* ✅ Setting Info - Now takes more space */}
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
                                                                Recommended
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                                        {setting.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* ✅ Email Switch - Fixed width */}
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

                                            {/* ✅ SMS Switch - Fixed width */}
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

                                            {/* ✅ In-App Switch - Fixed width */}
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

                    {/* ✅ Bulk Actions */}
                    <div className="border-t pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="mb-1 font-medium">Quick Actions</h4>
                                <p className="text-muted-foreground text-sm">
                                    Enable or disable all notifications for each channel
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
                                        toast.success('All email notifications enabled');
                                    }}
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Enable All Email
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
                                        toast.success('Essential notifications enabled');
                                    }}
                                >
                                    <Shield className="mr-2 h-4 w-4" />
                                    Essential Only
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* ✅ Save Button */}
                    <div className="flex justify-end pt-6">
                        <Button onClick={handleSave} disabled={isLoading} className="min-w-32">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-1 h-4 w-4" />
                                    Save Preferences
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
