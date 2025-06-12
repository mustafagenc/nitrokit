'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/i18n/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import {
    User as UserIcon,
    Phone,
    Mail,
    Loader2,
    Shield,
    Check,
    Send,
    AlertCircle,
    Save,
} from 'lucide-react';
import { useAvatar } from '@/contexts/avatar-context';
import { useInAppNotificationService } from '@/hooks/useInAppNotificationService';
import { User } from 'next-auth';
import { InAppNotificationService } from '@/lib/services/inapp-notification-service';

const profileInfoSchema = z.object({
    firstName: z.string().min(1, 'validation.required.firstName').max(50),
    lastName: z.string().min(1, 'validation.required.lastName').max(50),
    phone: z.string().optional(),
    image: z.string().optional(),
});

type ProfileInfoFormData = z.infer<typeof profileInfoSchema>;

interface ProfileInformationProps {
    user: User;
}

// Phone utility functions
const formatPhoneNumber = (value: string): string => {
    let cleaned = value.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) return cleaned;
    if (cleaned.length > 0 && !cleaned.startsWith('+')) {
        cleaned = '+' + cleaned;
    }
    return cleaned;
};

const validatePhoneNumber = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
};

const getCleanPhoneNumber = (formatted: string): string => {
    return formatted.replace(/\s/g, '');
};

const formatPhoneForDisplay = (phone: string): string => {
    const cleaned = phone.replace(/[^\d+]/g, '');
    if (!cleaned.startsWith('+')) return cleaned;

    const withoutPlus = cleaned.substring(1);
    if (withoutPlus.length >= 10) {
        const countryCode = withoutPlus.substring(0, 2);
        const remaining = withoutPlus.substring(2);

        if (remaining.length >= 8) {
            const part1 = remaining.substring(0, 3);
            const part2 = remaining.substring(3, 6);
            const part3 = remaining.substring(6);
            return `+${countryCode} ${part1} ${part2} ${part3}`;
        }
    }
    return cleaned;
};

const getCountryFlag = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    const countryFlags: { [key: string]: string } = {
        '1': '🇺🇸',
        '44': '🇬🇧',
        '33': '🇫🇷',
        '49': '🇩🇪',
        '39': '🇮🇹',
        '34': '🇪🇸',
        '90': '🇹🇷',
        '86': '🇨🇳',
        '91': '🇮🇳',
        '81': '🇯🇵',
        '82': '🇰🇷',
        '55': '🇧🇷',
        '7': '🇷🇺',
        '61': '🇦🇺',
        '31': '🇳🇱',
        '46': '🇸🇪',
        '47': '🇳🇴',
        '45': '🇩🇰',
        '358': '🇫🇮',
        '41': '🇨🇭',
        '43': '🇦🇹',
        '32': '🇧🇪',
        '351': '🇵🇹',
        '30': '🇬🇷',
        '48': '🇵🇱',
        '420': '🇨🇿',
        '36': '🇭🇺',
    };

    const threeDigit = cleaned.substring(0, 3);
    if (countryFlags[threeDigit]) return countryFlags[threeDigit];

    const twoDigit = cleaned.substring(0, 2);
    if (countryFlags[twoDigit]) return countryFlags[twoDigit];

    const oneDigit = cleaned.substring(0, 1);
    if (countryFlags[oneDigit]) return countryFlags[oneDigit];

    return '🌍';
};

export function ProfileInformation({ user }: ProfileInformationProps) {
    const { updateAvatar, removeAvatar } = useAvatar();
    const [isLoading, setIsLoading] = useState(false);
    const [phoneVerification, setPhoneVerification] = useState({
        isVerifying: false,
        codeSent: false,
        code: '',
        cooldown: 0,
        isVerified: Boolean(user.phoneVerified),
    });
    const { createProfileUpdated } = useInAppNotificationService();
    const router = useRouter();
    const t = useTranslations('dashboard.account.profile.profileInformation');
    const tValidation = useTranslations('validation');

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isDirty },
    } = useForm<ProfileInfoFormData>({
        resolver: zodResolver(profileInfoSchema),
        mode: 'onChange',
        defaultValues: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            phone: user.phone || '',
            image: user.image || '',
        },
    });

    const watchedImage = watch('image');
    const watchedPhone = watch('phone');

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setValue('phone', formatted, { shouldDirty: true });

        if (formatted !== user.phone) {
            setPhoneVerification((prev) => ({
                ...prev,
                isVerified: false,
                codeSent: false,
                code: '',
            }));
        } else if (formatted === user.phone && user.phoneVerified) {
            setPhoneVerification((prev) => ({
                ...prev,
                isVerified: true,
                codeSent: false,
                code: '',
            }));
        }
    };

    const sendVerificationCode = async () => {
        if (!watchedPhone || !validatePhoneNumber(watchedPhone)) {
            toast.error(t('phone.validation.invalidFormat'));
            return;
        }

        const cleanPhone = getCleanPhoneNumber(watchedPhone);
        setPhoneVerification((prev) => ({ ...prev, isVerifying: true }));

        try {
            const response = await fetch('/api/user/phone/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: cleanPhone }),
            });

            const result = await response.json();

            if (result.success) {
                setPhoneVerification((prev) => ({
                    ...prev,
                    codeSent: true,
                    cooldown: result.cooldownSeconds || 60,
                }));
                toast.success(t('phone.verification.codeSent'));

                const timer = setInterval(() => {
                    setPhoneVerification((prev) => {
                        if (prev.cooldown <= 1) {
                            clearInterval(timer);
                            return { ...prev, cooldown: 0 };
                        }
                        return { ...prev, cooldown: prev.cooldown - 1 };
                    });
                }, 1000);
            } else {
                toast.error(result.message);
                if (result.cooldownSeconds) {
                    setPhoneVerification((prev) => ({
                        ...prev,
                        cooldown: result.cooldownSeconds,
                    }));
                }
            }
        } catch (error) {
            console.error('Send verification error:', error);
            toast.error(t('phone.verification.sendError'));
        } finally {
            setPhoneVerification((prev) => ({ ...prev, isVerifying: false }));
        }
    };

    const verifyCode = async () => {
        if (!phoneVerification.code || !watchedPhone) {
            toast.error(t('phone.verification.enterCode'));
            return;
        }

        const cleanPhone = getCleanPhoneNumber(watchedPhone);
        setPhoneVerification((prev) => ({ ...prev, isVerifying: true }));

        try {
            const response = await fetch('/api/user/phone/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phoneNumber: cleanPhone,
                    code: phoneVerification.code,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setPhoneVerification((prev) => ({
                    ...prev,
                    isVerified: true,
                    codeSent: false,
                    code: '',
                    isVerifying: false,
                }));

                setValue('phone', watchedPhone, { shouldDirty: false });
                toast.success(t('phone.verification.success'));

                await InAppNotificationService.createPhoneVerifiedFromClient(
                    cleanPhone,
                    getCountryFlag(watchedPhone)
                );

                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Verify code error:', error);
            toast.error(t('phone.verification.verifyError'));
        } finally {
            setPhoneVerification((prev) => ({ ...prev, isVerifying: false }));
        }
    };

    const onSubmit = async (data: ProfileInfoFormData) => {
        setIsLoading(true);
        try {
            const changes: string[] = [];
            if (data.firstName !== user.firstName) changes.push(t('form.changeTypes.firstName'));
            if (data.lastName !== user.lastName) changes.push(t('form.changeTypes.lastName'));
            if (data.phone !== user.phone) changes.push(t('form.changeTypes.phone'));
            if (data.image !== user.image) changes.push(t('form.changeTypes.image'));

            const response = await fetch('/api/user/profile', {
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

                if (result.phoneVerificationReset) {
                    setPhoneVerification((prev) => ({
                        ...prev,
                        isVerified: false,
                        codeSent: false,
                        code: '',
                        cooldown: 0,
                    }));
                    toast.info(t('messages.phoneUpdated'), {
                        duration: 4000,
                    });
                } else {
                    toast.success(t('messages.updateSuccess'));
                }

                if (changes.length > 0) {
                    await createProfileUpdated(changes);
                }

                updateAvatar(data.image || null);
                router.refresh();
            } else {
                toast.error(result.error || t('messages.updateFailed'));
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error(t('messages.updateError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (url: string) => {
        setValue('image', url, { shouldDirty: true });
        updateAvatar(url || null);
    };

    const handleImageRemove = async () => {
        try {
            const response = await fetch('/api/user/avatar', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setValue('image', '', { shouldDirty: true });
                removeAvatar();
                toast.success(t('image.removeSuccess'));
                router.refresh();
            } else {
                throw new Error(result.error || 'Failed to remove image');
            }
        } catch (error) {
            console.error('Remove image error:', error);
            toast.error(t('image.removeError'));
        }
    };

    const phoneNeedsVerification =
        watchedPhone &&
        validatePhoneNumber(watchedPhone) &&
        watchedPhone !== user.phone &&
        !phoneVerification.isVerified;

    const isCurrentPhoneVerified =
        (watchedPhone === user.phone && user.phoneVerified === true) ||
        (phoneVerification.isVerified && watchedPhone);

    const shouldShowSendButton =
        watchedPhone && validatePhoneNumber(watchedPhone) && !isCurrentPhoneVerified;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    {t('title')}
                </CardTitle>
                <CardDescription>{t('description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Profile Picture */}
                    <div className="space-y-2">
                        <Label>{t('image.label')}</Label>
                        <ImageUpload
                            value={watchedImage || ''}
                            onChange={handleImageChange}
                            onRemove={handleImageRemove}
                            disabled={isLoading}
                            fallback={
                                `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}` ||
                                user.name?.charAt(0) ||
                                user.email.charAt(0)
                            }
                        />
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">{t('firstName.label')} *</Label>
                            <Input
                                id="firstName"
                                placeholder={t('firstName.placeholder')}
                                {...register('firstName')}
                                disabled={isLoading}
                            />
                            {errors.firstName && (
                                <p className="text-destructive text-sm">
                                    {tValidation(errors.firstName.message as any)}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">{t('lastName.label')} *</Label>
                            <Input
                                id="lastName"
                                placeholder={t('lastName.placeholder')}
                                {...register('lastName')}
                                disabled={isLoading}
                            />
                            {errors.lastName && (
                                <p className="text-destructive text-sm">
                                    {tValidation(errors.lastName.message as any)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('email.label')}</Label>
                        <div className="relative">
                            <Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                            <Input
                                id="email"
                                type="email"
                                value={user.email}
                                disabled
                                className="bg-muted pl-10"
                            />
                        </div>
                    </div>

                    {/* Phone Field with Verification */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="phone">{t('phone.label')}</Label>

                            {watchedPhone && (
                                <span className="text-sm">{getCountryFlag(watchedPhone)}</span>
                            )}

                            {isCurrentPhoneVerified ? (
                                <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                    <Check className="h-3 w-3" />
                                    {t('phone.status.verified')}
                                </span>
                            ) : watchedPhone &&
                              watchedPhone === user.phone &&
                              !user.phoneVerified &&
                              !phoneVerification.isVerified ? (
                                <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                                    <AlertCircle className="h-3 w-3" />
                                    {t('phone.status.notVerified')}
                                </span>
                            ) : phoneNeedsVerification ? (
                                <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                    <AlertCircle className="h-3 w-3" />
                                    {t('phone.status.verificationRequired')}
                                </span>
                            ) : null}
                        </div>

                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Phone className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder={t('phone.placeholder')}
                                    className="pl-10"
                                    value={watchedPhone || ''}
                                    onChange={handlePhoneChange}
                                    disabled={isLoading}
                                />
                            </div>

                            {shouldShowSendButton && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={sendVerificationCode}
                                    disabled={
                                        phoneVerification.isVerifying ||
                                        phoneVerification.cooldown > 0
                                    }
                                    className="shrink-0"
                                >
                                    {phoneVerification.isVerifying ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                    {phoneVerification.cooldown > 0
                                        ? t('phone.verification.cooldown', {
                                              seconds: phoneVerification.cooldown,
                                          })
                                        : t('phone.verification.sendCode')}
                                </Button>
                            )}
                        </div>

                        {watchedPhone && !validatePhoneNumber(watchedPhone) && (
                            <p className="text-destructive text-xs">
                                ⚠️ {t('phone.validation.invalidFormat')}
                            </p>
                        )}

                        {/* Verification Code Input */}
                        {phoneVerification.codeSent && !phoneVerification.isVerified && (
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                            {t('phone.verification.enterCodeTitle')}
                                        </span>
                                    </div>

                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                        {t('phone.verification.codeInstructions', {
                                            flag: watchedPhone
                                                ? getCountryFlag(watchedPhone)
                                                : '🌍',
                                            phone: watchedPhone
                                                ? formatPhoneForDisplay(watchedPhone)
                                                : t('phone.verification.yourPhone'),
                                        })}
                                    </p>

                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="000000"
                                            value={phoneVerification.code}
                                            onChange={(e) =>
                                                setPhoneVerification((prev) => ({
                                                    ...prev,
                                                    code: e.target.value
                                                        .replace(/\D/g, '')
                                                        .slice(0, 6),
                                                }))
                                            }
                                            maxLength={6}
                                            className="flex-1 text-center font-mono text-lg tracking-widest"
                                            autoComplete="one-time-code"
                                        />
                                        <Button
                                            type="button"
                                            onClick={verifyCode}
                                            disabled={
                                                phoneVerification.isVerifying ||
                                                phoneVerification.code.length !== 6
                                            }
                                            className="shrink-0"
                                        >
                                            {phoneVerification.isVerifying ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Shield className="h-4 w-4" />
                                            )}
                                            {t('phone.verification.verify')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {errors.phone && (
                            <p className="text-destructive text-sm">{errors.phone.message}</p>
                        )}

                        {watchedPhone &&
                            validatePhoneNumber(watchedPhone) &&
                            !isCurrentPhoneVerified && (
                                <p className="text-muted-foreground text-xs">
                                    📱 {t('phone.verification.requirement')}
                                </p>
                            )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading || !isDirty}
                            className="flex-1 md:flex-none"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-1 h-4 w-4" /> {t('form.saveChanges')}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.refresh()}
                            disabled={isLoading}
                        >
                            {t('form.cancel')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
