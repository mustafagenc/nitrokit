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
import { User, Phone, Mail, Loader2 } from 'lucide-react';
import { useAvatar } from '@/contexts/avatar-context';

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
        image?: string | null;
        role: string;
    };
}

export function ProfileForm({ user }: ProfileFormProps) {
    const { updateAvatar, removeAvatar } = useAvatar(); // Context kullan
    const [isLoading, setIsLoading] = useState(false);
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

    const onSubmit = async (data: ProfileFormData) => {
        setIsLoading(true);
        try {
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
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned non-JSON response');
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

            if (error instanceof Error) {
                if (error.message.includes('HTTP error! status: 404')) {
                    toast.error('API endpoint not found. Please check your setup.');
                } else if (error.message.includes('non-JSON response')) {
                    toast.error('Server configuration error. Please try again later.');
                } else {
                    toast.error(error.message || 'Failed to remove profile picture.');
                }
            } else {
                toast.error('Failed to remove profile picture. Please try again.');
            }

            throw error;
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
                        {errors.image && (
                            <p className="text-destructive text-sm">{errors.image.message}</p>
                        )}
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

                    <div className="space-y-4">
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

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    className="pl-10"
                                    {...register('phone')}
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.phone && (
                                <p className="text-destructive text-sm">{errors.phone.message}</p>
                            )}
                        </div>
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
