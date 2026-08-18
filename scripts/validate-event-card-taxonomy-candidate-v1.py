#!/usr/bin/env python3
from __future__ import annotations
import argparse, collections, hashlib, json, pathlib, re, sys
from jsonschema import Draft202012Validator
TAX='catalog/normalization/families/event-preview-representations/event-card-taxonomy-candidate-v1.json'
MAN='catalog/normalization/families/event-preview-representations/screenshot-consumer-bindings-v1.json'
FR='catalog/normalization/event-media/framing-v2.json'
TS='contracts/normalization/event-card-taxonomy-candidate.v1.schema.json'
MS='contracts/normalization/event-card-binding-manifest.v1.schema.json'
VS='catalog/normalization/families/event-preview-representations/event-card-visual-spec-candidate-v1.json'
VSS='contracts/normalization/event-card-visual-spec-candidate.v1.schema.json'
ALLOWED_DISP={'mapped-to-current-runtime','current-runtime-variant','current-runtime-state','duplicate-drift','legacy-but-still-supported','obsolete','unmapped-with-explicit-reason'}
def fail(code,path,msg):
 print(json.dumps({'status':'rejected','error':{'code':code,'path':path,'diagnostic':msg}},sort_keys=True),file=sys.stderr); raise SystemExit(1)
def load(p): return json.loads(p.read_text())
def stable_hash(d,omit):
 x=dict(d); x.pop(omit,None); return hashlib.sha256(json.dumps(x,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
def schema_check(doc,schema,record):
 errors=sorted(Draft202012Validator(schema).iter_errors(doc),key=lambda e:list(e.absolute_path))
 if errors:
  e=errors[0]; fail('ECT_SCHEMA_REJECTED',record+'/'+'/'.join(map(str,e.absolute_path)),e.message)
def parse_state(component,key,path):
 parts=key.split(';'); pairs=[]
 for part in parts:
  if '=' not in part: fail('ECT_STATE_KEY_INVALID',path,'missing =')
  pairs.append(part.split('=',1))
 axes=[x[0] for x in pairs]
 if axes!=component['state_key_order']: fail('ECT_STATE_KEY_ORDER',path,f'expected {component["state_key_order"]}, got {axes}')
 for axis,value in pairs:
  if value not in component['variant_axes'][axis]: fail('ECT_STATE_VALUE_UNKNOWN',path,f'{axis}={value}')
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('--root',default='.'); ap.add_argument('--require-penpot',action='store_true'); a=ap.parse_args(); root=pathlib.Path(a.root).resolve()
 tax,man,fr,visual=load(root/TAX),load(root/MAN),load(root/FR),load(root/VS)
 ts,ms,vss=load(root/TS),load(root/MS),load(root/VSS); Draft202012Validator.check_schema(ts); Draft202012Validator.check_schema(ms); Draft202012Validator.check_schema(vss); schema_check(tax,ts,TAX); schema_check(man,ms,MAN); schema_check(visual,vss,VS)
 expected=stable_hash(tax,'contract_payload_sha256')
 if tax['contract_payload_sha256']!=expected: fail('ECT_CONTRACT_HASH_MISMATCH','/contract_payload_sha256',f'expected {expected}')
 fbytes=(root/FR).read_bytes(); fsha=hashlib.sha256(fbytes).hexdigest()
 if tax['framing_binding']['file_sha256']!=fsha or tax['framing_binding']['contract_payload_sha256']!=fr['contract_payload_sha256']: fail('ECT_FRAMING_JOIN_MISMATCH','/framing_binding','framing file/hash join failed')
 if man['contract_payload_sha256']!=expected or man['contract_version']!=tax['contract_version']: fail('ECT_MANIFEST_JOIN_MISMATCH','/contract_payload_sha256','manifest contract join failed')
 components={x['component_id']:x for x in tax['components']}
 required={'event.card','listing.event-card','listing.rail-row','festival.card','exhibition.row'}
 if set(components)!=required: fail('ECT_COMPONENT_SET_INVALID','/components',f'expected {sorted(required)}')
 if visual['source']['commit']!=tax['source_baseline']['exact_commit']: fail('ECT_VISUAL_SOURCE_MISMATCH','/source/commit','visual spec must bind taxonomy source baseline')
 visual_families=[x['family'] for x in visual['specimens']]
 if set(visual_families)!=required or len(visual_families)!=len(set(visual_families)): fail('ECT_VISUAL_FAMILY_SET_INVALID','/specimens','exactly one source-derived visual specimen per family required')
 if set(visual['visual_acceptance']['required_families'])!=required: fail('ECT_VISUAL_GATE_SCOPE_INVALID','/visual_acceptance/required_families','all five families required')
 if visual['visual_acceptance']['status']=='passed' and set(visual['visual_acceptance']['passed_families'])!=required: fail('ECT_VISUAL_GATE_FALSE_PASS','/visual_acceptance','passed requires all families')
 for i,spec in enumerate(visual['specimens']):
  for p in spec['source_paths']:
   if not p.startswith('site/src/'): fail('ECT_VISUAL_SOURCE_PATH_INVALID',f'/specimens/{i}/source_paths',p)
  if not spec['typography'].get('font_stack','').startswith('Inter'): fail('ECT_VISUAL_FONT_DRIFT',f'/specimens/{i}/typography/font_stack','exact source stack must start with Inter')
  if any(m.get('src','').startswith('data:') for m in spec['media']): fail('ECT_VISUAL_MEDIA_UNGROUNDED',f'/specimens/{i}/media','embedded/screenshot media forbidden')
 for cid,c in components.items():
  if 'event.media-frame' not in c['nested_component_refs']: fail('ECT_MEDIA_NOT_NESTED',f'/components/{cid}/nested_component_refs','event.media-frame required')
  seen=set()
  for i,v in enumerate(c['valid_combinations']): parse_state(c,v['state_key'],f'/components/{cid}/valid_combinations/{i}/state_key'); seen.add(v['state_key'])
  if len(seen)!=len(c['valid_combinations']): fail('ECT_DUPLICATE_STATE',f'/components/{cid}/valid_combinations','duplicate state key')
 inventory=[]
 for s in man['screenshots']: inventory.extend(s['item_refs'])
 bound=[s['screenshot_item_ref'] for s in man['specimens']]
 if len(inventory)!=23 or collections.Counter(inventory)!=collections.Counter(bound) or any(v!=1 for v in collections.Counter(bound).values()): fail('ECT_SCREENSHOT_COVERAGE','/specimens','every S01..S08 item must bind exactly once')
 for i,s in enumerate(man['specimens']):
  path=f'/specimens/{i}'; disp=s['disposition']; cid=s['contract_binding']['component_id']
  if disp not in ALLOWED_DISP: fail('ECT_DISPOSITION_INVALID',path+'/disposition',disp)
  include=s['contract_binding']['include_on_new_page_46']
  if include:
   if cid not in components: fail('ECT_COMPONENT_UNKNOWN',path+'/contract_binding/component_id',cid)
   parse_state(components[cid],s['contract_binding']['state_key'],path+'/contract_binding/state_key')
  elif not (cid.startswith('context.') and s['contract_binding']['state_key']=='excluded=true'): fail('ECT_CONTEXT_EXCLUSION_INVALID',path+'/contract_binding','excluded context must be explicit')
  exact=s['runtime_build_evidence'].get('status')=='exact-review-build'
  if exact and not re.fullmatch(r'[0-9a-f]{40}',s['runtime_build_evidence'].get('commit','')): fail('ECT_EXACT_BUILD_UNPROVEN',path+'/runtime_build_evidence','exact claim requires 40-char commit')
  if a.require_penpot and include:
   pb=s['penpot_binding']; vals=[pb.get('page_id'),pb.get('component_id'),pb.get('variant_id')]
   if pb.get('status')!='materialized-readback' or not all(isinstance(x,str) and re.fullmatch(r'[0-9a-f-]{36}',x) for x in vals) or not pb.get('instance_ids'): fail('ECT_PENPOT_BINDING_INCOMPLETE',path+'/penpot_binding','materialized UUIDs and instance readback required')
 raw=(root/TAX).read_text()+(root/MAN).read_text(); forbidden=['production-v1','PROMOTED','SOURCE OF TRUTH','verified implementation']
 if any(x in raw for x in forbidden): fail('ECT_FORBIDDEN_CLAIM','/','forbidden promotion/implementation label')
 print(json.dumps({'status':'valid','contract_payload_sha256':expected,'components':len(components),'visual_specimens':len(visual['specimens']),'visual_acceptance':visual['visual_acceptance']['status'],'screenshots':8,'screenshot_items':23,'penpot_required':a.require_penpot},indent=2))
if __name__=='__main__': main()
