import type { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';

import CtaSection from '@/components/shared/cta-section';

// Örnek mesajlar, projenizdeki gerçek mesajlarla değiştirebilirsiniz
const messages = {
    en: {
        // Gerekirse buraya çevirileri ekleyin
    },
};

const meta = {
    title: 'Components/Sections/CtaSection',
    component: CtaSection,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'A versatile call-to-action section component with multiple variants and button styles for different use cases.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['gradient', 'solid', 'outline', 'minimal'],
            description: 'Visual style variant of the CTA section',
        },
        title: {
            control: 'text',
            description: 'Main title text',
        },
        description: {
            control: 'text',
            description: 'Description text below the title',
        },
        buttons: {
            control: 'object',
            description: 'Array of button objects with href, label, and variant',
        },
        className: {
            control: 'text',
            description: 'Additional CSS classes',
        },
        children: {
            control: false,
            description: 'Custom content to display between description and buttons',
        },
    },
    decorators: [
        (Story) => (
            <NextIntlClientProvider locale="en" messages={messages.en}>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                    <Story />
                </div>
            </NextIntlClientProvider>
        ),
    ],
} satisfies Meta<typeof CtaSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultButtons = [
    {
        href: '/contact',
        label: 'Get Started',
        variant: 'primary' as const,
    },
    {
        href: '/learn-more',
        label: 'Learn More',
        variant: 'secondary' as const,
    },
];

// Default gradient variant
export const Default: Story = {
    args: {
        title: 'Ready to Get Started?',
        description: 'Join thousands of satisfied customers and transform your business today.',
        buttons: defaultButtons,
        variant: 'gradient',
    },
};

// Gradient variant
export const Gradient: Story = {
    args: {
        title: 'Transform Your Business Today',
        description:
            'Experience the power of our innovative solutions with a modern gradient design.',
        buttons: defaultButtons,
        variant: 'gradient',
    },
};

// Solid variant
export const Solid: Story = {
    args: {
        title: 'Take Your Business to the Next Level',
        description:
            'Our expert team is ready to help you achieve your goals with solid reliability.',
        buttons: defaultButtons,
        variant: 'solid',
    },
};

// Outline variant
export const Outline: Story = {
    args: {
        title: 'Need Help Getting Started?',
        description: 'Our support team is here to guide you through every step of the process.',
        buttons: defaultButtons,
        variant: 'outline',
    },
};

// Minimal variant
export const Minimal: Story = {
    args: {
        title: 'Simple and Clean Call to Action',
        description:
            'Perfect for subtle prompts and secondary actions throughout your application.',
        buttons: defaultButtons,
        variant: 'minimal',
    },
};

// Single button
export const SingleButton: Story = {
    args: {
        title: 'Ready to Join Us?',
        description: 'Start your journey with a single click and discover what makes us different.',
        buttons: [
            {
                href: '/signup',
                label: 'Sign Up Now',
                variant: 'primary' as const,
            },
        ],
        variant: 'gradient',
    },
};

// Three buttons
export const ThreeButtons: Story = {
    args: {
        title: 'Choose Your Path',
        description: 'Multiple options to get you started on your journey with flexible pricing.',
        buttons: [
            {
                href: '/free-trial',
                label: 'Free Trial',
                variant: 'primary' as const,
            },
            {
                href: '/demo',
                label: 'Book Demo',
                variant: 'secondary' as const,
            },
            {
                href: '/pricing',
                label: 'View Pricing',
                variant: 'secondary' as const,
            },
        ],
        variant: 'gradient',
    },
};

// With custom content
export const WithPromoContent: Story = {
    args: {
        title: 'Special Limited Time Offer!',
        description: 'Take advantage of our exclusive discount available for new customers only.',
        buttons: [
            {
                href: '/offer',
                label: 'Claim Your Discount',
                variant: 'primary' as const,
            },
        ],
        variant: 'gradient',
        children: (
            <div className="inline-flex items-center rounded-full bg-white/20 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm">
                <span className="mr-2 text-lg">🎉</span>
                50% OFF for the first month - Limited time only!
            </div>
        ),
    },
};

// Newsletter signup
export const NewsletterSignup: Story = {
    args: {
        title: 'Stay in the Loop',
        description:
            'Get the latest updates, insights, and exclusive offers delivered straight to your inbox.',
        buttons: [
            {
                href: '/subscribe',
                label: 'Subscribe Now',
                variant: 'primary' as const,
            },
        ],
        variant: 'minimal',
        children: (
            <div className="mx-auto max-w-md">
                <div className="flex rounded-lg border border-gray-300 bg-white p-1 shadow-sm dark:border-gray-600 dark:bg-gray-800">
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-1 border-0 bg-transparent px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none dark:text-white dark:placeholder-gray-400"
                    />
                    <button className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                        Subscribe
                    </button>
                </div>
            </div>
        ),
    },
};

// Sales team contact
export const SalesTeam: Story = {
    args: {
        title: 'Talk to Our Sales Team',
        description:
            'Get personalized recommendations and custom pricing tailored to your business needs.',
        buttons: [
            {
                href: '/contact-sales',
                label: 'Contact Sales',
                variant: 'primary' as const,
            },
            {
                href: '/schedule-demo',
                label: 'Schedule Demo',
                variant: 'secondary' as const,
            },
        ],
        variant: 'outline',
        children: (
            <div className="grid grid-cols-1 gap-6 text-sm text-gray-600 sm:grid-cols-3 dark:text-gray-300">
                <div className="flex items-center justify-center space-x-2">
                    <span className="text-lg">📞</span>
                    <span>Free consultation</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                    <span className="text-lg">⚡</span>
                    <span>Quick setup</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                    <span className="text-lg">🎯</span>
                    <span>Custom solutions</span>
                </div>
            </div>
        ),
    },
};

// Emergency support
export const EmergencySupport: Story = {
    args: {
        title: 'Need Immediate Support?',
        description:
            'Our emergency response team is available 24/7 to help you resolve critical issues.',
        buttons: [
            {
                href: '/emergency',
                label: 'Get Emergency Help',
                variant: 'primary' as const,
            },
        ],
        variant: 'solid',
        className: 'bg-red-600 hover:bg-red-700',
    },
};

// Custom styling
export const CustomStyling: Story = {
    args: {
        title: 'Custom Styled Section',
        description: 'This section demonstrates how to use custom CSS classes for unique styling.',
        buttons: [
            {
                href: '/custom',
                label: 'Explore Custom Styles',
                variant: 'primary' as const,
            },
        ],
        variant: 'minimal',
        className: 'bg-emerald-50 dark:bg-emerald-950/20 border-t-4 border-emerald-500',
    },
};

// Long content example
export const LongContent: Story = {
    args: {
        title: 'Transform Your Business Operations with Our Comprehensive Suite of Advanced Technology Solutions',
        description:
            'We provide enterprise-grade software solutions that streamline your workflows, enhance productivity, and drive measurable results across all departments. Our platform integrates seamlessly with your existing systems, scales with your business growth, and provides the reliability you need for mission-critical operations.',
        buttons: [
            {
                href: '/enterprise-demo',
                label: 'Schedule Enterprise Demo',
                variant: 'primary' as const,
            },
            {
                href: '/technical-docs',
                label: 'View Technical Documentation',
                variant: 'secondary' as const,
            },
        ],
        variant: 'gradient',
    },
};

// Mobile optimized
export const MobileView: Story = {
    args: {
        title: 'Mobile Optimized',
        description: 'This CTA section is fully responsive and optimized for mobile devices.',
        buttons: [
            {
                href: '/mobile-app',
                label: 'Download App',
                variant: 'primary' as const,
            },
        ],
        variant: 'gradient',
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
        docs: {
            description: {
                story: 'CTA section optimized for mobile viewing with responsive button layout.',
            },
        },
    },
};

// Multiple sections showcase
export const MultipleSections: Story = {
    args: {
        title: '',
        description: '',
        buttons: [],
    },
    render: () => (
        <div className="space-y-0">
            <CtaSection
                title="Primary Call to Action"
                description="Main conversion point with gradient styling"
                buttons={[{ href: '/primary', label: 'Get Started', variant: 'primary' as const }]}
                variant="gradient"
            />
            <CtaSection
                title="Secondary Information"
                description="Additional information with minimal styling"
                buttons={[{ href: '/info', label: 'Learn More', variant: 'primary' as const }]}
                variant="minimal"
            />
            <CtaSection
                title="Support Section"
                description="Help and support with outline styling"
                buttons={[{ href: '/support', label: 'Get Help', variant: 'primary' as const }]}
                variant="outline"
            />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Showcase of multiple CTA sections with different variants stacked together.',
            },
        },
    },
};
