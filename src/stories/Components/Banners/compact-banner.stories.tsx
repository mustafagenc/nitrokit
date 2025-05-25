import type { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import { Sparkles, Zap, Star, Gift, Rocket, Bell } from 'lucide-react';

import {
    CompactBanner,
    NewFeatureBanner,
    UpdateBanner,
    PremiumBanner,
} from '../../../components/banners/compact-banner';

// Örnek mesajlar, projenizdeki gerçek mesajlarla değiştirebilirsiniz
const messages = {
    en: {
        // Gerekirse buraya çevirileri ekleyin
    },
};

const meta = {
    title: 'Components/Banners/CompactBanner',
    component: CompactBanner,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Modern, animated compact banner component with multiple variants and customization options.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        href: {
            control: 'text',
            description: 'Link destination',
        },
        badge: {
            control: 'text',
            description: 'Badge text content',
        },
        text: {
            control: 'text',
            description: 'Main banner text',
        },
        variant: {
            control: 'select',
            options: ['default', 'gradient', 'minimal', 'premium'],
            description: 'Banner style variant',
        },
        animated: {
            control: 'boolean',
            description: 'Enable hover animations',
        },
        className: {
            control: 'text',
            description: 'Additional CSS classes',
        },
    },
    decorators: [
        Story => (
            <NextIntlClientProvider locale="en" messages={messages.en}>
                <div className="p-8">
                    <Story />
                </div>
            </NextIntlClientProvider>
        ),
    ],
} satisfies Meta<typeof CompactBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default variant
export const Default: Story = {
    args: {
        href: '#',
        badge: 'New',
        text: 'Check out our latest features!',
        variant: 'default',
        animated: true,
    },
};

// Gradient variant
export const Gradient: Story = {
    args: {
        href: '#',
        badge: 'Premium',
        text: 'Unlock advanced features now',
        variant: 'gradient',
        icon: <Sparkles size={12} />,
        animated: true,
    },
};

// Minimal variant
export const Minimal: Story = {
    args: {
        href: '#',
        badge: 'v2.0',
        text: 'Major update available',
        variant: 'minimal',
        animated: true,
    },
};

// Premium variant
export const Premium: Story = {
    args: {
        href: '#',
        badge: 'Pro',
        text: 'Get 50% off for early adopters',
        variant: 'premium',
        icon: <Star size={12} />,
        animated: true,
    },
};

// With custom icon
export const WithIcon: Story = {
    args: {
        href: '#',
        badge: 'Launch',
        text: 'AI-powered components are here',
        variant: 'default',
        icon: <Rocket size={12} />,
        animated: true,
    },
};

// Without animation
export const WithoutAnimation: Story = {
    args: {
        href: '#',
        badge: 'Static',
        text: 'This banner has no animations',
        variant: 'minimal',
        animated: false,
    },
};

// Custom styling
export const CustomStyling: Story = {
    args: {
        href: '#',
        badge: 'Custom',
        text: 'Custom styled banner',
        variant: 'minimal',
        className:
            'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:border-emerald-800/30 dark:text-emerald-100',
        animated: true,
    },
};

// Preset Components Stories
export const PresetNewFeature: Story = {
    args: {
        href: '#',
        badge: '',
        text: '',
    },
    render: () => <NewFeatureBanner href="#" text="Introducing AI-powered components" />,
    parameters: {
        docs: {
            description: {
                story: 'Preset component for announcing new features with gradient styling and sparkles icon.',
            },
        },
    },
};

export const PresetUpdate: Story = {
    args: {
        href: '#',
        badge: '',
        text: '',
    },
    render: () => <UpdateBanner href="#" text="Version 3.0 brings exciting improvements" />,
    parameters: {
        docs: {
            description: {
                story: 'Preset component for update announcements with default styling.',
            },
        },
    },
};

export const PresetPremium: Story = {
    args: {
        href: '#',
        badge: '',
        text: '',
    },
    render: () => <PremiumBanner href="#" text="Upgrade to unlock premium features" />,
    parameters: {
        docs: {
            description: {
                story: 'Preset component for premium promotions with gold styling and sparkles icon.',
            },
        },
    },
};

// Multiple banners showcase
export const MultipleBanners: Story = {
    args: {
        href: '#',
        badge: '',
        text: '',
    },
    render: () => (
        <div className="space-y-4">
            <CompactBanner
                href="#"
                badge="New"
                text="AI Components launched"
                variant="gradient"
                icon={<Sparkles size={12} />}
            />
            <CompactBanner
                href="#"
                badge="Update"
                text="Performance improvements"
                variant="default"
                icon={<Zap size={12} />}
            />
            <CompactBanner
                href="#"
                badge="Pro"
                text="50% off limited time"
                variant="premium"
                icon={<Gift size={12} />}
            />
            <CompactBanner
                href="#"
                badge="Alert"
                text="Maintenance scheduled"
                variant="minimal"
                icon={<Bell size={12} />}
            />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Showcase of different banner variants and use cases.',
            },
        },
    },
};

// Long text example
export const LongText: Story = {
    args: {
        href: '#',
        badge: 'Announcement',
        text: 'We are excited to announce our biggest update yet with revolutionary features',
        variant: 'gradient',
        icon: <Rocket size={12} />,
        animated: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Example with longer text content to test text wrapping and layout.',
            },
        },
    },
};

// Mobile responsive
export const MobileView: Story = {
    args: {
        href: '#',
        badge: 'Mobile',
        text: 'Mobile optimized',
        variant: 'default',
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
