---
name: aihy-setup
license: MIT
description: >
  aihy (AI hypothesis-verification loop) の初回セットアップ。対象リポのコードを読んで
  .aihy/target.json を推論し、problem.md を対話で埋め、初期ペルソナを 1 体 AI 生成する。
  ペルソナの追加・編集は別スキル /aihy-persona が担当する。
  Use when: aihy を初めて使う、/aihy-setup と言われた、.aihy/ が空または雛形のまま、
  aihy のサイクルを回す前の準備をしたい、「setup して」「セットアップ」と言われた時。
  Triggers: "aihy-setup", "aihy セットアップ", "setup aihy", "aihy 初期化",
  "問題設定", "初期ペルソナ", ".aihy 埋めて".
---

# aihy-setup — 初回セットアップ

aihy の対象リポに `.aihy/` を配置し、`target.json` / `problem.md` / `personas/<id>.json` を
対話で埋める。対象リポのコードを読んで下書きを先に提示し、ユーザーは修正するだけで済む体験を目指す。

ペルソナはここでは **1 体だけ** AI 生成する。2 体目以降の追加・既存ペルソナの編集・削除は
独立スキル `/aihy-persona` の責務。setup はミニマルに保ち、再実行しても壊れないようにする
(ADR-010)。

## Preconditions

- Claude Code が対象リポ (= 検証したいアプリの git リポ) の cwd で動いている
- 以下いずれかでこの skill が配置済み:
  - `npx @sean-sunagaku/aihy` (cwd に `.claude/skills/aihy-{setup,run,persona}/` を配置)
  - `gh skill install <owner>/<repo> aihy-setup --agent claude-code --scope project`
- skill の `references/` に `LOOP.md` / `persona.json` / `target.web.json` / `target.mobile.json` / `problem.md` が存在

## Workflow

### Step 1 — `.aihy/` の状態確認

- **存在しない**: Step 2 で雛形を置く
- **存在するが雛形**: Step 3 以降で既存ファイルを対話で埋める
- **既に埋まっている**: 「セットアップ済み。`/aihy-run` 実行する？それとも再編集？」と AskUserQuestion

### Step 2 — `.aihy/` 雛形を配置 (存在しない場合のみ)

`.claude/skills/aihy-setup/references/` から以下をコピー:

```
.aihy/
├── target.json           ← references/target.web.json をベースに cwd basename で name を埋める
├── problem.md            ← references/problem.md (空雛形)
├── LOOP.md               ← references/LOOP.md そのまま
└── examples/
    ├── persona.json
    ├── problem.md
    ├── target.web.json
    └── target.mobile.json
```

### Step 3 — 対象リポを読んで target を推論

Read する対象 (存在するものだけ):
- `package.json` — scripts.dev / scripts.start から url 推論 (`http://localhost:3000` など)
- `README.md` — アプリ概要
- `app.json` / `expo/app.json` — mobile の bundleId/appId
- `ios/*/Info.plist` / `android/app/src/main/AndroidManifest.xml`
- `src/` / `app/` の index / App エントリ 1〜2 ファイル

### Step 4 — `target.json` を確定

AskUserQuestion で確認:
1. platform: web / mobile
2. name: cwd の basename がデフォルト
3. url (web の場合) or appId (mobile の場合): 推論値をデフォルト

スキーマ:
- web: `{ "name": string, "platform": "web", "url": string }`
- mobile: `{ "name": string, "platform": "mobile", "appId": string }`

### Step 5 — `problem.md` を対話で埋める

4 セクションを 1 つずつ。対象リポを読んだ結果から Claude が下書きを提示し、ユーザーが修正する流れ:

1. **このアプリは何** (1-2 文) — Claude 下書き: README とコードから推論
2. **誰に使ってほしい** — Claude 下書き: コピーライティング / UI 文言から推論
3. **知りたいこと** — 箇条書き (3 件程度)
4. **ベット** (任意) — 空 OK、ユーザーが書きたければ書く

`<!-- ヒント -->` は埋め終わったら削除。

### Step 6 — 初期ペルソナを 1 体 AI 生成

`problem.md` の「誰に使ってほしい」「知りたいこと」をもとに、1 体のペルソナを JSON で提案:

```json
{
  "id": "<kebab-case-slug>",
  "summary": "1 文でわかる誰か",
  "role": "職業・立場",
  "goals": ["..."],
  "painPoints": ["..."],
  "techLevel": "low | medium | high",
  "behaviorNotes": "操作時の癖・急ぎ度・読み飛ばし傾向など",
  "createdAt": "YYYY-MM-DD",
  "runs": []
}
```

`references/persona.json` がフィールドの参考例。

提案をユーザーに表示 → 修正があれば取り込み → `.aihy/personas/<id>.json` に保存。
`.aihy/personas/` が無ければ mkdir。

**ここで作るのは 1 体のみ**。2 体目以降が必要になったら `/aihy-persona` を使う。

### Step 7 — `/aihy-run` へ誘導

報告フォーマット (5 行以内):

```
セットアップ完了。
  target:  <target.name> (<target.platform>, <target.url or target.appId>)
  persona: <persona.id>
次は対象アプリを起動してから `/aihy-run` を実行。
  別視点のペルソナを追加したければ `/aihy-persona`。
```

## Edge cases

- **references/ が無い**: 「`npx @sean-sunagaku/aihy` か `gh skill install` を再実行してください」で停止
- **`.aihy/` が既に完全に埋まっていて上書き意図**: AskUserQuestion で明示確認を取ってから編集
- **対象リポが monorepo で複数アプリある**: AskUserQuestion でどれを対象にするか選ばせる
- **package.json / README が無い非 Node プロジェクト**: Step 3 をスキップし、全て対話で埋める

## Related

- `/aihy-persona`: ペルソナ追加・編集・削除 (setup 後の CRUD)
- `/aihy-run`: サイクル実行
- `.aihy/LOOP.md`: 各サイクルの手順
- ADR-003: 探索型アプローチ (problem.md の構造の根拠)
- ADR-009: npx + gh skill 両対応の配布設計
- ADR-010: ペルソナ CRUD を独立 Skill に切り出す決定
