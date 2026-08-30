import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const repo = resolve(import.meta.dirname, '..');
const root = join(repo, 'catalog/fixtures/ui-reference-events/v2');
const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const sha = (value) => createHash('sha256').update(value).digest('hex');
const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  return value;
};
const canonicalSha = (value) => sha(`${JSON.stringify(stable(value))}\n`);
const schemaValidate = (instance, schema) => {
  const result = spawnSync('python3', ['-c', 'import json,jsonschema,sys; jsonschema.validate(json.load(open(sys.argv[1])),json.load(open(sys.argv[2])))', instance, schema], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
};

const corpus = read(join(root, 'corpus.json'));
const assets = read(join(root, 'assets-manifest.json'));
const projection = read(join(root, 'projections/free-collection-september.v1.json'));

test('v2 is an immutable diverse September corpus, not a homogeneous recent-poster list', () => {
  schemaValidate(join(root, 'corpus.json'), join(repo, 'contracts/ui-conformance/ui-reference-event-corpus.v2.schema.json'));
  schemaValidate(join(root, 'assets-manifest.json'), join(repo, 'contracts/ui-conformance/ui-reference-assets-manifest.v1.schema.json'));
  schemaValidate(join(root, 'surface-expectations.json'), join(repo, 'contracts/ui-conformance/ui-surface-expectations.v1.schema.json'));
  schemaValidate(join(root, 'projections/free-collection-september.v1.json'), join(repo, 'contracts/ui-conformance/ui-reference-event-projection.v1.schema.json'));

  assert.equal(corpus.immutable, true);
  assert.equal(corpus.purpose, 'cross-surface-event-card-visual-diagnostics');
  assert.deepEqual(corpus.reference_clock, {
    current_date: '2026-08-29',
    reference_iso: '2026-08-29T14:00:00+02:00',
    timezone: 'Europe/Kaliningrad',
  });
  assert.deepEqual(corpus.fixtures.map((row) => row.event_id), [2182, 6711, 7609, 8006, 8200, 7907, 6942, 7020]);
  assert.equal(corpus.source.repository_sha, '8710e56fa3685f6c30a90cd062d532dce0348cce');
  assert.equal(corpus.source.preview_export_sha256, '7e4ea8f4a6c6273e17d5531ca009b4dfaf184a2328f45832e41b308bfe170032');
  assert.deepEqual(corpus.source.snapshot, {
    kind: 'preview-export-catalog-revision',
    sha256: '6668f5a6f22f6c9a4e1f28af242e77bedb81eab1d06a37ba1227c8898133f409',
    scope: 'bounded-production-slice',
  });

  const hashInput = structuredClone(corpus); delete hashInput.corpus_sha256;
  assert.equal(canonicalSha(hashInput), corpus.corpus_sha256);
  const coverage = new Set(corpus.fixtures.flatMap((row) => row.coverage_tags));
  for (const tag of [
    'landscape-crop-safe', 'landscape-document', 'square-poster', 'portrait-poster',
    'four-five-poster', 'program-document', 'visual-only', 'ocr-protected',
    'single-image', 'multi-image', 'mixed-ocr-visual', 'admission-free', 'admission-price',
  ]) assert.ok(coverage.has(tag), `missing diagnostic coverage: ${tag}`);
});

test('every v2 fixture is a full exact PreviewEvent with verified media', () => {
  for (const fixture of corpus.fixtures) {
    const path = join(root, fixture.payload_path);
    schemaValidate(path, join(repo, 'contracts/ui-conformance/ui-reference-event.v2.schema.json'));
    const wrapper = read(path);
    assert.equal(wrapper.preview_event.id, fixture.event_id);
    assert.equal(wrapper.preview_event.source_prod_id, fixture.source_prod_id);
    assert.ok(wrapper.preview_event.image_url, `${fixture.fixture_id} has normalized media`);
    assert.ok(wrapper.preview_event.image_assets.length > 0, `${fixture.fixture_id} has exact media assets`);
    const previewHash = spawnSync('python3', ['-c', 'import json,hashlib,sys; d=json.load(open(sys.argv[1]))["preview_event"]; print(hashlib.sha256((json.dumps(d,ensure_ascii=False,sort_keys=True,separators=(",",":"))+"\\n").encode()).hexdigest())', path], { encoding: 'utf8' });
    assert.equal(previewHash.status, 0, previewHash.stderr);
    assert.equal(previewHash.stdout.trim(), fixture.preview_event_sha256);
    const activeEnd = wrapper.preview_event.end_date || wrapper.preview_event.start_date;
    assert.ok(wrapper.preview_event.start_date <= '2026-09-30' && activeEnd >= '2026-09-01', `${fixture.fixture_id} is active in September`);
  }

  const manifestHashInput = structuredClone(assets); delete manifestHashInput.assets_manifest_sha256;
  assert.equal(canonicalSha(manifestHashInput), assets.assets_manifest_sha256);
  assert.equal(assets.assets.length, 16);
  for (const asset of assets.assets) {
    assert.match(asset.sha256, /^[a-f0-9]{64}$/u);
    assert.ok(asset.byte_length > 0 && asset.width > 0 && asset.height > 0);
    if (asset.storage_mode === 'git-content-addressed-bundle') {
      assert.equal(sha(readFileSync(join(root, asset.bundle_relpath))), asset.sha256);
    } else {
      assert.equal(asset.storage_mode, 'immutable-cdn');
      assert.equal(asset.cdn_path_content_key, asset.sha256);
    }
  }
});

test('the free collection is an exact factual subset with explicit diversity and exclusions', () => {
  assert.deepEqual(projection.fixture_input_order, [
    'event.real.2182', 'event.real.6711', 'event.real.7609', 'event.real.8006', 'event.real.8200',
  ]);
  assert.deepEqual(projection.expected_groups, {
    events: ['event.real.8006', 'event.real.8200'],
    exhibitions: ['event.real.2182', 'event.real.6711', 'event.real.7609'],
  });
  const byId = new Map(corpus.fixtures.map((fixture) => [fixture.fixture_id, read(join(root, fixture.payload_path)).preview_event]));
  for (const fixtureId of projection.fixture_input_order) {
    const event = byId.get(fixtureId);
    assert.ok(event, `${fixtureId} belongs to the same corpus`);
    assert.equal(event.ticket.is_free, true, `${fixtureId} is factually free`);
  }
  const selectedKeys = new Set(projection.fixture_input_order.flatMap((fixtureId) => byId.get(fixtureId).image_assets.map((asset) => asset.asset_key)));
  for (const exclusion of projection.explicit_exclusions) {
    for (const key of exclusion.asset_keys) assert.equal(selectedKeys.has(key), false, `excluded repeated poster ${key}`);
  }
  assert.ok(projection.coverage_requirements.includes('visual-only-and-ocr-protected'));
  assert.ok(projection.coverage_requirements.includes('single-and-multi-image'));
});

test('clean generation-4 base has no unrelated Golden Event Corpus v1 changes', () => {
  const result = spawnSync('git', ['diff', '--exit-code', 'b3567cb72d81a7aad4b47a68e220325f055697a2', '--', 'catalog/fixtures/ui-reference-events/v1'], { cwd: repo, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout || result.stderr);
});
