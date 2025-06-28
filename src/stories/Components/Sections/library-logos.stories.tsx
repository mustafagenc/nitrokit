import type { Meta, StoryObj } from '@storybook/react';
import { LibraryLogos } from '@/components/shared/library-logos';

const meta: Meta<typeof LibraryLogos> = {
    title: 'Components/Sections/LibraryLogos',
    component: LibraryLogos,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Component that displays technology logos in different variants with marquee animation.',
            },
        },
    },
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['default', 'compact', 'minimal'],
            description: 'Display variant of the logos',
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default variant with marquee animation
export const Default: Story = {
    args: {
        variant: 'default',
    },
    render: (args) => (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 py-16">
                <div className="mb-8 text-center">
                    <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                        Library Logos - Default
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Marquee animation with gradient fade effects
                    </p>
                </div>
                <LibraryLogos {...args} />
            </div>
        </div>
    ),
};

// Compact variant
export const Compact: Story = {
    args: {
        variant: 'compact',
    },
    render: (args) => (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 py-16">
                <div className="mb-8 text-center">
                    <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                        Library Logos - Compact
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Centered grid layout with hover effects
                    </p>
                </div>
                <LibraryLogos {...args} />
            </div>
        </div>
    ),
};

// Minimal variant
export const Minimal: Story = {
    args: {
        variant: 'minimal',
    },
    render: (args) => (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 py-16">
                <div className="mb-8 text-center">
                    <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                        Library Logos - Minimal
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Simple inline layout with minimal spacing
                    </p>
                </div>
                <LibraryLogos {...args} />
            </div>
        </div>
    ),
};

// All variants comparison
export const AllVariants: Story = {
    render: () => (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 py-16">
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                        Library Logos - All Variants
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Compare different display variants
                    </p>
                </div>

                <div className="space-y-16">
                    {/* Default Variant */}
                    <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                            Default Variant
                        </h2>
                        <p className="mb-6 text-gray-600 dark:text-gray-300">
                            Marquee animation with gradient fade effects and hover pause
                        </p>
                        <LibraryLogos variant="default" />
                    </div>

                    {/* Compact Variant */}
                    <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                            Compact Variant
                        </h2>
                        <p className="mb-6 text-gray-600 dark:text-gray-300">
                            Centered grid layout with hover opacity effects
                        </p>
                        <LibraryLogos variant="compact" />
                    </div>

                    {/* Minimal Variant */}
                    <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                            Minimal Variant
                        </h2>
                        <p className="mb-6 text-gray-600 dark:text-gray-300">
                            Simple inline layout with minimal spacing and subtle hover
                        </p>
                        <LibraryLogos variant="minimal" />
                    </div>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'This story shows all three variants of the LibraryLogos component for easy comparison.',
            },
        },
    },
};

// Interactive demo
export const InteractiveDemo: Story = {
    render: () => (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 py-16">
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                        Library Logos Interactive Demo
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Use the controls on the left to switch between variants
                    </p>
                </div>

                <div className="mx-auto max-w-4xl">
                    <div className="rounded-xl bg-white/50 p-8 text-center backdrop-blur-sm dark:bg-gray-900/50">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                            Technology Stack
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Our project is built with modern, reliable technologies
                        </p>
                    </div>

                    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
                        <LibraryLogos variant="default" />
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="rounded-xl bg-white/50 p-6 backdrop-blur-sm dark:bg-gray-900/50">
                            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                Frontend
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Next.js, React, TypeScript, Tailwind CSS
                            </p>
                        </div>

                        <div className="rounded-xl bg-white/50 p-6 backdrop-blur-sm dark:bg-gray-900/50">
                            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                Backend
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Prisma, Auth.js, Next-Intl, Zod
                            </p>
                        </div>

                        <div className="rounded-xl bg-white/50 p-6 backdrop-blur-sm dark:bg-gray-900/50">
                            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                Tools
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Radix UI, Lucide Icons, Resend
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Interactive demo showing the technology stack with detailed information about each category.',
            },
        },
    },
};

// Dark theme example
export const DarkTheme: Story = {
    args: {
        variant: 'default',
    },
    render: (args) => (
        <div className="min-h-screen bg-gray-900">
            <div className="container mx-auto px-4 py-16">
                <div className="mb-8 text-center">
                    <h1 className="mb-4 text-3xl font-bold text-white">
                        Library Logos - Dark Theme
                    </h1>
                    <p className="text-gray-300">Optimized for dark mode with proper contrast</p>
                </div>
                <LibraryLogos {...args} />
            </div>
        </div>
    ),
    parameters: {
        backgrounds: {
            default: 'dark',
        },
    },
};

// Compact dark theme
export const CompactDark: Story = {
    args: {
        variant: 'compact',
    },
    render: (args) => (
        <div className="min-h-screen bg-gray-900">
            <div className="container mx-auto px-4 py-16">
                <div className="mb-8 text-center">
                    <h1 className="mb-4 text-3xl font-bold text-white">
                        Library Logos - Compact Dark
                    </h1>
                    <p className="text-gray-300">Compact variant in dark theme</p>
                </div>
                <LibraryLogos {...args} />
            </div>
        </div>
    ),
    parameters: {
        backgrounds: {
            default: 'dark',
        },
    },
};
