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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, Globe, Palette, Sun, Moon, Monitor, Save } from 'lucide-react';
import { User } from 'next-auth';
import { useTheme } from 'next-themes';
import { useLocale } from 'next-intl';
import { localesWithFlag } from '@/constants/locale';
import Image from 'next/image';

const preferencesSchema = z.object({
    locale: z.string().optional(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

interface PreferencesProps {
    user: User;
}

export function Preferences({ user }: PreferencesProps) {
    const { setTheme, theme } = useTheme();
    const currentLocale = useLocale();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const t = useTranslations('dashboard.account.profile.preferences');

    const themeOptions = [
        { value: 'light', label: t('theme.options.light'), icon: Sun },
        { value: 'dark', label: t('theme.options.dark'), icon: Moon },
        { value: 'system', label: t('theme.options.system'), icon: Monitor },
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
            theme: (user.theme as 'light' | 'dark' | 'system') || theme || 'system',
        },
    });

    useEffect(() => {
        reset({
            locale: user.locale || currentLocale || 'en',
            theme: (user.theme as 'light' | 'dark' | 'system') || theme || 'system',
        });
    }, [user, currentLocale, theme, reset]);

    const watchedLocale = watch('locale');
    const watchedTheme = watch('theme');

    const onSubmit = async (data: PreferencesFormData) => {
        setIsLoading(true);
        try {
            const changes: string[] = [];
            if (data.locale && data.locale !== (user.locale || currentLocale))
                changes.push(t('messages.changeTypes.language'));
            if (data.theme && data.theme !== (user.theme || theme))
                changes.push(t('messages.changeTypes.theme'));

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
                    setTheme(data.theme);
                    toast.success(t('messages.themeUpdateSuccess'));
                }

                if (result.localeChanged && data.locale) {
                    toast.success(t('messages.languageUpdateSuccess'));
                    router.push('/dashboard/account/profile/', { locale: data.locale });
                    router.refresh();
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
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

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Palette className="h-4 w-4" />
                                {t('theme.label')}
                            </Label>
                            <Select
                                value={watchedTheme || theme || 'system'}
                                onValueChange={(value) =>
                                    setValue('theme', value as 'light' | 'dark' | 'system', {
                                        shouldDirty: true,
                                    })
                                }
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('theme.placeholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {themeOptions.map((option) => {
                                        const Icon = option.icon;
                                        return (
                                            <SelectItem key={option.value} value={option.value}>
                                                <div className="flex items-center gap-2">
                                                    <Icon className="h-4 w-4" />
                                                    <span>{option.label}</span>
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading || !isDirty}
                            className="flex-1 md:flex-none"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-1 h-4 w-4" />
                            {t('buttons.save')}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.refresh()}
                            disabled={isLoading}
                        >
                            {t('buttons.cancel')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
