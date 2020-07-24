---
title: Scully と Angular Service Worker を組み合わせてみる
description: Scully と Angular Service Worker を組み合わせようとしたけどダメだった話です。
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

Web アプリケーションでオフライン対応する場合は Service Worker を導入するのが良いでしょう。Angular では `@angular/pwa` を追加することで簡単に実現できます。

Scully を使った Angular アプリケーションに Service Worker を組み込めるか試してみました。

## PWA 化

いつものように `@angular/pwa` を追加してみましょう。

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

## 問題

早速起動してみましょう。一見すると正常にキャッシュできているようです。

では次に記事詳細に移動してからページをリロードしてみましょう。

![](https://user-images.githubusercontent.com/2607019/88353810-e2623a00-cd99-11ea-8ea3-4c0b9d0f96f6.png)

一瞬ですが、記事一覧が表示されます。

末尾スラッシュ `/` を含む URL をリロードした時にキャッシュの読み込み先が `/index.html` とならないため、Scully と Angular Service Worker の組み合わせは避けるか、今後の修正を待った方が良いかもしれません。
