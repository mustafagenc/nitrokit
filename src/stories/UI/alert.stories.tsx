import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Terminal, AlertCircle, CheckCircle, TriangleAlert } from 'lucide-react';

const meta: Meta<typeof Alert> = {
    title: 'UI/Alert',
    component: Alert,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['default', 'destructive', 'success', 'warning'],
        },
    },
    parameters: {
        layout: 'centered', // Optional: centers the component in the Storybook canvas
    },
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
    args: {
        variant: 'default',
    },
    render: args => (
        <Alert {...args} className="w-[400px]">
            <Terminal className="size-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>You can add components to your app using the cli.</AlertDescription>
        </Alert>
    ),
};

export const Destructive: Story = {
    args: {
        variant: 'destructive',
    },
    render: args => (
        <Alert {...args} className="w-[400px]">
            <AlertCircle className="size-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
        </Alert>
    ),
};

export const Success: Story = {
    args: {
        variant: 'default',
    },
    render: args => (
        <Alert {...args} className="w-[400px]">
            <CheckCircle className="size-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Your changes have been saved successfully.</AlertDescription>
        </Alert>
    ),
};

export const Null: Story = {
    args: {
        variant: null,
    },
    render: args => (
        <Alert {...args} className="w-[400px]">
            <TriangleAlert className="size-4" />
            <AlertTitle>Null</AlertTitle>
            <AlertDescription>
                Please be cautious before proceeding with this action.
            </AlertDescription>
        </Alert>
    ),
};

export const Undefined: Story = {
    args: {
        variant: undefined,
    },
    render: args => (
        <Alert {...args} className="w-[400px]">
            <TriangleAlert className="size-4" />
            <AlertTitle>Undefined</AlertTitle>
            <AlertDescription>
                Please be cautious before proceeding with this action.
            </AlertDescription>
        </Alert>
    ),
};
