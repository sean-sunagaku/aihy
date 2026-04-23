---
name: aihy-run
license: MIT
description: >
  aihy の 1 サイクル実行。.aihy/LOOP.md と problem.md に従って設定済みペルソナで
  対象アプリを操作し、主観体験を feedback.md に残す。
  Use when: /aihy-run と言われた、「サイクル回して」「aihy 回して」「検証して」
  と言われた、.aihy/ がセットアップ済みでアプリ起動中、ユーザーの代わりに
  ペルソナ憑依でアプリを試したい時。
  Triggers: "aihy-run", "aihy 回して", "サイクル回して", "仮説検証回して",
  "ペルソナで触って", "feedback ちょうだい".
---

# aihy-run — 仮説検証 1 サイクル実行

`.aihy/LOOP.md` が手順の正本。この SKILL.md はサマリと起動条件のチェックを担う。

## Preconditions

以下が全て揃っていること。欠けたら該当エラー分岐へ:

| 前提 | チェック | 欠けた場合 |
|---|---|---|
| `.aihy/target.json` | 存在 + platform/url or appId が有効 | 「`/aihy-setup` を実行してください」 |
| `.aihy/problem.md` | 4 セクションが埋まっている | 同上 |
| `.aihy/personas/*.json` | 1 体以上 | 同上 |
| 対象アプリ起動中 | web: URL アクセス可 / mobile: 端末に install 済 | 「対象アプリを起動してください」で停止 |
| `.aihy/LOOP.md` | 存在 | references/ から再コピー or `/aihy-setup` 再実行 |

## Workflow サマリ

**詳細は `.aihy/LOOP.md` を読むこと。** 以下は概要のみ:

1. **Read**: `target.json` / `problem.md` / `personas/*.json` / 過去の `runs/*/feedback.md`
2. **Persona 選択**:
   - 1 体のみ → そのまま使う
   - 複数 → AskUserQuestion で選ばせる
3. **Run dir 作成**: `runs/<YYYYMMDD-HHMM>-<persona-id>/screenshots/`
   - `session.md` 冒頭に「今日の目的」を 1 文 (過去 feedback と problem から Claude が導出)
4. **Operate** (ペルソナ憑依で対象アプリ操作):
   - web: `mcp__claude-in-chrome__*`
     - `tabs_create_mcp(target.url)` → `find` / `form_input` / `computer` を組み合わせ
     - スクショは `screenshots/NN.png` に連番
   - mobile: `mcp__mobile-mcp__*`
     - `mobile_launch_app(target.appId)` → `take_screenshot` → `list_elements_on_screen` → `click` / `type_keys` / `swipe`
   - **ペルソナ一人称でユーザーに実況** (ADR-008):
     - 例: `[weeknight-note-taker]: 文字小さくて読みにくいな...`
   - 各ステップを `session.md` に記録: 行動 / 結果 / `screenshots/NN.png` / ペルソナ心中
   - 終了条件: 目的達成 / 3 連続で詰まる / 10 分経過
5. **feedback.md 生成**: 観点別に記述
   - 主観体験 / 見た目 / フリクション / 想定とのズレ (ベット当否) / 継続発見 / 変更提案
6. **Persona 更新**: 使った persona JSON の `runs[]` に `<run-id>` を追記
7. **Report** (3-5 行):
   ```
   persona: <persona.id>
   目的: <今日の目的>
   発見: 1. ... / 2. ... / 3. ...
   feedback: .aihy/runs/<run-id>/feedback.md
   ```

## 操作判断の指針

- 手順はユーザーに聞かず、ペルソナの `techLevel` / `behaviorNotes` から決める
  - `techLevel: low` → ヘルプや tooltip を読む、ミスタップあり
  - `techLevel: high` → ショートカット試す、気になる箇所を深掘り
- ツール失敗 → `session.md` に記録 → 別経路 3 回 → 不可なら終了
- ペルソナが「これ何？」と詰まった箇所は必ず記録 (UX のフリクション指標になる)

## Edge cases

- `.aihy/` が無い / 雛形のまま → 「`/aihy-setup` を先に実行してください」で停止
- `personas/` が空 → 同上
- アプリ未起動 (web 404 / mobile app not found) → 起動指示して停止
- 過去 runs が多くて context を圧迫 → 直近 3 件の feedback.md のみ読む

## Related

- `.aihy/LOOP.md`: 手順の正本
- `/aihy-setup`: セットアップ skill
- ADR-003: 探索型アプローチ
- ADR-008: ペルソナ一人称実況
