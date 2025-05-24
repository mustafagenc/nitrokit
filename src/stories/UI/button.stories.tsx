/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Meta, StoryObj } from '@storybook/nextjs';
import { Heart } from 'lucide-react';

const meta: Meta<typeof Button> = {
    title: 'UI/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        },
        size: {
            control: { type: 'select' },
            options: ['default', 'sm', 'lg', 'icon', 'rlg'],
        },
        asChild: {
            control: { type: 'boolean' },
        },
        children: {
            control: { type: 'text' },
        },
    },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {
        children: 'Button',
    },
};

export const Destructive: Story = {
    args: {
        variant: 'destructive',
        children: 'Destructive',
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
        children: 'Outline',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Secondary',
    },
};

export const Ghost: Story = {
    args: {
        variant: 'ghost',
        children: 'Ghost',
    },
};

export const Link: Story = {
    args: {
        variant: 'link',
        children: 'Link',
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
        children: 'Small Button',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        children: 'Large Button',
    },
};

export const RLarge: Story = {
    args: {
        size: 'rlg',
        children: 'Really Large Button',
    },
};

export const Icon: Story = {
    args: {
        size: 'icon',
        children: <Heart />,
    },
};

export const WithIcon: Story = {
    args: {
        children: (
            <>
                <Heart className="mr-2 size-4" /> Login with Email
            </>
        ),
    },
};

export const AsChild: Story = {
    args: {
        asChild: true,
        children: <a href="/?path=/story/ui-button--default">Link Button</a>,
    },
};
export const AsChildWithIcon: Story = {
    args: {
        asChild: true,
        children: (
            <>
                <a href="/?path=/story/ui-button--default">
                    <Heart className="mr-2 size-4" /> Login with Email
                </a>
            </>
        ),
    },
};
