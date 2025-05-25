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
    },
};

export default preview;
