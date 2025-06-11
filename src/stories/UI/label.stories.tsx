import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input'; // Assuming you have an Input component
import { Checkbox } from '../../components/ui/checkbox'; // Assuming you have a Checkbox component

const meta: Meta<typeof Label> = {
    title: 'UI/Label',
    component: Label,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        children: {
            control: 'text',
            description: 'The content of the label.',
        },
        htmlFor: {
            control: 'text',
            description: 'The ID of the form element the label is associated with.',
        },
        // Add any other specific props your Label component might have
        // e.g., required: { control: 'boolean' },
        // e.g., className: { control: 'text' },
    },
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
    args: {
        children: 'Your Name',
        htmlFor: 'name-input',
    },
    render: (args) => (
        <div>
            <Label {...args} />
            <Input type="text" id="name-input" placeholder="Enter your name" className="mt-1" />
        </div>
    ),
};

export const WithCheckbox: Story = {
    render: (args) => (
        <div className="flex items-center space-x-2">
            <Checkbox id="terms-checkbox" />
            <Label {...args} htmlFor="terms-checkbox">
                Accept terms and conditions
            </Label>
        </div>
    ),
    args: {
        // children is provided directly in the render function for this example
    },
};

export const Required: Story = {
    args: {
        children: 'Email Address',
        htmlFor: 'email-required',
    },
    render: (args) => (
        <div>
            <Label {...args}>
                {args.children} <span className="text-destructive">*</span>
            </Label>
            <Input
                type="email"
                id="email-required"
                placeholder="you@example.com"
                className="mt-1"
            />
        </div>
    ),
};

export const DisabledInputLabel: Story = {
    args: {
        children: 'Subscription (Disabled)',
        htmlFor: 'subscription-disabled',
        // className: 'text-muted-foreground', // Example of how you might style a label for a disabled input
    },
    render: (args) => (
        <div className="items-top flex space-x-2">
            <Checkbox id="subscription-disabled" disabled />
            <div className="grid gap-1.5 leading-none">
                <Label
                    htmlFor="subscription-disabled"
                    className={args.className || 'text-muted-foreground'} // Apply class if passed, or default
                >
                    {args.children}
                </Label>
                <p className="text-muted-foreground text-sm">
                    You will not receive any promotional emails.
                </p>
            </div>
        </div>
    ),
};

export const InlineWithOtherText: Story = {
    args: {
        children: 'Username:',
        className: 'font-semibold mr-2', // Example styling
    },
    render: (args) => (
        <p className="text-sm">
            <Label {...args} />
            <span className="text-muted-foreground">nitrokit</span>
        </p>
    ),
};
