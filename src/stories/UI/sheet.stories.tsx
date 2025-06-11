/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '../../components/ui/sheet';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';

const meta: Meta<typeof Sheet> = {
    title: 'UI/Sheet',
    component: Sheet,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered', // Or 'fullscreen' if the sheet takes significant space
    },
    subcomponents: {
        SheetTrigger: SheetTrigger as any,
        SheetContent: SheetContent as any,
        SheetHeader: SheetHeader as any,
        SheetTitle: SheetTitle as any,
        SheetDescription: SheetDescription as any,
        SheetFooter: SheetFooter as any,
        SheetClose: SheetClose as any,
    },
    argTypes: {
        open: { control: 'boolean', description: 'Controlled open state.' },
        defaultOpen: { control: 'boolean', description: 'Initial open state (uncontrolled).' },
        onOpenChange: { action: 'onOpenChange' },
        modal: { control: 'boolean' }, // Usually true by default for sheets
    },
};

export default meta;

type Story = StoryObj<typeof SheetContent>; // Story for SheetContent to control 'side'

const SHEET_SIDES = ['top', 'right', 'bottom', 'left'] as const;

export const Default: Story = {
    render: (args) => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Open Sheet (Right)</Button>
            </SheetTrigger>
            <SheetContent {...args}>
                {' '}
                {/* side prop will be passed here */}
                <SheetHeader>
                    <SheetTitle>Sheet Title</SheetTitle>
                    <SheetDescription>
                        This is a description for the sheet. Place any content you need here.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <p>Sheet content goes here.</p>
                    <p>For example, navigation links, forms, or settings.</p>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="button" variant="outline">
                            Close
                        </Button>
                    </SheetClose>
                    <Button type="submit">Save changes</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    ),
    args: {
        side: 'right',
    },
};

export const FromLeft: Story = {
    ...Default, // Inherit render function from Default
    args: {
        side: 'left',
    },
    render: (
        args // Need to override render to change trigger text
    ) => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Open Sheet (Left)</Button>
            </SheetTrigger>
            <SheetContent {...args}>
                <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>Navigation items or other options.</SheetDescription>
                </SheetHeader>
                <nav className="grid gap-2 py-4">
                    <Button variant="ghost" className="justify-start">
                        Dashboard
                    </Button>
                    <Button variant="ghost" className="justify-start">
                        Analytics
                    </Button>
                    <Button variant="ghost" className="justify-start">
                        Settings
                    </Button>
                </nav>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="secondary" className="w-full">
                            Close Menu
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    ),
};

export const FromTop: Story = {
    ...Default,
    args: {
        side: 'top',
    },
    render: (args) => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Open Sheet (Top)</Button>
            </SheetTrigger>
            <SheetContent {...args}>
                <SheetHeader className="text-center">
                    <SheetTitle>Notifications</SheetTitle>
                    <SheetDescription>You have 3 unread messages.</SheetDescription>
                </SheetHeader>
                <div className="p-4">
                    {/* Example notification items */}
                    <div className="border-b py-2">Notification 1</div>
                    <div className="border-b py-2">Notification 2</div>
                    <div className="py-2">Notification 3</div>
                </div>
                <SheetFooter className="sm:justify-center">
                    <SheetClose asChild>
                        <Button>Mark all as read</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    ),
};

export const FromBottom: Story = {
    ...Default,
    args: {
        side: 'bottom',
    },
    render: (args) => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Open Sheet (Bottom)</Button>
            </SheetTrigger>
            <SheetContent {...args}>
                <SheetHeader>
                    <SheetTitle>Confirm Action</SheetTitle>
                    <SheetDescription>
                        Are you sure you want to delete this item? This action cannot be undone.
                    </SheetDescription>
                </SheetHeader>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button variant="destructive">Delete</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    ),
};

export const WithForm: Story = {
    render: (args) => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </SheetTrigger>
            <SheetContent {...args}>
                <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" defaultValue="Mustafa Genc" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Username
                        </Label>
                        <Input id="username" defaultValue="@nitrokit" className="col-span-3" />
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </SheetClose>
                    <Button type="submit">Save changes</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    ),
    args: {
        side: 'right', // Default side for this form example
    },
};

export const Controlled: Story = {
    render: function Render(args) {
        const [isOpen, setIsOpen] = React.useState(false);
        return (
            <div className="flex flex-col items-center gap-2">
                <Button onClick={() => setIsOpen(true)}>Open Controlled Sheet</Button>
                <p className="text-muted-foreground text-xs">State: {isOpen ? 'Open' : 'Closed'}</p>
                <Sheet {...args} open={isOpen} onOpenChange={setIsOpen}>
                    <SheetContent side="bottom">
                        {' '}
                        {/* Or any other side */}
                        <SheetHeader>
                            <SheetTitle>Controlled Sheet</SheetTitle>
                            <SheetDescription>
                                This sheet&apos;s open state is managed by React state.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="p-4">
                            <Button
                                onClick={() => setIsOpen(false)}
                                variant="destructive"
                                className="w-full"
                            >
                                Close Programmatically
                            </Button>
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button type="button" variant="secondary">
                                    Close with Component
                                </Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        );
    },
    // args for Sheet root, not SheetContent here
};

export const AllSidesDemo: Story = {
    render: () => (
        <div className="grid grid-cols-2 gap-4">
            {SHEET_SIDES.map((side) => (
                <Sheet key={side}>
                    <SheetTrigger asChild>
                        <Button variant="outline">Open {side}</Button>
                    </SheetTrigger>
                    <SheetContent side={side}>
                        <SheetHeader>
                            <SheetTitle>Edit profile</SheetTitle>
                            <SheetDescription>
                                Make changes to your profile here. Click save when you&apos;re done.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor={`name-${side}`} className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id={`name-${side}`}
                                    value="Pedro Duarte"
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor={`username-${side}`} className="text-right">
                                    Username
                                </Label>
                                <Input
                                    id={`username-${side}`}
                                    value="@peduarte"
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button type="submit">Save changes</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            ))}
        </div>
    ),
    parameters: {
        layout: 'padded', // Give more space for multiple triggers
    },
};
