import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.argv[2] || 'prototypes/penpot-as-is-runtime-0031');
const read = (path) => readFile(resolve(root, path), 'utf8');
const [plugin, ui, manifest] = await Promise.all([
  read('dist/plugin.js.template'),
  read('dist/ui.html'),
  read('dist/manifest.json').then(JSON.parse),
]);
const fail = (condition, message) => { if (!condition) throw new Error(message); };

for (const marker of [
  "const UI_SHA = '__UI_SHA__'",
  "const NS = 'lovekgd.runtime.003'",
  'MAX_UPLOAD_ATTEMPTS = 3',
  'reportDiagnostic',
  "phase: 'staging-upload'",
  'media_upload_failed',
  'transportHash',
  'findCommentThreads',
  'archive-replace',
  'buildPrompt',
]) fail(plugin.includes(marker), `plugin_marker:${marker}`);
fail(!/\bfetch\s*\(/u.test(plugin), 'network_fetch_forbidden_in_main_plugin_context');

for (const marker of [
  "CATALOG_BRANCH = 'penpot-as-is-live'",
  'MAX_TRANSPORT_DIMENSION = 7600',
  'MAX_TRANSPORT_PIXELS = 24_000_000',
  'createImageBitmap',
  "canvas.toBlob",
  "'image/webp'",
  'diagnostic-card',
  'copy-diagnostic',
  'crypto.subtle.digest',
  'CHECKING',
  'CURRENT',
  'STALE',
  'SYNC FAILED',
]) fail(ui.includes(marker), `ui_marker:${marker}`);

fail(manifest.version === 2, 'manifest_version');
fail(manifest.code === 'plugin.js', 'manifest_code');
fail(manifest.icon === 'icon.svg', 'manifest_icon');
fail(JSON.stringify(manifest.permissions) === JSON.stringify(['content:read', 'content:write', 'comment:read']), 'permissions');
console.log(JSON.stringify({ status: 'PASS', prototype: '003.1', diagnostics: true, safeMedia: true }));
