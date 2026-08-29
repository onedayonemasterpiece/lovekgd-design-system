#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
const BINDINGS='catalog/round-trip-reconstruction/v1/bindings.v1.json';
const CONTRACT='catalog/reconstruction-atlas/v1/search-ov47-mobile-source-exact.v1.json';
const RECEIPT='evidence/recovery-20260828/penpot/search-ov47-mobile-source-exact-receipt.v1.json';
const ASTRO='812ffc279728221b547707474bcb521f27c4a73d';
const REVISION=2794;
const FILE='3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE='d87e18f1-dcb4-80a6-8008-880ac732b6ae';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const write=(p,v)=>writeFileSync(p,`${JSON.stringify(v,null,2)}\n`);
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const comp=(id,name,path)=>({id,library_id:FILE,name,path});
const linked=(id,name,component,width,height,x,y)=>({shape_id:id,name,component,width,height,x,y,hidden:false,is_component_copy:true,is_component_main:false,type:'board'});

const states=[
  {
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
];

const contract=read(CONTRACT);
contract.authority.current_astro_commit=ASTRO;
contract.status='MOBILE_LOADING_RESULTS_CORRECTION_VERIFIED_DESKTOP_INTEGRATED_STATES_OPEN';
contract.penpot.round_trip_revision=REVISION;
contract.coverage={
  mobile_integrated_states:['loading','results'],
  desktop_integrated_states:[],
  open_required_states:['desktop-loading','desktop-results','mobile-validation','mobile-empty','mobile-error-retry','mobile-stale','mobile-load-more'],
};
contract.visual_evidence.result='MOBILE_FULL_VISUAL_QA_PASS_DESKTOP_NOT_MATERIALIZED';
write(CONTRACT,contract);
const receipt=read(RECEIPT);
receipt.status=contract.status;
receipt.penpot.round_trip_revision=REVISION;
receipt.source_readback.astro_commit=ASTRO;
receipt.structural_readback.round_trip_state_owners=states.map(s=>({state:s.state,component_id:s.component_id,main_id:s.main_id,direct_children:s.children.map(c=>c.shape_id)}));
receipt.visual_qa.result='MOBILE_PASS_DESKTOP_OPEN';
write(RECEIPT,receipt);

const bindings=read(BINDINGS);
const archetype=bindings.archetypes.find(a=>a.archetype_id==='archetype.search');
if(!archetype) throw new Error('bindings have no Search archetype');
archetype.source_exact_correction={contract_id:contract.contract_id,path:CONTRACT,sha256:hash(CONTRACT),status:contract.status};
archetype.source_exact_state_owners=states.map(s=>({
  viewport:'mobile',state:s.state,width:s.width,height:s.height,x:s.x,y:s.y,
  penpot:{file_id:FILE,page_id:PAGE,revision:REVISION,board_id:s.main_id,board_name:`Archetype / Search / ${s.component_name}`,board_component:comp(s.component_id,s.component_name,'Archetype / Search'),direct_children:s.children},
  ...(s.skeleton_shape_ids?{skeleton_shape_ids:s.skeleton_shape_ids}:{}),
  ...(s.result_card?{result_card:s.result_card}:{}),
}));
archetype.coverage_correction=contract.coverage;
for(const region of archetype.regions){
  if(region.region_id==='search.query-field') region.source_exact_instances=states.map(s=>({state:s.state,shape_id:s.children[1].shape_id,component:s.children[1].component}));
  if(region.region_id==='search.results') region.source_exact_instances=[
    ...states[0].skeleton_shape_ids.map((shape_id,index)=>({state:'loading',shape_id,role:index===2?'skeleton-peek':'skeleton'})),
    {state:'results',shape_id:states[1].result_card.shape_id,component:states[1].result_card.component,fixture:'event.real.7003'},
  ];
  if(region.region_id==='search.collection-links') region.source_exact_instances=states.map(s=>({state:s.state,shape_id:s.children[2].shape_id,component:s.children[2].component}));
}
bindings.correction_overlays??=[];
const overlay={archetype_id:archetype.archetype_id,astro_commit:ASTRO,contract:archetype.source_exact_correction,penpot_page_id:PAGE,penpot_revision:REVISION,review_items:['OV-47','OV-48'],scope:'mobile-loading-results'};
const i=bindings.correction_overlays.findIndex(o=>o.archetype_id===archetype.archetype_id);
if(i>=0)bindings.correction_overlays[i]=overlay;else bindings.correction_overlays.push(overlay);
write(BINDINGS,bindings);
console.log(`${BINDINGS}: registered ${states.length} Search source-exact state owners; desktop remains open`);
