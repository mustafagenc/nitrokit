import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';

const meta: Meta<typeof Switch> = {
    title: 'UI/Switch',
    component: Switch,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        checked: {
            control: 'boolean',
            description: 'The controlled checked state of the switch.',
        },
        defaultChecked: {
            control: 'boolean',
            description: 'The initial checked state when uncontrolled.',
        },
        disabled: {
            control: 'boolean',
            description: 'Prevents user interaction with the switch.',
        },
        required: {
            control: 'boolean',
            description: 'If true, the switch must be checked in a form.',
        },
        name: {
            control: 'text',
            description: 'The name of the switch, used when submitting a form.',
        },
        value: {
            control: 'text',
            description: 'The value of the switch, used when submitting a form.',
        },
        // onCheckedChange: { action: 'onCheckedChange' },
    },
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
    render: args => <Switch {...args} />,
    args: {
        // Default args if any, e.g., defaultChecked: false
    },
};

export const Checked: Story = {
    render: args => <Switch {...args} />,
    args: {
        checked: true,
    },
};

export const Disabled: Story = {
    render: () => (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
                <Switch id="disabled-switch-off" disabled />
                <Label htmlFor="disabled-switch-off">Disabled (Off)</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="disabled-switch-on" defaultChecked disabled />
                <Label htmlFor="disabled-switch-on">Disabled (On)</Label>
            </div>
        </div>
    ),
};

export const WithLabel: Story = {
    render: args => (
        <div className="flex items-center space-x-2">
            <Switch {...args} id="airplane-mode" />
            <Label htmlFor="airplane-mode">Airplane Mode</Label>
        </div>
    ),
    args: {
        // defaultChecked: true, // Example
    },
};

export const Controlled: Story = {
    render: function Render(args) {
        const [isChecked, setIsChecked] = React.useState(false);

        return (
            <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-2">
                    <Switch
                        {...args}
                        id="notifications-switch"
                        checked={isChecked}
                        onCheckedChange={setIsChecked}
                    />
                    <Label htmlFor="notifications-switch">Enable Notifications</Label>
                </div>
                <p className="text-muted-foreground text-sm">
                    Notifications are currently: {isChecked ? 'ON' : 'OFF'}
                </p>
                <button
                    onClick={() => setIsChecked(!isChecked)}
                    className="mt-2 rounded border p-1 text-xs">
                    Toggle Programmatically
                </button>
            </div>
        );
    },
    args: {
        // `checked` and `onCheckedChange` are handled by the render function's state
    },
};

export const WithLabelOnLeft: Story = {
    render: args => (
        <div className="flex items-center space-x-2">
            <Label htmlFor="dark-mode-switch">Dark Mode</Label>
            <Switch {...args} id="dark-mode-switch" />
        </div>
    ),
    args: {
        defaultChecked: true,
    },
};
