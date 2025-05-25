/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Settings2 } from 'lucide-react';

const meta: Meta<typeof Popover> = {
    title: 'UI/Popover',
    component: Popover,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    subcomponents: {
        PopoverTrigger: PopoverTrigger as React.ComponentType<any>,
        PopoverContent: PopoverContent as React.ComponentType<any>,
    },
    argTypes: {
        open: { control: 'boolean', description: 'Controlled open state.' },
        defaultOpen: { control: 'boolean', description: 'Initial open state (uncontrolled).' },
        onOpenChange: { action: 'onOpenChange' },
        modal: { control: 'boolean' }, // If your popover supports modal behavior
    },
};

export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
    render: args => (
        <Popover {...args}>
            <PopoverTrigger asChild>
                <Button variant="outline">Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="leading-none font-medium">Dimensions</h4>
                        <p className="text-muted-foreground text-sm">
                            Set the dimensions for the layer.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="width">Width</Label>
                            <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="maxWidth">Max. width</Label>
                            <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="height">Height</Label>
                            <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="maxHeight">Max. height</Label>
                            <Input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    ),
};

export const WithIconButtonTrigger: Story = {
    render: args => (
        <Popover {...args}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                    <Settings2 className="size-4" />
                    <span className="sr-only">Open settings</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4">
                <p className="text-sm">This is a simple popover content.</p>
                <Button variant="link" size="sm" className="mt-2 h-auto p-0">
                    Learn more
                </Button>
            </PopoverContent>
        </Popover>
    ),
};

export const Controlled: Story = {
    render: function Render(args) {
        const [isOpen, setIsOpen] = React.useState(false);
        return (
            <div className="flex flex-col items-center gap-4">
                <div className="flex gap-2">
                    <Button onClick={() => setIsOpen(true)}>Open Programmatically</Button>
                    <Button variant="secondary" onClick={() => setIsOpen(false)}>
                        Close Programmatically
                    </Button>
                </div>
                <Popover {...args} open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="destructive">Toggle Popover</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        Place content for the popover here. <br />
                        Controlled state: {isOpen ? 'Open' : 'Closed'}
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full"
                            onClick={() => setIsOpen(false)}>
                            Close from inside
                        </Button>
                    </PopoverContent>
                </Popover>
            </div>
        );
    },
    args: {
        // open and onOpenChange are handled by the render function's useState
    },
};

export const CustomPlacement: Story = {
    render: args => (
        <div className="flex gap-4">
            <Popover {...args}>
                <PopoverTrigger asChild>
                    <Button variant="outline">Top</Button>
                </PopoverTrigger>
                <PopoverContent side="top" align="center" className="w-auto p-2">
                    <p className="text-xs">Content aligned top-center</p>
                </PopoverContent>
            </Popover>
            <Popover {...args}>
                <PopoverTrigger asChild>
                    <Button variant="outline">Right Start</Button>
                </PopoverTrigger>
                <PopoverContent side="right" align="start" className="w-auto p-2">
                    <p className="text-xs">Content aligned right-start</p>
                </PopoverContent>
            </Popover>
            <Popover {...args}>
                <PopoverTrigger asChild>
                    <Button variant="outline">Bottom End</Button>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="end" className="w-auto p-2">
                    <p className="text-xs">Content aligned bottom-end</p>
                </PopoverContent>
            </Popover>
            <Popover {...args}>
                <PopoverTrigger asChild>
                    <Button variant="outline">Left</Button>
                </PopoverTrigger>
                <PopoverContent side="left" className="w-auto p-2">
                    <p className="text-xs">Content aligned left-center</p>
                </PopoverContent>
            </Popover>
        </div>
    ),
    parameters: {
        // layout: 'padded', // Give more space to see placements
    },
};
