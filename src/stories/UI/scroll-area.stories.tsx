/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ScrollArea, ScrollBar } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';
import { Badge } from '../../components/ui/badge'; // Assuming you have a Badge component

const meta: Meta<typeof ScrollArea> = {
    title: 'UI/ScrollArea',
    component: ScrollArea,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    subcomponents: { ScrollBar: ScrollBar as React.ComponentType<any> },
    argTypes: {
        // Props for ScrollArea itself, if any (e.g., orientation, type)
        // className for custom styling
        className: { control: 'text' },
    },
};

export default meta;

type Story = StoryObj<typeof ScrollArea>;

const generateItems = (count: number, prefix = 'Item') =>
    Array.from({ length: count }, (_, i) => `${prefix} ${i + 1}`);

export const DefaultVertical: Story = {
    render: (args) => (
        <ScrollArea {...args} className="h-72 w-48 rounded-md border">
            <div className="p-4">
                <h4 className="mb-4 text-sm leading-none font-medium">Items</h4>
                {generateItems(20).map((item) => (
                    <React.Fragment key={item}>
                        <div className="text-sm">{item}</div>
                        <Separator className="my-2" />
                    </React.Fragment>
                ))}
            </div>
            <ScrollBar orientation="vertical" />
        </ScrollArea>
    ),
};

export const Horizontal: Story = {
    render: (args) => (
        <ScrollArea {...args} className="w-96 rounded-md border whitespace-nowrap">
            <div className="flex w-max space-x-4 p-4">
                {generateItems(10, 'Wide Content').map((item) => (
                    <figure key={item} className="shrink-0">
                        <div className="overflow-hidden rounded-md">
                            <div className="bg-secondary text-secondary-foreground flex h-32 w-64 items-center justify-center">
                                {item}
                            </div>
                        </div>
                        <figcaption className="text-muted-foreground pt-2 text-xs">
                            Caption for{' '}
                            <span className="text-foreground font-semibold">{item}</span>
                        </figcaption>
                    </figure>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    ),
};

export const BothScrollbars: Story = {
    render: (args) => (
        <ScrollArea {...args} className="h-[300px] w-[400px] rounded-md border">
            <div className="p-4" style={{ width: '600px' /* Make content wider */ }}>
                <h4 className="mb-4 text-sm leading-none font-medium">Long and Wide Content</h4>
                {generateItems(30, 'Line').map((item) => (
                    <div key={item} className="py-1 text-sm whitespace-nowrap">
                        {item} - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
                        placerat.
                    </div>
                ))}
            </div>
            <ScrollBar orientation="vertical" />
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    ),
};

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

export const WithTags: Story = {
    render: (args) => (
        <ScrollArea {...args} className="h-72 w-full max-w-md rounded-md border">
            <div className="p-4">
                <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
                {tags.map((tag) => (
                    <React.Fragment key={tag}>
                        <div className="text-sm">{tag}</div>
                        <Separator className="my-2" />
                    </React.Fragment>
                ))}
            </div>
            <ScrollBar orientation="vertical" />
        </ScrollArea>
    ),
};

export const WithBadgesHorizontal: Story = {
    render: (args) => (
        <ScrollArea {...args} className="w-full max-w-lg rounded-md border whitespace-nowrap">
            <div className="flex space-x-2 p-4">
                {tags.slice(0, 15).map((tag) => (
                    <Badge key={tag} variant="secondary">
                        {tag}
                    </Badge>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    ),
};
