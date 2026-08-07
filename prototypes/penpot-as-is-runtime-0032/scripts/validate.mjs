import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.argv[2] || 'prototypes/penpot-as-is-runtime-0032');
const read = (path) => readFile(resolve(root, path), 'utf8');
const fail = (condition, message) => { if (!condition) throw new Error(message); };

const [template, ui, manifest] = await Promise.all([
  read('dist/plugin.js.template'),
  read('dist/ui.html'),
  read('dist/manifest.json').then(JSON.parse),
]);

for (const marker of [
  "const NS = 'lovekgd.runtime.003'",
  "const CHECKPOINT_KEY = 'lovekgd.runtime.0032.checkpoint'",
  'safeOpenPage',
  'PAGE_SETTLE_MS = 550',
  'MUTATION_BATCH_SIZE = 4',
  'penpot.history.undoBlockBegin',
  'cleanupInterruptedStaging',
  "phase: 'media-upload'",
  "phase: 'staging-shape'",
  'groupItemsByPage',
  "lane: 'trash'",
  'syncRunId',
  "message?.type === 'plugin-ready'",
  "type: 'recovery-state'",
  'findCommentThreads',
  'buildPrompt',
]) fail(template.includes(marker), `plugin_marker:${marker}`);

for (const marker of [
  'Host-safe sync',
  "CATALOG_BRANCH = 'penpot-as-is-live'",
  'crypto.subtle.digest',
  'createImageBitmap',
  'MAX_TRANSPORT_DIMENSION = 7600',
  'Незавершённая предыдущая операция',
  "send('plugin-ready')",
  "message.type === 'recovery-state'",
  'Interrupted staging',
  'Media upload',
  'CURRENT',
  'STALE',
  'SYNC FAILED',
]) fail(ui.includes(marker), `ui_marker:${marker}`);

fail(manifest.version === 2, 'manifest_version');
fail(manifest.code === 'plugin.js', 'manifest_code');
fail(manifest.icon === 'icon.svg', 'manifest_icon');
fail(manifest.name.includes('003.2'), 'manifest_name');
fail(
  JSON.stringify(manifest.permissions) === JSON.stringify(['content:read', 'content:write', 'comment:read']),
  'permissions',
);

const script = ui.split('<script>', 2)[1]?.split('</script>', 1)[0];
fail(script, 'inline_ui_script');
await writeFile('/tmp/penpot0032-ui.js', script, 'utf8');

console.log(JSON.stringify({
  ok: true,
  pluginLines: template.split('\n').length,
  uiLines: ui.split('\n').length,
  permissions: manifest.permissions,
}, null, 2));
