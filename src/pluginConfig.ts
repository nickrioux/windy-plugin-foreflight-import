import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-foreflight-import',
    version: '1.0.0',
    icon: '✈️',
    title: 'ForeFlight Import',
    description: 'Import ForeFlight .fpl flight plans and visualize routes with weather',
    author: 'Nicolas',
    desktopUI: 'rhpane',
    mobileUI: 'small',
    desktopWidth: 280,
    routerPath: '/foreflight-import',
};

export default config;
