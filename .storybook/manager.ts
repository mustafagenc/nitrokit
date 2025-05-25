import { addons } from '@storybook/manager-api';

addons.setConfig({
    theme: undefined,
    panelPosition: 'bottom',
    selectedPanel: undefined,
    initialActive: 'sidebar',
    sidebar: {
        showRoots: false,
        collapsedRoots: ['other'],
    },
    toolbar: {
        title: { hidden: false },
        zoom: { hidden: false },
        eject: { hidden: false },
        copy: { hidden: false },
        fullscreen: { hidden: false },
    },
});
