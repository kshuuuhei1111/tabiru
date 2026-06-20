---
name: create-issue
description: 仕様書(spec)から GitHub Issue を作成する。/create-issue specs/NNN-xxx.md のように使う。
disable-model-invocation: true
allowed-tools: Bash(gh issue *) Read
---

指定された仕様書から GitHub Issue を作成する：$ARGUMENTS

## 手順
1. 仕様書を読む
2. Issue 本文を組み立てる：概要 / 受け入れ条件（- [ ] のチェックボックス）/ 仕様書へのリンク / 対応 FR
3. 受け入れ条件は spec の受け入れ条件をそのまま転記する
4. `gh issue create` でタイトル・本文・ラベル（例: feature, mvp）を付けて作成
5. 作成された Issue 番号と URL を報告する
