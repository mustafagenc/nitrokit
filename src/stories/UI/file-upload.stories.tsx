import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';

const meta: Meta<typeof FileUpload> = {
    title: 'UI/FileUpload',
    component: FileUpload,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'A drag and drop file upload component with file validation and preview.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        maxSize: {
            control: 'number',
            description: 'Maximum file size in bytes',
        },
        accept: {
            control: 'object',
            description: 'Accepted file types',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    render: (args) => {
        const [files, setFiles] = useState<File[]>([]);
        return (
            <div className="mx-auto max-w-md">
                <FileUpload
                    files={files}
                    setFiles={setFiles}
                    maxSize={args.maxSize}
                    accept={args.accept}
                />
            </div>
        );
    },
    args: {
        maxSize: 5 * 1024 * 1024, // 5MB
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
        },
    },
};

export const ImagesOnly: Story = {
    render: (args) => {
        const [files, setFiles] = useState<File[]>([]);
        return (
            <div className="mx-auto max-w-md">
                <FileUpload
                    files={files}
                    setFiles={setFiles}
                    maxSize={args.maxSize}
                    accept={args.accept}
                />
            </div>
        );
    },
    args: {
        maxSize: 10 * 1024 * 1024, // 10MB
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
        },
    },
};

export const DocumentsOnly: Story = {
    render: (args) => {
        const [files, setFiles] = useState<File[]>([]);
        return (
            <div className="mx-auto max-w-md">
                <FileUpload
                    files={files}
                    setFiles={setFiles}
                    maxSize={args.maxSize}
                    accept={args.accept}
                />
            </div>
        );
    },
    args: {
        maxSize: 2 * 1024 * 1024, // 2MB
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt'],
        },
    },
};

export const SmallFileSize: Story = {
    render: (args) => {
        const [files, setFiles] = useState<File[]>([]);
        return (
            <div className="mx-auto max-w-md">
                <FileUpload
                    files={files}
                    setFiles={setFiles}
                    maxSize={args.maxSize}
                    accept={args.accept}
                />
            </div>
        );
    },
    args: {
        maxSize: 1024 * 1024, // 1MB
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg'],
            'text/plain': ['.txt'],
        },
    },
};

export const LargeFileSize: Story = {
    render: (args) => {
        const [files, setFiles] = useState<File[]>([]);
        return (
            <div className="mx-auto max-w-md">
                <FileUpload
                    files={files}
                    setFiles={setFiles}
                    maxSize={args.maxSize}
                    accept={args.accept}
                />
            </div>
        );
    },
    args: {
        maxSize: 50 * 1024 * 1024, // 50MB
        accept: {
            'video/*': ['.mp4', '.avi', '.mov'],
            'application/zip': ['.zip'],
            'application/x-rar-compressed': ['.rar'],
        },
    },
};

export const WithInitialFiles: Story = {
    render: (args) => {
        const [files, setFiles] = useState<File[]>([
            // Mock files for demonstration
            new File([''], 'document.pdf', { type: 'application/pdf' }),
            new File([''], 'image.jpg', { type: 'image/jpeg' }),
            new File([''], 'readme.txt', { type: 'text/plain' }),
        ]);
        return (
            <div className="mx-auto max-w-md">
                <FileUpload
                    files={files}
                    setFiles={setFiles}
                    maxSize={args.maxSize}
                    accept={args.accept}
                />
            </div>
        );
    },
    args: {
        maxSize: 5 * 1024 * 1024, // 5MB
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
        },
    },
};

export const DarkTheme: Story = {
    render: (args) => {
        const [files, setFiles] = useState<File[]>([]);
        return (
            <div className="mx-auto max-w-md">
                <FileUpload
                    files={files}
                    setFiles={setFiles}
                    maxSize={args.maxSize}
                    accept={args.accept}
                />
            </div>
        );
    },
    args: {
        maxSize: 5 * 1024 * 1024, // 5MB
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
        },
    },
    parameters: {
        backgrounds: { default: 'dark' },
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="mb-4 text-lg font-semibold">Basic File Upload</h3>
                <div className="mx-auto max-w-md">
                    <FileUpload
                        files={[]}
                        setFiles={() => {}}
                        maxSize={5 * 1024 * 1024}
                        accept={{
                            'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
                            'application/pdf': ['.pdf'],
                            'text/plain': ['.txt'],
                        }}
                    />
                </div>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-semibold">Images Only</h3>
                <div className="mx-auto max-w-md">
                    <FileUpload
                        files={[]}
                        setFiles={() => {}}
                        maxSize={10 * 1024 * 1024}
                        accept={{
                            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
                        }}
                    />
                </div>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-semibold">Documents Only</h3>
                <div className="mx-auto max-w-md">
                    <FileUpload
                        files={[]}
                        setFiles={() => {}}
                        maxSize={2 * 1024 * 1024}
                        accept={{
                            'application/pdf': ['.pdf'],
                            'application/msword': ['.doc'],
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                                ['.docx'],
                            'text/plain': ['.txt'],
                        }}
                    />
                </div>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-semibold">Small File Size (1MB)</h3>
                <div className="mx-auto max-w-md">
                    <FileUpload
                        files={[]}
                        setFiles={() => {}}
                        maxSize={1024 * 1024}
                        accept={{
                            'image/*': ['.png', '.jpg', '.jpeg'],
                            'text/plain': ['.txt'],
                        }}
                    />
                </div>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-semibold">Large File Size (50MB)</h3>
                <div className="mx-auto max-w-md">
                    <FileUpload
                        files={[]}
                        setFiles={() => {}}
                        maxSize={50 * 1024 * 1024}
                        accept={{
                            'video/*': ['.mp4', '.avi', '.mov'],
                            'application/zip': ['.zip'],
                            'application/x-rar-compressed': ['.rar'],
                        }}
                    />
                </div>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-semibold">With Initial Files</h3>
                <div className="mx-auto max-w-md">
                    <FileUpload
                        files={[
                            new File([''], 'document.pdf', { type: 'application/pdf' }),
                            new File([''], 'image.jpg', { type: 'image/jpeg' }),
                            new File([''], 'readme.txt', { type: 'text/plain' }),
                        ]}
                        setFiles={() => {}}
                        maxSize={5 * 1024 * 1024}
                        accept={{
                            'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
                            'application/pdf': ['.pdf'],
                            'text/plain': ['.txt'],
                        }}
                    />
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'This story shows all different variants of the FileUpload component for easy comparison.',
            },
        },
    },
};
