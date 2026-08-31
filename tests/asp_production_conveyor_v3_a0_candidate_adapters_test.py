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

def verify_adapter(a):
    validate(a,'candidate_adapter')
    assert sha({k:v for k,v in a.items() if k!='receipts'})==a['receipts']['adapter_record_sha256']
    p=a['package_manifest']; assert sha({k:v for k,v in p.items() if k!='package_record_sha256'})==p['package_record_sha256']
    assert sha(a['idempotency']['material'])==a['idempotency']['sha256']
    assert a['idempotency']['key'].endswith(a['idempotency']['sha256'])
    steps=a['build_contract']['steps']
    assert [x['order'] for x in steps]==list(range(1,len(steps)+1))
    assert [x['semantic_root_key'] for x in steps]==a['target']['semantic_root_order']
    assert steps==a['idempotency']['material']['build_steps']
    assert a['target']==a['idempotency']['material']['target']
    assert a['bounded_mutation_scope']==a['idempotency']['material']['bounded_mutation_scope']
    assert a['promotion_authorized'] is False and a['penpot_mutations']==0
    forbid(a)

date=load('date-listing-shell-candidate-adapter.v1.json')
wave=load('archetype-wave-1-candidate-adapter.v1.json')
queue=load('candidate-adapter-queue.v1.json')
receipt=load('candidate-adapter-receipt.v1.json')
n=0
for a in (date,wave): verify_adapter(a); n+=12
# Date exact seven representations, projections, fixtures and states
ds=date['build_contract']['steps']
assert len(ds)==7; n+=1
assert [x['scenario_id'] for x in ds]==['a0.date.typical.desktop.v1','a0.date.typical.mobile.v1','a0.date.sparse.desktop.v1','a0.date.state-matrix.mobile.v1','a0.date.stress.desktop.v1','a0.date.full.desktop.v1','a0.date.full.mobile.v1']; n+=1
assert [x['fixture_ids'] for x in ds]==[['event.real.8006'],['event.real.8006'],['event.real.8200'],[],['event.real.4240','event.real.8006','event.real.8200'],['event.real.8006'],['event.real.8006']]; n+=1
assert ds[3]['required_states']==['loading','empty','error']; n+=1
# Wave 1 exact six/twelve contract; specimen fixtures are never route membership
ws=wave['build_contract']['steps']
assert len(ws)==12 and [x['order'] for x in ws]==list(range(1,13)); n+=1
assert [x['archetype_id'] for x in ws[::2]]==['archetype.home','archetype.listing.weekend','archetype.listing.popular','archetype.listing.unusual','archetype.collections','archetype.exhibitions']; n+=1
assert all(x['fixture_semantics']=='REFERENCE_ONLY_NOT_ROUTE_MEMBERSHIP' for x in ws); n+=1
assert [x['viewport'] for x in ws[:2]]==[{'id':'desktop','width':1280,'height':800},{'id':'mobile','width':390,'height':844}]; n+=1
assert all(x['active_candidate_state'] in x['required_states'] for x in ws); n+=1
assert len({x['evidence_key'] for x in ws})==12; n+=1
# Queue and receipt are content addressed and retain a real PREPARING package
validate(queue,'queue'); n+=1
assert sha({k:v for k,v in queue.items() if k!='queue_record_sha256'})==queue['queue_record_sha256']; n+=1
assert [x['package_id'] for x in queue['ready']]==['A-DATE-LISTING-SHELL-CANDIDATE-ADAPTER','A-ARCHETYPE-WAVE-1-CANDIDATE-ADAPTER']; n+=1
assert [x['package_id'] for x in queue['preparing']]==['A-ARCHETYPE-WAVE-2-CANDIDATE-ADAPTER']; n+=1
assert queue['preparing'][0]['product_semantic_decision_required'] is False; n+=1
assert len(queue['existing_ready_packages_immutable'])==8; n+=1
validate(receipt,'receipt'); n+=1
assert sha({k:v for k,v in receipt.items() if k!='receipt_record_sha256'})==receipt['receipt_record_sha256']; n+=1
for f in receipt['files']: assert file_sha(f['path'])==f['file_sha256']
n+=1
assert receipt['record_hashes']['date_adapter_record_sha256']==date['receipts']['adapter_record_sha256']; n+=1
assert receipt['record_hashes']['wave1_adapter_record_sha256']==wave['receipts']['adapter_record_sha256']; n+=1
assert receipt['record_hashes']['queue_record_sha256']==queue['queue_record_sha256']; n+=1
# Required negative cases
bad=copy.deepcopy(date); del bad['package_manifest']['materialization_entry_point']; invalid(bad,'candidate_adapter'); n+=1
bad=copy.deepcopy(date); bad['promotion_authorized']=True; invalid(bad,'candidate_adapter'); n+=1
bad=copy.deepcopy(date); bad['acceptance_status']='ACCEPTED'; invalid(bad,'candidate_adapter'); n+=1
bad=copy.deepcopy(date); bad['visual_acceptance']='PASS'; invalid(bad,'candidate_adapter'); n+=1
bad=copy.deepcopy(date); bad['build_contract']['steps'][3]['required_states']=[]; invalid(bad,'candidate_adapter'); n+=1
for mutate,label in [
 (lambda b:b['build_contract']['steps'][0].update(fixture_ids=['event.real.8200']),'changed fixture/order'),
 (lambda b:b['build_contract']['steps'][0].update(projection_sha256='0'*64),'changed projection hash'),
 (lambda b:b['target'].update(semantic_root_order=list(reversed(b['target']['semantic_root_order']))),'changed semantic root order')]:
 bad=copy.deepcopy(date); mutate(bad)
 try: verify_adapter(bad)
 except AssertionError: n+=1
 else: raise AssertionError(label+' accepted')
bad=copy.deepcopy(wave); bad['build_contract']['steps'][8]['fixture_ids']=list(reversed(bad['build_contract']['steps'][8]['fixture_ids']))
try: verify_adapter(bad)
except AssertionError: n+=1
else: raise AssertionError('wave fixture ordering accepted')
bad=copy.deepcopy(date); bad['source_inputs'].append({'direct_url':'https://design.penpot.app/legacy'})
try: forbid(bad)
except AssertionError: n+=1
else: raise AssertionError('direct URL accepted')
bad=copy.deepcopy(date); bad['target']['legacy']='d87e18f1-dcb4-80a6-8008-8806c5b98101'
try: forbid(bad)
except AssertionError: n+=1
else: raise AssertionError('UUID accepted')
bad=copy.deepcopy(receipt); bad['files'][0]['file_sha256']='0'*64
try:
 assert sha({k:v for k,v in bad.items() if k!='receipt_record_sha256'})==bad['receipt_record_sha256']
except AssertionError: n+=1
else: raise AssertionError('receipt mismatch accepted')
bad=copy.deepcopy(queue); bad['preparing']=[]; invalid(bad,'queue'); n+=1
assert n==59,n
print(json.dumps({'status':'PASS','checks_passed':n,'checks_failed':0},separators=(',',':')))
