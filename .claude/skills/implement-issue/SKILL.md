---
name: implement-issue
description: GitHub Issue を仕様駆動で実装し、Draft PR を作成する。/implement-issue 123 のように使う。
disable-model-invocation: true
allowed-tools: Bash(gh *) Bash(git *) Read Edit Write
---

Issue #$ARGUMENTS を仕様駆動で実装する。

## 手順
1. `gh issue view $ARGUMENTS` で Issue と受け入れ条件を読む。リンクされた spec も読む
2. 実装計画を提示し、着手前に確認を取る
3. `feature/$ARGUMENTS-<短い説明>` ブランチを作成
4. 受け入れ条件を1つずつ満たすように実装する
5. 型チェック・Lint を通す（CLAUDE.md の Definition of Done）
6. 受け入れ条件に対する自己チェック結果を本文に含め、`gh pr create --draft` で PR を作成（本文に "Closes #$ARGUMENTS"）
7. PR の URL を報告する
8. 未確定事項（バックエンド等）に踏み込む場合は止めて確認する
