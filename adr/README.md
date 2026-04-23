# ADR (Architecture Decision Record)

aihy フレームワークの意思決定記録。時系列順に追加、過去のものは変更しない（置き換えるときは新しい ADR で Supersede）。

## フォーマット

```md
# ADR-NNN: <タイトル>

- Date: YYYY-MM-DD
- Status: Accepted / Proposed / Superseded by ADR-NNN

## 背景
何が問題で、なぜ決める必要があったか。

## 決定
何を選んだか。

## 影響
採用した結果どう変わったか。
```

## 索引

- [ADR-001: フレームワーク名を `aihy` とする](./ADR-001-framework-name.md)
- [ADR-002: 対象リポに `.aihy/` を配置する分散型](./ADR-002-dot-aihy-directory.md)
- [ADR-003: 探索型アプローチを採用](./ADR-003-exploratory-approach.md)
- [ADR-004: `LOOP.md` を対象リポに同梱](./ADR-004-loop-md-copied.md)
- [ADR-005: npm 公開を scoped package に](./ADR-005-scoped-npm.md)
- [ADR-006: コメント規約を導入](./ADR-006-comment-conventions.md)
- [ADR-007: サンプルを `examples/` に集約](./ADR-007-examples-subdirectory.md)
- [ADR-008: ペルソナ一人称で実況出力](./ADR-008-persona-narration.md)
