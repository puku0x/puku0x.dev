import { ScullyConfig, setPluginConfig } from '@scullyio/scully';
// import { getFlashPreventionPlugin } from '@scullyio/scully-plugin-flash-prevention';
import { DisableAngular } from 'scully-plugin-disable-angular';

setPluginConfig('md', { enableSyntaxHighlighting: true });
// const flashPrevention = getFlashPreventionPlugin();
setPluginConfig(DisableAngular, 'render', { removeState: true });

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
  defaultPostRenderers: ['seoHrefOptimise', DisableAngular],
  // defaultPostRenderers: ['seoHrefOptimise', flashPrevention],
};
