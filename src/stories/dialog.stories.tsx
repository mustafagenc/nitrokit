/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'; // Assuming you have an Input component

const meta: Meta<typeof Dialog> = {
    title: 'UI/Dialog',
    component: Dialog,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    subcomponents: {
        DialogTrigger: DialogTrigger as any,
        DialogContent: DialogContent as any,
        DialogHeader: DialogHeader as any,
        DialogTitle: DialogTitle as any,
        DialogDescription: DialogDescription as any,
        DialogFooter: DialogFooter as any,
        DialogClose: DialogClose as any,
    },
    argTypes: {
        open: { control: 'boolean', description: 'Controlled open state of the dialog.' },
        defaultOpen: { control: 'boolean', description: 'Initial open state (uncontrolled).' },
        // onOpenChange: { action: 'onOpenChange', description: 'Event handler for when the open state changes.' },
        // modal: { control: 'boolean', description: 'Determines if the dialog is modal.' }, // Usually true by default
    },
};

export default meta;

type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
    render: args => (
        <Dialog {...args}>
            <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription>
                        This is a description for the dialog. You can put any content you want here.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <p>Dialog content goes here.</p>
                    <p>For example, you can have text, forms, or other components.</p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};

export const WithForm: Story = {
    render: args => (
        <Dialog {...args}>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
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
                        <Input id="username" defaultValue="@mustafagenc" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};

export const Controlled: Story = {
    render: function Render(args) {
        const [isOpen, setIsOpen] = React.useState(false);
        return (
            <>
                <Button onClick={() => setIsOpen(true)}>Open Controlled Dialog</Button>
                <Dialog {...args} open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Controlled Dialog</DialogTitle>
                            <DialogDescription>
                                This dialog&apos;s open state is controlled by React state.
                            </DialogDescription>
                        </DialogHeader>
                        <p>Some content for the controlled dialog.</p>
                        <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Close
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </>
        );
    },
    args: {
        // open: false, // Initial state is handled by the render function's useState
    },
};

export const WithoutHeader: Story = {
    render: args => (
        <Dialog {...args}>
            <DialogTrigger asChild>
                <Button variant="outline">Dialog (No Header)</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xs">
                <div className="grid gap-4 py-6 text-center">
                    <p className="text-lg font-medium">Simple Message</p>
                    <p className="text-muted-foreground text-sm">
                        This dialog has no explicit header or footer components.
                    </p>
                </div>
                <DialogFooter className="justify-center">
                    <DialogClose asChild>
                        <Button type="button" variant="default">
                            OK
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};

export const LongContent: Story = {
    render: args => (
        <Dialog {...args}>
            <DialogTrigger asChild>
                <Button variant="outline">Dialog with Long Content</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Terms of Service</DialogTitle>
                    <DialogDescription>
                        Please read the terms and conditions carefully.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto p-1 py-4 pr-3">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p className="mt-4">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                        doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                        veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                        ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                        consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                    </p>
                    <p className="mt-4">
                        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
                        consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt
                        ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima
                        veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi
                        ut aliquid ex ea commodi consequatur?
                    </p>
                    <p className="mt-4">
                        Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
                        nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas
                        nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus
                        qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
                        et quas molestias excepturi sint occaecati cupiditate non provident,
                        similique sunt in culpa qui officia deserunt mollitia animi, id est laborum
                        et dolorum fuga.
                    </p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Decline
                        </Button>
                    </DialogClose>
                    <Button type="submit">Accept</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};
