# ADR-007: サンプルを `.aihy/examples/` サブディレクトリに集約

- Date: 2026-04-23
- Status: Accepted

## 背景
最初は `persona.example.json` だけ配置していたが、`target.json` / `problem.md` も書き方サンプルが欲しいとなりファイル追加。`.aihy/` 直下に `*.example.*` が散乱し始めた。

## 決定
`.aihy/examples/` サブディレクトリにサンプルを集約、ファイル名から `.example.` 接尾辞を削除してクリーン化:
- `examples/persona.json`
- `examples/target.web.json`
- `examples/target.mobile.json`
- `examples/problem.md`

## 影響
- `.aihy/` 直下は `target.json` / `problem.md` / `LOOP.md` / `examples/` の4項目
- `package.json` の `files` も `examples` ディレクトリ指定で1行
- 実例の追加・更新が1箇所で管理可能
