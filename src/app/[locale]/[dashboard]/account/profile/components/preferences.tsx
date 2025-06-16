'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/lib/i18n/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, Globe, Palette, Save, CheckCircle, Bell } from 'lucide-react'; // 👈 Bell eklendi
import { User } from 'next-auth';
import useNextTheme from '@/hooks/useNextTheme';
import { useLocale } from 'next-intl';
import { localesWithFlag } from '@/constants/locale';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const preferencesSchema = z.object({
    locale: z.string().optional(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
    receiveUpdates: z.boolean().optional(),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

interface PreferencesProps {
    user: User;
}

export function Preferences({ user }: PreferencesProps) {
    const [, mounted, setTheme] = useNextTheme();
    const currentLocale = useLocale();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const t = useTranslations('dashboard.account.profile.preferences');

    const themeOptions = [
        {
            value: 'dark',
            label: t('theme.options.dark'),
            bgImage: '/images/themes/dark-theme-preview.jpg',
            bgClass: 'bg-gradient-to-br from-gray-900 to-gray-800',
        },
        {
            value: 'light',
            label: t('theme.options.light'),
            bgImage: '/images/themes/light-theme-preview.jpg',
            bgClass: 'bg-gradient-to-br from-gray-100 to-white',
        },
        {
            value: 'system',
            label: t('theme.options.system'),
            bgImage: '/images/themes/system-theme-preview.jpg',
            bgClass: 'bg-gradient-to-br from-blue-100 via-purple-50 to-teal-100',
        },
    ];

    const {
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { isDirty },
    } = useForm<PreferencesFormData>({
        resolver: zodResolver(preferencesSchema),
        mode: 'onChange',
        defaultValues: {
            locale: user.locale || currentLocale || 'en',
            theme: (user.theme as 'light' | 'dark' | 'system') || 'light',
            receiveUpdates: user.receiveUpdates ?? true,
        },
    });

    useEffect(() => {
        if (mounted) {
            const currentTheme = user.theme || 'light';
            reset({
                locale: user.locale || currentLocale || 'en',
                theme: currentTheme as 'light' | 'dark' | 'system',
                receiveUpdates: user.receiveUpdates ?? true,
            });
        }
    }, [mounted, user.theme, user.locale, user.receiveUpdates, currentLocale, reset]); // 👈 user.receiveUpdates eklendi

    const watchedLocale = watch('locale');
    const watchedTheme = watch('theme');
    const watchedReceiveUpdates = watch('receiveUpdates');

    const handleThemeSelect = (newTheme: string) => {
        setValue('theme', newTheme as any, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
        setTheme(newTheme);
    };

    const onSubmit = async (data: PreferencesFormData) => {
        setIsLoading(true);
        try {
            const changes: string[] = [];
            if (data.locale && data.locale !== (user.locale || currentLocale))
                changes.push(t('messages.changeTypes.language'));
            if (data.theme && data.theme !== user.theme)
                changes.push(t('messages.changeTypes.theme'));
            if (data.receiveUpdates !== undefined && data.receiveUpdates !== user.receiveUpdates)
                changes.push(t('messages.changeTypes.notifications'));

            const response = await fetch('/api/user/preferences', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                reset(data);

                if (result.themeChanged && data.theme) {
                    toast.success(t('messages.themeUpdateSuccess'));
                }

                if (result.localeChanged && data.locale) {
                    toast.success(t('messages.languageUpdateSuccess'));
                    router.push('/dashboard/account/profile/', { locale: data.locale });
                    router.refresh();
                }

                if (result.receiveUpdatesChanged !== undefined) {
                    toast.success(t('messages.notificationsUpdateSuccess'));
                }

                if (changes.length === 0) {
                    toast.success(t('messages.updateSuccess'));
                }
            } else {
                toast.error(result.error || t('messages.updateFailed'));
            }
        } catch (error) {
            console.error('Preferences update error:', error);
            toast.error(t('messages.updateError'));
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        {t('title')}
                    </CardTitle>
                    <CardDescription>{t('description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    {t('title')}
                </CardTitle>
                <CardDescription>{t('description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Language Selection */}
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-base font-medium">
                            <Globe className="h-4 w-4" />
                            {t('language.label')}
                        </Label>
                        <Select
                            value={watchedLocale || currentLocale}
                            onValueChange={(value) =>
                                setValue('locale', value, { shouldDirty: true })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('language.placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                {localesWithFlag.map((locale) => (
                                    <SelectItem key={locale.id} value={locale.id}>
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src={locale.flag}
                                                alt={t('language.flagAlt', {
                                                    language: locale.name,
                                                })}
                                                width={16}
                                                height={12}
                                                className="rounded-sm"
                                            />
                                            <span>{locale.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Theme Selection */}
                    <div className="space-y-5">
                        <div className="space-y-1">
                            <h3 className="flex items-center gap-2 text-base font-medium">
                                <Palette className="h-4 w-4" />
                                {t('theme.label')}
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
                            {themeOptions.map((option) => {
                                const isSelected = watchedTheme === option.value;
                                return (
                                    <div key={option.value} className="space-y-2">
                                        <label
                                            className={cn(
                                                'relative flex cursor-pointer items-end overflow-hidden rounded-xl border-2 transition-all duration-200',
                                                'h-[170px] bg-cover bg-center bg-no-repeat',
                                                isSelected
                                                    ? 'border-green-500 ring-2 ring-green-500/20'
                                                    : 'border-border hover:border-green-300',
                                                option.bgClass
                                            )}
                                            style={{
                                                backgroundImage: option.bgImage
                                                    ? `url(${option.bgImage})`
                                                    : undefined,
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="theme"
                                                value={option.value}
                                                checked={isSelected}
                                                onChange={() => handleThemeSelect(option.value)}
                                                className="sr-only"
                                                disabled={isLoading}
                                            />
                                            <div
                                                className={cn(
                                                    'mb-4 ml-4 transition-all duration-200',
                                                    isSelected ? 'opacity-100' : 'opacity-0'
                                                )}
                                            >
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                                                    <CheckCircle className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        </label>

                                        <div className="space-y-1">
                                            <span className="text-sm font-medium">
                                                {option.label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-base font-medium">
                            <Bell className="h-4 w-4" />
                            {t('notifications.label')}
                        </Label>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    id="receiveUpdates"
                                    checked={watchedReceiveUpdates}
                                    onCheckedChange={(checked) =>
                                        setValue('receiveUpdates', !!checked, { shouldDirty: true })
                                    }
                                    disabled={isLoading}
                                    className="mt-0.5"
                                />
                                <div className="space-y-1 leading-none">
                                    <label
                                        htmlFor="receiveUpdates"
                                        className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {t('notifications.receiveUpdates.label')}
                                    </label>
                                    <p className="text-muted-foreground text-sm">
                                        {t('notifications.receiveUpdates.description')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.refresh()}
                            disabled={isLoading}
                        >
                            {t('buttons.cancel')}
                        </Button>
                        <Button type="submit" disabled={isLoading || !isDirty}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" />
                            {t('buttons.save')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
