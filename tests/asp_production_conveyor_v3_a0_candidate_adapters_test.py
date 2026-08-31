#!/usr/bin/env python3
from pathlib import Path
import copy, hashlib, json, re
from jsonschema import Draft202012Validator, ValidationError
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'catalog/asp-production-conveyor-v3/a0'
def load(name): return json.loads((BASE/name).read_text(encoding='utf-8'))
def canon(o): return json.dumps(o,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
def sha(o): return hashlib.sha256(canon(o)).hexdigest()
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
    assert a['promotion_authorized'] is False and a['penpot_mutations']==0
    forbid(a)

date=load('date-listing-shell-candidate-adapter.v1.json')
n=0
verify_adapter(date); n+=8
steps=date['build_contract']['steps']
assert len(steps)==7; n+=1
assert [x['scenario_id'] for x in steps]==['a0.date.typical.desktop.v1','a0.date.typical.mobile.v1','a0.date.sparse.desktop.v1','a0.date.state-matrix.mobile.v1','a0.date.stress.desktop.v1','a0.date.full.desktop.v1','a0.date.full.mobile.v1']; n+=1
assert [x['fixture_ids'] for x in steps]==[['event.real.8006'],['event.real.8006'],['event.real.8200'],[],['event.real.4240','event.real.8006','event.real.8200'],['event.real.8006'],['event.real.8006']]; n+=1
assert steps[3]['required_states']==['loading','empty','error']; n+=1
# schema negatives
bad=copy.deepcopy(date); del bad['package_manifest']['materialization_entry_point']; invalid(bad,'candidate_adapter'); n+=1
bad=copy.deepcopy(date); bad['promotion_authorized']=True; invalid(bad,'candidate_adapter'); n+=1
bad=copy.deepcopy(date); bad['visual_acceptance']='PASS'; invalid(bad,'candidate_adapter'); n+=1
bad=copy.deepcopy(date); bad['build_contract']['steps'][3]['required_states']=[]; invalid(bad,'candidate_adapter'); n+=1
# semantic negatives
bad=copy.deepcopy(date); bad['build_contract']['steps'][0]['fixture_ids']=['event.real.8200'];
try: verify_adapter(bad)
except AssertionError: n+=1
else: raise AssertionError('changed fixture/order accepted')
bad=copy.deepcopy(date); bad['build_contract']['steps'][0]['projection_sha256']='0'*64
try: verify_adapter(bad)
except AssertionError: n+=1
else: raise AssertionError('changed projection hash accepted')
bad=copy.deepcopy(date); bad['target']['semantic_root_order']=list(reversed(bad['target']['semantic_root_order']))
try: verify_adapter(bad)
except AssertionError: n+=1
else: raise AssertionError('changed semantic root order accepted')
bad=copy.deepcopy(date); bad['source_inputs'].append({'direct_url':'https://design.penpot.app/legacy'})
try: forbid(bad)
except AssertionError: n+=1
else: raise AssertionError('direct URL accepted')
bad=copy.deepcopy(date); bad['target']['legacy']='d87e18f1-dcb4-80a6-8008-8806c5b98101'
try: forbid(bad)
except AssertionError: n+=1
else: raise AssertionError('UUID accepted')
assert n==21,n
print(json.dumps({'status':'PASS','checks_passed':n,'checks_failed':0},separators=(',',':')))
