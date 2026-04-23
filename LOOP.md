# LOOP.md

Claude が既存アプリに **仮説検証1サイクル** を実行する手順。
`npx @sean-sunagaku/aihy` で対象リポの `.aihy/LOOP.md` に配置される。

## 前提
- `.aihy/target.json`, `.aihy/problem.md` 存在
- 対象アプリ起動済み（web: `target.url` 可 / mobile: `target.appId` あり）

## 入出力
- 入: `.aihy/{target.json, problem.md, personas/*.json, runs/*/feedback.md}`
- 出: `.aihy/runs/<run-id>/{session.md, screenshots/*.png, feedback.md}`
- `<run-id>` = `$(date +%Y%m%d-%H%M)-<persona-id>`

## 手順

1. **Read**: `target.json` / `problem.md` / `personas/*.json` / 過去 `runs/*/feedback.md`
2. **Persona**: 既存1件→使う / 複数→1度だけ聞く / 無し→生成して `personas/<slug>.json` 保存
3. **Run dir**: `runs/<run-id>/screenshots/` 作成、`session.md` 冒頭に **今日の目的を1文**
4. **Operate**: Claude がペルソナとしてアプリを触り、Step 3 の目的を追う。画面解釈・操作速度は `techLevel`/`behaviorNotes` で決め、手順はユーザーに聞かず自分で判断する。
   - web: `mcp__claude-in-chrome__*`（`tabs_create_mcp(target.url)` → `computer/find/form_input` → スクショ）
   - mobile: `mcp__mobile-mcp__*`（`launch_app(target.appId)` → `take_screenshot → list_elements → click/type/swipe` を繰り返し）
   - **操作中はペルソナ一人称でユーザーに実況**（例: `[weeknight-note-taker]: 文字小さくて読みにくいな...`）
   - 各 Step を `session.md` に記録：行動 / 結果 / `screenshots/NN.png` / ペルソナ心中
   - 終了: 目的達成 / 3連続で詰まる / 10分経過
5. **feedback.md**: 過去 `runs/*/feedback.md` を Read して観点別に記述
   観点: 主観体験 / 見た目 / フリクション / 想定とのズレ（ベット当否）/ 継続で見えたこと / 変更提案
6. **Persona update**: 該当 JSON の `runs[]` に `<run-id>` 追記
7. **Report**: ペルソナ / 目的 / 発見1-3件 / `feedback.md` パス（3-5行）

## スキーマ
- `target.json` web: `{ name, platform: "web", url }` / mobile: `{ name, platform: "mobile", appId }`
- `persona`: `{ id, summary, role, goals[], painPoints[], techLevel, behaviorNotes, createdAt, runs[] }`

実例: `.aihy/examples/{persona.json, target.web.json, target.mobile.json, problem.md}`

## コメント
- `<!-- ヒント -->` 人間向けガイド（書き終えたら削除可）
- `<!-- Claude注: ... -->` AI 判断根拠（次サイクル参照用）

## エッジ
- `.aihy/` 不在 → 「`npx @sean-sunagaku/aihy` を実行して」停止
- アプリ未起動 → 「対象アプリを起動して」停止
- ツール失敗 → 記録 → 別経路3回 → 不可なら終了
