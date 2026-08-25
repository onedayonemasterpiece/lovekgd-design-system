#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import pw from '/home/dev/.codex/worktrees/events-bot-new/round-trip-astro-candidate-20260824/site/node_modules/playwright/index.js';

const { chromium } = pw;
const origin = process.env.ROUND_TRIP_ASTRO_ORIGIN ?? 'http://127.0.0.1:4322';
const bindings = JSON.parse(readFileSync('catalog/round-trip-reconstruction/v1/bindings.v1.json', 'utf8'));
const outputPath = 'evidence/round-trip-reconstruction/v1/foundation-audit-pack-v1/astro-browser-computed.v1.json';
const sampleLimit = 4;
const sha256 = value => createHash('sha256').update(value).digest('hex');

const colors = new Map();
const typography = new Map();
const contrasts = new Map();
const cases = [];

const add = (map, key, base, record, sample) => {
  let entry = map.get(key);
  if (!entry) {
    entry = { ...base, usage_count: 0, case_ids: new Set(), selectors: new Set(), samples: [] };
    map.set(key, entry);
  }
  entry.usage_count += 1;
  entry.case_ids.add(record.case_id);
  entry.selectors.add(record.selector);
  if (entry.samples.length < sampleLimit) entry.samples.push(sample);
  return entry;
};

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  for (const item of bindings.cases) {
    const viewport = { width: Math.round(item.width), height: Math.round(item.height) };
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    const url = new URL(item.astro.route, origin).href;
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
    await page.waitForTimeout(200);
    const observed = await page.evaluate(({ caseId, vw, vh }) => {
      const rgba = value => {
        const match = String(value).match(/rgba?\(\s*([\d.]+)[, ]+\s*([\d.]+)[, ]+\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)/i);
        return match ? [Number(match[1]), Number(match[2]), Number(match[3]), match[4] == null ? 1 : Number(match[4])] : null;
      };
      const blend = (top, bottom) => {
        const alpha = top[3] + bottom[3] * (1 - top[3]);
        if (!alpha) return [0, 0, 0, 0];
        return [0, 1, 2].map(index => (top[index] * top[3] + bottom[index] * bottom[3] * (1 - top[3])) / alpha).concat(alpha);
      };
      const luminance = rgb => {
        const channel = value => { const c = value / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
        return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
      };
      const ratio = (a, b) => { const l1 = luminance(a), l2 = luminance(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
      const selector = element => {
        const id = element.id ? `#${element.id}` : '';
        const classes = [...element.classList].slice(0, 4).map(name => `.${name}`).join('');
        const data = [...element.attributes].find(attribute => attribute.name.startsWith('data-'));
        return `${element.tagName.toLowerCase()}${id}${classes}${!id && !classes && data ? `[${data.name}]` : ''}`;
      };
      const directText = element => [...element.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join(' ').replace(/\s+/g, ' ').trim();
      const effectiveBackground = element => {
        let current = element;
        let composite = [255, 255, 255, 1];
        let complex = false;
        const layers = [];
        while (current) {
          const style = getComputedStyle(current);
          if (style.backgroundImage && style.backgroundImage !== 'none') complex = true;
          const parsed = rgba(style.backgroundColor);
          if (parsed && parsed[3] > 0) {
            layers.push(style.backgroundColor);
            composite = blend(parsed, composite);
            if (parsed[3] >= 0.999) break;
          }
          current = current.parentElement;
        }
        return { rgba: composite, css: `rgb(${composite.slice(0, 3).map(Math.round).join(', ')})`, complex, layers };
      };

      const colorRecords = [];
      const typeRecords = [];
      const contrastRecords = [];
      const elements = [...document.querySelectorAll('*')];
      for (const element of elements) {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const visible = style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < vh && rect.left < vw;
        if (!visible) continue;
        const sel = selector(element);
        const base = { case_id: caseId, selector: sel };
        const pushColor = (kind, value) => {
          const parsed = rgba(value);
          if (parsed && parsed[3] > 0) colorRecords.push({ ...base, kind, value, rgba: parsed });
        };
        pushColor('background', style.backgroundColor);
        for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
          if (parseFloat(style[`border${side}Width`]) > 0 && style[`border${side}Style`] !== 'none') pushColor(`border-${side.toLowerCase()}`, style[`border${side}Color`]);
        }
        if (parseFloat(style.outlineWidth) > 0 && style.outlineStyle !== 'none') pushColor('outline', style.outlineColor);
        if (element instanceof SVGElement) {
          pushColor('svg-fill', style.fill);
          pushColor('svg-stroke', style.stroke);
        }
        const text = directText(element) || (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement ? element.value || element.placeholder : '');
        if (!text) continue;
        pushColor('text', style.color);
        const type = {
          ...base,
          font_family: style.fontFamily,
          font_size: style.fontSize,
          font_weight: style.fontWeight,
          font_style: style.fontStyle,
          line_height: style.lineHeight,
          letter_spacing: style.letterSpacing,
          text_transform: style.textTransform,
          text_decoration: style.textDecorationLine,
          text_align: style.textAlign,
          white_space: style.whiteSpace,
          overflow: style.overflow,
          text_overflow: style.textOverflow,
          sample_text: text.slice(0, 160),
          rect: { width: rect.width, height: rect.height }
        };
        typeRecords.push(type);
        const foreground = rgba(style.color);
        const background = effectiveBackground(element);
        if (foreground && foreground[3] > 0) {
          const compositedForeground = blend(foreground, background.rgba);
          const contrastRatio = ratio(compositedForeground, background.rgba);
          const size = parseFloat(style.fontSize);
          const weight = Number(style.fontWeight) || 400;
          const large = size >= 24 || size >= 18.66 && weight >= 700;
          contrastRecords.push({ ...base, foreground: style.color, background: background.css, background_layers: background.layers, complex_underlay: background.complex, ratio: contrastRatio, large_text: large, aa_pass: background.complex ? null : contrastRatio >= (large ? 3 : 4.5), sample_text: text.slice(0, 160) });
        }
      }
      return { colorRecords, typeRecords, contrastRecords, visible_elements: elements.length };
    }, { caseId: item.case_id, vw: viewport.width, vh: viewport.height });

    for (const record of observed.colorRecords) {
      const key = `${record.kind}|${record.value}`;
      add(colors, key, { kind: record.kind, value: record.value, rgba: record.rgba }, record, { case_id: record.case_id, selector: record.selector });
    }
    for (const record of observed.typeRecords) {
      const base = Object.fromEntries(Object.entries(record).filter(([key]) => !['case_id', 'selector', 'sample_text', 'rect'].includes(key)));
      const key = JSON.stringify(base);
      add(typography, key, base, record, { case_id: record.case_id, selector: record.selector, text: record.sample_text, rect: record.rect });
    }
    for (const record of observed.contrastRecords) {
      const base = { foreground: record.foreground, background: record.background, complex_underlay: record.complex_underlay, large_text: record.large_text };
      const key = JSON.stringify(base);
      const entry = add(contrasts, key, { ...base, tested_count: 0, pass_count: 0, fail_count: 0, unresolved_count: 0, min_ratio: null, max_ratio: null }, record, { case_id: record.case_id, selector: record.selector, text: record.sample_text, ratio: record.ratio, aa_pass: record.aa_pass, background_layers: record.background_layers });
      entry.tested_count += 1;
      if (record.aa_pass == null) entry.unresolved_count += 1;
      else if (record.aa_pass) entry.pass_count += 1;
      else entry.fail_count += 1;
      entry.min_ratio = entry.min_ratio == null ? record.ratio : Math.min(entry.min_ratio, record.ratio);
      entry.max_ratio = entry.max_ratio == null ? record.ratio : Math.max(entry.max_ratio, record.ratio);
    }
    cases.push({ case_id: item.case_id, route: item.astro.route, viewport, status: response?.status() ?? null, colors: observed.colorRecords.length, typography: observed.typeRecords.length, contrasts: observed.contrastRecords.length });
    await page.close();
  }
} finally {
  await browser.close();
}

const finalize = entry => ({ ...entry, case_ids: [...entry.case_ids].sort(), selectors: [...entry.selectors].sort() });
const receipt = {
  schema_version: 'foundation-audit.astro-browser-computed.v1',
  captured_at: new Date().toISOString(),
  origin,
  astro_commit: bindings.authority.astro_commit,
  design_system_commit: bindings.authority.design_system_commit,
  scope: { cases: cases.length, desktop: cases.filter(item => item.viewport.width > 480).length, mobile: cases.filter(item => item.viewport.width <= 480).length },
  cases,
  colors: [...colors.values()].map(finalize).sort((a, b) => b.usage_count - a.usage_count || `${a.kind}:${a.value}`.localeCompare(`${b.kind}:${b.value}`)),
  typography: [...typography.values()].map(finalize).sort((a, b) => b.usage_count - a.usage_count || JSON.stringify(a).localeCompare(JSON.stringify(b))),
  contrast: [...contrasts.values()].map(finalize).sort((a, b) => b.fail_count - a.fail_count || b.usage_count - a.usage_count),
  limitations: [
    'Only styles actually rendered inside the 34 bounded review viewports are counted.',
    'Complex image/gradient underlays are retained as unresolved contrast cases instead of receiving a fabricated flat-background score.',
    'Hover/active/disabled declarations require the source-state census and independent audit; this run observes the current rendered state plus native focusability only.'
  ]
};
const bytes = `${JSON.stringify(receipt, null, 2)}\n`;
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, bytes);
console.log(`${outputPath}: ${sha256(bytes)} (${receipt.scope.cases} cases, ${receipt.colors.length} color usages, ${receipt.typography.length} type usages)`);
