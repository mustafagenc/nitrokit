import '../src/styles/globals.css';

import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';

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
                    'Getting Started',
                    'Components',
                    'UI',
                    '*',
                ],
                locales: 'en-US',
            },
        },

        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: 'todo',
        },
    },
    decorators: [
        withThemeByClassName({
            themes: {
                light: 'light',
                dark: 'dark',
            },
            defaultTheme: 'light',
            parentSelector: 'html',
        }),
    ],
};

export default preview;
