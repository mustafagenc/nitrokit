import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '../../components/ui/skeleton';

const meta: Meta<typeof Skeleton> = {
    title: 'UI/Skeleton',
    component: Skeleton,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        className: {
            control: 'text',
            description: 'Custom CSS classes for the skeleton.',
        },
        // If your Skeleton has other props like width, height, variant, etc.
        // width: { control: 'text' },
        // height: { control: 'text' },
        // variant: { control: { type: 'select' }, options: ['text', 'circle', 'rect'] }
    },
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
    render: (args) => (
        <div className="flex flex-col space-y-3">
            <Skeleton {...args} className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton {...args} className="h-4 w-[250px]" />
                <Skeleton {...args} className="h-4 w-[200px]" />
            </div>
        </div>
    ),
};

export const SingleLine: Story = {
    render: (args) => <Skeleton {...args} className="h-4 w-full max-w-md" />,
};

export const Circle: Story = {
    render: (args) => <Skeleton {...args} className="size-12 rounded-full" />,
};

export const CardSkeleton: Story = {
    render: (args) => (
        <div className="flex w-80 flex-col space-y-3 rounded-lg border p-4">
            <Skeleton {...args} className="h-32 w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton {...args} className="h-6 w-3/4" />
                <Skeleton {...args} className="h-4 w-full" />
                <Skeleton {...args} className="h-4 w-5/6" />
            </div>
            <Skeleton {...args} className="h-10 w-1/3 self-end rounded-md" />
        </div>
    ),
    parameters: {
        layout: 'padded', // Give more space for the card
    },
};

export const ListItemSkeleton: Story = {
    render: (args) => (
        <div className="flex w-96 items-center space-x-4 rounded-lg border p-4">
            <Skeleton {...args} className="size-12 rounded-full" />
            <div className="flex-grow space-y-2">
                <Skeleton {...args} className="h-4 w-3/4" />
                <Skeleton {...args} className="h-4 w-1/2" />
            </div>
            <Skeleton {...args} className="h-8 w-20 rounded-md" />
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

export const ProfileHeaderSkeleton: Story = {
    render: (args) => (
        <div className="flex w-full max-w-md items-center space-x-4 p-4">
            <Skeleton {...args} className="size-16 rounded-full" />
            <div className="space-y-2">
                <Skeleton {...args} className="h-6 w-48" />
                <Skeleton {...args} className="h-4 w-32" />
            </div>
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

export const MultipleLines: Story = {
    render: (args) => (
        <div className="w-64 space-y-2">
            <Skeleton {...args} className="h-4 w-full" />
            <Skeleton {...args} className="h-4 w-full" />
            <Skeleton {...args} className="h-4 w-3/4" />
            <Skeleton {...args} className="h-4 w-5/6" />
        </div>
    ),
};
