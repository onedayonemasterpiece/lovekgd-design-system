#!/usr/bin/env python3
from __future__ import annotations
import hashlib, json, pathlib, subprocess, tempfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
def stable(doc):
  payload=dict(doc); payload.pop('contract_payload_sha256',None)
  return hashlib.sha256(json.dumps(payload,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()

CASES=[
  ('canonical',lambda d:d.__setitem__('canonical',True),'EMF_SCHEMA_REJECTED',False),
  ('hash',lambda d:d.__setitem__('contract_payload_sha256','0'*64),'EMF_HASH_MISMATCH',False),
  ('comment-resolution',lambda d:d['owner_comment_constraints'][0].__setitem__('resolved',False),'EMF_COMMENT_STATE_INVALID',True),
  ('normalized-radii',lambda d:d['candidate_normalized_radii_px'].__setitem__('media',15),'EMF_SCHEMA_REJECTED',True),
]
for field,mutate,code,rehash in CASES:
  with tempfile.TemporaryDirectory() as td:
    t=pathlib.Path(td); (t/'catalog/normalization/event-media').mkdir(parents=True); (t/'contracts/normalization').mkdir(parents=True); (t/'scripts').mkdir()
    doc=json.loads((ROOT/'catalog/normalization/event-media/framing-v2.json').read_text()); mutate(doc)
    if rehash: doc['contract_payload_sha256']=stable(doc)
    (t/'catalog/normalization/event-media/framing-v2.json').write_text(json.dumps(doc))
    (t/'contracts/normalization/event-media-framing-v2.schema.json').write_bytes((ROOT/'contracts/normalization/event-media-framing-v2.schema.json').read_bytes())
    r=subprocess.run(['python3',str(ROOT/'scripts/validate-event-media-framing-v2.py'),'--root',str(t)],capture_output=True,text=True)
    assert r.returncode==1 and code in r.stderr,(field,r.returncode,r.stderr)
print(json.dumps({'status':'valid','negative_cases':len(CASES)}))
