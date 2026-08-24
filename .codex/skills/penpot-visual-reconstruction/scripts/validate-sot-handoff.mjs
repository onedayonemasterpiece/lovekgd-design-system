#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const gitOk = (repo, args) => spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).status === 0;

export function validateSotHandoff(plan, io = {}) {
  const errors = [];
  const read = io.readFile ?? ((path) => readFileSync(path));
  const existsCommit = io.existsCommit ?? ((repo, sha) => gitOk(repo, ['cat-file', '-e', `${sha}^{commit}`]));
  const isAncestor = io.isAncestor ?? ((repo, ancestor, head) => gitOk(repo, ['merge-base', '--is-ancestor', ancestor, head]));
  if (!plan || plan.status !== 'CURRENT_COMPLETE') errors.push('handoff status must be CURRENT_COMPLETE');
  if (plan?.stale || plan?.partial || /pending/i.test(plan?.status ?? '')) errors.push('stale, partial, or pending handoff');
  if (!plan?.manifest?.path || !/^[a-f0-9]{64}$/u.test(plan?.manifest?.sha256 ?? '')) errors.push('exact manifest path/hash required');
  else {
    try {
      const actual = sha256(read(resolve(plan.manifest.path)));
      if (actual !== plan.manifest.sha256) errors.push(`manifest hash mismatch: ${actual}`);
    } catch (error) { errors.push(`manifest unreadable: ${error.message}`); }
  }
  for (const input of plan?.inputs ?? []) {
    if (!input.repo || !/^[a-f0-9]{40}$/u.test(input.sha ?? '') || !existsCommit(input.repo, input.sha)) errors.push(`input SHA unreachable: ${input.name ?? input.sha ?? 'unknown'}`);
  }
  if (!plan?.lineage?.repo || !/^[a-f0-9]{40}$/u.test(plan?.lineage?.source_parent_sha ?? '') || !/^[a-f0-9]{40}$/u.test(plan?.lineage?.current_head_sha ?? '') || !isAncestor(plan.lineage.repo, plan.lineage.source_parent_sha, plan.lineage.current_head_sha)) errors.push('handoff source parent is not in current branch lineage');
  const required = new Set(plan?.coverage?.required ?? []);
  const covered = new Set(plan?.coverage?.covered ?? []);
  for (const id of required) if (!covered.has(id)) errors.push(`route/archetype coverage missing: ${id}`);
  if (required.size === 0) errors.push('route/archetype coverage must be declared');
  if (!Number.isInteger(plan?.coverage?.observed_unresolved_contracts) || plan.coverage.observed_unresolved_contracts !== plan.coverage.declared_unresolved_contracts) errors.push('unresolved contract count is hidden or stale');
  const observed = [...new Set(plan?.gaps?.observed_unresolved ?? [])].sort();
  const declared = [...new Set(plan?.gaps?.declared_unresolved ?? [])].sort();
  if (JSON.stringify(observed) !== JSON.stringify(declared)) errors.push('unresolved gaps are hidden or stale');
  return errors;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const plan = JSON.parse(readFileSync(process.argv[2], 'utf8'));
  const errors = validateSotHandoff(plan);
  console.log(JSON.stringify({ validator: 'validate-sot-handoff', status: errors.length ? 'FAIL' : 'PASS', errors }, null, 2));
  process.exitCode = errors.length ? 1 : 0;
}
