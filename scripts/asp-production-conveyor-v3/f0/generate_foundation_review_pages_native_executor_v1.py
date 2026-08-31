#!/usr/bin/env python3
import argparse,hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
BASE=Path(__file__).with_name("foundation_specimens_native_adapter_v3.js")
ADAPTER=Path(__file__).with_name("foundation_review_pages_native_adapter_v1.js")
def main():
 p=argparse.ArgumentParser();p.add_argument("--output",required=True);a=p.parse_args()
 body=BASE.read_text()+"\n"+ADAPTER.read_text()+"\nreturn await runF0FoundationReviewPagesV1({penpot,storage});\n"
 Path(a.output).write_text(body)
 print(json.dumps({"status":"EXECUTOR_READY","adapter_revision":"R1.2","package_id":"F-FOUNDATIONS-PAGE-SPLIT-B2","output":a.output,"bytes":len(body.encode()),"sha256":hashlib.sha256(body.encode()).hexdigest(),"run_id":"974e8f09-353c-49ca-b19d-982b973e939c","source_adapter_commit":"dd2981880e2c34c19e3834b36f4f766e2c82a559","contract_id":"kenigevents.asp-conformance","contract_version":"1.1.0","contract_sha256":"54002c01430d48d836af491a09f493526c309e0779c2c6f0deedbf434975cf72","source_projection_mode":"ARRAY_WRAPPED_SINGLE_ROOT","source_baseline_revision":113,"page_count":4,"instance_count":57,"max_instances_per_page":30,"max_mutations_per_call":3,"requires_authoritative_native_run":True,"requires_preinstalled_provenance":True},sort_keys=True));return 0
if __name__=="__main__":raise SystemExit(main())
