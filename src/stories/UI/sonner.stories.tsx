/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Toaster, toast } from 'sonner'; // Assuming sonner is used directly or re-exported
import { Button } from '../../components/ui/button'; // Assuming you have a Button component
import { XIcon, CheckCircle } from 'lucide-react';

const meta: Meta<typeof Toaster> = {
    title: 'UI/SonnerToaster',
    component: Toaster,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen', // Toasts often appear relative to the viewport
    },
    argTypes: {
        position: {
            control: 'select',
            options: [
                'top-left',
                'top-center',
                'top-right',
                'bottom-left',
                'bottom-center',
                'bottom-right',
            ],
            description: 'Position of the toasts.',
        },
        richColors: {
            control: 'boolean',
            description: 'Enable rich colors for success, error, warning, info.',
        },
        expand: {
            control: 'boolean',
            description: 'Whether toasts should expand by default.',
        },
        closeButton: {
            control: 'boolean',
            description: 'Show a close button on toasts.',
        },
        duration: {
            control: 'number',
            description: 'Default duration for toasts in milliseconds.',
        },
        visibleToasts: {
            control: 'number',
            description: 'Number of toasts visible at the same time.',
        },
        theme: {
            control: 'select',
            options: ['light', 'dark', 'system'],
            description: 'Theme for the toasts.',
        },
        offset: {
            control: 'text',
            description: 'Offset from the edge of the screen. E.g., "20px" or 20.',
        },
        // Add other Toaster props as needed
    },
};

export default meta;

type Story = StoryObj<typeof Toaster>;

const ToastDemoButtons: React.FC = () => {
    const promise = () => new Promise(resolve => setTimeout(resolve, 2000));

    return (
        <div className="flex flex-col items-start gap-4 p-8">
            <h2 className="mb-2 text-xl font-semibold">Trigger Toasts</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                <Button variant="outline" onClick={() => toast('Event has been created')}>
                    Default
                </Button>
                <Button
                    variant="outline"
                    onClick={() =>
                        toast.message('Event has been created', {
                            description: 'Monday, January 23, 2024 at 10:00 AM',
                        })
                    }>
                    With Description
                </Button>
                <Button
                    variant="outline"
                    onClick={() =>
                        toast.success('Event has been created successfully!', {
                            description: 'Your event is now live.',
                        })
                    }>
                    Success
                </Button>
                <Button
                    variant="outline"
                    onClick={() =>
                        toast.info('Event has been updated.', {
                            description: 'Changes have been saved.',
                        })
                    }>
                    Info
                </Button>
                <Button
                    variant="outline"
                    onClick={() =>
                        toast.warning('Event has a conflict.', {
                            description: 'Please check the schedule.',
                        })
                    }>
                    Warning
                </Button>
                <Button
                    variant="outline"
                    onClick={() =>
                        toast.error('Event could not be created.', {
                            description: 'An unexpected error occurred.',
                        })
                    }>
                    Error
                </Button>
                <Button
                    variant="outline"
                    onClick={() =>
                        toast('Event has been created', {
                            action: {
                                label: 'Undo',
                                onClick: () => console.log('Undo!'),
                            },
                        })
                    }>
                    With Action
                </Button>
                <Button
                    variant="outline"
                    onClick={() =>
                        toast.promise(promise, {
                            loading: 'Loading...',
                            success: 'Data fetched successfully!',
                            error: 'Error fetching data.',
                        })
                    }>
                    With Promise
                </Button>
                <Button
                    variant="outline"
                    onClick={() =>
                        toast(
                            <div className="flex items-center gap-2">
                                <img
                                    src="https://via.placeholder.com/32"
                                    alt="avatar"
                                    className="size-8 rounded-full"
                                />
                                <div>
                                    <p className="font-medium">Custom JSX Toast</p>
                                    <p className="text-muted-foreground text-sm">
                                        This toast uses custom React components.
                                    </p>
                                </div>
                            </div>
                        )
                    }>
                    Custom JSX
                </Button>
                <Button
                    variant="outline"
                    onClick={() =>
                        toast.loading('Processing your request...', {
                            description: 'This may take a few moments.',
                            duration: 5000, // Show loading for 5s
                        })
                    }>
                    Loading Toast
                </Button>
                <Button
                    variant="outline"
                    onClick={() => {
                        const id = toast.loading('Updating profile...');
                        setTimeout(() => {
                            toast.success('Profile updated!', { id });
                        }, 2000);
                    }}>
                    Update Toast (Loading then Success)
                </Button>
                <Button
                    variant="outline"
                    onClick={() =>
                        toast(
                            'A long message that might need more space to be fully readable without truncation or awkward wrapping initially.',
                            {
                                description:
                                    'This is an extended description to demonstrate how expandable toasts behave when there is a lot of content. Users can click to expand and see the full details if the content is initially truncated due to its length.',
                                duration: 10000,
                            }
                        )
                    }>
                    Long Content (Expandable)
                </Button>
            </div>
            <div className="mt-4">
                <Button variant="destructive" size="sm" onClick={() => toast.dismiss()}>
                    Dismiss All Toasts
                </Button>
            </div>
        </div>
    );
};

export const Default: Story = {
    render: args => (
        <>
            <Toaster {...args} />
            <ToastDemoButtons />
        </>
    ),
    args: {
        position: 'bottom-right',
        richColors: false,
        expand: false,
        closeButton: false,
        duration: 5000,
        visibleToasts: 3,
        theme: 'light',
    },
};

export const RichColorsEnabled: Story = {
    ...Default,
    args: {
        ...Default.args,
        richColors: true,
        position: 'top-center',
    },
};

export const ExpandByDefault: Story = {
    ...Default,
    args: {
        ...Default.args,
        expand: true,
        position: 'top-right',
    },
};

export const WithCloseButton: Story = {
    ...Default,
    args: {
        ...Default.args,
        closeButton: true,
        duration: 10000, // Longer duration to allow clicking close
        position: 'bottom-left',
    },
};

export const DarkTheme: Story = {
    ...Default,
    args: {
        ...Default.args,
        theme: 'dark',
        position: 'bottom-center',
    },
    parameters: {
        backgrounds: { default: 'dark' },
    },
};

// Example of how you might use custom icons with richColors (or without)
// This requires `sonner` to support custom icons per type or you do it in custom JSX.
// Sonner's richColors prop automatically adds icons.
// If you want fully custom icons, you'd typically use the custom JSX method.
export const CustomIconsInJSX: Story = {
    render: args => (
        <>
            <Toaster {...args} />
            <div className="flex flex-col items-start gap-4 p-8">
                <Button
                    variant="outline"
                    onClick={() =>
                        toast(
                            <div className="flex items-center gap-3">
                                <CheckCircle className="size-5 text-green-500" />
                                <div>
                                    <p className="font-medium">Payment Successful</p>
                                    <p className="text-muted-foreground text-sm">
                                        Your order #12345 has been confirmed.
                                    </p>
                                </div>
                            </div>
                        )
                    }>
                    Custom Success JSX
                </Button>
                <Button
                    variant="outline"
                    onClick={() =>
                        toast(
                            <div className="flex items-center gap-3">
                                <XIcon className="size-5 text-red-500" />
                                <div>
                                    <p className="font-medium">Upload Failed</p>
                                    <p className="text-muted-foreground text-sm">
                                        Could not upload your file. Please try again.
                                    </p>
                                </div>
                            </div>,
                            { duration: 6000 }
                        )
                    }>
                    Custom Error JSX
                </Button>
            </div>
        </>
    ),
    args: {
        ...Default.args,
        richColors: false, // Disable rich colors to see custom JSX icons clearly
        position: 'top-left',
    },
};
