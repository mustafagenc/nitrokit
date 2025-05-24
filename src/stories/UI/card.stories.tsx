import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing, Check } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof Card> = {
    title: 'UI/Card',
    component: Card,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    // argTypes for the Card component itself if it has direct props.
    // Most content will be structured via children.
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
    render: args => (
        <Card {...args} className="w-[380px]">
            <CardHeader>
                <CardTitle>Create project</CardTitle>
                <CardDescription>Deploy your new project in one-click.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
                {/* You can add form elements or other content here */}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Deploy</Button>
            </CardFooter>
        </Card>
    ),
};

const notifications = [
    {
        title: 'Your call has been confirmed.',
        description: '1 hour ago',
    },
    {
        title: 'You have a new message!',
        description: '1 hour ago',
    },
    {
        title: 'Your subscription is expiring soon!',
        description: '2 hours ago',
    },
];

export const WithNotifications: Story = {
    render: args => (
        <Card {...args} className="w-[380px]">
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>You have {notifications.length} unread messages.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <BellRing />
                    <div className="flex-1 space-y-1">
                        <p className="text-sm leading-none font-medium">Push Notifications</p>
                        <p className="text-muted-foreground text-sm">
                            Send notifications to device.
                        </p>
                    </div>
                    <Switch id="push-notifications" />
                </div>
                <div>
                    {notifications.map((notification, index) => (
                        <div
                            key={index}
                            className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                            <span className="flex size-2 translate-y-1 rounded-full bg-sky-500" />
                            <div className="space-y-1">
                                <p className="text-sm leading-none font-medium">
                                    {notification.title}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    {notification.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">
                    <Check className="mr-2 size-4" /> Mark all as read
                </Button>
            </CardFooter>
        </Card>
    ),
};

export const Simple: Story = {
    render: args => (
        <Card {...args} className="w-[300px]">
            <CardHeader>
                <CardTitle>Simple Card</CardTitle>
            </CardHeader>
            <CardContent>
                <p>This is a basic card with minimal content.</p>
            </CardContent>
        </Card>
    ),
};

export const WithOnlyContent: Story = {
    render: args => (
        <Card {...args} className="w-[300px]">
            <CardContent className="pt-6">
                {' '}
                {/* Added pt-6 for padding like header/footer */}
                <p>This card only has content, no header or footer.</p>
                <Button variant="link" className="p-0">
                    A link button
                </Button>
            </CardContent>
        </Card>
    ),
};

export const WithFormElements: Story = {
    render: args => (
        <Card className="w-[350px]" {...args}>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {/* Assuming you have an Input component */}
                    {/* <Input id="email" type="email" placeholder="m@example.com" /> */}
                    <input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    {/* <Input id="password" type="password" /> */}
                    <input
                        id="password"
                        type="password"
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">Sign In</Button>
            </CardFooter>
        </Card>
    ),
};
