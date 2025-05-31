import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

addons.setConfig({
    theme: create({
        base: 'light',
        brandTitle: 'Nitrokit',
        brandUrl: 'https://nitrokit.vercel.app',
        brandImage:
            'https://raw.githubusercontent.com/mustafagenc/nitrokit/refs/heads/main/public/logo/nitrokit-light.svg',
        brandTarget: '_self',
    }),
});
