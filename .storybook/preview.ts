import type { Preview } from '@storybook/react';

// CSS dosyasını import et (varsa)
try {
    require('../src/styles/globals.css');
} catch (e) {
    // CSS dosyası yoksa hata verme
    console.warn('globals.css not found, using default styles');
}

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
                    value: '#333333',
                },
            ],
        },
    },
};

export default preview;
