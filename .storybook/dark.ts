import { create } from '@storybook/theming/create';

export default create({
    base: 'dark',

    // Brand
    brandTitle: 'Nitrokit Design System',
    brandUrl: 'https://github.com/mustafagenc/nitrokit',
    brandImage:
        'https://raw.githubusercontent.com/mustafagenc/nitrokit/refs/heads/main/public/logo/nitrokit-dark.svg',
    brandTarget: '_self',

    // Colors
    colorPrimary: '#60a5fa', // Blue-400
    colorSecondary: '#818cf8', // Indigo-400

    // UI
    appBg: '#0f172a',
    appContentBg: '#1e293b',
    appBorderColor: '#334155',
    appBorderRadius: 8,

    // Text colors
    textColor: '#f1f5f9',
    textInverseColor: '#0f172a',

    // Toolbar default and active colors
    barTextColor: '#94a3b8',
    barSelectedColor: '#60a5fa',
    barBg: '#1e293b',

    // Form colors
    inputBg: '#334155',
    inputBorder: '#475569',
    inputTextColor: '#f1f5f9',
    inputBorderRadius: 6,
});
