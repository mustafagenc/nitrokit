import type { Meta, StoryObj } from '@storybook/react';
import { Testimonials } from '@/components/shared/testimonials';
import { MockIntlProvider } from '../../MockIntlProvider';

const meta: Meta<typeof Testimonials> = {
    title: 'Components/Sections/Testimonials',
    component: Testimonials,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Component that displays customer testimonials in different variants with marquee animation.',
            },
        },
    },
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['default', 'compact', 'minimal'],
            description: 'Display variant of the testimonials',
        },
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <MockIntlProvider>
                <Story />
            </MockIntlProvider>
        ),
    ],
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
                        Testimonials - Default
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Marquee animation with gradient background and hover effects
                    </p>
                </div>
                <Testimonials {...args} />
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
                        Testimonials - Compact
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Grid layout with avatar and rating display
                    </p>
                </div>
                <Testimonials {...args} />
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
                        Testimonials - Minimal
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Simple list layout with left border accent
                    </p>
                </div>
                <Testimonials {...args} />
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
                        Testimonials - All Variants
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
                            Marquee animation with gradient background, hover pause, and card design
                        </p>
                        <Testimonials variant="default" />
                    </div>

                    {/* Compact Variant */}
                    <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                            Compact Variant
                        </h2>
                        <p className="mb-6 text-gray-600 dark:text-gray-300">
                            Grid layout with avatar, rating, and compact card design
                        </p>
                        <Testimonials variant="compact" />
                    </div>

                    {/* Minimal Variant */}
                    <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                            Minimal Variant
                        </h2>
                        <p className="mb-6 text-gray-600 dark:text-gray-300">
                            Simple list layout with left border accent and minimal styling
                        </p>
                        <Testimonials variant="minimal" />
                    </div>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'This story shows all three variants of the Testimonials component for easy comparison.',
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
                        Testimonials Interactive Demo
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Use the controls on the left to switch between variants
                    </p>
                </div>

                <div className="mx-auto max-w-4xl">
                    <div className="rounded-xl bg-white/50 p-8 text-center backdrop-blur-sm dark:bg-gray-900/50">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                            Customer Reviews
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            See what our customers are saying about our product
                        </p>
                    </div>

                    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
                        <Testimonials variant="default" />
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="rounded-xl bg-white/50 p-6 backdrop-blur-sm dark:bg-gray-900/50">
                            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                User Experience
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Customers love the intuitive interface and smooth interactions
                            </p>
                        </div>

                        <div className="rounded-xl bg-white/50 p-6 backdrop-blur-sm dark:bg-gray-900/50">
                            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                Performance
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Fast loading times and reliable performance across devices
                            </p>
                        </div>

                        <div className="rounded-xl bg-white/50 p-6 backdrop-blur-sm dark:bg-gray-900/50">
                            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                Support
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Excellent customer support and helpful documentation
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
                story: 'Interactive demo showing customer testimonials with detailed information about different aspects.',
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
                        Testimonials - Dark Theme
                    </h1>
                    <p className="text-gray-300">Optimized for dark mode with proper contrast</p>
                </div>
                <Testimonials {...args} />
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
                        Testimonials - Compact Dark
                    </h1>
                    <p className="text-gray-300">Compact variant in dark theme</p>
                </div>
                <Testimonials {...args} />
            </div>
        </div>
    ),
    parameters: {
        backgrounds: {
            default: 'dark',
        },
    },
};

// Minimal dark theme
export const MinimalDark: Story = {
    args: {
        variant: 'minimal',
    },
    render: (args) => (
        <div className="min-h-screen bg-gray-900">
            <div className="container mx-auto px-4 py-16">
                <div className="mb-8 text-center">
                    <h1 className="mb-4 text-3xl font-bold text-white">
                        Testimonials - Minimal Dark
                    </h1>
                    <p className="text-gray-300">Minimal variant in dark theme</p>
                </div>
                <Testimonials {...args} />
            </div>
        </div>
    ),
    parameters: {
        backgrounds: {
            default: 'dark',
        },
    },
};

// Standalone testimonials without container
export const Standalone: Story = {
    args: {
        variant: 'default',
    },
    render: (args) => (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <Testimonials {...args} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Standalone testimonials component without additional container styling.',
            },
        },
    },
};
