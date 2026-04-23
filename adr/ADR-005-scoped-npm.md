# ADR-005: npm 公開を scoped `@sean-sunagaku/aihy` とする

- Date: 2026-04-23
- Status: Accepted

## 背景
unscoped の `aihy` を `npm publish` しようとしたところ、既存パッケージ (`ai` / `tshy` / `pify`) との類似性で 403 Forbidden。

## 決定
`@sean-sunagaku/aihy` として scoped package にして publish。

## 影響
- 利用時コマンドは `npx @sean-sunagaku/aihy`
- 将来 unscoped `aihy` が取得可能になれば移行を検討（今は scoped を標準形とする）
