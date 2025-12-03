# RPG Maker MV Ace: コミュニティコアスクリプト

![Banner](https://raw.githubusercontent.com/RyanBram/RPG-MV-Ace/refs/heads/main/docs/img/Project%20Ace.png)

<p align="center">
 <a href="https://github.com/RyanBram/RPG-MV-Ace/wiki">Wiki</a> | <a href="https://ryanbram.github.io/RPGMV-Ace/">デモ</a> | <a href="https://plugin.fungamemake.com/archives/category/mv-plugin">プラグイン</a> | <a href="https://github.com/RyanBram/RPG-MV-Ace">English</a>
</p>

Project AceはRPGツクールMVエンジンコアの包括的な近代化プロジェクトです。既存のプラグインやプロジェクトとの後方互換性を維持しながら、古くなったRMMVコードベースを最新技術で更新することを目指しています。

## 🔧 技術概要

### 🎨 レンダラーアップグレード: Pixi.js v4 → v8

![WebGPU](https://raw.githubusercontent.com/RyanBram/RPG-MV-Ace/refs/heads/main/docs/img/WebGPU.png)

コアレンダリングシステムをPixi.js v4からv8に移行中です:

- 対応プラットフォームでのレンダリング性能向上のための**WebGPUサポート**
- より広い互換性のためにWebGL(OpenGL ES)への自動フォールバック
- レンダリング処理の大幅な性能向上

### 📐 解像度処理

- 複数の解像度とアスペクト比に対応する動的スケーリングシステム
- ウィンドウリサイズ時のリアルタイムレイアウト更新
- ハードコードされた解像度制約の撤廃

### 💻 デスクトップデプロイメント - [Tauri-MV](https://github.com/RyanBram/Tauri-MV)

![Desktop](https://raw.githubusercontent.com/RyanBram/RPG-MV-Ace/2560fd38e57e15ffde2f4799754b8376ad8f9a9f/docs/img/Desktop_Logo.svg)

モダンなデスクトップアプリケーションフレームワークのサポート:

- **Electron**: 標準的なクロスプラットフォームデスクトップラッパー
- **Tauri**: ネイティブOSウェブビューを使用した軽量な代替手段(Electronと比べて約1MBのオーバーヘッド)

### 🎵 オーディオシステム - [RPG Mixer](https://ryanbram.itch.io/rpg-mixer)

モジュラーバックエンドアーキテクチャを持つカスタム`rpg_mixer.js`プラグイン:

- 初期ロード時間を短縮するためのオーディオバックエンドの遅延読み込み
- [SpessaSynthによる](https://spessasus.github.io/)**MIDI**(.mid, .rmi)
- [libopenmpt](https://lib.openmpt.org/libopenmpt/)による**トラッカーフォーマット**(.mod, .s3m, .xm, .it, .mptm, .mo3)
- 追加フォーマットサポートのための拡張可能な設計

### 🌍 ローカライゼーションシステム - [RPG Locale](https://ryanbram.itch.io/rpg-locale)

![RPG Locale](https://img.itch.zone/aW1hZ2UvNDAwODA0MC8yMzkwMjExOS5wbmc=/original/I9wSyF.png)

統合された翻訳ワークフローを持つ`rpg_locale.js`プラグイン:

- JSONデータベースファイルからのテキスト自動抽出
- 機械翻訳統合(Google翻訳、DeepL)
- 内蔵の翻訳エディタとヘルパーツール

### 🎮 入力システム - [RPG Player](https://ryanbram.itch.io/rpg-player)

![RPG Player](https://img.itch.zone/aW1hZ2UvNDAwODA5OC8yMzkwMjMwMC5wbmc=/250x600/qKRy19.png) ![RPG Player](https://img.itch.zone/aW1hZ2UvNDAwODA5OC8yMzkwMjMwMS5wbmc=/250x600/wBb8u9.png)

改善された入力処理とHTML5埋め込み可能なプレーヤー:

- キーボード、マウス、タッチ入力処理の強化
- 標準コントロール(再生、停止、フルスクリーン、音量)を備えた埋め込み可能なプレーヤー
- モバイルWebデプロイメント用の仮想ボタンサポート
- ゲームロード中のカスタムカバーアート

### 🎯 ジャンルテンプレート

![Danmaku_core](https://img.itch.zone/aW1nLzI0Mjk0Mzc4LmpwZw==/315x250%23c/hKYvEe.jpg) ![SRP_core](https://img.itch.zone/aW1nLzEwOTM2NjYxLnBuZw==/315x250%23c/iIG17t.png)

様々なゲームジャンル向けのキュレーションされたテンプレート:

- ビジュアルノベル
- [シミュレーションRPG(SRPG)](https://ohisamacraft.nyanta.jp/srpg_gear_mv.html)
- プラットフォーマー
- [弾幕シューティング](https://github.com/HashakGik/BulletHell-RMMV)
- アクションRPG(ARPG)
- カードゲーム

---

## 🛠️ ビルド

### 必要要件

- Node.js

### ビルドコマンド

```bash
# 依存関係のインストール
npm install

# すべてのコアスクリプトをビルド
npm run build
```

出力は`dist/`フォルダに生成されます。

### 個別モジュールビルド

```bash
npm run build:core      # rpg_core.js
npm run build:managers  # rpg_managers.js
npm run build:objects   # rpg_objects.js
npm run build:scenes    # rpg_scenes.js
npm run build:sprites   # rpg_sprites.js
npm run build:windows   # rpg_windows.js
```

### 開発

```bash
# 変更を監視して./game/js/に自動ビルド
npm run watch

# ローカル開発サーバーを起動(http://localhost:8080/)
npm start

# テストを実行(game/フォルダにRPGツクールMVプロジェクトが必要)
npm test
```

---

## 🏗️ コアスクリプトアーキテクチャ

コアスクリプトは6つのメインファイルにコンパイルされます:

| ファイル | 内容 |
|------|----------|
| `rpg_core.js` | Pixi.jsラッパー、オーディオ、入力、コアシステム |
| `rpg_managers.js` | 静的マネージャークラス(XxxManager) |
| `rpg_objects.js` | ゲームデータクラス(Game_Xxx)、セーブ時にシリアライズ |
| `rpg_scenes.js` | シーンクラス(Scene_Xxx) |
| `rpg_sprites.js` | グラフィックス用スプライトクラス(Sprite_Xxx) |
| `rpg_windows.js` | UI用ウィンドウクラス(Window_Xxx) |

追加ファイル:
- `plugins.js`: プラグインリスト定義
- `main.js`: アプリケーションエントリーポイント

### 継承パターン

コードベースはES5プロトタイプベース継承を使用しています:

```javascript
function Derived() {
  this.initialize.apply(this, arguments);
}

Derived.prototype = Object.create(Base.prototype);
Derived.prototype.constructor = Derived;

Derived.prototype.initialize = function() {
  Base.prototype.initialize.call(this);
};
```

### グローバル変数

**$dataXxx**: JSONファイルから読み込まれる読み取り専用データ(例: `$dataMap`、`$dataItems`)
- RPGツクールエディタで生成
- ゲームプレイ中は不変

**$gameXxx**: ライブゲーム状態インスタンス(例: `$gamePlayer`、`$gameState`)
- `rpg_objects.js`で定義
- セーブ時にシリアライズ(`$gameTemp`、`$gameMessage`、`$gameTroop`を除く)
- ロード時にプロトタイプチェーンが自動的に復元される

### レンダリングと実行

**シーングラフ**: 子要素が親の変換を継承するPixi.jsツリー構造

**シーンライフサイクル**:
```
new Scene_Xxx() → create() → start() → update()* → stop() → terminate()
```

**ゲームループ**:
1. `SceneManager.run()`がコアシステム(`Graphics`、`WebAudio`、`Input`など)を初期化
2. `Scene_Boot`が初期シーンとして開始
3. `requestAnimationFrame`がメインループを駆動:
   - `SceneManager.update()`が60 FPSで実行
   - 現在のシーンの`update()`がすべての子要素に伝播
   - シーングラフが画面にレンダリング
   - ループが繰り返される

---

## 🤝 コントリビューション

コントリビューションを歓迎します。以下の点にご注意ください:

- **言語**: すべてのコード、コメント、ドキュメントは英語
- **コード標準**: 最大限のプラグイン互換性のためES5を使用
- 提出前にステージング環境で変更をテスト

---

## 🗺️ ロードマップ

- Pixi v8 / WebGPU移行の完了
- ジャンルテンプレートライブラリの拡張
- プラグイン互換性レイヤーの改善
- 大規模プロジェクトのパフォーマンス最適化

---

## 📜 ライセンス

[MIT License](https://github.com/RyanBram/RPG-MV-Ace/blob/main/LICENSE)

<p align="center">
  <a href="https://www.patreon.com/c/projectmvace" target="_blank" rel="noopener noreferrer">
    <img src="https://raw.githubusercontent.com/RyanBram/RPG-MV-Ace/refs/heads/main/docs/img/ProjectAce%20Support.png" alt="Project Aceをサポート">
  </a>
</p>

## 🙏 謝辞

このプロジェクトは、以下の方々が作成したオリジナルのRPGツクールMVエンジンを基盤としています:

- **尾島陽児**: RPGツクールシリーズの制作者
- **株式会社KADOKAWA**: パブリッシャー及び権利者

Project Aceは独立したコミュニティプロジェクトであり、株式会社KADOKAWAとは関係ありません。RPGツクール™およびRPGツクールMV™は株式会社KADOKAWAの商標です。
