import type { Meta, StoryObj } from '@storybook/react';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
    MenubarCheckboxItem,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarLabel,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
} from '@/components/ui/menubar';
import {
    FileText,
    Settings,
    User,
    Mail,
    MessageSquare,
    Plus,
    Heart,
    Trash2,
    Download,
    Share2,
    Edit,
    Copy,
    Search,
    Filter,
    SortAsc,
    SortDesc,
} from 'lucide-react';

const meta: Meta<typeof Menubar> = {
    title: 'UI/Menubar',
    component: Menubar,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'A menubar component that provides a horizontal menu bar with dropdown menus, checkboxes, radio buttons, and sub-menus.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        className: {
            control: 'text',
            description: 'Additional CSS classes',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic menubar with simple menu items
export const Basic: Story = {
    render: () => (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        <FileText className="mr-2 h-4 w-4" />
                        New File
                        <MenubarShortcut>⌘N</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                        <Download className="mr-2 h-4 w-4" />
                        Open
                        <MenubarShortcut>⌘O</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                        <MenubarShortcut>⌘C</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Paste
                        <MenubarShortcut>⌘V</MenubarShortcut>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                        <MenubarShortcut>⌘F</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    ),
};

// Menubar with checkboxes
export const WithCheckboxes: Story = {
    render: () => (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>Options</MenubarTrigger>
                <MenubarContent>
                    <MenubarCheckboxItem checked>
                        <Heart className="mr-2 h-4 w-4" />
                        Show Favorites
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Auto Save
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem checked>
                        <User className="mr-2 h-4 w-4" />
                        Show Profile
                    </MenubarCheckboxItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    ),
};

// Menubar with radio buttons
export const WithRadioButtons: Story = {
    render: () => (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>Sort</MenubarTrigger>
                <MenubarContent>
                    <MenubarRadioGroup value="name">
                        <MenubarRadioItem value="name">
                            <SortAsc className="mr-2 h-4 w-4" />
                            Sort by Name
                        </MenubarRadioItem>
                        <MenubarRadioItem value="date">
                            <SortDesc className="mr-2 h-4 w-4" />
                            Sort by Date
                        </MenubarRadioItem>
                        <MenubarRadioItem value="size">
                            <FileText className="mr-2 h-4 w-4" />
                            Sort by Size
                        </MenubarRadioItem>
                    </MenubarRadioGroup>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    ),
};

// Menubar with sub-menus
export const WithSubMenus: Story = {
    render: () => (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        <Plus className="mr-2 h-4 w-4" />
                        New
                    </MenubarItem>
                    <MenubarSub>
                        <MenubarSubTrigger>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                        </MenubarSubTrigger>
                        <MenubarSubContent>
                            <MenubarItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Email
                            </MenubarItem>
                            <MenubarItem>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Message
                            </MenubarItem>
                        </MenubarSubContent>
                    </MenubarSub>
                    <MenubarSeparator />
                    <MenubarItem>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    ),
};

// Complex menubar with all features
export const Complex: Story = {
    render: () => (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        <Plus className="mr-2 h-4 w-4" />
                        New File
                        <MenubarShortcut>⌘N</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                        <Download className="mr-2 h-4 w-4" />
                        Open
                        <MenubarShortcut>⌘O</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarSub>
                        <MenubarSubTrigger>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                        </MenubarSubTrigger>
                        <MenubarSubContent>
                            <MenubarItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Email
                            </MenubarItem>
                            <MenubarItem>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Message
                            </MenubarItem>
                        </MenubarSubContent>
                    </MenubarSub>
                </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                        <MenubarShortcut>⌘C</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Paste
                        <MenubarShortcut>⌘V</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                        <MenubarShortcut>⌫</MenubarShortcut>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent>
                    <MenubarCheckboxItem checked>
                        <Heart className="mr-2 h-4 w-4" />
                        Show Favorites
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Auto Save
                    </MenubarCheckboxItem>
                    <MenubarSeparator />
                    <MenubarRadioGroup value="name">
                        <MenubarLabel inset>Sort by</MenubarLabel>
                        <MenubarRadioItem value="name">
                            <SortAsc className="mr-2 h-4 w-4" />
                            Name
                        </MenubarRadioItem>
                        <MenubarRadioItem value="date">
                            <SortDesc className="mr-2 h-4 w-4" />
                            Date
                        </MenubarRadioItem>
                    </MenubarRadioGroup>
                </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger>Help</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        <User className="mr-2 h-4 w-4" />
                        About
                    </MenubarItem>
                    <MenubarItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    ),
};

// Disabled menubar items
export const WithDisabledItems: Story = {
    render: () => (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>Actions</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        <Plus className="mr-2 h-4 w-4" />
                        Create
                    </MenubarItem>
                    <MenubarItem disabled>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit (Disabled)
                    </MenubarItem>
                    <MenubarItem>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    ),
};

// Custom styled menubar
export const CustomStyled: Story = {
    render: () => (
        <Menubar className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
            <MenubarMenu>
                <MenubarTrigger className="text-blue-700 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-900">
                    Custom
                </MenubarTrigger>
                <MenubarContent className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                    <MenubarItem className="text-blue-700 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-900">
                        <FileText className="mr-2 h-4 w-4" />
                        Custom Item
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    ),
};

// Compact menubar
export const Compact: Story = {
    render: () => (
        <Menubar className="h-8">
            <MenubarMenu>
                <MenubarTrigger className="px-2 py-1 text-xs">F</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem className="text-xs">
                        <FileText className="mr-2 h-3 w-3" />
                        New
                    </MenubarItem>
                    <MenubarItem className="text-xs">
                        <Download className="mr-2 h-3 w-3" />
                        Open
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger className="px-2 py-1 text-xs">E</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem className="text-xs">
                        <Copy className="mr-2 h-3 w-3" />
                        Copy
                    </MenubarItem>
                    <MenubarItem className="text-xs">
                        <Edit className="mr-2 h-3 w-3" />
                        Paste
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    ),
};

// All variants comparison
export const AllVariants: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="mb-4 text-lg font-semibold">Basic Menubar</h3>
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger>File</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>
                                <FileText className="mr-2 h-4 w-4" />
                                New File
                                <MenubarShortcut>⌘N</MenubarShortcut>
                            </MenubarItem>
                            <MenubarItem>
                                <Download className="mr-2 h-4 w-4" />
                                Open
                                <MenubarShortcut>⌘O</MenubarShortcut>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-semibold">With Checkboxes</h3>
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger>Options</MenubarTrigger>
                        <MenubarContent>
                            <MenubarCheckboxItem checked>
                                <Heart className="mr-2 h-4 w-4" />
                                Show Favorites
                            </MenubarCheckboxItem>
                            <MenubarCheckboxItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Auto Save
                            </MenubarCheckboxItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-semibold">With Radio Buttons</h3>
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger>Sort</MenubarTrigger>
                        <MenubarContent>
                            <MenubarRadioGroup value="name">
                                <MenubarRadioItem value="name">
                                    <SortAsc className="mr-2 h-4 w-4" />
                                    Sort by Name
                                </MenubarRadioItem>
                                <MenubarRadioItem value="date">
                                    <SortDesc className="mr-2 h-4 w-4" />
                                    Sort by Date
                                </MenubarRadioItem>
                            </MenubarRadioGroup>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-semibold">With Sub-menus</h3>
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger>File</MenubarTrigger>
                        <MenubarContent>
                            <MenubarSub>
                                <MenubarSubTrigger>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share
                                </MenubarSubTrigger>
                                <MenubarSubContent>
                                    <MenubarItem>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Email
                                    </MenubarItem>
                                    <MenubarItem>
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Message
                                    </MenubarItem>
                                </MenubarSubContent>
                            </MenubarSub>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-semibold">Complex Example</h3>
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger>File</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>
                                <Plus className="mr-2 h-4 w-4" />
                                New File
                                <MenubarShortcut>⌘N</MenubarShortcut>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarSub>
                                <MenubarSubTrigger>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share
                                </MenubarSubTrigger>
                                <MenubarSubContent>
                                    <MenubarItem>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Email
                                    </MenubarItem>
                                </MenubarSubContent>
                            </MenubarSub>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger>Edit</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy
                                <MenubarShortcut>⌘C</MenubarShortcut>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-semibold">Custom Styled</h3>
                <Menubar className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                    <MenubarMenu>
                        <MenubarTrigger className="text-blue-700 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-900">
                            Custom
                        </MenubarTrigger>
                        <MenubarContent className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                            <MenubarItem className="text-blue-700 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-900">
                                <FileText className="mr-2 h-4 w-4" />
                                Custom Item
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-semibold">Compact</h3>
                <Menubar className="h-8">
                    <MenubarMenu>
                        <MenubarTrigger className="px-2 py-1 text-xs">F</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem className="text-xs">
                                <FileText className="mr-2 h-3 w-3" />
                                New
                            </MenubarItem>
                            <MenubarItem className="text-xs">
                                <Download className="mr-2 h-3 w-3" />
                                Open
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger className="px-2 py-1 text-xs">E</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem className="text-xs">
                                <Copy className="mr-2 h-3 w-3" />
                                Copy
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'This story shows all different variants of the Menubar component for easy comparison.',
            },
        },
    },
};
