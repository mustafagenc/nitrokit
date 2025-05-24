import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Plus, X } from 'lucide-react';

const meta: Meta<typeof Collapsible> = {
    title: 'UI/Collapsible',
    component: Collapsible,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        open: {
            control: 'boolean',
            description: 'The controlled open state of the collapsible.',
        },
        defaultOpen: {
            control: 'boolean',
            description: 'The open state of the collapsible when it is initially rendered.',
        },
        disabled: {
            control: 'boolean',
            description: 'When true, prevents the user from interacting with the collapsible.',
        },
        // onOpenChange: { action: 'onOpenChange' }, // Uncomment to log open state changes
    },
};

export default meta;

type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
    render: args => (
        <Collapsible {...args} className="w-[350px] space-y-2">
            <div className="flex items-center justify-between space-x-4 px-4">
                <h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="size-4" />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <div className="rounded-md border px-4 py-3 font-mono text-sm">
                @radix-ui/primitives
            </div>
            <CollapsibleContent className="space-y-2">
                <div className="rounded-md border px-4 py-3 font-mono text-sm">
                    @radix-ui/colors
                </div>
                <div className="rounded-md border px-4 py-3 font-mono text-sm">@stitches/react</div>
            </CollapsibleContent>
        </Collapsible>
    ),
};

export const InitiallyOpen: Story = {
    args: {
        defaultOpen: true,
    },
    render: args => (
        <Collapsible {...args} className="w-[350px] space-y-2">
            <div className="flex items-center justify-between space-x-4 px-4">
                <h4 className="text-sm font-semibold">View Profile</h4>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <ChevronsUpDown className="size-4" />
                        <span className="sr-only">Toggle profile</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2 border-t p-4">
                <p className="text-sm">Name: John Doe</p>
                <p className="text-sm">Email: john.doe@example.com</p>
                <p className="text-sm">Joined: January 1, 2023</p>
            </CollapsibleContent>
        </Collapsible>
    ),
};

export const Controlled: Story = {
    render: function Render(args) {
        const [isOpen, setIsOpen] = React.useState(false);

        return (
            <Collapsible
                {...args}
                open={isOpen}
                onOpenChange={setIsOpen}
                className="w-[350px] space-y-2">
                <div className="flex items-center justify-between space-x-4 px-4">
                    <h4 className="text-sm font-semibold">
                        {isOpen ? 'Hide' : 'Show'} Advanced Settings
                    </h4>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0">
                            {isOpen ? <X className="size-4" /> : <Plus className="size-4" />}
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="space-y-2 rounded-md border p-4">
                    <p>Setting 1: Enable feature X</p>
                    <p>Setting 2: Configure parameter Y</p>
                </CollapsibleContent>
            </Collapsible>
        );
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        defaultOpen: true, // To show content is not accessible
    },
    render: args => (
        <Collapsible {...args} className="w-[350px] space-y-2">
            <div className="flex items-center justify-between space-x-4 px-4">
                <h4 className="text-sm font-semibold">Disabled Section</h4>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="size-4" />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2 border-t p-4">
                <p className="text-muted-foreground text-sm">
                    This content is not interactive because the collapsible is disabled.
                </p>
            </CollapsibleContent>
        </Collapsible>
    ),
};
