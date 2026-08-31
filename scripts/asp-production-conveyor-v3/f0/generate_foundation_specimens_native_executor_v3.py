#!/usr/bin/env python3
"""Emit the exact Penpot execute_code body with an ACTIVE sole-writer lease."""
from __future__ import annotations
import argparse, json
from pathlib import Path

REPO=Path(__file__).resolve().parents[3]
ADAPTER=REPO/"scripts/asp-production-conveyor-v3/f0/foundation_specimens_native_adapter_v3.js"
PROTECTED_DIGEST="ae6ce7d3627f486399f1f8299690ce7f5eb25b86843a67b7970ffea00ebba2d5"

def main()->int:
 p=argparse.ArgumentParser(); p.add_argument("--run-id",required=True); p.add_argument("--lease-token",required=True); p.add_argument("--cancel-token",required=True); p.add_argument("--protected-digest",required=True); p.add_argument("--output",required=True); a=p.parse_args()
 if not all((a.run_id,a.lease_token,a.cancel_token)): p.error("run/lease/cancel values must be non-empty")
 if a.protected_digest != PROTECTED_DIGEST: p.error("protected digest does not match frozen rev74 projection")
 run={"runId":a.run_id,"leaseToken":a.lease_token,"cancelToken":a.cancel_token,"state":"ACTIVE","cancelled":False,"writer":"/root/publish_r2"}
 run["protectedDigest"]=a.protected_digest
 source=ADAPTER.read_text(encoding="utf-8")
 body=("storage.f0FoundationRunControl="+json.dumps(run,separators=(",",":"))+";\n"+source+"\nreturn await runF0FoundationSpecimensV3({penpot,penpotUtils,storage});\n")
 Path(a.output).write_text(body,encoding="utf-8"); print(json.dumps({"status":"EXECUTOR_READY","output":a.output,"bytes":len(body.encode()),"run_id":a.run_id},sort_keys=True)); return 0
if __name__=="__main__": raise SystemExit(main())
