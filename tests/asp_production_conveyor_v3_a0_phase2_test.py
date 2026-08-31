#!/usr/bin/env python3
from pathlib import Path
import copy, hashlib, json, re
from jsonschema import Draft202012Validator, ValidationError

ROOT=Path(__file__).resolve().parents[1]
P=ROOT/"catalog/asp-production-conveyor-v3/a0/phase2-bundle.v1.json"
b=json.loads(P.read_text(encoding="utf-8"))
defs=b["contracts"]["$defs"]

def schema(name): return {"$schema":"https://json-schema.org/draft/2020-12/schema","$defs":defs,"$ref":f"#/$defs/{name}"}
def validate(obj,name): Draft202012Validator(schema(name)).validate(obj)
def invalid(obj,name):
    try: validate(obj,name)
    except ValidationError: return
    raise AssertionError("negative case unexpectedly validated")
def canon(o): return json.dumps(o,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()
def sha(o): return hashlib.sha256(canon(o)).hexdigest()

d=b["date_listing_shell_replay"]; w=b["archetype_waves"]; i=b["owner_review_index"]
n=0
for obj,name in [(d,"date_listing"),(w,"archetype_waves"),(i,"owner_index")]: validate(obj,name); n+=1
assert sha({k:v for k,v in d.items() if k!="record_sha256"})==d["record_sha256"]; n+=1
assert sha({k:v for k,v in w.items() if k!="record_sha256"})==w["record_sha256"]; n+=1
assert sha({k:v for k,v in i.items() if k!="record_sha256"})==i["record_sha256"]; n+=1
p=d["projections"]
assert [x["fixture_ids"] for x in p]==[["event.real.4240"],["event.real.8006"],["event.real.8200"]]; n+=1
assert [x["route"] for x in p]==["/segodnya/","/zavtra/","/date-2026-09-06/"]; n+=1
r=d["representations"]
assert len(r)==7 and r[4]["fixture_semantics"]=="REFERENCE_ONLY_NOT_ROUTE_MEMBERSHIP"; n+=1
w1,w2=w["wave_1"],w["wave_2"]
assert len(w1)==6 and len(w2)==10 and 1+len(w1)+len(w2)==17; n+=1
assert all(len(x["viewports"])==2 for x in w1+w2); n+=1
assert all(x["fixture_semantics"] in ("REFERENCE_ONLY_NOT_ROUTE_MEMBERSHIP","NO_EVENT_DATA_REQUIRED") for x in w1+w2); n+=1
e=i["entries"]
assert len(e)==45 and [x["order"] for x in e]==list(range(1,46)); n+=1
assert len({x["review_key"] for x in e})==45; n+=1
assert all(x["v0_acceptance"]=="PENDING" and x["materialization"]=="AWAITING_D0_MATERIALIZATION" for x in e); n+=1
assert w["volunteer"]["status"]=="EXCLUDED_NO_FACTUAL_CURRENT_ROUTE_CONTRACT"; n+=1
assert "/legal/:slug/" in w2[8]["explicit_gaps"][0] and "/:unavailable/" in w2[9]["explicit_gaps"][0]; n+=1
assert "/kluby-po-interesam/:slug/" in w2[4]["route_patterns"]; n+=1
assert w1[4]["route_patterns"]==["/podborki/","/podborki/:slug/","/podborki/gastronomiya/"]; n+=1
assert w2[9]["route_patterns"]==["/zakrytaya-afisha/"]; n+=1
uuid=re.compile(r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")
forbidden={"page_id","board_id","component_id","shape_id","direct_url","penpot_uuid"}
def walk(v,contracts=False):
    if isinstance(v,dict):
        for k,x in v.items():
            if not contracts: assert k not in forbidden,k
            walk(x,contracts or k=="contracts")
    elif isinstance(v,list):
        for x in v: walk(x,contracts)
    elif isinstance(v,str): assert not uuid.fullmatch(v),v
walk(b); n+=1
bad=copy.deepcopy(d); bad["representations"].pop(); invalid(bad,"date_listing"); n+=1
bad=copy.deepcopy(w); bad["wave_2"].pop(); invalid(bad,"archetype_waves"); n+=1
bad=copy.deepcopy(i); bad["entries"].pop(); invalid(bad,"owner_index"); n+=1
assert n==24,n
print(json.dumps({"status":"PASS","checks_passed":n,"checks_failed":0},separators=(",",":")))
