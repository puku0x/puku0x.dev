---
title: Scully が Prism に対応
description: さようなら highlight.js こんにちは Prism。
image: https://user-images.githubusercontent.com/2607019/89917269-8f123780-dc33-11ea-9f79-6b78f50f9122.png
date: 2020-08-08
categories:
  - scully
slugs:
  - scully-prism
  - 2020-08-08-scully-prism
published: true
---

## 概要

Scully v1.0.0-beta.1 で Markdown プラグインの実装が [Prism](https://prismjs.com/) に変わりました。

これで JSX / TSX のシンタックスハイライトも有効になる...かと思われましたがまだ完全にサポートされている訳ではなさそうでした。

## 準備

### ライブラリの修正

v1.0.0-beta.2 より古いバージョンを使っている場合は修正が必要です。

`node_modeules/@scullyio/scully/lib/fileHandlerPlugins/markdown.js` に下記の２行を追加しましょう。

```js
// Syntax Highlighting
const Prism = require('prismjs');
require('prismjs/components/prism-bash');
require('prismjs/components/prism-css');
require('prismjs/components/prism-javascript');
require('prismjs/components/prism-json');
require('prismjs/components/prism-markup');
require('prismjs/components/prism-markdown');
require('prismjs/components/prism-typescript');
require('prismjs/components/prism-jsx'); // 追加
require('prismjs/components/prism-tsx'); // 追加
```

### CSS の追加

[Prism のサイト](https://prismjs.com/download.html#themes=prism-tomorrow&languages=markup+css+clike+javascript+jsx+tsx+typescript)から CSS のみダウンロードしましょう。

`prism.scss` などのファイル名で保存し、`angular.json` に追加すれば準備完了です。

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "website": {
      ...,
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            ...,
            "styles": ["src/styles.scss", "src/prism.scss"],
```

### プラグイン設定

Scully の設定ファイルでシンタックスハイライトを有効にします。

```ts
import { ScullyConfig, setPluginConfig } from '@scullyio/scully';

setPluginConfig('md', { enableSyntaxHighlighting: true });

export const config: ScullyConfig = {...};
```

## 結果

シンタックスハイライトが適用されました。

```tsx
import * as React from 'react';
import { useState } from 'react';

const Example: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
};
```

## まとめ

highlight.js → Prism に変更されたと言ってもまだベータ版なので一手間必要ですね...

ちなみに TSX をデフォルトでサポートするように PR を送っています。
https://github.com/scullyio/scully/pull/839

~~マージされることを祈ります。~~ マージされました。
