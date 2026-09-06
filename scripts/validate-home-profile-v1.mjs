import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
export const HOME_PROFILE_PATH = 'contracts/page-profiles/home.owner-review.v1.json';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const hash = s => /^[a-f0-9]{64}$/.test(s || '');
const check = (value, reason) => { if (!value) throw Error(`Home projection: ${reason}`); };
export function assertHomeProfile(p) {
  check(p?.profile_id === 'home.owner-review.v1' && p.route === '/' && p.authority_mode === 'ASTRO_AS_IS_REFERENCE', 'profile identity');
  check(p.requirements_contract?.version === '1.2.0' && p.requirements_contract.sha256 === 'd384b63e63bccffc67dff4b48149c5d901364360782f76ae8b0ee2ab33cf29fd', 'active conformance lock');
  const policy=p.route_policy;
  check(policy?.id === 'home-navigation-only' && policy.top_participants_mounted === false && policy.top_participants_scope === 'contextual-title-city-section-islands-only' && policy.global_navigation === true && policy.desktop_navigation === 'existing-shared-site-nav' && policy.mobile_navigation === 'existing-Reference4MobileMenu' && policy.top_participant_listeners_started === false && policy.other_routes_policy === 'unchanged', 'home route exception');
  check(same(policy.composition,['HomeHeroTalk','HomeQuickNav','HomeColdStartFeed','HeroTalkPageEnd']), 'four-block content order');
  check(same(policy.lower_navigation,['afisha','dates','search','personal']) && policy.active_navigation === 'afisha' && policy.brand_in_flow===false && policy.header_in_flow===false && policy.hero_start==='viewport-top', 'shared bottom navigation');
  check(p.families?.length === 7 && new Set(p.families.map(x=>x.id)).size === 7 && p.families.every(x=>Number.isInteger(x.version)&&x.version>0&&x.path&&x.states.length), 'family inventory');
  const hero=p.families.find(f=>f.id==='HomeHeroTalk'),end=p.families.find(f=>f.id==='HeroTalkPageEnd');
  check(hero.version===3&&hero.animation?.word_interval_ms===190&&hero.animation.mobile_media_enabled===true&&end.version===2&&end.variants.includes('animated-scenes')&&end.nested_families.includes('HomeHeroTalk'),'voice-review family migration');
  check(p.feed?.budget===30&&p.feed.ranking_input==='full-eligible-pool'&&p.feed.stable_visible_prefix, 'feed contract');
  check(p.search_entry?.target==='/poisk/'&&p.search_entry.variant==='floating-link'&&p.search_entry.placement==='floating-outside-content-order'&&p.search_entry.base_prefix_preserved&&p.search_entry.capture_runtime_mounted===false&&p.search_entry.inline_input_on_home===false&&p.search_entry.answers_history_catalog_search_on_home===false, 'search link without home capture');
  check(p.shared_identity?.route_local_cards_icons_geometry===false&&p.export?.penpot_round_trip===false&&p.export.native_mutation_authorized===false, 'shared owners and honest stage');
  return {valid:true, profile_id:p.profile_id, acceptance:false};
}
/** Source-bound measured structural export, never native or visual acceptance. */
export function assertHomeStructuralProjection(r,{expectedSha,expectedEventIds,repoRoot,expectedSearchBase,profilePath=resolve(root,HOME_PROFILE_PATH)}={}) {
  const profileBytes=readFileSync(profilePath), profile=JSON.parse(profileBytes);assertHomeProfile(profile);
  const p=r?.provenance;
  check(r?.schema===profile.export.schema&&r.route==='/'&&r.profile_id===profile.profile_id, 'schema/route/profile');
  check(/^[a-f0-9]{40}$/.test(expectedSha||'')&&p?.repo_sha===expectedSha&&p.manifest?.repo_sha===expectedSha&&repoRoot, 'exact source SHA');
  check(p.profile_sha256===sha(profileBytes)&&hash(p.manifest_sha256)&&hash(p.registry_sha256)&&p.snapshot?.id&&hash(p.snapshot.sha256)&&Number.isFinite(Date.parse(p.reference_clock)), 'source/data/profile provenance');
  check(profile.required_viewports.some(v=>v.width===r.viewport?.width&&v.height===r.viewport?.height)&&r.viewport?.dpr>0, 'measured viewport');
  check(typeof r.fixture_state==='string'&&r.fixture_state.length>0, 'fixture state');
  check(Array.isArray(expectedEventIds)&&expectedEventIds.length<=30&&same(r.event_ids,expectedEventIds)&&new Set(r.event_ids).size===r.event_ids.length, 'exact fixture order');
  check(r.feed?.budget===30&&r.feed.candidate_pool_count>=r.event_ids.length&&Number.isInteger(r.feed.candidate_pool_count)&&r.feed.stable_visible_prefix===true&&['general','personal','empty'].includes(r.feed.mode), 'full pool/feed metadata');
  check(r.shell?.policy==='home-navigation-only'&&r.shell.top_participant_count===0&&r.shell.global_navigation===true&&r.shell.header_in_flow===false&&r.shell.lower_island_count===1&&r.shell.home_chat_count===0,'measured shell counts');
  const suppressed=r.page_end?.state==='suppressed';
  check(suppressed?typeof r.page_end.reason==='string'&&r.page_end.reason.trim():r.page_end?.state==='shown'&&r.page_end.reason===null,'page end disposition');
  const composition=profile.route_policy.composition.filter(id=>!suppressed||id!=='HeroTalkPageEnd');
  check(same(r.composition,composition),'composition order');
  const source=file=>execFileSync('git',['show',`${expectedSha}:${file}`],{cwd:repoRoot});
  check(p.registry_path===profile.shared_identity.registry_path,'registry path');
  const registryBytes=source(p.registry_path);check(sha(registryBytes)===p.registry_sha256,'registry content hash');
  const registry=JSON.parse(registryBytes);
  const bindings=new Map((r.source_bindings||[]).map(x=>[x.id,x]));
  check(bindings.size===(r.source_bindings||[]).length&&bindings.size>0,'unique source bindings');
  for(const b of bindings.values()) {
    const f=registry.families.find(x=>x.id===b.id);
    check(f&&f.astro_root===b.path&&f.version===b.version&&sha(source(b.path))===b.sha256&&Array.isArray(b.styles)&&same(f.style_owners,b.styles.map(x=>x.path))&&b.styles.every(x=>sha(source(x.path))===x.sha256),'exact family/style content');
    if(f.penpot_binding!=null)check(same(f.penpot_binding,b.penpot_binding),'preserve existing native binding');
  }
  for(const f of profile.families) {
    const b=bindings.get(f.id);check(b&&b.version===f.version&&b.path===f.path,`required family ${f.id}`);
  }
  for(const id of profile.shared_owners)check(bindings.has(id),`required shared owner ${id}`);
  check(r.tokens&&typeof r.tokens==='object'&&!Array.isArray(r.tokens)&&Object.keys(r.tokens).length>0&&Object.entries(r.tokens).every(([k,v])=>k.startsWith('--ke-')&&typeof v==='string'),'measured shared tokens');
  const behavior=new Map((r.behavior_bindings||[]).map(x=>[x.path,x]));
  check(behavior.size===(r.behavior_bindings||[]).length,'unique behavior bindings');
  for(const file of [profile.route_policy.source,...profile.behavior_sources])check(behavior.has(file)&&sha(source(file))===behavior.get(file).sha256,`behavior binding ${file}`);
  const nodes=[],seen=new Set();
  function visit(n,parent=null) {
    check(n&&typeof n.anatomy_path==='string'&&n.stable_id===`home.${sha(JSON.stringify(n.anatomy_path)).slice(0,24)}`&&!seen.has(n.stable_id)&&n.parent_id===parent,'stable anatomy/parent');
    seen.add(n.stable_id);nodes.push(n);
    if(n.kind==='text'){check(typeof n.text==='string','text');return;}
    check(n.kind==='element'&&n.attributes&&n.computed&&['display','position','fontFamily','fontSize','lineHeight','color','backgroundColor','borderRadius','borderWidth','padding','gap','overflow'].every(k=>typeof n.computed[k]==='string')&&['x','y','width','height'].every(k=>Number.isFinite(n.bounds?.[k]))&&n.bounds.width>=0&&n.bounds.height>=0,'measured element geometry');
    if(n.containing_family)check(bindings.has(n.containing_family),'unresolved node owner');
    if(n.identity){const b=bindings.get(n.identity.family);check(b&&String(b.version)===n.identity.version&&n.containing_family===b.id,'node family identity');}
    if(n.svg)check(n.svg.markup&&sha(n.svg.markup)===n.svg.sha256,'exact SVG bytes');
    if(n.image?.natural_width>0)check(hash(n.image.asset_sha256)&&r.assets?.[n.image.current_src||n.image.src]?.sha256===n.image.asset_sha256,'image asset identity');
    for(const child of n.children||[])visit(child,n.stable_id);
  }
  visit(r.tree);
  check(r.tree.identity?.family==='EventLayout'&&r.tree.attributes['data-shell-composition']==='home-navigation-only','whole shell root and actual route policy required');
  const homes=nodes.filter(n=>n.identity?.family==='HomePage');check(homes.length===1,'one HomePage');
  const subtree=n=>[n,...(n.children||[]).flatMap(subtree)];
  const homeNodes=subtree(homes[0]);
  const compositionNodes=[];
  function collectComposition(n) {
    if(profile.route_policy.composition.includes(n.identity?.family)){compositionNodes.push(n);return;}
    for(const child of n.children||[])collectComposition(child);
  }
  collectComposition(homes[0]);
  const actual=compositionNodes.map(n=>n.identity.family);
  check(same(actual,composition),'actual DOM composition');
  const hero=compositionNodes.find(n=>n.identity?.family==='HomeHeroTalk');
  const end=compositionNodes.find(n=>n.identity?.family==='HeroTalkPageEnd');
  const endHeroes=end?subtree(end).filter(n=>n.identity?.family==='HomeHeroTalk'):[];
  if(end?.identity.variant==='animated-scenes') {
    check(endHeroes.length===1,'animated PageEnd nests exactly one shared Hero');
    const upperIds=new Set(subtree(hero).map(n=>n.attributes?.['data-editorial-id']).filter(Boolean));
    check(!subtree(endHeroes[0]).some(n=>upperIds.has(n.attributes?.['data-editorial-id'])),'PageEnd has a distinct editorial deck');
  }else check(endHeroes.length===0,'compact PageEnd has no nested Hero');
  check(homeNodes.filter(n=>n.identity?.family==='HomeHeroTalk').length===1+endHeroes.length,'no extra unowned Hero');
  check(compositionNodes.find(n=>n.identity?.family==='HomeQuickNav')?.identity.variant==='rectangular-grid','rectangular QuickNav variant');
  check(hero&&Math.abs(hero.bounds.y)<=1,'hero starts at viewport top; capture at scroll zero');
  const headers=nodes.filter(n=>(n.attributes?.class||'').split(/\s+/u).includes('site-header'));
  check(headers.length===1&&(['absolute','fixed'].includes(headers[0].computed.position)||headers[0].bounds.height===0),'header has no flow gap');
  const launchers=nodes.filter(n=>n.identity?.family==='HomeSearchEntry');
  check(launchers.length===1&&launchers[0].identity.variant==='floating-link'&&launchers[0].identity.state==='ready'&&launchers[0].tag==='a'&&Object.hasOwn(launchers[0].attributes,'data-home-search-launcher'),'one floating search link');
  const launcher=launchers[0],base=r.tree.attributes['data-site-base-path']||'/';
  const approvedBase=expectedSearchBase===undefined?base:expectedSearchBase;
  check(typeof approvedBase==='string'&&!/[?#]/u.test(approvedBase),'explicit approved Search base');
  let safeBase=approvedBase.startsWith('/')&&!approvedBase.startsWith('//');
  if(!safeBase){try{const url=new URL(approvedBase);safeBase=url.protocol==='https:'&&!url.username&&!url.password;}catch{safeBase=false;}}
  check(safeBase&&launcher.attributes.href===`${approvedBase.replace(/\/+$/u,'')}/poisk/`&&launcher.attributes['aria-label']?.trim(),'approved-base accessible Search destination');
  check(subtree(launcher).some(n=>n.svg&&(n.attributes?.class||'').split(/\s+/u).includes('assistant__mic-icon')),'shared microphone launcher icon');
  check(['absolute','fixed'].includes(launcher.computed.position),'search launcher outside content flow');
  check(!nodes.some(n=>['data-home-search-entry','data-home-search-state','data-home-record','data-home-submit'].some(k=>Object.hasOwn(n.attributes||{},k)))&&!homeNodes.some(n=>n.tag==='textarea'),'no mounted home input/capture');
  check(nodes.filter(n=>Object.hasOwn(n.attributes||{},'data-mobile-bottom-nav')).length===1,'one native shared bottom navigation');
  const desktopNav=nodes.filter(n=>(n.attributes?.class||'').split(/\s+/u).includes('site-nav'));
  const mobileMenu=nodes.filter(n=>Object.hasOwn(n.attributes||{},'data-reference4-fullscreen'));
  check(desktopNav.length===1&&mobileMenu.length===1,'preserve shared desktop and Reference4 navigation');
  const activeNavigation=r.viewport.width>=760?desktopNav[0]:mobileMenu[0];
  check(activeNavigation.computed.display!=='none'&&activeNavigation.bounds.width>0&&activeNavigation.bounds.height>0,'viewport navigation is rendered');
  check(!nodes.some(n=>['data-floating-top-band','data-floating-page-context','data-floating-section-context','data-floating-controls-slot'].some(k=>Object.hasOwn(n.attributes||{},k))),'no mounted contextual top participants');
  check(!nodes.some(n=>n.identity?.family==='ConversationalSearch'||Object.hasOwn(n.attributes||{},'data-conversational-search')),'no mounted home chat');
  const cards=homeNodes.filter(n=>Object.hasOwn(n.attributes||{},'data-event-card'));
  check(same(cards.map(n=>n.attributes['data-event-id']),expectedEventIds),'actual rendered card order');
  check(homeNodes.filter(n=>n.identity?.family==='AdaptiveEventCardGrid').length===1,'one shared card grid');
  for(const card of cards) {
    check(card.identity?.family==='EventCard','shared card family');
    const parts=subtree(card),frames=parts.filter(n=>Object.hasOwn(n.attributes||{},'data-media-frame'));
    check(frames.length>0&&frames.every(n=>n.attributes['data-media-frame-contract']==='v1'&&['loaded','fallback','broken'].includes(n.attributes['data-media-frame-resource-state'])),'shared MediaFrame');
    for(const frame of frames) {
      const loaded=subtree(frame).some(n=>n.image?.natural_width>0&&n.image?.natural_height>0);
      check(frame.attributes['data-media-frame-resource-state']==='loaded'?loaded:Object.hasOwn(frame.attributes,'data-media-frame-fallback'),'settled media resource anatomy');
    }
    for(const action of ['like','not_interested'])check(parts.some(n=>n.attributes?.['data-feedback-action']===action),`shared action ${action}`);
    check(parts.some(n=>Object.hasOwn(n.attributes||{},'data-native-share')),'shared share');
    const calendars=parts.filter(n=>Object.hasOwn(n.attributes||{},'data-calendar-action'));
    check((card.attributes['data-calendar-eligible']==='true')===Boolean(calendars.length)&&calendars.every(n=>n.attributes.href),'calendar eligibility');
  }
  return {valid:true,node_count:nodes.length,card_count:cards.length,status:'STRUCTURAL_EXPORT_VALIDATED_NOT_PENPOT_ROUND_TRIP',penpot_round_trip:false,visual_acceptance:false};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const p=JSON.parse(readFileSync(resolve(root,HOME_PROFILE_PATH)));
 console.log(JSON.stringify(assertHomeProfile(p)));
}
