#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
const BINDINGS='catalog/round-trip-reconstruction/v1/bindings.v1.json';
const CONTRACT='catalog/reconstruction-atlas/v1/search-ov47-mobile-source-exact.v1.json';
const RECEIPT='evidence/recovery-20260828/penpot/search-ov47-mobile-source-exact-receipt.v1.json';
const DESKTOP_RECEIPT='evidence/recovery-20260829/penpot/search-ov47-desktop-source-exact-receipt.v1.json';
const LIFECYCLE_RECEIPT='evidence/recovery-20260829/penpot/search-ov47-mobile-lifecycle-receipt.v1.json';
const ASTRO='812ffc279728221b547707474bcb521f27c4a73d';
const REVISION=2813;
const FILE='3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE='d87e18f1-dcb4-80a6-8008-880ac732b6ae';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const write=(p,v)=>writeFileSync(p,`${JSON.stringify(v,null,2)}\n`);
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const comp=(id,name,path)=>({id,library_id:FILE,name,path});
const linked=(id,name,component,width,height,x,y)=>({shape_id:id,name,component,width,height,x,y,hidden:false,is_component_copy:true,is_component_main:false,type:'board'});

const states=[
  {
    viewport:'mobile',
    state:'loading', component_id:'8f804431-c282-8075-8008-8de4a7073cd8', main_id:'8f804431-c282-8075-8008-8de4a4d7e156', width:390,height:2626,x:7580,y:-520,
    component_name:'viewport=mobile;state=loading;progress=55 · Astro AS-IS',
    children:[
      linked('8f804431-c282-8075-8008-8de4a5382a81','linked Shell / Mobile header',comp('a21f5e36-5d76-8065-8008-86aebfc67027','Mobile header','Shell v1 / Mobile'),390,84,7592,-520),
      linked('8f804431-c282-8075-8008-8de4a58ade17','linked Search / Runtime query / loading',comp('8f804431-c282-8075-8008-8de4727d7df1','viewport=mobile;state=loading;progress=55;query=послушать хор','Search / Runtime query controller'),366,1504.734375,7592,-424),
      linked('8f804431-c282-8075-8008-8de4a608eca7','linked Search / Collection links / source exact',comp('8f804431-c282-8075-8008-8de4444c11a6','viewport=mobile;source-exact-with-notes','Search / Collection links'),366,888,7592,1096.734375),
      linked('8f804431-c282-8075-8008-8de598af7794','linked Shell / Mobile bottom navigation / current=search / sticky',comp('8e7accff-5c78-8007-8008-89c2fd86089e','Mobile bottom navigation · current=search;surface=floating-island;source=Astro-53f7b2c2c','Shell v1 / Mobile'),366,64,7580,260),
    ],
    skeleton_shape_ids:['8f804431-c282-8075-8008-8de4a58bb445','8f804431-c282-8075-8008-8de4a58c021d','8f804431-c282-8075-8008-8de4a58c6f72'],
  },
  {
    viewport:'mobile',
    state:'results', component_id:'8f804431-c282-8075-8008-8de4b7e61c67', main_id:'8f804431-c282-8075-8008-8de4b555573e', width:390,height:2521,x:8010,y:-520,
    component_name:'viewport=mobile;state=results;fixture=event.real.7003 · Astro AS-IS',
    children:[
      linked('8f804431-c282-8075-8008-8de4b5c48fe0','linked Shell / Mobile header',comp('a21f5e36-5d76-8065-8008-86aebfc67027','Mobile header','Shell v1 / Mobile'),390,84,8022,-520),
      linked('8f804431-c282-8075-8008-8de4b62827b5','linked Search / Runtime query / results',comp('8f804431-c282-8075-8008-8de48d989f93','viewport=mobile;state=results;count=1;query=послушать хор','Search / Runtime query controller'),366,1400.234375,8022,-424),
      linked('8f804431-c282-8075-8008-8de4b6f14005','linked Search / Collection links / source exact',comp('8f804431-c282-8075-8008-8de4444c11a6','viewport=mobile;source-exact-with-notes','Search / Collection links'),366,888,8022,992.234375),
      linked('8f804431-c282-8075-8008-8de5995b714b','linked Shell / Mobile bottom navigation / current=search / sticky',comp('8e7accff-5c78-8007-8008-89c2fd86089e','Mobile bottom navigation · current=search;surface=floating-island;source=Astro-53f7b2c2c','Shell v1 / Mobile'),366,64,8010,260),
    ],
    result_card:{shape_id:'8f804431-c282-8075-8008-8de4b628818f',fixture:'event.real.7003',component:comp('8f804431-c282-8075-8008-8de459b7d76c','event.real.7003 · source exact','Search / Event result adapter'),width:366,height:656.71875},
  },
  {
    viewport:'desktop',
    state:'loading', component_id:'8f804431-c282-8075-8008-8e2924f63910', main_id:'8f804431-c282-8075-8008-8e292318bc2e', width:1280,height:4044,x:13260,y:-520,
    component_name:'viewport=desktop;state=loading;progress=55 · Astro AS-IS',
    children:[
      linked('8f804431-c282-8075-8008-8e292369f878','linked Shell / Desktop header',comp('a21f5e36-5d76-8065-8008-86ae4bdf9963','Desktop header','Shell v1 / Desktop'),1280,57,13260,-520),
      linked('8f804431-c282-8075-8008-8e2923bde5d4','linked Search / Runtime query / desktop loading',comp('8f804431-c282-8075-8008-8e290c89645e','viewport=desktop;state=loading;progress=55;query=послушать хор','Search / Runtime query controller'),1180,2685.140625,13310,-408.609375),
      linked('8f804431-c282-8075-8008-8e29241aa516','linked Search / Collection links / desktop',comp('d87e18f1-dcb4-80a6-8008-885bfcec31ea','viewport=desktop','Search / Collection links'),1180,499.765625,13310,2294.125),
      linked('8f804431-c282-8075-8008-8e29248e8922','linked Shell / Desktop footer viewport',comp('d87e18f1-dcb4-80a6-8008-885914f2be1b','Footer viewport · representative','Shell v1 / Desktop'),1280,681.859375,13260,2841.890625),
    ],
    skeleton_shape_ids:['8f804431-c282-8075-8008-8e290bc3ac1a','8f804431-c282-8075-8008-8e290bf24254','8f804431-c282-8075-8008-8e290c5e8161'],
  },
  {
    viewport:'desktop',
    state:'results', component_id:'8f804431-c282-8075-8008-8e292d53a768', main_id:'8f804431-c282-8075-8008-8e292b4c6b49', width:1280,height:3682,x:14580,y:-520,
    component_name:'viewport=desktop;state=results;fixture=event.real.7003 · Astro AS-IS',
    children:[
      linked('8f804431-c282-8075-8008-8e292b8f65c6','linked Shell / Desktop header',comp('a21f5e36-5d76-8065-8008-86ae4bdf9963','Desktop header','Shell v1 / Desktop'),1280,57,14580,-520),
      linked('8f804431-c282-8075-8008-8e292be305f9','linked Search / Runtime query / desktop results',comp('8f804431-c282-8075-8008-8e291c06ca10','viewport=desktop;state=results;count=1;query=послушать хор','Search / Runtime query controller'),1180,2323.265625,14630,-408.609375),
      linked('8f804431-c282-8075-8008-8e292c787c39','linked Search / Collection links / desktop',comp('d87e18f1-dcb4-80a6-8008-885bfcec31ea','viewport=desktop','Search / Collection links'),1180,499.765625,14630,1932.25),
      linked('8f804431-c282-8075-8008-8e292cf41208','linked Shell / Desktop footer viewport',comp('d87e18f1-dcb4-80a6-8008-885914f2be1b','Footer viewport · representative','Shell v1 / Desktop'),1280,681.859375,14580,2480.015625),
    ],
    result_card:{shape_id:'8f804431-c282-8075-8008-8e291809b38d',fixture:'event.real.7003',component:comp('8f804431-c282-8075-8008-8e28fa59a788','EventCard large desktop;fixture=event.real.7003;state=fallback','Fixture adapters / Search result'),width:1134.8125,height:1623.25},
  },
];

const mobileLifecycle=[
  ['validation','8f804431-c282-8075-8008-8e305c86a319','8f804431-c282-8075-8008-8e305adcf98b',390,1612,15920,'viewport=mobile;state=validation;query=я · Astro AS-IS','8f804431-c282-8075-8008-8e3021982df5','viewport=mobile;state=validation;query=я',470.890625,584.484375,['8f804431-c282-8075-8008-8e305b37828b','8f804431-c282-8075-8008-8e305b83825f','8f804431-c282-8075-8008-8e305bd19480','8f804431-c282-8075-8008-8e305c383828']],
  ['empty','8f804431-c282-8075-8008-8e30636410cc','8f804431-c282-8075-8008-8e3061e03319',390,1991,16350,'viewport=mobile;state=empty;count=0 · Astro AS-IS','8f804431-c282-8075-8008-8e303026053a','viewport=mobile;state=empty;count=0;query=пустой запрос',849.359375,962.953125,['8f804431-c282-8075-8008-8e30622fa9ac','8f804431-c282-8075-8008-8e3062732e7e','8f804431-c282-8075-8008-8e3062be9fbe','8f804431-c282-8075-8008-8e3063179620']],
  ['error-retry','8f804431-c282-8075-8008-8e3069a985b3','8f804431-c282-8075-8008-8e3067efb33c',390,1652,16780,'viewport=mobile;state=error-retry · Astro AS-IS','8f804431-c282-8075-8008-8e303e69dea1','viewport=mobile;state=error-retry;query=ошибка провайдера',510.4375,624.03125,['8f804431-c282-8075-8008-8e30685cb247','8f804431-c282-8075-8008-8e3068abfb63','8f804431-c282-8075-8008-8e3068f77bcc','8f804431-c282-8075-8008-8e3069619411']],
  ['load-more-ready','8f804431-c282-8075-8008-8e3070fd8783','8f804431-c282-8075-8008-8e306ea7f026',390,2404,17210,'viewport=mobile;state=load-more-ready;count=1 · Astro AS-IS','8f804431-c282-8075-8008-8e3049f0a0e6','viewport=mobile;state=load-more-ready;count=1;query=пагинация событий',1262.359375,1375.953125,['8f804431-c282-8075-8008-8e306effed76','8f804431-c282-8075-8008-8e306f5af9ec','8f804431-c282-8075-8008-8e306fe96929','8f804431-c282-8075-8008-8e3070698584']],
  ['load-more-loading','8f804431-c282-8075-8008-8e30792d160e','8f804431-c282-8075-8008-8e30772dfe35',390,2432,17640,'viewport=mobile;state=load-more-loading;count=1 · Astro AS-IS','8f804431-c282-8075-8008-8e30561c0d29','viewport=mobile;state=load-more-loading;count=1;query=пагинация событий',1291.09375,1404.6875,['8f804431-c282-8075-8008-8e3077a408af','8f804431-c282-8075-8008-8e3077f629f8','8f804431-c282-8075-8008-8e3078787588','8f804431-c282-8075-8008-8e3078de4042']],
  ['recovery-after-error','8f804431-c282-8075-8008-8e307fdc4960','8f804431-c282-8075-8008-8e307ddd6546',390,2544,18070,'viewport=mobile;state=recovery-after-error;fixture=event.real.7003 · Astro AS-IS','8f804431-c282-8075-8008-8de48d989f93','viewport=mobile;state=results;count=1;query=послушать хор',1400.234375,1516.15625,['8f804431-c282-8075-8008-8e307e47ed49','8f804431-c282-8075-8008-8e307e931938','8f804431-c282-8075-8008-8e307f214806','8f804431-c282-8075-8008-8e307f914300']],
].map(([state,component_id,main_id,width,height,x,component_name,queryId,queryName,queryH,collectionY,ids])=>({viewport:'mobile',state,component_id,main_id,width,height,x,y:-520,component_name,children:[
  linked(ids[0],'linked Shell / Mobile header',comp('a21f5e36-5d76-8065-8008-86aebfc67027','Mobile header','Shell v1 / Mobile'),390,84,x+12,-520),
  linked(ids[1],`linked Search / Runtime query / ${state}`,comp(queryId,queryName,'Search / Runtime query controller'),366,queryH,x+12,-424),
  linked(ids[2],'linked Search / Collection links / source exact',comp('8f804431-c282-8075-8008-8de4444c11a6','viewport=mobile;source-exact-with-notes','Search / Collection links'),366,855.5625,x+12,collectionY-520),
  linked(ids[3],'linked Shell / Mobile bottom navigation / current=search / sticky',comp('8e7accff-5c78-8007-8008-89c2fd86089e','Mobile bottom navigation · current=search;surface=floating-island;source=Astro-53f7b2c2c','Shell v1 / Mobile'),366,64,x+12,250),
]}));
const allStates=[...states,...mobileLifecycle];

const contract=read(CONTRACT);
contract.authority.current_astro_commit=ASTRO;
contract.status='MOBILE_VISIBLE_LIFECYCLE_AND_DESKTOP_LOADING_RESULTS_MATERIALIZED_STALE_NONVISUAL';
contract.penpot.round_trip_revision=REVISION;
contract.coverage={
  mobile_integrated_states:['loading','results','validation','empty','error-retry','load-more-ready','load-more-loading','recovery-after-error'],
  desktop_integrated_states:['loading','results'],
  nonvisual_source_dispositions:{'mobile-stale':'internal epoch guard; a stale response does not repaint the visible UI'},
  open_required_states:[],
};
contract.visual_evidence.result='MOBILE_LOADING_RESULTS_VISUAL_PASS_LIFECYCLE_STRUCTURAL_VERIFIED_DESKTOP_STRUCTURAL_VERIFIED_EXPORT_DEFERRED';
contract.visual_evidence.mobile_lifecycle_browser_evidence='evidence/recovery-20260829/astro/search-mobile-lifecycle/ov47-search-mobile-lifecycle-geometry.v1.json';
contract.penpot.mobile_authenticated_query_head={revision:2808,status:'CORRECTION_VERIFIED_BY_READBACK'};
contract.penpot.mobile_lifecycle={revision:REVISION,named_version:'OV47 Search · mobile validation empty error retry load-more recovery · Astro exact',receipt:LIFECYCLE_RECEIPT,query_components:mobileLifecycle.filter(s=>s.state!=='recovery-after-error').map(s=>s.children[1].component.id),owner_components:mobileLifecycle.map(s=>s.component_id),validation:[],idempotent:true};
write(CONTRACT,contract);
const receipt=read(RECEIPT);
receipt.status=contract.status;
receipt.penpot.round_trip_revision=REVISION;
receipt.source_readback.astro_commit=ASTRO;
receipt.structural_readback.round_trip_state_owners=allStates.map(s=>({viewport:s.viewport,state:s.state,component_id:s.component_id,main_id:s.main_id,direct_children:s.children.map(c=>c.shape_id)}));
receipt.visual_qa.result='MOBILE_LOADING_RESULTS_PASS_LIFECYCLE_STRUCTURAL_VERIFIED_DESKTOP_STRUCTURAL_VERIFIED';
receipt.visual_qa.desktop_receipt=DESKTOP_RECEIPT;
receipt.visual_qa.lifecycle_receipt=LIFECYCLE_RECEIPT;
write(RECEIPT,receipt);
const desktopReceipt=read(DESKTOP_RECEIPT);
desktopReceipt.status=contract.status;
desktopReceipt.penpot.revision=REVISION;
desktopReceipt.source_readback.astro_commit=ASTRO;
write(DESKTOP_RECEIPT,desktopReceipt);

const bindings=read(BINDINGS);
const archetype=bindings.archetypes.find(a=>a.archetype_id==='archetype.search');
if(!archetype) throw new Error('bindings have no Search archetype');
archetype.source_exact_correction={contract_id:contract.contract_id,path:CONTRACT,sha256:hash(CONTRACT),status:contract.status};
archetype.source_exact_state_owners=allStates.map(s=>({
  viewport:s.viewport,state:s.state,width:s.width,height:s.height,x:s.x,y:s.y,
  penpot:{file_id:FILE,page_id:PAGE,revision:REVISION,board_id:s.main_id,board_name:`Archetype / Search / ${s.component_name}`,board_component:comp(s.component_id,s.component_name,'Archetype / Search'),direct_children:s.children},
  ...(s.skeleton_shape_ids?{skeleton_shape_ids:s.skeleton_shape_ids}:{}),
  ...(s.result_card?{result_card:s.result_card}:{}),
}));
archetype.coverage_correction=contract.coverage;
for(const region of archetype.regions){
  if(region.region_id==='search.query-field') region.source_exact_instances=allStates.map(s=>({viewport:s.viewport,state:s.state,shape_id:s.children[1].shape_id,component:s.children[1].component}));
  if(region.region_id==='search.results') region.source_exact_instances=[
    ...states.filter(s=>s.skeleton_shape_ids).flatMap(s=>s.skeleton_shape_ids.map((shape_id,index)=>({viewport:s.viewport,state:'loading',shape_id,role:index===2?'skeleton-peek':'skeleton'}))),
    ...states.filter(s=>s.result_card).map(s=>({viewport:s.viewport,state:'results',shape_id:s.result_card.shape_id,component:s.result_card.component,fixture:'event.real.7003'})),
  ];
  if(region.region_id==='search.collection-links') region.source_exact_instances=allStates.map(s=>({viewport:s.viewport,state:s.state,shape_id:s.children[2].shape_id,component:s.children[2].component}));
}
bindings.correction_overlays??=[];
const overlay={archetype_id:archetype.archetype_id,astro_commit:ASTRO,contract:archetype.source_exact_correction,penpot_page_id:PAGE,penpot_revision:REVISION,review_items:['OV-47','OV-48'],scope:'mobile-visible-lifecycle-desktop-loading-results'};
const i=bindings.correction_overlays.findIndex(o=>o.archetype_id===archetype.archetype_id);
if(i>=0)bindings.correction_overlays[i]=overlay;else bindings.correction_overlays.push(overlay);
write(BINDINGS,bindings);
console.log(`${BINDINGS}: registered ${allStates.length} Search source-exact state owners; stale is a nonvisual epoch guard`);
