---
name: aihy-persona
license: MIT
description: >
  aihy の .aihy/personas/ にペルソナを追加・編集・削除する。problem.md と
  既存 personas を読み、別視点のペルソナを AI 生成したり、既存ペルソナを修正する。
  Use when: /aihy-persona と言われた、「ペルソナ追加」「別の視点のペルソナ」
  「ペルソナ編集」「ペルソナ削除」と言われた、既存ペルソナの goals / painPoints /
  techLevel / behaviorNotes を調整したい、複数視点で aihy サイクルを回したい時。
  Triggers: "aihy-persona", "ペルソナ追加", "persona add", "別視点",
  "ペルソナ編集", "ペルソナ削除", "ペルソナ一覧".
---

# aihy-persona — ペルソナ CRUD

`.aihy/personas/<id>.json` に対する追加・編集・削除の操作を担う。`/aihy-setup` が作った
初期 1 体のペルソナを基点に、別視点を足したり、サイクルを回して得た学びをペルソナに反映したりする。

## Preconditions

| 前提 | チェック | 欠けた場合 |
|---|---|---|
| `.aihy/` 存在 | ディレクトリあり | 「`/aihy-setup` を先に実行してください」で停止 |
| `.aihy/problem.md` 埋済 | 4 セクションが空でない | 同上 |
| `.aihy/personas/` | 任意。無ければ mkdir して追加モードのみ有効 | — |

## Workflow

### Step 1 — モード選択

AskUserQuestion で分岐:

- **add**: 新規ペルソナを AI 生成して追加 (デフォルト)
- **edit**: 既存ペルソナを修正
- **delete**: ペルソナを削除
- **list**: 一覧表示のみ (副作用なし)

ユーザー発話から明確ならスキップ可: 「別視点追加」→ add、「〇〇を修正」→ edit、「〇〇削除」→ delete。

### Step 2 (add) — 視点・差別化要件の確認

1. 既存 `.aihy/personas/*.json` を Read して一覧化（id, summary, role）
2. `.aihy/problem.md` を Read
3. AskUserQuestion: 「どんな視点・属性のペルソナが欲しい？」
   - 選択肢例: 「異なる年齢層」「異なる tech level」「真逆のユースケース」「painPoints 重視」「自由記述」
4. 既存ペルソナと**明確に差別化**された JSON を提案:

```json
{
  "id": "<kebab-case-slug>",
  "summary": "既存と違う軸を示す 1 文",
  "role": "職業・立場",
  "goals": ["..."],
  "painPoints": ["..."],
  "techLevel": "low | medium | high",
  "behaviorNotes": "操作時の癖・急ぎ度・読み飛ばし傾向など",
  "createdAt": "YYYY-MM-DD",
  "runs": []
}
```

既存と `role` / `techLevel` / 主要 `painPoints` が重ならないよう意図的に変える。

5. ユーザー確認 (AskUserQuestion) → 修正反映 → `.aihy/personas/<id>.json` に保存

### Step 2 (edit) — 既存ペルソナの修正

1. 既存 `.aihy/personas/*.json` 一覧を表示
2. AskUserQuestion: どのペルソナを編集？
3. 現在値を表示した上で、変更したい項目を AskUserQuestion:
   - `summary` / `role` / `goals` / `painPoints` / `techLevel` / `behaviorNotes`
4. `createdAt` と `runs[]` は **変更しない** (履歴を保全)
5. 更新して保存 (上書き)

### Step 2 (delete) — ペルソナ削除

1. 既存一覧表示
2. AskUserQuestion: どのペルソナを削除？
3. `runs[]` が非空なら「このペルソナには <N> 件の run 履歴がある。削除しても `.aihy/runs/` のログは残るが、persona JSON 自体は消える。本当に削除？」で明示確認
4. 確認後に `.aihy/personas/<id>.json` を削除

### Step 2 (list) — 一覧表示

- 各ペルソナの id / summary / role / techLevel / runs[] 件数を表形式で表示
- ファイル書き込みなし、読み取りのみ

### Step 3 — 結果レポート (3 行以内)

```
<モード>: <persona.id>
  (add なら) 既存 N 体 → N+1 体に。差別化軸: <軸>
  (edit なら) 変更: <fields>
  (delete なら) 削除完了。
```

## Edge cases

- **id 衝突 (add)**: 既存 id と重複したら `<slug>-2` のように suffix を付ける
- **personas/ に 10 体以上**: 「ペルソナが多いです。`edit` や `delete` で整理することも検討」と助言
- **problem.md が大幅に書き変わっている**: 「既存ペルソナが古い問題設定に基づいているかも。見直す？」と AskUserQuestion
- **ユーザーが「設定変えたい」と言ってきたが対象が曖昧**: 何を変えたいか AskUserQuestion で絞る

## Related

- `/aihy-setup`: 初回セットアップ (初期ペルソナ 1 体も作る)
- `/aihy-run`: サイクル実行 (選択したペルソナで憑依)
- `.aihy/LOOP.md`: ペルソナが run でどう使われるかの仕様
- ADR-010: ペルソナ CRUD を独立 Skill に切り出す決定
