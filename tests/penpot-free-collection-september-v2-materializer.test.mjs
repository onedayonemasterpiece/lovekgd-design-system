import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../scripts/round-trip-reconstruction/penpot-materialize-free-collection-september-v2.js', import.meta.url), 'utf8');

test('September v2 materializer owns exact Astro hero, breadcrumb and fixture clock', () => {
  assert.match(source, /repairExactParity/u);
  assert.match(source, /BREADCRUMB_PATH='Collections \/ Free \/ September v2 \/ Breadcrumbs'/u);
  assert.match(source, /place\(titleShape,65,92\.96875,641\.21875,138\.21875\)/u);
  assert.match(source, /place\(lead,65,247\.1875,695\.921875,60\.375\)/u);
  assert.match(source, /2026-08-29/u);
  assert.match(source, /fillColorGradient:\{type:'linear'/u);
  assert.match(source, /style:'drop-shadow',offsetX:0,offsetY:18,blur:45/u);
});

test('September v2 materializer resolves surface-owned EventCard and shell states without detaching', () => {
  assert.match(source, /calendar\.hidden=EVENTS\[id\]\.group==='exhibitions'/u);
  assert.match(source, /shape\.characters=String\(values\[index\]\);shape\.hidden=values\[index\]===0/u);
  assert.match(source, /card\.component\(\)\?\.id/u);
  assert.doesNotMatch(source, /\.detach\(/u);
  assert.match(source, /Mobile bottom navigation island \/ exact/u);
  assert.match(source, /h=state==='full'\?\(desktop\?3338\.34375:4270\.4375\):\(desktop\?1200:844\)/u);
  assert.match(source, /active=afisha/u);
});

test('footer share strip is the centralized two-control Astro desktop state', () => {
  assert.match(source, /WORDMARK_ID='d87e18f1-dcb4-80a6-8008-87853121d15c'/u);
  assert.match(source, /\['Скопировать карточку','P'/u);
  assert.match(source, /\['Скопировать текст и ссылку','S'/u);
  assert.doesNotMatch(source, /\['Поделиться',590,150\]/u);
});
