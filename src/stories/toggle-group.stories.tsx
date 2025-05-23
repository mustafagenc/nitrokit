/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from 'lucide-react';

const meta: Meta<typeof ToggleGroup> = {
    title: 'UI/ToggleGroup',
    component: ToggleGroup,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    subcomponents: { ToggleGroupItem: ToggleGroupItem as React.ComponentType<any> },
    argTypes: {
        type: {
            control: 'radio',
            options: ['single', 'multiple'],
            description:
                "Determines if multiple items can be selected or only a single one. Default is 'single'.",
        },
        variant: {
            control: 'radio',
            options: ['default', 'outline'],
            description: 'Visual style of the toggle group items.',
        },
        size: {
            control: 'radio',
            options: ['default', 'sm', 'lg'],
            description: 'Size of the toggle group items.',
        },
        disabled: {
            control: 'boolean',
            description: 'Prevents user interaction with the entire group.',
        },
        value: {
            control: 'object', // For 'multiple' type, it's string[]
            description: 'Controlled value for single type (string) or multiple type (string[]).',
        },
        defaultValue: {
            control: 'object', // For 'multiple' type, it's string[]
            description: 'Default value for single type (string) or multiple type (string[]).',
        },
        // onValueChange: { action: 'onValueChange' },
    },
};

export default meta;

type Story = StoryObj<typeof ToggleGroup>;

export const DefaultMultiple: Story = {
    render: args => (
        <ToggleGroup {...args}>
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
                <Bold className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
                <Italic className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
                <Underline className="size-4" />
            </ToggleGroupItem>
        </ToggleGroup>
    ),
    args: {
        type: 'multiple',
        variant: 'default',
        defaultValue: ['bold'],
    },
};

export const SingleSelection: Story = {
    render: args => (
        <ToggleGroup {...args}>
            <ToggleGroupItem value="left" aria-label="Align left">
                <AlignLeft className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Align center">
                <AlignCenter className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Align right">
                <AlignRight className="size-4" />
            </ToggleGroupItem>
        </ToggleGroup>
    ),
    args: {
        type: 'single',
        variant: 'default',
        defaultValue: 'center',
    },
};

export const OutlineVariant: Story = {
    render: args => (
        <ToggleGroup {...args}>
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
                <Bold className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
                <Italic className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
                <Underline className="size-4" />
            </ToggleGroupItem>
        </ToggleGroup>
    ),
    args: {
        type: 'multiple',
        variant: 'outline',
        defaultValue: ['italic'],
    },
};

export const Disabled: Story = {
    render: args => (
        <ToggleGroup {...args}>
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
                <Bold className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
                <Italic className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
                <Underline className="size-4" />
            </ToggleGroupItem>
        </ToggleGroup>
    ),
    args: {
        type: 'multiple',
        disabled: true,
        defaultValue: ['bold', 'underline'],
    },
};

export const WithText: Story = {
    render: args => (
        <ToggleGroup {...args}>
            <ToggleGroupItem value="option1">Option 1</ToggleGroupItem>
            <ToggleGroupItem value="option2">Option 2</ToggleGroupItem>
            <ToggleGroupItem value="option3">Option 3</ToggleGroupItem>
        </ToggleGroup>
    ),
    args: {
        type: 'single',
        variant: 'default',
        defaultValue: 'option2',
    },
};

export const SmallSize: Story = {
    render: args => (
        <ToggleGroup {...args}>
            <ToggleGroupItem value="left" aria-label="Align left">
                <AlignLeft className="size-3.5" /> {/* Adjust icon size if needed */}
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Align center">
                <AlignCenter className="size-3.5" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Align right">
                <AlignRight className="size-3.5" />
            </ToggleGroupItem>
        </ToggleGroup>
    ),
    args: {
        type: 'single',
        size: 'sm',
        defaultValue: 'left',
    },
};

export const LargeSize: Story = {
    render: args => (
        <ToggleGroup {...args}>
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
                <Bold className="size-5" /> {/* Adjust icon size if needed */}
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
                <Italic className="size-5" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
                <Underline className="size-5" />
            </ToggleGroupItem>
        </ToggleGroup>
    ),
    args: {
        type: 'multiple',
        size: 'lg',
        defaultValue: ['bold'],
    },
};

export const ControlledSingle: Story = {
    render: function Render(args) {
        const [value, setValue] = React.useState('center');
        return (
            <div className="flex flex-col items-center gap-4">
                <ToggleGroup
                    {...args}
                    type="single"
                    value={value}
                    onValueChange={val => {
                        if (val) setValue(val); // For single, it won't be empty unless all are unselected (if allowed)
                    }}
                    defaultValue={undefined} // Ensure defaultValue is compatible with single type, overriding args
                >
                    <ToggleGroupItem value="left" aria-label="Align left">
                        <AlignLeft className="size-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="center" aria-label="Align center">
                        <AlignCenter className="size-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="right" aria-label="Align right">
                        <AlignRight className="size-4" />
                    </ToggleGroupItem>
                </ToggleGroup>
                <p className="text-sm">Selected: {value || 'None'}</p>
                <button onClick={() => setValue('left')} className="rounded border p-1 text-xs">
                    Set Left
                </button>
            </div>
        );
    },
    args: {
        type: 'single',
    },
};

export const ControlledMultiple: Story = {
    render: function Render(args) {
        const [value, setValue] = React.useState<string[]>(['bold']);
        return (
            <div className="flex flex-col items-center gap-4">
                <ToggleGroup
                    {...args}
                    type="multiple"
                    value={value}
                    onValueChange={setValue}
                    defaultValue={undefined}>
                    <ToggleGroupItem value="bold" aria-label="Toggle bold">
                        <Bold className="size-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="italic" aria-label="Toggle italic">
                        <Italic className="size-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="underline" aria-label="Toggle underline">
                        <Underline className="size-4" />
                    </ToggleGroupItem>
                </ToggleGroup>
                <p className="text-sm">Selected: {value.join(', ') || 'None'}</p>
                <button
                    onClick={() => setValue(['italic', 'underline'])}
                    className="rounded border p-1 text-xs">
                    Set Italic & Underline
                </button>
            </div>
        );
    },
    args: {
        type: 'multiple',
    },
};

export const WithLabelAndGroup: Story = {
    render: args => (
        <div className="flex flex-col items-start gap-2">
            <Label htmlFor="text-format">Text Formatting</Label>
            <ToggleGroup {...args} id="text-format">
                <ToggleGroupItem value="bold" aria-label="Toggle bold">
                    <Bold className="size-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label="Toggle italic">
                    <Italic className="size-4" />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    ),
    args: {
        type: 'multiple',
        defaultValue: ['bold'],
    },
};
