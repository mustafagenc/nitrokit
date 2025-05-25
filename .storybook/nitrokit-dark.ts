import { create } from '@storybook/theming';

export default create({
    base: 'dark',
    brandTitle: 'Nitrokit Storybook',
    brandUrl: 'https://github.com/mustafagenc/nitrokit',
    brandImage:
        'https://raw.githubusercontent.com/mustafagenc/nitrokit/refs/heads/main/public/logo/ekipisi.svg',
    brandTarget: '_blank',

    colorPrimary: '#60A5FA',
    colorSecondary: '#E2E8F0',

    fontBase: '"Inter", "Segoe UI", Roboto, sans-serif',
    fontCode: '"Fira Code", "SF Mono", Consolas, monospace',

    textColor: '#E2E8F0',
    textInverseColor: '#1E293B',

    barTextColor: '#E2E8F0',
    barSelectedColor: '#60A5FA',
    barBg: '#1E293B',

    appBg: '#0F172A',
    appContentBg: '#1E293B',
    appBorderColor: '#334155',
});
