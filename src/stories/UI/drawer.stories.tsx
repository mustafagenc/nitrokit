/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '../../components/ui/drawer';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Minus, Plus } from 'lucide-react';

const meta: Meta<typeof Drawer> = {
    title: 'UI/Drawer',
    component: Drawer,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    subcomponents: {
        DrawerTrigger: DrawerTrigger as any,
        DrawerContent: DrawerContent as any,
        DrawerHeader: DrawerHeader as any,
        DrawerTitle: DrawerTitle as any,
        DrawerDescription: DrawerDescription as any,
        DrawerFooter: DrawerFooter as any,
        DrawerClose: DrawerClose as any,
    },
    argTypes: {
        // Props for the Drawer root component itself
        open: { control: 'boolean', description: 'Controlled open state.' },
        defaultOpen: { control: 'boolean', description: 'Initial open state (uncontrolled).' },
        // onOpenChange: { action: 'onOpenChange' },
        // direction: { control: 'select', options: ['top', 'bottom', 'left', 'right'], description: 'Side of the screen the drawer will appear from.' },
        // modal: { control: 'boolean', description: 'Whether the drawer is modal or not.' },
        // dismissible: { control: 'boolean', description: 'Whether the drawer can be closed by clicking outside or pressing Escape.' },
    },
};

export default meta;

type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
    render: (args) => (
        <Drawer {...args}>
            <DrawerTrigger asChild>
                <Button variant="outline">Open Drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerDescription>This action cannot be undone.</DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                    <p>This is the main content of the drawer.</p>
                    <p>You can put any React components here.</p>
                </div>
                <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    ),
};

export const FromRight: Story = {
    // Assuming your Drawer component might take a 'direction' or 'side' prop
    // If not, this story might need adjustment based on your component's API
    // For now, let's assume it's controlled by a prop or a different component variant
    // If your Drawer is always bottom, this story might be redundant or named differently.
    render: (args) => (
        <Drawer {...args}>
            <DrawerTrigger asChild>
                <Button variant="outline">Open From Right</Button>
            </DrawerTrigger>
            <DrawerContent className="sm:max-w-md">
                {' '}
                {/* Example: Custom class for side drawers */}
                <DrawerHeader>
                    <DrawerTitle>Settings Panel</DrawerTitle>
                    <DrawerDescription>Configure your application settings.</DrawerDescription>
                </DrawerHeader>
                <div className="space-y-4 p-4">
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" defaultValue="@nitrokit" />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="contact@nitrokit.dev" />
                    </div>
                </div>
                <DrawerFooter>
                    <Button>Save Changes</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    ),
    args: {
        direction: 'right', // This is a hypothetical prop
    },
};

function Counter({ goal }: { goal: number }) {
    const [currentGoal, setCurrentGoal] = React.useState(goal);

    function onClick(adjustment: number) {
        setCurrentGoal(Math.max(20, Math.min(400, currentGoal + adjustment)));
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-2 p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="size-8 shrink-0 rounded-full"
                    onClick={() => onClick(-10)}
                    disabled={currentGoal <= 20}
                >
                    <Minus className="size-4" />
                    <span className="sr-only">Decrease</span>
                </Button>
                <div className="flex-1 text-center">
                    <div className="text-7xl font-bold tracking-tighter">{currentGoal}</div>
                    <div className="text-muted-foreground text-[0.70rem] uppercase">
                        Calories/day
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="size-8 shrink-0 rounded-full"
                    onClick={() => onClick(10)}
                    disabled={currentGoal >= 400}
                >
                    <Plus className="size-4" />
                    <span className="sr-only">Increase</span>
                </Button>
            </div>
        </div>
    );
}

export const WithComplexContent: Story = {
    render: (args) => (
        <Drawer {...args}>
            <DrawerTrigger asChild>
                <Button variant="outline">Set Daily Goal</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Set Your Daily Goal</DrawerTitle>
                    <DrawerDescription>
                        Adjust your daily calorie intake goal. This will help you track your
                        progress.
                    </DrawerDescription>
                </DrawerHeader>
                <Counter goal={150} />
                <DrawerFooter className="pt-2">
                    <Button>Set Goal</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    ),
};

export const Controlled: Story = {
    render: function Render(args) {
        const [isOpen, setIsOpen] = React.useState(false);
        return (
            <>
                <Button onClick={() => setIsOpen(true)}>Open Controlled Drawer</Button>
                <Drawer {...args} open={isOpen} onOpenChange={setIsOpen}>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Controlled Drawer</DrawerTitle>
                            <DrawerDescription>
                                This drawer&apos;s open state is managed by React state.
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4">
                            <p>
                                You can close this by clicking the button below or via external
                                controls.
                            </p>
                        </div>
                        <DrawerFooter>
                            <Button onClick={() => setIsOpen(false)}>Close Programmatically</Button>
                            <DrawerClose asChild>
                                <Button variant="outline">Close with Component</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </>
        );
    },
    args: {
        // open is controlled by the render function's useState
    },
};

export const NonModal: Story = {
    render: (args) => (
        <div className="bg-background h-[300px] w-full rounded-lg border p-4">
            <p className="mb-4">This is the background content. You can interact with it.</p>
            <Drawer {...args}>
                <DrawerTrigger asChild>
                    <Button variant="outline">Open Non-Modal Drawer</Button>
                </DrawerTrigger>
                <DrawerContent className="max-h-[80%]">
                    {' '}
                    {/* Example: Limit height */}
                    <DrawerHeader>
                        <DrawerTitle>Information Panel</DrawerTitle>
                        <DrawerDescription>
                            This drawer does not block interaction with the page.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4">
                        <p>You can click outside to close if dismissible is true (default).</p>
                        <p>Or use the close button.</p>
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    ),
    args: {
        modal: false, // Assuming 'modal' prop exists and defaults to true
    },
    parameters: {
        // layout: 'fullscreen', // May be better for non-modal to see interaction
    },
};
