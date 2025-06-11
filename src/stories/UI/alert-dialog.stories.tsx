import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof AlertDialog> = {
    title: 'UI/AlertDialog',
    component: AlertDialog,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    // No args needed for the AlertDialog itself, control is via trigger/open state
};

export default meta;

type Story = StoryObj<typeof AlertDialog>;

export const Default: Story = {
    render: (args) => (
        <AlertDialog {...args}>
            <AlertDialogTrigger asChild>
                <Button variant="outline">Show Dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and
                        remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    ),
};

export const DestructiveAction: Story = {
    render: (args) => (
        <AlertDialog {...args}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                    <AlertDialogDescription>
                        This is a destructive action. Are you sure you want to permanently delete
                        this item? All associated data will be lost.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => console.log('Destructive action confirmed')}>
                        Yes, delete it
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    ),
    // You might want to add specific args for this story if needed,
    // but for AlertDialog, the content and actions define its nature.
};
