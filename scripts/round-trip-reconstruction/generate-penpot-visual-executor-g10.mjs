#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT_DIR = path.join(ROOT, 'catalog/penpot-executor/g10');
const SCRIPT_PATH = path.join(OUT_DIR, 'capsule/penpot-visual-executor.g10.js');
const MANIFEST_PATH = path.join(OUT_DIR, 'capsule/manifest.json');
const CONTROL_BODY_SHA256 = 'dc7d5b190e88d86dc8967d02d9544c6917c5473de519f77621abc58873916d4a';
const REVIEW_BODY_SHA256 = 'e990b3ebc2bf55e770a21efa0e85f6e338ffb45606027d6f78c81344fa18c48f';
const G9_SHA = '5b37a6eb9ff5664bbf8549bf7906730be4c634d0';
const G9_TREE = '7743c4482f3b18ac3e2bf34b380b926276747442';

const CASE_PATHS = [
  'catalog/ui-conformance/free-collection/g4/resolved/eventcard.desktop-wide-calendar.8006.resolved-render-case.json',
  'catalog/ui-conformance/free-collection/g4/resolved/eventcard.desktop-packed-calendar-absent.2182.resolved-render-case.json',
  'catalog/ui-conformance/free-collection/g4/resolved/eventcard.mobile-wide-calendar.8006.resolved-render-case.json',
  'catalog/ui-conformance/free-collection/g4/resolved/eventcard.mobile-packed-calendar-absent.2182.resolved-render-case.json',
  'catalog/ui-conformance/free-collection/g4/resolved/free-collection.desktop.full.resolved-render-case.json',
  'catalog/ui-conformance/free-collection/g4/resolved/free-collection.mobile.full.resolved-render-case.json',
];
const CONTRACT_PATH = 'catalog/ui-components/event-card-large/component-contract.v2.json';
const EVIDENCE_PATH = 'catalog/ui-conformance/free-collection/g4/evidence-plan.json';
const GEOMETRY_PATH = 'catalog/ui-conformance/free-collection/g4/resolved/geometry-proof.json';
const INDEX_PATH = 'catalog/ui-conformance/free-collection/g4/resolved/resolved-cases.index.json';
const BUNDLE_PATH = 'catalog/materialization-bundles/eventcard-free-slice.g4.ready-v1.json';
const ASSET_PATHS = [
  'catalog/ui-assets/v1/icons/action-share.svg',
  'catalog/ui-assets/v1/icons/action-favorite-outline.svg',
  'catalog/ui-assets/v1/icons/action-not-interested.svg',
  'catalog/ui-assets/v1/icons/action-calendar-add.svg',
  'catalog/ui-assets/v1/illustrations/free-listing-medallion.svg',
];

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel));
const parse = (rel) => JSON.parse(read(rel));
const canonical = (value) => JSON.stringify(value, Object.keys(value).sort());

function fixtureMap(pageCase) {
  return Object.fromEntries(pageCase.payload.fixtures.map((entry) => [entry.fixture_id, entry.preview_event]));
}

function primaryMedia(pageCase, fixtureId) {
  const media = pageCase.payload.assets.fixture_media[fixtureId]?.find((entry) => entry.role === 'primary');
  if (!media) throw new Error(`missing primary media:${fixtureId}`);
  const mediaPath = `catalog/penpot-executor/g10/input-media/${media.sha256}.webp`;
  const bytes = read(mediaPath);
  if (sha256(bytes) !== media.sha256) throw new Error(`media hash mismatch:${fixtureId}`);
  return { ...media, bytes_base64: bytes.toString('base64'), embedded_path: mediaPath };
}

function parsePx(value) {
  if (String(value) === '0') return 0;
  const match = /^([0-9.]+)px$/.exec(String(value));
  if (!match) throw new Error(`not an exact px value:${value}`);
  return Number(match[1]);
}

function deriveCase(caseDoc, fixtureId, pageCase, scenario, groupId) {
  const fixture = fixtureMap(pageCase)[fixtureId];
  if (!fixture) throw new Error(`fixture absent:${fixtureId}`);
  const crop = pageCase.payload.crop[fixtureId];
  const contract = caseDoc.payload.geometry.component_contract.meta_flow;
  const css = Object.fromEntries(caseDoc.payload.geometry.source_bound_css.map((x) => [x.selector, x.declarations]));
  const mediaCss = css['.event-card--split-actions .event-card__media-link'];
  const utilityCss = css['.event-card--split-actions .event-card__utility-row'];
  const feedbackCss = css['.event-card--split-actions .event-card__feedback .feedback-button'];
  const statusCss = css['.event-card__status'];
  const group = scenario.container_projection.groups.find((entry) => entry.id === groupId);
  if (!group) throw new Error(`scenario group absent:${groupId}`);
  const viewport = caseDoc.payload.scenario.viewport;
  const resultsCss = css['.free-collection__results'] || pageCase.payload.geometry.source_bound_css.find((x) => x.selector === '.free-collection__results')?.declarations;
  if (!resultsCss) throw new Error('results geometry absent');
  const pad = Math.max(24, Math.min(viewport.width * 0.04, 48));
  const cols = viewport.width <= 560 ? 1 : group.desktop_columns;
  const gridGap = contract.horizontal_gap_px;
  const width = (viewport.width - (2 * pad) - ((cols - 1) * gridGap)) / cols;
  const sourceRatio = crop.source_width / crop.source_height;
  const rowRatio = group.row_ratio === '6x7' ? 6 / 7 : 1;
  const mediaHeight = crop.recommended_fit === 'contain' ? width / sourceRatio : width / rowRatio;
  const actionSize = parsePx(feedbackCss['min-height']);
  const utilityBottom = Number(utilityCss.padding.split(' ').at(-1).replace('rem', '')) * 16;
  const contentHeight = contract.admission.min_height_px + actionSize + utilityBottom + (contract.vertical_gap_px * 4);
  const height = mediaHeight + contentHeight;
  const occurrence = [fixture.display_date, fixture.display_time].filter(Boolean).join('\n');
  const place = [fixture.venue_name, fixture.city].filter(Boolean).join(' · ');
  return {
    case_id: caseDoc.case_id,
    fixture_id: fixtureId,
    group_id: groupId,
    structural_context: caseDoc.payload.structural_context,
    viewport,
    geometry: {
      x: 0, y: 0, width, height, media_height: mediaHeight, content_height: contentHeight,
      grid_columns: cols, grid_gap: gridGap, results_padding: pad,
      radii: mediaCss['border-radius'].split(' ').map(parsePx),
      clipping: mediaCss.overflow === 'hidden',
      utility_gap: Number(utilityCss.gap.replace('rem', '')) * 16,
      utility_padding_bottom: utilityBottom,
      action_box: actionSize,
      action_radius: parsePx(feedbackCss['border-radius']),
      status_min_height: parsePx(statusCss['min-height']),
      status_radius: parsePx(statusCss['border-radius']),
      layout: 'flex', align_items: utilityCss['align-items'], justify_content: utilityCss['justify-content'],
    },
    typography: {
      family: contract.admission.font_family,
      title_size: Math.max(contract.event_type.font_size_px, contract.admission.font_size_px),
      title_weight: contract.event_type.font_weight,
      meta_size: contract.event_type.font_size_px,
      meta_weight: contract.event_type.font_weight,
      status_size: contract.admission.font_size_px,
      status_weight: contract.penpot_font_weight_fallbacks.admission.penpot,
      status_line_height: contract.admission.line_height_multiplier,
    },
    colors: {
      shell: utilityCss.background,
      title: '#fff7ef',
      meta: contract.event_type.color,
      status_fill: contract.admission.fill,
      status_stroke: contract.admission.stroke,
      status_text: contract.admission.color,
    },
    content: {
      title: fixture.title,
      occurrence,
      place,
      event_type: fixture.event_type,
      admission: fixture.status_label,
      share_count: fixture.shares_count || 0,
      like_count: fixture.likes_count || 0,
    },
    actions: ['share', 'like', 'not_interested', ...(caseDoc.payload.structural_context.includes('calendar-absent') ? [] : ['calendar'])],
    crop,
    media: primaryMedia(pageCase, fixtureId),
    derivation: {
      viewport: caseDoc.authority.input_bindings.scenario,
      fixture: caseDoc.authority.input_bindings.corpus,
      geometry: GEOMETRY_PATH,
      component_contract: caseDoc.authority.input_bindings.component_contract,
      width_formula: '(viewport.width - 2*resolved-results-padding - (columns-1)*canonical-meta-gap)/columns',
      height_formula: 'canonical-media-policy + contract-derived-content-height',
    },
  };
}

export function buildPayload() {
  const bundle = parse(BUNDLE_PATH);
  for (const binding of bundle.source_bindings) {
    const actual = sha256(read(binding.path));
    if (actual !== binding.sha256) throw new Error(`bundle source hash mismatch:${binding.role}`);
  }
  const resolvedIndex = parse(INDEX_PATH);
  for (const rel of CASE_PATHS) {
    const entry = resolvedIndex.cases.find((item) => item.resolved_case_path === rel);
    if (!entry) throw new Error(`resolved case missing from index:${rel}`);
    const doc = parse(rel);
    if (sha256(read(rel)) !== entry.file_sha256 || doc.content_sha256 !== entry.content_sha256) {
      throw new Error(`resolved case hash mismatch:${rel}`);
    }
  }
  const docs = Object.fromEntries(CASE_PATHS.map((rel) => [parse(rel).case_id, parse(rel)]));
  const desktopPage = docs['free-collection.desktop.full'];
  const mobilePage = docs['free-collection.mobile.full'];
  const desktopScenario = parse('catalog/fixtures/design-system-reference/v2/scenarios/archetype.collections.free.september.desktop-ready.v3.json');
  const mobileScenario = parse('catalog/fixtures/design-system-reference/v2/scenarios/archetype.collections.free.september.mobile-ready.v3.json');
  const caseDocs = [
    docs['eventcard.desktop-wide-calendar.8006'], docs['eventcard.desktop-packed-calendar-absent.2182'],
    docs['eventcard.mobile-wide-calendar.8006'], docs['eventcard.mobile-packed-calendar-absent.2182'],
  ];
  const directCases = [
    deriveCase(caseDocs[0], 'event.real.8006', desktopPage, desktopScenario, 'events'),
    deriveCase(caseDocs[1], 'event.real.2182', desktopPage, desktopScenario, 'exhibitions'),
    deriveCase(caseDocs[2], 'event.real.8006', mobilePage, mobileScenario, 'events'),
    deriveCase(caseDocs[3], 'event.real.2182', mobilePage, mobileScenario, 'exhibitions'),
  ];
  const adapters = {};
  for (const [viewport, pageCase, scenario, baseDoc] of [
    ['desktop', desktopPage, desktopScenario, caseDocs[0]],
    ['mobile', mobilePage, mobileScenario, caseDocs[2]],
  ]) {
    for (const group of scenario.container_projection.groups) {
      for (const fixtureId of group.fixture_ids) {
        const semanticCase = `adapter.${viewport}.${group.id}.${fixtureId}`;
        const derived = deriveCase({ ...baseDoc, case_id: semanticCase, payload: { ...baseDoc.payload, structural_context: `${viewport}-${group.id}` } }, fixtureId, pageCase, scenario, group.id);
        adapters[semanticCase] = derived;
      }
    }
  }
  const assets = Object.fromEntries(ASSET_PATHS.map((rel) => {
    const raw = read(rel);
    return [path.basename(rel), { path: rel, sha256: sha256(raw), svg: raw.toString('utf8') }];
  }));
  const inputs = [...CASE_PATHS, CONTRACT_PATH, EVIDENCE_PATH, GEOMETRY_PATH, INDEX_PATH, BUNDLE_PATH, ...ASSET_PATHS]
    .map((rel) => ({ path: rel, sha256: sha256(read(rel)) }));
  return {
    schema: 'kenigevents.penpot-visual-executor-capsule.v1',
    generation: 10,
    semantic_identity: 'kenigevents.free-collection.ordinary-penpot-visual-executor',
    revision: 'g10-v1',
    control: { comment_id: 5469332804, body_sha256: CONTROL_BODY_SHA256, review_comment_id: 5470920178, review_body_sha256: REVIEW_BODY_SHA256 },
    accepted_bundle: { id: 'eventcard-free-slice.g4.ready-v1', source_state: 'READY_FOR_W0_PROMOTION', authorization: 'ACCEPTED_FOR_PHASE_B_PRODUCTION', bundle_sha256: sha256(read(BUNDLE_PATH)) },
    supersedes: { g9_commit: G9_SHA, g9_tree: G9_TREE, marker_comment_id: 5470873881 },
    inputs,
    direct_cases: directCases,
    adapters,
    groups: {
      'row.desktop.events': desktopScenario.container_projection.groups[0],
      'row.desktop.exhibitions': desktopScenario.container_projection.groups[1],
      'group.mobile.events': mobileScenario.container_projection.groups[0],
      'group.mobile.exhibitions': mobileScenario.container_projection.groups[1],
    },
    assets,
    evidence_nodes: parse(EVIDENCE_PATH).material_nodes.filter((node) => ['L0_ASSETS', 'L1_LEAVES', 'L2_EVENTCARD', 'L3_ROWS_AND_GROUPS'].includes(node.level)),
  };
}

function runtimeSource(payload) {
  const embedded = JSON.stringify(payload);
  return `/* GENERATED. Execute as the body of an ordinary Penpot code window. */\nreturn (async () => {\n'use strict';\nconst CAPSULE=${embedded};\nconst CONTROL_KEY='kenigevents.asp.execution-control.g10';\nconst LEASE_KEY='kenigevents.asp.executor-lease.g10';\nconst RECEIPT_KEY='kenigevents.asp.executor-receipt.g10';\nconst REQUIRED_PENPOT=['createBoard','createRectangle','createText','createShapeFromSvg','uploadMediaData','openPage'];\nconst REQUIRED_UTILS=['findShape','setParentXY'];\nfunction fail(code,details){const error=new Error(code);error.code=code;error.details=details||null;throw error;}\nif(typeof penpot!=='object'||!penpot)fail('PENPOT_GLOBAL_MISSING');\nif(typeof penpotUtils!=='object'||!penpotUtils)fail('PENPOT_UTILS_GLOBAL_MISSING');\nfor(const key of REQUIRED_PENPOT)if(typeof penpot[key]!=='function')fail('PENPOT_PRIMITIVE_MISSING',{key});\nfor(const key of REQUIRED_UTILS)if(typeof penpotUtils[key]!=='function')fail('PENPOT_UTIL_PRIMITIVE_MISSING',{key});\nif(!penpot.localStorage||typeof penpot.localStorage.getItem!=='function'||typeof penpot.localStorage.setItem!=='function')fail('PENPOT_LOCAL_STORAGE_MISSING');\nif(!penpot.history||typeof penpot.history.undoBlockBegin!=='function'||typeof penpot.history.undoBlockFinish!=='function')fail('PENPOT_HISTORY_MISSING');\nif(!penpot.library?.local||typeof penpot.library.local.createComponent!=='function')fail('PENPOT_COMPONENT_API_MISSING');\nconst receipt={schema:'kenigevents.penpot-visual-executor-receipt.v1',generation:10,run_id:null,lease_identity:null,capsule:{semantic_identity:CAPSULE.semantic_identity,revision:CAPSULE.revision},control:CAPSULE.control,accepted_bundle:CAPSULE.accepted_bundle,input_hashes:CAPSULE.inputs,adapter:{identity:'ordinary-penpot-globals',version:String(penpot.version||'unknown'),primitives:{penpot:REQUIRED_PENPOT,penpotUtils:REQUIRED_UTILS}},pre_write_checks:[],operations:[],created:[],reused:[],replaced:[],evidence_roots:[],case_roots:[],group_roots:[],component_lineage:[],completed_mutations:[],rolled_back_mutations:[],unreverted_mutations:[],terminal_state:'PREFLIGHT'};\nfunction readJson(key){const raw=penpot.localStorage.getItem(key);if(!raw)fail('RUNTIME_BINDING_MISSING',{key});try{return JSON.parse(raw)}catch{fail('RUNTIME_BINDING_INVALID_JSON',{key})}}\nfunction validateControl(control){\n if(control.schema!=='KENIGEVENTS_ASP_EXECUTION_CONTROL_V2'||control.generation!==10||control.state!=='ACTIVE')fail('CONTROL_NOT_ACTIVE_G10');\n if(control.body_sha256!==CAPSULE.control.body_sha256)fail('CONTROL_HASH_MISMATCH');\n if(control.cancellation?.cancelled!==false)fail('RUN_CANCELLED');\n if(control.lease?.owner!=='W2'||control.lease?.scope!=='ordinary-penpot-visual-phase-b-executor-g10')fail('LEASE_SCOPE_MISMATCH');\n if(control.branch!=='w2-penpot-visual-executor-g10')fail('LEASE_BRANCH_MISMATCH');\n const accepted=control.accepted_bundles?.[CAPSULE.accepted_bundle.id];\n if(!accepted||accepted.authorization!=='ACCEPTED_FOR_PHASE_B_PRODUCTION'||accepted.source_state!==CAPSULE.accepted_bundle.source_state||accepted.bundle_sha256!==CAPSULE.accepted_bundle.bundle_sha256)fail('ACCEPTED_BUNDLE_AUTHORIZATION_MISSING');\n return control;\n}\nfunction freshCheck(operation){const control=validateControl(readJson(CONTROL_KEY));const lease=readJson(LEASE_KEY);if(lease.run_id!==receipt.run_id||lease.owner!=='W2'||lease.active!==true)fail('ACTIVE_RUN_LEASE_LOST',{operation});receipt.pre_write_checks.push({operation,generation:control.generation,cancelled:control.cancellation.cancelled,lease_run_id:lease.run_id,sequence:receipt.pre_write_checks.length});return control;}\nasync function mutate(operation,fn){freshCheck(operation);const value=await fn();receipt.operations.push({sequence:receipt.operations.length,operation,status:'COMPLETED'});receipt.completed_mutations.push(operation);return value;}\nasync function setProp(shape,key,value,label){return mutate(label,()=>{shape[key]=value;return shape;});}\nasync function pluginData(shape,key,value,label){return mutate(label,()=>{shape.setPluginData(key,String(value));return shape;});}\nasync function append(parent,child,label){return mutate(label,()=>{parent.appendChild(child);return child;});}\nfunction semantic(shape){try{return shape.getPluginData('kenigevents-semantic-key')}catch{return ''}}\nfunction managedFind(key){return penpotUtils.findShape((shape)=>semantic(shape)===key)||null;}\nasync function mark(shape,key,kind){await pluginData(shape,'kenigevents-semantic-key',key,\`metadata.semantic.\${key}\`);await pluginData(shape,'kenigevents-bundle-revision',CAPSULE.revision,\`metadata.revision.\${key}\`);await pluginData(shape,'kenigevents-kind',kind,\`metadata.kind.\${key}\`);}\nasync function board(key,name,x,y,w,h,options={}){const existing=managedFind(key);if(existing){if(existing.getPluginData('kenigevents-bundle-revision')!==CAPSULE.revision)fail('SEMANTIC_ROOT_REVISION_CONFLICT',{key,id:existing.id});receipt.reused.push({semantic_key:key,id:existing.id});return {shape:existing,created:false};}const shape=await mutate(\`create.board.\${key}\`,()=>penpot.createBoard());if(typeof shape.addFlexLayout!=='function')fail('BOARD_FLEX_PRIMITIVE_MISSING',{key});await setProp(shape,'name',name,\`set.name.\${key}\`);await mutate(\`resize.\${key}\`,()=>shape.resize(w,h));await setProp(shape,'x',x,\`set.x.\${key}\`);await setProp(shape,'y',y,\`set.y.\${key}\`);await setProp(shape,'clipContent',Boolean(options.clip),\`set.clip.\${key}\`);const flex=await mutate(\`layout.flex.create.\${key}\`,()=>shape.addFlexLayout());await setProp(flex,'dir',options.direction||'column',\`layout.dir.\${key}\`);await setProp(flex,'wrap',options.wrap||'nowrap',\`layout.wrap.\${key}\`);await setProp(flex,'rowGap',Number(options.gap||0),\`layout.row-gap.\${key}\`);await setProp(flex,'columnGap',Number(options.gap||0),\`layout.column-gap.\${key}\`);for(const edge of ['top','right','bottom','left'])await setProp(flex,\`\${edge}Padding\`,Number(options.padding||0),\`layout.padding.\${edge}.\${key}\`);await setProp(flex,'alignItems',options.alignItems||'start',\`layout.align.\${key}\`);await setProp(flex,'justifyContent',options.justifyContent||'start',\`layout.justify.\${key}\`);await setProp(shape,'fills',[{fillColor:options.fill||'#15110f',fillOpacity:1}],\`set.fill.\${key}\`);await setProp(shape,'borderRadius',Number(options.radius||0),\`set.radius.\${key}\`);await mark(shape,key,options.kind||'board');await append(options.parent||penpot.currentPage.root,shape,\`append.\${key}\`);receipt.created.push({semantic_key:key,id:shape.id,type:'board'});return {shape,created:true};}\nasync function rectangle(parent,key,name,x,y,w,h,options={}){const shape=await mutate(\`create.rectangle.\${key}\`,()=>penpot.createRectangle());await setProp(shape,'name',name,\`set.name.\${key}\`);await mutate(\`resize.\${key}\`,()=>shape.resize(w,h));await mutate(\`position.\${key}\`,()=>penpotUtils.setParentXY(shape,x,y));await setProp(shape,'fills',options.fills||[{fillColor:options.fill||'#15110f',fillOpacity:1}],\`set.fill.\${key}\`);await setProp(shape,'borderRadius',Number(options.radius||0),\`set.radius.\${key}\`);if(options.cornerRadii){for(const [prop,value] of Object.entries(options.cornerRadii))await setProp(shape,prop,value,\`set.\${prop}.\${key}\`);}await setProp(shape,'clipContent',Boolean(options.clip),\`set.clip.\${key}\`);await mark(shape,key,options.kind||'rectangle');await append(parent,shape,\`append.\${key}\`);return shape;}\nasync function text(parent,key,value,x,y,w,h,style){const shape=await mutate(\`create.text.\${key}\`,()=>penpot.createText(value));if(!shape)fail('TEXT_CREATE_FAILED',{key});await setProp(shape,'name',key,\`set.name.\${key}\`);await mutate(\`resize.\${key}\`,()=>shape.resize(w,h));await mutate(\`position.\${key}\`,()=>penpotUtils.setParentXY(shape,x,y));await setProp(shape,'fontFamily',style.family,\`set.font-family.\${key}\`);await setProp(shape,'fontSize',String(style.size),\`set.font-size.\${key}\`);await setProp(shape,'fontWeight',String(style.weight),\`set.font-weight.\${key}\`);await setProp(shape,'lineHeight',String(style.lineHeight||1.2),\`set.line-height.\${key}\`);await setProp(shape,'fills',[{fillColor:style.color,fillOpacity:1}],\`set.text-fill.\${key}\`);await mark(shape,key,'text');await append(parent,shape,\`append.\${key}\`);return shape;}\nasync function vector(parent,key,asset,x,y,w,h){const shape=await mutate(\`create.svg.\${key}\`,()=>penpot.createShapeFromSvg(asset.svg));if(!shape)fail('SVG_CREATE_FAILED',{key});await setProp(shape,'name',key,\`set.name.\${key}\`);await mutate(\`resize.\${key}\`,()=>shape.resize(w,h));await mutate(\`position.\${key}\`,()=>penpotUtils.setParentXY(shape,x,y));await pluginData(shape,'asset-sha256',asset.sha256,\`metadata.asset.\${key}\`);await mark(shape,key,'vector');await append(parent,shape,\`append.\${key}\`);return shape;}\nfunction decode(base64){const raw=atob(base64),out=new Uint8Array(raw.length);for(let i=0;i<raw.length;i+=1)out[i]=raw.charCodeAt(i);return out;}\nconst mediaCache=new Map();async function mediaFill(spec){if(mediaCache.has(spec.sha256))return mediaCache.get(spec.sha256);const image=await mutate(\`upload.media.\${spec.sha256}\`,()=>penpot.uploadMediaData(spec.sha256,decode(spec.bytes_base64),spec.mime_type));if(!image||typeof image.data!=='function')fail('NATIVE_IMAGE_PROXY_INVALID',{sha256:spec.sha256});mediaCache.set(spec.sha256,image);return image;}\nasync function componentFor(boardShape,key){const current=penpot.library.local.components.find((component)=>{try{return semantic(component.mainInstance?.())===key}catch{return false}});if(current){receipt.reused.push({semantic_key:key,component_id:current.id});return current;}const component=await mutate(\`component.create.\${key}\`,()=>penpot.library.local.createComponent([boardShape]));if(!component)fail('COMPONENT_CREATE_FAILED',{key});await mutate(\`component.name.\${key}\`,()=>{component.name=key;});receipt.created.push({semantic_key:key,component_id:component.id,type:'component'});return component;}\nasync function instance(parent,component,key,x,y,w,h){const existing=managedFind(key);if(existing){receipt.reused.push({semantic_key:key,id:existing.id});return existing;}const shape=await mutate(\`component.instance.\${key}\`,()=>component.instance());await setProp(shape,'name',key,\`set.name.\${key}\`);await mutate(\`resize.\${key}\`,()=>shape.resize(w,h));await mutate(\`position.\${key}\`,()=>penpotUtils.setParentXY(shape,x,y));await mark(shape,key,'linked-instance');await append(parent,shape,\`append.\${key}\`);receipt.component_lineage.push({instance_id:shape.id,component_id:component.id,semantic_key:key,linked:true});return shape;}\nconst iconName={share:'action-share.svg',like:'action-favorite-outline.svg',not_interested:'action-not-interested.svg',calendar:'action-calendar-add.svg'};
async function buildEvidenceRoots(){
 const spec=CAPSULE.direct_cases[0],box=spec.geometry.action_box,assetEntries=Object.entries(CAPSULE.assets);
 const l0=(await board('evidence.L0_ASSETS','L0 · exact assets',0,-1000,spec.geometry.width,box*assetEntries.length,{clip:false,fill:'#fffdf8',direction:'row',gap:spec.geometry.utility_gap,kind:'evidence-level'})).shape;
 for(let i=0;i<assetEntries.length;i+=1){const [name,asset]=assetEntries[i];await vector(l0,\`evidence.L0_ASSETS.\${name}\`,asset,i*(box+spec.geometry.utility_gap),0,box,box);}
 const l1=(await board('evidence.L1_LEAVES','L1 · semantic leaves',0,-500,spec.geometry.width,spec.geometry.media_height+box*2,{clip:false,fill:'#fffdf8',direction:'row',gap:spec.geometry.utility_gap,kind:'evidence-level'})).shape;
 const image=await mediaFill(spec.media);
 const media=(await board('component.event.media-frame','event.media-frame',12000,0,spec.geometry.width,spec.geometry.media_height,{clip:true,fill:spec.colors.shell,radius:spec.geometry.radii[0],direction:'column',gap:0,kind:'leaf-master'})).shape;
 if(!managedFind('component.event.media-frame.image'))await rectangle(media,'component.event.media-frame.image','exact image fill',0,0,spec.geometry.width,spec.geometry.media_height,{fills:[{fillOpacity:1,fillImage:image,fillImageKeepAspectRatio:true,fillImageScale:spec.crop.recommended_fit,fillImagePositionX:spec.crop.focal_point.x,fillImagePositionY:spec.crop.focal_point.y}],radius:spec.geometry.radii[0],clip:true,kind:'media-image'});
 const mediaComponent=await componentFor(media,'component.event.media-frame');
 await instance(l1,mediaComponent,'leaf.media-frame',0,0,spec.geometry.width,spec.geometry.media_height);
 const admission=(await board('component.event.meta.admission','event.meta.admission',13000,0,spec.geometry.width,spec.geometry.status_min_height,{clip:false,fill:spec.colors.status_fill,radius:spec.geometry.status_radius,direction:'row',gap:0,kind:'leaf-master'})).shape;
 if(!managedFind('component.event.meta.admission.text'))await text(admission,'component.event.meta.admission.text',spec.content.admission,0,0,spec.geometry.width,spec.geometry.status_min_height,{family:spec.typography.family,size:spec.typography.status_size,weight:spec.typography.status_weight,lineHeight:spec.typography.status_line_height,color:spec.colors.status_text});
 const admissionComponent=await componentFor(admission,'component.event.meta.admission');
 await instance(l1,admissionComponent,'leaf.admission-pill',0,spec.geometry.media_height,spec.geometry.width,spec.geometry.status_min_height);
 for(let i=0;i<['share','like','not_interested','calendar'].length;i+=1){const action=['share','like','not_interested','calendar'][i],key=\`component.event.action.\${action}\`;const leaf=await board(key,\`event.action.\${action}\`,14000+i*80,0,box,box,{fill:'transparent',radius:spec.geometry.action_radius,kind:'leaf-master'});if(leaf.created)await vector(leaf.shape,\`\${key}.vector\`,CAPSULE.assets[iconName[action]],(box-24)/2,(box-24)/2,24,24);const component=await componentFor(leaf.shape,key);await instance(l1,component,\`leaf.\${action==='not_interested'?'not-interested':action}\`,i*(box+spec.geometry.utility_gap),spec.geometry.media_height+spec.geometry.status_min_height,box,box);}
 const social=(await board('component.event.social-proof','event.social-proof',15000,0,box*2+spec.geometry.utility_gap,box,{clip:false,fill:spec.colors.shell,direction:'row',gap:spec.geometry.utility_gap,kind:'leaf-master'})).shape;
 if(!managedFind('component.event.social-proof.text'))await text(social,'component.event.social-proof.text',\`\${spec.content.share_count}\n\${spec.content.like_count}\`,0,0,box*2+spec.geometry.utility_gap,box,{family:spec.typography.family,size:spec.typography.meta_size,weight:spec.typography.meta_weight,color:spec.colors.meta});
 const socialComponent=await componentFor(social,'component.event.social-proof');
 await instance(l1,socialComponent,'leaf.social-proof',4*(box+spec.geometry.utility_gap),spec.geometry.media_height+spec.geometry.status_min_height,box*2+spec.geometry.utility_gap,box);
 receipt.evidence_roots.push({level:'L0_ASSETS',root_id:l0.id,asset_hashes:assetEntries.map(([name,asset])=>({name,sha256:asset.sha256}))},{level:'L1_LEAVES',root_id:l1.id,leaf_ids:['leaf.media-frame','leaf.admission-pill','leaf.calendar','leaf.not-interested','leaf.share','leaf.like','leaf.social-proof']});
}
\nasync function buildCard(spec,originX,originY,masterKey){
 const key=masterKey;
 const got=await board(key,key,originX,originY,spec.geometry.width,spec.geometry.height,{clip:true,fill:spec.colors.shell,radius:spec.geometry.radii[0],direction:'column',gap:spec.geometry.grid_gap,kind:'eventcard-master'});
 if(!got.created)return {board:got.shape,component:await componentFor(got.shape,key)};
 const root=got.shape,mediaKey=\`\${key}.media\`,image=await mediaFill(spec.media);
 await rectangle(root,mediaKey,'media-frame',0,0,spec.geometry.width,spec.geometry.media_height,{fills:[{fillOpacity:1,fillImage:image,fillImageKeepAspectRatio:true,fillImageScale:spec.crop.recommended_fit,fillImagePositionX:spec.crop.focal_point.x,fillImagePositionY:spec.crop.focal_point.y}],radius:spec.geometry.radii[0],cornerRadii:{borderRadiusTopLeft:spec.geometry.radii[0],borderRadiusTopRight:spec.geometry.radii[1],borderRadiusBottomRight:spec.geometry.radii[2],borderRadiusBottomLeft:spec.geometry.radii[3]},clip:true,kind:'media-frame'});
 const inset=spec.geometry.grid_gap;
 let y=spec.geometry.media_height+inset;
 await text(root,\`\${key}.title\`,spec.content.title,inset,y,spec.geometry.width-2*inset,spec.typography.title_size*4,{family:spec.typography.family,size:spec.typography.title_size,weight:spec.typography.title_weight,color:spec.colors.title});
 y+=spec.typography.title_size*4+inset;
 await text(root,\`\${key}.occurrence\`,spec.content.occurrence,inset,y,spec.geometry.width-2*inset,spec.typography.meta_size*2.6,{family:spec.typography.family,size:spec.typography.meta_size,weight:spec.typography.meta_weight,color:spec.colors.meta});
 y+=spec.typography.meta_size*2.6+inset;
 await text(root,\`\${key}.place\`,spec.content.place,inset,y,spec.geometry.width-2*inset,spec.typography.meta_size*2.4,{family:spec.typography.family,size:spec.typography.meta_size,weight:spec.typography.meta_weight,color:spec.colors.meta});
 const actionY=spec.geometry.height-spec.geometry.action_box-spec.geometry.utility_padding_bottom;
 const utility=(await board(\`\${key}.utility-row\`,'utility-row',0,actionY,spec.geometry.width,spec.geometry.action_box+spec.geometry.utility_padding_bottom,{parent:root,clip:false,fill:spec.colors.shell,direction:'row',gap:spec.geometry.utility_gap,padding:0,alignItems:'center',justifyContent:'start',kind:'utility-row'})).shape;
 for(let i=0;i<spec.actions.length;i+=1){
  const action=spec.actions[i],x=i*(spec.geometry.action_box+spec.geometry.utility_gap),actionKey=\`\${key}.action.\${action}\`;
  const leaf=await board(\`component.event.action.\${action}\`,\`event.action.\${action}\`,10000+i*80,0,spec.geometry.action_box,spec.geometry.action_box,{fill:'transparent',radius:spec.geometry.action_radius,kind:'leaf-master'});
  if(leaf.created)await vector(leaf.shape,\`component.event.action.\${action}.vector\`,CAPSULE.assets[iconName[action]],(spec.geometry.action_box-24)/2,(spec.geometry.action_box-24)/2,24,24);
  const component=await componentFor(leaf.shape,\`component.event.action.\${action}\`);
  await instance(utility,component,actionKey,x,0,spec.geometry.action_box,spec.geometry.action_box);
  if(action==='share'&&spec.content.share_count)await text(utility,\`\${actionKey}.count\`,String(spec.content.share_count),x+26,13,18,18,{family:spec.typography.family,size:spec.typography.meta_size,weight:spec.typography.meta_weight,color:spec.colors.meta});
  if(action==='like'&&spec.content.like_count)await text(utility,\`\${actionKey}.count\`,String(spec.content.like_count),x+26,13,18,18,{family:spec.typography.family,size:spec.typography.meta_size,weight:spec.typography.meta_weight,color:spec.colors.meta});
 }
 const component=await componentFor(root,key);
 receipt.case_roots.push({case_id:spec.case_id,fixture_id:spec.fixture_id,root_id:root.id,component_id:component.id,geometry:spec.geometry,actions:spec.actions,media:{sha256:spec.media.sha256,fit:spec.crop.recommended_fit,focal_point:spec.crop.focal_point}});
 return {board:root,component};
}\nasync function buildGroup(groupId,group,viewport,masters,x,y){const pageWidth=viewport==='desktop'?CAPSULE.direct_cases[0].viewport.width:CAPSULE.direct_cases[2].viewport.width;const padding=viewport==='desktop'?48:24;const cols=viewport==='desktop'?group.desktop_columns:1;const gap=CAPSULE.direct_cases[0].geometry.grid_gap;const width=pageWidth-2*padding;const ordered=group.fixture_ids;const specs=ordered.map((fixtureId)=>CAPSULE.adapters[\`adapter.\${viewport}.\${group.id}.\${fixtureId}\`]);const height=specs.reduce((sum,spec,index)=>sum+(index%cols===0?spec.geometry.height:0),0)+Math.max(0,Math.ceil(specs.length/cols)-1)*gap;const got=await board(groupId,groupId,x,y,width,height,{clip:false,fill:'#fffdf8',layout:'flex',direction:viewport==='desktop'?'row':'column',gap,padding:0,kind:'group'});if(!got.created)return got.shape;for(let i=0;i<specs.length;i+=1){const spec=specs[i];const master=masters.get(spec.case_id);const col=i%cols,row=Math.floor(i/cols);const px=col*(spec.geometry.width+gap),py=row*(spec.geometry.height+gap);await instance(got.shape,master.component,\`\${groupId}.instance.\${spec.fixture_id}\`,px,py,spec.geometry.width,spec.geometry.height);}receipt.group_roots.push({group_id:groupId,root_id:got.shape.id,fixture_order:ordered,columns:cols,gap});return got.shape;}\nfunction acquire(){const previous=penpot.localStorage.getItem(LEASE_KEY);if(previous){let parsed;try{parsed=JSON.parse(previous)}catch{fail('LEASE_INVALID_JSON')}if(parsed.active)fail('ACTIVE_RUN_EXISTS',{run_id:parsed.run_id});}const control=validateControl(readJson(CONTROL_KEY));receipt.run_id=control.run_id;receipt.lease_identity=control.lease.binding_id;penpot.localStorage.setItem(LEASE_KEY,JSON.stringify({active:true,run_id:receipt.run_id,owner:'W2'}));freshCheck('lease-acquired');}\nfunction release(){const current=readJson(LEASE_KEY);if(current.run_id===receipt.run_id)penpot.localStorage.setItem(LEASE_KEY,JSON.stringify({...current,active:false}));}\nasync function rollback(){for(const item of [...receipt.created].reverse()){if(!item.id)continue;try{freshCheck(\`rollback.\${item.semantic_key}\`);const shape=penpotUtils.findShape((candidate)=>candidate.id===item.id);if(shape&&typeof shape.remove==='function'){shape.remove();receipt.rolled_back_mutations.push({semantic_key:item.semantic_key,id:item.id});}else receipt.unreverted_mutations.push({semantic_key:item.semantic_key,id:item.id,reason:'shape_or_remove_unavailable'});}catch(error){receipt.unreverted_mutations.push({semantic_key:item.semantic_key,id:item.id,reason:String(error?.message||error)});}}}\nlet acquired=false;try{acquire();acquired=true;const runtime=readJson(CONTROL_KEY);if(!runtime.target||runtime.target.file_id!==penpot.currentFile?.id||runtime.target.page_id!==penpot.currentPage?.id)fail('RUN_TARGET_MISMATCH',{expected:runtime.target,actual:{file_id:penpot.currentFile?.id,page_id:penpot.currentPage?.id}});const block=penpot.history.undoBlockBegin();try{await buildEvidenceRoots();const masters=new Map();let x=0;for(const spec of CAPSULE.direct_cases){const built=await buildCard(spec,x,0,\`case.\${spec.case_id}\`);masters.set(spec.case_id,built);x+=spec.geometry.width+spec.geometry.grid_gap;}for(const [id,spec] of Object.entries(CAPSULE.adapters)){if(!masters.has(id))masters.set(id,await buildCard(spec,x,2000,\`case.\${id}\`));}let gy=5000;for(const [groupId,group] of Object.entries(CAPSULE.groups)){const viewport=groupId.includes('.desktop.')?'desktop':'mobile';await buildGroup(groupId,group,viewport,masters,0,gy);gy+=2000;}}finally{penpot.history.undoBlockFinish(block);}const duplicates=[];for(const item of [...receipt.case_roots,...receipt.group_roots]){const key=item.case_id?\`case.\${item.case_id}\`:item.group_id;let count=0;penpotUtils.findShape((shape)=>{if(semantic(shape)===key)count+=1;return false;});if(count>1)duplicates.push({key,count});}if(duplicates.length)fail('DUPLICATE_SEMANTIC_ROOTS',{duplicates});receipt.terminal_state='COMPLETED';return receipt;}catch(error){receipt.failure={code:error.code||'EXECUTION_FAILED',message:String(error.message||error),details:error.details||null};await rollback();receipt.terminal_state=receipt.unreverted_mutations.length?'FAILED_PARTIAL_STATE':'FAILED_ROLLED_BACK';return receipt;}finally{if(acquired)release();penpot.localStorage.setItem(RECEIPT_KEY,JSON.stringify(receipt));}\n})();\n`;
}

export function generate() {
  const payload = buildPayload();
  const source = runtimeSource(payload);
  fs.mkdirSync(path.dirname(SCRIPT_PATH), { recursive: true });
  fs.writeFileSync(SCRIPT_PATH, source);
  const manifest = {
    schema: 'kenigevents.penpot-visual-executor-manifest.v1', generation: 10,
    artifact: { path: path.relative(ROOT, SCRIPT_PATH), raw_sha256: sha256(source), content_sha256: sha256(source.replace(/\r\n/g, '\n')), bytes: Buffer.byteLength(source) },
    supported: {
      levels: ['L0_ASSETS', 'L1_LEAVES', 'L2_EVENTCARD', 'L3_ROWS_AND_GROUPS'],
      case_ids: payload.direct_cases.map((x) => x.case_id), group_ids: Object.keys(payload.groups),
      fixture_ids: ['event.real.8006', 'event.real.8200', 'event.real.2182', 'event.real.6711', 'event.real.7609'],
    },
    primitive_surface: { penpot: ['createBoard', 'createRectangle', 'createText', 'createShapeFromSvg', 'uploadMediaData', 'openPage', 'library.local.createComponent', 'LibraryComponent.instance'], penpotUtils: ['findShape', 'setParentXY'] },
    forbidden_runtime_surface: ['require', 'node:fs', 'node:path', 'node:crypto', 'process', 'fetch', 'XMLHttpRequest', 'WebSocket', 'github.com', 'api.github.com', 'import(', 'import '],
    inputs: payload.inputs,
    embedded_media: Object.values(payload.adapters).filter((x, i, a) => a.findIndex((y) => y.media.sha256 === x.media.sha256) === i).map((x) => ({ fixture_id: x.fixture_id, sha256: x.media.sha256, bytes: x.media.byte_length, embedded_path: x.media.embedded_path })),
    control: payload.control, accepted_bundle: payload.accepted_bundle, supersedes: payload.supersedes,
  };
  manifest.manifest_content_sha256 = sha256(JSON.stringify(manifest));
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  return { scriptPath: SCRIPT_PATH, manifestPath: MANIFEST_PATH, manifest };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) generate();
