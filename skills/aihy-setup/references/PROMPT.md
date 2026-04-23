# aihy — AI に投げるテンプレ

aihy のサイクルを AI に実行してもらうためのコピペ用プロンプト集。
Claude Code では slash コマンドが効く。Cursor / Codex / ChatGPT / Gemini などではファイルパスを指定してスキル本文を読ませる。

---

## 初回セットアップ

### Claude Code

```
/aihy-setup
```

### Cursor / Codex / ChatGPT / その他 AI

```
このリポの .claude/skills/aihy-setup/SKILL.md を読んで、手順通り実行してください。
.aihy/target.json と .aihy/problem.md を対話で埋めて、初期ペルソナを 1 体生成します。
```

---

## 1 サイクル実行

前提: 対象アプリが起動している (web は URL アクセス可 / mobile は端末に install 済み)。

### Claude Code

```
/aihy-run
```

### その他 AI

```
このリポの .claude/skills/aihy-run/SKILL.md を読んで、手順通り実行してください。
対象アプリは起動済みです。.aihy/LOOP.md の手順に従って 1 サイクル回し、
.aihy/runs/<id>/feedback.md を生成してください。
```

---

## ペルソナの追加・編集

### Claude Code

```
/aihy-persona
```

### その他 AI

```
このリポの .claude/skills/aihy-persona/SKILL.md を読んで、手順通り実行してください。
既存ペルソナと差別化された新しい視点のペルソナを追加したいです。
```

編集したいとき:

```
このリポの .claude/skills/aihy-persona/SKILL.md を読んで、edit モードで実行してください。
ペルソナ <id> の <項目> を修正したいです。
```

---

## その他よく使うパターン

### feedback を対象アプリに反映

```
.aihy/runs/<run-id>/feedback.md を読んで、指摘された UI/UX 改善のうち
「変更提案」に挙がっている項目を対象アプリのコードに反映してください。
変更前の観察結果 (主観体験 / フリクション) は commit メッセージに要約を含めて。
```

### 複数ペルソナで回す

```
1. /aihy-persona で視点の違うペルソナを 2〜3 体追加
2. /aihy-run を体ごとに実行
3. 各 feedback.md を横断して、共通する課題と各ペルソナ固有の課題を切り分けて
```

### 過去の feedback を踏まえて次のサイクル目的を決める

```
.aihy/runs/*/feedback.md を直近 3 件読んで、まだ未解決のフリクションと
ベットの当否を整理し、次の /aihy-run の目的を 1 文で提案して
```

---

## 仕組み

- **`.aihy/LOOP.md`**: 各サイクルの実行手順 (skills/aihy-run が参照)
- **`.aihy/target.json`**: 検証対象アプリの接続情報
- **`.aihy/problem.md`**: このアプリは何 / 誰に / 知りたいこと / ベット
- **`.aihy/personas/*.json`**: ペルソナ (AI が憑依する人物像)
- **`.aihy/runs/<id>/`**: 各サイクルのログ、スクショ、feedback
