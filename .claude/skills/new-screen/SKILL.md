---
name: new-screen
description: 新しい画面をプロジェクトの構成・規約に沿って雛形作成する。画面追加・新規スクリーン作成のときに使う。
argument-hint: [screen-name]
---

新しい画面 "$ARGUMENTS" を作成する。

## 規約
- CLAUDE.md のコーディング規約とドメインモデルに従う
- 画面は apps/mobile/screens/ に配置（コンポーネントは PascalCase、ファイル/ディレクトリは kebab-case）
- ナビゲーションに登録する
- バックエンド未確定のため、データはローカル状態かモックを使う（packages/shared の型を使用）
- 空状態・ローディング・エラーの最低限の考慮を入れる

## 手順
1. 画面コンポーネントの雛形を作成
2. ナビゲーションへ登録
3. 必要な型を packages/shared から import（なければ提案）
4. 型チェックが通ることを確認
