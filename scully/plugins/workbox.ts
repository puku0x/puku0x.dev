import { registerPlugin, getPluginConfig } from '@scullyio/scully';

export const workboxPlugin = 'workboxPlugin';

export interface WorkboxPluginConfig {
  swPath?: string;
}

const defaultConfig: WorkboxPluginConfig = {
  swPath: '/service-worker.js',
};

const plugin = async (html: string): Promise<string> => {
  const config: WorkboxPluginConfig = Object.assign(
    {},
    defaultConfig,
    getPluginConfig(workboxPlugin)
  );

  const workboxScript = `
<script defer scullyKeep>
  (() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        const registration = await navigator.serviceWorker.register('${config.swPath}');
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;
          installingWorker.addEventListener('statechange', () => {
            switch (installingWorker.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) {
                  installingWorker.postMessage({ type: 'SKIP_WAITING' });
                }
                break;
            }
          });
        });
      });
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
      });
    }
  })();
</script>
`;

  return html.replace(/<\/head/i, `${workboxScript}</head`);
};

const validator = async () => [];

registerPlugin('render', workboxPlugin, plugin, validator);
