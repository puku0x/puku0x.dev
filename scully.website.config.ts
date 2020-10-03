import { ScullyConfig, prod, setPluginConfig } from '@scullyio/scully';
import { MarkedConfig } from '@scullyio/scully/lib/fileHanderPlugins/markdown';
import { criticalCSS } from '@scullyio/scully-plugin-critical-css';
import {
  removeScripts,
  RemoveScriptsConfig,
} from '@scullyio/plugins-scully-plugin-remove-scripts';

import { WorkboxPluginConfig, workboxPlugin } from './scully/plugins/workbox';

setPluginConfig<MarkedConfig>('md', {
  enableSyntaxHighlighting: true,
});
setPluginConfig<RemoveScriptsConfig>(removeScripts, {
  keepTransferstate: false,
});
setPluginConfig<WorkboxPluginConfig>(workboxPlugin, {
  swPath: '//service-worker.js',
});

const defaultPostRenderers = [removeScripts, 'seoHrefOptimise', criticalCSS];

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
  },
  defaultPostRenderers,
};
