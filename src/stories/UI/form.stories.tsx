/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '../../components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea'; // Assuming you have a Textarea component
// import { toast } from "../../components/ui/use-toast"; // Or your preferred toast mechanism

// Define the form schema using Zod
const profileFormSchema = z.object({
    username: z
        .string()
        .min(2, {
            message: 'Username must be at least 2 characters.',
        })
        .max(30, {
            message: 'Username must not be longer than 30 characters.',
        }),
    email: z
        .string({
            required_error: 'Please select an email to display.',
        })
        .email(),
    bio: z.string().max(160).min(4).optional(),
    website: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Default values for the form
const defaultValues: Partial<ProfileFormValues> = {
    username: 'nitrokit',
    email: 'hello@nitrokit.tr',
    bio: 'I make things on the web.',
    website: 'https://nitrokit.tr',
};

const meta: Meta<typeof Form> = {
    title: 'UI/Form',
    component: Form, // The main Form context provider
    tags: ['autodocs'],
    parameters: {
        layout: 'padded', // 'centered' might be too small for a form
    },
    // We don't typically pass args directly to the Form component itself
    // The behavior is defined by its children and the useForm hook
    subcomponents: {
        FormField: FormField as any,
        FormItem: FormItem as any,
        FormLabel: FormLabel as any,
        FormControl: FormControl as any,
        FormDescription: FormDescription as any,
        FormMessage: FormMessage as any,
    },
};

export default meta;

type Story = StoryObj<typeof Form>; // StoryObj<typeof meta> or StoryObj<typeof YourFormComponent>

// Helper component for the story
function ProfileFormStory() {
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: 'onChange', // Validate on change
    });

    function onSubmit(data: ProfileFormValues) {
        console.log('Form submitted:', data);
        // Example: Using toast
        // toast({
        //  title: "You submitted the following values:",
        //  description: (
        //    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //      <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        //    </pre>
        //  ),
        // });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-xl space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Your username" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name. It can be your real name or a
                                pseudonym.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Your email address" {...field} />
                            </FormControl>
                            <FormDescription>
                                We will use this email for account-related notifications.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea // Replace with Input if Textarea is not available
                                    placeholder="Tell us a little bit about yourself"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                You can <span>@mention</span> other users and organizations to link
                                to them.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                                <Input placeholder="https://your-website.com" {...field} />
                            </FormControl>
                            <FormDescription>Your personal or company website.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset(defaultValues)}
                    >
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        disabled={!form.formState.isValid || form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? 'Updating...' : 'Update profile'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export const Profile: Story = {
    render: () => <ProfileFormStory />,
};

// --- Another example: Simple Login Form ---
const loginFormSchema = z.object({
    email: z.string().email('Invalid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
});
type LoginFormValues = z.infer<typeof loginFormSchema>;

function LoginFormStory() {
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: { email: '', password: '' },
    });

    function onSubmit(data: LoginFormValues) {
        console.log('Login attempt:', data);
        // toast({ title: "Login Submitted", description: "Check console for data." });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    Login
                </Button>
            </form>
        </Form>
    );
}

export const Login: Story = {
    render: () => <LoginFormStory />,
};
