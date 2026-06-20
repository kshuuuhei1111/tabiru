---
name: commit
description: 変更をステージしてコミットする。Conventional Commits 準拠。手動で /commit したときだけ実行。
disable-model-invocation: true
allowed-tools: Bash(git add *) Bash(git status *) Bash(git diff *) Bash(git commit *)
---

## 現在の変更
!`git status --short`

## 手順
1. 変更内容を確認する
2. 関連する変更ごとに適切にステージする
3. Conventional Commits 形式でメッセージを書く（feat: / fix: / chore: / refactor: / docs: など）
4. 要約は日本語1行。必要なら本文に箇条書きで補足
5. push はしない（明示の指示があるときのみ）
