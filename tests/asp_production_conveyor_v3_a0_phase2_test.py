#!/usr/bin/env python3
from pathlib import Path
import copy, hashlib, json, re
from jsonschema import Draft202012Validator, ValidationError

ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/"catalog/asp-production-conveyor-v3/a0"
def load(name): return json.loads((BASE/name).read_text(encoding="utf-8"))
date=load("date-listing-shell-replay.v1.json")
w1=load("archetype-wave-1.v1.json")
w2=load("archetype-wave-2.v1.json")
idx=load("owner-review-index.v1.json")
defs=load("phase2.schema.json")["$defs"]
def schema(name): return {"$schema":"https://json-schema.org/draft/2020-12/schema","$defs":defs,"$ref":f"#/$defs/{name}"}
def validate(obj,name): Draft202012Validator(schema(name)).validate(obj)
def invalid(obj,name):
    try: validate(obj,name)
    except ValidationError: return
    raise AssertionError("negative case unexpectedly validated")
def canon(o): return json.dumps(o,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()
def sha(o): return hashlib.sha256(canon(o)).hexdigest()
n=0
for obj,name in [(date,"date"),(w1,"wave1"),(w2,"wave2"),(idx,"index")]: validate(obj,name); n+=1
for obj in (date,w1,w2,idx):
    assert sha({k:v for k,v in obj.items() if k!="record_sha256"})==obj["record_sha256"]; n+=1
p=date["projections"]
assert [x["fixture_ids"] for x in p]==[["event.real.4240"],["event.real.8006"],["event.real.8200"]]; n+=1
assert [x["route"] for x in p]==["/segodnya/","/zavtra/","/date-2026-09-06/"]; n+=1
assert len(date["representations"])==7 and date["representations"][4]["fixture_semantics"]=="REFERENCE_ONLY_NOT_ROUTE_MEMBERSHIP"; n+=1
assert w1["count"]==6 and w1["case_count"]==12 and w2["count"]==10 and w2["case_count"]==20; n+=1
a=w1["archetypes"]+w2["archetypes"]
assert len(a)+1==17 and all(len(x["viewports"])==2 for x in a); n+=1
assert all(x["fixture_semantics"] in ("REFERENCE_ONLY_NOT_ROUTE_MEMBERSHIP","NO_EVENT_DATA_REQUIRED") for x in a); n+=1
assert w2["volunteer"]["status"]=="EXCLUDED_NO_FACTUAL_CURRENT_ROUTE_CONTRACT"; n+=1
assert "/legal/:slug/" in w2["archetypes"][8]["explicit_gaps"][0] and "/:unavailable/" in w2["archetypes"][9]["explicit_gaps"][0]; n+=1
assert "/kluby-po-interesam/:slug/" in w2["archetypes"][4]["route_patterns"]; n+=1
assert w1["archetypes"][4]["route_patterns"]==["/podborki/","/podborki/:slug/","/podborki/gastronomiya/"]; n+=1
cols=idx["columns"]; rows=idx["rows"]
assert len(rows)==45 and [r[0] for r in rows]==list(range(1,46)); n+=1
assert len({r[1] for r in rows})==45; n+=1
iv={name:i for i,name in enumerate(cols)}
assert all(r[iv["materialization"]]=="AWAITING_D0_MATERIALIZATION" and r[iv["v0_acceptance"]]=="PENDING" and r[iv["target"]]=="D0_ASSIGNS_NEW_ID" for r in rows); n+=1
uuid=re.compile(r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")
forbidden={"page_id","board_id","component_id","shape_id","direct_url","penpot_uuid"}
def walk(v):
    if isinstance(v,dict):
        for k,x in v.items(): assert k not in forbidden,k; walk(x)
    elif isinstance(v,list):
        for x in v: walk(x)
    elif isinstance(v,str): assert not uuid.fullmatch(v),v
for obj in (date,w1,w2,idx): walk(obj)
n+=1
bad=copy.deepcopy(date); bad["representations"].pop(); invalid(bad,"date"); n+=1
bad=copy.deepcopy(w1); bad["archetypes"].pop(); invalid(bad,"wave1"); n+=1
bad=copy.deepcopy(w2); bad["archetypes"].pop(); invalid(bad,"wave2"); n+=1
bad=copy.deepcopy(idx); bad["rows"].pop(); invalid(bad,"index"); n+=1
assert n==26,n
print(json.dumps({"status":"PASS","checks_passed":n,"checks_failed":0},separators=(",",":")))
