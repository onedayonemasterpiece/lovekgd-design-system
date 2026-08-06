import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.argv[2] || 'prototypes/penpot-review-plugin-002b');
const readText = (path) => readFile(resolve(root, path), 'utf8');
const sha256 = (value) => createHash('sha256').update(value, 'utf8').digest('hex');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateCatalog(catalog, wave) {
  assert(catalog.schemaVersion === 3, `${wave}: schemaVersion`);
  assert(catalog.catalogRevision === `002b-load-${wave.toLowerCase()}`, `${wave}: catalogRevision`);
  assert(catalog.repository === 'onedayonemasterpiece/lovekgd-design-system', `${wave}: repository`);
  assert(catalog.mirror?.namespace === 'lovekgd.mirror.002b', `${wave}: namespace`);
  assert(catalog.elements.length === 57, `${wave}: expected 57 elements`);
  const ids = new Set();
  const counts = { 'inline-svg': 0, 'git-svg': 0, 'git-image': 0 };
  for (const element of catalog.elements) {
    assert(!ids.has(element.id), `${wave}: duplicate ${element.id}`);
    ids.add(element.id);
    assert(element.board && Number.isFinite(element.board.x) && Number.isFinite(element.board.y), `${wave}: slot ${element.id}`);
    const artifact = element.artifact;
    assert(artifact && counts[artifact.type] !== undefined, `${wave}: artifact type ${element.id}`);
    counts[artifact.type] += 1;
    if (artifact.type === 'inline-svg') {
      const actual = sha256(artifact.svg);
      assert(actual === artifact.sha256, `${wave}: inline SHA ${element.id}`);
      assert(element.contentHash === `sha256:${actual}`, `${wave}: contentHash ${element.id}`);
      assert(artifact.svg.includes('NOT APPROVED DESIGN'), `${wave}: fixture label ${element.id}`);
    } else {
      assert(/^[0-9a-f]{40}$/u.test(artifact.gitBlobSha), `${wave}: git blob ${element.id}`);
      assert(artifact.url.includes('c6a679dbbb3bbd65eb096becbd5976e7ccd67a26'), `${wave}: immutable asset ${element.id}`);
      assert(element.sourceRevision === 'c6a679dbbb3bbd65eb096becbd5976e7ccd67a26', `${wave}: source revision ${element.id}`);
      if (artifact.type === 'git-image') {
        assert(artifact.mimeType.startsWith('image/'), `${wave}: mime ${element.id}`);
        assert(sha256(artifact.frameSvg) === artifact.frameSha256, `${wave}: frame SHA ${element.id}`);
        assert(artifact.imageRect.width > 0 && artifact.imageRect.height > 0, `${wave}: imageRect ${element.id}`);
      }
    }
  }
  assert(counts['inline-svg'] === 36, `${wave}: inline count ${counts['inline-svg']}`);
  assert(counts['git-svg'] === 11 - (wave === 'B' ? 1 : 0), `${wave}: git svg count ${counts['git-svg']}`);
  assert(counts['git-image'] === 10 - (wave === 'B' ? 1 : 0), `${wave}: image count ${counts['git-image']}`);
  return { ids, counts };
}

const [catalogA, catalogB, plugin, ui, manifest] = await Promise.all([
  readText('catalog/catalog.json').then(JSON.parse),
  readText('catalog/catalog.wave-b.json').then(JSON.parse),
  readText('dist/plugin.js'),
  readText('dist/ui.html'),
  readText('dist/manifest.json').then(JSON.parse),
]);

const a = validateCatalog(catalogA, 'A');
const b = validateCatalog(catalogB, 'B');
const removed = [...a.ids].filter((id) => !b.ids.has(id));
const added = [...b.ids].filter((id) => !a.ids.has(id));
assert(removed.length === 3, `expected 3 removed, got ${removed.length}`);
assert(added.length === 3, `expected 3 added, got ${added.length}`);

const byIdA = new Map(catalogA.elements.map((element) => [element.id, element]));
const byIdB = new Map(catalogB.elements.map((element) => [element.id, element]));
let changed = 0;
let moved = 0;
for (const id of [...a.ids].filter((value) => b.ids.has(value))) {
  const left = byIdA.get(id);
  const right = byIdB.get(id);
  if (left.contentHash !== right.contentHash) changed += 1;
  if (left.board.x !== right.board.x || left.board.y !== right.board.y || left.board.width !== right.board.width || left.board.height !== right.board.height) moved += 1;
}
assert(changed >= 10, `expected >=10 changed, got ${changed}`);
assert(moved >= 20, `expected >=20 moved, got ${moved}`);

for (const marker of [
  'archive-replace',
  'archive-remove',
  'staging_failed',
  'commit_rolled_back',
  'verifyCurrentMirror',
  'uploadMediaData',
  "lane: 'review'",
]) assert(plugin.includes(marker), `plugin marker missing: ${marker}`);
assert(/const UI_REVISION = '[0-9a-f]{40}'/u.test(plugin), 'UI revision must be immutable');
assert(!plugin.includes('PENPOT_INTEGRATION_TOKEN'), 'PAT must not be used');
assert(!plugin.toLowerCase().includes('supabase'), 'plugin must not write Supabase');

for (const marker of [
  "const CATALOG_BRANCH = 'penpot-mirror-live'",
  'gitBlobSha',
  'inline_svg_hash_mismatch',
  'CURRENT',
  'STALE',
  'SYNC FAILED',
  'loadedBytes',
]) assert(ui.includes(marker), `UI marker missing: ${marker}`);
assert(!/fetch\([^)]*design\.penpot\.app/u.test(ui), 'UI must not call Penpot REST API');

assert(manifest.version === 2, 'manifest version');
assert(JSON.stringify(manifest.permissions) === JSON.stringify(['content:read', 'content:write', 'comment:read']), 'manifest permissions');

console.log(JSON.stringify({
  ok: true,
  waveA: a.counts,
  waveB: b.counts,
  removed,
  added,
  changed,
  moved,
}, null, 2));
