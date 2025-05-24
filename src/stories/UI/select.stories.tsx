/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import { Label } from '../../components/ui/label'; // For form-like examples

const meta: Meta<typeof Select> = {
    title: 'UI/Select',
    component: Select,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    subcomponents: {
        SelectTrigger: SelectTrigger as any,
        SelectValue: SelectValue as any,
        SelectContent: SelectContent as any,
        SelectGroup: SelectGroup as any,
        SelectItem: SelectItem as any,
        SelectLabel: SelectLabel as any,
        SelectSeparator: SelectSeparator as any,
    },
    argTypes: {
        disabled: { control: 'boolean' },
        open: { control: 'boolean' },
        defaultOpen: { control: 'boolean' },
        onOpenChange: { action: 'onOpenChange' },
        value: { control: 'text' },
        defaultValue: { control: 'text' },
        onValueChange: { action: 'onValueChange' },
        name: { control: 'text' },
        required: { control: 'boolean' },
    },
};

export default meta;

type Story = StoryObj<typeof Select>;

const fruits = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'blueberry', label: 'Blueberry' },
    { value: 'grapes', label: 'Grapes' },
    { value: 'pineapple', label: 'Pineapple' },
];

const timezones = [
    {
        label: 'North America',
        options: [
            { value: 'est', label: 'Eastern Standard Time (EST)' },
            { value: 'cst', label: 'Central Standard Time (CST)' },
            { value: 'mst', label: 'Mountain Standard Time (MST)' },
            { value: 'pst', label: 'Pacific Standard Time (PST)' },
            { value: 'akst', label: 'Alaska Standard Time (AKST)' },
            { value: 'hst', label: 'Hawaii Standard Time (HST)' },
        ],
    },
    {
        label: 'Europe & Africa',
        options: [
            { value: 'gmt', label: 'Greenwich Mean Time (GMT)' },
            { value: 'cet', label: 'Central European Time (CET)' },
            { value: 'eet', label: 'Eastern European Time (EET)' },
            { value: 'wat', label: 'West Africa Time (WAT)' },
            { value: 'cat', label: 'Central Africa Time (CAT)' },
            { value: 'eat', label: 'East Africa Time (EAT)' },
        ],
    },
    {
        label: 'Asia',
        options: [
            { value: 'ist', label: 'India Standard Time (IST)' },
            { value: 'cst_asia', label: 'China Standard Time (CST)' },
            { value: 'jst', label: 'Japan Standard Time (JST)' },
            { value: 'kst', label: 'Korea Standard Time (KST)' },
        ],
    },
];

export const Default: Story = {
    render: args => (
        <Select {...args}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    {fruits.map(fruit => (
                        <SelectItem key={fruit.value} value={fruit.value}>
                            {fruit.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    ),
};

export const WithDefaultValue: Story = {
    render: args => (
        <Select {...args} defaultValue="banana">
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    {fruits.map(fruit => (
                        <SelectItem key={fruit.value} value={fruit.value}>
                            {fruit.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    ),
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
    render: args => (
        <Select {...args}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit (disabled)" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
            </SelectContent>
        </Select>
    ),
};

export const WithGroupsAndSeparator: Story = {
    render: args => (
        <Select {...args}>
            <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a timezone" />
            </SelectTrigger>
            <SelectContent>
                {timezones.map((group, groupIndex) => (
                    <React.Fragment key={group.label}>
                        <SelectGroup>
                            <SelectLabel>{group.label}</SelectLabel>
                            {group.options.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                        {groupIndex < timezones.length - 1 && <SelectSeparator />}
                    </React.Fragment>
                ))}
            </SelectContent>
        </Select>
    ),
};

export const ScrollableContent: Story = {
    render: args => (
        <Select {...args}>
            <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select an item from a long list" />
            </SelectTrigger>
            <SelectContent>
                {/* Simulating many items */}
                {Array.from({ length: 50 }, (_, i) => (
                    <SelectItem key={`item-${i}`} value={`item-${i}`}>
                        Item {i + 1}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    ),
};

export const InAFormContext: Story = {
    render: args => (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="framework-select">Favorite Framework</Label>
            <Select {...args}>
                <SelectTrigger id="framework-select" className="w-full">
                    <SelectValue placeholder="Choose a framework" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="nextjs">Next.js</SelectItem>
                    <SelectItem value="sveltekit">SvelteKit</SelectItem>
                    <SelectItem value="astro">Astro</SelectItem>
                    <SelectItem value="remix">Remix</SelectItem>
                    <SelectItem value="nuxtjs">Nuxt.js</SelectItem>
                </SelectContent>
            </Select>
            <p className="text-muted-foreground text-sm">Select your preferred web framework.</p>
        </div>
    ),
};

export const Controlled: Story = {
    render: function Render(args) {
        const [value, setValue] = React.useState('');
        return (
            <div className="flex flex-col items-center gap-4">
                <p className="text-sm">Selected: {value || 'None'}</p>
                <Select {...args} value={value} onValueChange={setValue}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a notification type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All New Messages</SelectItem>
                        <SelectItem value="mentions">Direct Mentions</SelectItem>
                        <SelectItem value="none">Nothing</SelectItem>
                    </SelectContent>
                </Select>
                <button onClick={() => setValue('mentions')} className="rounded border p-1 text-xs">
                    Set to Mentions
                </button>
            </div>
        );
    },
};
