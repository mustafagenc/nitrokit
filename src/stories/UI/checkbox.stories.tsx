import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label'; // Assuming you have a Label component

const meta: Meta<typeof Checkbox> = {
    title: 'UI/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        checked: {
            control: { type: 'select' },
            options: [true, false, 'indeterminate'],
        },
        disabled: {
            control: { type: 'boolean' },
        },
        id: {
            control: { type: 'text' },
        },
        'aria-label': {
            control: { type: 'text' },
        },
    },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
    args: {
        id: 'checkbox-default',
        'aria-label': 'Default checkbox',
    },
};

export const Checked: Story = {
    args: {
        id: 'checkbox-checked',
        checked: true,
        'aria-label': 'Checked checkbox',
    },
};

export const Indeterminate: Story = {
    args: {
        id: 'checkbox-indeterminate',
        checked: 'indeterminate',
        'aria-label': 'Indeterminate checkbox',
    },
};

export const Disabled: Story = {
    args: {
        id: 'checkbox-disabled',
        disabled: true,
        'aria-label': 'Disabled checkbox',
    },
};

export const DisabledChecked: Story = {
    args: {
        id: 'checkbox-disabled-checked',
        checked: true,
        disabled: true,
        'aria-label': 'Disabled and checked checkbox',
    },
};

export const DisabledIndeterminate: Story = {
    args: {
        id: 'checkbox-disabled-indeterminate',
        checked: 'indeterminate',
        disabled: true,
        'aria-label': 'Disabled and indeterminate checkbox',
    },
};

export const WithLabel: Story = {
    render: args => (
        <div className="flex items-center space-x-2">
            <Checkbox id="terms" {...args} />
            <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
    ),
    args: {
        // Default args for this story variant if needed
    },
};

export const WithLabelDisabled: Story = {
    render: args => (
        <div className="flex items-center space-x-2">
            <Checkbox id="newsletter" {...args} />
            <Label htmlFor="newsletter" className={args.disabled ? 'text-muted-foreground' : ''}>
                Subscribe to newsletter
            </Label>
        </div>
    ),
    args: {
        disabled: true,
        checked: true,
    },
};

export const WithLabelAndLongText: Story = {
    render: args => (
        <div className="items-top flex space-x-2">
            <Checkbox id="long-text" {...args} />
            <div className="grid gap-1.5 leading-none">
                <Label
                    htmlFor="long-text"
                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I agree to the terms and conditions
                </Label>
                <p className="text-muted-foreground text-sm">
                    You agree to our Terms of Service and Privacy Policy. This is a very long text
                    to see how the checkbox aligns with multiple lines of text.
                </p>
            </div>
        </div>
    ),
    args: {
        // Default args for this story variant if needed
    },
};
