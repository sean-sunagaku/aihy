#!/usr/bin/env node
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgDir = dirname(fileURLToPath(import.meta.url));
const root = join(process.cwd(), '.aihy');

if (existsSync(root)) { console.error('.aihy/ exists'); process.exit(1); }
mkdirSync(root);
mkdirSync(join(root, 'examples'));

writeFileSync(
  join(root, 'target.json'),
  JSON.stringify({ name: basename(process.cwd()), platform: 'web', url: 'http://localhost:3000' }, null, 2) + '\n'
);
writeFileSync(
  join(root, 'problem.md'),
  '# Problem\n\n## このアプリは何\n<!-- 作り手が今考えているもの。1-2文で。 -->\n\n## 誰に使ってほしい\n<!-- 属性・状況をざっくり。確信なくて OK。 -->\n\n## 知りたいこと\n<!-- 体験 / 見た目 / 課題認識が合ってるか / 継続性 など。 -->\n\n## ベット（任意）\n<!-- 「こうなるはず」の仮置き目標。外れても OK、当否が学びになる。 -->\n'
);

writeFileSync(join(root, 'LOOP.md'), readFileSync(join(pkgDir, 'LOOP.md'), 'utf8'));

for (const f of ['persona.json', 'target.web.json', 'target.mobile.json', 'problem.md']) {
  writeFileSync(join(root, 'examples', f), readFileSync(join(pkgDir, 'examples', f), 'utf8'));
}

console.log('Initialized .aihy/');
