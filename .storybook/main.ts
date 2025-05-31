import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
    stories: [
        '../src/components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
        '../src/stories/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    ],
    addons: [
        '@storybook/addon-onboarding',
        '@storybook/addon-docs',
        '@storybook/addon-a11y',
        '@storybook/addon-themes',
        '@storybook/addon-vitest',
    ],
    framework: {
        name: '@storybook/nextjs',
        options: {},
    },
    docs: {},
    staticDirs: ['./assets'],
    typescript: {
        reactDocgen: 'react-docgen-typescript',
        reactDocgenTypescriptOptions: {
            shouldExtractLiteralValuesFromEnum: true,
            propFilter: prop => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
        },
    },
};

export default config;
