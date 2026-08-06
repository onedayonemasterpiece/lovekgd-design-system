import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { resolve } from 'node:path';

const root = resolve(process.argv[2] || 'prototypes/penpot-review-plugin-002b');
const text = (path) => readFile(resolve(root, path), 'utf8');
const sha256 = (value) => createHash('sha256').update(value, 'utf8').digest('hex');
const gitBlobSha = (value) => createHash('sha1').update(`blob ${Buffer.byteLength(value, 'utf8')}\0`).update(value, 'utf8').digest('hex');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

async function compressed(path) {
  const encoded = (await text(path)).trim();
  return JSON.parse(gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8'));
}

async function compressedParts(paths) {
  const encoded = (await Promise.all(paths.map(text))).map((part) => part.trim()).join('');
  return JSON.parse(gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8'));
}

function validateCatalog(catalog, wave) {
  assert(catalog.schemaVersion === 3, `${wave}:schema`);
  assert(catalog.catalogRevision === `002b-load-${wave.toLowerCase()}`, `${wave}:revision`);
  assert(catalog.repository === 'onedayonemasterpiece/lovekgd-design-system', `${wave}:repository`);
  assert(catalog.mirror?.namespace === 'lovekgd.mirror.002b', `${wave}:namespace`);
  assert(catalog.elements.length === 57, `${wave}:expected_57`);
  const ids = new Set();
  const counts = { 'inline-svg': 0, 'git-svg': 0, 'git-image': 0 };
  for (const element of catalog.elements) {
    assert(!ids.has(element.id), `${wave}:duplicate:${element.id}`);
    ids.add(element.id);
    assert(Number.isFinite(element.board?.x) && Number.isFinite(element.board?.y), `${wave}:slot:${element.id}`);
    const artifact = element.artifact;
    assert(artifact && Object.hasOwn(counts, artifact.type), `${wave}:artifact:${element.id}`);
    counts[artifact.type] += 1;
    if (artifact.type === 'inline-svg') {
      const actual = sha256(artifact.svg);
      assert(actual === artifact.sha256, `${wave}:inline_sha:${element.id}`);
      assert(element.contentHash === `sha256:${actual}`, `${wave}:content_hash:${element.id}`);
      assert(artifact.svg.includes('NOT APPROVED DESIGN'), `${wave}:fixture_label:${element.id}`);
    } else {
      assert(/^[0-9a-f]{40}$/u.test(artifact.gitBlobSha), `${wave}:git_blob:${element.id}`);
      assert(artifact.url.includes('c6a679dbbb3bbd65eb096becbd5976e7ccd67a26'), `${wave}:immutable_asset:${element.id}`);
      assert(element.sourceRevision === 'c6a679dbbb3bbd65eb096becbd5976e7ccd67a26', `${wave}:source_revision:${element.id}`);
      if (artifact.type === 'git-image') {
        assert(artifact.mimeType.startsWith('image/'), `${wave}:mime:${element.id}`);
        assert(sha256(artifact.frameSvg) === artifact.frameSha256, `${wave}:frame_sha:${element.id}`);
      }
    }
  }
  const expected = wave === 'A'
    ? { 'inline-svg': 36, 'git-svg': 11, 'git-image': 10 }
    : { 'inline-svg': 38, 'git-svg': 10, 'git-image': 9 };
  assert(JSON.stringify(counts) === JSON.stringify(expected), `${wave}:counts:${JSON.stringify(counts)}`);
  return { ids, counts };
}

const waveBParts = [
  'catalog/wave-b/000.b64',
  'catalog/wave-b/001.b64',
  'catalog/wave-b/002.b64',
  'catalog/wave-b/003.b64',
];

const [aCatalog, bCatalog, plugin, ui, manifest, ...partTexts] = await Promise.all([
  compressed('catalog/catalog.json.gz.b64'),
  compressedParts(waveBParts),
  text('dist/plugin-current.js'),
  text('dist/ui.html'),
  text('dist/manifest.json').then(JSON.parse),
  ...waveBParts.map(text),
]);

const expectedPartBlobs = [
  'e7637c960d0391f5a3a69ab3f89a0816215f2c53',
  '7e1bb78bc0fd4a31a1d7cf5e04c05e348a8b91c1',
  '66c6f78d06d2d421bf0021ae913e86aba91dad3f',
  '01582ab117c7153297a7567b879b5a34d157d6c4',
];
partTexts.forEach((part, index) => {
  assert(gitBlobSha(part) === expectedPartBlobs[index], `wave_b_part_blob:${index}`);
});

const a = validateCatalog(aCatalog, 'A');
const b = validateCatalog(bCatalog, 'B');
const removed = [...a.ids].filter((id) => !b.ids.has(id));
const added = [...b.ids].filter((id) => !a.ids.has(id));
assert(removed.length === 3, `removed:${removed.length}`);
assert(added.length === 3, `added:${added.length}`);

const mapA = new Map(aCatalog.elements.map((element) => [element.id, element]));
const mapB = new Map(bCatalog.elements.map((element) => [element.id, element]));
let changed = 0;
let moved = 0;
for (const id of [...a.ids].filter((value) => b.ids.has(value))) {
  const left = mapA.get(id);
  const right = mapB.get(id);
  if (left.contentHash !== right.contentHash) changed += 1;
  if (left.board.x !== right.board.x || left.board.y !== right.board.y || left.board.width !== right.board.width || left.board.height !== right.board.height) moved += 1;
}
assert(changed >= 10, `changed:${changed}`);
assert(moved >= 20, `moved:${moved}`);

for (const marker of ['archive-replace', 'archive-remove', 'staging_failed', 'commit_rolled_back', 'uploadMediaData', "lane: 'review'", 'verify(catalog)']) {
  assert(plugin.includes(marker), `plugin_marker:${marker}`);
}
assert(plugin.includes("const UI_SHA = 'e58fa1529a7ef3676d4f2d8c34145e39d4f52c28'"), 'immutable_ui_sha');
assert(!plugin.includes('PENPOT_INTEGRATION_TOKEN'), 'no_pat');
assert(!plugin.toLowerCase().includes('supabase'), 'no_supabase_runtime');

for (const marker of ["CATALOG_BRANCH = 'penpot-mirror-live'", 'catalog.json.gz.b64', 'DecompressionStream', 'gitBlobSha', 'CURRENT', 'STALE', 'SYNC FAILED']) {
  assert(ui.includes(marker), `ui_marker:${marker}`);
}
assert(manifest.code === 'plugin-current.js', 'manifest_runtime');
assert(JSON.stringify(manifest.permissions) === JSON.stringify(['content:read', 'content:write', 'comment:read']), 'permissions');

console.log(JSON.stringify({
  ok: true,
  waveA: a.counts,
  waveB: b.counts,
  waveBPartBlobs: expectedPartBlobs,
  removed,
  added,
  changed,
  moved,
}, null, 2));
