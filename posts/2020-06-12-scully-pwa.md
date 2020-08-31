---
title: Scully で PWA
description: Scullyを用いつつAngularアプリケーションをPWA化する方法を紹介します。
image: https://user-images.githubusercontent.com/2607019/88352827-35d28900-cd96-11ea-8cd2-516d9579e6ff.png
date: 2020-06-12
categories:
  - angular
  - pwa
  - scully
slugs:
  - scully-pwa
  - 2020-06-12-scully-pwa
published: true
---

## 概要

Web アプリケーションでオフライン対応する場合は Service Worker を導入するのが良いでしょう。Angular では `@angular/pwa` を追加することで簡単に実現できますが、Scully と組み合わせる場合、期待した動作とならないことが多いため [Workbox](https://developers.google.com/web/tools/workbox) を使うことをお勧めします。

## Angular Service Worker での問題

まずは `@angular/pwa` を追加してみましょう。

```bash
ng add @angular/pwa
```

`ngsw-config.json` で Scully が出力するファイルもキャッシュするように設定します。

```json
{
  ...,
  "assetGroups": [
    ...,
    {
      "name": "blog",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": ["/blog/**/*.html"]
      }
    }
  ]
}
```

Scully 実行後に `index.html` のハッシュ値が変わり Service Worker で正常にキャッシュされなくるため、忘れずに再生成しましょう（[Issue](https://github.com/scullyio/scully/issues/529) 参照）。

```json
{
  "scripts": {
    ...,
    "pwa:regenerate": "rm dist/static/ngsw.json;node_modules/.bin/ngsw-config dist/static ./ngsw-config.json"
  },
```

```bash
npm run build -- --prod
npm run scully
npm run pwa:regenerate
```

早速起動してみましょう。一見すると正常にキャッシュできているようです。

では次に記事詳細に移動してからページをリロードしてみましょう。

![](https://user-images.githubusercontent.com/2607019/88353810-e2623a00-cd99-11ea-8ea3-4c0b9d0f96f6.png)

一瞬ですが、記事一覧が表示されます。

末尾スラッシュ `/` を含む URL をリロードした時にキャッシュの読み込み先が `/index.html` とならないため、Scully と Angular Service Worker の組み合わせは避けるか、今後の修正を待った方が良いかもしれません。

## Workbox による PWA 化

代替案として Service Worker の実装を [Workbox](https://developers.google.com/web/tools/workbox) に変更することをお勧めします。

まず前述の [Issue](https://github.com/scullyio/scully/issues/529) を参考に URL のシリアライズ処理を末尾スラッシュ対応に上書きします。

```ts
import { DefaultUrlSerializer, UrlTree } from '@angular/router';

/**
 * @see https://github.com/angular/angular/issues/16051
 */
export class TrailingSlashUrlSerializer extends DefaultUrlSerializer {
  private static _withTrailingSlash(url: string): string {
    const splitOn = url.indexOf('?') > -1 ? '?' : '#';
    const pathArr = url.split(splitOn);

    if (!pathArr[0].endsWith('/')) {
      const fileName: string = url.substring(url.lastIndexOf('/') + 1);
      if (fileName.indexOf('.') === -1) {
        pathArr[0] += '/';
      }
    }
    const result = pathArr.join(splitOn);
    return result;
  }

  serialize(tree: UrlTree): string {
    return TrailingSlashUrlSerializer._withTrailingSlash(super.serialize(tree));
  }
}
```

`app.module.ts` に追加しましょう。

```ts
import { UrlSerializer } from '@angular/router';

@NgModule({
  declarations: [AppComponent],
  imports: [...],
  providers:[
    { provide: UrlSerializer, useClass: TrailingSlashUrlSerializer }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Scully の設定に `seoHrefOptimize` 追加します。

```ts
import { ScullyConfig, setPluginConfig } from '@scullyio/scully';

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'website',
  outDir: './dist/static',
  routes: {
    '/blog/:slug': {
      type: 'contentFolder',
      slug: {
        folder: './blog',
      },
    },
  },
  defaultPostRenderers: ['seoHrefOptimise'],
};
```

Router を使わない場合は Angular を無効化してしまっても良いかもしれません。

```ts
import { ScullyConfig, setPluginConfig } from '@scullyio/scully';
import { DisableAngular } from 'scully-plugin-disable-angular';

setPluginConfig(DisableAngular, 'render', { removeState: true });

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'website',
  outDir: './dist/static',
  routes: {
    '/blog/:slug': {
      type: 'contentFolder',
      slug: {
        folder: './posts',
      },
    },
  },
  defaultPostRenderers: ['seoHrefOptimise', DisableAngular],
};
```

次にプロジェクトのルートディレクトリに `workbox-config.js` を作成します。

```ts
module.exports = {
  globDirectory: 'dist/static',
  globPatterns: [
    '**/*.{js,LICENSE,txt,png,svg,jpg,webp,ico,html,css,json,webmanifest}',
  ],
  swDest: 'dist/static/service-worker.js',
};
```

最後に `index.html` の `<head></head>` 内に次のスクリプトを追加しましょう。レンダリングを阻害しないよう `defer` 属性をつけるのをお勧めします。

```html
<script defer>
  (function () {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/service-worker.js');
      });
    }
  })();
</script>
```

これで準備完了です。

あとはデプロイ前にアプリケーションのビルドと Scully によるプリレンダリング、Service Worker 用スクリプトの生成を実行すれば Scully を使いつつ PWA として公開できます。

```bash
npm run build -- --prod --statsJson
npm run scully
npx workbox-cli generateSW workbox-config.js
```

## まとめ

現状では Scully と Angular Service Worker を組み合わせるのは難しいようです。

しかし、Workbox を使うことでも PWA 化は可能ですので興味のある方は是非試してみましょう。
