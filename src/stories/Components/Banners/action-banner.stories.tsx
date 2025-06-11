import type { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import { Sparkles, Crown, Rocket, Building, Star, Users, Trophy } from 'lucide-react';

import {
    ActionBanner,
    EnterpriseBanner,
    PremiumBanner,
    CallToActionBanner,
    MinimalBanner,
} from '../../../components/banners/action-banner';

// Mock messages for i18n
const messages = {
    en: {
        // Add any translations if needed
    },
};

const meta = {
    title: 'Components/Banners/ActionBanner',
    component: ActionBanner,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Versatile action banner component for CTAs, promotions, and feature highlights with multiple variants and customization options.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        title: {
            control: 'text',
            description: 'Main headline text',
        },
        description: {
            control: 'text',
            description: 'Supporting description text',
        },
        buttonText: {
            control: 'text',
            description: 'Call-to-action button text',
        },
        href: {
            control: 'text',
            description: 'Link destination',
        },
        variant: {
            control: 'select',
            options: ['default', 'gradient', 'minimal', 'enterprise', 'premium'],
            description: 'Visual style variant',
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Banner size',
        },
        buttonVariant: {
            control: 'select',
            options: ['primary', 'secondary', 'outline', 'ghost'],
            description: 'Button style variant',
        },
        animated: {
            control: 'boolean',
            description: 'Enable hover animations',
        },
        external: {
            control: 'boolean',
            description: 'Open link in new tab',
        },
        className: {
            control: 'text',
            description: 'Additional CSS classes',
        },
    },
    decorators: [
        (Story) => (
            <NextIntlClientProvider locale="en" messages={messages.en}>
                <div className="w-full max-w-4xl p-8">
                    <Story />
                </div>
            </NextIntlClientProvider>
        ),
    ],
} satisfies Meta<typeof ActionBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default variant
export const Default: Story = {
    args: {
        title: 'Get Started Today',
        description:
            'Join thousands of developers building amazing applications with our platform.',
        buttonText: 'Start Free Trial',
        href: '#',
        variant: 'default',
        size: 'md',
        buttonVariant: 'primary',
        animated: true,
    },
};

// Gradient variant
export const Gradient: Story = {
    args: {
        title: 'Ready to Level Up?',
        description: 'Unlock premium features and take your projects to the next level.',
        buttonText: 'Upgrade Now',
        href: '#',
        variant: 'gradient',
        size: 'md',
        buttonVariant: 'secondary',
        icon: <Rocket size={28} />,
        animated: true,
    },
};

// Minimal variant
export const Minimal: Story = {
    args: {
        title: 'Simple & Clean',
        description: 'Minimalist design for subtle call-to-actions that blend naturally.',
        buttonText: 'Learn More',
        href: '#',
        variant: 'minimal',
        size: 'md',
        buttonVariant: 'ghost',
        animated: true,
    },
};

// Enterprise variant
export const Enterprise: Story = {
    args: {
        title: 'Enterprise Solutions',
        description: 'Custom packages and dedicated support for large organizations.',
        buttonText: 'Contact Sales',
        href: '#',
        variant: 'enterprise',
        size: 'lg',
        buttonVariant: 'outline',
        icon: <Building size={32} />,
        animated: false,
    },
};

// Premium variant
export const Premium: Story = {
    args: {
        title: 'Go Premium',
        description: 'Access exclusive features, priority support, and advanced tools.',
        buttonText: 'Upgrade to Pro',
        href: '#',
        variant: 'premium',
        size: 'md',
        buttonVariant: 'primary',
        icon: <Crown size={24} />,
        animated: true,
    },
};

// Small size
export const SmallSize: Story = {
    args: {
        title: 'Quick Action',
        description: 'Compact call-to-action for tight spaces.',
        buttonText: 'Get Started',
        href: '#',
        variant: 'default',
        size: 'sm',
        buttonVariant: 'primary',
        animated: true,
    },
};

// Large size
export const LargeSize: Story = {
    args: {
        title: 'Big Announcement',
        description:
            'Make a statement with our largest banner variant designed for maximum impact.',
        buttonText: 'Discover More',
        href: '#',
        variant: 'gradient',
        size: 'lg',
        buttonVariant: 'secondary',
        icon: <Star size={36} />,
        animated: true,
    },
};

// With external link
export const ExternalLink: Story = {
    args: {
        title: 'Visit Documentation',
        description: 'Complete guides and API references for developers.',
        buttonText: 'Open Docs',
        href: '#',
        variant: 'minimal',
        size: 'md',
        buttonVariant: 'outline',
        external: true,
        animated: true,
    },
};

// Without animation
export const WithoutAnimation: Story = {
    args: {
        title: 'Static Banner',
        description: 'No animations or hover effects for a more conservative approach.',
        buttonText: 'Static Action',
        href: '#',
        variant: 'default',
        size: 'md',
        buttonVariant: 'primary',
        animated: false,
    },
};

// Different button variants
// Different button variants
export const ButtonVariants = {
    render: () => (
        <div className="space-y-6">
            <ActionBanner
                title="Primary Button"
                description="Default button style with primary colors."
                buttonText="Primary Action"
                href="#"
                variant="minimal"
                buttonVariant="primary"
            />
            <ActionBanner
                title="Secondary Button"
                description="Secondary button style for less prominent actions."
                buttonText="Secondary Action"
                href="#"
                variant="minimal"
                buttonVariant="secondary"
            />
            <ActionBanner
                title="Outline Button"
                description="Outline button style for subtle emphasis."
                buttonText="Outline Action"
                href="#"
                variant="minimal"
                buttonVariant="outline"
            />
            <ActionBanner
                title="Ghost Button"
                description="Ghost button style for minimal visual impact."
                buttonText="Ghost Action"
                href="#"
                variant="minimal"
                buttonVariant="ghost"
            />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Showcase of different button variants available.',
            },
        },
    },
};

// Preset Components
export const PresetEnterpriseBanner = {
    render: () => (
        <EnterpriseBanner
            title="Enterprise Package"
            description="Dedicated support, custom integrations, and enterprise-grade security."
            buttonText="Contact Sales"
            href="#"
        />
    ),
    parameters: {
        docs: {
            description: {
                story: 'Preset component for enterprise offerings with professional styling.',
            },
        },
    },
};

export const PresetPremiumBanner = {
    render: () => (
        <PremiumBanner
            title="Upgrade to Premium"
            description="Unlock all features with our premium subscription plan."
            buttonText="Go Premium"
            href="#"
            icon={<Crown size={24} />}
        />
    ),
    parameters: {
        docs: {
            description: {
                story: 'Preset component for premium upgrades with golden styling.',
            },
        },
    },
};

export const PresetCallToActionBanner = {
    render: () => (
        <CallToActionBanner
            title="Join the Revolution"
            description="Be part of the next generation of web development tools."
            buttonText="Get Started Free"
            href="#"
        />
    ),
    parameters: {
        docs: {
            description: {
                story: 'Preset component for general call-to-actions with gradient styling.',
            },
        },
    },
};

export const PresetMinimalBanner = {
    render: () => (
        <MinimalBanner
            title="Learn More"
            description="Discover how our platform can help streamline your workflow."
            buttonText="Explore Features"
            href="#"
        />
    ),
    parameters: {
        docs: {
            description: {
                story: 'Preset component for subtle call-to-actions with minimal styling.',
            },
        },
    },
};

export const MultipleBanners = {
    render: () => (
        <div className="space-y-6">
            <ActionBanner
                title="New Feature Launch"
                description="AI-powered components are now available in beta."
                buttonText="Try Beta"
                href="#"
                variant="gradient"
                size="sm"
                icon={<Sparkles size={20} />}
            />
            <ActionBanner
                title="Community Event"
                description="Join our annual developer conference with industry experts."
                buttonText="Register Now"
                href="#"
                variant="default"
                size="md"
                icon={<Users size={24} />}
            />
            <ActionBanner
                title="Achievement Unlocked"
                description="Congratulations! You've completed all tutorials."
                buttonText="View Certificate"
                href="#"
                variant="premium"
                size="md"
                icon={<Trophy size={24} />}
            />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Multiple banners with different variants and use cases.',
            },
        },
    },
};

// Long content
export const LongContent: Story = {
    args: {
        title: 'Comprehensive Development Platform for Modern Applications',
        description:
            'Our platform provides everything you need to build, deploy, and scale modern web applications. From AI-powered components to enterprise-grade security, we have tools that adapt to your workflow and grow with your team.',
        buttonText: 'Start Your Journey',
        href: '#',
        variant: 'default',
        size: 'lg',
        buttonVariant: 'primary',
        icon: <Rocket size={32} />,
        animated: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Example with longer content to test text wrapping and layout.',
            },
        },
    },
};

// Mobile responsive
export const MobileView: Story = {
    args: {
        title: 'Mobile Optimized',
        description: 'Perfectly responsive design that works on all devices.',
        buttonText: 'Try Mobile',
        href: '#',
        variant: 'gradient',
        size: 'md',
        buttonVariant: 'secondary',
        animated: true,
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
        docs: {
            description: {
                story: 'Banner optimized for mobile viewing with responsive design.',
            },
        },
    },
};
