import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => JSON.parse(readFileSync(path, 'utf8'));
const root = 'catalog/unified-design-wave1/v1';
const manifest = read(`${root}/manifest.v1.json`);

test('Wave 1 remains a bounded unaccepted candidate', () => {
  assert.equal(manifest.status, 'CANDIDATE_NOT_ACCEPTED');
  assert.equal(manifest.boundary.foundation_mode, 'inherit_current_values_unlocked');
  assert.equal(manifest.boundary.new_foundation_tokens, 0);
  assert.equal(manifest.boundary.canonical_foundation_mutations, 0);
  assert.equal(manifest.boundary.production_astro_changes, 0);
  assert.equal(manifest.boundary.mass_shell_replacement, false);
  assert.equal(manifest.boundary.owner_review_required_before_astro_candidate, true);
  assert.deepEqual(manifest.review_consumers, ['archetype.listing.date', 'archetype.event-detail', 'archetype.search']);
});

test('candidate contracts have one lowest owner and no foundation fork', () => {
  assert.equal(manifest.patterns.length, 3);
  for (const item of manifest.patterns) {
    const contract = read(item.contract);
    assert.equal(contract.pattern_id, item.pattern_id);
    assert.equal(contract.status, 'CANDIDATE_NOT_ACCEPTED');
    assert.ok(contract.lowest_owner);
    assert.equal(contract.constraints.new_foundation_tokens, 0);
    assert.ok(contract.review_question.endsWith('?'));
  }
});

test('floating island applicability is explicit and not universal', () => {
  const contract = read(`${root}/patterns/floating-action-island.candidate-v1.json`);
  assert.equal(contract.applicability['archetype.event-detail'], 'candidate');
  assert.match(contract.applicability['archetype.listing.date'], /^not_applicable/);
  assert.match(contract.applicability['archetype.search'], /^not_applicable/);
  assert.equal(contract.constraints.counts_remain_inside_semantic_actions, true);
  assert.equal(contract.constraints.content_occlusion_allowed, false);
});

test('Penpot plan is UI-only and page-bounded', () => {
  const plan = read(manifest.penpot_plan);
  assert.equal(plan.rules.ui_only, true);
  assert.equal(plan.rules.small_pages_only, true);
  assert.equal(plan.rules.page_navigation_per_call, 1);
  assert.equal(plan.rules.service_boards, 0);
  assert.equal(plan.rules.full_page_screenshot_proxies, 0);
  assert.equal(plan.rules.foundation_mutations, 0);
  assert.equal(plan.pages.length, 3);
  assert.ok(plan.pages.every(page => page.boards.length === 4));
});
