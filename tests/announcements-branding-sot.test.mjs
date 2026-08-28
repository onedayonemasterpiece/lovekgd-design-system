import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const contract = JSON.parse(readFileSync(new URL('../catalog/branding/announcements-v1/contract.v1.json', import.meta.url), 'utf8'));

test('branding contract preserves one live wordmark and one lockup family', () => {
  assert.equal(contract.status, 'SOT_READY_PENPOT_PAUSED');
  assert.equal(contract.ownership.AnnouncementsWordmark.classification, 'component');
  assert.deepEqual(contract.ownership.AnnouncementsLockup.variants, ['desktop', 'mobile']);
  assert.equal(contract.ownership.leather_skins.classification, 'static decorative assets behind live lockup content');
  assert.equal(contract.ownership.pwa_launcher_artwork.classification, 'operator-approved static application artwork; not a UI component');
});

test('branding variants pin the actual Astro header geometry', () => {
  assert.deepEqual(contract.variant_matrix.desktop_header.tag, {
    width: 240,
    height: 88,
    padding: [18, 24, 16, 24],
    bottom_radius: 12,
  });
  assert.deepEqual(contract.variant_matrix.mobile_header.tag, {
    width: 120,
    height: 84,
    padding: [0, 0, 12, 14],
    bottom_radius: 14,
  });
  assert.equal(contract.variant_matrix.desktop_header.wordmark_width, 192);
  assert.equal(contract.variant_matrix.mobile_header.wordmark_width, 96);
});

test('PWA artifacts include any and maskable 192/512 pairs', () => {
  const keys = new Set(contract.ownership.pwa_launcher_artwork.artifacts.map((asset) => `${asset.purpose}:${asset.size[0]}`));
  assert.deepEqual(keys, new Set(['any:192', 'any:512', 'maskable:192', 'maskable:512']));
  assert.match(contract.penpot_projection.resume_rule, /read-only/u);
});
