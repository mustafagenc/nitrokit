// src/components/ui/image-upload.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { UserAvatar } from '../dashboard/user-avatar';
import { useInAppNotificationService } from '@/hooks/useInAppNotificationService';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    onRemove?: () => Promise<void>;
    disabled?: boolean;
    fallback?: string;
}

export function ImageUpload({ value, onChange, onRemove, disabled, fallback }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [preview, setPreview] = useState<string | null>(value || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { createAvatarUpdated, createAvatarRemoved } = useInAppNotificationService();

    useEffect(() => {
        setPreview(value || null);
    }, [value]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Invalid file type. Please select a JPEG, PNG, or WebP image.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File too large. Maximum size is 5MB.');
            return;
        }

        setIsUploading(true);

        try {
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);

            const response = await fetch(
                `/api/upload/avatar?filename=${encodeURIComponent(file.name)}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': file.type,
                    },
                    body: file,
                }
            );

            const result = await response.json();

            if (result.success) {
                onChange(result.url);
                setPreview(result.url);
                await createAvatarUpdated();
                toast.success('Image uploaded successfully!');
                URL.revokeObjectURL(previewUrl);
            } else {
                toast.error(result.error || 'Upload failed');
                setPreview(value || null);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload failed. Please try again.');
            setPreview(value || null);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = async () => {
        setIsRemoving(true);
        try {
            if (onRemove) {
                await onRemove();
                setPreview(null);
            } else {
                onChange('');
                setPreview(null);
            }
            await createAvatarRemoved();
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Remove error:', error);
            toast.error('Failed to remove image. Please try again.');
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <div className="flex items-center gap-6">
            <UserAvatar
                src={preview}
                name={fallback}
                size="size-24"
                className="border-2 border-gray-300 dark:border-gray-600"
            />

            <div className="space-y-3">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleFileSelect}
                    disabled={disabled || isUploading || isRemoving}
                    className="hidden"
                />
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled || isUploading || isRemoving}
                    >
                        {isUploading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="mr-2 h-4 w-4" />
                        )}
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                    {preview && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemove}
                            disabled={disabled || isUploading || isRemoving}
                        >
                            {isRemoving ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <X className="mr-2 h-4 w-4" />
                            )}
                            {isRemoving ? 'Removing...' : 'Remove'}
                        </Button>
                    )}
                </div>
                <div className="text-muted-foreground space-y-1 text-xs">
                    <p>• Maximum file size: 5MB</p>
                    <p>• Supported formats: JPEG, PNG, WebP</p>
                    <p>• Recommended: Square aspect ratio</p>
                </div>
            </div>
        </div>
    );
}
