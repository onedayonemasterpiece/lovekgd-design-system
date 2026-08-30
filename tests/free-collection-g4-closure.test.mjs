import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';
import { projectResolvedCase } from '../scripts/ui_conformance/project-free-collection-resolved-case.mjs';

const require = createRequire(import.meta.url);
const { loadResolvedCaseIndex } = require('../scripts/round-trip-reconstruction/resolved-case-loader.js');
const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p));
const json = (p) => JSON.parse(read(p));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const indexPath = 'catalog/ui-conformance/free-collection/g4/resolved/resolved-cases.index.json';
const indexFileHash = sha256(read(indexPath));
const sealHash = (p) => {
  const source = read(p).toString('utf8');
  const match = source.match(/integrity:\n  normalization: lf-utf8-replace-integrity-sha256-with-64-zeroes\n  sha256: ([a-f0-9]{64})/u);
  assert.ok(match, `${p}:integrity`);
  return { declared: match[1], calculated: sha256(source.replace(match[1], '0'.repeat(64))) };
};
const assets = [
  ['icon.action.share','catalog/ui-assets/v1/icons/action-share.svg','c6c3f3d20c744c66c0257e534c90a1742fb651c1','99103f01c0cbd48d87ff639dc3e6c6291a7f8c2aa147c854667d1a8f7a677cf9'],
  ['icon.action.favorite','catalog/ui-assets/v1/icons/action-favorite-outline.svg','7b7a3b5c1875cc0f1c4197862bf665364e7b6eb1','e5654867ef9431714cfc53a1890fb14fcaa52c64579388f5364a0fa01ce6ea58'],
  ['icon.action.not_interested','catalog/ui-assets/v1/icons/action-not-interested.svg','4c405436eae520e326e979c165ff92856750a7cc','d8d94023de0e563663c71a628657e3e4402ed5cb36fa836f784071e83edc8ae6'],
  ['icon.action.calendar_add','catalog/ui-assets/v1/icons/action-calendar-add.svg','67b66c0cea4b9b7126548122760895e7e5d669bc','f5465db33659eb80685704961006aa1d5f970f337dd6b330d8056c3326360633'],
];

test('registry and profile self hashes seal exact LF/UTF-8 content', () => {
  for (const p of ['contracts/assets/ui-asset-registry.v1.yaml','contracts/page-profiles/free-collection.owner-review.v1.yaml']) {
    const result = sealHash(p); assert.equal(result.declared, result.calculated, p);
  }
});
test('four canonical action bindings resolve exact copied blobs and raw bytes', () => {
  const registry = read('contracts/assets/ui-asset-registry.v1.yaml').toString('utf8');
  for (const [id,p,blob,raw] of assets) {
    assert.equal(sha256(read(p)), raw, `${id}:raw`);
    assert.equal(execFileSync('git',['hash-object',p],{cwd:root,encoding:'utf8'}).trim(),blob,`${id}:blob`);
    for (const token of [id,p,blob,raw,'RESOLVED_EXACT']) assert.ok(registry.includes(token), `${id}:${token}`);
  }
  assert.doesNotMatch(registry, /UNRESOLVED_BLOCKING/u);
});
test('bundles are Git-ready while Penpot runtime prerequisites remain fail-closed', () => {
  for (const p of ['catalog/materialization-bundles/eventcard-free-slice.g4.ready-v1.json','catalog/materialization-bundles/free-collection-page.g4.ready-v1.json']) {
    const bundle=json(p); assert.equal(bundle.control_generation,4); assert.equal(bundle.promotion_state,'READY_FOR_W0_PROMOTION');
    assert.equal(bundle.non_promotable_reasons,undefined); assert.ok(bundle.execution_time_prerequisites.length >= 6);
    assert.equal(bundle.source_bindings.find(x=>x.role==='resolved_case_index').sha256,indexFileHash);
  }
});
test('projection and materializer loader consume one byte-identical resolved payload', () => {
  const caseId='eventcard.desktop-wide-calendar.8006';
  const loaded=loadResolvedCaseIndex(root,indexPath,indexFileHash,[caseId]);
  const projected=projectResolvedCase({root,indexPath,indexFileSha256:indexFileHash,caseId});
  assert.equal(projected.resolved_case_content_sha256,loaded.cases[caseId].content_sha256);
  assert.deepEqual(projected.payload,loaded.cases[caseId].payload);
});
test('g4 sources contain no embedded duplicate visual authority or stale coverage mode', () => {
  const files=['scripts/round-trip-reconstruction/materialization-execution-kernel.js','scripts/round-trip-reconstruction/penpot-materialize-event-card-unified-golden-v2.js','scripts/round-trip-reconstruction/penpot-materialize-free-collection-september-v2.js','scripts/ui_conformance/project-free-collection-resolved-case.mjs'];
  for (const p of files) assert.doesNotMatch(read(p).toString('utf8'),/const\s+(EVENTS|GEOMETRY)|static\.kenigevents\.ru\/|COVERED_BY_PAGE/u,p);
  assert.doesNotMatch(read('catalog/ui-conformance/free-collection/g4/evidence-plan.json').toString('utf8'),/COVERED_BY_PAGE/u);
});
test('audit preserves owner rejection and separates static readiness from execution gates', () => {
  const profile=read('contracts/page-profiles/free-collection.owner-review.v1.yaml').toString('utf8');
  for (const token of ['BLOCKED_OWNER_REJECTED','READY_FOR_W0_PROMOTION','owner_acceptance_present: false','allowed_to_mutate_penpot: false']) assert.ok(profile.includes(token),token);
  const audit=json('catalog/ui-conformance/free-collection/g4/audit/bundle-readiness-prerequisite-separation.json');
  assert.deepEqual(audit.static_non_promotable_reasons,[]); assert.equal(audit.penpot_mutation_performed,false);
});
