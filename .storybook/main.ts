import type { StorybookConfig } from '@storybook/nextjs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
    stories: [
        '../src/stories/**/*.stories.@(js|jsx|ts|tsx|mdx)',
        '../src/components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    ],
    addons: [
        '@storybook/addon-onboarding',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-a11y',
        '@chromatic-com/storybook',
    ],
    framework: {
        name: '@storybook/nextjs',
        options: {},
    },
    staticDirs: ['../public'],
    webpackFinal: async config => {
        // TypeScript path mapping
        if (config.resolve) {
            config.resolve.alias = {
                ...config.resolve.alias,
                '@': join(__dirname, '../'),
            };
        }
        return config;
    },
    typescript: {
        check: false,
        reactDocgen: 'react-docgen-typescript',
    },
};

export default config;
