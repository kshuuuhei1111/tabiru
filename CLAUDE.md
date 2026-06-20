# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

**Tabiru**（仮称）— グループ旅行の計画・記録・思い出発信アプリ

- ターゲット：学生・若者中心の複数人グループ旅行
- 認証：Google OAuth（Sign in with Google）必須
- プラットフォーム：**ネイティブアプリ（iOS / Android）**

## 技術スタック（計画中）

| レイヤー | 技術 | 役割 |
|---|---|---|
| モバイルアプリ | Expo / React Native | メインアプリ（計画・記録・動画生成） |
| Web招待入口 | Next.js | 招待URL受け口・未インストール者向け閲覧 |
| バックエンド | Firebase or Supabase（**未決定 T1**） | 認証・データ・リアルタイム同期・メディア |
| 認証 | Google OAuth | ログイン・権限管理 |
| 地図 | 地図API（**未決定 T3**） | スポット検索・ルート可視化 |
| 動画レンダリング | 端末 or サーバー（**未決定 T2**） | 旅程ダイジェスト動画の生成 |

## 重要な未決事項

開発着手前に以下を決定する必要がある：

- **T1** — バックエンド基盤：Firebase（リアルタイム・認証・ストレージ一体）vs Supabase（PostgreSQLベース）。**最優先。他の論点の前提になる。**
- **T2** — 動画レンダリング：端末側（サーバーコスト低・プライバシー良）vs サーバー側（品質・速度安定）
- **T3** — 地図サービス：Google Maps Platform vs 代替。コストに直結（NFR-9）
- **T4** — リアルタイム編集の競合解決：last-write-wins vs 並べ替えに強い手法（CRDT等）
- **T5** — メディア保存ポリシー：保持期間・画質・容量上限
- **T6** — 対応OS下限：iOS / Android 各バージョン

## アーキテクチャの原則

- **オフラインファースト**：旅行先は電波不安定が前提。旅程閲覧・写真メモ記録はオフライン時も動作し、再接続時に自動同期
- **ロールベース認可**：オーナー／編集者／閲覧者の3ロール。全操作に適用
- **写真はプライバシー最重要**：通信TLS・保存データ暗号化・端末側で圧縮してから送信

## MVP機能スコープ

MVP（最優先）として実装するのは以下：

- Google認証・グループ作成・招待URL参加（FR-1.1〜FR-1.5）
- 日別スポット旅程の作成・編集・並べ替えとリアルタイム共同編集（FR-2.1〜FR-2.4）
- スポット単位の写真・メモ記録とメンバー写真の合流（FR-3.1〜FR-3.2）
- 思い出ビュー（FR-4.1）

**スコープ外**：割り勘・旅費管理

## モノレポ構成（計画）

```
<root>/
├── apps/
│   ├── mobile/          # Expo / React Native（メインアプリ）
│   └── web/             # Next.js（招待URL・フォールバック閲覧）
├── packages/
│   └── shared/          # 共有 TypeScript 型・ユーティリティ
├── .claude/
│   └── skills/
│       ├── commit/      # /commit skill
│       └── new-screen/  # /new-screen skill
└── CLAUDE.md
```

パッケージマネージャ：**pnpm**

## ドメインモデル

```typescript
// packages/shared に定義する中核型

type MemberRole = 'owner' | 'editor' | 'viewer';

interface Trip {
  id: string;
  title: string;
  startDate: string;      // ISO 8601
  endDate: string;
  members: Member[];
  days: Day[];
  inviteToken: string;    // 招待URLのトークン
}

interface Member {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  role: MemberRole;
}

interface Day {
  id: string;
  date: string;           // ISO 8601
  spots: Spot[];
}

// Spot は計画・記録・思い出のフェーズを段階的に持つ
interface Spot {
  id: string;
  name: string;
  category?: string;
  location: { lat: number; lng: number };
  order: number;

  // 計画フェーズ（FR-2）
  plan?: {
    scheduledAt?: string;
    notes?: string;
    url?: string;
  };

  // 記録フェーズ（FR-3）
  record?: {
    photos: Photo[];
    memo?: string;
    visitedAt?: string;
  };
}

interface Photo {
  id: string;
  uploadedBy: string;     // userId
  uri: string;            // CDN URL or local URI
  takenAt?: string;
}
```

## コーディング規約

- **言語**：TypeScript strict mode（`strict: true`）
- **スタイリング**：**NativeWind v4**（mobile）/ **Tailwind CSS**（web）。クラス名で統一
- **命名**：コンポーネントは PascalCase、ファイル・ディレクトリは kebab-case
- **画面配置**：`apps/mobile/src/screens/<screen-name>/index.tsx`
- **コンポーネント配置**：`apps/mobile/src/components/<name>.tsx`
- **ナビゲーション**：React Navigation（Stack + BottomTabs）
- **型 import**：`packages/shared` の型を優先し、アプリ固有の型はアプリ内に閉じる
- **バックエンド未確定の間**：データはローカル状態またはモックで実装し、`packages/shared` の型に準拠させる

## DoD（Definition of Done）

各機能の完了条件：

1. 型チェックが通る（`tsc --noEmit`）
2. 空状態・ローディング・エラーの表示が考慮されている
3. ナビゲーションに登録されている（画面追加時）
4. `/commit` でコミット済み

## Skills

- `/commit` — Conventional Commits 形式でコミット（push はしない）
- `/new-screen <画面名>` — 画面の雛形を作成しナビゲーションに登録
- `/code-review` — 変更のレビュー
- `/verify` — 実機・シミュレータで動作確認

## 開発フロー（仕様駆動）

- 機能は `specs/NNN-*.md` の仕様を契約として進める
- 仕様 → Issue → ブランチ実装 → Draft PR → レビュー → マージ の順
- PR は受け入れ条件を満たすことを基準にする。本文に `Closes #<issue>` を含める
- 着手前に実装計画を提示する。未確定事項（バックエンド等）には踏み込まない
- ブランチ名: `feature/<issue番号>-<短い説明>`

```
/spec <機能名>          → specs/NNN-xxx.md を作成
/create-issue specs/... → GitHub Issue を作成
/implement-issue <#>    → ブランチ作成・実装・Draft PR 作成
/code-review            → 変更のレビュー
```

## Skills

- `/spec <機能名>` — 仕様書を `specs/` に作成
- `/create-issue specs/NNN-xxx.md` — 仕様書から GitHub Issue を作成
- `/implement-issue <Issue番号>` — Issue を実装して Draft PR を作成
- `/commit` — Conventional Commits 形式でコミット（push はしない）
- `/new-screen <画面名>` — 画面の雛形を作成しナビゲーションに登録
- `/code-review` — 変更のレビュー
- `/verify` — 実機・シミュレータで動作確認

## ドキュメント

- [docs/要件定義書.md](docs/要件定義書.md) — 詳細な機能要件・非機能要件・技術論点
- [specs/](specs/) — 機能仕様書（spec）一覧
