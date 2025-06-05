'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
import { useAvatar } from '@/contexts/avatar-context';
import { useNotificationService } from '@/hooks/useNotificationService';
import { User } from 'next-auth';
import { NotificationService } from '@/lib/services/notification-service';

const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    phone: z.string().optional(),
    image: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
    user: User;
}

const formatPhoneNumber = (value: string): string => {
    let cleaned = value.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) {
        return cleaned;
    }
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

    if (!cleaned.startsWith('+')) {
        return cleaned;
    }

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

    // Common country codes and their flags
    const countryFlags: { [key: string]: string } = {
        '1': '🇺🇸', // US/Canada
        '44': '🇬🇧', // UK
        '33': '🇫🇷', // France
        '49': '🇩🇪', // Germany
        '39': '🇮🇹', // Italy
        '34': '🇪🇸', // Spain
        '90': '🇹🇷', // Turkey
        '86': '🇨🇳', // China
        '91': '🇮🇳', // India
        '81': '🇯🇵', // Japan
        '82': '🇰🇷', // South Korea
        '55': '🇧🇷', // Brazil
        '7': '🇷🇺', // Russia
        '61': '🇦🇺', // Australia
        '31': '🇳🇱', // Netherlands
        '46': '🇸🇪', // Sweden
        '47': '🇳🇴', // Norway
        '45': '🇩🇰', // Denmark
        '358': '🇫🇮', // Finland
        '41': '🇨🇭', // Switzerland
        '43': '🇦🇹', // Austria
        '32': '🇧🇪', // Belgium
        '351': '🇵🇹', // Portugal
        '30': '🇬🇷', // Greece
        '48': '🇵🇱', // Poland
        '420': '🇨🇿', // Czech Republic
        '36': '🇭🇺', // Hungary
    };

    const threeDigit = cleaned.substring(0, 3);
    if (countryFlags[threeDigit]) {
        return countryFlags[threeDigit];
    }

    const twoDigit = cleaned.substring(0, 2);
    if (countryFlags[twoDigit]) {
        return countryFlags[twoDigit];
    }

    const oneDigit = cleaned.substring(0, 1);
    if (countryFlags[oneDigit]) {
        return countryFlags[oneDigit];
    }

    return '🌍';
};

export function ProfileForm({ user }: ProfileFormProps) {
    const { updateAvatar, removeAvatar } = useAvatar();
    const [isLoading, setIsLoading] = useState(false);
    const [phoneVerification, setPhoneVerification] = useState({
        isVerifying: false,
        codeSent: false,
        code: '',
        cooldown: 0,
        isVerified: Boolean(user.phoneVerified),
    });
    const { createProfileUpdated } = useNotificationService();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isDirty },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
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

        // Reset verification if phone changes
        if (formatted !== user.phone) {
            setPhoneVerification(prev => ({
                ...prev,
                isVerified: false,
                codeSent: false,
                code: '',
            }));
        } else if (formatted === user.phone && user.phoneVerified) {
            setPhoneVerification(prev => ({
                ...prev,
                isVerified: true,
                codeSent: false,
                code: '',
            }));
        }
    };

    const sendVerificationCode = async () => {
        if (!watchedPhone) {
            toast.error('Please enter a phone number first');
            return;
        }

        // Validate phone number format
        if (!validatePhoneNumber(watchedPhone)) {
            toast.error('Please enter a valid international phone number (+1234567890)');
            return;
        }

        const cleanPhone = getCleanPhoneNumber(watchedPhone);
        setPhoneVerification(prev => ({ ...prev, isVerifying: true }));

        try {
            const response = await fetch('/api/user/phone/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: cleanPhone }),
            });

            const result = await response.json();

            if (result.success) {
                setPhoneVerification(prev => ({
                    ...prev,
                    codeSent: true,
                    cooldown: result.cooldownSeconds || 60,
                }));
                toast.success('Verification code sent!');

                // Start cooldown timer
                const timer = setInterval(() => {
                    setPhoneVerification(prev => {
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
                    setPhoneVerification(prev => ({
                        ...prev,
                        cooldown: result.cooldownSeconds,
                    }));
                }
            }
        } catch (error) {
            console.error('Send verification error:', error);
            toast.error('Failed to send verification code');
        } finally {
            setPhoneVerification(prev => ({ ...prev, isVerifying: false }));
        }
    };

    const verifyCode = async () => {
        if (!phoneVerification.code) {
            toast.error('Please enter the verification code');
            return;
        }

        if (!watchedPhone) {
            toast.error('Phone number is required');
            return;
        }

        const cleanPhone = getCleanPhoneNumber(watchedPhone);
        setPhoneVerification(prev => ({ ...prev, isVerifying: true }));

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
                setPhoneVerification(prev => ({
                    ...prev,
                    isVerified: true,
                    codeSent: false,
                    code: '',
                    isVerifying: false,
                }));

                setValue('phone', watchedPhone, { shouldDirty: false });

                toast.success('Phone number verified successfully!');

                await NotificationService.createPhoneVerifiedFromClient(
                    cleanPhone,
                    getCountryFlag(watchedPhone)
                );

                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Verify code error:', error);
            toast.error('Failed to verify code');
        } finally {
            setPhoneVerification(prev => ({ ...prev, isVerifying: false }));
        }
    };

    const onSubmit = async (data: ProfileFormData) => {
        setIsLoading(true);
        try {
            const changes: string[] = [];
            if (data.firstName !== user.firstName) changes.push('First Name');
            if (data.lastName !== user.lastName) changes.push('Last Name');
            if (data.phone !== user.phone) changes.push('Phone Number');
            if (data.image !== user.image) changes.push('Profile Picture');

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
                if (result.phoneVerificationReset) {
                    setPhoneVerification(prev => ({
                        ...prev,
                        isVerified: false,
                        codeSent: false,
                        code: '',
                        cooldown: 0,
                    }));
                    toast.info('Phone number updated. Please verify your new number.', {
                        duration: 4000,
                    });
                } else {
                    toast.success('Profile updated successfully!');
                }

                if (changes.length > 0) {
                    await createProfileUpdated(changes);
                }

                updateAvatar(data.image || null);
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error('Something went wrong. Please try again.');
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
                toast.success('Profile picture removed successfully!');
                router.refresh();
            } else {
                throw new Error(result.error || 'Failed to remove image');
            }
        } catch (error) {
            console.error('Remove image error:', error);
            toast.error('Failed to remove profile picture.');
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
                    Profile Information
                </CardTitle>
                <CardDescription>
                    Update your personal information and profile picture
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label>Profile Picture</Label>
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

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                                id="firstName"
                                placeholder="Enter your first name"
                                {...register('firstName')}
                                disabled={isLoading}
                            />
                            {errors.firstName && (
                                <p className="text-destructive text-sm">
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                                id="lastName"
                                placeholder="Enter your last name"
                                {...register('lastName')}
                                disabled={isLoading}
                            />
                            {errors.lastName && (
                                <p className="text-destructive text-sm">
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
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

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="phone">Phone Number</Label>

                            {watchedPhone && (
                                <span className="text-sm">{getCountryFlag(watchedPhone)}</span>
                            )}

                            {isCurrentPhoneVerified ? (
                                <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                    <Check className="h-3 w-3" />
                                    Verified
                                </span>
                            ) : watchedPhone &&
                              watchedPhone === user.phone &&
                              !user.phoneVerified &&
                              !phoneVerification.isVerified ? (
                                <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                                    <AlertCircle className="h-3 w-3" />
                                    Not Verified
                                </span>
                            ) : phoneNeedsVerification ? (
                                <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                    <AlertCircle className="h-3 w-3" />
                                    Verification Required
                                </span>
                            ) : null}
                        </div>

                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Phone className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+1 234 567 8900"
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
                                    className="shrink-0">
                                    {phoneVerification.isVerifying ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                    {phoneVerification.cooldown > 0
                                        ? `${phoneVerification.cooldown}s`
                                        : 'Send Code'}
                                </Button>
                            )}
                        </div>

                        {watchedPhone && !validatePhoneNumber(watchedPhone) && (
                            <p className="text-destructive text-xs">
                                ⚠️ Please enter a valid international phone number (7-15 digits)
                            </p>
                        )}

                        {phoneVerification.codeSent && !phoneVerification.isVerified && (
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                            Enter Verification Code
                                        </span>
                                    </div>

                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                        We sent a 6-digit code to{' '}
                                        {watchedPhone ? getCountryFlag(watchedPhone) : '🌍'}{' '}
                                        {watchedPhone
                                            ? formatPhoneForDisplay(watchedPhone)
                                            : 'your phone'}
                                    </p>

                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="000000"
                                            value={phoneVerification.code}
                                            onChange={e =>
                                                setPhoneVerification(prev => ({
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
                                            className="shrink-0">
                                            {phoneVerification.isVerifying ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Shield className="h-4 w-4" />
                                            )}
                                            Verify
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
                                    📱 Phone verification is required for security features and
                                    notifications
                                </p>
                            )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading || !isDirty}
                            className="flex-1 md:flex-none">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.refresh()}
                            disabled={isLoading}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
