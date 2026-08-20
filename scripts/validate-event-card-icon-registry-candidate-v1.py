#!/usr/bin/env python3
from __future__ import annotations
import argparse, hashlib, json, pathlib, re, sys
from jsonschema import Draft202012Validator

REG="catalog/normalization/iconography/event-card-icon-registry-candidate-v1.json"
SCHEMA="contracts/normalization/event-card-icon-registry-candidate.v1.schema.json"
UUID=re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$")

def fail(code,path,msg):
 print(json.dumps({"status":"rejected","error":{"code":code,"path":path,"diagnostic":msg}},sort_keys=True),file=sys.stderr); raise SystemExit(1)

def main():
 ap=argparse.ArgumentParser(); ap.add_argument("--root",default="."); ap.add_argument("--require-penpot",action="store_true"); a=ap.parse_args(); root=pathlib.Path(a.root).resolve()
 d=json.loads((root/REG).read_text()); schema=json.loads((root/SCHEMA).read_text()); Draft202012Validator.check_schema(schema)
 errors=sorted(Draft202012Validator(schema).iter_errors(d),key=lambda e:list(e.absolute_path))
 if errors: e=errors[0]; fail("ECI_SCHEMA",REG+"/"+"/".join(map(str,e.absolute_path)),e.message)
 clone=dict(d); clone.pop("contract_payload_sha256",None); expected=hashlib.sha256(json.dumps(clone,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()
 if d["contract_payload_sha256"]!=expected: fail("ECI_HASH","/contract_payload_sha256",f"expected {expected}")
 if d["source_baseline"]["exact_commit"]!="a68c7f23c4e014c6e9f66e95f394656e9cb0f411": fail("ECI_SOURCE","/source_baseline/exact_commit","exact Astro baseline required")
 ids=[x["icon_id"] for x in d["icons"]]; names=[x["penpot_name"] for x in d["icons"]]
 if len(ids)!=24 or len(set(ids))!=24 or len(set(names))!=24: fail("ECI_COUNT","/icons","24 unique source-proven event-card icons required")
 required={"icon.ui.heart","icon.ui.comment","icon.ui.calendar","icon.ui.dislike","icon.ui.share","icon.ui.ticket","icon.ui.spark","icon.ui.info","icon.product.rail-arrow-right","icon.status.amber-found-check"}
 if not required.issubset(ids): fail("ECI_REQUIRED","/icons","required event-card UI/product/status icons missing")
 if sum(x["icon_id"].startswith("icon.editorial.festival.") for x in d["icons"])!=14: fail("ECI_FESTIVAL","/icons","all 14 festival category assets required")
 if a.require_penpot:
  p=d["penpot_collection"]
  if p.get("status")!="materialized-readback" or not UUID.fullmatch(str(p.get("page_id",""))): fail("ECI_PENPOT","/penpot_collection","Page25 readback required")
  for i,x in enumerate(d["icons"]):
   b=x.get("penpot_binding",{})
   if b.get("status")!="materialized-readback" or not UUID.fullmatch(str(b.get("component_id",""))): fail("ECI_COMPONENT",f"/icons/{i}/penpot_binding","linked native icon component required")
 print(json.dumps({"status":"valid","icons":len(ids),"hash":expected,"penpot_required":a.require_penpot},indent=2))

if __name__=="__main__": main()
