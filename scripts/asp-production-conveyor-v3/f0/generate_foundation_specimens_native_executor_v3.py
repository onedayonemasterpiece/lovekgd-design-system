#!/usr/bin/env python3
"""Emit the immutable Penpot execute_code body; never fabricates run/lease state."""
from __future__ import annotations
import argparse, hashlib, json
from pathlib import Path

REPO=Path(__file__).resolve().parents[3]
ADAPTER=REPO/"scripts/asp-production-conveyor-v3/f0/foundation_specimens_native_adapter_v3.js"

def main()->int:
 p=argparse.ArgumentParser(); p.add_argument("--output",required=True); a=p.parse_args()
 source=ADAPTER.read_text(encoding="utf-8")
 body=source+"\nreturn await runF0FoundationSpecimensV3({penpot,storage});\n"
 Path(a.output).write_text(body,encoding="utf-8")
 print(json.dumps({"status":"EXECUTOR_READY","adapter_revision":"R3.2","output":a.output,"bytes":len(body.encode()),"sha256":hashlib.sha256(body.encode()).hexdigest(),"run_id":"974e8f09-353c-49ca-b19d-982b973e939c","protected_projection_mode":"SAME_RUN_PROBE_THEN_EXECUTE","protected_baseline_revision":79,"requires_authoritative_native_run":True,"requires_preinstalled_lease_receipt":True},sort_keys=True)); return 0
if __name__=="__main__": raise SystemExit(main())
