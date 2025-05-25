import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        docs: {
            toc: true,
        },
        backgrounds: {
            default: 'light',
            values: [
                {
                    name: 'light',
                    value: '#ffffff',
                },
                {
                    name: 'dark',
                    value: '#0f172a',
                },
            ],
        },
        options: {
            storySort: {
                method: 'alphabetical',
                order: [
                    'Documentation',
                    ['Welcome', '*'],
                    'Frameworks',
                    'Components',
                    'Design System',
                ],
                locales: 'en-US',
            },
        },
    },
};

export default preview;
