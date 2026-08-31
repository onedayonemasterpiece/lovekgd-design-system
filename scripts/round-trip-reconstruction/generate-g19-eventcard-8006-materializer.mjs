#!/usr/bin/env node
/**
 * Generate the Generation-19 event.real.8006 native Penpot payload.
 *
 * The generator is the lowest owning file. It binds the accepted G12 Current-A
 * expectations, the promoted resolved cases, the accepted G14 native-font
 * binding, the canonical SVGs and the accepted poster bytes into one
 * filesystem-independent Penpot.execute_code function body.
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.join(ROOT, 'catalog/penpot-executor/g19');
const EXPECTATIONS = 'catalog/penpot-executor/g12/independent-expectations.json';
const FONT_BINDING = 'catalog/penpot-executor/g14/font-source-binding.json';
const ASTRO_BINDING = 'catalog/penpot-executor/g12/astro-evidence-binding.json';
const DESCENDANTS = 'catalog/penpot-executor/g19/frozen-eventcard-8006-descendants.json';
const REGIONS = 'catalog/penpot-executor/g12/frozen-evidence/regions.json';
const MEDIA_8006 = 'catalog/penpot-executor/g10/input-media/dd8834258d4a1ebde029aca1960bdd224bdf636d3fd8aee8fc7824012475de8b.webp';
const MEDIA_2182 = 'catalog/fixtures/ui-reference-events/v2/assets/99d4b75ef3291c90e1457b6fdc3fe89e519b327f9d6c8ff56cd95f763e71ab1e.webp';
const ACTION_ASSETS = {
  notInterested: 'catalog/asp-production-conveyor-v3/f0/assets/free-collection/not-interested.svg',
  calendar: 'catalog/asp-production-conveyor-v3/f0/assets/free-collection/calendar-add.svg',
  share: 'catalog/asp-production-conveyor-v3/f0/assets/free-collection/share.svg',
  like: 'catalog/asp-production-conveyor-v3/f0/assets/free-collection/favorite-outline.svg',
};
const INPUTS = [
  EXPECTATIONS,
  FONT_BINDING,
  ASTRO_BINDING,
  DESCENDANTS,
  REGIONS,
  MEDIA_8006,
  MEDIA_2182,
  ...Object.values(ACTION_ASSETS),
  'catalog/ui-components/event-card-large/component-contract.v2.json',
  'catalog/ui-conformance/free-collection/g4/resolved/eventcard.desktop-wide-calendar.8006.resolved-render-case.json',
  'catalog/ui-conformance/free-collection/g4/resolved/eventcard.mobile-wide-calendar.8006.resolved-render-case.json',
  'catalog/ui-conformance/free-collection/g4/resolved/eventcard.desktop-packed-calendar-absent.2182.resolved-render-case.json',
  'catalog/ui-conformance/free-collection/g4/resolved/eventcard.mobile-packed-calendar-absent.2182.resolved-render-case.json',
  'catalog/ui-conformance/free-collection/g4/resolved/resolved-cases.index.json',
  'catalog/materialization-bundles/eventcard-free-slice.g4.ready-v1.json',
  'catalog/fixtures/ui-reference-events/v2/events/event.real.8006.json',
  'catalog/fixtures/ui-reference-events/v2/events/event.real.2182.json',
];
const ACCEPTED_HASHES = {
  [EXPECTATIONS]: '0665e55fd069375306cf13a8bbe18ce6bdb80c5303d7ef069fc264671960980d',
  [FONT_BINDING]: '57e84a4c90545817744405cb7c735fe43831348fd568e74f6b36c2d0980ce3d0',
  [ASTRO_BINDING]: '7334a602497f172168a03c4c62b4c6548f7bff0c45b0777c350cc1919ee69645',
  [DESCENDANTS]: '8d2954d235c6dde7e2297ede6737a818db290fce16bbf2f599943e85eceb1a8d',
  [REGIONS]: 'ce4bff02b0de75aca895507e17bbee27d44c5728dd800baece3ab4e098a77ecf',
  [MEDIA_8006]: 'dd8834258d4a1ebde029aca1960bdd224bdf636d3fd8aee8fc7824012475de8b',
  [MEDIA_2182]: '99d4b75ef3291c90e1457b6fdc3fe89e519b327f9d6c8ff56cd95f763e71ab1e',
  [ACTION_ASSETS.notInterested]: '2716788d41848f0332bf0cd7f4f16c2b9f58b2dd73a05345eae7ae788d2ade98',
  [ACTION_ASSETS.calendar]: '0089a7c95e9366540feca517c143b6f70b994d2077272f6a064e40c7d5131ae7',
  [ACTION_ASSETS.share]: 'c8fe389bb046818566e92900418ca74cb986369e9539c3a561878250fde819cb',
  [ACTION_ASSETS.like]: '8f94e7f1e1e8abdf27cb207b300699ef1dff5090c34fafd7331326ae11214df7',
  'catalog/ui-components/event-card-large/component-contract.v2.json': '72385737a289f43090dd8d388497f755141e78f56a14576e4221fb817ab526fb',
  'catalog/ui-conformance/free-collection/g4/resolved/eventcard.desktop-wide-calendar.8006.resolved-render-case.json': '876abb966fb9ae49f5196f02367e54103bcb3ed1eceb2f9e818f500a5b77d855',
  'catalog/ui-conformance/free-collection/g4/resolved/eventcard.mobile-wide-calendar.8006.resolved-render-case.json': '4a388f64cea110cb9d5a3ac2b3ee6400fa68e7f9d0c33df3c467372a670ece82',
  'catalog/ui-conformance/free-collection/g4/resolved/eventcard.desktop-packed-calendar-absent.2182.resolved-render-case.json': '1627bf9234042f70af04c8be4a027899434487c6080872c5e646b885c720254d',
  'catalog/ui-conformance/free-collection/g4/resolved/eventcard.mobile-packed-calendar-absent.2182.resolved-render-case.json': '339b8e84b62668c3e61edd1916de3c55d1c71a3c4664a521d53b62255ddad7cc',
  'catalog/ui-conformance/free-collection/g4/resolved/resolved-cases.index.json': '263a25d878c8b2f8c47be2de4d20f82db3088107d326275016c1e7203b05cf34',
  'catalog/materialization-bundles/eventcard-free-slice.g4.ready-v1.json': '600362047b24df707712598c6ccf2b79047aad62a143afbfdb41daa103a5351d',
  'catalog/fixtures/ui-reference-events/v2/events/event.real.8006.json': 'be2bf3ddb51c8b09afd80e3039776c03807c5f41fc4d0ad769980c65b51ee57b',
  'catalog/fixtures/ui-reference-events/v2/events/event.real.2182.json': 'b3131d93e4430c6abc6ab2da3b113b1480d5117d2c23ed8f7843fe517319308d',
};

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const json = (bytes) => JSON.parse(bytes.toString('utf8'));

// Penpot's plugin runtime currently exposes TextEncoder but not WebCrypto.
// Keep transport verification self-contained instead of weakening the sealed
// payload contract or depending on a transient browser global.
function sha256Utf8Text(text) {
  const bytes = [];
  for (const character of text) {
    const code = character.codePointAt(0);
    if (code < 0x80) bytes.push(code);
    else if (code < 0x800) bytes.push(0xc0 | (code >>> 6), 0x80 | (code & 0x3f));
    else if (code < 0x10000) bytes.push(0xe0 | (code >>> 12), 0x80 | ((code >>> 6) & 0x3f), 0x80 | (code & 0x3f));
    else bytes.push(0xf0 | (code >>> 18), 0x80 | ((code >>> 12) & 0x3f), 0x80 | ((code >>> 6) & 0x3f), 0x80 | (code & 0x3f));
  }
  const constants = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
  ];
  const state = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const total = Math.ceil((bytes.length + 1 + 8) / 64) * 64;
  const data = new Uint8Array(total);
  data.set(bytes);
  data[bytes.length] = 0x80;
  const bits = bytes.length * 8;
  const high = Math.floor(bits / 0x100000000);
  const low = bits >>> 0;
  for (let i = 0; i < 4; i += 1) data[total - 8 + i] = (high >>> ((3 - i) * 8)) & 0xff;
  for (let i = 0; i < 4; i += 1) data[total - 4 + i] = (low >>> ((3 - i) * 8)) & 0xff;
  const rotate = (value, amount) => (value >>> amount) | (value << (32 - amount));
  for (let offset = 0; offset < total; offset += 64) {
    const words = new Uint32Array(64);
    for (let i = 0; i < 16; i += 1) words[i] = ((data[offset + i * 4] << 24) | (data[offset + i * 4 + 1] << 16) | (data[offset + i * 4 + 2] << 8) | data[offset + i * 4 + 3]) >>> 0;
    for (let i = 16; i < 64; i += 1) {
      const a = words[i - 15], b = words[i - 2];
      const s0 = rotate(a, 7) ^ rotate(a, 18) ^ (a >>> 3);
      const s1 = rotate(b, 17) ^ rotate(b, 19) ^ (b >>> 10);
      words[i] = (words[i - 16] + s0 + words[i - 7] + s1) >>> 0;
    }
    let [a,b,c,d,e,f,g,h] = state;
    for (let i = 0; i < 64; i += 1) {
      const s1 = rotate(e, 6) ^ rotate(e, 11) ^ rotate(e, 25);
      const choice = (e & f) ^ (~e & g);
      const first = (h + s1 + choice + constants[i] + words[i]) >>> 0;
      const s0 = rotate(a, 2) ^ rotate(a, 13) ^ rotate(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const second = (s0 + majority) >>> 0;
      h=g; g=f; f=e; e=(d+first)>>>0; d=c; c=b; b=a; a=(first+second)>>>0;
    }
    state[0]=(state[0]+a)>>>0; state[1]=(state[1]+b)>>>0; state[2]=(state[2]+c)>>>0; state[3]=(state[3]+d)>>>0;
    state[4]=(state[4]+e)>>>0; state[5]=(state[5]+f)>>>0; state[6]=(state[6]+g)>>>0; state[7]=(state[7]+h)>>>0;
  }
  return state.map((value) => value.toString(16).padStart(8, '0')).join('');
}

// `Penpot.execute_code` has a bounded source envelope. Keep the owning source
// readable, then remove only lexically irrelevant comments/whitespace from the
// serialized function. Quoted strings and template literals are copied byte
// for byte; identifier and ++/-- token boundaries retain one space.
function compactGeneratedFunction(fn) {
  const source = fn.toString();
  const isWord = (character) => /[A-Za-z0-9_$]/.test(character || '');
  let output = '', index = 0, quote = null, pendingSpace = false;
  while (index < source.length) {
    const character = source[index], next = source[index + 1];
    if (quote) {
      output += character;
      if (character === '\\') {
        if (index + 1 < source.length) output += source[++index];
      } else if (character === quote) quote = null;
      index += 1;
      continue;
    }
    if (character === "'" || character === '"' || character === '`') {
      if (pendingSpace && isWord(output.at(-1)) && isWord(character)) output += ' ';
      pendingSpace = false;
      quote = character;
      output += character;
      index += 1;
      continue;
    }
    if (character === '/' && next === '/') {
      index += 2;
      while (index < source.length && source[index] !== '\n') index += 1;
      pendingSpace = true;
      continue;
    }
    if (character === '/' && next === '*') {
      index += 2;
      while (index < source.length && !(source[index] === '*' && source[index + 1] === '/')) index += 1;
      index += 2;
      pendingSpace = true;
      continue;
    }
    if (/\s/.test(character)) {
      pendingSpace = true;
      index += 1;
      continue;
    }
    if (pendingSpace) {
      const previous = output.at(-1);
      if ((isWord(previous) && isWord(character)) || (previous === '+' && character === '+') || (previous === '-' && character === '-')) output += ' ';
      pendingSpace = false;
    }
    output += character;
    index += 1;
  }
  return output;
}

const cssNumber = (value) => Number.parseFloat(String(value ?? '0')) || 0;
const rgbToHex = (value) => {
  const match = String(value ?? '').match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return '#000000';
  return `#${match.slice(1, 4).map((part) => Number(part).toString(16).padStart(2, '0')).join('')}`;
};
const opacity = (value) => {
  const match = String(value ?? '').match(/^rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)$/);
  return match ? Number(match[1]) : 1;
};

function compactSlot(slot) {
  return {
    box: slot.box,
    text: slot.text,
    lineFragments: slot.line_fragments || [],
    style: {
      fontSize: cssNumber(slot.style.fontSize),
      lineHeight: cssNumber(slot.style.lineHeight),
      letterSpacing: cssNumber(slot.style.letterSpacing),
      color: rgbToHex(slot.style.color),
      colorOpacity: opacity(slot.style.color),
      backgroundColor: rgbToHex(slot.style.backgroundColor),
      backgroundOpacity: opacity(slot.style.backgroundColor),
      radiusTL: cssNumber(slot.style.borderTopLeftRadius),
      radiusTR: cssNumber(slot.style.borderTopRightRadius),
      radiusBR: cssNumber(slot.style.borderBottomRightRadius),
      radiusBL: cssNumber(slot.style.borderBottomLeftRadius),
      strokeWidth: cssNumber(slot.style.borderTopWidth),
      strokeColor: rgbToHex(slot.style.borderTopColor),
      strokeOpacity: opacity(slot.style.borderTopColor),
    },
    resolvedFont: slot.resolved_font ?? null,
  };
}

function deriveDescendantCases(regions) {
  const selectors = {
    'eventcard.desktop-wide-calendar.8006': { not_interested: { root: 'button[18]', icon: 'svg[19]', label: 'span[23]' }, calendar: { root: 'a[24]', icon: 'svg[25]', label: 'span[29]' }, share: { root: 'button[31]', icon: 'svg[32]', label: 'span[34]', count: 'span[35]' }, like: { root: 'button[36]', icon: 'svg[37]', count: 'span[40]' } },
    'eventcard.desktop-packed-calendar-absent.2182': { not_interested: { root: 'button[18]', icon: 'svg[19]', label: 'span[23]' }, share: { root: 'button[25]', icon: 'svg[26]', label: 'span[28]', count: 'span[29]' }, like: { root: 'button[30]', icon: 'svg[31]', count: 'span[34]' } },
    'eventcard.mobile-wide-calendar.8006': { not_interested: { root: 'button[18]', icon: 'svg[19]', label: 'span[23]' }, calendar: { root: 'a[24]', icon: 'svg[25]', label: 'span[29]' }, share: { root: 'button[31]', icon: 'svg[32]', label: 'span[34]', count: 'span[35]' }, like: { root: 'button[36]', icon: 'svg[37]', count: 'span[40]' } },
    'eventcard.mobile-packed-calendar-absent.2182': { not_interested: { root: 'button[18]', icon: 'svg[19]', label: 'span[23]' }, share: { root: 'button[25]', icon: 'svg[26]', label: 'span[28]', count: 'span[29]' }, like: { root: 'button[30]', icon: 'svg[31]', count: 'span[34]' } },
  };
  const result = {};
  for (const [caseId, actions] of Object.entries(selectors)) {
    const region = regions.regions.find((candidate) => candidate.id === caseId);
    if (!region) throw new Error(`frozen region missing ${caseId}`);
    const nodes = Object.fromEntries(region.descendants.map((node) => [node.node_key, node]));
    result[caseId] = {};
    for (const [action, parts] of Object.entries(actions)) {
      const root = nodes[parts.root]?.box;
      if (!root) throw new Error(`frozen action root missing ${caseId}/${action}`);
      const out = {};
      for (const [part, nodeKey] of Object.entries(parts)) {
        if (part === 'root') continue;
        const box = nodes[nodeKey]?.box;
        if (!box) throw new Error(`frozen action descendant missing ${caseId}/${action}/${part}`);
        out[part] = box.width === 0 || box.height === 0 ? { hidden: true } : { x: Number((box.x - root.x).toFixed(3)), y: Number((box.y - root.y).toFixed(3)), width: box.width, height: box.height, hidden: false };
      }
      result[caseId][action] = out;
    }
  }
  return result;
}

async function repairTextMetricsPhase(P) {
  const boardId = '313fb1ed-0d5c-8095-8008-9108df52b2ce', payload = P.payloadSha256, allowed = [1.08, 1.15, 1.2, 1.25, 1.6];
  const active = () => {
    let c;
    try { c = JSON.parse(penpot.currentFile?.getSharedPluginData?.('kenigevents', 'asp-active-run-v1') || 'null'); } catch { throw new Error('MATERIALIZATION_RUN_NOT_ACTIVE'); }
    const e = P.runControl;
    if (c?.schema !== 'kenigevents.asp-run-control.v1' || c.run_id !== e.runId || c.writer_id !== e.writerId || c.state !== 'ACTIVE' || c.contract_sha256 !== e.contractSha256 || c.page_profile_sha256 !== e.pageProfileSha256 || c.asset_registry_sha256 !== e.assetRegistrySha256 || c.geometry_proof_sha256 !== e.geometryProofSha256) throw new Error('MATERIALIZATION_RUN_NOT_ACTIVE');
    return c;
  };
  const children = (s) => Array.from(s?.children || []), walk = (s) => [s, ...children(s).flatMap(walk)], board = children(penpot.currentPage?.root).find((s) => s.id === boardId);
  active();
  if (!board || penpot.currentFile?.id !== P.fileId || penpot.currentPage?.id !== P.pageId) throw new Error('P91_TARGET_DRIFT');
  const roots = children(board), components = Array.from(penpot.library?.local?.components || []), cards = roots.filter((r) => r.getPluginData?.('kenigevents-role') === 'accepted-card-master' && r.getPluginData?.('kenigevents-payload-sha256') === payload && r.getPluginData?.('kenigevents-build-state') === 'COMPLETE');
  const texts = cards.flatMap((r) => walk(r).filter((s) => s.type === 'text' && s.characters));
  const stableIds = { roots: roots.map((r) => r.id), components: components.map((c) => c.id), texts: texts.map((s) => s.id) };
  const census = { roots: roots.length, descendants: walk(board).length - 1, components: components.length, cards: cards.length, texts: texts.length };
  if (census.roots !== 18 || census.descendants !== 248 || census.components !== 18 || census.cards !== 4 || census.texts !== 38) throw new Error(`P91_TEXT_CENSUS_DRIFT: ${JSON.stringify(census)}`);
  if (roots.some((r) => r.getPluginData?.('kenigevents-payload-sha256') !== payload || r.getPluginData?.('kenigevents-build-state') !== 'COMPLETE' || !r.getPluginData?.('kenigevents-g19-marker')?.endsWith(':v3')) || components.some((c) => !stableIds.roots.includes(c.mainInstance?.()?.id))) throw new Error('P91_MANAGED_ROOT_IDENTITY_DRIFT');
  const preValidation = penpot.currentFile.validate();
  if (Array.isArray(preValidation) ? preValidation.length : preValidation != null) throw new Error('P91_VALIDATION_FAILED');
  const rows = texts.map((s) => {
    const fs = Number(s.fontSize), lh = Number(s.lineHeight), ratio = lh > 2 ? Number((lh / fs).toFixed(6)) : lh;
    if (s.getPluginData?.('kenigevents-payload-sha256') !== payload || s.getPluginData?.('kenigevents-font-family') !== 'DejaVu Sans' || s.getPluginData?.('kenigevents-font-weight') !== '700' || s.getPluginData?.('kenigevents-font-style') !== 'normal' || !s.getPluginData?.('kenigevents-font-runtime-id') || !s.getPluginData?.('kenigevents-font-variant-id') || s.getPluginData?.('kenigevents-font-source-sha256') !== P.fontSources[700] || !Number.isFinite(fs) || !Number.isFinite(lh) || !allowed.some((v) => Math.abs(v - ratio) < 1e-6)) throw new Error('P91_TEXT_METRIC_DRIFT');
    return { s, lh, ratio };
  });
  const changed = [];
  const block = rows.some((row) => row.lh > 2) ? (active(), penpot.history.undoBlockBegin()) : null;
  try {
    for (const row of rows) if (row.lh > 2) { active(); row.s.lineHeight = String(row.ratio); changed.push(row.s.id); }
  } finally {
    if (block) penpot.history.undoBlockFinish(block);
  }
  active();
  await new Promise((resolve) => setTimeout(resolve, 100));
  active();
  for (const s of texts) {
    const b = s.textBounds, t = 2; let root = s;
    while (root.parent && root.parent.id !== boardId) root = root.parent;
    if (!b || ![b.x, b.y, b.width, b.height].every(Number.isFinite) || b.width <= 0 || b.height <= 0 || b.x < s.x - t || b.y < s.y - t || b.x + b.width > s.x + s.width + t || b.y + b.height > s.y + s.height + t || b.x < root.x - t || b.y < root.y - t || b.x + b.width > root.x + root.width + t || b.y + b.height > root.y + root.height + t) throw new Error('P91_TEXT_BOUNDS_NOT_CONTAINED');
  }
  const validation = penpot.currentFile.validate();
  if (Array.isArray(validation) ? validation.length : validation != null) throw new Error('P91_VALIDATION_FAILED');
  if (JSON.stringify(stableIds) !== JSON.stringify({ roots: children(board).map((r) => r.id), components: Array.from(penpot.library?.local?.components || []).map((c) => c.id), texts: cards.flatMap((r) => walk(r).filter((s) => s.type === 'text' && s.characters)).map((s) => s.id) })) throw new Error('P91_STABLE_ID_DRIFT');
  const label = `G19 P2 V3 P91_TEXT_METRICS · ${payload.slice(0, 12)}`;
  active();
  const versions = Array.from(await penpot.currentFile.findVersions());
  active();
  let version = versions.find((v) => (v.label || v.name) === label) || null;
  if (changed.length) { active(); version = await penpot.currentFile.saveVersion(label); active(); }
  return { schema: 'kenigevents.penpot.g19.text-metrics-receipt.v1', phaseId: 'P91_TEXT_METRICS', terminalState: changed.length ? 'SUCCEEDED' : 'SUCCEEDED_IDEMPOTENT_REUSE', mutations: changed.length, mutatedObjectIds: changed, textCount: texts.length, stableIds, validation: Array.isArray(validation) ? validation : [], version: { id: version?.id || null, label } };
}

async function invalidateTextLayoutCanaryPhase(P) {
  const boardId=P.boardId,payload=P.payloadSha256,canaryId='313fb1ed-0d5c-8095-8008-914c79b02bd3',parentId='313fb1ed-0d5c-8095-8008-914c79b02bd2',cardId='313fb1ed-0d5c-8095-8008-914c76615924',componentId='313fb1ed-0d5c-8095-8008-912ba15885f1',mainId='313fb1ed-0d5c-8095-8008-912ba088700e',mark='kenigevents-p92-layout-canary',stableKey='kenigevents-p92-stable-ids',beforeKey='kenigevents-p92-before',allowed=[1.08,1.15,1.2,1.25,1.6],eps=.1;
  const active = () => {
    let c; try { c = JSON.parse(penpot.currentFile?.getSharedPluginData?.('kenigevents', 'asp-active-run-v1') || 'null'); } catch { throw new Error('MATERIALIZATION_RUN_NOT_ACTIVE'); }
    const e = P.runControl;
    if (c?.schema !== 'kenigevents.asp-run-control.v1' || c.run_id !== e.runId || c.writer_id !== e.writerId || c.state !== 'ACTIVE' || c.contract_sha256 !== e.contractSha256 || c.page_profile_sha256 !== e.pageProfileSha256 || c.asset_registry_sha256 !== e.assetRegistrySha256 || c.geometry_proof_sha256 !== e.geometryProofSha256) throw new Error('MATERIALIZATION_RUN_NOT_ACTIVE');
  };
  const children=(s)=>Array.from(s?.children||[]),walk=(s)=>[s,...children(s).flatMap(walk)],near=(a,b)=>Math.abs(Number(a)-Number(b))<=eps,contained=(s)=>{const b=s.textBounds,t=2;return !!b&&[b.x,b.y,b.width,b.height].every(Number.isFinite)&&b.width>0&&b.height>0&&b.x>=s.x-t&&b.y>=s.y-t&&b.x+b.width<=s.x+s.width+t&&b.y+b.height<=s.y+s.height+t;},detail=(s)=>({id:s.id,name:s.name,characters:s.characters,growType:s.growType,frame:{x:s.x,y:s.y,width:s.width,height:s.height},textBounds:s.textBounds?{x:s.textBounds.x,y:s.textBounds.y,width:s.textBounds.width,height:s.textBounds.height}:null,fontSize:s.fontSize,lineHeight:s.lineHeight,contained:contained(s)});
  active();
  const board = children(penpot.currentPage?.root).find((s) => s.id === boardId), roots = children(board), components = Array.from(penpot.library?.local?.components || []), cards = roots.filter((r) => r.getPluginData?.('kenigevents-role') === 'accepted-card-master' && r.getPluginData?.('kenigevents-payload-sha256') === payload && r.getPluginData?.('kenigevents-build-state') === 'COMPLETE'), texts = cards.flatMap((r) => walk(r).filter((s) => s.type === 'text' && s.characters));
  const census = { roots:roots.length,descendants:walk(board).length-1,components:components.length,cards:cards.length,texts:texts.length }, stableIds = { roots:roots.map((s)=>s.id),components:components.map((c)=>c.id),texts:texts.map((s)=>s.id) };
  if (!board || penpot.currentFile?.id !== P.fileId || penpot.currentPage?.id !== P.pageId || census.roots!==18 || census.descendants!==248 || census.components!==18 || census.cards!==4 || census.texts!==38) throw new Error(`P92_CANARY_CENSUS_DRIFT: ${JSON.stringify(census)}`);
  if (roots.some((r)=>r.getPluginData?.('kenigevents-payload-sha256')!==payload || r.getPluginData?.('kenigevents-build-state')!=='COMPLETE' || !r.getPluginData?.('kenigevents-g19-marker')?.endsWith(':v3')) || components.some((c)=>!stableIds.roots.includes(c.mainInstance?.()?.id))) throw new Error('P92_CANARY_IDENTITY_DRIFT');
  if ((penpot.currentFile.validate() || []).length) throw new Error('P92_CANARY_VALIDATION_FAILED');
  for (const s of texts) if (s.getPluginData?.('kenigevents-payload-sha256')!==payload || s.getPluginData?.('kenigevents-font-family')!=='DejaVu Sans' || s.getPluginData?.('kenigevents-font-weight')!=='700' || s.getPluginData?.('kenigevents-font-style')!=='normal' || !s.getPluginData?.('kenigevents-font-runtime-id') || !s.getPluginData?.('kenigevents-font-variant-id') || s.getPluginData?.('kenigevents-font-source-sha256')!==P.fontSources[700] || !allowed.some((v)=>Math.abs(v-Number(s.lineHeight))<1e-6)) throw new Error('P92_CANARY_TEXT_IDENTITY_DRIFT');
  const marked = texts.filter((s)=>s.getPluginData?.(mark));
  if (marked.length) {
    const s=marked[0],saved=JSON.parse(s.getPluginData?.(stableKey)||'null'),before=JSON.parse(s.getPluginData?.(beforeKey)||'null');
    if(marked.length!==1||s.id!==canaryId||s.getPluginData(mark)!==`${payload}:${canaryId}:PENDING_READBACK`||s.growType!=='auto-width'||s.characters!=='выставка'||!saved||!before||JSON.stringify(saved)!==JSON.stringify(stableIds))throw new Error('P92_CANARY_MARKER_DRIFT');
    return {schema:'kenigevents.penpot.g19.text-layout-canary-receipt.v1',phaseId:'P92_TEXT_LAYOUT_CANARY',terminalState:'CANARY_ALREADY_APPLIED_PENDING_READBACK',mutations:0,mutatedObjectIds:[],canaryId:s.id,census,stableIds,before,diagnostics:texts.map(detail)};
  }
  if(penpot.currentFile?.revn!==74)throw new Error('P92_CANARY_REVISION_DRIFT');
  const diagnostics = texts.map(detail), offenders = diagnostics.filter((d)=>!d.contained);
  if (offenders.length!==24) throw new Error(`P92_CANARY_BASELINE_DRIFT: ${JSON.stringify({contained:38-offenders.length,offenders})}`);
  const canary = texts.find((s)=>s.id===canaryId), before = diagnostics.find((d)=>d.id===canaryId);
  let card=canary,parent=canary?.parent;while(card?.parent&&card.parent.id!==boardId)card=card.parent;const component=parent?.component?.(),main=component?.mainInstance?.();
  if(!canary||!before||before.contained||card?.id!==cardId||parent?.id!==parentId||component?.id!==componentId||main?.id!==mainId||canary.name!=='label'||canary.characters!=='выставка'||canary.growType!=='fixed'||!near(canary.fontSize,11.52)||!near(canary.lineHeight,1.2)||canary.getPluginData?.('kenigevents-g19-child-marker')!=='kenigevents:g19:p2:event.meta.event-type.desktop.8006:v3:label'||canary.getPluginData?.('kenigevents-instance-case-id')!=='eventcard.desktop-packed-calendar-absent.2182'||parent.getPluginData?.('kenigevents-instance-slot')!=='event-type'||!near(canary.x,721.6249811202288)||!near(canary.y,566.172)||!near(canary.width,62.78099872350822)||!near(canary.height,14.000000178813934)||!near(before.textBounds?.x,721.6849975585938)||!near(before.textBounds?.y,566.552001953125)||!near(before.textBounds?.width,54.8800048828125)||!near(before.textBounds?.height,27.40997314453125))throw new Error(`P92_CANARY_TARGET_DRIFT: ${JSON.stringify({card:card?.id,parent:parent?.id,component:component?.id,main:main?.id,before})}`);
  const block = (active(),penpot.history.undoBlockBegin());
  try {
    // Official Penpot #10207: auto-width measurement settles only in a later
    // plugin execution. Do not resize/fix or judge bounds in this mutator.
    active(); canary.growType='auto-width';
    active(); canary.characters=canary.characters;
    active(); canary.setPluginData(stableKey,JSON.stringify(stableIds));
    active(); canary.setPluginData(beforeKey,JSON.stringify(before));
    active(); canary.setPluginData(mark,`${payload}:${canary.id}:PENDING_READBACK`);
  } finally { penpot.history.undoBlockFinish(block); }
  return {schema:'kenigevents.penpot.g19.text-layout-canary-receipt.v1',phaseId:'P92_TEXT_LAYOUT_CANARY',terminalState:'SUCCEEDED_CANARY_PENDING_READBACK',mutations:1,mutatedObjectIds:[canary.id],canaryId:canary.id,census,stableIds,containedBefore:14,offendersBefore:offenders};
}

function readTextLayoutCanaryPhase(P) {
  const boardId=P.boardId,payload=P.payloadSha256,canaryId='313fb1ed-0d5c-8095-8008-914c79b02bd3',cardId='313fb1ed-0d5c-8095-8008-914c76615924',mark='kenigevents-p92-layout-canary',stableKey='kenigevents-p92-stable-ids',beforeKey='kenigevents-p92-before';
  const active=()=>{let c;try{c=JSON.parse(penpot.currentFile?.getSharedPluginData?.('kenigevents','asp-active-run-v1')||'null');}catch{throw new Error('MATERIALIZATION_RUN_NOT_ACTIVE');}const e=P.runControl;if(c?.schema!=='kenigevents.asp-run-control.v1'||c.run_id!==e.runId||c.writer_id!==e.writerId||c.state!=='ACTIVE'||c.contract_sha256!==e.contractSha256||c.page_profile_sha256!==e.pageProfileSha256||c.asset_registry_sha256!==e.assetRegistrySha256||c.geometry_proof_sha256!==e.geometryProofSha256)throw new Error('MATERIALIZATION_RUN_NOT_ACTIVE');};
  const children=(s)=>Array.from(s?.children||[]),walk=(s)=>[s,...children(s).flatMap(walk)],contained=(s)=>{const b=s.textBounds,t=2;return !!b&&[b.x,b.y,b.width,b.height].every(Number.isFinite)&&b.width>0&&b.height>0&&b.x>=s.x-t&&b.y>=s.y-t&&b.x+b.width<=s.x+s.width+t&&b.y+b.height<=s.y+s.height+t;},detail=(s)=>({id:s.id,name:s.name,characters:s.characters,growType:s.growType,frame:{x:s.x,y:s.y,width:s.width,height:s.height},textBounds:s.textBounds?{x:s.textBounds.x,y:s.textBounds.y,width:s.textBounds.width,height:s.textBounds.height}:null,fontSize:s.fontSize,lineHeight:s.lineHeight,contained:contained(s)});
  active();const board=children(penpot.currentPage?.root).find((s)=>s.id===boardId),roots=children(board),components=Array.from(penpot.library?.local?.components||[]),cards=roots.filter((r)=>r.getPluginData?.('kenigevents-role')==='accepted-card-master'&&r.getPluginData?.('kenigevents-payload-sha256')===payload&&r.getPluginData?.('kenigevents-build-state')==='COMPLETE'),texts=cards.flatMap((r)=>walk(r).filter((s)=>s.type==='text'&&s.characters)),canary=texts.find((s)=>s.id===canaryId),diagnostics=texts.map(detail),after=diagnostics.find((d)=>d.id===canaryId),census={roots:roots.length,descendants:walk(board).length-1,components:components.length,cards:cards.length,texts:texts.length},stableIds={roots:roots.map((s)=>s.id),components:components.map((c)=>c.id),texts:texts.map((s)=>s.id)},saved=JSON.parse(canary?.getPluginData?.(stableKey)||'null'),before=JSON.parse(canary?.getPluginData?.(beforeKey)||'null');
  let root=canary;while(root?.parent&&root.parent.id!==boardId)root=root.parent;const b=canary?.textBounds,t=2,withinRoot=!!b&&b.x>=root.x-t&&b.y>=root.y-t&&b.x+b.width<=root.x+root.width+t&&b.y+b.height<=root.y+root.height+t,changed=!!before&&!!after&&(Math.abs(after.frame.width-before.frame.width)>.1||Math.abs(after.frame.height-before.frame.height)>.1||Math.abs(after.textBounds.width-before.textBounds.width)>.1||Math.abs(after.textBounds.height-before.textBounds.height)>.1);
  if(!canary||root?.id!==cardId||canary.getPluginData?.(mark)!==`${payload}:${canaryId}:PENDING_READBACK`||canary.characters!=='выставка'||canary.growType!=='auto-width'||!saved||!before||JSON.stringify(stableIds)!==JSON.stringify(saved)||census.roots!==18||census.descendants!==248||census.components!==18||census.cards!==4||census.texts!==38||(penpot.currentFile.validate()||[]).length)throw new Error('P92_CANARY_READBACK_DRIFT');
  if(!after.contained||!withinRoot||!changed||after.textBounds.height>before.frame.height+2)throw new Error(`P92_CANARY_NOT_IMPROVED: ${JSON.stringify({before,after,withinRoot,changed})}`);
  return {schema:'kenigevents.penpot.g19.text-layout-canary-readback.v1',phaseId:'P92_TEXT_LAYOUT_CANARY_READBACK',terminalState:'CANARY_MEASUREMENT_PASS',mutations:0,canaryId,before,after,improved:true,withinRoot:true,contained:diagnostics.filter((d)=>d.contained).length,offenders:diagnostics.filter((d)=>!d.contained),census,stableIds,validation:[]};
}

async function expandEventTypePeersPhase(P) {
  const boardId=P.boardId,payload=P.payloadSha256,r10Id='313fb1ed-0d5c-8095-8008-914c79b02bd3',stableKey='kenigevents-p92-stable-ids',mark='kenigevents-p93-event-type-peer',beforeKey='kenigevents-p93-before',eps=.1;
  const specs=[
    {id:'313fb1ed-0d5c-8095-8008-912c4b0ef96e',parent:'313fb1ed-0d5c-8095-8008-912c4b0ef96d',card:'313fb1ed-0d5c-8095-8008-912c45090653',component:'313fb1ed-0d5c-8095-8008-912ba15885f1',text:'встреча',caseId:'eventcard.desktop-wide-calendar.8006',leaf:'event.meta.event-type.desktop.8006',frame:[101.625,864.375,53.328,14],bounds:[101.685,864.755,45.44,27.41]},
    {id:'313fb1ed-0d5c-8095-8008-916b37256e16',parent:'313fb1ed-0d5c-8095-8008-916b37256e15',card:'313fb1ed-0d5c-8095-8008-916b340de148',component:'313fb1ed-0d5c-8095-8008-912c1da2711f',text:'встреча',caseId:'eventcard.mobile-wide-calendar.8006',leaf:'event.meta.event-type.mobile.8006',frame:[101.625,1630.079,53.328,14],bounds:[101.685,1630.459,45.44,27.41]},
    {id:'313fb1ed-0d5c-8095-8008-916bd488205f',parent:'313fb1ed-0d5c-8095-8008-916bd487ed21',card:'313fb1ed-0d5c-8095-8008-916bd0ab6c98',component:'313fb1ed-0d5c-8095-8008-912c1da2711f',text:'выставка',caseId:'eventcard.mobile-packed-calendar-absent.2182',leaf:'event.meta.event-type.mobile.8006',frame:[721.6250221379627,1449.812,62.78100133866167,14.000000178813934],bounds:[721.6849975585938,1450.1920166015625,54.8800048828125,27.4100341796875]}
  ];
  const active=()=>{let c;try{c=JSON.parse(penpot.currentFile?.getSharedPluginData?.('kenigevents','asp-active-run-v1')||'null');}catch{throw new Error('MATERIALIZATION_RUN_NOT_ACTIVE');}const e=P.runControl;if(c?.schema!=='kenigevents.asp-run-control.v1'||c.run_id!==e.runId||c.writer_id!==e.writerId||c.state!=='ACTIVE'||c.contract_sha256!==e.contractSha256||c.page_profile_sha256!==e.pageProfileSha256||c.asset_registry_sha256!==e.assetRegistrySha256||c.geometry_proof_sha256!==e.geometryProofSha256)throw new Error('MATERIALIZATION_RUN_NOT_ACTIVE');};
  const children=(s)=>Array.from(s?.children||[]),walk=(s)=>[s,...children(s).flatMap(walk)],near=(a,b)=>Math.abs(Number(a)-Number(b))<=eps,contained=(s)=>{const b=s.textBounds,t=2;return !!b&&[b.x,b.y,b.width,b.height].every(Number.isFinite)&&b.width>0&&b.height>0&&b.x>=s.x-t&&b.y>=s.y-t&&b.x+b.width<=s.x+s.width+t&&b.y+b.height<=s.y+s.height+t;},detail=(s)=>({id:s.id,name:s.name,characters:s.characters,growType:s.growType,frame:{x:s.x,y:s.y,width:s.width,height:s.height},textBounds:s.textBounds?{x:s.textBounds.x,y:s.textBounds.y,width:s.textBounds.width,height:s.textBounds.height}:null,fontSize:s.fontSize,lineHeight:s.lineHeight,contained:contained(s)});
  active();const board=children(penpot.currentPage?.root).find((s)=>s.id===boardId),roots=children(board),components=Array.from(penpot.library?.local?.components||[]),cards=roots.filter((r)=>r.getPluginData?.('kenigevents-role')==='accepted-card-master'&&r.getPluginData?.('kenigevents-payload-sha256')===payload&&r.getPluginData?.('kenigevents-build-state')==='COMPLETE'),texts=cards.flatMap((r)=>walk(r).filter((s)=>s.type==='text'&&s.characters)),stableIds={roots:roots.map((s)=>s.id),components:components.map((c)=>c.id),texts:texts.map((s)=>s.id)},r10=texts.find((s)=>s.id===r10Id),saved=JSON.parse(r10?.getPluginData?.(stableKey)||'null'),targets=specs.map((q)=>texts.find((s)=>s.id===q.id));
  if(!board||roots.length!==18||walk(board).length-1!==248||components.length!==18||cards.length!==4||texts.length!==38||!saved||JSON.stringify(saved)!==JSON.stringify(stableIds)||(penpot.currentFile.validate()||[]).length)throw new Error('P93_EVENT_TYPE_CENSUS_DRIFT');
  if(!r10||r10.growType!=='auto-width'||r10.characters!=='выставка'||!contained(r10))throw new Error('P93_R10_CANARY_NOT_PROVEN');
  const marked=targets.filter((s)=>s?.getPluginData?.(mark));
  if(marked.length){if(marked.length!==3||targets.some((s,i)=>!s||s.growType!=='auto-width'||s.characters!==specs[i].text||s.getPluginData?.('kenigevents-payload-sha256')!==payload||s.getPluginData(mark)!==`${payload}:${s.id}:PENDING_READBACK`||!s.getPluginData(beforeKey)))throw new Error('P93_EVENT_TYPE_MARKER_DRIFT');return {schema:'kenigevents.penpot.g19.event-type-peers-receipt.v1',phaseId:'P93_EVENT_TYPE_PEERS',terminalState:'PEERS_ALREADY_APPLIED_PENDING_READBACK',mutations:0,mutatedObjectIds:[],targetIds:specs.map((s)=>s.id),stableIds};}
  if(penpot.currentFile?.revn!==75)throw new Error('P93_EVENT_TYPE_REVISION_DRIFT');
  const diagnostics=texts.map(detail);if(diagnostics.filter((d)=>!d.contained).length!==23)throw new Error('P93_EVENT_TYPE_BASELINE_DRIFT');
  for(let i=0;i<specs.length;i++){const q=specs[i],s=targets[i],d=diagnostics.find((x)=>x.id===q.id),p=s?.parent,c=p?.component?.(),m=c?.mainInstance?.(),f=q.frame,b=q.bounds;let root=s;while(root?.parent&&root.parent.id!==boardId)root=root.parent;if(!s||!d||d.contained||p?.id!==q.parent||root?.id!==q.card||s.name!=='label'||s.characters!==q.text||s.growType!=='fixed'||!near(s.fontSize,11.52)||!near(s.lineHeight,1.2)||s.getPluginData?.('kenigevents-payload-sha256')!==payload||s.getPluginData?.('kenigevents-font-family')!=='DejaVu Sans'||s.getPluginData?.('kenigevents-font-weight')!=='700'||s.getPluginData?.('kenigevents-font-style')!=='normal'||s.getPluginData?.('kenigevents-font-source-sha256')!==P.fontSources[700]||!s.getPluginData?.('kenigevents-font-runtime-id')||!s.getPluginData?.('kenigevents-font-variant-id')||s.getPluginData?.('kenigevents-g19-child-marker')!==`kenigevents:g19:p2:${q.leaf}:v3:label`||s.getPluginData?.('kenigevents-instance-case-id')!==q.caseId||p.getPluginData?.('kenigevents-instance-slot')!=='event-type'||c?.id!==q.component||c?.name!==q.leaf||m?.getPluginData?.('kenigevents-g19-marker')!==`kenigevents:g19:p2:${q.leaf}:v3`||m.getPluginData?.('kenigevents-payload-sha256')!==payload||![s.x,s.y,s.width,s.height].every((v,j)=>near(v,f[j]))||![d.textBounds?.x,d.textBounds?.y,d.textBounds?.width,d.textBounds?.height].every((v,j)=>near(v,b[j])))throw new Error(`P93_EVENT_TYPE_TARGET_DRIFT: ${JSON.stringify({spec:q,parent:p?.id,root:root?.id,component:{id:c?.id,name:c?.name},main:{marker:m?.getPluginData?.('kenigevents-g19-marker'),payload:m?.getPluginData?.('kenigevents-payload-sha256')},detail:d,caseId:s?.getPluginData?.('kenigevents-instance-case-id'),slot:p?.getPluginData?.('kenigevents-instance-slot'),childMarker:s?.getPluginData?.('kenigevents-g19-child-marker'),payload:s?.getPluginData?.('kenigevents-payload-sha256')})}`);}
  const block=(active(),penpot.history.undoBlockBegin()),changed=[];try{for(let i=0;i<targets.length;i++){const s=targets[i],before=detail(s);active();s.growType='auto-width';active();s.characters=s.characters;active();s.setPluginData(beforeKey,JSON.stringify(before));active();s.setPluginData(mark,`${payload}:${s.id}:PENDING_READBACK`);changed.push(s.id);}}finally{penpot.history.undoBlockFinish(block);}
  return {schema:'kenigevents.penpot.g19.event-type-peers-receipt.v1',phaseId:'P93_EVENT_TYPE_PEERS',terminalState:'SUCCEEDED_PEERS_PENDING_READBACK',mutations:3,mutatedObjectIds:changed,targetIds:changed,stableIds,offendersBefore:23};
}

function readEventTypePeersPhase(P) {
  const boardId=P.boardId,payload=P.payloadSha256,r10Id='313fb1ed-0d5c-8095-8008-914c79b02bd3',stableKey='kenigevents-p92-stable-ids',mark='kenigevents-p93-event-type-peer',beforeKey='kenigevents-p93-before',specs=[['313fb1ed-0d5c-8095-8008-912c4b0ef96e','313fb1ed-0d5c-8095-8008-912c45090653','встреча'],['313fb1ed-0d5c-8095-8008-916b37256e16','313fb1ed-0d5c-8095-8008-916b340de148','встреча'],['313fb1ed-0d5c-8095-8008-916bd488205f','313fb1ed-0d5c-8095-8008-916bd0ab6c98','выставка']];
  const active=()=>{let c;try{c=JSON.parse(penpot.currentFile?.getSharedPluginData?.('kenigevents','asp-active-run-v1')||'null');}catch{throw new Error('MATERIALIZATION_RUN_NOT_ACTIVE');}const e=P.runControl;if(c?.schema!=='kenigevents.asp-run-control.v1'||c.run_id!==e.runId||c.writer_id!==e.writerId||c.state!=='ACTIVE'||c.contract_sha256!==e.contractSha256||c.page_profile_sha256!==e.pageProfileSha256||c.asset_registry_sha256!==e.assetRegistrySha256||c.geometry_proof_sha256!==e.geometryProofSha256)throw new Error('MATERIALIZATION_RUN_NOT_ACTIVE');};
  const children=(s)=>Array.from(s?.children||[]),walk=(s)=>[s,...children(s).flatMap(walk)],contained=(s)=>{const b=s.textBounds,t=2;return !!b&&[b.x,b.y,b.width,b.height].every(Number.isFinite)&&b.width>0&&b.height>0&&b.x>=s.x-t&&b.y>=s.y-t&&b.x+b.width<=s.x+s.width+t&&b.y+b.height<=s.y+s.height+t;},detail=(s)=>({id:s.id,characters:s.characters,growType:s.growType,frame:{x:s.x,y:s.y,width:s.width,height:s.height},textBounds:s.textBounds?{x:s.textBounds.x,y:s.textBounds.y,width:s.textBounds.width,height:s.textBounds.height}:null,fontSize:s.fontSize,lineHeight:s.lineHeight,contained:contained(s)});
  active();const board=children(penpot.currentPage?.root).find((s)=>s.id===boardId),roots=children(board),components=Array.from(penpot.library?.local?.components||[]),cards=roots.filter((r)=>r.getPluginData?.('kenigevents-role')==='accepted-card-master'&&r.getPluginData?.('kenigevents-payload-sha256')===payload&&r.getPluginData?.('kenigevents-build-state')==='COMPLETE'),texts=cards.flatMap((r)=>walk(r).filter((s)=>s.type==='text'&&s.characters)),stableIds={roots:roots.map((s)=>s.id),components:components.map((c)=>c.id),texts:texts.map((s)=>s.id)},r10=texts.find((s)=>s.id===r10Id),saved=JSON.parse(r10?.getPluginData?.(stableKey)||'null'),diagnostics=texts.map(detail),rows=specs.map((q)=>{const s=texts.find((x)=>x.id===q[0]),before=JSON.parse(s?.getPluginData?.(beforeKey)||'null'),after=diagnostics.find((d)=>d.id===q[0]);let root=s;while(root?.parent&&root.parent.id!==boardId)root=root.parent;const b=s?.textBounds,t=2,withinRoot=!!b&&b.x>=root.x-t&&b.y>=root.y-t&&b.x+b.width<=root.x+root.width+t&&b.y+b.height<=root.y+root.height+t,changed=!!before&&!!after&&(Math.abs(after.frame.width-before.frame.width)>.1||Math.abs(after.frame.height-before.frame.height)>.1||Math.abs(after.textBounds.width-before.textBounds.width)>.1||Math.abs(after.textBounds.height-before.textBounds.height)>.1);return {s,before,after,withinRoot,changed,rootId:root?.id,spec:q};});
  if(!board||roots.length!==18||walk(board).length-1!==248||components.length!==18||cards.length!==4||texts.length!==38||!saved||JSON.stringify(saved)!==JSON.stringify(stableIds)||(penpot.currentFile.validate()||[]).length)throw new Error('P93_EVENT_TYPE_READBACK_DRIFT');
  for(const r of rows)if(!r.s||r.rootId!==r.spec[1]||r.s.characters!==r.spec[2]||r.s.growType!=='auto-width'||r.s.getPluginData?.(mark)!==`${payload}:${r.s.id}:PENDING_READBACK`||!r.before||!r.after.contained||!r.withinRoot||!r.changed||r.after.textBounds.height>r.before.frame.height+2)throw new Error(`P93_EVENT_TYPE_NOT_IMPROVED: ${JSON.stringify({id:r.spec[0],before:r.before,after:r.after,withinRoot:r.withinRoot,changed:r.changed})}`);
  const offenders=diagnostics.filter((d)=>!d.contained);if(offenders.length!==20)throw new Error(`P93_EVENT_TYPE_OFFENDER_DRIFT: ${offenders.length}`);
  return {schema:'kenigevents.penpot.g19.event-type-peers-readback.v1',phaseId:'P93_EVENT_TYPE_PEERS_READBACK',terminalState:'EVENT_TYPE_PEERS_MEASUREMENT_PASS',mutations:0,targetIds:specs.map((q)=>q[0]),rows:rows.map(({before,after,withinRoot,changed,spec})=>({id:spec[0],before,after,withinRoot,changed})),contained:18,offenders,census:{roots:18,descendants:248,components:18,cards:4,texts:38},stableIds,validation:[]};
}

async function installProductionRuntime(P) {
  const FILE_ID = '40e06342-8830-80d6-8008-8fc8a3a4cd4f';
  const PAGE_ID = 'c16498cb-b51d-8030-8008-904bd8fc9c53';
  const BOARD_ID = '313fb1ed-0d5c-8095-8008-9108df52b2ce';
  const BOARD_NAME = 'KenigEvents · G12 bounded L0-L3';
  const ER = 56;
  const EBC = 16;
  const EBD = 137;
  const ELC = 15;
  const FAMILY = 'DejaVu Sans';
  const FONT_SOURCES = P.fontSources;
  const LEAF_PATH = 'KenigEvents / G19 / EventCard 8006 / Leaves';
  const CARD_PATH = 'KenigEvents / G19 / EventCard 8006 / Accepted';
  const GENERATION = 19;
  const FIXTURE = 'event.real.8006+event.real.2182';
  const V2SHA = 'b1e236cf6e1faf59ba7e9de1cd4f6c2571349cae884b3f96f5f9743681a51330';
  const SHA = P.payloadSha256;
  const KP = 'kenigevents-payload-sha256', KM = 'kenigevents-g19-marker', KC = 'kenigevents-g19-child-marker', KI = 'kenigevents-instance-case-id';
  const KF='kenigevents-font-family',KW='kenigevents-font-weight',KS='kenigevents-font-style',KFS='kenigevents-font-source-sha256',KFR='kenigevents-font-runtime-id',KFV='kenigevents-font-variant-id';
  const V3SHA = 'c6c35b6f39e3cd5bc68bfe183c1df0652475533d4eecbaea8bd7bca1b4b35219';
  const LEGACY_V2_ICON_SHA256 = { icon: { not_interested: 'd8d94023de0e563663c71a628657e3e4402ed5cb36fa836f784071e83edc8ae6', calendar: 'f5465db33659eb80685704961006aa1d5f970f337dd6b330d8056c3326360633', share: '99103f01c0cbd48d87ff639dc3e6c6291a7f8c2aa147c854667d1a8f7a677cf9', like: 'e5654867ef9431714cfc53a1890fb14fcaa52c64579388f5364a0fa01ce6ea58' } };
  const marker = (key) => `kenigevents:g19:p2:${key}:v3`;
  const v2Marker = (key) => `kenigevents:g19:p2:${key}:v2`;
  const fail = (code, detail = {}) => {
    const error = new Error(`${code}: ${JSON.stringify(detail)}`);
    error.code = code;
    error.detail = detail;
    throw error;
  };
  function activeRun() {
    let control;
    try { control = JSON.parse(penpot.currentFile?.getSharedPluginData?.('kenigevents', 'asp-active-run-v1') || 'null'); }
    catch (error) { fail('MATERIALIZATION_RUN_NOT_ACTIVE', { reason: 'INVALID_JSON', message: String(error?.message || error) }); }
    const expected = P.runControl;
    const exact = control?.schema === 'kenigevents.asp-run-control.v1'
      && control.run_id === expected.runId
      && control.writer_id === expected.writerId
      && control.state === 'ACTIVE'
      && control.contract_sha256 === expected.contractSha256
      && control.page_profile_sha256 === expected.pageProfileSha256
      && control.asset_registry_sha256 === expected.assetRegistrySha256
      && /^[0-9a-f]{64}$/.test(String(expected.geometryProofSha256 || ''))
      && control.geometry_proof_sha256 === expected.geometryProofSha256;
    if (!exact) fail('MATERIALIZATION_RUN_NOT_ACTIVE', { expected: { run_id: expected.runId, writer_id: expected.writerId, state: 'ACTIVE', contract_sha256: expected.contractSha256, page_profile_sha256: expected.pageProfileSha256, asset_registry_sha256: expected.assetRegistrySha256, geometry_proof_sha256: expected.geometryProofSha256 }, actual: control });
    return control;
  }
  const write = (operation) => { activeRun(); return operation(); };
  const writeAsync = async (operation) => { activeRun(); const result = await operation(); activeRun(); return result; };
  const array = (value) => Array.from(value || []);
  const round = (value) => Math.round(Number(value) * 1000) / 1000;
  const eq = (a, b) => Math.abs(Number(a) - Number(b)) <= 0.02;
  const plugin = (shape, key, value) => write(() => shape.setPluginData(key, String(value)));
  const children = (shape) => array(shape?.children);
  const walk = (root) => {
    const out = [], queue = root ? [root] : [];
    while (queue.length) {
      const shape = queue.shift();
      out.push(shape);
      queue.push(...children(shape));
    }
    return out;
  };
  const relativeX = (shape) => Number(shape?.parentX ?? shape?.x ?? 0);
  const relativeY = (shape) => Number(shape?.parentY ?? shape?.y ?? 0);
  const place = (shape, parent, box) => {
    // Component-copy descendants already belong to their copy. Re-appending
    // them is a forbidden structural mutation in native Penpot components-v2.
    if (parent && (!shape.parent || shape.parent.id !== parent.id)) write(() => parent.appendChild(shape));
    if (shape.layoutChild) write(() => { shape.layoutChild.absolute = true; });
    write(() => shape.resize(box.width, box.height));
    write(() => penpotUtils.setParentXY(shape, box.x || 0, box.y || 0));
    return shape;
  };
  const setRadii = (shape, style = {}) => {
    write(() => { shape.borderRadiusTopLeft = style.radiusTL || 0; });
    write(() => { shape.borderRadiusTopRight = style.radiusTR || 0; });
    write(() => { shape.borderRadiusBottomRight = style.radiusBR || 0; });
    write(() => { shape.borderRadiusBottomLeft = style.radiusBL || 0; });
  };
  const setFill = (shape, color, fillOpacity = 1) => {
    write(() => { shape.fills = fillOpacity > 0 ? [{ fillColor: color, fillOpacity }] : []; });
    write(() => { shape.strokes = []; });
  };
  const setStroke = (shape, style = {}) => {
    write(() => { shape.strokes = style.strokeWidth > 0 && style.strokeOpacity > 0 ? [{ strokeColor: style.strokeColor, strokeOpacity: style.strokeOpacity, strokeStyle: 'solid', strokeWidth: style.strokeWidth, strokeAlignment: 'inner' }] : []; });
  };
  const auditRadii = (shape, style = {}, code = 'RADIUS_DRIFT', detail = {}) => {
    if (!eq(shape.borderRadiusTopLeft || 0, style.radiusTL || 0) || !eq(shape.borderRadiusTopRight || 0, style.radiusTR || 0) || !eq(shape.borderRadiusBottomRight || 0, style.radiusBR || 0) || !eq(shape.borderRadiusBottomLeft || 0, style.radiusBL || 0)) fail(code, detail);
  };
  const allComps = () => array(penpot.library?.local?.components);
  const mainOf = (component) => typeof component?.mainInstance === 'function' ? component.mainInstance() : component?.mainInstance;
  const cm = (component, pathValue, name) => {
    const main = mainOf(component);
    return component?.name === name && [pathValue, ''].includes(component.path) && (component.path === pathValue || (main?.getPluginData?.(KM) === marker(name) && main.getPluginData?.(KP) === SHA && main.getPluginData?.('kenigevents-build-state') === 'COMPLETE' && main.getPluginData?.('kenigevents-component-name') === name && main.getPluginData?.('kenigevents-component-id') === component.id && main.parent?.id === BOARD_ID));
  };
  const componentOf = (main) => allComps().find((component) => mainOf(component)?.id === main?.id) || null;
  const findComp = (pathValue, name) => allComps().find((component) => cm(component, pathValue, name)) || null;
  const targetBoard = () => children(penpot.currentPage?.root).find((shape) => shape.id === BOARD_ID) || null;
  const managedRoots = () => children(targetBoard()).filter((shape) => shape.getPluginData?.(KM));
  const findRoot = (key) => managedRoots().find((shape) => shape.getPluginData(KM) === marker(key)) || null;

  function assertPrimitives() {
    if (typeof penpot === 'undefined' || typeof penpotUtils === 'undefined' || typeof storage === 'undefined') fail('PENPOT_GLOBALS_MISSING');
    for (const name of ['createBoard', 'createRectangle', 'createText', 'createShapeFromSvg', 'createShapeFromSvgWithImages']) {
      if (typeof penpot[name] !== 'function') fail('PENPOT_PRIMITIVE_MISSING', { name });
    }
    if (typeof penpotUtils.setParentXY !== 'function') fail('PENPOT_SET_PARENT_XY_MISSING');
    if (typeof penpot.library?.local?.createComponent !== 'function') fail('PENPOT_COMPONENT_API_MISSING');
    if (typeof penpot.currentFile?.validate !== 'function') fail('PENPOT_VALIDATE_API_MISSING');
    if (typeof penpot.currentFile?.saveVersion !== 'function') fail('PENPOT_SAVE_VERSION_API_MISSING');
    if (typeof penpot.currentFile?.findVersions !== 'function') fail('PENPOT_FIND_VERSIONS_API_MISSING');
    if (typeof penpot.history?.undoBlockBegin !== 'function' || typeof penpot.history?.undoBlockFinish !== 'function') fail('PENPOT_UNDO_BLOCK_API_MISSING');
    if (!penpot.fonts || typeof penpot.fonts.findByName !== 'function' || typeof penpot.fonts.findAllByName !== 'function') fail('PENPOT_FONT_API_MISSING');
  }

  function context() {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      fail('PENPOT_TARGET_MISMATCH', { expectedFile: FILE_ID, actualFile: penpot.currentFile?.id, expectedPage: PAGE_ID, actualPage: penpot.currentPage?.id });
    }
    const pageRoots = children(penpot.currentPage?.root);
    const board = targetBoard();
    if (pageRoots.length !== 1 || !board || board.name !== BOARD_NAME || board.type !== 'board') {
      fail('PENPOT_ACCEPTED_BOARD_MISMATCH', { expectedBoardId: BOARD_ID, expectedBoardName: BOARD_NAME, pageRoots: pageRoots.map((shape) => ({ id: shape.id, name: shape.name, type: shape.type })) });
    }
    const revision = Number(penpot.currentFile?.revn ?? penpot.currentFile?.revision);
    if (!Number.isFinite(revision)) fail('PENPOT_REVISION_UNREADABLE');
    if (revision < ER) fail('PENPOT_REVISION_BEFORE_ACCEPTED_BASELINE', { minimum: ER, actual: revision });
    return board;
  }

  function baseline() {
    const board = context(), roots = children(board), components = allComps(), validation = validationResult();
    const managed = roots.filter((shape) => shape.getPluginData?.(KM));
    // The generated production constant is 56. Tests patch that literal to 41
    // only to synthesize the immutable observed rev-56 fixture in memory.
    if (!roots.length && !components.length && ER === 41) return { mode: 'TEST_FIXTURE_EMPTY_REVISION_41', revision: 41, pageDirectRoots: 1, boardId: board.id, boardChildren: 0, boardDescendants: 0, localComponents: 0, validation };
    const revision = Number(penpot.currentFile?.revn ?? penpot.currentFile?.revision), descendants = walk(board).length - 1;
    if (revision === ER && (roots.length !== EBC || descendants !== EBD || components.length !== ELC)) fail('PENPOT_BASELINE_CENSUS_MISMATCH', { revision, expected: { boardChildren: EBC, boardDescendants: EBD, localComponents: ELC }, actual: { boardChildren: roots.length, boardDescendants: descendants, localComponents: components.length }, validation });
    if (roots.length < EBC || roots.length > 18 || components.length < ELC || components.length > 18 || descendants < EBD) fail('PENPOT_RESUME_CENSUS_OUT_OF_BOUNDS', { revision, boardChildren: roots.length, boardDescendants: descendants, localComponents: components.length });
    if (managed.length !== roots.length) fail('UNMANAGED_ACCEPTED_BOARD_CHILDREN_PRESENT', { boardId: board.id, boardChildren: roots.length, managedRoots: managed.length });
    const rootIds = new Set(roots.map((shape) => shape.id));
    if (components.some((component) => !rootIds.has(mainOf(component)?.id) || !mainOf(component)?.getPluginData?.(KM))) fail('UNMANAGED_LOCAL_COMPONENTS_PRESENT');
    if (validation.length !== 0) fail('PREEXISTING_VALIDATION_FAILURE', { validation });
    return { mode: revision === ER ? 'ACCEPTED_NATIVE_REVISION_56_MIXED_LINEAGE' : 'G19_V3_RESUME_OR_REUSE', revision, pageDirectRoots: 1, boardId: board.id, boardChildren: roots.length, boardDescendants: descendants, localComponents: components.length, validation };
  }

  function resolveFonts() {
    const first = penpot.fonts.findByName(FAMILY);
    const fonts = [...new Set([first, ...array(penpot.fonts.findAllByName(FAMILY))].filter(Boolean))];
    const rows = [];
    for (const font of fonts) {
      const fontFamily = String(font?.fontFamily ?? font?.family ?? '');
      if (fontFamily !== FAMILY) continue;
      if (typeof font.applyToText !== 'function') continue;
      for (const variant of array(font.variants)) {
        const runtimeFontId = String(font?.id ?? font?.fontId ?? '');
        const variantId = String(variant?.id ?? variant?.fontVariantId ?? '');
        const weight = Number(variant?.fontWeight ?? variant?.weight);
        const style = String(variant?.fontStyle ?? variant?.style ?? '').toLowerCase();
        rows.push({ font, variant, runtimeFontId, variantId, weight, style });
      }
    }
    const resolved = {};
    for (const weight of [400, 700]) {
      const wantedVariant = `normal-${weight}`;
      const row = rows.find((candidate) => candidate.weight === weight && candidate.style === 'normal' && candidate.variantId === wantedVariant && candidate.runtimeFontId);
      if (!row) fail('EXACT_NATIVE_FONT_VARIANT_MISSING', { family: FAMILY, weight, style: 'normal', variantId: wantedVariant, available: rows.map((candidate) => ({ runtimeFontId: candidate.runtimeFontId, variantId: candidate.variantId, weight: candidate.weight, style: candidate.style })) });
      resolved[weight] = row;
    }
    return resolved;
  }

  function stamp(shape, key, role) {
    write(() => { shape.name = key; });
    plugin(shape, KM, marker(key));
    plugin(shape, 'kenigevents-generation', GENERATION);
    plugin(shape, 'kenigevents-fixture-id', FIXTURE);
    plugin(shape, 'kenigevents-role', role);
    plugin(shape, KP, SHA);
    plugin(shape, 'kenigevents-accepted-roots-cleanup', 'forbidden');
  }

  const lineRatio = (style) => String(Number((Number(style.lineHeight) / Number(style.fontSize)).toFixed(6)));
  function applyText(textShape, style, fontRows) {
    const weight = 700;
    const row = fontRows[weight];
    write(() => row.font.applyToText(textShape, row.variant));
    // Penpot stores lineHeight as a unitless font-size multiplier, not CSS px.
    write(() => { textShape.growType = 'fixed'; });
    write(() => { textShape.fontSize = String(style.fontSize); });
    write(() => { textShape.lineHeight = lineRatio(style); });
    write(() => { textShape.letterSpacing = String(style.letterSpacing || 0); });
    write(() => { textShape.fills = [{ fillColor: style.color, fillOpacity: style.colorOpacity }]; });
    plugin(textShape, KF, FAMILY);
    plugin(textShape, KW, weight);
    plugin(textShape, KS, 'normal');
    plugin(textShape, KFR, row.runtimeFontId);
    plugin(textShape, KFV, row.variantId);
    plugin(textShape, KFS, FONT_SOURCES[weight]);
  }

  function makeText(parent, name, value, box, style, fontRows) {
    const text = write(() => penpot.createText(value));
    write(() => { text.name = name; });
    write(() => { text.characters = value; });
    place(text, parent, box);
    applyText(text, style, fontRows);
    return text;
  }

  function tintedSvg(source, color) {
    if (!source.includes('currentColor')) fail('ACTION_SVG_CURRENT_COLOR_CONTRACT_MISSING');
    return source.replaceAll('currentColor', color);
  }

  function icon(parent, svg, color, x, y, width, height, name) {
    const shape = write(() => penpot.createShapeFromSvg(tintedSvg(svg, color)));
    write(() => { shape.name = name; });
    place(shape, parent, { x, y, width, height });
    return shape;
  }

  function createLeafRoot(spec) {
    const root = write(() => penpot.createBoard());
    stamp(root, spec.key, 'leaf-master');
    write(() => { root.clipContent = Boolean(spec.clip); });
    setFill(root, spec.fill || '#000000', spec.fillOpacity ?? 0);
    setRadii(root, spec.style || {});
    if (spec.kind !== 'media') setStroke(root, spec.style || {});
    place(root, targetBoard(), { ...spec.box, x: spec.gallery.x, y: spec.gallery.y });
    plugin(root, 'kenigevents-build-state', 'BUILDING');
    return root;
  }

  const V3I = { payloadSha256: SHA, marker, childMarker: (rootKey, childKey) => `${marker(rootKey)}:${childKey}` };
  const V2I = { payloadSha256: V2SHA, marker: v2Marker, childMarker: (rootKey, childKey) => `${v2Marker(rootKey)}:${childKey}` };
  const childMarker = V3I.childMarker;
  const findChild = (parent, rootKey, childKey, identity = V3I) => {
    const matches = children(parent).filter((shape) => shape.getPluginData?.(KC) === identity.childMarker(rootKey, childKey));
    if (matches.length > 1) fail('DUPLICATE_MANAGED_CHILD', { rootKey, childKey, ids: matches.map((shape) => shape.id) });
    return matches[0] || null;
  };
  const auditBox = (shape, box, code, detail = {}) => {
    if (!shape || !eq(relativeX(shape), box.x || 0) || !eq(relativeY(shape), box.y || 0) || !eq(shape.width, box.width) || !eq(shape.height, box.height)) fail(code, { ...detail, expected: box, actual: shape && { x: relativeX(shape), y: relativeY(shape), width: shape.width, height: shape.height } });
  };
  function stampChild(shape, rootKey, childKey) {
    plugin(shape, KC, childMarker(rootKey, childKey));
    plugin(shape, KP, SHA);
  }
  function rectChild(parent, rootKey, childKey, box, color, fillOpacity = 1, style = null, allow = true, identity = V3I) {
    let shape = findChild(parent, rootKey, childKey, identity);
    if (!shape) {
      if (!allow) fail('MANAGED_RECT_MISSING', { rootKey, childKey });
      shape = write(() => penpot.createRectangle());
      if (!shape) fail('CREATE_RECTANGLE_FAILED', { rootKey, childKey });
      write(() => { shape.name = childKey; });
      stampChild(shape, rootKey, childKey);
      setFill(shape, color, fillOpacity);
      if (style) setRadii(shape, style);
      place(shape, parent, box);
    }
    auditBox(shape, box, 'MANAGED_RECT_GEOMETRY_DRIFT', { rootKey, childKey });
    const fill = array(shape.fills)[0];
    if (!fill || fill.fillColor !== color || !eq(fill.fillOpacity, fillOpacity) || array(shape.strokes).length || shape.getPluginData?.(KP) !== identity.payloadSha256) fail('MANAGED_RECT_STYLE_OR_PAYLOAD_DRIFT', { rootKey, childKey });
    if (style) auditRadii(shape, style, 'MANAGED_RECT_RADIUS_DRIFT', { rootKey, childKey });
    return shape;
  }
  function ensureBoardChild(parent, rootKey, childKey, box, color, fillOpacity, style, allow = true, identity = V3I) {
    let shape = findChild(parent, rootKey, childKey, identity);
    if (!shape) {
      if (!allow) fail('MANAGED_BOARD_MISSING', { rootKey, childKey });
      shape = write(() => penpot.createBoard());
      if (!shape) fail('CREATE_BOARD_FAILED', { rootKey, childKey });
      write(() => { shape.name = childKey; });
      write(() => { shape.clipContent = true; });
      stampChild(shape, rootKey, childKey);
      setFill(shape, color, fillOpacity);
      setRadii(shape, style);
      place(shape, parent, box);
    }
    auditBox(shape, box, 'MANAGED_BOARD_GEOMETRY_DRIFT', { rootKey, childKey });
    const fill = array(shape.fills)[0];
    if (!fill || fill.fillColor !== color || !eq(fill.fillOpacity, fillOpacity) || array(shape.strokes).length || shape.clipContent !== true || shape.getPluginData?.(KP) !== identity.payloadSha256) fail('MANAGED_BOARD_STYLE_OR_PAYLOAD_DRIFT', { rootKey, childKey });
    auditRadii(shape, style, 'MANAGED_BOARD_RADIUS_DRIFT', { rootKey, childKey });
    return shape;
  }
  function textChild(parent, rootKey, childKey, value, box, style, fontRows, allow = true, identity = V3I) {
    let shape = findChild(parent, rootKey, childKey, identity);
    if (!shape) {
      if (!allow) fail('MANAGED_TEXT_MISSING', { rootKey, childKey });
      shape = makeText(parent, childKey, value, box, style, fontRows);
      if (!shape) fail('CREATE_TEXT_FAILED', { rootKey, childKey });
      stampChild(shape, rootKey, childKey);
    } else if (allow) {
      write(() => { shape.characters = value; });
      place(shape, parent, box);
      applyText(shape, style, fontRows);
    }
    auditBox(shape, box, 'MANAGED_TEXT_GEOMETRY_DRIFT', { rootKey, childKey });
    const fill = array(shape.fills)[0];
    if (shape.characters !== value || shape.getPluginData?.(KFR) !== fontRows[700].runtimeFontId || shape.getPluginData?.(KFV) !== fontRows[700].variantId || shape.getPluginData?.(KF) !== FAMILY || shape.getPluginData?.(KW) !== '700' || shape.getPluginData?.(KS) !== 'normal' || shape.getPluginData?.(KFS) !== FONT_SOURCES[700] || shape.getPluginData?.(KP) !== identity.payloadSha256 || !eq(shape.fontSize, style.fontSize) || !eq(shape.lineHeight, identity === V2I ? style.lineHeight : lineRatio(style)) || !eq(shape.letterSpacing || 0, style.letterSpacing || 0) || !fill || fill.fillColor !== style.color || !eq(fill.fillOpacity, style.colorOpacity)) fail('MANAGED_TEXT_CONTENT_OR_FONT_DRIFT', { rootKey, childKey, value: shape.characters });
    return shape;
  }
  function ensureIconChild(parent, rootKey, childKey, source, color, box, assetSha256, allow = true, identity = V3I) {
    let shape = findChild(parent, rootKey, childKey, identity);
    const action = rootKey.includes('not-interested') ? 'not_interested' : rootKey.includes('calendar') ? 'calendar' : rootKey.includes('share') ? 'share' : rootKey.includes('like') ? 'like' : null;
    const expectedAssetSha256 = identity === V2I && action ? LEGACY_V2_ICON_SHA256.icon[action] : assetSha256;
    if (shape && allow && identity === V3I && shape.getPluginData?.('kenigevents-svg-sha256') !== assetSha256) {
      write(() => shape.remove());
      shape = null;
    }
    if (!shape) {
      if (!allow) fail('MANAGED_ICON_MISSING', { rootKey, childKey });
      shape = write(() => penpot.createShapeFromSvg(tintedSvg(source, color)));
      if (!shape) fail('CREATE_SVG_FAILED', { rootKey, childKey });
      write(() => { shape.name = childKey; });
      stampChild(shape, rootKey, childKey);
      plugin(shape, 'kenigevents-svg-sha256', assetSha256);
      plugin(shape, 'kenigevents-icon-color', color);
      place(shape, parent, box);
    }
    auditBox(shape, box, 'MANAGED_ICON_GEOMETRY_DRIFT', { rootKey, childKey });
    if (shape.getPluginData?.('kenigevents-svg-sha256') !== expectedAssetSha256 || shape.getPluginData?.('kenigevents-icon-color') !== color || shape.getPluginData?.(KP) !== identity.payloadSha256) fail('MANAGED_ICON_ASSET_OR_COLOR_DRIFT', { rootKey, childKey });
    return shape;
  }
  async function withUndo(fn) {
    const blockId = write(() => penpot.history.undoBlockBegin());
    try { return await fn(); }
    finally { penpot.history.undoBlockFinish(blockId); }
  }

  const isV2 = (root, key) => root?.getPluginData?.(KM) === v2Marker(key)
    && root.getPluginData?.(KP) === V2SHA;

  function migrateTree(root, rootKey, role) {
    if (!isV2(root, rootKey) || root.getPluginData?.('kenigevents-build-state') !== 'COMPLETE') fail('LEGACY_V2_ROOT_NOT_MIGRATABLE', { rootKey, rootId: root?.id || null });
    const oldPrefix = `${v2Marker(rootKey)}:`, newPrefix = `${marker(rootKey)}:`;
    for (const shape of walk(root).slice(1)) {
      const childId = shape.getPluginData?.(KC) || '';
      const payload = shape.getPluginData?.(KP) || '';
      if (childId) {
        if (!childId.startsWith(oldPrefix) || payload !== V2SHA) fail('LEGACY_V2_CHILD_NOT_MIGRATABLE', { rootKey, shapeId: shape.id, childId, payload });
        plugin(shape, KC, `${newPrefix}${childId.slice(oldPrefix.length)}`);
        plugin(shape, KP, SHA);
      } else if (payload) {
        fail('LEGACY_V2_UNMARKED_PAYLOAD_DESCENDANT', { rootKey, shapeId: shape.id, payload });
      }
    }
    stamp(root, rootKey, role);
    plugin(root, 'kenigevents-build-state', 'COMPLETE');
  }

  async function ensureComp(spec, build, auditLegacyV2) {
    let component = findComp(spec.path, spec.name) || allComps().find((candidate) => mainOf(candidate)?.getPluginData?.(KM) === marker(spec.key));
    if (component) {
      const main = mainOf(component);
      if (isV2(main, spec.key)) {
        if (typeof auditLegacyV2 !== 'function' || component.path !== spec.path || component.name !== spec.name || main.parent?.id !== BOARD_ID) fail('LEGACY_V2_COMPONENT_IDENTITY_COLLISION', { key: spec.key, componentId: component.id });
        return await withUndo(async () => {
          await auditLegacyV2(main);
          const childN = spec.kind === 'media' ? 3 : spec.kind === 'text-pill' ? 1 : spec.inner.label && spec.inner.count ? 3 : 2;
          if (children(main).length !== childN) fail('LEGACY_V2_LEAF_CHILD_CARDINALITY', { key: spec.key, expected: childN, actual: children(main).length });
          migrateTree(main, spec.key, 'leaf-master');
          await build(main, false);
          await build(main, true);
          return { component, main, created: true, migratedFrom: 'G19_V2', preservedIds: true };
        });
      }
      if (!main || main.getPluginData?.(KM) !== marker(spec.key)) fail('COMPONENT_IDENTITY_COLLISION', { key: spec.key, name: spec.name });
      if ((component.path !== spec.path || component.name !== spec.name) && main.getPluginData('kenigevents-build-state') === 'READY_FOR_COMPONENT' && !component.path && !component.name) {
        return await withUndo(async () => {
          await build(main, true);
          write(() => { component.path = spec.path; });
          write(() => { component.name = spec.name; });
          plugin(main, 'kenigevents-component-name', spec.name);
          plugin(main, 'kenigevents-component-id', component.id);
          plugin(main, 'kenigevents-build-state', 'COMPLETE');
          return { component, main, created: true, resumedRegistration: true };
        });
      }
      if (!cm(component, spec.path, spec.name)) fail('COMPONENT_REGISTRATION_INCOMPLETE', { key: spec.key, componentId: component.id, path: component.path, name: component.name });
      if (main.getPluginData('kenigevents-build-state') !== 'COMPLETE' || main.getPluginData(KP) !== SHA) fail('COMPONENT_BUILD_STATE_DRIFT', { key: spec.key });
      auditBox(main, { x: relativeX(main), y: relativeY(main), width: spec.box.width, height: spec.box.height }, 'COMPONENT_GEOMETRY_DRIFT', { key: spec.key });
      await build(main, true);
      return { component, main, created: false };
    }
    return await withUndo(async () => {
      let root = findRoot(spec.key);
      if (!root) root = createLeafRoot(spec);
      if (root.getPluginData(KP) !== SHA) fail('MANAGED_ROOT_PAYLOAD_DRIFT', { key: spec.key, rootId: root.id });
      await build(root, false);
      plugin(root, 'kenigevents-build-state', 'READY_FOR_COMPONENT');
      component = write(() => penpot.library.local.createComponent([root]));
      if (!component) fail('CREATE_COMPONENT_FAILED', { key: spec.key });
      write(() => { component.path = spec.path; });
      write(() => { component.name = spec.name; });
      plugin(root, 'kenigevents-component-name', spec.name);
      plugin(root, 'kenigevents-component-id', component.id);
      plugin(root, 'kenigevents-build-state', 'COMPLETE');
      return { component, main: mainOf(component) || root, created: true };
    });
  }

  function leafSpecs(caseSpec, index) {
    const slots = caseSpec.slots, viewport = caseSpec.viewport, inner = P.descendants[caseSpec.caseId];
    const baseX = 1240 + index * 570;
    let galleryY = 0;
    const next = (height) => { const y = galleryY; galleryY += height + 24; return { x: baseX, y }; };
    const specs = [];
    const add = (identity, slotName, kind, extra = {}) => {
      const slot = slots[slotName], key = `${identity}.${viewport}.8006`;
      specs.push({ key, name: key, semanticIdentity: identity, path: LEAF_PATH, viewport, slotName, kind, box: { x: 0, y: 0, width: slot.box.width, height: slot.box.height }, gallery: next(slot.box.height), slot, ...extra });
    };
    add('event.media-frame', 'media-link', 'media', { clip: true, fill: '#15110f', fillOpacity: 0, style: slots['media-link'].style, mediaSlot: slots.image });
    add('event.meta.event-type', 'event-type', 'text-pill');
    add('event.meta.admission', 'admission', 'text-pill');
    add('event.action.not-interested', 'action.not_interested', 'action', { action: 'not_interested', inner: inner.not_interested });
    add('event.action.calendar', 'action.calendar', 'action', { action: 'calendar', inner: inner.calendar });
    add('event.action.share', 'action.share', 'action', { action: 'share', inner: inner.share });
    add('event.action.like', 'action.like', 'action', { action: 'like', inner: inner.like });
    return specs;
  }

  function leafSpecsAll() {
    const masters = ['desktop', 'mobile'].map((viewport) => P.cases.find((caseSpec) => caseSpec.viewport === viewport && caseSpec.variant.includes('wide')));
    if (masters.some((caseSpec) => !caseSpec)) fail('LEAF_MASTER_CASE_MISSING');
    return masters.flatMap((caseSpec, index) => leafSpecs(caseSpec, index));
  }

  async function buildLeaf(spec, root, fontRows, auditOnly, identity = V3I) {
    if (auditOnly) {
      if (root.getPluginData('kenigevents-semantic-identity') !== spec.semanticIdentity || root.getPluginData('kenigevents-structural-context') !== spec.viewport) fail('LEAF_SEMANTIC_BINDING_DRIFT', { key: spec.key });
    } else {
      plugin(root, 'kenigevents-semantic-identity', spec.semanticIdentity);
      plugin(root, 'kenigevents-structural-context', spec.viewport);
    }
    const slot = spec.slot;
    const auditStyle = () => {
      const fills = array(root.fills), fillAlpha = identity === V2I && spec.kind === 'media' ? 1 : spec.fillOpacity ?? slot.style.backgroundOpacity ?? 0;
      const expectedFillColor = spec.fill || slot.style.backgroundColor;
      if (fillAlpha > 0 && (!fills[0] || fills[0].fillColor !== expectedFillColor || !eq(fills[0].fillOpacity, fillAlpha))) fail('LEAF_ROOT_FILL_DRIFT', { key: spec.key });
      if (fillAlpha === 0 && fills.length) fail('LEAF_ROOT_FILL_DRIFT', { key: spec.key });
      auditRadii(root, spec.style || slot.style, 'LEAF_ROOT_RADIUS_DRIFT', { key: spec.key });
      const expectedStroke = spec.kind !== 'media' && slot.style.strokeWidth > 0 && slot.style.strokeOpacity > 0;
      const strokes = array(root.strokes);
      if (expectedStroke && (!strokes[0] || strokes[0].strokeColor !== slot.style.strokeColor || !eq(strokes[0].strokeOpacity, slot.style.strokeOpacity) || !eq(strokes[0].strokeWidth, slot.style.strokeWidth))) fail('LEAF_ROOT_STROKE_DRIFT', { key: spec.key });
      if (!expectedStroke && strokes.length) fail('LEAF_ROOT_STROKE_DRIFT', { key: spec.key });
      if (root.getPluginData(KM) !== identity.marker(spec.key) || root.getPluginData(KP) !== identity.payloadSha256) fail('LEAF_ROOT_PAYLOAD_DRIFT', { key: spec.key });
    };
    if (spec.kind === 'media') {
      // The linked leaf owns the reusable frame. Exact fixture artwork remains
      // a card content-slot sibling so both 8006/contain and 2182/cover share
      // exactly fourteen persistent leaf masters without detaching instances.
      if (!auditOnly) setFill(root, '#000000', 0);
      rectChild(root, spec.key, 'border.top', { x: 0, y: 0, width: slot.box.width, height: 1 }, '#793014', 0.13, null, !auditOnly, identity);
      rectChild(root, spec.key, 'border.left', { x: 0, y: 0, width: 1, height: slot.box.height }, '#793014', 0.13, null, !auditOnly, identity);
      rectChild(root, spec.key, 'border.right', { x: slot.box.width - 1, y: 0, width: 1, height: slot.box.height }, '#793014', 0.13, null, !auditOnly, identity);
      auditStyle();
      return;
    }
    if (spec.kind === 'text-pill') {
      const fragment = slot.lineFragments[0];
      if (!fragment) fail('FROZEN_LINE_FRAGMENT_MISSING', { key: spec.key });
      const box = { x: fragment.x - slot.box.x, y: fragment.y - slot.box.y, width: fragment.width, height: fragment.height };
      if (!auditOnly) {
        setFill(root, slot.style.backgroundColor, slot.style.backgroundOpacity);
        setRadii(root, slot.style);
        setStroke(root, slot.style);
      }
      textChild(root, spec.key, 'label', slot.text, box, slot.style, fontRows, !auditOnly, identity);
      auditStyle();
      return;
    }
    if (!auditOnly) {
      if (slot.style.backgroundOpacity > 0) setFill(root, slot.style.backgroundColor, slot.style.backgroundOpacity);
      setRadii(root, slot.style);
      setStroke(root, slot.style);
    }
    const colors = slot.style.color, geometry = spec.inner;
    const iconSource = { not_interested: P.icons.notInterested, calendar: P.icons.calendar, share: P.icons.share, like: P.icons.like }[spec.action];
    const iconSha256 = { not_interested: P.iconSha256.notInterested, calendar: P.iconSha256.calendar, share: P.iconSha256.share, like: P.iconSha256.like }[spec.action];
    const labels = { not_interested: 'Не интересно', calendar: 'В календарь', share: 'Поделиться' };
    ensureIconChild(root, spec.key, 'icon', iconSource, colors, geometry.icon, iconSha256, !auditOnly, identity);
    if (geometry.label) textChild(root, spec.key, 'label', labels[spec.action], geometry.label, slot.style, fontRows, !auditOnly, identity);
    if (geometry.count) textChild(root, spec.key, 'count', spec.action === 'share' ? '1' : '9', geometry.count, slot.style, fontRows, !auditOnly, identity);
    auditStyle();
  }

  function createCardRoot(spec) {
    const root = write(() => penpot.createBoard());
    stamp(root, spec.key, 'accepted-card-master');
    write(() => { root.clipContent = false; });
    setFill(root, '#000000', 0);
    setRadii(root, { radiusTL: 24, radiusTR: 24, radiusBR: 24, radiusBL: 24 });
    place(root, targetBoard(), { ...spec.box, x: spec.position.x, y: spec.position.y });
    plugin(root, 'kenigevents-build-state', 'BUILDING');
    plugin(root, 'kenigevents-semantic-root', spec.semanticRoot);
    plugin(root, 'kenigevents-semantic-identity', 'component.event-card.free-collection');
    plugin(root, 'kenigevents-structural-context', spec.structuralContext);
    plugin(root, 'kenigevents-case-id', spec.caseId);
    return root;
  }

  function ensureLink(parent, rootKey, binding, leaf, allow = true, identity = V3I) {
    let instance = findChild(parent, rootKey, binding.slotName, identity);
    if (!instance) {
      if (!allow) fail('LINKED_INSTANCE_MISSING', { rootKey, slotName: binding.slotName });
      instance = write(() => leaf.component.instance());
      if (!instance) fail('CREATE_COMPONENT_INSTANCE_FAILED', { rootKey, leafKey: binding.leafKey });
      write(() => { instance.name = binding.slotName; });
      stampChild(instance, rootKey, binding.slotName);
      plugin(instance, 'kenigevents-linked-leaf-key', binding.leafKey);
      plugin(instance, 'kenigevents-linked-component-id', leaf.component.id);
      plugin(instance, 'kenigevents-linked', 'true');
      place(instance, parent, binding.box);
    }
    auditBox(instance, binding.box, 'LINKED_INSTANCE_GEOMETRY_DRIFT', { rootKey, slotName: binding.slotName });
    const actualComponent = typeof instance.component === 'function' ? instance.component() : null;
    if (!linked(instance) || actualComponent?.id !== leaf.component.id || instance.getPluginData('kenigevents-linked-component-id') !== leaf.component.id) fail('LINKED_INSTANCE_LINEAGE_DRIFT', { rootKey, slotName: binding.slotName, expectedComponentId: leaf.component.id, actualComponentId: actualComponent?.id || null });
    return instance;
  }

  const nestedChild = (instance, leafKey, childKey, identity = V3I) => walk(instance).slice(1).find((shape) => shape.getPluginData?.(KC) === identity.childMarker(leafKey, childKey)) || null;
  function currentMaster(instance, leafKey) {
    const c = instance.component?.(), m = mainOf(c);
    return c?.id === instance.getPluginData?.('kenigevents-linked-component-id') && c.name === leafKey && [LEAF_PATH, ''].includes(c.path) && m?.getPluginData?.(KM) === marker(leafKey) && m.getPluginData?.(KP) === SHA && m.getPluginData?.('kenigevents-build-state') === 'COMPLETE' && m.getPluginData?.('kenigevents-component-name') === leafKey && m.getPluginData?.('kenigevents-component-id') === c.id && m.parent?.id === BOARD_ID ? m : null;
  }
  function copyChild(instance, leafKey, childKey, identity) {
    const v2 = nestedChild(instance, leafKey, childKey, V2I);
    if (identity === V2I && v2?.getPluginData?.(KP) === V2SHA) return v2;
    const v3 = nestedChild(instance, leafKey, childKey);
    return v3?.getPluginData?.(KP) === SHA && (identity === V3I || currentMaster(instance, leafKey)) ? v3 : null;
  }

  function migrateCopy(instance, leafKey) {
    const rootMarker = instance.getPluginData?.(KM) || '';
    const rootPayload = instance.getPluginData?.(KP) || '';
    const descendants = walk(instance).slice(1).filter((shape) => shape.getPluginData?.(KC));
    const hasLegacyDescendants = descendants.some((shape) => shape.getPluginData(KC).startsWith(`${v2Marker(leafKey)}:`));
    if (rootMarker === marker(leafKey) && rootPayload === SHA && !hasLegacyDescendants) return false;
    if (![marker(leafKey), v2Marker(leafKey)].includes(rootMarker) || ![SHA, V2SHA].includes(rootPayload)) fail('LINKED_COPY_ROOT_NOT_MIGRATABLE', { leafKey, instanceId: instance.id, rootMarker, rootPayload });
    for (const shape of descendants) {
      const value = shape.getPluginData(KC);
      const payload = shape.getPluginData?.(KP) || '';
      if (value.startsWith(`${v2Marker(leafKey)}:`)) {
        if (payload !== V2SHA) fail('LINKED_COPY_CHILD_NOT_MIGRATABLE', { leafKey, instanceId: instance.id, shapeId: shape.id, value, payload });
        plugin(shape, KC, `${marker(leafKey)}:${value.slice(`${v2Marker(leafKey)}:`.length)}`);
        plugin(shape, KP, SHA);
      } else if (!value.startsWith(`${marker(leafKey)}:`) || payload !== SHA) {
        fail('LINKED_COPY_CHILD_IDENTITY_DRIFT', { leafKey, instanceId: instance.id, shapeId: shape.id, value, payload });
      }
    }
    plugin(instance, KM, marker(leafKey));
    plugin(instance, KP, SHA);
    return true;
  }

  function bindInstance(instance, spec, binding, fontRows, auditOnly, identity = V3I) {
    const slot = spec.slots[binding.slotName];
    const leafKey = binding.leafKey;
    if (!auditOnly && identity === V3I) migrateCopy(instance, leafKey);
    if (!auditOnly) {
      plugin(instance, KI, spec.caseId);
      plugin(instance, 'kenigevents-instance-slot', binding.slotName);
      if (binding.slotName === 'media-link') setFill(instance, '#000000', 0);
      else if (slot.style.backgroundOpacity > 0) setFill(instance, slot.style.backgroundColor, slot.style.backgroundOpacity);
      else setFill(instance, '#000000', 0);
      setRadii(instance, slot.style);
      setStroke(instance, slot.style);
    }
    if (instance.getPluginData?.(KI) !== spec.caseId || instance.getPluginData?.('kenigevents-instance-slot') !== binding.slotName) fail('LINKED_INSTANCE_CASE_BINDING_DRIFT', { caseId: spec.caseId, slot: binding.slotName });
    if (binding.slotName === 'media-link') {
      const fills = array(instance.fills);
      const m = currentMaster(instance, leafKey), opaque = fills.length === 1 && fills[0].fillColor === '#15110f' && eq(fills[0].fillOpacity, 1);
      const inherited = fills.length === 0 && m && array(m.fills).length === 0 && children(m).length === 3;
      const ownV2 = instance.getPluginData?.(KM) === v2Marker(leafKey) && instance.getPluginData?.(KP) === V2SHA;
      const ownV3 = instance.getPluginData?.(KM) === marker(leafKey) && instance.getPluginData?.(KP) === SHA;
      if (identity === V2I ? !(ownV2 && (opaque || inherited)) : !(ownV3 && fills.length === 0)) fail('LINKED_MEDIA_FRAME_FILL_DRIFT', { caseId: spec.caseId, fills });
      return;
    }
    if (binding.slotName === 'event-type' || binding.slotName === 'admission') {
      const label = copyChild(instance, leafKey, 'label', identity), fragment = slot.lineFragments[0];
      if (!label || !fragment) fail('LINKED_TEXT_OVERRIDE_TARGET_MISSING', { caseId: spec.caseId, slot: binding.slotName });
      const box = { x: fragment.x - slot.box.x, y: fragment.y - slot.box.y, width: fragment.width, height: fragment.height };
      if (!auditOnly) { write(() => { label.characters = slot.text; }); place(label, instance, box); applyText(label, slot.style, fontRows); plugin(label, KI, spec.caseId); }
      auditBox(label, box, 'LINKED_TEXT_OVERRIDE_GEOMETRY_DRIFT', { caseId: spec.caseId, slot: binding.slotName });
      if (label.characters !== slot.text || label.getPluginData?.(KI) !== spec.caseId || label.getPluginData?.(KFR) !== fontRows[700].runtimeFontId || label.getPluginData?.(KFV) !== fontRows[700].variantId) fail('LINKED_TEXT_OVERRIDE_CONTENT_DRIFT', { caseId: spec.caseId, slot: binding.slotName });
      return;
    }
    const action = binding.slotName.replace('action.', ''), geometry = P.descendants[spec.caseId]?.[action];
    if (!geometry) fail('CASE_ACTION_DESCENDANT_EVIDENCE_MISSING', { caseId: spec.caseId, action });
    const fixture = P.fixtures[spec.fixtureId];
    const values = { label: { not_interested: 'Не интересно', calendar: 'В календарь', share: 'Поделиться' }[action], count: action === 'share' ? String(fixture.shares) : String(fixture.likes) };
    for (const part of ['icon', 'label', 'count']) {
      if (!(part in geometry)) continue;
      const child = copyChild(instance, leafKey, part, identity);
      if (!child) fail('LINKED_ACTION_OVERRIDE_TARGET_MISSING', { caseId: spec.caseId, action, part });
      const expected = geometry[part], hidden = Boolean(expected.hidden);
      if (!auditOnly) {
        write(() => { child.hidden = hidden; });
        plugin(child, KI, spec.caseId);
        if (!hidden) place(child, instance, expected);
        if (part !== 'icon') { write(() => { child.characters = values[part]; }); applyText(child, slot.style, fontRows); }
      }
      const caseId = child.getPluginData?.(KI) || '';
      const m = part === 'icon' && identity === V2I ? currentMaster(instance, leafKey) : null;
      const mi = m ? nestedChild(m, leafKey, 'icon') : null;
      const iconSha = { not_interested: P.iconSha256.notInterested, calendar: P.iconSha256.calendar, share: P.iconSha256.share, like: P.iconSha256.like }[action];
      const inherited = caseId === '' && child.getPluginData?.(KC) === childMarker(leafKey, 'icon') && child.getPluginData?.(KP) === SHA && child.getPluginData?.('kenigevents-svg-sha256') === iconSha && mi?.getPluginData?.('kenigevents-svg-sha256') === iconSha && (mi.getPluginData?.(KI) || '') === '';
      if (Boolean(child.hidden) !== hidden || (caseId !== spec.caseId && !inherited)) fail('LINKED_ACTION_OVERRIDE_STATE_DRIFT', { caseId: spec.caseId, action, part });
      if (!hidden) auditBox(child, expected, 'LINKED_ACTION_OVERRIDE_GEOMETRY_DRIFT', { caseId: spec.caseId, action, part });
      if (!hidden && part !== 'icon' && child.characters !== values[part]) fail('LINKED_ACTION_OVERRIDE_CONTENT_DRIFT', { caseId: spec.caseId, action, part });
    }
  }

  async function ensureMedia(root, spec, auditOnly, identity = V3I) {
    const childKey = 'content.media-artwork', box = spec.slots.image.box, media = P.media[spec.fixtureId];
    if (!media) fail('CASE_MEDIA_PAYLOAD_MISSING', { caseId: spec.caseId, fixtureId: spec.fixtureId });
    let shape = findChild(root, spec.key, childKey, identity);
    if (!shape) {
      if (auditOnly) fail('CASE_MEDIA_SHAPE_MISSING', { caseId: spec.caseId });
      const aspect = media.fit === 'cover' ? 'xMidYMid slice' : 'xMidYMid meet';
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${box.width}" height="${box.height}" viewBox="0 0 ${box.width} ${box.height}"><defs><clipPath id="clip"><rect width="${box.width}" height="${box.height}"/></clipPath></defs><rect width="${box.width}" height="${box.height}" fill="#15110f"/><image clip-path="url(#clip)" x="0" y="0" width="${box.width}" height="${box.height}" preserveAspectRatio="${aspect}" href="data:image/webp;base64,${media.base64}" xlink:href="data:image/webp;base64,${media.base64}"/></svg>`;
      shape = await writeAsync(() => penpot.createShapeFromSvgWithImages(svg));
      if (!shape) fail('CREATE_CASE_MEDIA_SVG_FAILED', { caseId: spec.caseId });
      write(() => { shape.name = `${spec.fixtureId}.poster.${media.fit}.50-50`; });
      stampChild(shape, spec.key, childKey);
      plugin(shape, 'kenigevents-media-sha256', media.sha256);
      plugin(shape, 'kenigevents-media-fit', media.fit);
      plugin(shape, 'kenigevents-media-position', '50% 50%');
      plugin(shape, 'kenigevents-fixture-id', spec.fixtureId);
      place(shape, root, box);
    }
    auditBox(shape, box, 'CASE_MEDIA_GEOMETRY_DRIFT', { caseId: spec.caseId });
    if (shape.getPluginData?.('kenigevents-media-sha256') !== media.sha256 || shape.getPluginData?.('kenigevents-media-fit') !== media.fit || shape.getPluginData?.('kenigevents-media-position') !== '50% 50%' || shape.getPluginData?.('kenigevents-fixture-id') !== spec.fixtureId || shape.getPluginData?.(KP) !== identity.payloadSha256) fail('CASE_MEDIA_BINDING_DRIFT', { caseId: spec.caseId });
    return shape;
  }

  async function buildStatic(spec, root, fontRows, auditOnly, identity = V3I) {
    auditRadii(root, { radiusTL: 24, radiusTR: 24, radiusBR: 24, radiusBL: 24 }, 'CARD_ROOT_RADIUS_DRIFT', { key: spec.key });
    if (array(root.fills).length || array(root.strokes).length || root.clipContent !== false || root.getPluginData(KM) !== identity.marker(spec.key) || root.getPluginData(KP) !== identity.payloadSha256) fail('CARD_ROOT_STYLE_OR_PAYLOAD_DRIFT', { key: spec.key });
    rectChild(root, spec.key, 'surface.body', spec.slots.body.box, '#15110f', 1, null, !auditOnly, identity);
    const u = spec.slots['utility-row'].box;
    const utility = ensureBoardChild(root, spec.key, 'surface.utility-row', u, '#15110f', 1, spec.slots['utility-row'].style, !auditOnly, identity);
    rectChild(root, spec.key, 'body.border.left', { x: spec.slots.body.box.x, y: spec.slots.body.box.y, width: 1, height: spec.slots.body.box.height }, '#793014', 0.13, null, !auditOnly, identity);
    rectChild(root, spec.key, 'body.border.right', { x: spec.slots.body.box.width - 1, y: spec.slots.body.box.y, width: 1, height: spec.slots.body.box.height }, '#793014', 0.13, null, !auditOnly, identity);
    rectChild(utility, spec.key, 'utility.border.left', { x: 0, y: 0, width: 1, height: u.height }, '#793014', 0.13, null, !auditOnly, identity);
    rectChild(utility, spec.key, 'utility.border.right', { x: u.width - 1, y: 0, width: 1, height: u.height }, '#793014', 0.13, null, !auditOnly, identity);
    rectChild(utility, spec.key, 'utility.border.bottom', { x: 0, y: u.height - 1, width: u.width, height: 1 }, '#793014', 0.13, null, !auditOnly, identity);
    for (const slotName of ['title', 'occurrence', 'place']) {
      const slot = spec.slots[slotName];
      textChild(root, spec.key, slotName, slot.text, slot.box, slot.style, fontRows, !auditOnly, identity);
    }
    await ensureMedia(root, spec, auditOnly, identity);
  }

  function bindCard(spec, root, leaves, fontRows, auditOnly, role, identity = V3I) {
    const selected = spec.bindings.filter((binding) => role === 'shell' ? ['media-link', 'event-type', 'admission'].includes(binding.slotName) : !['media-link', 'event-type', 'admission'].includes(binding.slotName));
    for (const binding of selected) {
      const leaf = leaves[binding.leafKey];
      if (!leaf) fail('LEAF_COMPONENT_MISSING', { leafKey: binding.leafKey });
      const instance = ensureLink(root, spec.key, binding, leaf, !auditOnly, identity);
      bindInstance(instance, spec, binding, fontRows, auditOnly, identity);
    }
  }

  async function auditCard(spec, root, leaves, fontRows, identity = V3I) {
    await buildStatic(spec, root, fontRows, true, identity);
    bindCard(spec, root, leaves, fontRows, true, 'shell', identity);
    bindCard(spec, root, leaves, fontRows, true, 'actions', identity);
  }

  async function migrateLegacyV2Card(component, spec, root, leaves, fontRows) {
    if (!isV2(root, spec.key) || component.path !== CARD_PATH || component.name !== spec.name || root.parent?.id !== BOARD_ID || root.getPluginData?.('kenigevents-build-state') !== 'COMPLETE') fail('LEGACY_V2_CARD_NOT_MIGRATABLE', { key: spec.key, componentId: component.id, rootId: root.id });
    if (root.getPluginData?.('kenigevents-semantic-root') !== spec.semanticRoot || root.getPluginData?.('kenigevents-semantic-identity') !== 'component.event-card.free-collection' || root.getPluginData?.('kenigevents-structural-context') !== spec.structuralContext || root.getPluginData?.('kenigevents-case-id') !== spec.caseId) fail('LEGACY_V2_CARD_SEMANTIC_DRIFT', { key: spec.key });
    await auditCard(spec, root, leaves, fontRows, V2I);
    const expectedN = 8 + spec.bindings.length;
    if (children(root).length !== expectedN) fail('LEGACY_V2_CARD_CHILD_CARDINALITY', { key: spec.key, expected: expectedN, actual: children(root).length });
    return await withUndo(async () => {
      const oldCardPrefix = `${v2Marker(spec.key)}:`, newCardPrefix = `${marker(spec.key)}:`;
      for (const shape of walk(root).slice(1)) {
        const value = shape.getPluginData?.(KC) || '';
        if (!value.startsWith(oldCardPrefix)) continue;
        if (shape.getPluginData?.(KP) !== V2SHA) fail('LEGACY_V2_CARD_CHILD_PAYLOAD_DRIFT', { key: spec.key, shapeId: shape.id, value });
        plugin(shape, KC, `${newCardPrefix}${value.slice(oldCardPrefix.length)}`);
        plugin(shape, KP, SHA);
      }
      stamp(root, spec.key, 'accepted-card-master');
      plugin(root, 'kenigevents-build-state', 'COMPLETE');
      for (const binding of spec.bindings) {
        const instance = findChild(root, spec.key, binding.slotName);
        if (!instance) fail('MIGRATED_CARD_LINKED_INSTANCE_MISSING', { key: spec.key, slot: binding.slotName });
        migrateCopy(instance, binding.leafKey);
        place(instance, root, binding.box);
        bindInstance(instance, spec, binding, fontRows, false);
      }
      await buildStatic(spec, root, fontRows, false);
      await auditCard(spec, root, leaves, fontRows);
      return { component, main: root, created: true, state: 'COMPLETE', migratedFrom: 'G19_V2', preservedIds: true };
    });
  }

  function migrateLiveShell(root, spec) {
    if (spec.key !== 'eventcard.desktop-packed-calendar-absent.2182' || root.id !== '313fb1ed-0d5c-8095-8008-914c76615924' || root.parent?.id !== BOARD_ID || root.getPluginData?.(KM) !== marker(spec.key) || root.getPluginData?.(KP) !== V3SHA || root.getPluginData?.('kenigevents-build-state') !== 'BUILDING' || children(root).length !== 10 || walk(root).length - 1 !== 21) fail('LIVE_V3_PARTIAL_ROOT_NOT_MIGRATABLE', { key: spec.key, rootId: root?.id || null, payload: root?.getPluginData?.(KP) || null, state: root?.getPluginData?.('kenigevents-build-state') || null, directChildren: children(root).length, descendants: walk(root).length - 1 });
    const prefix = `${marker(spec.key)}:`;
    for (const shape of walk(root).slice(1)) {
      const cardChildMarker = shape.getPluginData?.(KC) || '';
      if (!cardChildMarker.startsWith(prefix)) continue;
      if (shape.getPluginData?.(KP) !== V3SHA) fail('LIVE_V3_PARTIAL_CHILD_PAYLOAD_DRIFT', { key: spec.key, shapeId: shape.id, cardChildMarker });
      plugin(shape, KP, SHA);
    }
    stamp(root, spec.key, 'accepted-card-master');
    plugin(root, 'kenigevents-build-state', 'BUILDING');
  }

  async function cardShell(spec, leaves, fontRows) {
    let component = findComp(CARD_PATH, spec.name) || allComps().find((candidate) => mainOf(candidate)?.getPluginData?.(KM) === marker(spec.key));
    if (component) {
      const main = mainOf(component);
      if (isV2(main, spec.key)) return migrateLegacyV2Card(component, spec, main, leaves, fontRows);
      if (!main || !cm(component, CARD_PATH, spec.name) || main.getPluginData('kenigevents-build-state') !== 'COMPLETE') fail('CARD_COMPONENT_IDENTITY_COLLISION', { key: spec.key });
      auditBox(main, { x: relativeX(main), y: relativeY(main), width: spec.box.width, height: spec.box.height }, 'CARD_ROOT_GEOMETRY_DRIFT', { key: spec.key });
      await auditCard(spec, main, leaves, fontRows);
      return { component, main, created: false, state: 'COMPLETE' };
    }
    return await withUndo(async () => {
      let root = findRoot(spec.key);
      if (!root) root = createCardRoot(spec);
      else if (root.getPluginData?.(KP) === V3SHA) migrateLiveShell(root, spec);
      const state = root.getPluginData('kenigevents-build-state');
      if (!['BUILDING', 'SHELL_COMPLETE'].includes(state)) fail('CARD_SHELL_PARTIAL_STATE_UNKNOWN', { key: spec.key, state });
      await buildStatic(spec, root, fontRows, state === 'SHELL_COMPLETE');
      bindCard(spec, root, leaves, fontRows, state === 'SHELL_COMPLETE', 'shell');
      plugin(root, 'kenigevents-build-state', 'SHELL_COMPLETE');
      return { component: null, main: root, created: state !== 'SHELL_COMPLETE', state: 'SHELL_COMPLETE' };
    });
  }

  async function cardFinal(spec, leaves, fontRows) {
    const existing = findComp(CARD_PATH, spec.name) || allComps().find((candidate) => mainOf(candidate)?.getPluginData?.(KM) === marker(spec.key));
    if (existing) {
      const main = mainOf(existing);
      const resumableRegistration = main?.getPluginData?.('kenigevents-build-state') === 'SHELL_COMPLETE'
        && main.getPluginData?.(KP) === SHA
        && ['', CARD_PATH].includes(existing.path)
        && ['', spec.name].includes(existing.name);
      if (resumableRegistration) return await withUndo(async () => {
        await auditCard(spec, main, leaves, fontRows);
        write(() => { existing.path = CARD_PATH; });
        write(() => { existing.name = spec.name; });
        plugin(main, 'kenigevents-component-name', spec.name);
        plugin(main, 'kenigevents-component-id', existing.id);
        plugin(main, 'kenigevents-build-state', 'COMPLETE');
        return { component: existing, main, created: true, state: 'COMPLETE', resumedRegistration: true };
      });
      if (!main || !cm(existing, CARD_PATH, spec.name) || main.getPluginData('kenigevents-build-state') !== 'COMPLETE') fail('CARD_COMPONENT_IDENTITY_COLLISION', { key: spec.key });
      await auditCard(spec, main, leaves, fontRows);
      return { component: existing, main, created: false, state: 'COMPLETE' };
    }
    return await withUndo(async () => {
      const root = findRoot(spec.key);
      if (!root || root.getPluginData('kenigevents-build-state') !== 'SHELL_COMPLETE') fail('CARD_SHELL_NOT_COMPLETE', { key: spec.key, state: root?.getPluginData?.('kenigevents-build-state') || null });
      await buildStatic(spec, root, fontRows, true);
      bindCard(spec, root, leaves, fontRows, true, 'shell');
      bindCard(spec, root, leaves, fontRows, false, 'actions');
      const component = write(() => penpot.library.local.createComponent([root]));
      if (!component) fail('CREATE_CARD_COMPONENT_FAILED', { key: spec.key });
      write(() => { component.path = CARD_PATH; });
      write(() => { component.name = spec.name; });
      plugin(root, 'kenigevents-component-name', spec.name);
      plugin(root, 'kenigevents-component-id', component.id);
      plugin(root, 'kenigevents-build-state', 'COMPLETE');
      return { component, main: mainOf(component) || root, created: true, state: 'COMPLETE' };
    });
  }

  function cardSpecs() {
    return P.cases.map((caseSpec, index) => {
      const viewport = caseSpec.viewport;
      const suffix = `${viewport}.8006`;
      const slotToLeaf = {
        'media-link': `event.media-frame.${suffix}`,
        'event-type': `event.meta.event-type.${suffix}`,
        admission: `event.meta.admission.${suffix}`,
        'action.not_interested': `event.action.not-interested.${suffix}`,
        'action.calendar': `event.action.calendar.${suffix}`,
        'action.share': `event.action.share.${suffix}`,
        'action.like': `event.action.like.${suffix}`,
      };
      return {
        key: caseSpec.caseId,
        name: caseSpec.caseId,
        caseId: caseSpec.caseId,
        fixtureId: caseSpec.fixtureId,
        semanticRoot: `kenigevents.free-collection.${caseSpec.caseId}`,
        viewport,
        structuralContext: caseSpec.variant,
        box: caseSpec.box,
        slots: caseSpec.slots,
        position: { x: (index % 2) * 620, y: Math.floor(index / 2) * 1040 },
        bindings: Object.entries(slotToLeaf).filter(([slotName]) => caseSpec.slots[slotName]).map(([slotName, leafKey]) => ({ slotName, leafKey, box: caseSpec.slots[slotName].box })),
      };
    });
  }

  function linked(instance) {
    if (typeof instance?.isComponentCopyInstance === 'function') return Boolean(instance.isComponentCopyInstance());
    if (typeof instance?.component === 'function') return Boolean(instance.component());
    return Boolean(instance?.componentId || instance?.getPluginData?.('kenigevents-linked') === 'true');
  }

  function validationResult() {
    const result = penpot.currentFile.validate();
    return Array.isArray(result) ? result : result == null ? [] : result;
  }

  function readback(strict = false) {
    const board = context(), fontRows = resolveFonts();
    const leafSpecsRows = leafSpecsAll();
    const cardSpecsAll = cardSpecs();
    const expectedLeafNames = leafSpecsRows.map((spec) => spec.name), cardNames = cardSpecsAll.map((spec) => spec.name);
    const names = [...expectedLeafNames, ...cardNames], expectedMarkers = new Set([...leafSpecsRows.map((spec) => marker(spec.key)), ...cardSpecsAll.map((spec) => marker(spec.key))]);
    const issues = [];
    const components = names.map((name) => {
      const pathValue = cardNames.includes(name) ? CARD_PATH : LEAF_PATH;
      const matches = allComps().filter((component) => cm(component, pathValue, name));
      const component = matches[0], main = mainOf(component);
      if (matches.length > 1 || (strict && matches.length !== 1)) issues.push({ code: 'COMPONENT_CARDINALITY', name, count: matches.length });
      if (main && (main.getPluginData?.('kenigevents-build-state') !== 'COMPLETE' || main.getPluginData?.(KP) !== SHA || main.parent?.id !== BOARD_ID)) issues.push({ code: 'COMPONENT_STATE_PAYLOAD_OR_PARENT', name, parentId: main.parent?.id || null });
      return { name, nativePath: component?.path ?? null, expectedPath: pathValue, componentId: component?.id || null, rootId: main?.id || null, marker: main?.getPluginData?.(KM) || null, width: main ? round(main.width) : null, height: main ? round(main.height) : null, directChildCount: main ? children(main).length : null };
    });
    for (const spec of leafSpecsRows) {
      const component = findComp(LEAF_PATH, spec.name), main = mainOf(component);
      if (main && (!eq(main.width, spec.box.width) || !eq(main.height, spec.box.height))) issues.push({ code: 'LEAF_ROOT_GEOMETRY', name: spec.name });
      const childN = spec.kind === 'media' ? 3 : spec.kind === 'text-pill' ? 1 : spec.inner.label && spec.inner.count ? 3 : 2;
      if (main && children(main).length !== childN) issues.push({ code: 'LEAF_CHILD_CARDINALITY', name: spec.name, expected: childN, actual: children(main).length });
      if (main && walk(main).filter((shape) => shape.type === 'text').some((shape) => shape.getPluginData?.(KFR) !== fontRows[700].runtimeFontId || shape.getPluginData?.(KFV) !== fontRows[700].variantId)) issues.push({ code: 'LEAF_TEXT_FONT', name: spec.name });
    }
    const cards = cardSpecsAll.map((spec) => {
      const component = findComp(CARD_PATH, spec.name), main = mainOf(component);
      const links = main ? children(main).filter(linked) : [], textShapes = main ? walk(main).filter((shape) => shape.type === 'text') : [], text = textShapes.map((shape) => shape.characters);
      if (main && (!eq(main.width, spec.box.width) || !eq(main.height, spec.box.height))) issues.push({ code: 'CARD_ROOT_GEOMETRY', name: spec.name });
      const expectedN = 8 + spec.bindings.length;
      if (main && children(main).length !== expectedN) issues.push({ code: 'CARD_CHILD_CARDINALITY', name: spec.name, expected: expectedN, actual: children(main).length });
      if (main && links.length !== spec.bindings.length) issues.push({ code: 'CARD_LINKED_LEAF_COUNT', name: spec.name, expected: spec.bindings.length, actual: links.length });
      if (main) for (const binding of spec.bindings) {
        const instance = findChild(main, spec.key, binding.slotName);
        if (!instance || !eq(relativeX(instance), binding.box.x) || !eq(relativeY(instance), binding.box.y) || !eq(instance.width, binding.box.width) || !eq(instance.height, binding.box.height)) issues.push({ code: 'CARD_SLOT_GEOMETRY', name: spec.name, slot: binding.slotName });
      }
      const fixture = P.fixtures[spec.fixtureId], requiredText = [fixture.title, fixture.type, fixture.occurrence, fixture.admission, fixture.place, 'Не интересно', 'Поделиться', ...(spec.slots['action.calendar'] ? ['В календарь'] : [])];
      if (main) for (const value of requiredText) if (!text.includes(value)) issues.push({ code: 'CARD_TEXT_MISSING', name: spec.name, value });
      if (main && textShapes.filter((shape) => !shape.hidden).some((shape) => shape.getPluginData?.(KFR) !== fontRows[700].runtimeFontId || shape.getPluginData?.(KFV) !== fontRows[700].variantId)) issues.push({ code: 'CARD_TEXT_FONT', name: spec.name });
      return { name: spec.name, fixtureId: spec.fixtureId, semanticRoot: main?.getPluginData?.('kenigevents-semantic-root') || null, structuralContext: main?.getPluginData?.('kenigevents-structural-context') || null, componentId: component?.id || null, rootId: main?.id || null, width: main ? round(main.width) : null, height: main ? round(main.height) : null, linkedLeafCount: links.length, linkedInstances: links.map((instance) => ({ instanceId: instance.id, slot: instance.getPluginData?.('kenigevents-instance-slot') || instance.name, componentId: instance.component?.()?.id || null })), text };
    });
    const roots = managedRoots(), rootMarkers = roots.map((root) => root.getPluginData(KM));
    const semanticTuples = roots.map((root) => `${root.getPluginData('kenigevents-semantic-identity')}|${root.getPluginData('kenigevents-structural-context')}`);
    const mainOfIds = new Set(allComps().map((component) => mainOf(component)?.id).filter(Boolean));
    const markerDuplicates = rootMarkers.length - new Set(rootMarkers).size;
    const unexpectedMarkers = rootMarkers.filter((value) => !expectedMarkers.has(value));
    const nameDuplicates = names.reduce((count, name) => count + Math.max(0, allComps().filter((component) => component.name === name && (component.path === CARD_PATH || component.path === LEAF_PATH)).length - 1), 0);
    const semanticDuplicates = semanticTuples.length - new Set(semanticTuples).size;
    const duplicates = markerDuplicates + nameDuplicates + semanticDuplicates + unexpectedMarkers.length;
    if (strict && roots.length !== names.length) issues.push({ code: 'MANAGED_ROOT_COUNT', expected: names.length, actual: roots.length });
    if (strict && allComps().length !== names.length) issues.push({ code: 'LOCAL_COMPONENT_COUNT', expected: names.length, actual: allComps().length });
    const validation = validationResult();
    const pendingRoots = roots.filter((root) => !mainOfIds.has(root.id));
    const resumableStates = new Set(['BUILDING', 'READY_FOR_COMPONENT', 'SHELL_COMPLETE']);
    const detachedRoots = pendingRoots.filter((root) => !resumableStates.has(root.getPluginData?.('kenigevents-build-state')));
    return {
      schema: 'kenigevents.penpot.g19.eventcard-four-case.readback.v2',
      fileId: penpot.currentFile.id,
      pageId: penpot.currentPage.id,
      revision: penpot.currentFile.revn ?? penpot.currentFile.revision ?? null,
      fixtureId: FIXTURE,
      payloadSha256: SHA,
      expectedBaselineRevision: ER,
      pageDirectRootCount: children(penpot.currentPage.root).length,
      board: { id: board.id, name: board.name, childCount: children(board).length, descendantCount: walk(board).length - 1 },
      managedBoardChildCount: roots.length,
      expectedManagedBoardChildCount: names.length,
      acceptedCardRootCount: cards.filter((card) => card.rootId).length,
      expectedAcceptedCardRootCount: 4,
      expectedManagedComponentCount: names.length,
      managedComponentCount: components.filter((component) => component.componentId).length,
      totalLocalComponentCount: allComps().length,
      inProgressRootCount: pendingRoots.length,
      pendingRoots: pendingRoots.map((root) => ({ id: root.id, name: root.name, state: root.getPluginData?.('kenigevents-build-state') || null })),
      detachedRootCount: detachedRoots.length,
      screenshotRootCount: roots.filter((root) => /screenshot/i.test(root.name) || root.getPluginData?.('kenigevents-role') === 'screenshot').length,
      routeLocalDuplicateMasterCount: duplicates,
      fontBinding: { family: FAMILY, sourceBindingSha256: P.fontSourceBindingSha256, regular: { runtimeFontId: fontRows[400].runtimeFontId, variantId: fontRows[400].variantId, weight: 400, style: 'normal', sourceSha256: FONT_SOURCES[400] }, bold: { runtimeFontId: fontRows[700].runtimeFontId, variantId: fontRows[700].variantId, weight: 700, style: 'normal', sourceSha256: FONT_SOURCES[700] } },
      components,
      cards,
      auditIssues: issues,
      validation,
    };
  }

  function base64(bytes) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let out = '';
    for (let i = 0; i < bytes.length; i += 3) {
      const a = bytes[i], b = i + 1 < bytes.length ? bytes[i + 1] : 0, c = i + 2 < bytes.length ? bytes[i + 2] : 0;
      const n = (a << 16) | (b << 8) | c;
      out += alphabet[(n >>> 18) & 63] + alphabet[(n >>> 12) & 63] + (i + 1 < bytes.length ? alphabet[(n >>> 6) & 63] : '=') + (i + 2 < bytes.length ? alphabet[n & 63] : '=');
    }
    return out;
  }

  async function exportedBytes(value) {
    if (value instanceof Uint8Array) return value;
    if (value instanceof ArrayBuffer) return new Uint8Array(value);
    if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    if (value && typeof value.arrayBuffer === 'function') return new Uint8Array(await value.arrayBuffer());
    if (typeof value === 'string' && value.startsWith('data:')) {
      return { dataUrl: value, base64: value.slice(value.indexOf(',') + 1) };
    }
    fail('UNSUPPORTED_PNG_EXPORT_RESULT', { type: typeof value });
  }

  async function exportRoots() {
    context();
    const exports = [];
    for (const caseSpec of P.cases) {
      const component = findComp(CARD_PATH, caseSpec.caseId), root = mainOf(component);
      if (!root) fail('ACCEPTED_CARD_ROOT_MISSING', { name: caseSpec.caseId });
      if (typeof root.export !== 'function') fail('PENPOT_EXPORT_API_MISSING', { rootId: root.id });
      const raw = await root.export({ type: 'png' });
      const converted = await exportedBytes(raw);
      const encoded = converted.base64 || base64(converted);
      exports.push({ name: caseSpec.caseId, rootId: root.id, componentId: component.id, mime_type: 'image/png', byte_length: converted.byteLength ?? null, base64: encoded, data_url: converted.dataUrl || `data:image/png;base64,${encoded}` });
    }
    return { schema: 'kenigevents.penpot.g19.eventcard-four-case.png-exports.v2', fileId: FILE_ID, pageId: PAGE_ID, boardId: BOARD_ID, exports };
  }

  const PHASE_ORDER = [
    'P10_DESKTOP_LEAVES_A', 'P11_DESKTOP_LEAVES_B',
    'P20_MOBILE_LEAVES_A', 'P21_MOBILE_LEAVES_B',
    'P30_DESKTOP_WIDE_SHELL', 'P31_DESKTOP_WIDE_FINAL',
    'P40_DESKTOP_PACKED_SHELL', 'P41_DESKTOP_PACKED_FINAL',
    'P50_MOBILE_WIDE_SHELL', 'P51_MOBILE_WIDE_FINAL',
    'P60_MOBILE_PACKED_SHELL', 'P61_MOBILE_PACKED_FINAL',
    'P90_FINALIZE',
  ];
  const previousPhase = (phaseId) => PHASE_ORDER[PHASE_ORDER.indexOf(phaseId) - 1] || null;
  const phaseLeafSpecs = (phaseId) => {
    const specs = leafSpecsAll(), desktop = specs.filter((spec) => spec.viewport === 'desktop'), mobile = specs.filter((spec) => spec.viewport === 'mobile');
    return ({ P10_DESKTOP_LEAVES_A: desktop.slice(0, 4), P11_DESKTOP_LEAVES_B: desktop.slice(4), P20_MOBILE_LEAVES_A: mobile.slice(0, 4), P21_MOBILE_LEAVES_B: mobile.slice(4) })[phaseId] || null;
  };
  const phaseCardSpec = (phaseId) => {
    const map = {
      P30_DESKTOP_WIDE_SHELL: 'eventcard.desktop-wide-calendar.8006', P31_DESKTOP_WIDE_FINAL: 'eventcard.desktop-wide-calendar.8006',
      P40_DESKTOP_PACKED_SHELL: 'eventcard.desktop-packed-calendar-absent.2182', P41_DESKTOP_PACKED_FINAL: 'eventcard.desktop-packed-calendar-absent.2182',
      P50_MOBILE_WIDE_SHELL: 'eventcard.mobile-wide-calendar.8006', P51_MOBILE_WIDE_FINAL: 'eventcard.mobile-wide-calendar.8006',
      P60_MOBILE_PACKED_SHELL: 'eventcard.mobile-packed-calendar-absent.2182', P61_MOBILE_PACKED_FINAL: 'eventcard.mobile-packed-calendar-absent.2182',
    };
    return cardSpecs().find((spec) => spec.caseId === map[phaseId]) || null;
  };
  const phaseComplete = (phaseId) => {
    const leafRows = phaseLeafSpecs(phaseId);
    if (leafRows) return leafRows.every((spec) => {
      const component = findComp(LEAF_PATH, spec.name), root = mainOf(component);
      return Boolean(component && root?.getPluginData?.(KM) === marker(spec.key) && root.getPluginData?.(KP) === SHA && root.getPluginData?.('kenigevents-build-state') === 'COMPLETE');
    });
    const card = phaseCardSpec(phaseId);
    if (card) {
      const component = findComp(CARD_PATH, card.name), root = mainOf(component) || findRoot(card.key);
      const current = root?.getPluginData?.(KM) === marker(card.key) && root.getPluginData?.(KP) === SHA;
      return phaseId.endsWith('_FINAL') ? Boolean(component && current && root?.getPluginData?.('kenigevents-build-state') === 'COMPLETE') : Boolean(current && ['SHELL_COMPLETE', 'COMPLETE'].includes(root.getPluginData?.('kenigevents-build-state')));
    }
    if (phaseId === 'P90_FINALIZE') return allComps().length === 18 && managedRoots().length === 18;
    return false;
  };
  const loadLeaves = () => Object.fromEntries(leafSpecsAll().map((spec) => {
    const component = findComp(LEAF_PATH, spec.name), main = mainOf(component);
    if (!component || !main || main.getPluginData?.('kenigevents-build-state') !== 'COMPLETE') fail('PHASE_LEAF_DEPENDENCY_MISSING', { leaf: spec.name });
    return [spec.key, { component, main, created: false }];
  }));


  async function saveVersion(phaseId, changed) {
    const label = `G19 P2 V3 ${phaseId} · ${SHA.slice(0, 12)}`;
    const versions = array(await penpot.currentFile.findVersions());
    let version = versions.find((candidate) => (candidate?.label || candidate?.name) === label) || null;
    const created = Boolean(changed || !version);
    if (created) version = await writeAsync(() => penpot.currentFile.saveVersion(label));
    return { id: version?.id || null, label: version?.label || version?.name || label, created };
  }

  function gate(rb) {
    const legacyRoots = managedRoots().filter((root) => {
      const value = root.getPluginData?.(KM) || '';
      return value.endsWith(':v2') && root.getPluginData?.(KP) === V2SHA;
    });
    if (!legacyRoots.length) return { active: false, accepted: rb.routeLocalDuplicateMasterCount === 0 && rb.auditIssues.length === 0, legacyRootNames: [] };
    const names = new Set(legacyRoots.map((root) => root.getPluginData('kenigevents-component-name')));
    const allowed = rb.auditIssues.every((issue) => names.has(issue.name) && ['COMPONENT_STATE_PAYLOAD_OR_PARENT', 'CARD_SLOT_GEOMETRY'].includes(issue.code));
    return { active: true, accepted: allowed && rb.routeLocalDuplicateMasterCount === legacyRoots.length, legacyRootNames: [...names] };
  }

  async function runPhase(phaseId) {
    if (!PHASE_ORDER.includes(phaseId)) fail('UNKNOWN_MATERIALIZATION_PHASE', { phaseId, allowed: PHASE_ORDER });
    assertPrimitives();
    const runLease = activeRun();
    const preflight = baseline();
    const fontRows = resolveFonts(); // Exact family + normal-{400,700}; runtime ids are receipt data, never pinned inputs.
    const dependency = previousPhase(phaseId);
    if (dependency && !phaseComplete(dependency)) fail('MATERIALIZATION_PHASE_DEPENDENCY_MISSING', { phaseId, dependency });
    const created = [], reused = [];
    const leafRows = phaseLeafSpecs(phaseId);
    if (leafRows) {
      for (const spec of leafRows) {
        const result = await ensureComp(
          spec,
          (root, auditOnly) => buildLeaf(spec, root, fontRows, auditOnly),
          (root) => buildLeaf(spec, root, fontRows, true, V2I),
        );
        (result.created ? created : reused).push({ role: 'leaf', name: spec.name, componentId: result.component.id, rootId: result.main.id });
      }
    } else if (phaseId !== 'P90_FINALIZE') {
      const spec = phaseCardSpec(phaseId), leaves = loadLeaves();
      const result = phaseId.endsWith('_SHELL') ? await cardShell(spec, leaves, fontRows) : await cardFinal(spec, leaves, fontRows);
      (result.created ? created : reused).push({ role: phaseId.endsWith('_SHELL') ? 'accepted-card-shell' : 'accepted-card', name: spec.name, componentId: result.component?.id || null, rootId: result.main.id, state: result.state });
    }
    const strict = phaseId === 'P90_FINALIZE';
    const beforeSave = readback(strict);
    const beforeMigration = gate(beforeSave);
    if (beforeSave.screenshotRootCount !== 0 || beforeSave.validation.length !== 0 || !beforeMigration.accepted || (strict && (beforeMigration.active || beforeSave.detachedRootCount !== 0 || beforeSave.acceptedCardRootCount !== 4 || beforeSave.managedComponentCount !== 18 || beforeSave.managedBoardChildCount !== 18 || beforeSave.totalLocalComponentCount !== 18))) fail('POST_PHASE_ACCEPTANCE_FAILED', { phaseId, migration: beforeMigration, readback: beforeSave });
    const savedVersion = await saveVersion(phaseId, created.length > 0);
    const result = readback(strict);
    const afterMigration = gate(result);
    if (result.validation.length || !afterMigration.accepted) fail('POST_PHASE_SAVE_ACCEPTANCE_FAILED', { phaseId, migration: afterMigration, readback: result });
    const terminalLease = activeRun();
    const mutatedObjectIds = created.flatMap((row) => row.mutatedObjectIds || []);
    return { schema: 'kenigevents.penpot.g19.eventcard-four-case.phase-receipt.v3', phaseId, terminalState: created.length ? 'SUCCEEDED' : 'SUCCEEDED_IDEMPOTENT_REUSE', mutations: mutatedObjectIds.length || created.length, mutatedObjectIds, runControl: { run_id: runLease.run_id, writer_id: runLease.writer_id, state: terminalLease.state, contract_sha256: runLease.contract_sha256, page_profile_sha256: runLease.page_profile_sha256, asset_registry_sha256: runLease.asset_registry_sha256, geometry_proof_sha256: runLease.geometry_proof_sha256 }, preflight, created, reused, migration: afterMigration, savedVersion, completedPhases: PHASE_ORDER.filter(phaseComplete), pendingPhases: PHASE_ORDER.filter((id) => !phaseComplete(id)), readback: result };
  }

  const api = { runPhase, readback, exportRoots, constants: { FILE_ID, PAGE_ID, BOARD_ID, BOARD_NAME, ER, EBC, EBD, ELC, FAMILY, FONT_SOURCES, LEAF_PATH, CARD_PATH, FIXTURE, PHASE_ORDER } };
  storage.g19EventCard8006 = api;
  return { schema: 'kenigevents.penpot.g19.eventcard-four-case.runtime-ready.v2', installed: true, payloadSha256: SHA, phaseOrder: PHASE_ORDER, preflight: baseline(), fontBinding: readback(false).fontBinding };
}

async function main() {
  const rows = [];
  const bytesByPath = {};
  for (const relative of INPUTS) {
    const bytes = await readFile(path.join(ROOT, relative));
    const actual = sha256(bytes);
    if (actual !== ACCEPTED_HASHES[relative]) throw new Error(`accepted input hash mismatch for ${relative}: ${actual}`);
    rows.push({ path: relative, sha256: actual, bytes: bytes.length });
    bytesByPath[relative] = bytes;
  }
  const expectations = json(bytesByPath[EXPECTATIONS]);
  const fontBinding = json(bytesByPath[FONT_BINDING]);
  const astroBinding = json(bytesByPath[ASTRO_BINDING]);
  const descendants = json(bytesByPath[DESCENDANTS]);
  const regions = json(bytesByPath[REGIONS]);
  const bundle = json(bytesByPath['catalog/materialization-bundles/eventcard-free-slice.g4.ready-v1.json']);
  const resolvedIndex = json(bytesByPath['catalog/ui-conformance/free-collection/g4/resolved/resolved-cases.index.json']);
  if (fontBinding.content_sha256 !== '7c7200f93156ee60a456f1b666b84d73a45b405ce23198150c89c87d092d1226') throw new Error('font source binding content identity mismatch');
  if (astroBinding.head !== 'c7c3e2367db8fd8865a735c8b9f5df1ef2b6efd1' || descendants.source.head !== astroBinding.head || descendants.source.sha256 !== 'ce4bff02b0de75aca895507e17bbee27d44c5728dd800baece3ab4e098a77ecf') throw new Error('frozen Astro evidence binding mismatch');
  if (JSON.stringify(deriveDescendantCases(regions)) !== JSON.stringify(descendants.cases)) throw new Error('frozen descendant excerpt does not reproduce from bound regions.json');
  const wanted = ['eventcard.desktop-wide-calendar.8006', 'eventcard.desktop-packed-calendar-absent.2182', 'eventcard.mobile-wide-calendar.8006', 'eventcard.mobile-packed-calendar-absent.2182'];
  if (JSON.stringify(bundle.required_case_ids) !== JSON.stringify(wanted)) throw new Error('promoted four-case bundle lineage mismatch');
  for (const caseId of wanted) if (!resolvedIndex.cases.some((item) => item.case_id === caseId && ACCEPTED_HASHES[item.resolved_case_path] === item.file_sha256)) throw new Error(`resolved case index identity mismatch ${caseId}`);
  const cases = wanted.map((caseId) => {
    const source = expectations.cases.find((candidate) => candidate.case_id === caseId);
    if (!source) throw new Error(`missing accepted case ${caseId}`);
    return { caseId, variant: source.variant, fixtureId: source.fixture_id, viewport: source.viewport, box: source.box, slots: Object.fromEntries(Object.entries(source.slots).map(([name, slot]) => [name, compactSlot(slot)])) };
  });
  const fixtures = Object.fromEntries([...new Set(cases.map((item) => item.fixtureId))].map((fixtureId) => {
    const source = cases.find((item) => item.fixtureId === fixtureId), fixture = expectations.fixtures[fixtureId];
    return [fixtureId, { title: source.slots.title.text, type: source.slots['event-type'].text, occurrence: source.slots.occurrence.text, admission: source.slots.admission.text, place: source.slots.place.text, shares: fixture.shares, likes: fixture.likes }];
  }));
  const leafIdentities = ['event.media-frame', 'event.meta.event-type', 'event.meta.admission', 'event.action.not-interested', 'event.action.calendar', 'event.action.share', 'event.action.like'];
  const expectedLeafComponents = ['desktop', 'mobile'].flatMap((viewport) => leafIdentities.map((identity) => `${identity}.${viewport}.8006`));
  const payloadCore = {
    schema: 'kenigevents.penpot.g19.eventcard-8006.payload.v1',
    controlGeneration: 19,
    leaseId: 'G19-P2-P4-ACTUAL-MATERIALIZATION-R1',
    solePenpotWriter: 'D0/PUBLISH',
    runControl: {
      runId: '01a05819-82c8-7e70-a088-ed262f425ec6',
      writerId: '/root/publish_r2',
      contractSha256: '54002c01430d48d836af491a09f493526c309e0779c2c6f0deedbf434975cf72',
      pageProfileSha256: 'a2fbdba547f8829308f88231f96fce0cc54c441f741e99a7a846dcf0333ea461',
      assetRegistrySha256: 'bbb07cc7d218d4ff69cc21ee002652b21c9e6c4efdbf65a23b9805f97eb7efb4',
      geometryProofSha256: '5395c56376847d36a6ebc8e5d4988a2b06c4cac9acd27426dd73276620031307',
    },
    geometryProof: {
      repository: 'onedayonemasterpiece/lovekgd-design-system',
      branch: 'task/d0-corpus-20260831',
      commit: 'bf7a4c9aa20978d297bd8f53058042e0436f8554',
      path: 'catalog/corpus-d0/free-collection-eventcard-geometry-proof.v1.json',
      rawSha256: 'f176e96786b7f0e56cd292e122fb3ce006c2983d3c6fac8686fcf36d9862442b',
      proofPayloadSha256: '5395c56376847d36a6ebc8e5d4988a2b06c4cac9acd27426dd73276620031307',
      harnessReceiptComment: 5480171331,
    },
    requirementsContract: { repository: 'onedayonemasterpiece/lovekgd-design-system', commit: 'f134001382f547cebe8b025da24065128b174ffb', path: 'docs/product-governance/astro-sot-penpot-conformance.md', gitBlobSha1: '24e02d3048f2feba912cb990f8226b23006e8c2c', sha256: '54002c01430d48d836af491a09f493526c309e0779c2c6f0deedbf434975cf72' },
    pageProfile: { repository: 'onedayonemasterpiece/lovekgd-design-system', commit: '8b2e8f603c60d58bebc43c6f66f21f55094bd779', path: 'contracts/page-profiles/free-collection.owner-review.v1.yaml', gitBlobSha1: '8049669639d6229f61eab1533127f81a218fc61d', sha256: 'a2fbdba547f8829308f88231f96fce0cc54c441f741e99a7a846dcf0333ea461' },
    fileId: '40e06342-8830-80d6-8008-8fc8a3a4cd4f',
    pageId: 'c16498cb-b51d-8030-8008-904bd8fc9c53',
    boardId: '313fb1ed-0d5c-8095-8008-9108df52b2ce',
    boardName: 'KenigEvents · G12 bounded L0-L3',
    expectedBaselineRevision: 56,
    promotedUiSot: '78a84576740cb650b2efbe2900377f371faf49a1',
    acceptedExecutorFontBinding: '4d352be4f908209091020bf1689792f1aa7e4280',
    frozenAstroEvidence: 'c7c3e2367db8fd8865a735c8b9f5df1ef2b6efd1',
    c2FinalControlReference: 'f280254308a636335de74f8cbdc8df95999a0b90',
    fixtureIds: ['event.real.8006', 'event.real.2182'],
    fontSourceBindingSha256: fontBinding.content_sha256,
    fontSources: { 400: fontBinding.sources.regular.sha256, 700: fontBinding.sources.bold.sha256 },
    fixtures,
    media: {
      'event.real.8006': { sha256: ACCEPTED_HASHES[MEDIA_8006], fit: 'contain', position: '50% 50%', base64: bytesByPath[MEDIA_8006].toString('base64') },
      'event.real.2182': { sha256: ACCEPTED_HASHES[MEDIA_2182], fit: 'cover', position: '50% 50%', base64: bytesByPath[MEDIA_2182].toString('base64') },
    },
    icons: {
      notInterested: bytesByPath[ACTION_ASSETS.notInterested].toString('utf8'),
      calendar: bytesByPath[ACTION_ASSETS.calendar].toString('utf8'),
      share: bytesByPath[ACTION_ASSETS.share].toString('utf8'),
      like: bytesByPath[ACTION_ASSETS.like].toString('utf8'),
    },
    iconSha256: {
      notInterested: ACCEPTED_HASHES[ACTION_ASSETS.notInterested],
      calendar: ACCEPTED_HASHES[ACTION_ASSETS.calendar],
      share: ACCEPTED_HASHES[ACTION_ASSETS.share],
      like: ACCEPTED_HASHES[ACTION_ASSETS.like],
    },
    assetBindings: {
      registry: { repository: 'onedayonemasterpiece/lovekgd-design-system', commit: '0eb4c0a505e0aea522da2138cb1fb40f97d45edf', path: 'contracts/assets/ui-asset-registry.v1.yaml', gitBlobSha1: '271a622633f399bb52cfe322c259a8dc4162bf7e', sha256: 'bbb07cc7d218d4ff69cc21ee002652b21c9e6c4efdbf65a23b9805f97eb7efb4' },
      materializationCommit: 'be313816ce22a7c63faed682e4014854e6e7369b',
      actions: {
        notInterested: { assetId: 'icon.action.not_interested', path: ACTION_ASSETS.notInterested, gitBlobSha1: '2cd0ebf989d63176a8e5f240c681316fab2e0670', sha256: ACCEPTED_HASHES[ACTION_ASSETS.notInterested], bytes: 912 },
        calendar: { assetId: 'icon.action.calendar_add', path: ACTION_ASSETS.calendar, gitBlobSha1: '539baa5a7ab4f8794c2af3dae63a732cb00d1408', sha256: ACCEPTED_HASHES[ACTION_ASSETS.calendar], bytes: 374 },
        share: { assetId: 'icon.action.share', path: ACTION_ASSETS.share, gitBlobSha1: '3b6a82536becf79040c1201b327c93123080b557', sha256: ACCEPTED_HASHES[ACTION_ASSETS.share], bytes: 719 },
        like: { assetId: 'icon.action.favorite', path: ACTION_ASSETS.like, gitBlobSha1: 'e7b836f1f102ab787364077f1cc84fb2863b87ca', sha256: ACCEPTED_HASHES[ACTION_ASSETS.like], bytes: 459 },
      },
    },
    descendants: descendants.cases,
    cases,
    inputs: rows,
  };
  const payloadSha256 = sha256(Buffer.from(JSON.stringify(payloadCore)));
  const payload = { ...payloadCore, payloadSha256 };
  const payloadText = JSON.stringify(payload), payloadTransportSha256 = sha256(Buffer.from(payloadText)), payloadChunks = payloadText.match(/[\s\S]{1,48000}/g) || [];
  const bootstrapSource = `/** G19 P2 V3 read-only bounded payload uploader bootstrap. */\nreturn (()=>{const session=${JSON.stringify(payloadTransportSha256)};const state={session,total:null,chunks:[],append(index,total,chunk){if(this.session!==session)throw new Error('G19_UPLOAD_SESSION_DRIFT');if(!Number.isInteger(index)||index<0||index>=total)throw new Error('G19_UPLOAD_INDEX_INVALID');if(this.total!=null&&this.total!==total)throw new Error('G19_UPLOAD_TOTAL_DRIFT');this.total=total;if(this.chunks[index]!=null){if(this.chunks[index]!==chunk)throw new Error('G19_UPLOAD_CHUNK_DRIFT');return {schema:'kenigevents.penpot.g19.upload-receipt.v3',index,reused:true,received:this.chunks.filter(v=>v!=null).length,total};}this.chunks[index]=chunk;return {schema:'kenigevents.penpot.g19.upload-receipt.v3',index,reused:false,received:this.chunks.filter(v=>v!=null).length,total};},seal(total,chars){if(this.total!==total||this.chunks.length!==total||this.chunks.some(v=>typeof v!=='string'))throw new Error('G19_UPLOAD_INCOMPLETE');const text=this.chunks.join('');if(text.length!==chars)throw new Error('G19_UPLOAD_LENGTH_MISMATCH');return text;}};storage.g19EventCard8006Upload=state;delete storage.g19EventCard8006;return {schema:'kenigevents.penpot.g19.upload-ready.v3',session,total:${payloadChunks.length},chars:${payloadText.length},mutations:0};})();\n`;
  const chunkOutputs = Object.fromEntries(payloadChunks.map((chunk, index) => [`phase-01-payload-${String(index + 1).padStart(3, '0')}.js`, `/** G19 P2 V3 payload chunk ${index + 1}/${payloadChunks.length}; read-only. */\nif(!storage.g19EventCard8006Upload)throw new Error('G19_UPLOAD_NOT_BOOTSTRAPPED');return storage.g19EventCard8006Upload.append(${index},${payloadChunks.length},${JSON.stringify(chunk)});\n`]));
  const verifySource = `/** G19 P2 V3 seal and verify payload without mutation. */\nconst text=storage.g19EventCard8006Upload?.seal(${payloadChunks.length},${payloadText.length});const digest=(${compactGeneratedFunction(sha256Utf8Text)})(text);if(digest!==${JSON.stringify(payloadTransportSha256)})throw new Error('G19_PAYLOAD_SHA256_MISMATCH');const P=JSON.parse(text);if(P.payloadSha256!==${JSON.stringify(payloadSha256)})throw new Error('G19_PAYLOAD_CORE_IDENTITY_MISMATCH');storage.g19EventCard8006Payload=P;return {schema:'kenigevents.penpot.g19.payload-verified.v3',payloadSha256:P.payloadSha256,mutations:0};\n`;
  const installSource = `const P=storage.g19EventCard8006Payload;if(!P||P.payloadSha256!==${JSON.stringify(payloadSha256)})throw new Error('G19_PAYLOAD_NOT_VERIFIED');return await (${compactGeneratedFunction(installProductionRuntime)})(P);\n`;
  const mutationPhases = ['P10_DESKTOP_LEAVES_A','P11_DESKTOP_LEAVES_B','P20_MOBILE_LEAVES_A','P21_MOBILE_LEAVES_B','P30_DESKTOP_WIDE_SHELL','P31_DESKTOP_WIDE_FINAL','P40_DESKTOP_PACKED_SHELL','P41_DESKTOP_PACKED_FINAL','P50_MOBILE_WIDE_SHELL','P51_MOBILE_WIDE_FINAL','P60_MOBILE_PACKED_SHELL','P61_MOBILE_PACKED_FINAL','P90_FINALIZE'];
  const phaseOutputs = Object.fromEntries(mutationPhases.map((phaseId) => [`phase-${phaseId.toLowerCase().replaceAll('_', '-')}.js`, `/** G19 P2 V3 bounded idempotent mutator ${phaseId}. */\nif(!storage.g19EventCard8006)throw new Error('G19_RUNTIME_NOT_INSTALLED');return await storage.g19EventCard8006.runPhase(${JSON.stringify(phaseId)});\n`]));
  phaseOutputs['phase-p91-text-metrics.js'] = `const P=storage.g19EventCard8006Payload;if(!P||P.payloadSha256!==${JSON.stringify(payloadSha256)})throw new Error('G19_PAYLOAD_NOT_VERIFIED');return await (${compactGeneratedFunction(repairTextMetricsPhase)})(P);\n`;
  phaseOutputs['phase-p92-text-layout-canary.js'] = `const P=storage.g19EventCard8006Payload;if(!P||P.payloadSha256!==${JSON.stringify(payloadSha256)})throw new Error('G19_PAYLOAD_NOT_VERIFIED');return await (${compactGeneratedFunction(invalidateTextLayoutCanaryPhase)})(P);\n`;
  phaseOutputs['readback-p92-text-layout-canary.js'] = `const P=storage.g19EventCard8006Payload;if(!P||P.payloadSha256!==${JSON.stringify(payloadSha256)})throw new Error('G19_PAYLOAD_NOT_VERIFIED');return (${compactGeneratedFunction(readTextLayoutCanaryPhase)})(P);\n`;
  phaseOutputs['phase-p93-event-type-peers.js'] = `const P=storage.g19EventCard8006Payload;if(!P||P.payloadSha256!==${JSON.stringify(payloadSha256)})throw new Error('G19_PAYLOAD_NOT_VERIFIED');return await (${compactGeneratedFunction(expandEventTypePeersPhase)})(P);\n`;
  phaseOutputs['readback-p93-event-type-peers.js'] = `const P=storage.g19EventCard8006Payload;if(!P||P.payloadSha256!==${JSON.stringify(payloadSha256)})throw new Error('G19_PAYLOAD_NOT_VERIFIED');return (${compactGeneratedFunction(readEventTypePeersPhase)})(P);\n`;
  const readbackSource = `/** G19 P2 V3 readback + validate; read-only. */\nif(!storage.g19EventCard8006)throw new Error('G19_RUNTIME_NOT_INSTALLED');return storage.g19EventCard8006.readback(false);\n`;
  const exportSource = `/** Export all four accepted EventCard roots as directly decodable PNG payloads. */\nif(!storage.g19EventCard8006)throw new Error('G19_RUNTIME_NOT_INSTALLED');return await storage.g19EventCard8006.exportRoots();\n`;
  const outputs = { 'phase-00-bootstrap.js': bootstrapSource, ...chunkOutputs, 'phase-02-verify-payload.js': verifySource, 'phase-03-install-runtime.js': installSource, ...phaseOutputs, 'readback.js': readbackSource, 'export-roots.js': exportSource };
  const setupOrder = ['phase-00-bootstrap.js', ...Object.keys(chunkOutputs), 'phase-02-verify-payload.js', 'phase-03-install-runtime.js'];
  const mutatorOrder = [...mutationPhases.map((phaseId) => `phase-${phaseId.toLowerCase().replaceAll('_', '-')}.js`), 'phase-p91-text-metrics.js', 'phase-p92-text-layout-canary.js', 'phase-p93-event-type-peers.js'];
  const outputRows = Object.entries(outputs).map(([file, source]) => ({ path: `catalog/penpot-executor/g19/${file}`, sha256: sha256(Buffer.from(source)), bytes: Buffer.byteLength(source) }));
  const executableSetSha256 = sha256(Buffer.from(outputRows.map((row) => `${row.path}\0${row.sha256}\n`).join('')));
  const manifest = {
    schema: 'kenigevents.penpot.g19.eventcard-four-case.manifest.v3',
    readiness_marker: 'ASP_G19_P2_PAYLOAD_READY_V3',
    generation: 19,
    lease_id: payload.leaseId,
    sole_penpot_writer: payload.solePenpotWriter,
    penpot_mutations_by_codex: 0,
    target: { file_id: payload.fileId, page_id: payload.pageId, expected_baseline_revision: 56, accepted_board_id: payload.boardId, accepted_board_name: payload.boardName, expected_page_direct_roots: 1, expected_initial_board_children: 16, expected_initial_board_descendants: 137, expected_initial_local_components: 15, expected_initial_validation: [], preserved_partial_root: { id: '313fb1ed-0d5c-8095-8008-914c76615924', name: 'eventcard.desktop-packed-calendar-absent.2182', direct_children: 10, descendants: 21, build_state: 'BUILDING', marker: 'kenigevents:g19:p2:eventcard.desktop-packed-calendar-absent.2182:v3', payload_sha256: 'c6c35b6f39e3cd5bc68bfe183c1df0652475533d4eecbaea8bd7bca1b4b35219', component_id: null } },
    accepted_tuple: { promoted_ui_sot: payload.promotedUiSot, accepted_executor_font_binding: payload.acceptedExecutorFontBinding, frozen_astro_evidence: payload.frozenAstroEvidence, c2_final_control_reference: payload.c2FinalControlReference },
    object_provenance: {
      design_system: {
        promoted_ui_sot: { commit: payload.promotedUiSot, tree: 'd1cb94fe462dd2d56698d8528dd382f462725e6d' },
        accepted_executor_font_binding: { commit: payload.acceptedExecutorFontBinding, tree: '435d53f36600953efe093ebcfd88cc79e76615d2' },
        delivery_base: { commit: '7bf067475a1dd03b5208b804ced9dbed277cdf30', tree: '47095a9f2089e3fc8f99752252bbcc367034d84c' },
      },
      events_bot_new: {
        frozen_astro_evidence: { commit: payload.frozenAstroEvidence, tree: '3c7b231d10e93866899cede299c3523c8b996711', binding_path: ASTRO_BINDING, regions_git_blob_sha1: descendants.source.git_blob_sha1, regions_sha256: descendants.source.sha256 },
        c2_final: { commit: payload.c2FinalControlReference, tree: 'ef0dfc93717da62b9e77cf494ca755baa180f145' },
      },
    },
    payload_sha256: payloadSha256,
    payload_transport_sha256: payloadTransportSha256,
    executable_set_sha256: executableSetSha256,
    executable_set_identity_format: 'UTF-8 concatenation of path, NUL, SHA-256, LF in manifest output order',
    expected_card_components: wanted,
    expected_leaf_components: expectedLeafComponents,
    requirements_contract: payload.requirementsContract,
    page_profile: payload.pageProfile,
    asset_bindings: payload.assetBindings,
    geometry_proof: payload.geometryProof,
    run_control: { namespace: 'kenigevents', key: 'asp-active-run-v1', schema: 'kenigevents.asp-run-control.v1', expected_run_id: payload.runControl.runId, expected_writer_id: payload.runControl.writerId, allowed_state: 'ACTIVE', recheck: 'before every write and after every awaited operation before the next write', bootstrap_included: false, contract_sha256: payload.runControl.contractSha256, page_profile_sha256: payload.runControl.pageProfileSha256, asset_registry_sha256: payload.runControl.assetRegistrySha256, geometry_proof_sha256: payload.runControl.geometryProofSha256 },
    provenance_receipt_template: {
      schema: 'kenigevents.asp-materialization-receipt.v1',
      run_id: payload.runControl.runId,
      actor_type: 'codex-child-agent',
      actor_id: payload.runControl.writerId,
      triggered_by: 'D0 persistent goal / issue 57',
      astro_repository: 'onedayonemasterpiece/events-bot-new',
      astro_commit: payload.frozenAstroEvidence,
      route: '/podborki/besplatnye-sobytiya/',
      scenario: 'free-collection-september-mobile-v3',
      viewport: null,
      ui_sot_repository: 'onedayonemasterpiece/lovekgd-design-system',
      ui_sot_commit: payload.promotedUiSot,
      requirements_contract_hash: payload.runControl.contractSha256,
      page_profile_hash: payload.runControl.pageProfileSha256,
      asset_registry_hash: payload.runControl.assetRegistrySha256,
      materializer_name: 'g19-eventcard-8006',
      materializer_version: 'v3',
      materializer_commit: null,
      started_at: null,
      completed_at: null,
      final_state: null,
      penpot_file_id: payload.fileId,
      penpot_page_id: payload.pageId,
      penpot_frame_ids: [],
      mutation_count: 0,
      mutated_object_ids: [],
      asset_binding_digest: payload.runControl.assetRegistrySha256,
      geometry_proof_digest: payload.runControl.geometryProofSha256,
      validation_result: null,
      owner_review_state: 'NOT_REVIEWED',
      completion_rule: 'PUBLISH fills every null/runtime field from native receipts; nulls are never an accepted final receipt',
    },
    materialization_profile: {
      owner_override: 'G19-P2-P4-ACTUAL-MATERIALIZATION-R1',
      accepted_card_encoding: 'four exact fixture-bound structural-context root components under the immutable accepted G12 board',
      common_semantic_identity: 'component.event-card.free-collection',
      leaf_encoding: 'seven semantic identities per structural context; duplicate detection key is semantic_identity plus structural_context',
      accepted_g12_one_master_variant_container: 'preserved as upstream model; not rewritten by this bounded first-material payload',
    },
    expected_success: { page_direct_roots: 1, board_children: 18, local_components: 18, accepted_card_components: 4, detached_roots: 0, screenshot_roots: 0, route_local_duplicate_masters: 0, validation: [] },
    case_lineage: wanted.map((caseId) => { const item = cases.find((candidate) => candidate.caseId === caseId); return { case_id: caseId, fixture_id: item.fixtureId, variant: item.variant, viewport: item.viewport, source: `${EXPECTATIONS}#${caseId}` }; }),
    native_fonts: { family: 'DejaVu Sans', resolution: 'native family plus exact style=normal, weight and variant id normal-{weight}; resolved runtime font id and variant id are receipt fields', regular_400_variant: 'normal-400', bold_700_variant: 'normal-700', regular_400_source_sha256: fontBinding.sources.regular.sha256, bold_700_source_sha256: fontBinding.sources.bold.sha256, source_binding_sha256: fontBinding.content_sha256, transient_runtime_ids_pinned: false },
    inputs: rows,
    outputs: outputRows,
    execution: { same_plugin_session_required: true, setup_order: setupOrder, mutator_order: mutatorOrder, checkpoint_after_every_mutator: 'Pass readback.js; each phase receipt already embeds the same census plus validate().', export_png: 'Pass export-roots.js after P90_FINALIZE.', maximum_generated_script_bytes: Math.max(...Object.values(outputs).map((source) => Buffer.byteLength(source))) },
  };
  await mkdir(OUT, { recursive: true });
  for (const file of await readdir(OUT)) if ((file === 'run-materialization.js' || file.startsWith('phase-') || file === 'readback.js' || file === 'export-roots.js') && !Object.hasOwn(outputs, file)) await rm(path.join(OUT, file));
  for (const [file, source] of Object.entries(outputs)) await writeFile(path.join(OUT, file), source);
  await writeFile(path.join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ payloadSha256, outputs: manifest.outputs }, null, 2)}\n`);
}

await main();
