import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Search, Mail } from 'lucide-react';

const meta: Meta<typeof Input> = {
    title: 'UI/Input',
    component: Input,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        type: {
            control: { type: 'select' },
            options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url', 'file'],
        },
        placeholder: {
            control: 'text',
        },
        disabled: {
            control: 'boolean',
        },
        value: {
            control: 'text',
        },
        // onChange: { action: 'changed' }, // Uncomment to log changes in Storybook actions
    },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        type: 'text',
        placeholder: 'Enter text...',
    },
};

export const Email: Story = {
    args: {
        type: 'email',
        placeholder: 'you@example.com',
    },
};

export const Password: Story = {
    args: {
        type: 'password',
        placeholder: '••••••••',
    },
};

export const Number: Story = {
    args: {
        type: 'number',
        placeholder: '0',
    },
};

export const SearchInput: Story = {
    args: {
        type: 'search',
        placeholder: 'Search...',
    },
};

export const Disabled: Story = {
    args: {
        type: 'text',
        placeholder: 'Disabled input',
        disabled: true,
        value: "You can't change me",
    },
};

export const WithLabel: Story = {
    render: args => (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email-labeled">Email</Label>
            <Input {...args} id="email-labeled" />
        </div>
    ),
    args: {
        type: 'email',
        placeholder: 'Email',
    },
};

export const WithButton: Story = {
    render: args => (
        <div className="flex w-full max-w-sm items-center space-x-2">
            <Input {...args} />
            <Button type="submit">Subscribe</Button>
        </div>
    ),
    args: {
        type: 'email',
        placeholder: 'Email for newsletter',
    },
};

//ToDo: Update icon positioning
export const WithIcon: Story = {
    render: args => (
        <div className="relative w-full max-w-sm items-center">
            <Input {...args} className="pl-10" />
            <span className="absolute inset-y-0 start-0 flex items-center justify-center px-2">
                <Mail className="text-muted-foreground size-5" />
            </span>
        </div>
    ),
    args: {
        type: 'email',
        placeholder: 'Email with icon',
    },
};

//ToDo: Update icon positioning
export const WithIconAndButton: Story = {
    render: args => (
        <div className="flex w-full max-w-md items-center space-x-2">
            <div className="relative flex-grow items-center">
                <Input {...args} className="pl-10" />
                <span className="absolute inset-y-0 start-0 flex items-center justify-center px-2">
                    <Search className="text-muted-foreground size-5" />
                </span>
            </div>
            <Button type="submit" variant="secondary">
                Search
            </Button>
        </div>
    ),
    args: {
        type: 'search',
        placeholder: 'Search documentation...',
    },
};

export const FileInput: Story = {
    render: args => (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Picture</Label>
            <Input id="picture" {...args} />
        </div>
    ),
    args: {
        type: 'file',
    },
};

export const WithErrorState: Story = {
    // Note: Actual error styling might come from a FormField component or utility classes
    render: args => (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="username-error" className="text-destructive">
                Username
            </Label>
            <Input
                {...args}
                id="username-error"
                className="border-destructive focus-visible:ring-destructive"
            />
            <p className="text-destructive text-sm">Username is required and must be unique.</p>
        </div>
    ),
    args: {
        type: 'text',
        placeholder: 'e.g., nitrokit',
        defaultValue: 'invalid entry', // To visually show something is wrong
    },
};
