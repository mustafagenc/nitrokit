/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { PasswordInput } from '../../components/ui/password-input'; // Adjust path as needed
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';

const meta: Meta<typeof PasswordInput> = {
    title: 'UI/PasswordInput',
    component: PasswordInput,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        placeholder: {
            control: 'text',
        },
        disabled: {
            control: 'boolean',
        },
        value: {
            control: 'text',
        },
        // onChange: { action: 'changed' }, // Uncomment to log changes
        // onShowPasswordChange: { action: 'showPasswordChanged' }, // If you have such a prop
    },
};

export default meta;

type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
    args: {
        placeholder: 'Enter your password',
    },
};

export const WithValue: Story = {
    args: {
        value: 'sTrongP@sswOrd!',
        placeholder: 'Enter your password',
    },
};

export const Disabled: Story = {
    args: {
        placeholder: 'Password (disabled)',
        disabled: true,
        value: 'cantchange',
    },
};

export const WithLabel: Story = {
    render: args => (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password-labeled">Password</Label>
            <PasswordInput {...args} id="password-labeled" />
        </div>
    ),
    args: {
        placeholder: 'Your secure password',
    },
};

const FormComponent = (args: any) => {
    const [password, setPassword] = React.useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Password submitted:', password);
        alert(`Password submitted: ${password}`);
    };
    return (
        <form onSubmit={handleSubmit} className="grid w-full max-w-sm items-center gap-4">
            <div className="space-y-1.5">
                <Label htmlFor="login-password">Password</Label>
                <PasswordInput
                    {...args}
                    id="login-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <Button type="submit">Login</Button>
        </form>
    );
};

export const InAForm: Story = {
    render: args => <FormComponent {...args} />,
    args: {
        placeholder: 'Enter password to login',
    },
};

export const CustomPlaceholderForToggle: Story = {
    args: {
        placeholder: 'Your secret phrase',
        // Assuming your PasswordInput might have props to customize the toggle button
        // showPasswordText: "Reveal",
        // hidePasswordText: "Conceal",
    },
};
