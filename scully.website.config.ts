import { ScullyConfig, prod, setPluginConfig } from '@scullyio/scully';
import { MarkedConfig } from '@scullyio/scully/lib/fileHanderPlugins/markdown';
import { criticalCSS } from '@scullyio/scully-plugin-critical-css';
import {
  CopyToClipboard,
  CopyToClipboardPluginConfig,
} from '@scullyio/scully-plugin-copy-to-clipboard';
import {
  removeScripts,
  RemoveScriptsConfig,
} from '@scullyio/plugins-scully-plugin-remove-scripts';

import { WorkboxPluginConfig, workboxPlugin } from './scully/plugins/workbox';

setPluginConfig<MarkedConfig>('md', {
  enableSyntaxHighlighting: true,
});
setPluginConfig<CopyToClipboardPluginConfig>(CopyToClipboard, {
  customBtnClass: 'copy-to-clipboard',
});
setPluginConfig<RemoveScriptsConfig>(removeScripts, {
  keepTransferstate: false,
});
setPluginConfig<WorkboxPluginConfig>(workboxPlugin, {
  swPath: '/service-worker.js',
});

const defaultPostRenderers = [
  removeScripts,
  'seoHrefOptimise',
  criticalCSS,
  CopyToClipboard,
];

if (prod) {
  defaultPostRenderers.push(workboxPlugin);
}

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'website',
  outDir: './dist/static',
  routes: {
    '/posts/:slug': {
      type: 'contentFolder',
      slug: {
        folder: './posts',
      },
    },
    '/users/:userId': {
      type: 'json',
      userId: {
        url: 'https://jsonplaceholder.typicode.com/users',
        property: 'id',
      },
    },
  },
  defaultPostRenderers,
};
