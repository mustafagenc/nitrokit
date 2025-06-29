import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MDXEditorComponent } from '@/components/ui/mdx-editor';

const meta: Meta<typeof MDXEditorComponent> = {
    title: 'UI/MDXEditor',
    component: MDXEditorComponent,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'A Markdown editor component with live preview, supporting dark/light theme and controlled value.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'text',
            description: 'Markdown value',
        },
        onChange: { action: 'changed', description: 'onChange callback' },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    render: (args) => {
        const [value, setValue] = useState<string>(
            args.value ||
                '# Hello, MDX!\n\nThis is a **Markdown** editor.\n\n- Supports dark/light mode\n- Live preview\n- Controlled value\n'
        );
        return (
            <div className="mx-auto max-w-2xl">
                <MDXEditorComponent value={value} onChange={setValue} />
            </div>
        );
    },
    args: {
        value: '# Hello, MDX!\n\nThis is a **Markdown** editor.\n',
    },
};

export const WithInitialContent: Story = {
    render: (args) => {
        const [value, setValue] = useState<string>(
            args.value ||
                '## Başlangıç İçeriği\n\n- Türkçe destekli\n- Kod blokları\n\n```js\nconsole.log("Merhaba dünya!");\n```'
        );
        return (
            <div className="mx-auto max-w-2xl">
                <MDXEditorComponent value={value} onChange={setValue} />
            </div>
        );
    },
    args: {
        value: '## Başlangıç İçeriği\n\n- Türkçe destekli\n- Kod blokları\n\n```js\nconsole.log("Merhaba dünya!");\n```',
    },
};

export const DarkTheme: Story = {
    render: (args) => {
        const [value, setValue] = useState<string>(
            args.value || '# Dark Mode\n\nTry switching your Storybook to dark mode!'
        );
        return (
            <div className="mx-auto max-w-2xl">
                <MDXEditorComponent value={value} onChange={setValue} />
            </div>
        );
    },
    args: {
        value: '# Dark Mode\n\nTry switching your Storybook to dark mode!',
    },
    parameters: {
        backgrounds: { default: 'dark' },
    },
};

export const Controlled: Story = {
    render: (args) => {
        const [value, setValue] = useState<string>('');
        return (
            <div className="mx-auto max-w-2xl">
                <button
                    className="mb-2 rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                    onClick={() => setValue('# Başlık\n\nYeni içerik!')}
                >
                    İçeriği Değiştir
                </button>
                <MDXEditorComponent value={value} onChange={setValue} />
            </div>
        );
    },
};
