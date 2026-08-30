import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { materializeEventCardUnifiedGoldenV2 } = require('../scripts/round-trip-reconstruction/penpot-materialize-event-card-unified-golden-v2.js');
const root = path.resolve(import.meta.dirname, '..');

test('generation-4 EventCard candidate requires a validated target and never writes without it', async () => {
  const input = path.join(os.tmpdir(), `w2-empty-event-${process.pid}.json`);
  fs.writeFileSync(input, '{}\n');
  let writes = 0;
  const receipt = await materializeEventCardUnifiedGoldenV2({
    root,
    mode: 'production',
    targetManifestPath: input,
    controlPath: input,
    reuseMapPath: input,
    adapter: { lookup: async () => null, write: async () => { writes += 1; } },
  });
  assert.equal(receipt.preflight.code, 'BUNDLE_CONTROL_MISMATCH');
  assert.equal(writes, 0);
});
