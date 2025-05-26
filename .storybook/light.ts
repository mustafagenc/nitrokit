import { create } from '@storybook/theming/create';

export default create({
    base: 'light',

    // Brand
    brandTitle: 'Nitrokit Design System',
    brandUrl: 'https://github.com/mustafagenc/nitrokit',
    brandImage:
        'https://raw.githubusercontent.com/mustafagenc/nitrokit/refs/heads/main/public/logo/nitrokit-light.svg',
    brandTarget: '_self',

    // Colors
    colorPrimary: '##60A5FA', // Blue-500
    colorSecondary: '#6366f1', // Indigo-500

    // UI
    appBg: '#ffffff',
    appContentBg: '#ffffff',
    appBorderColor: '#e5e7eb',
    appBorderRadius: 8,

    // Text colors
    textColor: '#111827',
    textInverseColor: '#ffffff',

    // Toolbar default and active colors
    barTextColor: '#6b7280',
    barSelectedColor: '#3b82f6',
    barBg: '#f9fafb',

    // Form colors
    inputBg: '#ffffff',
    inputBorder: '#d1d5db',
    inputTextColor: '#111827',
    inputBorderRadius: 6,
});
