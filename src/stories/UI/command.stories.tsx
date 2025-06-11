/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import {
    Command,
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
    CommandSeparator,
} from '../../components/ui/command';
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Users,
    File,
    Moon,
    Sun,
    Laptop,
    Palette,
} from 'lucide-react';
import { Button } from '../../components/ui/button';

const meta: Meta<typeof Command> = {
    title: 'UI/Command',
    component: Command,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    subcomponents: {
        CommandDialog: CommandDialog as React.ComponentType<any>,
        CommandInput: CommandInput as React.ComponentType<any>,
        CommandList: CommandList as React.ComponentType<any>,
        CommandEmpty: CommandEmpty as React.ComponentType<any>,
        CommandGroup: CommandGroup as React.ComponentType<any>,
        CommandItem: CommandItem as React.ComponentType<any>,
        CommandShortcut: CommandShortcut as React.ComponentType<any>,
        CommandSeparator: CommandSeparator as React.ComponentType<any>,
    },
};

export default meta;

type Story = StoryObj<typeof Command>;

export const Default: Story = {
    render: (args) => (
        <Command {...args} className="rounded-lg border shadow-md">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    <CommandItem>
                        <Calendar className="mr-2 size-4" />
                        <span>Calendar</span>
                    </CommandItem>
                    <CommandItem>
                        <Smile className="mr-2 size-4" />
                        <span>Search Emoji</span>
                    </CommandItem>
                    <CommandItem>
                        <Calculator className="mr-2 size-4" />
                        <span>Calculator</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                    <CommandItem>
                        <User className="mr-2 size-4" />
                        <span>Profile</span>
                        <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                        <CreditCard className="mr-2 size-4" />
                        <span>Billing</span>
                        <CommandShortcut>⌘B</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                        <Settings className="mr-2 size-4" />
                        <span>Settings</span>
                        <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </Command>
    ),
    args: {
        // Default args for Command if any
    },
};

export const InDialog: Story = {
    render: function Render() {
        const [open, setOpen] = React.useState(false);

        React.useEffect(() => {
            const down = (e: KeyboardEvent) => {
                if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    setOpen((prevOpen) => !prevOpen);
                }
            };
            document.addEventListener('keydown', down);
            return () => document.removeEventListener('keydown', down);
        }, []);

        return (
            <>
                <p className="text-muted-foreground text-sm">
                    Press{' '}
                    <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                        <span className="text-xs">⌘</span>K
                    </kbd>{' '}
                    or{' '}
                    <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                        <span className="text-xs">CTRL</span>K
                    </kbd>
                </p>
                <Button onClick={() => setOpen(true)}>Open Command</Button>
                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                            <CommandItem
                                onSelect={() => {
                                    console.log('Calendar selected');
                                    setOpen(false);
                                }}
                            >
                                <Calendar className="mr-2 size-4" />
                                <span>Calendar</span>
                            </CommandItem>
                            <CommandItem
                                onSelect={() => {
                                    console.log('Search Emoji selected');
                                    setOpen(false);
                                }}
                            >
                                <Smile className="mr-2 size-4" />
                                <span>Search Emoji</span>
                            </CommandItem>
                            <CommandItem
                                onSelect={() => {
                                    console.log('Calculator selected');
                                    setOpen(false);
                                }}
                            >
                                <Calculator className="mr-2 size-4" />
                                <span>Calculator</span>
                            </CommandItem>
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading="Profile">
                            <CommandItem
                                onSelect={() => {
                                    console.log('Profile selected');
                                    setOpen(false);
                                }}
                            >
                                <User className="mr-2 size-4" />
                                <span>Profile</span>
                                <CommandShortcut>⌘P</CommandShortcut>
                            </CommandItem>
                            <CommandItem
                                onSelect={() => {
                                    console.log('Billing selected');
                                    setOpen(false);
                                }}
                            >
                                <CreditCard className="mr-2 size-4" />
                                <span>Billing</span>
                                <CommandShortcut>⌘B</CommandShortcut>
                            </CommandItem>
                            <CommandItem
                                onSelect={() => {
                                    console.log('Settings selected');
                                    setOpen(false);
                                }}
                            >
                                <Settings className="mr-2 size-4" />
                                <span>Settings</span>
                                <CommandShortcut>⌘S</CommandShortcut>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>
            </>
        );
    },
};

export const WithNestedItems: Story = {
    render: function WithNestedItemsRender(args) {
        const [page, setPage] = React.useState<'root' | 'theme'>('root');
        const inputRef = React.useRef<HTMLInputElement>(null);

        return (
            <Command {...args} className="rounded-lg border shadow-md">
                <CommandInput
                    ref={inputRef}
                    placeholder={page === 'root' ? 'Type a command...' : 'Select theme...'}
                />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {page === 'root' ? (
                        <>
                            <CommandGroup heading="General">
                                <CommandItem onSelect={() => console.log('View Profile')}>
                                    <User className="mr-2 size-4" />
                                    <span>View Profile</span>
                                </CommandItem>
                                <CommandItem onSelect={() => setPage('theme')}>
                                    <Palette className="mr-2 size-4" />
                                    <span>Change Theme</span>
                                </CommandItem>
                            </CommandGroup>
                            <CommandGroup heading="Actions">
                                <CommandItem onSelect={() => console.log('New File')}>
                                    <File className="mr-2 size-4" />
                                    <span>New File</span>
                                    <CommandShortcut>⌘N</CommandShortcut>
                                </CommandItem>
                                <CommandItem onSelect={() => console.log('New Team')}>
                                    <Users className="mr-2 size-4" />
                                    <span>New Team</span>
                                </CommandItem>
                            </CommandGroup>
                        </>
                    ) : (
                        <CommandGroup heading="Themes">
                            <CommandItem
                                onSelect={() => {
                                    console.log('Light Theme');
                                    setPage('root');
                                }}
                            >
                                <Sun className="mr-2 size-4" />
                                <span>Light</span>
                            </CommandItem>
                            <CommandItem
                                onSelect={() => {
                                    console.log('Dark Theme');
                                    setPage('root');
                                }}
                            >
                                <Moon className="mr-2 size-4" />
                                <span>Dark</span>
                            </CommandItem>
                            <CommandItem
                                onSelect={() => {
                                    console.log('System Theme');
                                    setPage('root');
                                }}
                            >
                                <Laptop className="mr-2 size-4" />
                                <span>System</span>
                            </CommandItem>
                        </CommandGroup>
                    )}
                </CommandList>
                {page !== 'root' && (
                    <div className="p-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                                setPage('root');
                                inputRef.current?.focus();
                            }}
                        >
                            Back
                        </Button>
                    </div>
                )}
            </Command>
        );
    },
};
