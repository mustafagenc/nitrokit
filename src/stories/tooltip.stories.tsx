/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Plus, Settings, HelpCircle, Trash2 } from 'lucide-react';

// Define types for story arguments
type BaseTooltipProps = React.ComponentProps<typeof Tooltip>;
type BaseTooltipContentProps = React.ComponentProps<typeof TooltipContent>;

type TooltipStoryArgs = BaseTooltipProps &
    Pick<BaseTooltipContentProps, 'side' | 'align' | 'sideOffset' | 'alignOffset'> & {
        tooltipText?: string; // For customizable tooltip text
    };

const meta: Meta<TooltipStoryArgs> = {
    title: 'UI/Tooltip',
    component: Tooltip,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        Story => (
            // TooltipProvider is often needed at a higher level in your app
            <TooltipProvider>
                <Story />
            </TooltipProvider>
        ),
    ],
    subcomponents: {
        TooltipTrigger: TooltipTrigger as React.ComponentType<any>,
        TooltipContent: TooltipContent as React.ComponentType<any>,
    },
    argTypes: {
        defaultOpen: {
            control: 'boolean',
            description: 'Initial open state of the tooltip (uncontrolled).',
        },
        open: {
            control: 'boolean',
            description: 'Controlled open state of the tooltip.',
        },
        // onOpenChange: { action: 'onOpenChange' },
        side: {
            control: 'select',
            options: ['top', 'right', 'bottom', 'left'],
            description: 'Side of the trigger the tooltip appears on. (Passed to TooltipContent)',
        },
        align: {
            control: 'select',
            options: ['start', 'center', 'end'],
            description:
                'Alignment of the tooltip relative to the trigger. (Passed to TooltipContent)',
        },
        sideOffset: {
            control: 'number',
            description: 'Offset from the trigger along the side. (Passed to TooltipContent)',
        },
        alignOffset: {
            control: 'number',
            description:
                'Offset from the trigger along the alignment axis. (Passed to TooltipContent)',
        },
        tooltipText: {
            control: 'text',
            description: 'Text content for the tooltip. (Passed to TooltipContent)',
        },
    },
};

export default meta;

type Story = StoryObj<TooltipStoryArgs>;

export const Default: Story = {
    render: args => {
        const { side, align, sideOffset, alignOffset, tooltipText, ...tooltipProps } = args;
        return (
            <Tooltip {...tooltipProps}>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Plus className="size-4" />
                        <span className="sr-only">Add</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent
                    side={side}
                    align={align}
                    sideOffset={sideOffset}
                    alignOffset={alignOffset}>
                    <p>{tooltipText}</p>
                </TooltipContent>
            </Tooltip>
        );
    },
    args: {
        delayDuration: 300,
        side: 'top',
        align: 'center',
        sideOffset: 0,
        alignOffset: 0,
        tooltipText: 'Add to library',
    },
};

export const SidePlacement: Story = {
    render: args => (
        <div className="flex flex-wrap gap-4">
            {(['top', 'right', 'bottom', 'left'] as const).map(side => (
                <Tooltip key={side} {...args} delayDuration={0}>
                    <TooltipTrigger asChild>
                        <Button variant="outline">
                            {side.charAt(0).toUpperCase() + side.slice(1)}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side={side}>
                        <p>Tooltip on {side}</p>
                    </TooltipContent>
                </Tooltip>
            ))}
        </div>
    ),
    parameters: {
        layout: 'padded', // Give more space for multiple tooltips
    },
};

export const WithCustomContent: Story = {
    render: args => (
        <Tooltip {...args}>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Settings className="size-5" />
                    <span className="sr-only">Settings</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-primary text-primary-foreground rounded-md p-3 shadow-lg">
                <div className="flex flex-col items-center">
                    <h4 className="mb-1 font-semibold">Advanced Settings</h4>
                    <p className="text-xs">Configure application preferences.</p>
                    <Button variant="secondary" size="sm" className="mt-2">
                        Go to settings
                    </Button>
                </div>
            </TooltipContent>
        </Tooltip>
    ),
    args: {
        delayDuration: 100,
    },
};

export const OnDisabledButton: Story = {
    render: args => (
        <Tooltip {...args}>
            {/* For disabled elements, the trigger often needs to be wrapped if it doesn't forward refs correctly or handle pointer events when disabled.
                Using `asChild` with a span wrapper is a common pattern. */}
            <TooltipTrigger asChild>
                <span tabIndex={0}>
                    {' '}
                    {/* Make span focusable for accessibility if button is truly disabled */}
                    <Button variant="destructive" disabled>
                        <Trash2 className="mr-2 size-4" /> Delete (Disabled)
                    </Button>
                </span>
            </TooltipTrigger>
            <TooltipContent>
                <p>You do not have permission to delete this.</p>
            </TooltipContent>
        </Tooltip>
    ),
    args: {
        delayDuration: 200,
    },
};

export const LongDelay: Story = {
    render: args => (
        <Tooltip {...args}>
            <TooltipTrigger asChild>
                <Button variant="outline">Hover for a bit</Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>This appeared after a 1-second delay!</p>
            </TooltipContent>
        </Tooltip>
    ),
    args: {
        delayDuration: 1000,
    },
};

export const NoDelay: Story = {
    render: args => (
        <Tooltip {...args}>
            <TooltipTrigger asChild>
                <Button variant="secondary">Instant Tooltip</Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>This tooltip appears immediately.</p>
            </TooltipContent>
        </Tooltip>
    ),
    args: {
        delayDuration: 0,
    },
};

export const ControlledTooltip: Story = {
    render: function Render(args) {
        const [isOpen, setIsOpen] = React.useState(false);
        return (
            <div className="flex flex-col items-center gap-4">
                <div className="flex gap-2">
                    <Button onClick={() => setIsOpen(true)}>Open Tooltip</Button>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Close Tooltip
                    </Button>
                </div>
                <Tooltip {...args} open={isOpen} onOpenChange={setIsOpen}>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <HelpCircle className="size-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>This tooltip is controlled by external state.</p>
                        <p>State: {isOpen ? 'Open' : 'Closed'}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        );
    },
    args: {
        delayDuration: 0, // Usually set to 0 for controlled tooltips
    },
};
