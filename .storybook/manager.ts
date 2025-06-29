import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

addons.setConfig({
    theme: create({
        base: 'light',
        brandTitle: 'Nitrokit',
        brandUrl: 'https://nitrokit.tr',
        brandImage:
            'https://raw.githubusercontent.com/mustafagenc/nitrokit/refs/heads/main/public/logo/nitrokit-icon.png',
        brandTarget: '_self',
    }),
    darkMode: {
        dark: create({
            base: 'dark',
            brandTitle: 'Nitrokit',
            brandUrl: 'https://nitrokit.tr',
            brandImage:
                'https://raw.githubusercontent.com/mustafagenc/nitrokit/refs/heads/main/public/logo/nitrokit-icon.png',
            brandTarget: '_self',
            appBg: '#0f172a',
            appContentBg: '#1e293b',
            barBg: '#334155',
            barTextColor: '#f1f5f9',
            barSelectedColor: '#3b82f6',
            colorPrimary: '#3b82f6',
            colorSecondary: '#8b5cf6',
            textColor: '#f1f5f9',
            textInverseColor: '#0f172a',
        }),
        light: create({
            base: 'light',
            brandTitle: 'Nitrokit',
            brandUrl: 'https://nitrokit.tr',
            brandImage:
                'https://raw.githubusercontent.com/mustafagenc/nitrokit/refs/heads/main/public/logo/nitrokit-icon.png',
            brandTarget: '_self',
            appBg: '#ffffff',
            appContentBg: '#f8fafc',
            barBg: '#f1f5f9',
            barTextColor: '#334155',
            barSelectedColor: '#3b82f6',
            colorPrimary: '#3b82f6',
            colorSecondary: '#8b5cf6',
            textColor: '#334155',
            textInverseColor: '#ffffff',
        }),
        current: 'light',
        stylePreview: true,
        darkClass: 'dark',
        lightClass: 'light',
    },
});
