import { ScullyConfig, setPluginConfig } from '@scullyio/scully';
import { MarkedConfig } from '@scullyio/scully/lib/fileHanderPlugins/markdown';
import {
  removeScripts,
  RemoveScriptsConfig,
} from '@scullyio/plugins-scully-plugin-remove-scripts';

setPluginConfig<MarkedConfig>('md', { enableSyntaxHighlighting: true });
setPluginConfig<RemoveScriptsConfig>(removeScripts, {
  keepTransferstate: false,
  keepAttributes: ['scullyKeep'],
});

const defaultPostRenderers = [removeScripts, 'seoHrefOptimise'];

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
