/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../components/ui/hover-card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { CalendarDays } from 'lucide-react';

const meta: Meta<typeof HoverCard> = {
    title: 'UI/HoverCard',
    component: HoverCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    subcomponents: {
        HoverCardTrigger: HoverCardTrigger as any,
        HoverCardContent: HoverCardContent as any,
    },
    argTypes: {
        openDelay: {
            control: 'number',
            description: 'Delay in milliseconds before opening the card.',
        },
        closeDelay: {
            control: 'number',
            description: 'Delay in milliseconds before closing the card.',
        },
        // open: { control: 'boolean', description: 'Controlled open state.' },
        // onOpenChange: { action: 'onOpenChange', description: 'Callback when open state changes.' },
    },
};

export default meta;

type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
    render: args => (
        <HoverCard {...args}>
            <HoverCardTrigger asChild>
                <Button variant="link">@nextjs</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                    <Avatar>
                        <AvatarImage src="https://github.com/vercel.png" />
                        <AvatarFallback>VC</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">@nextjs</h4>
                        <p className="text-sm">
                            The React Framework – created and maintained by @vercel.
                        </p>
                        <div className="flex items-center pt-2">
                            <CalendarDays className="mr-2 size-4 opacity-70" />{' '}
                            <span className="text-muted-foreground text-xs">
                                Joined December 2021
                            </span>
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    ),
    args: {
        openDelay: 200,
        closeDelay: 100,
    },
};

export const WithCustomTrigger: Story = {
    render: args => (
        <HoverCard {...args}>
            <HoverCardTrigger asChild>
                <span className="text-primary cursor-pointer font-bold underline">
                    Hover over me (custom span)
                </span>
            </HoverCardTrigger>
            <HoverCardContent>
                <p className="text-sm">This card is triggered by a custom span element.</p>
            </HoverCardContent>
        </HoverCard>
    ),
};

export const SimpleTextContent: Story = {
    render: args => (
        <HoverCard {...args}>
            <HoverCardTrigger asChild>
                <Button variant="outline">Info</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto max-w-xs">
                <p className="text-sm">
                    This is a simple hover card with just text content. It can be useful for
                    displaying tooltips or short pieces of information.
                </p>
            </HoverCardContent>
        </HoverCard>
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
                <HoverCard {...args} open={isOpen} onOpenChange={setIsOpen}>
                    <HoverCardTrigger asChild>
                        <Button variant="link">@reactjs</Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage src="https://github.com/facebook.png" />
                                <AvatarFallback>FB</AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="text-sm font-semibold">@reactjs</h4>
                                <p className="text-sm">
                                    A JavaScript library for building user interfaces.
                                </p>
                            </div>
                        </div>
                    </HoverCardContent>
                </HoverCard>
                <p className="text-muted-foreground text-xs">
                    Current state: {isOpen ? 'Open' : 'Closed'}
                </p>
            </div>
        );
    },
    args: {
        // open and onOpenChange are handled by the render function's useState
    },
};
