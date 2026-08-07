import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog/catalog.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'dist/manifest.json'), 'utf8'));
const plugin = fs.readFileSync(path.join(root, 'dist/plugin.js'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'dist/ui.html'), 'utf8');

if (catalog.schemaVersion !== 1 || catalog.catalogKind !== 'lovekgd-product-atlas') throw new Error('catalog identity invalid');
if (catalog.pages.length !== 9) throw new Error('page count invalid');
if (!Array.isArray(catalog.elements) || catalog.elements.length < 10) throw new Error('element count invalid');
const ids = new Set();
const pageIds = new Set(catalog.pages.map((value) => value.id));
for (const element of catalog.elements) {
  if (!element.id || ids.has(element.id)) throw new Error(`duplicate/missing element ${element.id}`);
  ids.add(element.id);
  if (!pageIds.has(element.pageId)) throw new Error(`unknown page ${element.id}`);
  if (![element.slot?.x, element.slot?.y, element.slot?.width, element.slot?.height].every(Number.isFinite)) throw new Error(`invalid slot ${element.id}`);
}
if (manifest.permissions.includes('library:write')) throw new Error('Product Atlas must not write design-system libraries');
if (!manifest.permissions.includes('comment:read')) throw new Error('comment read permission missing');
if (!plugin.includes("const NS = 'lovekgd.productatlas.001'")) throw new Error('Product Atlas namespace missing');
if (!plugin.includes("const RESOURCE_GRAPH_NS = 'lovekgd.resourcegraph.004a'")) throw new Error('wrong-file guard missing');
if (!plugin.includes('wrong_file_kind:design-system')) throw new Error('wrong-file failure semantics missing');
if (!plugin.includes('Системный продуктовый review')) throw new Error('systemic prompt contract missing');
if (plugin.includes('library.local.createColor') || plugin.includes('library.local.createTypography')) throw new Error('design-system mutation leaked into Product Atlas');
new vm.Script(plugin, { filename: 'plugin.js' });
if (!ui.includes('Обновить Product Atlas') || !ui.includes('Собрать системный промпт')) throw new Error('UI actions missing');
console.log(JSON.stringify({ pages: catalog.pages.length, elements: catalog.elements.length, permissions: manifest.permissions, result: 'PASS' }, null, 2));
