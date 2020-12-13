---
title: Scullyプラグインについて
description: Scullyのプラグインの使い方とカスタムプラグインの作り方を紹介します。
image: https://user-images.githubusercontent.com/2607019/102006883-c4f13500-3d67-11eb-9b34-71531ad27434.jpg
date: 2020-12-15
categories:
  - angular
  - scully
slugs:
  - scully-plugins
  - 2020-12-15-scully-plugins
published: true
---

この記事は [Angular Advent Calendar 2020](https://qiita.com/advent-calendar/2020/angular) の 15 日目の記事です。

## 概要

[Scully（スカリー）](https://scully.io/)は Angular 用の静的サイトジェネレーターです。

Scully を利用することで Angular アプリケーションに比較的容易にプリレンダを導入できます。

本記事では Scully のプラグインの使い方とカスタムプラグインの作り方を紹介します。

## Scully プラグイン

Scully は[プラグイン](https://scully.io/docs/concepts/plugins/)によってプリレンダ前後に処理を追加できます。

公式から提供されるプラグインは以下のドキュメントに記載されてあります。

https://scully.io/docs/Reference/plugins/built-in-plugins/overview/

### MD Plugin

マークダウンのシンタックスハイライトを追加するプラグインです。Scully に標準で同梱されています。

```ts
import { setPluginConfig } from '@scullyio/scully';
import { MarkedConfig } from '@scullyio/scully/lib/fileHanderPlugins/markdown';

setPluginConfig<MarkedConfig>('md', { enableSyntaxHighlighting: true });
```

プラグインを追加しただけではシンタックスハイライトが効きません。必ず Prism のサイトから CSS をダウンロードし、アプリケーションに追加しましょう。

### SEO Href Optimize Plugin

リンクに末尾スラッシュ（`/`）を追加するプラグインです。Scully に標準で同梱されています。

```ts
import { ScullyConfig } from '@scullyio/scully';

export const config: ScullyConfig = {
  ...,
  defaultPostRenderers: ['seoHrefOptimise']
};
```

### Flash Prevention Plugin

プリレンダされた HTML→SPA に切り替わった際に画面が一瞬消えるのを抑制するプラグインです。

```
npm install -D scully-plugin-flash-prevention
```

```ts
import { ScullyConfig } from '@scullyio/scully';
import { getFlashPreventionPlugin } from '@scullyio/scully-plugin-flash-prevention';

const FlashPrevention = getFlashPreventionPlugin();

export const config: ScullyConfig = {
  ...,
  defaultPostRenderers: [FlashPrevention]
};
```

このプラグインは下記の様に `app-root-scully` という要素にプリレンダ結果を分離します。

```html
<body class="">
  <app-root></app-root>
  <app-root-scully>
    <!-- プリレンダされたコンテンツ -->
  </app-root-scully>
</body>
```

表示の切り替えは下記の CSS で行われます。

```css
body:not(.loaded) app-root {
  display: none;
}
body:not(.loaded) app-root-scully {
  display: inherit;
}
body.loaded app-root {
  display: inherit;
}
body.loaded app-root-scully {
  display: none;
}
```

`<app-root>` のスタイルに `display: inherit` が適用されるので、`app.component.css` で `display` を使っている場合は注意しましょう。

```css
/* app.component.css */
:host {
  display: grid !important;
}
```

### Remove Scripts Plugin

`<script>` タグを削除するプラグインです。ブログやドキュメント用のサイトなど、SPA にせず静的ファイルで完結するものを作る際に利用します。

```
npm install -D @scullyio/plugins-scully-plugin-remove-scripts
```

```ts
import { ScullyConfig } from '@scullyio/scully';
import {
  RemoveScriptsConfig,
  removeScripts,
} from '@scullyio/plugins-scully-plugin-remove-scripts';

setPluginConfig<RemoveScriptsConfig>(removeScripts, {
  keepTransferstate: false,
});

export const config: ScullyConfig = {
  ...,
  defaultPostRenderers: [removeScripts]
};
```

`<script>` に `scullyKeep` または `sk` 属性を与えると削除対象から除外されます。GA や Service Worker 等と併用する際に覚えておくと良いかと思います。

```html
<script scullyKeep>
  /* 削除したくないスクリプト */
</script>
```

### Critical CSS Plugin (beta)

Critical CSS をインライン化するプラグインです。

```
npm install -D @scullyio/scully-plugin-critical-css
```

```ts
import { ScullyConfig } from '@scullyio/scully';
import { criticalCSS } from '@scullyio/scully-plugin-critical-css';

export const config: ScullyConfig = {
  ...,
  defaultPostRenderers: [criticalCSS]
};
```

[critical](https://github.com/addyosmani/critical#options) のいくつかのオプションにも対応しています。

```ts
export interface CriticalCSSSettings {
  /** 10240 バイト以下の画像インライン化フラグ */
  inlineImages?: boolean;
  /** 対象のビューポート幅 */
  width?: number;
  /** 対象のビューポート高さ */
  height?: number;
  /** メディアクエリ用の幅・高さ */
  dimensions?: {
    width: number;
    height: number;
  }[];
}
```

現状では CLI のフォント最適化と相性が悪いと思われます。このプラグインを使う場合は `angular.json` でフォントの最適化を無効化しておきましょう。

```json
{
  "configurations": {
    "production": {
      "optimization": {
        "fonts": false
      },
```

### Copy to Clipboard Plugin (beta)

`<pre>` タグ内にクリップボードコピーを追加するプラグインです。

```
npm install -D @scullyio/scully-plugin-copy-to-clipboard
```

```ts
import { ScullyConfig } from '@scullyio/scully';
import {
  CopyToClipboard,
  CopyToClipboardPluginConfig,
} from '@scullyio/scully-plugin-copy-to-clipboard';

setPluginConfig<CopyToClipboardPluginConfig>(CopyToClipboard, {
  customBtnClass: 'copy-to-clipboard',
});

export const config: ScullyConfig = {
  ...,
  defaultPostRenderers: [CopyToClipboard]
};
```

`customBtnClass` を設定することで見た目をカスタマイズできます。

```css
button.copy-to-clipboard {
  background-color: #455a64;
  color: #fff;

  &:hover {
    background-color: #ffffff;
    color: #455a64;
  }
}
```

## プラグインの開発

Scully のプラグインは自作することもできます。

`ng add @scully/init` を実行したときに作成された `scully/plugins` というディレクトリに追加していきましょう。

```ts
import { registerPlugin } from '@scullyio/scully';

// プラグイン名
export const customPlugin = 'customPlugin';

// プラグイン本体
const plugin = async (html: string): Promise<string> => {
  return html;
};

// プラグイン実行前のバリデーション
const validator = async () => [];

// プラグインの登録
registerPlugin('render', customPlugin, plugin, validator);
```

例として、このブログで利用している Workbox 用のスクリプトを挿入するプラグインを示します。

```ts
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
```

`<script>` タグを挿入する系のプラグインには前述した `scullyKeep` 属性を追加すると良いでしょう。

カスタムプラグインは `scully/plugins` からインポートして使います。

```ts
import { ScullyConfig } from '@scullyio/scully';
import { WorkboxPluginConfig, workboxPlugin } from './scully/plugins/workbox';

setPluginConfig<WorkboxPluginConfig>(workboxPlugin, {
  swPath: '/service-worker.js',
});

export const config: ScullyConfig = {
  ...,
  defaultPostRenderers: [workboxPlugin]
};
```

Scully 実行時に自動的にコンパイルされるため特別な設定を必要としない点が嬉しいところですね。

## まとめ

本記事では Scully の便利なプラグインの使い方とカスタムプラグインの作り方を紹介しました。

今回取り上げたもの以外にもサードパーティのプラグインもあります。興味のある方はそちらもチェックすると良いかと思います。

https://scully.io/docs/Reference/plugins/community-plugins/overview/

明日は [@dddsuzuki](https://qiita.com/dddsuzuki) さんです。
