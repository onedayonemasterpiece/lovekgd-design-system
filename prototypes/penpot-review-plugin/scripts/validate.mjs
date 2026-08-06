import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = (path) => readFile(resolve(root, path), 'utf8');
const manifest = JSON.parse(await read('data/review-manifest.json'));
const pluginManifest = JSON.parse(await read('dist/manifest.json'));
const plugin = await read('dist/plugin.js');
const ui = await read('dist/ui.html');
const svg = await read('data/core.button.smoke.svg');

const fail = (message) => { throw new Error(message); };
if (manifest.schemaVersion !== 1) fail('schemaVersion');
if (manifest.elements?.length !== 1) fail('one smoke element required');
const element = manifest.elements[0];
if (!svg.includes(element.id)) fail('svg must contain element id');
const revisionMatch = plugin.match(/const DATA_REVISION = '([^']+)'/u);
if (!revisionMatch || (revisionMatch[1] !== '__DATA_REVISION__' && !/^[0-9a-f]{40}$/u.test(revisionMatch[1]))) {
  fail('plugin data revision must be placeholder or exact commit SHA');
}
for (const token of ['{{repository}}', '{{elementId}}', '{{sourceUrl}}', '{{sourceRevision}}', '{{elementVersion}}', '{{state}}', '{{comments}}']) {
  if (!manifest.prompt.template.includes(token)) fail(`prompt token missing: ${token}`);
}
for (const permission of ['content:read', 'content:write', 'comment:read']) {
  if (!pluginManifest.permissions.includes(permission)) fail(`permission missing: ${permission}`);
}
for (const id of ['import', 'refresh', 'prompt', 'copy']) {
  if (!ui.includes(`id="${id}"`)) fail(`ui control missing: ${id}`);
}
console.log(JSON.stringify({ status: 'PASS', elementId: element.id, sourcePath: element.sourcePath }));
