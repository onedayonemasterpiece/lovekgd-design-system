import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = path => readFile(resolve(root, path), 'utf8');
const pluginManifest = JSON.parse(await read('dist/manifest.json'));
const plugin = await read('dist/plugin.js');
const ui = await read('dist/ui.html');

const fail = message => { throw new Error(message); };

if (!plugin.includes("const UI_REVISION = 'a16ee60de6d8de7a824c0527a724171418deff4f'")) {
  fail('UI revision is not pinned to the reviewed Git commit');
}
if (/\bfetch\s*\(/u.test(plugin)) fail('network fetch is forbidden in the main Penpot plugin context');
if (!ui.includes('penpot-catalog-live/prototypes/penpot-review-plugin-002a/catalog/catalog.json')) {
  fail('live catalog URL missing from UI');
}
if (!ui.includes("crypto.subtle.digest('SHA-256'")) fail('UI must verify artifact SHA-256');
if (!ui.includes("send('inspect-catalog'")) fail('UI catalog inspection message missing');
if (!ui.includes("send('apply-catalog'")) fail('UI catalog apply message missing');
for (const functionName of ['inspectCatalog', 'createRevisionBoard', 'commentCountForBoard', 'buildPrompt']) {
  if (!plugin.includes(`function ${functionName}`) && !plugin.includes(`async function ${functionName}`)) {
    fail(`plugin function missing: ${functionName}`);
  }
}
for (const permission of ['content:read', 'content:write', 'comment:read']) {
  if (!pluginManifest.permissions.includes(permission)) fail(`permission missing: ${permission}`);
}
for (const id of ['check', 'apply', 'prompt', 'prompt-text', 'copy']) {
  if (!ui.includes(`id="${id}"`)) fail(`UI control missing: ${id}`);
}
if (!plugin.includes("action: exact ? 'noop' : current ? 'create-revision' : 'create'")) {
  fail('revision-safe action contract missing');
}
if (!plugin.includes("revisionStatus: 'superseded'")) fail('superseded revision metadata missing');
if (!plugin.includes("revisionStatus: 'current'")) fail('current revision metadata missing');

console.log(JSON.stringify({
  status: 'PASS',
  prototype: '002A',
  transport: 'UI fetch + SHA-256 + Plugin API revision boards',
}));
