#!/usr/bin/env python3
from __future__ import annotations
import json, pathlib, subprocess, tempfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
CASES=[('canonical',True,'EMF_SCHEMA_REJECTED'),('contract_payload_sha256','0'*64,'EMF_HASH_MISMATCH')]
for field,value,code in CASES:
  with tempfile.TemporaryDirectory() as td:
    t=pathlib.Path(td); (t/'catalog/normalization/event-media').mkdir(parents=True); (t/'contracts/normalization').mkdir(parents=True); (t/'scripts').mkdir()
    doc=json.loads((ROOT/'catalog/normalization/event-media/framing-v2.json').read_text()); doc[field]=value
    (t/'catalog/normalization/event-media/framing-v2.json').write_text(json.dumps(doc))
    (t/'contracts/normalization/event-media-framing-v2.schema.json').write_bytes((ROOT/'contracts/normalization/event-media-framing-v2.schema.json').read_bytes())
    r=subprocess.run(['python3',str(ROOT/'scripts/validate-event-media-framing-v2.py'),'--root',str(t)],capture_output=True,text=True)
    assert r.returncode==1 and code in r.stderr,(field,r.returncode,r.stderr)
print(json.dumps({'status':'valid','negative_cases':len(CASES)}))
