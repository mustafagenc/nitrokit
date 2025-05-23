/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuRadioGroup,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
    ChevronDown,
    User,
    CreditCard,
    Settings,
    Keyboard,
    Users,
    UserPlus,
    MessageSquare,
    PlusCircle,
    Github,
    LifeBuoy,
    Cloud,
    LogOut,
    Mail,
    Plus,
    ChevronsUpDown,
} from 'lucide-react';

const meta: Meta<typeof DropdownMenu> = {
    title: 'UI/DropdownMenu',
    component: DropdownMenu,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    subcomponents: {
        DropdownMenuTrigger: DropdownMenuTrigger as any,
        DropdownMenuContent: DropdownMenuContent as any,
        DropdownMenuItem: DropdownMenuItem as any,
        DropdownMenuCheckboxItem: DropdownMenuCheckboxItem as any,
        DropdownMenuRadioItem: DropdownMenuRadioItem as any,
        DropdownMenuLabel: DropdownMenuLabel as any,
        DropdownMenuSeparator: DropdownMenuSeparator as any,
        DropdownMenuShortcut: DropdownMenuShortcut as any,
        DropdownMenuGroup: DropdownMenuGroup as any,
        DropdownMenuRadioGroup: DropdownMenuRadioGroup as any,
        DropdownMenuSub: DropdownMenuSub as any,
        DropdownMenuSubContent: DropdownMenuSubContent as any,
        DropdownMenuSubTrigger: DropdownMenuSubTrigger as any,
        DropdownMenuPortal: DropdownMenuPortal as any,
    },
    argTypes: {
        open: { control: 'boolean' },
        defaultOpen: { control: 'boolean' },
        // onOpenChange: { action: 'onOpenChange' },
        // modal: { control: 'boolean' }, // Usually true by default
        // dir: { control: 'radio', options: ['ltr', 'rtl'] },
    },
};

export default meta;

type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
    render: args => (
        <DropdownMenu {...args}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    Open Menu <ChevronDown className="ml-2 size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User className="mr-2 size-4" />
                        <span>Profile</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreditCard className="mr-2 size-4" />
                        <span>Billing</span>
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 size-4" />
                        <span>Settings</span>
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Keyboard className="mr-2 size-4" />
                        <span>Keyboard shortcuts</span>
                        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Users className="mr-2 size-4" />
                        <span>Team</span>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <UserPlus className="mr-2 size-4" />
                            <span>Invite users</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                    <Mail className="mr-2 size-4" />
                                    <span>Email</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <MessageSquare className="mr-2 size-4" />
                                    <span>Message</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <PlusCircle className="mr-2 size-4" />
                                    <span>More...</span>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem>
                        <Plus className="mr-2 size-4" />
                        <span>New Team</span>
                        <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Github className="mr-2 size-4" />
                    <span>GitHub</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <LifeBuoy className="mr-2 size-4" />
                    <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                    <Cloud className="mr-2 size-4" />
                    <span>API (Disabled)</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOut className="mr-2 size-4" />
                    <span>Log out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};

export const WithCheckboxes: Story = {
    render: function Render(args) {
        const [showStatusBar, setShowStatusBar] = React.useState(true);
        const [showActivityBar, setShowActivityBar] = React.useState(false);
        const [showPanel, setShowPanel] = React.useState(false);

        return (
            <DropdownMenu {...args}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">View Options</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                        checked={showStatusBar}
                        onCheckedChange={setShowStatusBar}>
                        Status Bar
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={showActivityBar}
                        onCheckedChange={setShowActivityBar}
                        disabled>
                        Activity Bar (Disabled)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
                        Panel
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    },
};

export const WithRadioGroup: Story = {
    render: function Render(args) {
        const [position, setPosition] = React.useState('bottom');

        return (
            <DropdownMenu {...args}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Panel Position</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                        <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    },
};

export const LongContentScrollable: Story = {
    render: args => (
        <DropdownMenu {...args}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    Many Items <ChevronsUpDown className="ml-2 size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[200px] w-48 overflow-y-auto">
                {' '}
                {/* Added max-h and overflow */}
                {Array.from({ length: 20 }, (_, i) => (
                    <DropdownMenuItem key={i}>Item {i + 1}</DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};

export const Controlled: Story = {
    render: function Render(args) {
        const [isOpen, setIsOpen] = React.useState(false);
        return (
            <div className="flex flex-col items-center gap-4">
                <p>Current state: {isOpen ? 'Open' : 'Closed'}</p>
                <div className="flex gap-2">
                    <Button onClick={() => setIsOpen(true)}>Open Programmatically</Button>
                    <Button variant="secondary" onClick={() => setIsOpen(false)}>
                        Close Programmatically
                    </Button>
                </div>
                <DropdownMenu {...args} open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Toggle Menu <ChevronDown className="ml-2 size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuItem onSelect={() => console.log('Action 1 selected')}>
                            Action 1
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => console.log('Action 2 selected')}>
                            Action 2
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setIsOpen(false)}>
                            Close from Item
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    },
    args: {
        // open is controlled by the render function's useState
    },
};
