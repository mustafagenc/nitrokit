import type { Meta, StoryObj } from '@storybook/react';
import { BackgroundPatterns } from '@/components/shared/background-patterns';

const meta: Meta<typeof BackgroundPatterns> = {
    title: 'Components/Sections/BackgroundPatterns',
    component: BackgroundPatterns,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Reusable component for different background patterns. Comes with 7 different variants and animation controls.',
            },
        },
    },
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['default', 'geometric', 'dots', 'waves', 'grid', 'stars', 'circles'],
            description: 'Background pattern variant',
        },
        className: {
            control: { type: 'text' },
            description: 'Additional CSS classes',
        },
        animated: {
            control: { type: 'boolean' },
            description: 'Enable/disable animations',
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story - default variant
export const Default: Story = {
    args: {
        variant: 'default',
        animated: true,
    },
    render: (args) => (
        <div className="relative min-h-screen overflow-hidden bg-white transition-colors duration-300 dark:bg-[#111113]">
            <BackgroundPatterns {...args} />
            <div className="relative z-10 flex min-h-screen items-center justify-center">
                <div className="rounded-xl bg-white/50 p-8 text-center backdrop-blur-sm dark:bg-gray-900/50">
                    <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                        Default Background
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Original grid pattern and gradient circles
                    </p>
                </div>
            </div>
        </div>
    ),
};

// Geometric variant
export const Geometric: Story = {
    args: {
        variant: 'geometric',
        animated: true,
    },
    render: (args) => (
        <div className="relative min-h-screen overflow-hidden bg-white transition-colors duration-300 dark:bg-[#111113]">
            <BackgroundPatterns {...args} />
            <div className="relative z-10 flex min-h-screen items-center justify-center">
                <div className="rounded-xl bg-white/50 p-8 text-center backdrop-blur-sm dark:bg-gray-900/50">
                    <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                        Geometric Background
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Rotated squares and geometric shapes
                    </p>
                </div>
            </div>
        </div>
    ),
};

// Dots variant
export const Dots: Story = {
    args: {
        variant: 'dots',
        animated: true,
    },
    render: (args) => (
        <div className="relative min-h-screen overflow-hidden bg-white transition-colors duration-300 dark:bg-[#111113]">
            <BackgroundPatterns {...args} />
            <div className="relative z-10 flex min-h-screen items-center justify-center">
                <div className="rounded-xl bg-white/50 p-8 text-center backdrop-blur-sm dark:bg-gray-900/50">
                    <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                        Dots Background
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">Multi-sized animated dots</p>
                </div>
            </div>
        </div>
    ),
};

// Waves variant
export const Waves: Story = {
    args: {
        variant: 'waves',
        animated: true,
    },
    render: (args) => (
        <div className="relative min-h-screen overflow-hidden bg-white transition-colors duration-300 dark:bg-[#111113]">
            <BackgroundPatterns {...args} />
            <div className="relative z-10 flex min-h-screen items-center justify-center">
                <div className="rounded-xl bg-white/50 p-8 text-center backdrop-blur-sm dark:bg-gray-900/50">
                    <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                        Waves Background
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">SVG waves and rotating rings</p>
                </div>
            </div>
        </div>
    ),
};

// Grid variant
export const Grid: Story = {
    args: {
        variant: 'grid',
        animated: true,
    },
    render: (args) => (
        <div className="relative min-h-screen overflow-hidden bg-white transition-colors duration-300 dark:bg-[#111113]">
            <BackgroundPatterns {...args} />
            <div className="relative z-10 flex min-h-screen items-center justify-center">
                <div className="rounded-xl bg-white/50 p-8 text-center backdrop-blur-sm dark:bg-gray-900/50">
                    <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                        Grid Background
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">Multi-layered grid pattern</p>
                </div>
            </div>
        </div>
    ),
};

// Stars variant with twinkling animation
export const Stars: Story = {
    args: {
        variant: 'stars',
        animated: true,
    },
    render: (args) => (
        <div className="relative min-h-screen overflow-hidden bg-white transition-colors duration-300 dark:bg-[#111113]">
            <BackgroundPatterns {...args} />
            <div className="relative z-10 flex min-h-screen items-center justify-center">
                <div className="rounded-xl bg-white/50 p-8 text-center backdrop-blur-sm dark:bg-gray-900/50">
                    <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                        Stars Background
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Randomly positioned twinkling stars
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Use the "animated" control to toggle twinkling effect
                    </p>
                </div>
            </div>
        </div>
    ),
};

// Stars variant without animation
export const StarsStatic: Story = {
    args: {
        variant: 'stars',
        animated: false,
    },
    render: (args) => (
        <div className="relative min-h-screen overflow-hidden bg-white transition-colors duration-300 dark:bg-[#111113]">
            <BackgroundPatterns {...args} />
            <div className="relative z-10 flex min-h-screen items-center justify-center">
                <div className="rounded-xl bg-white/50 p-8 text-center backdrop-blur-sm dark:bg-gray-900/50">
                    <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                        Static Stars Background
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Stars without twinkling animation
                    </p>
                </div>
            </div>
        </div>
    ),
};

// Circles variant
export const Circles: Story = {
    args: {
        variant: 'circles',
        animated: true,
    },
    render: (args) => (
        <div className="relative min-h-screen overflow-hidden bg-white transition-colors duration-300 dark:bg-[#111113]">
            <BackgroundPatterns {...args} />
            <div className="relative z-10 flex min-h-screen items-center justify-center">
                <div className="rounded-xl bg-white/50 p-8 text-center backdrop-blur-sm dark:bg-gray-900/50">
                    <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                        Circles Background
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Nested circles and ping animations
                    </p>
                </div>
            </div>
        </div>
    ),
};

// Interactive demo story
export const InteractiveDemo: Story = {
    render: () => {
        const variants = [
            'default',
            'geometric',
            'dots',
            'waves',
            'grid',
            'stars',
            'circles',
        ] as const;

        return (
            <div className="relative min-h-screen overflow-hidden bg-white transition-colors duration-300 dark:bg-[#111113]">
                <BackgroundPatterns variant="default" animated={true} />
                <div className="relative z-10">
                    <div className="container mx-auto px-4 py-16">
                        <div className="mb-8 text-center">
                            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                                Background Variants Story
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Test different background patterns in Storybook
                            </p>
                        </div>

                        <div className="mx-auto max-w-4xl">
                            <div className="rounded-xl bg-white/50 p-8 text-center backdrop-blur-sm dark:bg-gray-900/50">
                                <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                                    Background Variants
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Use the controls on the left to test different variants and
                                    toggle animations.
                                </p>
                            </div>

                            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {variants.map((variant) => (
                                    <div
                                        key={variant}
                                        className="rounded-xl bg-white/50 p-6 backdrop-blur-sm dark:bg-gray-900/50"
                                    >
                                        <h3 className="mb-2 text-lg font-semibold text-gray-900 capitalize dark:text-white">
                                            {variant}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {variant === 'default' &&
                                                'Original grid pattern and gradient circles'}
                                            {variant === 'geometric' &&
                                                'Rotated squares and geometric shapes'}
                                            {variant === 'dots' && 'Multi-sized animated dots'}
                                            {variant === 'waves' && 'SVG waves and rotating rings'}
                                            {variant === 'grid' && 'Multi-layered grid pattern'}
                                            {variant === 'stars' &&
                                                'Randomly positioned twinkling stars'}
                                            {variant === 'circles' &&
                                                'Nested circles and ping animations'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'This story shows all background variants. Use the controls on the left to test different variants and toggle animations.',
            },
        },
    },
};

// Dark theme example
export const DarkTheme: Story = {
    args: {
        variant: 'stars',
        animated: true,
    },
    render: (args) => (
        <div className="relative min-h-screen overflow-hidden bg-[#111113] transition-colors duration-300">
            <BackgroundPatterns {...args} />
            <div className="relative z-10 flex min-h-screen items-center justify-center">
                <div className="rounded-xl bg-gray-900/50 p-8 text-center backdrop-blur-sm">
                    <h1 className="mb-4 text-3xl font-bold text-white">Dark Theme</h1>
                    <p className="text-gray-300">Background optimized for dark theme</p>
                </div>
            </div>
        </div>
    ),
    parameters: {
        backgrounds: {
            default: 'dark',
        },
    },
};
