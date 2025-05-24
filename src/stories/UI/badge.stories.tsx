import { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../../components/ui/badge'; // Assuming badgeVariants is exported for options

const meta: Meta<typeof Badge> = {
    title: 'UI/Badge',
    component: Badge,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            // Assuming badgeVariants.variants.variant contains the variant keys
            // If not, replace with the actual array of variant names:
            options: ['default', 'secondary', 'destructive', 'outline'],
        },
        children: {
            control: 'text',
        },
    },
    parameters: {
        layout: 'centered',
    },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
    args: {
        children: 'Default Badge',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Secondary Badge',
    },
};

export const Destructive: Story = {
    args: {
        variant: 'destructive',
        children: 'Destructive Badge',
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
        children: 'Outline Badge',
    },
};
