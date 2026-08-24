import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { validateSotHandoff } from '../.codex/skills/penpot-visual-reconstruction/scripts/validate-sot-handoff.mjs';
import { validatePenpotUiOnly } from '../.codex/skills/penpot-visual-reconstruction/scripts/validate-penpot-ui-only.mjs';
import { validateVisualReadiness } from '../.codex/skills/penpot-visual-reconstruction/scripts/validate-visual-readiness.mjs';
import { modeFor, validateAssemblyCertificationBoundary } from '../.codex/skills/penpot-visual-reconstruction/scripts/validate-assembly-certification-boundary.mjs';

const repo = resolve(import.meta.dirname, '..');
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

function realProjection(id = 'archetype') {
  return {
    id, width: 390, height: 844, nativeComposition: true,
    materialRegions: ['header', 'content', 'listing', 'navigation'],
    linkedInstances: ['Header/mobile', 'EventCard/large', 'SocialProof/Like'],
    detachedCopies: 0, terminalVisualOverrides: 0,
  };
}

test('17 correctly sized state-index/metadata boards fail visual readiness', () => {
  const projections = Array.from({ length: 17 }, (_, index) => ({
    id: `63.${String(index + 1).padStart(2, '0')}/desktop`,
    width: 1280, height: 900, stateIndex: true, metadataOnly: true,
    textOnly: true, nativeComposition: false, materialRegions: [], linkedInstances: [],
  }));
  const errors = validateVisualReadiness({ projections });
  assert(errors.length >= 17);
  assert(errors.some((error) => error.includes('state-index')));
});

test('ordinary certified Like/EventCard/rail reuse remains ASSEMBLY', () => {
  const operations = ['Like', 'EventCard', 'rail'].map((id) => ({ id, trigger: 'linked-reuse', mode: 'ASSEMBLY', certificationPackages: 0 }));
  assert.deepEqual(operations.map(modeFor), ['ASSEMBLY', 'ASSEMBLY', 'ASSEMBLY']);
  assert.deepEqual(validateAssemblyCertificationBoundary({ operations, ownerDefects: [] }), []);
});

test('Like owner defect creates one lowest-owner fix and one dependency closure', () => {
  const plan = {
    operations: [{ id: 'Like', trigger: 'owner-defect', mode: 'CERTIFICATION', certificationPackages: 1 }],
    ownerDefects: [{ id: 'like-count-drift', lowestOwner: 'Social proof / Like', ownerFixCount: 1, dependencyClosureCount: 1, parentProofPackages: 0 }],
  };
  assert.deepEqual(validateAssemblyCertificationBoundary(plan), []);
  const duplicated = structuredClone(plan); duplicated.ownerDefects[0].parentProofPackages = 3;
  assert(validateAssemblyCertificationBoundary(duplicated).some((error) => error.includes('parent consumers')));
});

test('service-only Penpot review dashboard fails UI-only validation', () => {
  const errors = validatePenpotUiOnly({ objects: [{ kind: 'board', name: 'Coverage status dashboard', purpose: 'review index', serviceOnly: true }] });
  assert(errors.length > 0);
});

test('native visual archetype with material regions and linked instances passes', () => {
  assert.deepEqual(validateVisualReadiness(realProjection()), []);
  assert.deepEqual(validatePenpotUiOnly({ objects: [{ kind: 'board', name: 'Festivals / mobile', purpose: 'product composition', library: 'Product', resourceClass: 'ui' }] }), []);
});

test('full screenshot used instead of native composition fails', () => {
  const projection = realProjection('screenshot-proxy');
  projection.screenshotOnly = true;
  projection.nativeComposition = false;
  projection.linkedInstances = [];
  const errors = validateVisualReadiness(projection);
  assert(errors.some((error) => error.includes('screenshot proxy')));
  assert(errors.some((error) => error.includes('linked component ancestry')));
});

test('SoT handoff validates hashes, reachable SHAs, lineage, coverage, and explicit gaps', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sot-handoff-'));
  const manifestPath = join(dir, 'manifest.json');
  writeFileSync(manifestPath, '{"status":"ready"}\n');
  const sha = 'a'.repeat(40);
  const plan = {
    status: 'CURRENT_COMPLETE', stale: false, partial: false,
    manifest: { path: manifestPath, sha256: sha256(readFileSync(manifestPath)) },
    inputs: [{ name: 'design', repo, sha }, { name: 'astro', repo: '/tmp/astro', sha }],
    lineage: { repo, source_parent_sha: sha, current_head_sha: 'b'.repeat(40) },
    coverage: { required: ['listing-date', 'festivals'], covered: ['listing-date', 'festivals'], observed_unresolved_contracts: 1, declared_unresolved_contracts: 1 },
    gaps: { observed_unresolved: ['gap-1'], declared_unresolved: ['gap-1'] },
  };
  const io = { existsCommit: () => true, isAncestor: () => true };
  assert.deepEqual(validateSotHandoff(plan, io), []);
  const hidden = structuredClone(plan); hidden.gaps.declared_unresolved = [];
  assert(validateSotHandoff(hidden, io).some((error) => error.includes('gaps')));
  const stale = structuredClone(plan); stale.partial = true;
  assert(validateSotHandoff(stale, io).some((error) => error.includes('stale')));
});
