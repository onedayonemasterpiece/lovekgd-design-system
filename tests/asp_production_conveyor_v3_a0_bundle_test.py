#!/usr/bin/env python3
from pathlib import Path
import copy, hashlib, json, re, sys
from jsonschema import Draft202012Validator, ValidationError

ROOT=Path(__file__).resolve().parents[1]
BUNDLE=ROOT/"catalog/asp-production-conveyor-v3/a0/production-bundle.v1.json"
b=json.loads(BUNDLE.read_text(encoding="utf-8"))
defs=b["contracts"]["$defs"]

def schema(name): return {"$schema":"https://json-schema.org/draft/2020-12/schema","$defs":defs,"$ref":f"#/$defs/{name}"}
def validate(obj,name): Draft202012Validator(schema(name)).validate(obj)
def invalid(obj,name):
    try: validate(obj,name)
    except ValidationError: return
    raise AssertionError("negative case unexpectedly validated")
def canon(o): return json.dumps(o,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()
def sha(o): return hashlib.sha256(canon(o)).hexdigest()
def forbid(v):
    keys={"page_id","board_id","component_id","shape_id","direct_url","penpot_uuid"}
    uuid=re.compile(r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")
    if isinstance(v,dict):
        for k,x in v.items(): assert k not in keys,k; forbid(x)
    elif isinstance(v,list):
        for x in v: forbid(x)
    elif isinstance(v,str): assert not uuid.fullmatch(v),v

n=0
c=b["golden_event_corpus_corrections"]; validate(c,"correction"); n+=1
p=b["free_route_projection"]; validate(p,"projection"); n+=1
s=b["free_route_state_packets"]; validate(s,"state_packets"); n+=1
for pkg in b["packages"]: validate(pkg,"package_ready_v3"); forbid(pkg); n+=1
assert sha(c["corrections"][0]["event"])==c["corrections"][0]["source"]["observed_record_sha256"]; n+=1
core={k:v for k,v in c["corrections"][0].items() if k!="correction_record_sha256"}
assert sha(core)==c["corrections"][0]["correction_record_sha256"]; n+=1
assert sha({k:v for k,v in p.items() if k!="projection_record_sha256"})==p["projection_record_sha256"]; n+=1
assert sha({k:v for k,v in s.items() if k!="state_packet_sha256"})==s["state_packet_sha256"]; n+=1
order=["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"]
assert p["fixture_order"]==order; n+=1
assert p["sections"][0]["fixtures"]==["event.real.8006","event.real.8200"] and p["sections"][0]["count"]==2; n+=1
assert p["sections"][1]["fixtures"]==["event.real.2182","event.real.6711","event.real.7609"] and p["sections"][1]["count"]==3; n+=1
assert {(x["viewport"]["id"],x["scroll_state"]) for x in s["scenarios"]}=={("desktop","top"),("desktop","scrolled"),("desktop","full"),("mobile","top"),("mobile","scrolled"),("mobile","full")}; n+=1
bad=copy.deepcopy(c); del bad["corrections"][0]["event"]["end_date"]; invalid(bad,"correction"); n+=1
bad=copy.deepcopy(c); bad["corrections"][0]["event"]["venue_name"]="Wrong"; invalid(bad,"correction"); n+=1
bad=copy.deepcopy(p); bad["corpus"]["sha256"]="0"*64; invalid(bad,"projection"); n+=1
bad=copy.deepcopy(p); bad["canonical_projection"]["sha256"]="0"*64; invalid(bad,"projection"); n+=1
bad=copy.deepcopy(p); bad["fixture_order"]=list(reversed(order)); invalid(bad,"projection"); n+=1
bad=copy.deepcopy(p); bad["sections"][0]["fixtures"]=["event.real.2182","event.real.8200"]; assert bad["sections"][0]["fixtures"]!=["event.real.8006","event.real.8200"]; n+=1
bad=copy.deepcopy(b["packages"][0]); del bad["materialization_entry_point"]; invalid(bad,"package_ready_v3"); n+=1
bad=copy.deepcopy(b["packages"][0]); bad["target_penpot_page"]="d87e18f1-dcb4-80a6-8008-8806c5b98101"; invalid(bad,"package_ready_v3"); n+=1
bad=copy.deepcopy(b["packages"][0]); bad["source_and_donor_lineage"].append({"direct_url":"https://design.penpot.app/legacy"})
try: forbid(bad)
except AssertionError: n+=1
else: raise AssertionError("legacy direct_url not detected")
assert n==24,n
print(json.dumps({"status":"PASS","checks_passed":n,"checks_failed":0},separators=(",",":")))
