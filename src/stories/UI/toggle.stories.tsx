import React from 'react';
import { Italic } from 'lucide-react';

import { Toggle } from '../../components/ui/toggle';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Toggle> = {
    title: 'UI/Toggle',
    component: Toggle,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['default', 'outline'],
        },
        size: {
            control: { type: 'select' },
            options: ['default', 'sm', 'lg'],
        },
        disabled: {
            control: { type: 'boolean' },
        },
        pressed: {
            control: { type: 'boolean' },
        },
        'aria-label': {
            control: { type: 'text' },
        },
    },
};

export default meta;

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
    args: {
        'aria-label': 'Toggle italic',
        children: <Italic className="size-4" />,
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
        'aria-label': 'Toggle italic',
        children: <Italic className="size-4" />,
    },
};

export const WithText: Story = {
    args: {
        'aria-label': 'Toggle bold',
        children: 'Bold',
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
        'aria-label': 'Toggle italic',
        children: <Italic className="size-4" />,
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        'aria-label': 'Toggle italic',
        children: <Italic className="size-4" />,
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        'aria-label': 'Toggle italic',
        children: <Italic className="size-4" />,
    },
};

export const Pressed: Story = {
    args: {
        pressed: true,
        'aria-label': 'Toggle italic',
        children: <Italic className="size-4" />,
    },
};
export const PressedWithText: Story = {
    args: {
        pressed: true,
        'aria-label': 'Toggle bold',
        children: 'Bold',
    },
};
export const PressedOutline: Story = {
    args: {
        variant: 'outline',
        pressed: true,
        'aria-label': 'Toggle italic',
        children: <Italic className="size-4" />,
    },
};
export const PressedSmall: Story = {
    args: {
        size: 'sm',
        pressed: true,
        'aria-label': 'Toggle italic',
        children: <Italic className="size-4" />,
    },
};
