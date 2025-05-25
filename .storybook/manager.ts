import { addons } from '@storybook/manager-api';
import nitrokit from './nitrokit-light';

addons.setConfig({
    theme: nitrokit,
    panelPosition: 'right',
    showNav: true,
    showPanel: true,
});
