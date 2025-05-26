import type { Meta, StoryObj } from '@storybook/react';

const Welcome = () => {
    return (
        <div className="mx-auto max-w-4xl p-8">
            <div className="mb-8 text-center">
                <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent">
                    Welcome to Nitrokit Storybook! 🚀
                </h1>
                <p className="text-xl text-gray-600">
                    Your component library documentation and development environment
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
                    <h3 className="mb-3 font-semibold text-blue-800">🎯 Getting Started</h3>
                    <ul className="list-inside list-disc space-y-2 text-blue-700">
                        <li>
                            Create component stories in{' '}
                            <code className="rounded bg-blue-100 px-2 py-1">src/stories/</code>
                        </li>
                        <li>Document components with interactive examples</li>
                        <li>Test component states and interactions</li>
                        <li>Generate automatic documentation</li>
                    </ul>
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50 p-6">
                    <h3 className="mb-3 font-semibold text-green-800">✨ Features Available</h3>
                    <ul className="list-inside list-disc space-y-2 text-green-700">
                        <li>🎨 TailwindCSS styling</li>
                        <li>🔧 Interactive controls</li>
                        <li>📖 Auto-generated docs</li>
                        <li>♿ Accessibility testing</li>
                        <li>🎭 Component interactions</li>
                    </ul>
                </div>
            </div>

            <div className="mt-8 rounded-lg border bg-gray-50 p-6">
                <h3 className="mb-3 font-semibold text-gray-800">🛠️ Development Tools</h3>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                    <div>
                        <strong>Controls:</strong> Interact with component props in real-time
                    </div>
                    <div>
                        <strong>Actions:</strong> See component events in the Actions panel
                    </div>
                    <div>
                        <strong>Docs:</strong> Auto-generated documentation from your code
                    </div>
                </div>
            </div>
        </div>
    );
};

const meta: Meta<typeof Welcome> = {
    title: 'Documentation',
    component: Welcome,
    parameters: {
        layout: 'fullscreen',
        controls: { disable: true },
        actions: { disable: true },
        docs: {
            page: () => <Welcome />,
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    name: 'Welcome to Nitrokit Storybook',
};
