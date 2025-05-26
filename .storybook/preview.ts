import '../src/styles/globals.css';

import type { Preview } from '@storybook/react';
import nitrokitLight from './light';
import nitrokitDark from './dark';

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
            theme: nitrokitLight,
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
                    'Getting Started',
                    'Components',
                    'UI',
                    '*',
                ],
                locales: 'en-US',
            },
        },
        darkMode: {
            dark: nitrokitDark,
            light: nitrokitLight,
            stylePreview: true,
        },
    },
    // globalTypes: {
    //     theme: {
    //         description: 'Global theme for components',
    //         defaultValue: 'dark',
    //         toolbar: {
    //             title: 'Theme',
    //             icon: 'paintbrush',
    //             items: [
    //                 { value: 'light', title: 'Light', left: '☀️' },
    //                 { value: 'dark', title: 'Dark', left: '🌙' },
    //             ],
    //             dynamicTitle: true,
    //         },
    //     },
    // },
};

export default preview;
