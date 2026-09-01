'use strict';

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}
async function sha256Text(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), x => x.toString(16).padStart(2, '0')).join('');
}
async function setupFreeRowsDataR2(pkg, {penpot, storage}) {
  const clone = JSON.parse(JSON.stringify(pkg));
  const expected = clone.record_sha256;
  delete clone.record_sha256;
  if (await sha256Text(canonical(clone)) !== expected) throw new Error('PACKAGE_RECORD_MISMATCH');
  const r = pkg.run_control;
  const marker = {
    schema: r.schema,
    package_id: pkg.package_id,
    run_id: r.run_id,
    writer_id: r.writer_id,
    lease_token: r.lease_token,
    cancel_token: r.cancel_token,
    state: 'ACTIVE',
    cancelled: false,
  };
  penpot.currentFile.setSharedPluginData('kenigevents', 'asp-active-run-v1', JSON.stringify(marker));
  storage[pkg.storage.setup_receipt] = {
    schema: 'kenigevents.a0-free-rows-data-r2.setup-receipt.v1',
    package_id: pkg.package_id,
    record_sha256: pkg.record_sha256,
    executor_sha256: pkg.artifacts.executor.sha256,
    state: 'ACTIVE',
  };
  return {created: 0, marker};
}
if (typeof module !== 'undefined' && module.exports) module.exports = {setupFreeRowsDataR2};
