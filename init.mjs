#!/usr/bin/env node
import { mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, rmSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgDir = dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();

const skillsSrc = join(pkgDir, 'skills');
const skillsDst = join(cwd, '.claude', 'skills');
const aihyDir = join(cwd, '.aihy');

// (1) Place .claude/skills/aihy-{setup,run}/ — refresh on every run.
//     Individual skill dirs are replaced wholesale; siblings under
//     .claude/skills/ from other tools are left untouched.
mkdirSync(skillsDst, { recursive: true });
for (const name of ['aihy-setup', 'aihy-run', 'aihy-persona']) {
  const dst = join(skillsDst, name);
  if (existsSync(dst)) rmSync(dst, { recursive: true, force: true });
  cpSync(join(skillsSrc, name), dst, { recursive: true });
}

// (2) Place .aihy/ scaffolding — only if absent (user data is preserved).
const aihyExisted = existsSync(aihyDir);
if (!aihyExisted) {
  mkdirSync(aihyDir);
  mkdirSync(join(aihyDir, 'examples'));

  const refDir = join(pkgDir, 'skills', 'aihy-setup', 'references');

  writeFileSync(
    join(aihyDir, 'target.json'),
    JSON.stringify(
      { name: basename(cwd), platform: 'web', url: 'http://localhost:3000' },
      null,
      2,
    ) + '\n',
  );

  writeFileSync(
    join(aihyDir, 'problem.md'),
    '# Problem\n\n' +
      '## このアプリは何\n<!-- 作り手が今考えているもの。1-2文で。 -->\n\n' +
      '## 誰に使ってほしい\n<!-- 属性・状況をざっくり。確信なくて OK。 -->\n\n' +
      '## 知りたいこと\n<!-- 体験 / 見た目 / 課題認識が合ってるか / 継続性 など。 -->\n\n' +
      '## ベット（任意）\n<!-- 「こうなるはず」の仮置き目標。外れても OK、当否が学びになる。 -->\n',
  );

  writeFileSync(join(aihyDir, 'LOOP.md'), readFileSync(join(refDir, 'LOOP.md'), 'utf8'));
  writeFileSync(join(aihyDir, 'PROMPT.md'), readFileSync(join(refDir, 'PROMPT.md'), 'utf8'));

  for (const f of ['persona.json', 'target.web.json', 'target.mobile.json', 'problem.md']) {
    writeFileSync(join(aihyDir, 'examples', f), readFileSync(join(refDir, f), 'utf8'));
  }
}

console.log(
  aihyExisted
    ? 'Refreshed .claude/skills/aihy-{setup,run,persona}/'
    : 'Initialized .aihy/ and .claude/skills/aihy-{setup,run,persona}/',
);
console.log('');
console.log('Next in Claude Code:');
console.log('  /aihy-setup    fill in target.json / problem.md / initial persona');
console.log('  /aihy-persona  (optional) add / edit / delete personas');
console.log('  /aihy-run      run 1 cycle (after aihy-setup)');
console.log('');
console.log('For other AIs (Cursor / Codex / ChatGPT), see .aihy/PROMPT.md');
