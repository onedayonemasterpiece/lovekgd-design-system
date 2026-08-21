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
PR='receipts/penpot/event-card-taxonomy-candidate-v1.json'
IC='catalog/normalization/iconography/event-card-icon-registry-candidate-v1.json'
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
 tax,man,fr,visual,icons=load(root/TAX),load(root/MAN),load(root/FR),load(root/VS),load(root/IC)
 ts,ms,vss=load(root/TS),load(root/MS),load(root/VSS); Draft202012Validator.check_schema(ts); Draft202012Validator.check_schema(ms); Draft202012Validator.check_schema(vss); schema_check(tax,ts,TAX); schema_check(man,ms,MAN); schema_check(visual,vss,VS)
 expected=stable_hash(tax,'contract_payload_sha256')
 if tax['contract_payload_sha256']!=expected: fail('ECT_CONTRACT_HASH_MISMATCH','/contract_payload_sha256',f'expected {expected}')
 fbytes=(root/FR).read_bytes(); fsha=hashlib.sha256(fbytes).hexdigest()
 if tax['framing_binding']['file_sha256']!=fsha or tax['framing_binding']['contract_payload_sha256']!=fr['contract_payload_sha256']: fail('ECT_FRAMING_JOIN_MISMATCH','/framing_binding','framing file/hash join failed')
 if man['contract_payload_sha256']!=expected or man['contract_version']!=tax['contract_version']: fail('ECT_MANIFEST_JOIN_MISMATCH','/contract_payload_sha256','manifest contract join failed')
 receipt=load(root/PR)
 components={x['component_id']:x for x in tax['components']}
 required={'event.card','listing.event-card','listing.rail-row','festival.card','exhibition.row'}
 if set(components)!=required: fail('ECT_COMPONENT_SET_INVALID','/components',f'expected {sorted(required)}')
 icon_join=tax.get('package_bindings',{}).get('iconography',{})
 if icon_join.get('contract_payload_sha256')!=icons.get('contract_payload_sha256') or icon_join.get('required_icon_count')!=len(icons.get('icons',[])): fail('ECT_ICONOGRAPHY_JOIN','/package_bindings/iconography','event-card icon registry hash/count join failed')
 icon_ids={x['icon_id'] for x in icons['icons']}
 for cid,c in components.items():
  binding=c.get('icon_registry_binding',{})
  refs=binding.get('icon_refs',[])
  if binding.get('contract_payload_sha256')!=icons['contract_payload_sha256'] or not refs: fail('ECT_ICON_BINDING_MISSING',f'/components/{cid}/icon_registry_binding','each family requires exact icon-registry binding')
  for ref in refs:
   if ref.endswith('.*'):
    if not any(x.startswith(ref[:-1]) for x in icon_ids): fail('ECT_ICON_REF_UNKNOWN',f'/components/{cid}/icon_registry_binding',ref)
   elif ref not in icon_ids: fail('ECT_ICON_REF_UNKNOWN',f'/components/{cid}/icon_registry_binding',ref)
 if fr['radii_px'].get('scope')!='consumer-specific-source-derived': fail('ECT_FRAMING_RADIUS_SCOPE_INVALID','/radii_px/scope','global radii are forbidden; source-derived consumer radii required')
 current_page40='45de0a42-f540-80b3-8008-80aa7bc00fa0'; current_page46='45de0a42-f540-80b3-8008-80ad04ad1a0e'
 if not any(x.get('page_id')==current_page40 for x in fr['penpot_bindings']): fail('ECT_FRAMING_PENPOT_BINDING_STALE','/penpot_bindings','current lightweight Page40 binding required')
 total_states=sum(len(c['valid_combinations']) for c in components.values())
 if a.require_penpot:
  if receipt.get('contract_payload_sha256')!=expected: fail('ECT_RECEIPT_CONTRACT_JOIN_MISMATCH','/contract_payload_sha256','Penpot receipt must join current taxonomy hash')
  if receipt.get('penpot',{}).get('page40_id')!=current_page40 or receipt.get('penpot',{}).get('page46_id')!=current_page46: fail('ECT_RECEIPT_PAGE_BINDING_STALE','/penpot','current Page40/Page46 IDs required')
  if set(receipt.get('native_families',{}))!=required: fail('ECT_RECEIPT_FAMILY_SET_INVALID','/native_families','all five native families required')
  for cid,c in components.items():
   rb=receipt['native_families'][cid]; keys=[x['state_key'] for x in c['valid_combinations']]
   if rb.get('variant_container_id')!=c['penpot_binding'].get('variant_container_id'): fail('ECT_VARIANT_CONTAINER_JOIN_MISMATCH',f'/native_families/{cid}/variant_container_id','receipt and taxonomy differ')
   if rb.get('variant_count')!=len(keys) or rb.get('page46_state_instance_count')!=len(keys): fail('ECT_STATE_INSTANCE_COUNT_MISMATCH',f'/native_families/{cid}','variant and Page46 state counts must equal contract states')
   if rb.get('exact_state_keys')!=keys: fail('ECT_STATE_KEY_READBACK_MISMATCH',f'/native_families/{cid}/exact_state_keys','exact composite state keys/order must equal taxonomy')
  readback=receipt.get('readback',{})
  if readback.get('native_variant_container_count')!=5 or readback.get('native_variant_count')!=total_states or readback.get('normalized_state_instance_count')!=total_states: fail('ECT_NATIVE_READBACK_COUNT_MISMATCH','/readback',f'expected 5 native containers and {total_states} exact state variants/instances')
  if readback.get('detached_instance_count')!=0 or readback.get('file_validation_error_count')!=0 or readback.get('variant_error_count')!=0: fail('ECT_NATIVE_READBACK_INVALID','/readback','detached instances, Penpot validation errors and variant errors must all be zero')
 if visual['source']['commit']!=tax['source_baseline']['exact_commit']: fail('ECT_VISUAL_SOURCE_MISMATCH','/source/commit','visual spec must bind taxonomy source baseline')
 if visual.get('contract_binding',{}).get('contract_payload_sha256')!=expected or visual.get('contract_binding',{}).get('expected_native_state_count')!=total_states: fail('ECT_VISUAL_CONTRACT_JOIN_MISMATCH','/contract_binding','visual spec must hash-bind the current taxonomy and exact state count')
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
  if len(c.get('source_element_bindings',[]))!=len(c['anatomy']) or {x.get('element') for x in c.get('source_element_bindings',[])}!=set(c['anatomy']): fail('ECT_ELEMENT_SOURCE_BINDING_INCOMPLETE',f'/components/{cid}/source_element_bindings','every anatomy element must join to exact Astro/source ownership')
  seen=set()
  for i,v in enumerate(c['valid_combinations']): parse_state(c,v['state_key'],f'/components/{cid}/valid_combinations/{i}/state_key'); seen.add(v['state_key'])
  if len(seen)!=len(c['valid_combinations']): fail('ECT_DUPLICATE_STATE',f'/components/{cid}/valid_combinations','duplicate state key')
 surfaces={x['surface_id']:x for x in tax.get('surface_state_contracts',[])}
 if set(surfaces)!={'authorized-event-search','favorites','personal-feed','mobile-listing-rail','artifact-collection'}: fail('ECT_SURFACE_STATE_SET_INVALID','/surface_state_contracts','exact five parent surface contracts required')
 listing_keys=set(components['listing.event-card']['runtime_state_keys'])
 exact_listing={'data-listing-image-mode','data-listing-crop-adaptive','data-listing-crop-evidence','data-listing-source-width','data-listing-source-height','data-listing-media-role','data-listing-vertical-retention','data-listing-low-resolution','data-listing-density','data-image-text-mode','data-listing-proof-placement','data-listing-overlay-kind','data-listing-media-treatment','data-listing-fit','data-listing-cover-crop','data-listing-crop-reason'}
 if listing_keys!=exact_listing: fail('ECT_LISTING_RUNTIME_ATTRIBUTE_DRIFT','/components/listing.event-card/runtime_state_keys',f'expected exact ListingEventCard attributes {sorted(exact_listing)}')
 event=components['event.card']
 if event['variant_axes'].get('layout')!=['split-actions','overlay-controls'] or any(x in event['nested_component_refs'] for x in ['core.favorite-action','core.share-action','core.calendar-action']): fail('ECT_EVENT_CARD_ACTION_OWNERSHIP','/components/event.card','both source layouts required and false nested action components forbidden')
 listing=components['listing.event-card']
 listing_expected_axes=['viewport','density','media','proof','content','temporal','identity-count','tail-layout','interaction','overlay-medallion','free-medallion']
 if listing['state_key_order']!=listing_expected_axes or listing['variant_axes'].get('temporal')!=['current','started-earlier','past'] or set(listing['variant_axes'].get('identity-count',[]))!={'0','1','2','3'} or set(listing['variant_axes'].get('interaction',[]))!={'default','hover','focus-visible'}: fail('ECT_LISTING_VISUAL_PLANE','/components/listing.event-card','temporal, identity, tail and interaction source axes required')
 rail=components['listing.rail-row']
 rail_states='\n'.join(x['state_key'] for x in rail['valid_combinations'])
 if 'hidden-undo' in rail_states or 'hide-committed' in rail_states or 'artifact=tail-opportunity' in rail_states or 'artifact=amber-tail' not in rail_states: fail('ECT_RAIL_STATE_OWNERSHIP','/components/listing.rail-row','hidden/toast is surface-owned and exact amber-tail row placement is required')
 if rail['state_key_order']!=['viewport','scroll-position','occurrence','schedule','media-count-sequence','gesture','media-state','temporal','artifact'] or set(rail['variant_axes']['schedule'])!={'exact-time','program-day','program-day-range','date-primary'}: fail('ECT_RAIL_SCHEDULE_PLANE','/components/listing.rail-row','source viewport, scroll, occurrence and schedule states required')
 festival=components['festival.card']
 if 'document' not in festival['variant_axes'].get('media',[]) or set(festival['variant_axes'].get('interaction',[]))!={'default','hover','focus-visible'}: fail('ECT_FESTIVAL_MEDIA_INTERACTION','/components/festival.card','document media plus hover/focus source states required')
 exhibition=components['exhibition.row']
 exhibition_states='\n'.join(x['state_key'] for x in exhibition['valid_combinations'])
 if 'feedback-selection=rejected-hidden-with-undo' not in exhibition_states or 'feedback-selection=hidden-undo' in exhibition_states or 'presentation=mobile-gallery' not in exhibition_states or 'viewport=mobile' not in exhibition_states: fail('ECT_EXHIBITION_STATE_DRIFT','/components/exhibition.row','combined rejected/undo and mobile presentation required')
 # EventCard's former E13-E23 Cartesian tail was retired after the owner review:
 # those controller/action states are now validated as linked primitives and
 # contextual specimens instead of duplicate parent-card variants.
 expected_counts={'event.card':12,'listing.event-card':10,'listing.rail-row':16,'festival.card':9,'exhibition.row':7}
 if {cid:len(c['valid_combinations']) for cid,c in components.items()}!=expected_counts: fail('ECT_SOURCE_STATE_COUNT_DRIFT','/components',f'exact source-proven representative plane required: {expected_counts}')
 composed=components['event.card'].get('composed_state_contracts',{})
 if composed.get('state_count')!=11 or len(composed.get('states',[]))!=11:
  fail('ECT_COMPOSED_STATE_COUNT_DRIFT','/components/event.card/composed_state_contracts','the retired E13-E23 source states must remain preserved as 11 composable-state contracts')
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
 stale_ids=['10a29786-8dcf-802c-8008-739d91a640ed','66419e3c-4a3e-80f8-8008-80991f88c656']
 if any(x in raw for x in stale_ids): fail('ECT_STALE_PENPOT_BINDING','/','deleted Page40 or rejected Page46 UUID remains in a current contract binding')
 print(json.dumps({'status':'valid','contract_payload_sha256':expected,'components':len(components),'visual_specimens':len(visual['specimens']),'visual_acceptance':visual['visual_acceptance']['status'],'screenshots':8,'screenshot_items':23,'penpot_required':a.require_penpot},indent=2))
if __name__=='__main__': main()
