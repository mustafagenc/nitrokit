import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../../components/ui/accordion';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Accordion> = {
    title: 'UI/Accordion',
    component: Accordion,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        type: {
            control: { type: 'radio' },
            options: ['single', 'multiple'],
        },
        collapsible: {
            control: { type: 'boolean' },
        },
        defaultValue: {
            control: { type: 'text' },
        },
    },
};

export default meta;

type Story = StoryObj<typeof Accordion>;

const defaultItems = [
    {
        value: 'item-1',
        trigger: 'Is it accessible?',
        content: 'Yes. It adheres to the WAI-ARIA design pattern.',
    },
    {
        value: 'item-2',
        trigger: 'Is it styled?',
        content: "Yes. It comes with default styles that matches the other components' aesthetic.",
    },
    {
        value: 'item-3',
        trigger: 'Is it animated?',
        content: "Yes. It's animated by default, but you can disable it if you prefer.",
    },
];

export const Default: Story = {
    args: {
        type: 'single',
        collapsible: true,
        className: 'w-[300px]',
    },
    render: args => (
        <Accordion {...args}>
            {defaultItems.map(item => (
                <AccordionItem key={item.value} value={item.value}>
                    <AccordionTrigger>{item.trigger}</AccordionTrigger>
                    <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    ),
};

export const Multiple: Story = {
    args: {
        type: 'multiple',
        className: 'w-[300px]',
    },
    render: args => (
        <Accordion {...args}>
            {defaultItems.map(item => (
                <AccordionItem key={item.value} value={item.value}>
                    <AccordionTrigger>{item.trigger}</AccordionTrigger>
                    <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    ),
};

export const DefaultValueSingle: Story = {
    args: {
        type: 'single',
        collapsible: true,
        defaultValue: 'item-2',
        className: 'w-[300px]',
    },
    render: args => (
        <Accordion {...args}>
            {defaultItems.map(item => (
                <AccordionItem key={item.value} value={item.value}>
                    <AccordionTrigger>{item.trigger}</AccordionTrigger>
                    <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    ),
};

export const DefaultValueMultiple: Story = {
    args: {
        type: 'multiple',
        defaultValue: ['item-1', 'item-3'],
        className: 'w-[300px]',
    },
    render: args => (
        <Accordion {...args}>
            {defaultItems.map(item => (
                <AccordionItem key={item.value} value={item.value}>
                    <AccordionTrigger>{item.trigger}</AccordionTrigger>
                    <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    ),
};
