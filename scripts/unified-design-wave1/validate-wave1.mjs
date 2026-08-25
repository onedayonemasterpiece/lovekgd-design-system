#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const read = path => JSON.parse(readFileSync(path, 'utf8'));
const sha = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const manifest = read('catalog/unified-design-wave1/v1/manifest.v1.json');
const readback = read('evidence/unified-design-wave1/v1/penpot-readback.v1.json');
const review = read('evidence/unified-design-wave1/v1/review-manifest.v1.json');

assert.equal(manifest.status, 'CANDIDATE_NOT_ACCEPTED');
assert.equal(manifest.boundary.foundation_mode, 'inherit_current_values_unlocked');
assert.equal(manifest.boundary.owner_review_required_before_astro_candidate, true);
assert.equal(manifest.boundary.production_astro_changes, 0);
assert.equal(readback.status, 'REVIEWABLE_NOT_ACCEPTED');
assert.deepEqual(readback.validation, []);
assert.equal(readback.pages.length, 3);
assert.equal(readback.assertions.small_pages_only, true);
assert.equal(readback.assertions.service_boards, 0);
assert.equal(readback.assertions.full_page_screenshot_proxies, 0);
assert.equal(readback.assertions.foundation_mutations, 0);
assert.equal(readback.assertions.production_astro_changes, 0);
assert.equal(readback.assertions.all_expected_components_present, true);
assert.ok(readback.pages.every(page => page.top_level_count <= 6));

for (const page of readback.pages) {
  for (const key of ['desktop_baseline', 'desktop_candidate', 'mobile_baseline', 'mobile_candidate']) assert.ok(page.boards[key], `${page.pattern_id}/${key}`);
  for (const key of ['desktop_candidate', 'mobile_candidate']) {
    const board = page.boards[key];
    assert.ok(board.is_component_main || board.children.some(child => child.is_component_copy), `${page.pattern_id}/${key} linked ancestry`);
  }
}

const searchMobile = readback.pages[0].boards.mobile_candidate.text.find(item => item.characters === 'Поиск');
assert.ok(searchMobile, 'mobile Search label');
assert.equal(String(searchMobile.fontWeight), '900');
const selectorMobile = new Set(readback.pages[1].boards.mobile_candidate.text.map(item => item.characters));
assert.ok(selectorMobile.has('Вся область'));
assert.ok(selectorMobile.has('По времени'));
const floatingMobileCounts = readback.pages[2].boards.mobile_candidate.text.filter(item => item.name === 'Content / Count').map(item => item.characters).sort();
assert.deepEqual(floatingMobileCounts, ['13', '164']);
const floatingDesktop = readback.pages[2].boards.desktop_candidate;
const floatingDesktopCounts = floatingDesktop.text.filter(item => item.name === 'Content / Count').map(item => item.characters).sort();
assert.deepEqual(floatingDesktopCounts, ['13', '164']);
assert.ok(floatingDesktop.children.some(item => item.name === 'linked Action / Calendar / dark responsive'));
assert.ok(floatingDesktop.children.some(item => item.name === 'linked Action / Share / dark responsive · count=13'));
assert.ok(floatingDesktop.children.some(item => item.name === 'linked Action / Like / dark responsive · count=164'));

assert.equal(review.status, 'WAVE1_REVIEWABLE_NOT_ACCEPTED');
assert.equal(review.coverage.patterns, 3);
assert.equal(review.coverage.pages, 3);
assert.equal(review.coverage.cases, 6);
assert.deepEqual(review.coverage.missing, []);
assert.equal(review.review_policy.astro_candidate_before_owner_acceptance, false);
assert.ok(review.cases.every(item => item.layout === 'baseline_above_candidate' && item.status === 'AWAITING_OWNER_REVIEW'));
for (const item of review.cases) {
  for (const ref of [item.penpot.baseline_export, item.penpot.candidate_export, item.comparison]) assert.equal(sha(ref.path), ref.sha256, ref.path);
  assert.ok(item.penpot.baseline_url.includes(`board-id=${item.penpot.baseline_board_id}`));
  assert.ok(item.penpot.candidate_url.includes(`board-id=${item.penpot.candidate_board_id}`));
}
assert.ok(Object.values(review.preserved_boundaries).every(value => value === 0));
console.log(`UNIFIED_DESIGN_WAVE1_PASS ${sha('evidence/unified-design-wave1/v1/review-manifest.v1.json')}`);
