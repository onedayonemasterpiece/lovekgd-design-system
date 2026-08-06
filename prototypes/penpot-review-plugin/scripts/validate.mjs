import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = (path) => readFile(resolve(root, path), 'utf8');
const manifestText = await read('data/review-manifest.json');
const sourceManifest = JSON.parse(manifestText);
const pluginManifest = JSON.parse(await read('dist/manifest.json'));
const plugin = await read('dist/plugin.js');
const ui = await read('dist/ui.html');
const sourceSvg = await read('data/core.button.smoke.svg');

const digest = (value) => createHash('sha256').update(value, 'utf8').digest('hex');
const normalizeText = (value) => value.replaceAll('\r\n', '\n').replace(/\n*$/u, '\n');
const fail = (message) => { throw new Error(message); };

const manifestMatch = plugin.match(
  /\/\* GIT_MANIFEST_START \*\/\s*const GIT_MANIFEST = Object\.freeze\(\s*([\s\S]*?)\s*\);\s*\/\* GIT_MANIFEST_END \*\//u,
);
if (!manifestMatch) fail('embedded Git manifest block missing');
let embeddedManifest;
try {
  embeddedManifest = JSON.parse(manifestMatch[1]);
} catch (error) {
  fail(`embedded Git manifest is not JSON: ${error.message}`);
}
if (JSON.stringify(embeddedManifest) !== JSON.stringify(sourceManifest)) {
  fail(`embedded manifest differs from Git source: embedded=${digest(JSON.stringify(embeddedManifest))} source=${digest(JSON.stringify(sourceManifest))}`);
}

const svgMatch = plugin.match(
  /\/\* GIT_SVG_START \*\/\s*const GIT_SPECIMEN_SVG = String\.raw`([\s\S]*?)`;\s*\/\* GIT_SVG_END \*\//u,
);
if (!svgMatch) fail('embedded Git SVG block missing');
const embeddedSvg = normalizeText(svgMatch[1]);
const normalizedSourceSvg = normalizeText(sourceSvg);
if (embeddedSvg !== normalizedSourceSvg) {
  fail(`embedded SVG differs from Git source after line-ending normalization: embedded=${digest(embeddedSvg)} source=${digest(normalizedSourceSvg)}`);
}
if (/\bfetch\s*\(/u.test(plugin)) fail('runtime fetch is forbidden in prototype 001');

if (sourceManifest.schemaVersion !== 1) fail('schemaVersion');
if (sourceManifest.elements?.length !== 1) fail('one smoke element required');
const element = sourceManifest.elements[0];
if (!sourceSvg.includes(element.id)) fail('SVG must contain element id');

const uiRevisionMatch = plugin.match(/const UI_REVISION = '([^']+)'/u);
if (!uiRevisionMatch || !/^[0-9a-f]{40}$/u.test(uiRevisionMatch[1])) {
  fail('plugin UI revision must be exact commit SHA');
}

for (const token of ['{{repository}}', '{{elementId}}', '{{sourceUrl}}', '{{sourceRevision}}', '{{elementVersion}}', '{{state}}', '{{comments}}']) {
  if (!sourceManifest.prompt.template.includes(token)) fail(`prompt token missing: ${token}`);
}
for (const permission of ['content:read', 'content:write', 'comment:read']) {
  if (!pluginManifest.permissions.includes(permission)) fail(`permission missing: ${permission}`);
}
for (const id of ['import', 'refresh', 'prompt', 'copy']) {
  if (!ui.includes(`id="${id}"`)) fail(`UI control missing: ${id}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  elementId: element.id,
  sourcePath: element.sourcePath,
  transport: 'embedded-git-snapshot',
  manifestSha256: digest(manifestText),
  svgSha256: digest(normalizedSourceSvg),
}));
