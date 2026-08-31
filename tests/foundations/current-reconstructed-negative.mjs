#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateFoundations } from '../../scripts/foundations/validate-current-reconstructed.mjs';

const root = path.resolve(new URL('../..', import.meta.url).pathname);
assert.equal(validateFoundations(root).status, 'PASS');
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'foundations-v1-'));
try {
  for (const directory of ['contracts/foundations', 'catalog/foundations/current-reconstructed']) fs.cpSync(path.join(root, directory), path.join(fixture, directory), { recursive: true });
  const contractPath = path.join(fixture, 'contracts/foundations/current-reconstructed.v1.json');
  const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
  contract.visual_delta_allowed = true;
  fs.writeFileSync(contractPath, `${JSON.stringify(contract, null, 2)}\n`);
  assert.throws(() => validateFoundations(fixture), (error) => error.code === 'FND_NO_OP');
  contract.visual_delta_allowed = false;
  fs.writeFileSync(contractPath, `${JSON.stringify(contract, null, 2)}\n`);
  const iconsPath = path.join(fixture, 'catalog/foundations/current-reconstructed/iconography-registry.v2.json');
  const icons = JSON.parse(fs.readFileSync(iconsPath, 'utf8'));
  icons.penpot.status = 'MATERIALIZED';
  fs.writeFileSync(iconsPath, `${JSON.stringify(icons, null, 2)}\n`);
  assert.throws(() => validateFoundations(fixture), (error) => error.code === 'FND_ICONS');
  console.log(JSON.stringify({ status: 'PASS', negative_cases: ['visual-delta', 'penpot-escape'] }));
} finally { fs.rmSync(fixture, { recursive: true, force: true }); }
