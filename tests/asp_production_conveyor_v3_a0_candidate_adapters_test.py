#!/usr/bin/env python3
from pathlib import Path
import copy, hashlib, json, re
from jsonschema import Draft202012Validator, ValidationError
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'catalog/asp-production-conveyor-v3/a0'
def load(name): return json.loads((BASE/name).read_text(encoding='utf-8'))
def canon(o): return json.dumps(o,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
def sha(o): return hashlib.sha256(canon(o)).hexdigest()
def file_sha(path): return hashlib.sha256((ROOT/path).read_bytes()).hexdigest()
schema_doc=load('candidate-adapter.schema.json')
def validator(name): return Draft202012Validator({'$schema':'https://json-schema.org/draft/2020-12/schema','$defs':schema_doc['$defs'],'$ref':f'#/$defs/{name}'})
def validate(obj,name): validator(name).validate(obj)
def invalid(obj,name):
    try: validate(obj,name)
    except ValidationError: return
    raise AssertionError('negative case unexpectedly validated')
uuid=re.compile(r'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$')
forbidden_keys={'page_id','board_id','component_id','shape_id','direct_url','penpot_uuid','screenshot'}
def forbid(v):
    if isinstance(v,dict):
        for k,x in v.items():
            assert k not in forbidden_keys,k
            forbid(x)
    elif isinstance(v,list):
        for x in v: forbid(x)
    elif isinstance(v,str):
        assert not uuid.fullmatch(v),v
        assert 'design.penpot.app' not in v,v
        assert v not in {'PASS','REVIEWABLE','ACCEPTED','READY_TO_PROMOTE'},v
n=0
def check(value,label):
    global n
    assert value,label
    n+=1
def verify_adapter(a):
    validate(a,'candidate_adapter'); check(True,'schema')
    check(sha({k:v for k,v in a.items() if k!='receipts'})==a['receipts']['adapter_record_sha256'],'adapter hash')
    p=a['package_manifest']; check(sha({k:v for k,v in p.items() if k!='package_record_sha256'})==p['package_record_sha256'],'package hash')
    check(sha(a['idempotency']['material'])==a['idempotency']['sha256'],'idempotency hash')
    check(a['idempotency']['key'].endswith(a['idempotency']['sha256']),'idempotency key')
    steps=a['build_contract']['steps']
    check([x['order'] for x in steps]==list(range(1,len(steps)+1)),'step order')
    check([x['semantic_root_key'] for x in steps]==a['target']['semantic_root_order'],'root order')
    m=a['idempotency']['material']
    if 'build_steps' in m: check(steps==m['build_steps'],'full idempotency steps')
    else: check(sha(steps)==m['build_steps_sha256'],'compact idempotency steps')
    check(a['target']==m['target'],'target receipt')
    check(a['bounded_mutation_scope']==m['bounded_mutation_scope'],'scope receipt')
    if 'contract_receipts' in a: check(sha(a['contract_receipts'])==m['contract_receipts_sha256'],'contract receipts')
    check(a['promotion_authorized'] is False and a['penpot_mutations']==0,'candidate boundary')
    forbid(a); check(True,'forbidden lineage')
date=load('date-listing-shell-candidate-adapter.v1.json')
wave1=load('archetype-wave-1-candidate-adapter.v1.json')
wave2=load('archetype-wave-2-candidate-adapter.v1.json')
owner=load('owner-review-index-candidate-adapter.v1.json')
source2=load('archetype-wave-2.v2.json')
index=load('owner-review-index.v1.json')
queue=load('candidate-adapter-queue.v1.json')
receipt=load('candidate-adapter-receipt.v1.json')
for a in (date,wave1,wave2,owner): verify_adapter(a)
# Preserve exact Date and Wave 1 contracts.
ds=date['build_contract']['steps']
check(len(ds)==7,'date count')
check([x['scenario_id'] for x in ds]==['a0.date.typical.desktop.v1','a0.date.typical.mobile.v1','a0.date.sparse.desktop.v1','a0.date.state-matrix.mobile.v1','a0.date.stress.desktop.v1','a0.date.full.desktop.v1','a0.date.full.mobile.v1'],'date scenarios')
check([x['fixture_ids'] for x in ds]==[['event.real.8006'],['event.real.8006'],['event.real.8200'],[],['event.real.4240','event.real.8006','event.real.8200'],['event.real.8006'],['event.real.8006']],'date fixtures')
check(ds[3]['required_states']==['loading','empty','error'],'date states')
ws=wave1['build_contract']['steps']
check(len(ws)==12,'wave1 count')
check([x['archetype_id'] for x in ws[::2]]==['archetype.home','archetype.listing.weekend','archetype.listing.popular','archetype.listing.unusual','archetype.collections','archetype.exhibitions'],'wave1 order')
check(all(x['fixture_semantics']=='REFERENCE_ONLY_NOT_ROUTE_MEMBERSHIP' for x in ws),'wave1 fixture policy')
check([x['viewport']['id'] for x in ws]==['desktop','mobile']*6,'wave1 viewports')
check(all(x['active_candidate_state'] in x['required_states'] for x in ws),'wave1 active states')
check(len({x['evidence_key'] for x in ws})==12,'wave1 evidence')
# Wave 2 exact twenty-case executable adapter and source repair.
w2=wave2['build_contract']['steps']
ids=['archetype.search','archetype.favorites','archetype.personal-feed','archetype.festivals','archetype.interest-clubs','archetype.artifacts','archetype.event-detail','archetype.focus-group','archetype.information-pages','archetype.special-state']
check(len(w2)==20,'wave2 count')
check([x['archetype_id'] for x in w2[::2]]==ids,'wave2 archetype order')
check([x['viewport']['id'] for x in w2]==['desktop','mobile']*10,'wave2 viewport order')
check(len({x['evidence_key'] for x in w2})==20,'wave2 evidence')
check(all(x['fixture_semantics'] in {'REFERENCE_ONLY_NOT_ROUTE_MEMBERSHIP','NO_EVENT_DATA_REQUIRED'} for x in w2),'wave2 fixture policy')
check(all(x['active_candidate_state'] in x['required_states'] for x in w2),'wave2 active states')
check(all(x['projection_sha256']==source2['record_sha256'] for x in w2),'wave2 projection receipt')
check(all('archetype-wave-2.v2.json#archetypes/' in x['projection_ref'] for x in w2),'wave2 v2 refs')
focus=[x for x in w2 if x['archetype_id']=='archetype.focus-group']
focus_routes=['/fokus-gruppa/','/fokus-gruppa/priglashenie/','/fokus-gruppa/diagnostika/','/fokus-gruppa/diagnostika-ustoychivost/','/fokus-gruppa/kollektsiya/','/fokus-gruppa/zavershenie/']
focus_pages=['site/src/pages/fokus-gruppa/index.astro','site/src/pages/fokus-gruppa/priglashenie/index.astro','site/src/pages/fokus-gruppa/diagnostika/index.astro','site/src/pages/fokus-gruppa/diagnostika-ustoychivost/index.astro','site/src/pages/fokus-gruppa/kollektsiya/index.astro','site/src/pages/fokus-gruppa/zavershenie/index.astro']
check(all(x['route_patterns']==focus_routes for x in focus),'focus routes')
check(all(x['source_pages']==focus_pages for x in focus),'focus pages')
info=next(x for x in w2 if x['archetype_id']=='archetype.information-pages')
special=next(x for x in w2 if x['archetype_id']=='archetype.special-state')
check(info['excluded_unmaterialized_states']==['legal-document'],'info exclusion')
check(special['excluded_unmaterialized_states']==['prelaunch-env','unavailable'],'special exclusions')
check(source2['volunteer']['status']=='EXCLUDED_NO_FACTUAL_CURRENT_ROUTE_CONTRACT','volunteer boundary')
# Independent compact owner-review index adapter.
os=owner['build_contract']['steps']
check(len(os)==2 and [x['viewport']['id'] for x in os]==['desktop','mobile'],'index cases')
check(owner['index_contract']['review_keys']==[x[1] for x in index['rows']],'index key order')
check(owner['index_contract']['review_keys_sha256']==sha([x[1] for x in index['rows']]),'index keys hash')
check(owner['index_contract']['row_count']==45,'index row count')
check(all(x['active_candidate_state']=='pending' for x in os),'index pending')
# Queue and receipt remain content addressed, with real independent PREPARING work.
validate(queue,'queue'); check(True,'queue schema')
check(sha({k:v for k,v in queue.items() if k!='queue_record_sha256'})==queue['queue_record_sha256'],'queue hash')
check([x['package_id'] for x in queue['ready']]==['A-DATE-LISTING-SHELL-CANDIDATE-ADAPTER','A-ARCHETYPE-WAVE-1-CANDIDATE-ADAPTER','A-ARCHETYPE-WAVE-2-CANDIDATE-ADAPTER','A-OWNER-REVIEW-INDEX-CANDIDATE-ADAPTER'],'queue ready')
check([x['package_id'] for x in queue['preparing']]==['A-SELECTIVE-DONOR-RECOVERY-ARCHETYPE-STRUCTURES-R1'],'queue preparing')
check(queue['repair'][0]['status']=='REPAIRED','repair state')
check(len(queue['existing_ready_packages_immutable'])==8,'immutable baseline')
validate(receipt,'receipt'); check(True,'receipt schema')
check(sha({k:v for k,v in receipt.items() if k!='receipt_record_sha256'})==receipt['receipt_record_sha256'],'receipt hash')
for f in receipt['files']: check(file_sha(f['path'])==f['file_sha256'],f['path'])
check(receipt['record_hashes']['wave2_adapter_record_sha256']==wave2['receipts']['adapter_record_sha256'],'wave2 receipt')
check(receipt['record_hashes']['owner_index_adapter_record_sha256']==owner['receipts']['adapter_record_sha256'],'owner receipt')
check(receipt['record_hashes']['queue_record_sha256']==queue['queue_record_sha256'],'queue receipt')
# Required negative cases.
for mutate,label in [
    (lambda b:b.update(promotion_authorized=True),'promotion'),
    (lambda b:b.update(visual_acceptance='PASS'),'visual pass'),
    (lambda b:b['build_contract']['steps'][14].update(route_patterns=['/fokus-gruppa/']),'focus route omission'),
    (lambda b:b['build_contract']['steps'][14].update(source_pages=['site/src/pages/fokus-gruppa/index.astro']),'focus page omission'),
    (lambda b:b['build_contract']['steps'][0].update(required_states=[]),'state omission'),
    (lambda b:b['target'].update(semantic_root_order=list(reversed(b['target']['semantic_root_order']))),'root order'),
]:
    bad=copy.deepcopy(wave2); mutate(bad)
    try: verify_adapter(bad)
    except (AssertionError,ValidationError): check(True,label)
    else: raise AssertionError(label+' accepted')
bad=copy.deepcopy(owner); bad['index_contract']['review_keys'].pop()
try: verify_adapter(bad)
except (AssertionError,ValidationError): check(True,'owner key omission')
else: raise AssertionError('owner key omission accepted')
bad=copy.deepcopy(wave2); bad['target']['legacy']='d87e18f1-dcb4-80a6-8008-8806c5b98101'
try: forbid(bad)
except AssertionError: check(True,'UUID')
else: raise AssertionError('UUID accepted')
bad=copy.deepcopy(queue); bad['preparing']=[]; invalid(bad,'queue'); check(True,'empty preparing')
bad=copy.deepcopy(receipt); bad['files'][0]['file_sha256']='0'*64
try: check(sha({k:v for k,v in bad.items() if k!='receipt_record_sha256'})==bad['receipt_record_sha256'],'bad receipt')
except AssertionError: n+=1
else: raise AssertionError('receipt mismatch accepted')
print(json.dumps({'status':'PASS','checks_passed':n,'checks_failed':0},separators=(',',':')))
