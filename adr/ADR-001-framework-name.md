# ADR-001: フレームワーク名を `aihy` とする

- Date: 2026-04-23
- Status: Accepted

## 背景
AI が仮説検証サイクルを自動で回すフレームワーク。「AI × hypothesis」のニュアンスを短く表す名前が必要。`aihypo` / `aihipo` / `perloop` / `veriloop` / `aihyva` など多数候補を検討したが、発音しやすさ・被り・意味の伝わりやすさで決着がつかなかった。

## 決定
`aihy` を採用（4文字、ai + hy(pothesis)）。USPTO / IP Australia / J-PlatPat いずれでもソフトウェア分野の商標登録なし、npm 未登録、被りは航空機体記号 (D-AIHY) 等で実質影響なし。

## 影響
- ディレクトリ名は `.aihy/`
- npm 公開では類似名 (`ai`, `tshy`, `pify`) と競合し unscoped で取れず、`@sean-sunagaku/aihy` として scoped 化（ADR-005）
