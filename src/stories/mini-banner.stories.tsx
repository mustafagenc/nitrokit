import type { Meta, StoryObj } from '@storybook/nextjs';
import { NextIntlClientProvider } from 'next-intl';

import { MiniBanner } from '@/components/banners/mini-banner';

// Örnek mesajlar, projenizdeki gerçek mesajlarla değiştirebilirsiniz
const messages = {
    en: {
        // Gerekirse buraya çevirileri ekleyin
    },
};

const meta = {
    title: 'Components/Banners/MiniBanner',
    component: MiniBanner,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        href: { control: 'text' },
        badge: { control: 'text' },
        text: { control: 'text' },
        className: { control: 'text' },
    },
    decorators: [
        Story => (
            <NextIntlClientProvider locale="en" messages={messages.en}>
                <Story />
            </NextIntlClientProvider>
        ),
    ],
} satisfies Meta<typeof MiniBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        href: '#',
        badge: 'New',
        text: 'Check out our latest features!',
    },
};

export const CustomClass: Story = {
    args: {
        href: '#',
        badge: 'Update',
        text: 'Version 2.0 is now live!',
        className:
            'bg-green-500/40 hover:bg-green-500/50 dark:bg-green-500/20 dark:hover:bg-green-500/30',
    },
};
