import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = (path) => readFile(resolve(root, path), 'utf8');
const manifestText = await read('data/review-manifest.json');
const manifest = JSON.parse(manifestText);
const pluginManifest = JSON.parse(await read('dist/manifest.json'));
const plugin = await read('dist/plugin.js');
const ui = await read('dist/ui.html');
const svg = await read('data/core.button.smoke.svg');

const digest = (value) => createHash('sha256').update(value, 'utf8').digest('hex');
const firstDifference = (left, right) => {
  const length = Math.min(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    if (left[index] !== right[index]) {
      return {
        index,
        leftCodePoint: left.codePointAt(index),
        rightCodePoint: right.codePointAt(index),
      };
    }
  }
  return left.length === right.length ? null : { index: length, leftLength: left.length, rightLength: right.length };
};
const fail = (message) => { throw new Error(message); };
const embedded = (name) => {
  const match = plugin.match(new RegExp(`const ${name} = '([A-Za-z0-9+/=]+)'`, 'u'));
  if (!match) fail(`${name} missing`);
  return Buffer.from(match[1], 'base64').toString('utf8');
};

if (manifest.schemaVersion !== 1) fail('schemaVersion');
if (manifest.elements?.length !== 1) fail('one smoke element required');
const element = manifest.elements[0];
if (!svg.includes(element.id)) fail('svg must contain element id');

const embeddedManifest = embedded('EMBEDDED_MANIFEST_BASE64');
const embeddedSvg = embedded('EMBEDDED_SVG_BASE64');
if (embeddedManifest !== manifestText) {
  fail(`embedded manifest differs from Git source: embedded=${digest(embeddedManifest)} source=${digest(manifestText)} diff=${JSON.stringify(firstDifference(embeddedManifest, manifestText))}`);
}
if (embeddedSvg !== svg) {
  fail(`embedded SVG differs from Git source: embedded=${digest(embeddedSvg)} source=${digest(svg)} diff=${JSON.stringify(firstDifference(embeddedSvg, svg))}`);
}
if (/\bfetch\s*\(/u.test(plugin)) fail('runtime fetch is forbidden in prototype 001b');

const uiRevisionMatch = plugin.match(/const UI_REVISION = '([^']+)'/u);
if (!uiRevisionMatch || !/^[0-9a-f]{40}$/u.test(uiRevisionMatch[1])) {
  fail('plugin UI revision must be exact commit SHA');
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
console.log(JSON.stringify({
  status: 'PASS',
  elementId: element.id,
  sourcePath: element.sourcePath,
  transport: 'embedded-byte-exact-git-snapshot',
  manifestSha256: digest(manifestText),
  svgSha256: digest(svg),
}));
