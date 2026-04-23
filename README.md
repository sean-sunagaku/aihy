# aihy

既存アプリに **ペルソナ → AI 操作 → feedback** の1サイクルを回すフレーム。
設定・履歴は対象リポの `.aihy/` に全部入る。

## 使い方

```bash
cd <target-repo>
npx @sean-sunagaku/aihy
```

→ `.aihy/{target.json, problem.md, LOOP.md}` 生成。

1. **`target.json`** — web: `{ name, platform: "web", url }` / mobile: `{ name, platform: "mobile", appId }`
2. **`problem.md`** — このアプリは何 / 誰に使ってほしい / 知りたいこと（+任意のベット）
3. **対象アプリを起動**（web: URL にアクセス可 / mobile: 端末にインストール済み）
4. Claude に `<対象リポのパス> で1サイクル回して`
5. `.aihy/runs/<id>/feedback.md` を対象リポの Claude に貼って反映

詳細: [LOOP.md](./LOOP.md)
