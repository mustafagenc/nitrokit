import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Textarea> = {
    title: 'UI/Textarea',
    component: Textarea,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        placeholder: {
            control: 'text',
            description: 'Placeholder text for the textarea.',
        },
        disabled: {
            control: 'boolean',
            description: 'Prevents user interaction with the textarea.',
        },
        value: {
            control: 'text',
            description: 'Controlled value of the textarea.',
        },
        defaultValue: {
            control: 'text',
            description: 'Default value for uncontrolled textarea.',
        },
        rows: {
            control: 'number',
            description: 'Specifies the visible number of lines in a text area.',
        },
        // onChange: { action: 'changed' },
        // className: { control: 'text' },
    },
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
    render: args => <Textarea {...args} className="w-80" />, // Added width for better visibility
    args: {
        placeholder: 'Type your message here.',
    },
};

export const WithDefaultValue: Story = {
    render: args => <Textarea {...args} className="w-80" />,
    args: {
        defaultValue: 'This is some default text that appears in the textarea.',
        placeholder: 'Type your message here.',
    },
};

export const Disabled: Story = {
    render: args => <Textarea {...args} className="w-80" />,
    args: {
        placeholder: 'This textarea is disabled.',
        defaultValue: "You can't edit this.",
        disabled: true,
    },
};

export const WithLabel: Story = {
    render: args => (
        <div className="grid w-full max-w-sm gap-1.5">
            <Label htmlFor="message">Your Message</Label>
            <Textarea {...args} id="message" />
        </div>
    ),
    args: {
        placeholder: 'Enter your detailed message...',
        rows: 4,
    },
};

export const CharacterLimit: Story = {
    render: function Render(args) {
        const [value, setValue] = React.useState(String(args.defaultValue ?? ''));
        const maxLength = 200;

        const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newValue = event.target.value;
            if (newValue.length <= maxLength) {
                setValue(newValue);
            }
        };

        return (
            <div className="grid w-full max-w-md gap-1.5">
                <Label htmlFor="bio">Biography (Max {maxLength} characters)</Label>
                <Textarea
                    {...args}
                    id="bio"
                    value={value}
                    onChange={handleChange}
                    maxLength={maxLength} // HTML5 maxLength for basic enforcement
                />
                <p
                    className={`text-sm ${value.length > maxLength - 20 ? (value.length === maxLength ? 'text-destructive' : 'text-orange-500') : 'text-muted-foreground'}`}>
                    {value.length}/{maxLength}
                </p>
            </div>
        );
    },
    args: {
        placeholder: 'Tell us about yourself...',
        rows: 5,
        defaultValue:
            'I am a software developer passionate about creating intuitive user experiences.',
    },
};

export const NonResizable: Story = {
    render: args => <Textarea {...args} className="w-80 resize-none" />,
    args: {
        placeholder: 'This textarea cannot be resized.',
        rows: 3,
    },
};

export const InAForm: Story = {
    render: args => {
        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const feedback = formData.get('feedback');
            alert(`Feedback submitted: ${feedback}`);
            console.log('Feedback:', feedback);
        };

        return (
            <form onSubmit={handleSubmit} className="grid w-full max-w-lg gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="feedback-form">Leave your feedback</Label>
                    <Textarea {...args} id="feedback-form" name="feedback" />
                </div>
                <Button type="submit">Submit Feedback</Button>
            </form>
        );
    },
    args: {
        placeholder: 'What are your thoughts?',
        rows: 6,
        defaultValue: '',
    },
};
