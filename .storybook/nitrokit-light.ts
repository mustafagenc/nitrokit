import { create } from '@storybook/theming';

export default create({
    base: 'light',
    brandTitle: 'Nitrokit Storybook',
    brandUrl: 'https://github.com/mustafagenc/nitrokit',
    brandImage:
        'https://raw.githubusercontent.com/mustafagenc/nitrokit/refs/heads/main/public/logo/ekipisi-dark.svg',
    brandTarget: '_blank',

    // UI Colors
    colorPrimary: '#2248E6',
    colorSecondary: '#273142',

    // Typography
    fontBase: '"Inter", "Segoe UI", Roboto, sans-serif',
    fontCode: '"Fira Code", "SF Mono", Consolas, monospace',

    // Text colors
    textColor: '#273142',
    textInverseColor: '#FFFFFF',

    // Toolbar default and active colors
    barTextColor: '#273142',
    barSelectedColor: '#2248E6',
    barBg: '#FFFFFF',

    // Form colors
    inputBg: '#FFFFFF',
    inputBorder: '#E2E8F0',
    inputTextColor: '#273142',
    inputBorderRadius: 6,

    // Brand colors
    appBg: '#FFFFFF',
    appContentBg: '#FFFFFF',
    appBorderColor: '#E2E8F0',
    appBorderRadius: 8,
});
