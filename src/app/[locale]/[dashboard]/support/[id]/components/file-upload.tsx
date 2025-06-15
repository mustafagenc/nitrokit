'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileUploadProps {
    files: File[];
    setFiles: (files: File[]) => void;
    maxSize?: number;
    accept?: Record<string, string[]>;
}

export function FileUpload({
    files,
    setFiles,
    maxSize = 5 * 1024 * 1024, // 5MB
    accept,
}: FileUploadProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const validFiles = acceptedFiles.filter((file) => {
                if (file.size > maxSize) {
                    toast.error(`${file.name} dosyası çok büyük (max: ${maxSize / 1024 / 1024}MB)`);
                    return false;
                }
                return true;
            });

            setFiles([...files, ...validFiles]);
        },
        [files, maxSize, setFiles]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxSize,
        accept,
    });

    const removeFile = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                    isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                }`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Dosyaları buraya bırakın...</p>
                ) : (
                    <p>
                        Dosyaları buraya sürükleyin veya{' '}
                        <span className="text-primary">seçmek için tıklayın</span>
                    </p>
                )}
                <p className="text-muted-foreground mt-2 text-sm">
                    Maksimum dosya boyutu: {maxSize / 1024 / 1024}MB
                </p>
            </div>

            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between rounded-md border p-2"
                        >
                            <div className="flex items-center gap-2">
                                <span className="truncate text-sm">{file.name}</span>
                                <span className="text-muted-foreground text-sm">
                                    ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
