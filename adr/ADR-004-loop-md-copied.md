# ADR-004: `LOOP.md` を対象リポに同梱する

- Date: 2026-04-23
- Status: Accepted

## 背景
最初は `LOOP.md` をフレームワーク側にのみ置いていたが、対象リポで `npx @sean-sunagaku/aihy` を叩いた後、Claude が「`LOOP.md` をどこから読むか」を毎回探す必要があり、自己完結しない。

## 決定
`init.mjs` で `LOOP.md` を対象リポの `.aihy/LOOP.md` にコピー。Claude は対象リポのパス指定だけで `LOOP.md` を Read できる。

## 影響
- 各対象リポが自己完結（フレームワーク側を参照しない）
- フレームワーク更新後、対象リポで再 `npx` すれば新 `LOOP.md` 反映（現状は `.aihy/` 既存時は abort する、再適用フローは今後検討）
