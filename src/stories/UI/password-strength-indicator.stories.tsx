import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PasswordStrengthIndicator } from '@/components/ui/password-strength-indicator';
import { MockIntlProvider } from '../MockIntlProvider';

const meta: Meta<typeof PasswordStrengthIndicator> = {
    title: 'UI/PasswordStrengthIndicator',
    component: PasswordStrengthIndicator,
    decorators: [
        (Story) => (
            <MockIntlProvider>
                <Story />
            </MockIntlProvider>
        ),
    ],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Shows password strength, requirements, and warnings. Supports dark/light mode ve farklı varyantlar.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        password: {
            control: 'text',
            description: 'Password to check',
        },
        showRequirements: {
            control: 'boolean',
            description: 'Show requirements list',
        },
        showWarning: {
            control: 'boolean',
            description: 'Show warning for weak passwords',
        },
        className: {
            control: 'text',
            description: 'Additional CSS classes',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    render: (args) => {
        const [password, setPassword] = useState('');
        return (
            <div className="mx-auto max-w-md space-y-4">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifre girin..."
                    className="w-full rounded border px-3 py-2 text-base"
                />
                <PasswordStrengthIndicator
                    password={password}
                    showRequirements={args.showRequirements}
                    showWarning={args.showWarning}
                    className={args.className}
                />
            </div>
        );
    },
    args: {
        showRequirements: true,
        showWarning: true,
    },
};

export const WithoutRequirements: Story = {
    render: (args) => {
        const [password, setPassword] = useState('');
        return (
            <div className="mx-auto max-w-md space-y-4">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifre girin..."
                    className="w-full rounded border px-3 py-2 text-base"
                />
                <PasswordStrengthIndicator
                    password={password}
                    showRequirements={false}
                    showWarning={args.showWarning}
                    className={args.className}
                />
            </div>
        );
    },
    args: {
        showWarning: true,
    },
};

export const WithoutWarning: Story = {
    render: (args) => {
        const [password, setPassword] = useState('');
        return (
            <div className="mx-auto max-w-md space-y-4">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifre girin..."
                    className="w-full rounded border px-3 py-2 text-base"
                />
                <PasswordStrengthIndicator
                    password={password}
                    showRequirements={args.showRequirements}
                    showWarning={false}
                    className={args.className}
                />
            </div>
        );
    },
    args: {
        showRequirements: true,
    },
};

export const DarkTheme: Story = {
    render: (args) => {
        const [password, setPassword] = useState('');
        return (
            <div className="mx-auto max-w-md space-y-4">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifre girin..."
                    className="w-full rounded border px-3 py-2 text-base"
                />
                <PasswordStrengthIndicator
                    password={password}
                    showRequirements={args.showRequirements}
                    showWarning={args.showWarning}
                    className={args.className}
                />
            </div>
        );
    },
    args: {
        showRequirements: true,
        showWarning: true,
    },
    parameters: {
        backgrounds: { default: 'dark' },
    },
};
