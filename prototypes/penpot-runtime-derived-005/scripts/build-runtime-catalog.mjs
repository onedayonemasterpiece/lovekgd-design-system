#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

function parseArgs(argv) {
  const out = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith('--')) continue;
    const key = value.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) out[key] = true;
    else {
      out[key] = next;
      index += 1;
    }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const siteDir = resolve(args['site-dir'] || '.source/events-bot-new/site');
const repoDir = resolve(args['repo-dir'] || dirname(siteDir));
const distDir = resolve(args.dist || join(siteDir, 'dist'));
const baseUrl = String(args['base-url'] || 'http://127.0.0.1:4321').replace(/\/+$/u, '');
const sourceSha = String(args['source-sha'] || '').trim();
const outDir = resolve(args.out || 'prototypes/penpot-runtime-derived-005/catalog');
const maxClusters = Number(args['max-clusters'] || 1000);
const maxCandidatesPerPage = Number(args['max-candidates-per-page'] || 600);
const maxTreeNodes = Number(args['max-tree-nodes'] || 180);

if (!/^[0-9a-f]{40}$/u.test(sourceSha)) throw new Error(`invalid_source_sha:${sourceSha}`);
if (!existsSync(distDir)) throw new Error(`dist_missing:${distDir}`);
mkdirSync(outDir, { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
mkdirSync(join(outDir, 'assets'), { recursive: true });

const requireFromSite = createRequire(join(siteDir, 'package.json'));
const { chromium } = requireFromSite('playwright');

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const cleanPath = (value) => value.split(sep).join('/');
const readUtf8 = (path) => readFileSync(path, 'utf8');
const safeName = (value) => String(value || 'item')
  .normalize('NFKD')
  .replace(/[^a-zA-Z0-9._-]+/gu, '-')
  .replace(/^-+|-+$/gu, '')
  .slice(0, 96) || 'item';

function walkFiles(root, filter = () => true) {
  const output = [];
  const visit = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.isFile() && filter(full)) output.push(full);
    }
  };
  visit(root);
  return output.sort();
}

function routeFromHtml(path) {
  const rel = cleanPath(relative(distDir, path));
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  if (rel.endsWith('.html')) return `/${rel.slice(0, -'.html'.length)}/`;
  return null;
}

function routeExcluded(route) {
  return !route
    || route.startsWith('/lab/')
    || route.startsWith('/__preview/')
    || route.startsWith('/preview-')
    || route === '/404/'
    || route.includes('/__fixture');
}

function structuralMarkup(html) {
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/iu)?.[1] || html;
  return body
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, '')
    .replace(/<!--([\s\S]*?)-->/gu, '')
    .replace(/\b(?:href|src|content|value|datetime|data-[\w-]+)=(?:"[^"]*"|'[^']*')/giu, (match) => {
      const name = match.split('=')[0];
      if (/^data-(?:state|status|variant|mode|layout|view|viewport|surface|size|kind|role)/iu.test(name)) {
        return match.replace(/=(?:"[^"]*"|'[^']*')/u, '="*"');
      }
      return `${name}="*"`;
    })
    .replace(/>[^<]+</gu, '><')
    .replace(/\s+/gu, ' ')
    .trim();
}

const htmlFiles = walkFiles(distDir, (path) => path.endsWith('.html'));
const rawRoutes = htmlFiles
  .map((file) => {
    const route = routeFromHtml(file);
    if (routeExcluded(route)) return null;
    const html = readUtf8(file);
    const structure = structuralMarkup(html);
    return {
      route,
      file,
      structureHash: sha256(structure),
      byteLength: Buffer.byteLength(html),
      title: html.match(/<title>([\s\S]*?)<\/title>/iu)?.[1]?.replace(/\s+/gu, ' ').trim() || route,
    };
  })
  .filter(Boolean);

const clusterMap = new Map();
for (const item of rawRoutes) {
  if (!clusterMap.has(item.structureHash)) clusterMap.set(item.structureHash, []);
  clusterMap.get(item.structureHash).push(item);
}

const priorityRoutes = [
  '/', '/segodnya/', '/zavtra/', '/vyhodnye/', '/populyarnoe/', '/podborki/', '/festivali/',
  '/vystavki/', '/izbrannoe/', '/poisk/', '/dlya-menya/', '/fokus-gruppa/', '/artefakty/',
];

function routePriority(route) {
  const exact = priorityRoutes.indexOf(route);
  if (exact >= 0) return exact;
  if (route.startsWith('/sobytiya/')) return 40;
  return 100 + route.split('/').filter(Boolean).length;
}

const clusters = [...clusterMap.entries()]
  .map(([structureHash, routes]) => ({
    structureHash,
    routes: routes.sort((a, b) => routePriority(a.route) - routePriority(b.route) || a.route.localeCompare(b.route)),
  }))
  .sort((a, b) => routePriority(a.routes[0].route) - routePriority(b.routes[0].route) || b.routes.length - a.routes.length)
  .slice(0, maxClusters);

function sourceFiles() {
  const root = join(siteDir, 'src');
  return walkFiles(root, (path) => /\.(?:astro|ts|tsx|js|mjs|css)$/u.test(path));
}

const sourceFilePaths = sourceFiles();
const sourceText = new Map(sourceFilePaths.map((path) => [cleanPath(relative(repoDir, path)), readUtf8(path)]));

function resolveImport(fromPath, specifier) {
  if (!specifier.startsWith('.')) return null;
  const fromAbsolute = join(repoDir, fromPath);
  const base = resolve(dirname(fromAbsolute), specifier);
  const candidates = [
    base,
    `${base}.astro`, `${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}.mjs`, `${base}.css`,
    join(base, 'index.astro'), join(base, 'index.ts'), join(base, 'index.js'),
  ];
  const found = candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
  return found ? cleanPath(relative(repoDir, found)) : null;
}

const importGraph = new Map();
for (const [path, text] of sourceText.entries()) {
  const imports = new Set();
  for (const match of text.matchAll(/(?:import\s+(?:[\s\S]*?\s+from\s+)?|import\s*\()\s*['"]([^'"]+)['"]/gu)) {
    const resolved = resolveImport(path, match[1]);
    if (resolved) imports.add(resolved);
  }
  importGraph.set(path, [...imports]);
}

function routeSource(route) {
  if (route === '/') return 'site/src/pages/index.astro';
  const direct = `site/src/pages${route.replace(/\/$/u, '')}/index.astro`;
  if (sourceText.has(direct)) return direct;
  if (route.startsWith('/sobytiya/')) {
    const dynamic = [...sourceText.keys()].find((path) => /^site\/src\/pages\/sobytiya\/\[[^\]]+\]\.astro$/u.test(path));
    if (dynamic) return dynamic;
  }
  const flat = `site/src/pages${route.replace(/\/$/u, '')}.astro`;
  return sourceText.has(flat) ? flat : null;
}

function importClosure(entry) {
  if (!entry) return [];
  const seen = new Set();
  const visit = (path) => {
    if (!path || seen.has(path)) return;
    seen.add(path);
    for (const imported of importGraph.get(path) || []) visit(imported);
  };
  visit(entry);
  return [...seen];
}

const colorCounts = new Map();
const fontFamilyCounts = new Map();
const fontSizeCounts = new Map();
const fontWeightCounts = new Map();
const lineHeightCounts = new Map();
const radiusCounts = new Map();
const shadowCounts = new Map();
const spacingCounts = new Map();
const iconMap = new Map();
const assetMap = new Map();
const candidateGroups = new Map();
const pageResults = [];
const failures = [];

function bump(map, value) {
  const key = String(value || '').trim();
  if (!key || key === 'none' || key === 'normal' || key === 'rgba(0, 0, 0, 0)') return;
  map.set(key, (map.get(key) || 0) + 1);
}

function copyLocalAsset(urlString) {
  try {
    const url = new URL(urlString, baseUrl);
    if (url.origin !== new URL(baseUrl).origin) return null;
    const pathname = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    const candidates = [join(distDir, pathname), join(distDir, pathname, 'index.html')];
    const source = candidates.find((path) => existsSync(path) && statSync(path).isFile());
    if (!source) return null;
    const ext = extname(source) || '.bin';
    const hash = sha256(readFileSync(source));
    const targetName = `${hash.slice(0, 16)}${ext}`;
    const target = join(outDir, 'assets', targetName);
    if (!existsSync(target)) copyFileSync(source, target);
    return `assets/${targetName}`;
  } catch {
    return null;
  }
}

function normalizedTreeForSignature(tree) {
  return tree.map((node) => ({
    type: node.type,
    tag: node.tag,
    role: node.role,
    classes: node.classes,
    x: Math.round(node.x / 2) * 2,
    y: Math.round(node.y / 2) * 2,
    width: Math.round(node.width / 2) * 2,
    height: Math.round(node.height / 2) * 2,
    style: node.style,
    text: node.type === 'text' ? '*' : undefined,
    assetKind: node.assetKind,
  }));
}

function candidateSourceCandidates(candidate, closure) {
  const tokens = new Set(candidate.classTokens || []);
  const dataTokens = new Set(candidate.dataTokens || []);
  const scored = [];
  for (const path of closure) {
    if (!path.endsWith('.astro')) continue;
    const text = sourceText.get(path) || '';
    let score = 0;
    let matched = 0;
    for (const token of tokens) {
      if (token.length >= 3 && text.includes(token)) {
        score += token.length > 10 ? 3 : 2;
        matched += 1;
      }
    }
    for (const token of dataTokens) {
      if (text.includes(token)) {
        score += 4;
        matched += 1;
      }
    }
    const basename = path.split('/').pop()?.replace(/\.astro$/u, '').toLowerCase() || '';
    if (candidate.kind && basename.includes(candidate.kind.replace(/[^a-z0-9]/gu, ''))) score += 2;
    if (score > 0) scored.push({ path, score, matched });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path))
    .slice(0, 5)
    .map((item) => ({
      ...item,
      confidence: Number(Math.min(1, item.matched / Math.max(1, tokens.size + dataTokens.size)).toFixed(3)),
      url: `https://github.com/onedayonemasterpiece/events-bot-new/blob/${sourceSha}/${item.path}`,
    }));
}

function topEntries(map, limit = 80) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }));
}

const browser = await chromium.launch({ headless: true });
const viewports = [
  { id: 'mobile-390', group: 'mobile', width: 390, height: 844 },
  { id: 'tablet-768', group: 'tablet', width: 768, height: 1024 },
  { id: 'desktop-1280', group: 'desktop', width: 1280, height: 800 },
  { id: 'desktop-1728', group: 'desktop', width: 1728, height: 900 },
];

try {
  let clusterIndex = 0;
  for (const cluster of clusters) {
    clusterIndex += 1;
    const representative = cluster.routes[0];
    const source = routeSource(representative.route);
    const closure = importClosure(source);
    const pageEntry = {
      id: `page.${cluster.structureHash.slice(0, 12)}`,
      title: representative.title,
      structureHash: cluster.structureHash,
      representativeRoute: representative.route,
      routes: cluster.routes.map((item) => item.route),
      routeCount: cluster.routes.length,
      routeSource: source,
      sourceClosure: closure,
      sourceRevision: sourceSha,
      viewports: [],
    };

    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
        colorScheme: 'light',
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      const url = `${baseUrl}${representative.route}`;
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 });
        await page.evaluate(async () => {
          await document.fonts?.ready;
          window.scrollTo(0, 0);
        });
        const pageHeight = await page.evaluate(() => Math.max(
          document.documentElement.scrollHeight,
          document.body?.scrollHeight || 0,
        ));
        const screenshotName = `${String(clusterIndex).padStart(3, '0')}-${safeName(representative.route)}-${viewport.id}.png`;
        const screenshotPath = join(outDir, 'screenshots', screenshotName);
        await page.screenshot({ path: screenshotPath, fullPage: true, animations: 'disabled' });

        const runtime = await page.evaluate(({ maxCandidatesPerPage, maxTreeNodes }) => {
          const candidateSelector = [
            'header', 'nav', 'footer', 'main > section', 'main > article', 'form',
            'button', 'input', 'select', 'textarea', '[role="button"]', '[role="dialog"]',
            '[role="tablist"]', '[role="tab"]', '[role="navigation"]', 'article',
            '[class*="card" i]', '[class*="rail" i]', '[class*="hero" i]', '[class*="menu" i]',
            '[class*="notice" i]', '[class*="toast" i]', '[class*="badge" i]', '[class*="tag" i]',
            '[class*="chip" i]', '[class*="medallion" i]', '[class*="token" i]', '[class*="transport" i]',
            '[class*="focus" i]', '[class*="auth" i]', '[class*="search" i]', '[class*="favorite" i]',
            '[class*="header" i]', '[class*="footer" i]', '[class*="collection" i]', '[class*="filter" i]',
            '[data-component]', '[data-variant]', '[data-state]', '[data-testid]', '[data-ds-component]',
          ].join(',');

          const visible = (element) => {
            if (!(element instanceof Element)) return false;
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return rect.width >= 12 && rect.height >= 12 && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0;
          };

          const color = (value) => value && value !== 'rgba(0, 0, 0, 0)' ? value : '';
          const classTokens = (element) => Array.from(element.classList || []).filter((token) => token && !/^astro-/u.test(token)).slice(0, 16);
          const dataTokens = (element) => Array.from(element.attributes || [])
            .map((attribute) => attribute.name)
            .filter((name) => name.startsWith('data-'))
            .slice(0, 12);

          const kindOf = (element) => {
            const tag = element.tagName.toLowerCase();
            const role = element.getAttribute('role') || '';
            const haystack = `${tag} ${role} ${classTokens(element).join(' ')} ${dataTokens(element).join(' ')}`.toLowerCase();
            const rules = [
              ['header', /\bheader\b|site-header|masthead|topbar/u],
              ['footer', /\bfooter\b|site-footer/u],
              ['navigation', /\bnav\b|navigation|bottom-nav|mobile-menu|breadcrumb/u],
              ['button', /\bbutton\b|btn|cta|action/u],
              ['field', /\binput\b|\bselect\b|\btextarea\b|field|control/u],
              ['event-card', /event[-_ ]?card|listing[-_ ]?(?:row|card)|discovery[-_ ]?card/u],
              ['rail', /rail|timeline|carousel/u],
              ['hero', /hero|event[-_ ]?header/u],
              ['medallion', /medallion|token|badge[-_ ]?collection/u],
              ['notice', /notice|alert|state[-_ ]?panel|toast|message/u],
              ['search', /search/u],
              ['auth', /auth|login|otp/u],
              ['focus-group', /focus[-_ ]?group|nps|feedback/u],
              ['transport', /transport|schedule|timetable|departure/u],
              ['collection', /collection|festival|exhibition/u],
              ['card', /\bcard\b|tile/u],
              ['section', /section|panel|surface/u],
            ];
            return rules.find(([, pattern]) => pattern.test(haystack))?.[0] || (tag === 'article' ? 'article' : tag);
          };

          const stableSelector = (element) => {
            if (element.id) return `#${CSS.escape(element.id)}`;
            for (const name of ['data-ds-component', 'data-component', 'data-testid', 'data-state', 'data-variant']) {
              const value = element.getAttribute(name);
              if (value) return `[${name}="${CSS.escape(value)}"]`;
            }
            const segments = [];
            let current = element;
            while (current && current !== document.body && segments.length < 6) {
              let segment = current.tagName.toLowerCase();
              const classes = classTokens(current).slice(0, 2);
              if (classes.length) segment += `.${classes.map((token) => CSS.escape(token)).join('.')}`;
              const siblings = current.parentElement
                ? Array.from(current.parentElement.children).filter((node) => node.tagName === current.tagName)
                : [];
              if (siblings.length > 1) segment += `:nth-of-type(${siblings.indexOf(current) + 1})`;
              segments.unshift(segment);
              current = current.parentElement;
            }
            return segments.join(' > ');
          };

          const styleOf = (element) => {
            const style = getComputedStyle(element);
            return {
              display: style.display,
              position: style.position,
              backgroundColor: color(style.backgroundColor),
              backgroundImage: style.backgroundImage === 'none' ? '' : style.backgroundImage,
              color: color(style.color),
              borderTopColor: color(style.borderTopColor),
              borderTopWidth: style.borderTopWidth,
              borderTopStyle: style.borderTopStyle,
              borderRadius: style.borderRadius,
              boxShadow: style.boxShadow === 'none' ? '' : style.boxShadow,
              opacity: style.opacity,
              fontFamily: style.fontFamily,
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
              fontStyle: style.fontStyle,
              lineHeight: style.lineHeight,
              letterSpacing: style.letterSpacing,
              textAlign: style.textAlign,
              textTransform: style.textTransform,
              paddingTop: style.paddingTop,
              paddingRight: style.paddingRight,
              paddingBottom: style.paddingBottom,
              paddingLeft: style.paddingLeft,
              gap: style.gap,
              flexDirection: style.flexDirection,
              justifyContent: style.justifyContent,
              alignItems: style.alignItems,
              gridTemplateColumns: style.gridTemplateColumns,
              objectFit: style.objectFit,
              overflow: style.overflow,
            };
          };

          const serializeTree = (root, limit) => {
            const rootRect = root.getBoundingClientRect();
            const nodes = [];
            let serial = 0;
            const visit = (node, depth, parentId) => {
              if (nodes.length >= limit || depth > 8) return;
              if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent?.replace(/\s+/gu, ' ').trim();
                if (!text || !(node.parentElement instanceof Element)) return;
                const range = document.createRange();
                range.selectNodeContents(node);
                const rect = range.getBoundingClientRect();
                if (rect.width < 2 || rect.height < 2) return;
                const style = getComputedStyle(node.parentElement);
                const id = `n${serial++}`;
                nodes.push({
                  id, parentId, type: 'text', tag: '#text', role: '', classes: [],
                  x: rect.x - rootRect.x, y: rect.y - rootRect.y,
                  width: rect.width, height: rect.height,
                  text: text.slice(0, 240),
                  style: {
                    color: color(style.color), fontFamily: style.fontFamily, fontSize: style.fontSize,
                    fontWeight: style.fontWeight, fontStyle: style.fontStyle, lineHeight: style.lineHeight,
                    letterSpacing: style.letterSpacing, textAlign: style.textAlign, textTransform: style.textTransform,
                    opacity: style.opacity,
                  },
                });
                return;
              }
              if (!(node instanceof Element) || !visible(node)) return;
              const rect = node.getBoundingClientRect();
              const id = `n${serial++}`;
              const tag = node.tagName.toLowerCase();
              const record = {
                id, parentId, type: tag === 'img' ? 'image' : (tag === 'svg' ? 'svg' : 'box'),
                tag, role: node.getAttribute('role') || '', classes: classTokens(node),
                dataTokens: dataTokens(node),
                x: rect.x - rootRect.x, y: rect.y - rootRect.y,
                width: rect.width, height: rect.height,
                style: styleOf(node),
              };
              if (tag === 'img') {
                record.src = node.currentSrc || node.getAttribute('src') || '';
                record.alt = node.getAttribute('alt') || '';
                record.assetKind = 'image';
              } else if (tag === 'svg') {
                record.svg = node.outerHTML.length <= 80_000 ? node.outerHTML : '';
                record.assetKind = 'svg';
              }
              nodes.push(record);
              for (const child of node.childNodes) visit(child, depth + 1, id);
            };
            visit(root, 0, null);
            return nodes;
          };

          const rawCandidates = Array.from(document.querySelectorAll(candidateSelector)).filter(visible);
          const candidates = [];
          const seen = new Set();
          for (const element of rawCandidates) {
            if (candidates.length >= maxCandidatesPerPage) break;
            const selector = stableSelector(element);
            if (seen.has(selector)) continue;
            seen.add(selector);
            const rect = element.getBoundingClientRect();
            const classes = classTokens(element);
            const data = dataTokens(element);
            const kind = kindOf(element);
            const tree = serializeTree(element, maxTreeNodes);
            if (!tree.length) continue;
            const ancestorCandidate = element.parentElement?.closest(candidateSelector);
            candidates.push({
              selector, kind, tag: element.tagName.toLowerCase(), role: element.getAttribute('role') || '',
              classes, classTokens: classes, dataTokens: data,
              text: element.textContent?.replace(/\s+/gu, ' ').trim().slice(0, 220) || '',
              x: rect.x + window.scrollX, y: rect.y + window.scrollY,
              width: rect.width, height: rect.height,
              style: styleOf(element), tree,
              parentSelector: ancestorCandidate && ancestorCandidate !== element ? stableSelector(ancestorCandidate) : null,
            });
          }

          const all = Array.from(document.querySelectorAll('*')).filter(visible);
          const computed = all.slice(0, 12_000).map((element) => {
            const style = getComputedStyle(element);
            return {
              backgroundColor: color(style.backgroundColor), backgroundImage: style.backgroundImage === 'none' ? '' : style.backgroundImage,
              color: color(style.color), borderColor: color(style.borderTopColor), fontFamily: style.fontFamily, fontSize: style.fontSize,
              fontWeight: style.fontWeight, lineHeight: style.lineHeight, borderRadius: style.borderRadius,
              boxShadow: style.boxShadow === 'none' ? '' : style.boxShadow,
              gap: style.gap, paddingTop: style.paddingTop, paddingRight: style.paddingRight,
              paddingBottom: style.paddingBottom, paddingLeft: style.paddingLeft,
            };
          });

          const icons = [];
          for (const svg of Array.from(document.querySelectorAll('svg')).filter(visible).slice(0, 500)) {
            const rect = svg.getBoundingClientRect();
            const markup = svg.outerHTML;
            icons.push({
              kind: 'inline-svg', markup: markup.length <= 100_000 ? markup : '',
              selector: stableSelector(svg), width: rect.width, height: rect.height,
              classes: classTokens(svg), title: svg.querySelector('title')?.textContent?.trim() || '',
            });
          }
          for (const image of Array.from(document.images).filter(visible).slice(0, 800)) {
            const src = image.currentSrc || image.src;
            if (/\.svg(?:\?|$)/iu.test(src)) {
              const rect = image.getBoundingClientRect();
              icons.push({ kind: 'svg-image', src, selector: stableSelector(image), width: rect.width, height: rect.height, alt: image.alt || '' });
            }
          }

          const assets = Array.from(document.images).filter(visible).slice(0, 1500).map((image) => {
            const rect = image.getBoundingClientRect();
            return {
              src: image.currentSrc || image.src, alt: image.alt || '', selector: stableSelector(image),
              width: rect.width, height: rect.height, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
              sourceKind: 'img',
            };
          });
          for (const element of all.slice(0, 12_000)) {
            const style = getComputedStyle(element);
            const value = style.backgroundImage || '';
            for (const match of value.matchAll(/url\(["']?([^"')]+)["']?\)/giu)) {
              const rect = element.getBoundingClientRect();
              assets.push({
                src: new URL(match[1], location.href).href,
                alt: element.getAttribute('aria-label') || element.textContent?.replace(/\s+/gu, ' ').trim().slice(0, 120) || '',
                selector: stableSelector(element), width: rect.width, height: rect.height,
                naturalWidth: null, naturalHeight: null, sourceKind: 'css-background',
              });
            }
          }
          for (const link of Array.from(document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]'))) {
            const href = link.href;
            if (href) assets.push({ src: href, alt: link.getAttribute('rel') || 'document asset', selector: stableSelector(link), width: 0, height: 0, naturalWidth: null, naturalHeight: null, sourceKind: 'document-link' });
          }
          for (const meta of Array.from(document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]'))) {
            const content = meta.content;
            if (content) assets.push({ src: new URL(content, location.href).href, alt: meta.getAttribute('property') || meta.getAttribute('name') || 'social image', selector: stableSelector(meta), width: 0, height: 0, naturalWidth: null, naturalHeight: null, sourceKind: 'social-meta' });
          }

          return {
            title: document.title,
            url: location.href,
            documentWidth: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0),
            documentHeight: Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0),
            candidates,
            computed,
            icons,
            assets,
          };
        }, { maxCandidatesPerPage, maxTreeNodes });

        for (const style of runtime.computed) {
          bump(colorCounts, style.backgroundColor); bump(colorCounts, style.color); bump(colorCounts, style.borderColor);
          bump(fontFamilyCounts, style.fontFamily); bump(fontSizeCounts, style.fontSize); bump(fontWeightCounts, style.fontWeight);
          bump(lineHeightCounts, style.lineHeight); bump(radiusCounts, style.borderRadius); bump(shadowCounts, style.boxShadow);
          for (const value of [style.gap, style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft]) bump(spacingCounts, value);
        }

        const occurrenceIdBySelector = new Map();
        for (const candidate of runtime.candidates) {
          const normalizedTree = normalizedTreeForSignature(candidate.tree);
          const signature = sha256(JSON.stringify({ kind: candidate.kind, tag: candidate.tag, role: candidate.role, tree: normalizedTree }));
          const id = `runtime.${candidate.kind}.${signature.slice(0, 12)}`;
          const occurrenceId = `${pageEntry.id}.${viewport.id}.${sha256(candidate.selector).slice(0, 8)}`;
          occurrenceIdBySelector.set(candidate.selector, occurrenceId);
          if (!candidateGroups.has(id)) {
            candidateGroups.set(id, {
              id,
              kind: candidate.kind,
              signature,
              title: candidate.text || `${candidate.kind} ${signature.slice(0, 6)}`,
              representative: null,
              occurrences: [],
              sourceCandidates: [],
              status: 'runtime-observed',
            });
          }
          const group = candidateGroups.get(id);
          const occurrence = {
            id: occurrenceId,
            pageId: pageEntry.id,
            route: representative.route,
            viewport: viewport.id,
            selector: candidate.selector,
            parentSelector: candidate.parentSelector,
            parentOccurrenceId: null,
            x: candidate.x, y: candidate.y, width: candidate.width, height: candidate.height,
            screenshot: `screenshots/${screenshotName}`,
          };
          group.occurrences.push(occurrence);
          if (!group.representative || (viewport.group === 'desktop' && !group.representative.viewport.startsWith('desktop'))) {
            group.representative = {
              viewport: viewport.id,
              viewportGroup: viewport.group,
              route: representative.route,
              selector: candidate.selector,
              width: candidate.width,
              height: candidate.height,
              style: candidate.style,
              tree: candidate.tree,
              classTokens: candidate.classTokens,
              dataTokens: candidate.dataTokens,
              text: candidate.text,
            };
            group.sourceCandidates = candidateSourceCandidates(candidate, closure);
          }
        }

        for (const group of candidateGroups.values()) {
          for (const occurrence of group.occurrences) {
            if (occurrence.pageId !== pageEntry.id || occurrence.viewport !== viewport.id || !occurrence.parentSelector) continue;
            occurrence.parentOccurrenceId = occurrenceIdBySelector.get(occurrence.parentSelector) || null;
          }
        }

        for (const icon of runtime.icons) {
          const payload = icon.markup || icon.src || JSON.stringify(icon);
          const hash = sha256(payload);
          const id = `icon.${hash.slice(0, 12)}`;
          if (!iconMap.has(id)) iconMap.set(id, { id, hash, ...icon, occurrences: [] });
          iconMap.get(id).occurrences.push({ route: representative.route, viewport: viewport.id, selector: icon.selector });
        }

        for (const asset of runtime.assets) {
          const hash = sha256(asset.src);
          const id = `asset.${hash.slice(0, 12)}`;
          if (!assetMap.has(id)) {
            const localPath = copyLocalAsset(asset.src);
            assetMap.set(id, { id, ...asset, localPath, occurrences: [] });
          }
          assetMap.get(id).occurrences.push({ route: representative.route, viewport: viewport.id, selector: asset.selector });
        }

        pageEntry.viewports.push({
          id: viewport.id,
          width: viewport.width,
          height: viewport.height,
          documentWidth: runtime.documentWidth,
          documentHeight: runtime.documentHeight,
          screenshot: `screenshots/${screenshotName}`,
          screenshotSha256: sha256(readFileSync(screenshotPath)),
          candidateOccurrenceIds: runtime.candidates.map((candidate) => occurrenceIdBySelector.get(candidate.selector)).filter(Boolean),
          topLevelOccurrenceIds: runtime.candidates
            .filter((candidate) => !candidate.parentSelector)
            .map((candidate) => occurrenceIdBySelector.get(candidate.selector))
            .filter(Boolean),
        });
      } catch (error) {
        failures.push({ route: representative.route, viewport: viewport.id, message: String(error?.stack || error) });
      } finally {
        await context.close();
      }
    }
    pageResults.push(pageEntry);
  }
} finally {
  await browser.close();
}

// Add manifest and CSS-referenced assets that are part of the built runtime even when
// they are not visible in the representative viewport (PWA icons, favicon, masks,
// brand textures, print/social assets). Only referenced files are included.
const referencedAssetUrls = new Set();
for (const path of walkFiles(distDir, (file) => /\.(?:css|html|webmanifest|json)$/u.test(file))) {
  const relativePath = cleanPath(relative(distDir, path));
  let text = '';
  try { text = readUtf8(path); } catch { continue; }
  if (relativePath.endsWith('.webmanifest') || relativePath.endsWith('.json')) {
    try {
      const value = JSON.parse(text);
      for (const icon of value.icons || []) if (icon?.src) referencedAssetUrls.add(new URL(icon.src, `${baseUrl}/`).href);
      for (const shortcut of value.shortcuts || []) for (const icon of shortcut.icons || []) if (icon?.src) referencedAssetUrls.add(new URL(icon.src, `${baseUrl}/`).href);
    } catch {}
  }
  for (const match of text.matchAll(/(?:url\(|(?:src|href|content)=)[\s"']*([^"')\s>]+)["')]/giu)) {
    const candidate = match[1];
    if (!candidate || candidate.startsWith('data:') || candidate.startsWith('#')) continue;
    if (!/\.(?:png|jpe?g|webp|avif|gif|svg|ico)(?:[?#]|$)/iu.test(candidate)) continue;
    try { referencedAssetUrls.add(new URL(candidate, `${baseUrl}/${relativePath}`).href); } catch {}
  }
}
for (const src of referencedAssetUrls) {
  const id = `asset.${sha256(src).slice(0, 12)}`;
  if (!assetMap.has(id)) {
    const localPath = copyLocalAsset(src);
    assetMap.set(id, {
      id, src, alt: '', selector: '', width: 0, height: 0,
      naturalWidth: null, naturalHeight: null, localPath,
      sourceKind: 'built-reference', occurrences: [{ route: '*built-runtime*', viewport: 'all', selector: '' }],
    });
  }
}

const components = [...candidateGroups.values()]
  .map((group) => ({
    ...group,
    occurrenceCount: group.occurrences.length,
    routeCount: new Set(group.occurrences.map((occurrence) => occurrence.route)).size,
    viewportCount: new Set(group.occurrences.map((occurrence) => occurrence.viewport)).size,
  }))
  .sort((a, b) => b.routeCount - a.routeCount || b.occurrenceCount - a.occurrenceCount || a.id.localeCompare(b.id));

const componentByOccurrence = new Map();
for (const component of components) {
  for (const occurrence of component.occurrences) componentByOccurrence.set(occurrence.id, component.id);
}
for (const page of pageResults) {
  for (const viewport of page.viewports) {
    viewport.componentIds = [...new Set(viewport.candidateOccurrenceIds.map((id) => componentByOccurrence.get(id)).filter(Boolean))];
    viewport.topLevelComponentIds = [...new Set(viewport.topLevelOccurrenceIds.map((id) => componentByOccurrence.get(id)).filter(Boolean))];
  }
}

const importedSourceRoutes = new Map();
for (const page of pageResults) {
  for (const path of page.sourceClosure || []) {
    if (!/^site\/src\/(?:components|layouts)\/.+\.astro$/u.test(path)) continue;
    if (!importedSourceRoutes.has(path)) importedSourceRoutes.set(path, new Set());
    for (const route of page.routes) importedSourceRoutes.get(path).add(route);
  }
}
const mappedSourceComponents = new Map();
for (const component of components) {
  for (const candidate of component.sourceCandidates || []) {
    if (!mappedSourceComponents.has(candidate.path)) mappedSourceComponents.set(candidate.path, []);
    mappedSourceComponents.get(candidate.path).push(component.id);
  }
}
const sourceComponentInventory = [...importedSourceRoutes.entries()].map(([path, routes]) => ({
  id: `source.${sha256(path).slice(0, 12)}`,
  path,
  name: path.split('/').pop().replace(/\.astro$/u, ''),
  routes: [...routes].sort(),
  runtimeComponentIds: [...new Set(mappedSourceComponents.get(path) || [])],
  status: mappedSourceComponents.has(path) ? 'runtime-mapped' : 'imported-unmapped',
  url: `https://github.com/onedayonemasterpiece/events-bot-new/blob/${sourceSha}/${path}`,
})).sort((a, b) => a.path.localeCompare(b.path));

const icons = [...iconMap.values()].sort((a, b) => b.occurrences.length - a.occurrences.length || a.id.localeCompare(b.id));
const assets = [...assetMap.values()].sort((a, b) => b.occurrences.length - a.occurrences.length || a.id.localeCompare(b.id));

const patternMap = new Map();
for (const page of pageResults) {
  for (const viewport of page.viewports) {
    const ids = viewport.topLevelComponentIds || [];
    if (!ids.length) continue;
    const key = sha256(JSON.stringify(ids));
    const id = `pattern.${key.slice(0, 12)}`;
    if (!patternMap.has(id)) {
      patternMap.set(id, {
        id,
        title: `Runtime composition ${key.slice(0, 6)}`,
        componentIds: ids,
        occurrences: [],
        status: 'runtime-observed',
      });
    }
    patternMap.get(id).occurrences.push({
      pageId: page.id,
      route: page.representativeRoute,
      viewport: viewport.id,
    });
    viewport.patternId = id;
  }
}
const patterns = [...patternMap.values()]
  .map((item) => ({ ...item, occurrenceCount: item.occurrences.length }))
  .sort((a, b) => b.occurrenceCount - a.occurrenceCount || a.id.localeCompare(b.id));

const fragmentation = [];
const familyMap = new Map();
for (const component of components) {
  if (!familyMap.has(component.kind)) familyMap.set(component.kind, []);
  familyMap.get(component.kind).push(component);
}
for (const [kind, members] of familyMap.entries()) {
  if (members.length < 2) continue;
  const styleVariants = new Set(members.map((item) => JSON.stringify(item.representative?.style || {}))).size;
  fragmentation.push({
    id: `fragment.${kind}`,
    kind,
    title: `${kind}: ${members.length} runtime variants`,
    memberIds: members.map((item) => item.id),
    styleVariantCount: styleVariants,
    status: styleVariants > 1 ? 'needs-review' : 'consistent',
    recommendation: styleVariants > 1
      ? 'Compare semantics and consumers before merging. Promote shared tokens/anatomy, keep genuinely different UX lifecycles separate.'
      : 'Shared runtime signature observed across pages.',
  });
}

const designGaps = [];
for (const page of pageResults) {
  for (const viewport of page.viewports) {
    if (!viewport.topLevelComponentIds.length) {
      designGaps.push({
        id: `gap.${page.id}.${viewport.id}`,
        pageId: page.id,
        viewport: viewport.id,
        title: `No top-level component boundary detected for ${page.representativeRoute} (${viewport.id})`,
        status: 'needs-options',
      });
    }
  }
}
for (const component of components) {
  if (!component.sourceCandidates.length) {
    designGaps.push({
      id: `gap.source.${component.id}`,
      componentId: component.id,
      title: `Runtime component has no confident Astro source mapping: ${component.title}`,
      status: 'needs-source-attribution',
    });
  }
}

for (const sourceComponent of sourceComponentInventory.filter((item) => item.status === 'imported-unmapped')) {
  designGaps.push({
    id: `gap.imported-source.${sourceComponent.id}`,
    sourceComponentId: sourceComponent.id,
    sourcePath: sourceComponent.path,
    title: `Imported Astro component has no confident runtime boundary mapping: ${sourceComponent.path}`,
    status: 'needs-runtime-boundary',
  });
}

const manifestCandidates = [
  join(distDir, 'production-build.json'),
  join(distDir, 'static-release-manifest.json'),
];
const releaseEvidence = {};
for (const path of manifestCandidates) {
  if (!existsSync(path)) continue;
  try { releaseEvidence[cleanPath(relative(distDir, path))] = JSON.parse(readUtf8(path)); }
  catch { releaseEvidence[cleanPath(relative(distDir, path))] = { parseError: true }; }
}

const catalog = {
  schemaVersion: 1,
  delivery: 'penpot-runtime-derived-005',
  generatedAt: new Date().toISOString(),
  source: {
    repository: 'onedayonemasterpiece/events-bot-new',
    revision: sourceSha,
    mode: 'latest-main-built-runtime',
    buildCommand: 'npm run build',
    baseUrl,
    productionFreshnessClaimed: false,
    releaseEvidence,
  },
  contract: {
    sourceOfInventory: 'built HTML + browser-computed DOM/CSS + recursive Astro import graph',
    oldDesignSystemUsedAsSource: false,
    manualComponentAllowlistUsed: false,
    allGeneratedRoutesInspected: rawRoutes.length,
    structuralClustersInspected: pageResults.length,
    viewports: viewports.map(({ id, group, width, height }) => ({ id, group, width, height })),
  },
  counts: {
    generatedRoutes: rawRoutes.length,
    structuralClusters: pageResults.length,
    runtimeComponents: components.length,
    runtimePatterns: patterns.length,
    importedAstroComponents: sourceComponentInventory.length,
    mappedAstroComponents: sourceComponentInventory.filter((item) => item.status === 'runtime-mapped').length,
    unmappedAstroComponents: sourceComponentInventory.filter((item) => item.status === 'imported-unmapped').length,
    componentOccurrences: components.reduce((sum, item) => sum + item.occurrenceCount, 0),
    icons: icons.length,
    assets: assets.length,
    fragmentationClusters: fragmentation.length,
    designGaps: designGaps.length,
    failures: failures.length,
  },
  foundations: {
    colors: topEntries(colorCounts, 120),
    fontFamilies: topEntries(fontFamilyCounts, 40),
    fontSizes: topEntries(fontSizeCounts, 80),
    fontWeights: topEntries(fontWeightCounts, 30),
    lineHeights: topEntries(lineHeightCounts, 60),
    borderRadii: topEntries(radiusCounts, 60),
    shadows: topEntries(shadowCounts, 60),
    spacing: topEntries(spacingCounts, 80),
  },
  pages: pageResults,
  components,
  patterns,
  sourceComponentInventory,
  icons,
  assets,
  fragmentation,
  designGaps,
  failures,
};

const canonical = JSON.stringify(catalog);
catalog.catalogSha256 = sha256(canonical);
writeFileSync(join(outDir, 'catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`);
writeFileSync(join(outDir, 'receipt.json'), `${JSON.stringify({
  generatedAt: catalog.generatedAt,
  sourceSha,
  catalogSha256: catalog.catalogSha256,
  counts: catalog.counts,
  contract: catalog.contract,
}, null, 2)}\n`);

console.log(JSON.stringify({ catalog: join(outDir, 'catalog.json'), ...catalog.counts, catalogSha256: catalog.catalogSha256 }, null, 2));
if (failures.length) process.exitCode = 2;
