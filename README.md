# aihy

既存アプリに **ペルソナ → AI 操作 → feedback** の 1 サイクルを回すフレーム。
設定・履歴は対象リポの `.aihy/` に全部入る分散型。
AI エージェントは対象リポに配置された `/aihy-setup` / `/aihy-run` スキルから動く。

## インストール

対象リポ (= 検証したいアプリの git リポ) の直下で、どちらかの経路を選ぶ:

### A. gh skill 経由 (GitHub CLI 2.91+ / agentskills.io 準拠)

```bash
cd <target-repo>
gh skill install sean-sunagaku/aihy aihy-setup   --agent claude-code --scope project
gh skill install sean-sunagaku/aihy aihy-persona --agent claude-code --scope project
gh skill install sean-sunagaku/aihy aihy-run     --agent claude-code --scope project
```

`--agent` は `cursor` / `codex` / `gemini-cli` など他の AI エージェントにも差し替え可能。

### B. npx 経由 (既存経路)

```bash
cd <target-repo>
npx @sean-sunagaku/aihy
```

`.claude/skills/aihy-{setup,run,persona}/` と `.aihy/` 雛形を同時に配置する。

## 使い方 (Claude Code)

インストール後、対象リポを Claude Code で開き:

1. **`/aihy-setup`** — 対象リポを読んで `target.json` / `problem.md` を対話で埋め、初期ペルソナを 1 体生成
2. **(任意) `/aihy-persona`** — 別視点のペルソナを追加、既存ペルソナを編集・削除
3. **対象アプリを起動**（web: URL にアクセス可 / mobile: 端末にインストール済み）
4. **`/aihy-run`** — 選択したペルソナで憑依して 1 サイクル回し、`.aihy/runs/<id>/feedback.md` を生成
5. 生成された `feedback.md` を対象リポの Claude に貼って反映

## Cursor / Codex / ChatGPT / その他 AI 向け

slash コマンドが効かない AI 向けのコピペ用プロンプトが `.aihy/PROMPT.md` に入っている。
「`.claude/skills/aihy-<name>/SKILL.md` を読んで実行して」の形でどの AI にも投げられる。

## スキーマ

- `target.json`
  - web: `{ "name": string, "platform": "web", "url": string }`
  - mobile: `{ "name": string, "platform": "mobile", "appId": string }`
- `persona`: `{ id, summary, role, goals[], painPoints[], techLevel, behaviorNotes, createdAt, runs[] }`
- `problem.md`: このアプリは何 / 誰に使ってほしい / 知りたいこと / ベット（任意）

実例: [`skills/aihy-setup/references/`](./skills/aihy-setup/references/)

## 詳細

- 手順書: [`skills/aihy-setup/references/LOOP.md`](./skills/aihy-setup/references/LOOP.md)
- 設計記録: [`adr/`](./adr/README.md)
