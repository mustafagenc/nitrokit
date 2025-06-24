import type { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';

import PageHero from '@/components/shared/page-hero';

const messages = {
    en: {},
};

const meta = {
    title: 'Components/Sections/PageHero',
    component: PageHero,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'A flexible page hero component for displaying page titles, subtitles, and descriptions with various styling options.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'minimal', 'large', 'center'],
            description: 'Visual style variant of the hero section',
        },
        gradientVariant: {
            control: 'select',
            options: ['blue', 'purple', 'green', 'orange', 'pink'],
            description: 'Color scheme for the gradient text effect',
        },
        h1: {
            control: 'text',
            description: 'Main heading text',
        },
        h2: {
            control: 'text',
            description: 'Subtitle or section label',
        },
        p: {
            control: 'text',
            description: 'Description text',
        },
        showBreadcrumb: {
            control: 'boolean',
            description: 'Whether to show breadcrumb navigation',
        },
        breadcrumbItems: {
            control: 'object',
            description: 'Array of breadcrumb items with label and optional href',
        },
        className: {
            control: 'text',
            description: 'Additional CSS classes',
        },
    },
    decorators: [
        (Story) => (
            <NextIntlClientProvider locale="en" messages={messages.en}>
                <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
                    <Story />
                </div>
            </NextIntlClientProvider>
        ),
    ],
} satisfies Meta<typeof PageHero>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default variant
export const Default: Story = {
    args: {
        h2: 'Hero Section',
        h1: 'Welcome to Our Platform',
        p: 'Discover amazing features and capabilities that will transform your experience.',
        variant: 'default',
        gradientVariant: 'blue',
    },
};

// Minimal variant
export const Minimal: Story = {
    args: {
        h2: 'Getting Started',
        h1: 'Simple and Clean',
        p: 'A minimal approach to displaying page headers with subtle styling.',
        variant: 'minimal',
        gradientVariant: 'blue',
    },
};

// Large variant
export const Large: Story = {
    args: {
        h2: 'Welcome',
        h1: 'Big Impact',
        p: 'Make a bold statement with large typography and extended spacing for maximum visual impact.',
        variant: 'large',
        gradientVariant: 'purple',
    },
};

// Center variant
export const Center: Story = {
    args: {
        h2: 'About Us',
        h1: 'Our Story',
        p: 'Centered layout with balanced spacing perfect for content pages and informational sections.',
        variant: 'center',
        gradientVariant: 'green',
    },
};

// Different gradient colors
export const PurpleGradient: Story = {
    args: {
        h2: 'Creative Design',
        h1: 'Purple Power',
        p: 'Showcase your creative side with vibrant purple gradient styling.',
        variant: 'default',
        gradientVariant: 'purple',
    },
};

export const GreenGradient: Story = {
    args: {
        h2: 'Eco Friendly',
        h1: 'Go Green',
        p: 'Promote sustainability and growth with fresh green gradient colors.',
        variant: 'default',
        gradientVariant: 'green',
    },
};

export const OrangeGradient: Story = {
    args: {
        h2: 'Energy & Innovation',
        h1: 'Bright Ideas',
        p: 'Energize your users with warm orange to red gradient combinations.',
        variant: 'default',
        gradientVariant: 'orange',
    },
};

export const PinkGradient: Story = {
    args: {
        h2: 'Modern Design',
        h1: 'Pretty in Pink',
        p: 'Add a touch of elegance with soft pink gradient styling.',
        variant: 'default',
        gradientVariant: 'pink',
    },
};

// With breadcrumb navigation
export const WithBreadcrumb: Story = {
    args: {
        h2: 'Documentation',
        h1: 'API Reference',
        p: 'Complete guide to our API endpoints and integration methods.',
        variant: 'default',
        gradientVariant: 'blue',
        showBreadcrumb: true,
        breadcrumbItems: [
            { label: 'Home', href: '/' },
            { label: 'Documentation', href: '/docs' },
            { label: 'API Reference' },
        ],
    },
};

// With custom content
export const WithCustomContent: Story = {
    args: {
        h2: 'Product Launch',
        h1: 'Something Big is Coming',
        p: 'Get ready for our most exciting release yet with revolutionary features.',
        variant: 'center',
        gradientVariant: 'purple',
        children: (
            <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-4">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-purple-500"></div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Coming Soon
                    </span>
                    <div className="h-2 w-2 animate-pulse rounded-full bg-purple-500"></div>
                </div>
                <button className="rounded-lg bg-purple-600 px-6 py-2 text-white transition-colors hover:bg-purple-700">
                    Notify Me
                </button>
            </div>
        ),
    },
};

// About page example
export const AboutPage: Story = {
    args: {
        h2: 'About',
        h1: 'About Our Company',
        p: "We're passionate about creating innovative solutions that make a difference in the world.",
        variant: 'default',
        gradientVariant: 'blue',
        showBreadcrumb: true,
        breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'About' }],
    },
};

// Contact page example
export const ContactPage: Story = {
    args: {
        h2: 'Contact',
        h1: 'Get in Touch',
        p: 'Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.',
        variant: 'center',
        gradientVariant: 'green',
        showBreadcrumb: true,
        breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Contact' }],
    },
};

// Pricing page example
export const PricingPage: Story = {
    args: {
        h2: 'Pricing',
        h1: 'Simple, Transparent Pricing',
        p: 'Choose the plan that fits your needs. All plans include our core features with no hidden fees.',
        variant: 'large',
        gradientVariant: 'orange',
    },
};

// Blog page example
export const BlogPage: Story = {
    args: {
        h2: 'Blog',
        h1: 'Latest Updates',
        p: 'Stay up to date with the latest news, tips, and insights from our team.',
        variant: 'minimal',
        gradientVariant: 'purple',
        showBreadcrumb: true,
        breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Blog' }],
    },
};

// No description variant
export const NoDescription: Story = {
    args: {
        h2: 'Quick Start',
        h1: 'Get Started Now',
        p: '',
        variant: 'default',
        gradientVariant: 'blue',
    },
};

// Only title variant
export const OnlyTitle: Story = {
    args: {
        h2: '',
        h1: 'Main Title Only',
        p: '',
        variant: 'large',
        gradientVariant: 'pink',
    },
};

// Long content example
export const LongContent: Story = {
    args: {
        h2: 'Enterprise Solutions',
        h1: 'Comprehensive Business Intelligence Platform for Modern Enterprises',
        p: 'Our advanced business intelligence platform provides comprehensive analytics, real-time reporting, and actionable insights that empower organizations to make data-driven decisions and achieve sustainable growth in competitive markets.',
        variant: 'center',
        gradientVariant: 'blue',
    },
};

// Mobile view
export const MobileView: Story = {
    args: {
        h2: 'Mobile App',
        h1: 'Download Our App',
        p: 'Get the full experience on your mobile device with our native app.',
        variant: 'default',
        gradientVariant: 'green',
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
        docs: {
            description: {
                story: 'PageHero optimized for mobile viewing with responsive typography.',
            },
        },
    },
};

// Custom styling
export const CustomStyling: Story = {
    args: {
        h2: 'Custom Design',
        h1: 'Unique Styling',
        p: 'This example shows how to apply custom CSS classes for unique designs.',
        variant: 'default',
        gradientVariant: 'purple',
        className:
            'bg-purple-50 dark:bg-purple-950/20 rounded-lg p-8 border border-purple-200 dark:border-purple-800',
    },
};
