import { ScullyConfig, setPluginConfig } from '@scullyio/scully';
import { getFlashPreventionPlugin } from 'scully-plugin-flash-prevention';

setPluginConfig('md', { enableSyntaxHighlighting: true });
const FlashPrevention = getFlashPreventionPlugin();

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
  defaultPostRenderers: [FlashPrevention, 'seoHrefOptimise'],
};
