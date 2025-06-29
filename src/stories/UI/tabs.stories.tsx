import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    User,
    Settings,
    Bell,
    FileText,
    BarChart3,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Clock,
    Star,
    Heart,
} from 'lucide-react';

const meta: Meta<typeof Tabs> = {
    title: 'UI/Tabs',
    component: Tabs,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'A tabs component that provides a way to organize content into multiple views.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        defaultValue: {
            control: 'text',
            description: 'Default active tab',
        },
        value: {
            control: 'text',
            description: 'Controlled active tab',
        },
        onValueChange: { action: 'valueChanged', description: 'onValueChange callback' },
        orientation: {
            control: { type: 'select' },
            options: ['horizontal', 'vertical'],
            description: 'Tab orientation',
        },
        className: {
            control: 'text',
            description: 'Additional CSS classes',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    render: (args) => (
        <Tabs defaultValue="account" className="w-[400px]" {...args}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>
                            Make changes to your account here. Click save when you're done.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" defaultValue="Pedro Duarte" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" defaultValue="@peduarte" />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="password">
                <Card>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>
                            Change your password here. After saving, you'll be logged out.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="current">Current password</Label>
                            <Input id="current" type="password" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="new">New password</Label>
                            <Input id="new" type="password" />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    ),
};

export const WithIcons: Story = {
    render: (args) => (
        <Tabs defaultValue="profile" className="w-[400px]" {...args}>
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                </TabsTrigger>
                <TabsTrigger value="settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                </TabsTrigger>
                <TabsTrigger value="notifications">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                </TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Manage your profile information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Profile content goes here...</p>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="settings">
                <Card>
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                        <CardDescription>Configure your application settings.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Settings content goes here...</p>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="notifications">
                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Manage your notification preferences.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Notifications content goes here...</p>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    ),
};

export const ContactForm: Story = {
    render: (args) => (
        <Tabs defaultValue="personal" className="w-[500px]" {...args}>
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">
                    <User className="mr-2 h-4 w-4" />
                    Personal
                </TabsTrigger>
                <TabsTrigger value="contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact
                </TabsTrigger>
                <TabsTrigger value="preferences">
                    <Heart className="mr-2 h-4 w-4" />
                    Preferences
                </TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Enter your personal details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" placeholder="Doe" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" placeholder="Tell us about yourself..." />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="contact">
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                        <CardDescription>Enter your contact details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="john@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea id="address" placeholder="Enter your address..." />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="preferences">
                <Card>
                    <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                        <CardDescription>Set your preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Theme</Label>
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                    Light
                                </Button>
                                <Button variant="outline" size="sm">
                                    Dark
                                </Button>
                                <Button variant="outline" size="sm">
                                    System
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Language</Label>
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                    English
                                </Button>
                                <Button variant="outline" size="sm">
                                    Spanish
                                </Button>
                                <Button variant="outline" size="sm">
                                    French
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    ),
};

export const CustomStyled: Story = {
    render: (args) => (
        <Tabs defaultValue="tab1" className="w-[400px]" {...args}>
            <TabsList className="grid w-full grid-cols-2 bg-blue-50 dark:bg-blue-950">
                <TabsTrigger
                    value="tab1"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                    Tab 1
                </TabsTrigger>
                <TabsTrigger
                    value="tab2"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                    Tab 2
                </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
                <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                    <CardHeader>
                        <CardTitle className="text-blue-900 dark:text-blue-100">
                            Custom Tab 1
                        </CardTitle>
                        <CardDescription className="text-blue-700 dark:text-blue-300">
                            This tab has custom styling.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-blue-800 dark:text-blue-200">Custom styled content...</p>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="tab2">
                <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                    <CardHeader>
                        <CardTitle className="text-blue-900 dark:text-blue-100">
                            Custom Tab 2
                        </CardTitle>
                        <CardDescription className="text-blue-700 dark:text-blue-300">
                            This tab also has custom styling.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-blue-800 dark:text-blue-200">
                            More custom styled content...
                        </p>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="mb-4 text-lg font-semibold">Basic Tabs</h3>
                <Tabs defaultValue="account" className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account</CardTitle>
                                <CardDescription>
                                    Make changes to your account here. Click save when you're done.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" defaultValue="Pedro Duarte" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" defaultValue="@peduarte" />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="password">
                        <Card>
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                                <CardDescription>
                                    Change your password here. After saving, you'll be logged out.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="current">Current password</Label>
                                    <Input id="current" type="password" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">New password</Label>
                                    <Input id="new" type="password" />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-semibold">Tabs with Icons</h3>
                <Tabs defaultValue="profile" className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="profile">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="settings">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </TabsTrigger>
                        <TabsTrigger value="notifications">
                            <Bell className="mr-2 h-4 w-4" />
                            Notifications
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile</CardTitle>
                                <CardDescription>Manage your profile information.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Profile content goes here...</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Settings</CardTitle>
                                <CardDescription>
                                    Configure your application settings.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Settings content goes here...</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription>
                                    Manage your notification preferences.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Notifications content goes here...</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-semibold">Contact Form Tabs</h3>
                <Tabs defaultValue="personal" className="w-[500px]">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="personal">
                            <User className="mr-2 h-4 w-4" />
                            Personal
                        </TabsTrigger>
                        <TabsTrigger value="contact">
                            <Mail className="mr-2 h-4 w-4" />
                            Contact
                        </TabsTrigger>
                        <TabsTrigger value="preferences">
                            <Heart className="mr-2 h-4 w-4" />
                            Preferences
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="personal">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Enter your personal details.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" placeholder="Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea id="bio" placeholder="Tell us about yourself..." />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="contact">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                                <CardDescription>Enter your contact details.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="john@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Textarea id="address" placeholder="Enter your address..." />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="preferences">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preferences</CardTitle>
                                <CardDescription>Set your preferences.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Theme</Label>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm">
                                            Light
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            Dark
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            System
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Language</Label>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm">
                                            English
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            Spanish
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            French
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-semibold">Custom Styled Tabs</h3>
                <Tabs defaultValue="tab1" className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-2 bg-blue-50 dark:bg-blue-950">
                        <TabsTrigger
                            value="tab1"
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        >
                            Tab 1
                        </TabsTrigger>
                        <TabsTrigger
                            value="tab2"
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        >
                            Tab 2
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">
                        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                            <CardHeader>
                                <CardTitle className="text-blue-900 dark:text-blue-100">
                                    Custom Tab 1
                                </CardTitle>
                                <CardDescription className="text-blue-700 dark:text-blue-300">
                                    This tab has custom styling.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-blue-800 dark:text-blue-200">
                                    Custom styled content...
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="tab2">
                        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                            <CardHeader>
                                <CardTitle className="text-blue-900 dark:text-blue-100">
                                    Custom Tab 2
                                </CardTitle>
                                <CardDescription className="text-blue-700 dark:text-blue-300">
                                    This tab also has custom styling.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-blue-800 dark:text-blue-200">
                                    More custom styled content...
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'This story shows all different variants of the Tabs component for easy comparison.',
            },
        },
    },
};
