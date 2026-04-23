# ADR-009: 配布経路を npx + gh skill の両対応とし、`.aihy/` 初期化を Skill 側に寄せる

- Date: 2026-04-23
- Status: Accepted

## 背景
ADR-005 で npm scoped package (`@sean-sunagaku/aihy`) による配布を決めたが、2026-04-22 リリースの GitHub CLI 2.91.0 で公式 `gh skill` (preview) が追加され、agentskills.io 仕様と 46 種の AI エージェント（Claude Code / Cursor / Codex / Gemini CLI / Copilot など）への配布が GitHub リリースだけで可能になった。npm 経路は「AI エージェント非依存で動く」「単一コマンドで対象リポに `.aihy/` 雛形まで落ちる」という既存体験があり、捨てると既存ユーザーの移行コストが発生する。gh skill 経路は「業界標準 spec に乗る」「`gh skill update` などの更新フローが自動で付く」利点がある。どちらかに寄せるのではなく、両方のルートからインストールできる設計にしたい。

同時に、`.aihy/` 初期化ロジックを CLI (`init.mjs`) と Skill 本体の双方に重複実装すると保守コストが倍になる。真実の源泉を 1 つに寄せる必要がある。

## 決定
1. **リポ構造を agentskills.io 準拠にする**
   - `skills/aihy-setup/SKILL.md` と `skills/aihy-run/SKILL.md` を正本として配置
   - 既存 `LOOP.md` と `examples/*` は `skills/aihy-setup/references/` 配下に移動
2. **`.aihy/` 初期化の責任を SKILL.md 側に持たせる**
   - 初期化手順（target.json 推論、problem.md 対話埋め、ペルソナ生成）は `skills/aihy-setup/SKILL.md` に集約
   - SKILL.md は idempotent に書く：`.aihy/` が既にあれば「既存雛形を対話で埋める」、無ければ「references/ から雛形コピーしたうえで埋める」
3. **配布経路 2 系統**
   - **npx 経路** (`npx @sean-sunagaku/aihy`): `init.mjs` が `skills/` を対象リポの `.claude/skills/` にコピーし、併せて `.aihy/` 雛形も先行配置する（既存体験を維持）
   - **gh skill 経路** (`gh skill install <owner>/<repo> aihy-setup --agent claude-code --scope project`): skill 配置のみ。`.aihy/` は初回 `/aihy-setup` 実行時に skill が作る
4. **`/aihy-setup` と `/aihy-run` は経路非依存**
   - どちらの経路で入っても同じ Skill が同じ挙動を示す

## 影響
- ADR-004 (LOOP.md を対象リポに同梱) を補強：LOOP.md の真実の源泉は `skills/aihy-setup/references/LOOP.md`。`.aihy/LOOP.md` はそこからコピー。
- ADR-005 (scoped npm) を置換しない：npm 経路は残す。ただし `init.mjs` が配布する中身は `skills/` 主導に変わる。
- ADR-007 (examples を `examples/` に集約) を Superseded：新しい置き場所は `skills/aihy-setup/references/`。
- ADR-008 (ペルソナ一人称実況) は `skills/aihy-run/SKILL.md` 側に移植。
- `package.json` の `files` は `["init.mjs", "skills"]` に変更（LOOP.md と examples は skills/ 配下に吸収済み）。
- Cursor / Codex / Gemini など Claude Code 以外のユーザーも、`gh skill install --agent cursor` 等で同じ skill を入れられる。
- GitHub 上のリポジトリ名は `sean-sunagaku/aihy` として公開する (ローカルのディレクトリ名 `ai-repeat-verification` とは一致させない)。`gh skill install sean-sunagaku/aihy aihy-setup ...` と短く書けるため。
