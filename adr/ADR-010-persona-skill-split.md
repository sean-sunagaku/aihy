# ADR-010: ペルソナ CRUD を独立 Skill `/aihy-persona` に切り出す

- Date: 2026-04-23
- Status: Accepted

## 背景
`/aihy-setup` にペルソナの追加・編集・削除を全て載せる案を初期検討したが、次の課題が浮かび上がった:

1. **setup の肥大化**: target / problem / persona (複数) を 1 フローで扱うと Step 数が増え、再実行のハードルが上がる。setup は「最初の 1 回だけ叩くもの」になりがち。
2. **ペルソナ運用は独立した時間軸**: サイクルを回して初めて「別視点のペルソナが欲しい」「この点を強化したい」と気付く。setup の外でペルソナを更新する導線が必要。
3. **複数視点検証の頻度**: 実務では 3-5 体のペルソナを回すケースが多い。「1 体追加」を setup の外で気軽に叩けると検証速度が上がる。
4. **履歴保全**: 既存ペルソナの `runs[]` は貴重な履歴。これを壊さず編集・削除する操作は専用のガードが要る。

## 決定
ペルソナ操作を 3 Skill で分担:

| Skill | 責務 |
|---|---|
| `/aihy-setup` | 初回セットアップ。target / problem を埋め、**初期ペルソナ 1 体のみ** AI 生成 |
| `/aihy-persona` | ペルソナ CRUD (add / edit / delete / list)。既存ペルソナと差別化された新規生成、編集時の履歴 (`runs[]` / `createdAt`) 保全 |
| `/aihy-run` | サイクル実行。ペルソナ選択 (単一なら自動、複数なら対話)、憑依操作、feedback 生成 |

3 Skill は**疎結合**で、互いに import しない。共通の契約は `.aihy/` 下のファイル (persona JSON スキーマ、LOOP.md の手順) のみ。

## 影響
- `skills/aihy-persona/SKILL.md` を新規追加。
- `skills/aihy-setup/SKILL.md` の Step 6 を「初期 1 体のみ生成。2 体目以降は `/aihy-persona`」と明示。
- `init.mjs` の配布対象 skill に `aihy-persona` を追加（`['aihy-setup', 'aihy-run', 'aihy-persona']`）。
- `package.json` の `files` は既に `["init.mjs", "skills"]` で skills 配下を全部含むため変更不要。
- README の「使い方」フローに任意ステップ `/aihy-persona` を追加。
- ユーザーはセッションをまたいでペルソナ運用可能。1 日目は persona-A で検証、2 日目は `/aihy-persona` で persona-B 追加、といった運用が自然に回る。
- ADR-008 (ペルソナ一人称実況) は `/aihy-run` 側の責務として維持（このADR とは独立）。
