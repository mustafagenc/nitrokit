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
import { User, Phone, Mail, Loader2, Shield, Check, Send } from 'lucide-react';
import { useAvatar } from '@/contexts/avatar-context';
import { useNotificationService } from '@/hooks/useNotificationService';

const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    phone: z.string().optional(),
    image: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
    user: {
        id: string;
        firstName?: string | null;
        lastName?: string | null;
        name?: string | null;
        email: string;
        phone?: string | null;
        phoneVerified?: boolean;
        image?: string | null;
        role: string;
    };
}

export function ProfileForm({ user }: ProfileFormProps) {
    const { updateAvatar, removeAvatar } = useAvatar();
    const [isLoading, setIsLoading] = useState(false);
    const [phoneVerification, setPhoneVerification] = useState({
        isVerifying: false,
        codeSent: false,
        code: '',
        cooldown: 0,
        isVerified: user.phoneVerified || false,
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

    // Send verification code
    const sendVerificationCode = async () => {
        if (!watchedPhone) {
            toast.error('Please enter a phone number first');
            return;
        }

        setPhoneVerification(prev => ({ ...prev, isVerifying: true }));

        try {
            const response = await fetch('/api/user/phone/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: watchedPhone }),
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

    // Verify code
    const verifyCode = async () => {
        if (!phoneVerification.code) {
            toast.error('Please enter the verification code');
            return;
        }

        setPhoneVerification(prev => ({ ...prev, isVerifying: true }));

        try {
            const response = await fetch('/api/user/phone/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phoneNumber: watchedPhone,
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
                }));
                toast.success('Phone number verified successfully!');
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
                if (changes.length > 0) {
                    await createProfileUpdated(changes);
                }

                updateAvatar(data.image || null);
                toast.success('Profile updated successfully!');
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

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                </CardTitle>
                <CardDescription>
                    Update your personal information and profile picture
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Profile Picture */}
                    <div className="space-y-2">
                        <Label>Profile Picture</Label>
                        <ImageUpload
                            value={watchedImage || ''}
                            onChange={handleImageChange}
                            onRemove={handleImageRemove}
                            disabled={isLoading}
                            fallback={
                                `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}` ||
                                user.name?.charAt(0) ||
                                user.email.charAt(0)
                            }
                        />
                    </div>

                    {/* Name Fields */}
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

                    {/* Email */}
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
                        <p className="text-muted-foreground text-xs">
                            Email address cannot be changed
                        </p>
                    </div>

                    {/* Phone Number with Verification */}
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                            Phone Number
                            {phoneVerification.isVerified && (
                                <span className="flex items-center gap-1 text-green-600">
                                    <Check className="h-3 w-3" />
                                    <span className="text-xs">Verified</span>
                                </span>
                            )}
                        </Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Phone className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+90 555 123 4567"
                                    className="pl-10"
                                    {...register('phone')}
                                    disabled={isLoading || phoneVerification.isVerified}
                                    onChange={e => {
                                        register('phone').onChange(e);
                                        // Reset verification if phone changes
                                        if (e.target.value !== user.phone) {
                                            setPhoneVerification(prev => ({
                                                ...prev,
                                                isVerified: false,
                                                codeSent: false,
                                                code: '',
                                            }));
                                        }
                                    }}
                                />
                            </div>
                            {watchedPhone &&
                                watchedPhone !== user.phone &&
                                !phoneVerification.isVerified && (
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

                        {/* Verification Code Input */}
                        {phoneVerification.codeSent && !phoneVerification.isVerified && (
                            <div className="flex gap-2 pt-2">
                                <Input
                                    placeholder="Enter 6-digit code"
                                    value={phoneVerification.code}
                                    onChange={e =>
                                        setPhoneVerification(prev => ({
                                            ...prev,
                                            code: e.target.value,
                                        }))
                                    }
                                    maxLength={6}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={verifyCode}
                                    disabled={
                                        phoneVerification.isVerifying || !phoneVerification.code
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
                        )}

                        {errors.phone && (
                            <p className="text-destructive text-sm">{errors.phone.message}</p>
                        )}

                        {!phoneVerification.isVerified && watchedPhone && (
                            <p className="text-muted-foreground text-xs">
                                Phone verification required for security features
                            </p>
                        )}
                    </div>

                    {/* Form Actions */}
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
