#!/usr/bin/env node
import { createHash } from 'node:crypto';
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
  mkdirSync,
} from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { execFileSync } from 'node:child_process';

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  const key = process.argv[index];
  const value = process.argv[index + 1];
  if (!key?.startsWith('--') || !value) throw new Error(`invalid_argument_pair:${key || ''}`);
  args.set(key, value);
}

const productRoot = resolve(args.get('--product-dir') || '.source/events-bot-new');
const outputPath = resolve(args.get('--out') || 'prototypes/penpot-resource-graph-004a/catalog/catalog.json');
const productSha = String(args.get('--product-sha') || execFileSync('git', ['-C', productRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' })).trim();
const generatedAt = new Date().toISOString();

if (!/^[0-9a-f]{40}$/u.test(productSha)) throw new Error(`invalid_product_sha:${productSha}`);

const siteRoot = join(productRoot, 'site');
const readText = (path) => readFileSync(path, 'utf8');
const normalizePath = (path) => path.split(sep).join('/');
const repoPath = (path) => normalizePath(relative(productRoot, path));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const stableJson = (value) => JSON.stringify(value, Object.keys(value).sort());

function walkFiles(root, predicate = () => true) {
  if (!existsSync(root)) return [];
  const output = [];
  const visit = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (entry.isFile() && predicate(path)) output.push(path);
    }
  };
  visit(root);
  return output.sort((left, right) => left.localeCompare(right));
}

function stripCommentsAndNormalizeSvg(svg) {
  let value = String(svg)
    .replace(/^\uFEFF/u, '')
    .replace(/<\?xml[\s\S]*?\?>/giu, '')
    .replace(/<!DOCTYPE[\s\S]*?>/giu, '')
    .replace(/<!--([\s\S]*?)-->/gu, '')
    .replace(/\s+xmlns:xlink=("[^"]*"|'[^']*')/gu, '')
    .replace(/\s+xml:space=("[^"]*"|'[^']*')/gu, '')
    .replace(/\r\n?/gu, '\n')
    .trim();
  if (!/^<svg\b/iu.test(value)) throw new Error('svg_root_missing');
  value = value.replace(/>\s+</gu, '><');
  return value;
}

function scanBalancedParentheses(source, start) {
  let depth = 1;
  let mode = 'code';
  let quote = '';
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (mode === 'string') {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) mode = 'code';
      continue;
    }
    if (mode === 'line-comment') {
      if (char === '\n') mode = 'code';
      continue;
    }
    if (mode === 'block-comment') {
      if (char === '*' && next === '/') { mode = 'code'; index += 1; }
      continue;
    }
    if (char === '/' && next === '/') { mode = 'line-comment'; index += 1; continue; }
    if (char === '/' && next === '*') { mode = 'block-comment'; index += 1; continue; }
    if (char === '"' || char === "'" || char === '`') { mode = 'string'; quote = char; continue; }
    if (char === '(') depth += 1;
    else if (char === ')') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  throw new Error('unbalanced_jsx_parentheses');
}

function extractNamedBlocks(source) {
  const blocks = new Map();
  const matcher = /\{name\s*===\s*['"]([^'"]+)['"]\s*&&\s*\(/gu;
  for (const match of source.matchAll(matcher)) {
    const start = match.index + match[0].length;
    const end = scanBalancedParentheses(source, start);
    blocks.set(match[1], source.slice(start, end));
  }
  return blocks;
}

function cleanAstroSvgFragment(fragment, viewBox) {
  let value = String(fragment)
    .replace(/\{\/\*[\s\S]*?\*\/\}/gu, '')
    .replace(/^\s*\/\/.*$/gmu, '')
    .replace(/<>/gu, '')
    .replace(/<\/>/gu, '')
    .replace(/<path\b[^>]*style=(?:"display:\s*none"|'display:\s*none')[^>]*\/>/giu, '')
    .replace(/\sclass=\{[^}]+\}/gu, '')
    .replace(/\saria-[\w-]+=\{[^}]+\}/gu, '')
    .replace(/\srole=\{[^}]+\}/gu, '')
    .replace(/\sfocusable=(?:"[^"]*"|'[^']*')/gu, '')
    .replace(/fill="currentColor"/gu, 'fill="#221a14"')
    .replace(/stroke="currentColor"/gu, 'stroke="#221a14"')
    .trim();

  if (value.includes('{') || value.includes('}')) {
    throw new Error(`unresolved_jsx_expression:${value.slice(0, 140)}`);
  }
  if (/^<svg\b/iu.test(value)) {
    value = value.replace(/\sclass=(?:"[^"]*"|'[^']*')/gu, '');
    return stripCommentsAndNormalizeSvg(value);
  }
  return stripCommentsAndNormalizeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="#221a14">${value}</svg>`);
}

function findConsumers(needles) {
  const roots = [join(siteRoot, 'src')];
  const files = roots.flatMap((root) => walkFiles(root, (path) => ['.astro', '.ts', '.js', '.mjs', '.css', '.json'].includes(extname(path))));
  const result = [];
  for (const file of files) {
    const source = readText(file);
    if (needles.some((needle) => needle && source.includes(needle))) result.push(repoPath(file));
  }
  return [...new Set(result)].sort();
}

function parseCssVariables(css) {
  const values = new Map();
  for (const match of css.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/giu)) values.set(match[1], match[2].trim());
  return values;
}

function resolveCssValue(name, values, seen = new Set()) {
  if (seen.has(name)) throw new Error(`css_variable_cycle:${name}`);
  seen.add(name);
  const raw = values.get(name);
  if (!raw) throw new Error(`css_variable_missing:${name}`);
  const variable = raw.match(/^var\(--([a-z0-9-]+)\)$/iu);
  return variable ? resolveCssValue(variable[1], values, seen) : raw;
}

const cssPath = join(siteRoot, 'src/styles/design-system.css');
const cssSource = readText(cssPath);
const cssValues = parseCssVariables(cssSource);
const colorSpecs = [
  ['color.brand.action', 'Action', 'Brand', 'ke-color-brand-600'],
  ['color.brand.action-hover', 'Action hover', 'Brand', 'ke-color-brand-700'],
  ['color.brand.strong', 'Strong', 'Brand', 'ke-color-brand-800'],
  ['color.brand.deep', 'Deep', 'Brand', 'ke-color-brand-900'],
  ['color.accent.default', 'Accent', 'Semantic/Accent', 'ke-color-accent-600'],
  ['color.accent.strong', 'Accent strong', 'Semantic/Accent', 'ke-color-accent-700'],
  ['color.text.primary', 'Text primary', 'Semantic/Text', 'ke-color-ink'],
  ['color.text.secondary', 'Text secondary', 'Semantic/Text', 'ke-color-copy'],
  ['color.text.muted', 'Text muted', 'Semantic/Text', 'ke-color-muted'],
  ['color.border.subtle', 'Border subtle', 'Semantic/Border', 'ke-color-line'],
  ['color.focus.ring', 'Focus ring', 'Semantic/Focus', 'ke-color-focus'],
  ['color.surface.canvas', 'Canvas', 'Semantic/Surface', 'ke-color-canvas'],
  ['color.surface.canvas-soft', 'Canvas soft', 'Semantic/Surface', 'ke-color-canvas-soft'],
  ['color.surface.default', 'Surface', 'Semantic/Surface', 'ke-color-surface'],
  ['color.surface.strong', 'Surface strong', 'Semantic/Surface', 'ke-color-surface-strong'],
  ['color.surface.inverse', 'Surface inverse', 'Semantic/Surface', 'ke-color-surface-inverse'],
  ['color.surface.inverse-raised', 'Surface inverse raised', 'Semantic/Surface', 'ke-color-surface-inverse-raised'],
  ['color.status.success-bg', 'Success background', 'Semantic/Status/Success', 'ke-color-success-50'],
  ['color.status.success', 'Success', 'Semantic/Status/Success', 'ke-color-success-700'],
  ['color.status.warning-bg', 'Warning background', 'Semantic/Status/Warning', 'ke-color-warning-50'],
  ['color.status.warning', 'Warning', 'Semantic/Status/Warning', 'ke-color-warning-800'],
  ['color.status.danger-bg', 'Danger background', 'Semantic/Status/Danger', 'ke-color-danger-50'],
  ['color.status.danger', 'Danger', 'Semantic/Status/Danger', 'ke-color-danger-700'],
  ['color.status.info-bg', 'Info background', 'Semantic/Status/Info', 'ke-color-info-50'],
  ['color.status.info', 'Info', 'Semantic/Status/Info', 'ke-color-info-700'],
];

const colors = colorSpecs.map(([id, name, path, variable]) => {
  const value = resolveCssValue(variable, cssValues);
  if (!/^#[0-9a-f]{3,8}$/iu.test(value)) throw new Error(`unsupported_color:${variable}:${value}`);
  return {
    id,
    name,
    path,
    value,
    opacity: 1,
    source: { file: repoPath(cssPath), variable: `--${variable}` },
  };
});

const typography = [
  { id: 'type.display.brand', name: 'Brand display', path: 'Brand', fontFamily: 'Inter', fontSize: '64', fontWeight: '900', lineHeight: '1.02', letterSpacing: '-1.2', textTransform: null },
  { id: 'type.heading.h1', name: 'H1', path: 'Content/Heading', fontFamily: 'Inter', fontSize: '40', fontWeight: '900', lineHeight: '1.08', letterSpacing: '-0.6', textTransform: null },
  { id: 'type.heading.h2', name: 'H2', path: 'Content/Heading', fontFamily: 'Inter', fontSize: '24', fontWeight: '850', lineHeight: '1.18', letterSpacing: '-0.2', textTransform: null },
  { id: 'type.heading.h3', name: 'H3', path: 'Content/Heading', fontFamily: 'Inter', fontSize: '18', fontWeight: '800', lineHeight: '1.2', letterSpacing: '0', textTransform: null },
  { id: 'type.body.default', name: 'Body', path: 'Content/Body', fontFamily: 'Inter', fontSize: '16', fontWeight: '500', lineHeight: '1.6', letterSpacing: '0', textTransform: null },
  { id: 'type.body.strong', name: 'Body strong', path: 'Content/Body', fontFamily: 'Inter', fontSize: '16', fontWeight: '750', lineHeight: '1.5', letterSpacing: '0', textTransform: null },
  { id: 'type.meta.default', name: 'Metadata', path: 'Content/Metadata', fontFamily: 'Inter', fontSize: '14', fontWeight: '650', lineHeight: '1.4', letterSpacing: '0', textTransform: null },
  { id: 'type.caption.default', name: 'Caption', path: 'Content/Caption', fontFamily: 'Inter', fontSize: '12', fontWeight: '600', lineHeight: '1.35', letterSpacing: '0.1', textTransform: null },
  { id: 'type.control.label', name: 'Control label', path: 'Control', fontFamily: 'Inter', fontSize: '14', fontWeight: '850', lineHeight: '1.1', letterSpacing: '0', textTransform: null },
].map((entry) => ({ ...entry, source: { file: repoPath(cssPath), variable: '--ke-font-sans' } }));

const iconContractPath = join(siteRoot, 'src/data/design-system-iconography-contract.v1.json');
const iconContract = JSON.parse(readText(iconContractPath));
const iconSourcePath = join(siteRoot, 'src/components/Icon.astro');
const socialSourcePath = join(siteRoot, 'src/components/SocialIcon.astro');
const iconSource = readText(iconSourcePath);
const socialSource = readText(socialSourcePath);
const iconBlocks = extractNamedBlocks(iconSource);
const socialBlocks = extractNamedBlocks(socialSource);
const viewBoxes = { calendar: '0 0 32 32', dislike: '0 0 512 512' };

const icons = [];
for (const component of iconContract.canonical_components) {
  if (component.id === 'icon.ui') {
    for (const name of component.names) {
      const block = iconBlocks.get(name);
      if (!block) throw new Error(`icon_block_missing:${name}`);
      const svg = cleanAstroSvgFragment(block, viewBoxes[name] || '0 0 24 24');
      const consumers = findConsumers([`name="${name}"`, `name='${name}'`, `name={\"${name}\"}`, `name={'${name}'}`]);
      icons.push({
        id: `icon.ui.${name}`,
        name,
        path: `${component.penpot_path}`,
        category: name === 'pin' || name === 'calendar' ? 'Navigation' : name === 'info' || name === 'check' ? 'Status and feedback' : 'System and actions',
        status: consumers.length ? 'current' : 'unused',
        svg,
        hash: sha256(svg),
        viewBox: viewBoxes[name] || '0 0 24 24',
        source: { file: component.source, symbol: name },
        consumers,
        attribution: null,
        semanticRole: name,
      });
    }
  } else if (component.id === 'icon.social') {
    for (const name of component.names) {
      let svg;
      let sourceFile = component.source;
      if (name === 'max') {
        sourceFile = 'site/public/assets/social/max-colored-official.svg';
        svg = stripCommentsAndNormalizeSvg(readText(join(productRoot, sourceFile)));
      } else {
        const block = socialBlocks.get(name);
        if (!block) throw new Error(`social_icon_block_missing:${name}`);
        svg = cleanAstroSvgFragment(block, '0 0 240 240');
      }
      const consumers = findConsumers([`name="${name}"`, `name='${name}'`, `name={\"${name}\"}`, `name={'${name}'}`, sourceFile.split('/').pop()]);
      icons.push({
        id: `icon.social.${name}`,
        name,
        path: component.penpot_path,
        category: 'Social and external services',
        status: consumers.length ? 'current' : 'unused',
        svg,
        hash: sha256(svg),
        viewBox: null,
        source: { file: sourceFile, symbol: name },
        consumers,
        attribution: sourceFile.endsWith('.svg') ? `${sourceFile}.metadata.json` : null,
        semanticRole: `social-${name}`,
      });
    }
  }
}

for (const collection of iconContract.asset_collections) {
  for (const fileName of collection.expected_svg_files) {
    const sourceFile = normalizePath(join(collection.root, fileName));
    const absolute = join(productRoot, sourceFile);
    if (!existsSync(absolute)) throw new Error(`icon_asset_missing:${sourceFile}`);
    const svg = stripCommentsAndNormalizeSvg(readText(absolute));
    const consumers = findConsumers([fileName, sourceFile.replace(/^site\/public/u, '')]);
    const forcedLegacy = collection.classification.includes('legacy');
    const status = forcedLegacy ? 'legacy' : consumers.length ? 'current' : 'candidate';
    icons.push({
      id: `icon.asset.${collection.id}.${fileName.replace(/\.svg$/u, '')}`,
      name: fileName.replace(/\.svg$/u, '').replace(/^\d+-/u, '').replace(/[-_]+/gu, ' '),
      path: collection.penpot_path,
      category: collection.penpot_path.includes('/Transport') ? 'Transport'
        : collection.penpot_path.includes('/Social') ? 'Social and external services'
          : collection.penpot_path.includes('/Editorial') ? 'Festival and editorial categories'
            : 'Product-specialized symbols',
      status,
      svg,
      hash: sha256(svg),
      viewBox: null,
      source: { file: sourceFile, symbol: null },
      consumers,
      attribution: collection.attribution || null,
      semanticRole: fileName.replace(/\.svg$/u, ''),
    });
  }
}

const iconIds = new Set();
for (const icon of icons) {
  if (iconIds.has(icon.id)) throw new Error(`duplicate_icon_id:${icon.id}`);
  iconIds.add(icon.id);
}

const coreComponents = [
  {
    id: 'core.button',
    name: 'Button',
    path: 'Core/Actions',
    source: { file: 'site/src/components/design-system/Button.astro', css: 'site/src/styles/design-system.css' },
    variantAxes: { hierarchy: ['primary', 'secondary', 'quiet', 'danger'], state: ['default', 'hover', 'focus', 'pressed', 'disabled'] },
  },
  {
    id: 'core.badge',
    name: 'Badge',
    path: 'Core/Status',
    source: { file: 'site/src/components/design-system/Tag.astro', css: 'site/src/styles/design-system.css' },
    variantAxes: { tone: ['neutral', 'brand', 'accent', 'success', 'warning', 'danger'] },
  },
  {
    id: 'core.field',
    name: 'Field',
    path: 'Core/Forms',
    source: { file: 'site/src/components/design-system/FormControl.astro', css: 'site/src/styles/design-system.css' },
    variantAxes: { state: ['default', 'hover', 'focus', 'error', 'disabled'] },
  },
  {
    id: 'core.state-panel',
    name: 'State panel',
    path: 'Core/Feedback',
    source: { file: 'site/src/components/design-system/StatePanel.astro', css: 'site/src/styles/design-system.css' },
    variantAxes: { tone: ['info', 'success', 'warning', 'critical'] },
  },
];

for (const component of coreComponents) {
  component.consumers = findConsumers([component.source.file.split('/').pop().replace(/\.astro$/u, '')]);
}

const payload = {
  schemaVersion: 1,
  delivery: 'penpot-resource-graph-004a',
  generatedAt,
  source: {
    repository: 'onedayonemasterpiece/events-bot-new',
    revision: productSha,
    mode: 'implementation-main-native-resource-bootstrap',
    productionFreshnessClaimed: false,
  },
  pages: [
    '00 — System map',
    '10 — Brand assets',
    '20 — Foundations',
    '25 — Iconography',
    '30 — Core UI resources',
    '40 — Announcements components',
    '50 — Product patterns',
    '60 — Page archetypes',
    '70 — Coverage and fragmentation',
    '80 — Candidate review',
    '89 — Review archive',
    '90 — Evidence / desktop',
    '91 — Evidence / tablet',
    '92 — Evidence / mobile',
    '93 — Evidence / interaction and accessibility',
    '99 — Technical tests',
  ],
  colors,
  typography,
  icons: icons.sort((a, b) => `${a.category}/${a.path}/${a.name}`.localeCompare(`${b.category}/${b.path}/${b.name}`)),
  coreComponents,
  counts: {
    colors: colors.length,
    typography: typography.length,
    icons: icons.length,
    currentIcons: icons.filter((icon) => icon.status === 'current').length,
    candidateIcons: icons.filter((icon) => icon.status === 'candidate').length,
    legacyIcons: icons.filter((icon) => icon.status === 'legacy').length,
    unusedIcons: icons.filter((icon) => icon.status === 'unused').length,
    coreComponents: coreComponents.length,
  },
  knownGaps: [
    'Accepted-production release identity is not attached in 004a; source is the exact implementation commit shown above.',
    'Product component masters and page archetypes are not yet reconciled in this bootstrap.',
    'Runtime Review 003.2 remains the evidence transport until the production multi-resolution evidence catalog is attached.',
  ],
};

payload.catalogSha256 = sha256(JSON.stringify(payload));
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
process.stdout.write(`${JSON.stringify({ output: outputPath, sourceSha: productSha, catalogSha256: payload.catalogSha256, counts: payload.counts })}\n`);
