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
  assert.match(source, /repairSectionsExact/u);
  assert.match(source, /place\(hero,0,84\.796875,1180,500\.78125\)/u);
  assert.match(source, /820\.609375,103\.1875,294\.390625,294\.390625/u);
  assert.match(source, /exactText\(eventHeading,38\.4,700,1\.08,'#221a14',-1\.344\)/u);
  assert.match(source, /exactText\(note,16,400,1\.6,'#6d6259'\)/u);
});

test('September v2 materializer resolves surface-owned EventCard and shell states without detaching', () => {
  assert.match(source, /const value=lineage\.some\(name=>\/Share\//u);
  assert.match(source, /shape\.characters=String\(value\);shape\.hidden=value===0/u);
  assert.match(source, /linkedBaseId:card\.component\(\)\?\.id/u);
  assert.doesNotMatch(source, /\.detach\(/u);
  assert.match(source, /Mobile bottom navigation island \/ exact/u);
  assert.match(source, /h=state==='full'\?\(desktop\?3338\.34375:4270\.4375\):\(desktop\?1200:844\)/u);
  assert.match(source, /active=afisha/u);
  assert.match(source, /const navY=770/u);
  assert.match(source, /activeLabel\.fontWeight='600'/u);
  assert.match(source, /fillColor:'#25211e'/u);
  assert.match(source, /UNIFIED_CARD_PATH = 'Event cards \/ Large \/ Unified Golden v2'/u);
  assert.match(source, /slot\.swapComponent\(target\)/u);
  assert.match(source, /storage\.freeSeptemberV2=\{ensureBody/u);
  assert.match(source, /hydrateUnifiedSlot\(c,id\)/u);
});

test('footer share strip is the centralized two-control Astro desktop state', () => {
  assert.match(source, /WORDMARK_ID='d87e18f1-dcb4-80a6-8008-87853121d15c'/u);
  assert.match(source, /label:'Скопировать карточку',key:'P'/u);
  assert.match(source, /label:'Скопировать текст и ссылку',key:'S'/u);
  assert.match(source, /Footer share \/ Скопировать карточку \/ icon/u);
  assert.match(source, /Footer share \/ Скопировать текст и ссылку \/ icon/u);
  assert.match(source, /penpot\.createPath\(\)/u);
  assert.doesNotMatch(source, /\['Поделиться',590,150\]/u);
});

test('review canvas contains only two ordered Penpot versus Astro comparison pairs before the service zone', () => {
  assert.match(source, /function organizeReviewCanvas\(\)/u);
  assert.match(source, /START HERE — Бесплатные события · Penpot ↔ Astro · Golden Corpus v2/u);
  assert.match(source, /01 · DESKTOP — ASTRO REAL · 5\/5 IMAGES DECODED/u);
  assert.match(source, /02 · MOBILE — ASTRO REAL · 5\/5 IMAGES DECODED/u);
  assert.match(source, /serviceStartY:7930/u);
  assert.match(source, /const reviewCanvas=organizeReviewCanvas\(\)/u);
});

test('comparison screenshots are refreshed only from a capture that decoded all five card images', () => {
  assert.match(source, /ASTRO_CAPTURE_COMMIT = '6faddb367d200f50dee0e5ac9fe7be47f657d0ae'/u);
  assert.match(source, /async function refreshComparisonScreenshots\(\)/u);
  assert.match(source, /all-card-images-decoded','true'/u);
  assert.match(source, /astro-desktop-full\.png/u);
  assert.match(source, /astro-mobile-full\.png/u);
});
