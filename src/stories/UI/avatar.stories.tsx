import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const meta: Meta<typeof Avatar> = {
    title: 'UI/Avatar',
    component: Avatar,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        // If your Avatar component has props, define them here
        // For example:
        // size: {
        // control: { type: 'select' },
        // options: ['sm', 'md', 'lg'],
        // },
    },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
    render: args => (
        <Avatar {...args}>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    ),
};

export const Fallback: Story = {
    render: args => (
        <Avatar {...args}>
            <AvatarImage src="https://thissourcedoesnotexist.com/image.png" alt="Unavailable" />
            <AvatarFallback>UA</AvatarFallback>
        </Avatar>
    ),
};

export const Initials: Story = {
    render: args => (
        <Avatar {...args}>
            <AvatarFallback>MG</AvatarFallback>
        </Avatar>
    ),
};
