import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {assertHomeProfile,assertHomeStructuralProjection,HOME_PROFILE_PATH} from '../scripts/validate-home-profile-v1.mjs';
const profilePath=resolve(HOME_PROFILE_PATH),profileBytes=readFileSync(profilePath),profile=JSON.parse(profileBytes);
const digest=s=>createHash('sha256').update(s).digest('hex');
const cp=x=>structuredClone(x);
const geometry={x:0,y:0,width:100,height:40};
const computed=Object.fromEntries(['display','position','fontFamily','fontSize','lineHeight','color','backgroundColor','borderRadius','borderWidth','padding','gap','overflow'].map(k=>[k,'synthetic-test-value']));
function node(family,attributes={},children=[]) {
 const f=profile.families.find(x=>x.id===family);
 return {kind:'element',attributes,computed:{...computed},bounds:{...geometry},identity:family?{family,version:String(f?.version||1),variant:'synthetic-test',state:'synthetic-test'}:null,containing_family:family||null,children};
}
function annotate(n,path='home',parent=null) {
 n.anatomy_path=path;n.stable_id=`home.${digest(JSON.stringify(path)).slice(0,24)}`;n.parent_id=parent;
 for(const [i,c] of (n.children||[]).entries())annotate(c,`${path}/${i}`,n.stable_id);
}
/** Synthetic malformed-packet tests only; never real UI/fixture evidence. */
function fixture() {
 const repo=mkdtempSync(join(tmpdir(),'home-profile-test-'));
 const git=args=>execFileSync('git',args,{cwd:repo,stdio:['ignore','pipe','pipe']}).toString().trim();
 git(['init','-q']);git(['config','user.email','fixture@example.invalid']);git(['config','user.name','Synthetic test']);
 const families=[...profile.families.map(x=>({id:x.id,version:x.version,astro_root:x.path,style_owners:[]})),...profile.shared_owners.map(id=>({id,version:1,astro_root:`site/src/shared/${id}.txt`,style_owners:[],...(id==='Icon'?{penpot_binding:{component_id:'existing-native-binding'}}:{})}))];
 const write=(p,v)=>{mkdirSync(dirname(join(repo,p)),{recursive:true});writeFileSync(join(repo,p),v);};
 const bytes=JSON.stringify({families});write(profile.shared_identity.registry_path,bytes);
 for(const f of families)write(f.astro_root,`synthetic source ${f.id}`);
 const behaviorPaths=[profile.route_policy.source,...profile.behavior_sources,...Object.values(profile.capture_handoff).filter(x=>typeof x==='string'&&x.endsWith('.ts'))];
 for(const p of behaviorPaths)write(p,`synthetic behavior ${p}`);
 git(['add','.']);git(['commit','-qm','synthetic fixture']);const expectedSha=git(['rev-parse','HEAD']);
 const blocks=profile.route_policy.composition.map(f=>node(f,{},f==='HomeColdStartFeed'?[node('AdaptiveEventCardGrid')]:[]));
 const tree=node('EventLayout',{},[node('HomePage',{},blocks),node(null,{'data-mobile-bottom-nav':''})]);
 annotate(tree);
 const record={schema:profile.export.schema,route:'/',profile_id:profile.profile_id,fixture_state:'synthetic-test-only',viewport:{width:390,height:844,dpr:1},provenance:{repo_sha:expectedSha,manifest:{repo_sha:expectedSha},manifest_sha256:digest('synthetic manifest'),registry_path:profile.shared_identity.registry_path,registry_sha256:digest(bytes),profile_sha256:digest(profileBytes),snapshot:{id:'synthetic-not-production',sha256:digest('synthetic')},reference_clock:'2026-09-06T12:00:00Z'},source_bindings:families.map(f=>({id:f.id,version:f.version,path:f.astro_root,sha256:digest(readFileSync(join(repo,f.astro_root))),styles:[],...(f.penpot_binding?{penpot_binding:f.penpot_binding}:{})})),behavior_bindings:behaviorPaths.map(path=>({path,sha256:digest(readFileSync(join(repo,path)))})),event_ids:[],composition:profile.route_policy.composition,feed:{budget:30,candidate_pool_count:0,mode:'empty',stable_visible_prefix:true},shell:{policy:'home-lower-only',top_participant_count:0,lower_island_count:1,home_chat_count:0},page_end:{state:'shown',reason:null},tree,assets:{},tokens:{"--ke-space-1":"synthetic-test-token"}};
 return {record,options:{expectedSha,expectedEventIds:[],repoRoot:repo,profilePath},close:()=>rmSync(repo,{recursive:true,force:true})};
}
test('executable profile asserts owner route exception without claiming acceptance',()=>{
 assert.equal(assertHomeProfile(profile).acceptance,false);
 for(const change of [p=>p.route_policy.top_participants_mounted=true,p=>p.route_policy.composition.reverse(),p=>p.feed.budget=12,p=>p.export.penpot_round_trip=true,p=>p.capture_handoff.one_logical_adoption=false]){const p=cp(profile);change(p);assert.throws(()=>assertHomeProfile(p));}
});
test('exact source-bound synthetic shape validates structural-only, not native/visual acceptance',()=>{const f=fixture();try{const result=assertHomeStructuralProjection(f.record,f.options);assert.equal(result.valid,true);assert.equal(result.penpot_round_trip,false);assert.equal(result.visual_acceptance,false);}finally{f.close();}});
test('forged source, registry, behavior, profile and native bindings fail closed',()=>{const f=fixture();try{
 for(const change of [r=>r.provenance.repo_sha='a'.repeat(40),r=>r.provenance.registry_sha256='a'.repeat(64),r=>r.source_bindings[0].sha256='a'.repeat(64),r=>r.behavior_bindings[0].sha256='a'.repeat(64),r=>r.provenance.profile_sha256='a'.repeat(64),r=>r.source_bindings.find(x=>x.id==='Icon').penpot_binding=null,r=>r.source_bindings.pop()]){const r=cp(f.record);change(r);assert.throws(()=>assertHomeStructuralProjection(r,f.options));}
}finally{f.close();}});
test('actual mounted top/nav and DOM order cannot hide behind clean aggregate metadata',()=>{const f=fixture();try{
 for(const change of [r=>r.tree.attributes['data-floating-top-band']='',r=>r.tree.children[1].attributes={},r=>r.tree.children[0].children.reverse(),r=>r.tree.attributes['data-conversational-search']='',r=>r.tokens={},r=>r.tree.computed={},r=>r.tree.bounds.width=-1]){const r=cp(f.record);change(r);assert.throws(()=>assertHomeStructuralProjection(r,f.options));}
}finally{f.close();}});
test('false card order, missing suppression evidence and unbound images are rejected',()=>{const f=fixture();try{
 for(const change of [r=>r.event_ids=['123'],r=>r.page_end={state:'suppressed',reason:null},r=>r.tree.image={natural_width:20,src:'missing',asset_sha256:'a'.repeat(64)},r=>r.tree.svg={markup:'<svg/>',sha256:'b'.repeat(64)}]){const r=cp(f.record);change(r);assert.throws(()=>assertHomeStructuralProjection(r,f.options));}
}finally{f.close();}});

test('settled shared media and card actions are mandatory for every rendered event',()=>{const f=fixture();try{
 const card=node('EventCard',{'data-event-card':'','data-event-id':'real-id-fixture','data-calendar-eligible':'false'},[
   node(null,{'data-media-frame':'','data-media-frame-contract':'v1','data-media-frame-resource-state':'fallback','data-media-frame-fallback':''}),
   node(null,{'data-feedback-action':'like'}),node(null,{'data-feedback-action':'not_interested'}),node(null,{'data-native-share':''})]);
 const grid=f.record.tree.children[0].children.find(n=>n.identity.family==='HomeColdStartFeed').children[0];grid.children=[card];annotate(f.record.tree);
 f.record.event_ids=['real-id-fixture'];f.options.expectedEventIds=['real-id-fixture'];f.record.feed={...f.record.feed,mode:'general',candidate_pool_count:50};
 assert.equal(assertHomeStructuralProjection(f.record,f.options).card_count,1);
 for(const change of [c=>c.children[0].attributes['data-media-frame-resource-state']='pending',c=>c.children[0].attributes['data-media-frame-resource-state']='loaded',c=>delete c.children[0].attributes['data-media-frame-fallback'],c=>c.children[1].attributes={},c=>c.children[3].attributes={},c=>c.attributes['data-calendar-eligible']='true']) {
   const r=cp(f.record);change(r.tree.children[0].children.find(n=>n.identity.family==='HomeColdStartFeed').children[0].children[0]);
   assert.throws(()=>assertHomeStructuralProjection(r,f.options));
 }
}finally{f.close();}});
