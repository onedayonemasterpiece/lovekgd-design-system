#!/usr/bin/env python3
from __future__ import annotations
import argparse, hashlib, json, pathlib, sys
from jsonschema import Draft202012Validator

def fail(code, path, diagnostic):
    print(json.dumps({"status":"rejected","error":{"code":code,"path":path,"diagnostic":diagnostic}}, sort_keys=True), file=sys.stderr)
    raise SystemExit(1)

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--root', default='.'); args=ap.parse_args()
    root=pathlib.Path(args.root).resolve()
    cp=root/'catalog/normalization/event-media/framing-v2.json'
    sp=root/'contracts/normalization/event-media-framing-v2.schema.json'
    doc=json.loads(cp.read_text()); schema=json.loads(sp.read_text())
    Draft202012Validator.check_schema(schema)
    errors=sorted(Draft202012Validator(schema).iter_errors(doc), key=lambda e:list(e.absolute_path))
    if errors:
        e=errors[0]; fail('EMF_SCHEMA_REJECTED','/'+ '/'.join(map(str,e.absolute_path)),e.message)
    payload=dict(doc); actual=payload.pop('contract_payload_sha256')
    expected=hashlib.sha256(json.dumps(payload,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
    if actual != expected: fail('EMF_HASH_MISMATCH','/contract_payload_sha256',f'expected {expected}, got {actual}')
    ids={x['id'] for x in doc['consumer_owned_slots']}
    required={'desktop_base','mobile_default','related_rail','large_portrait','site_wide','ocr_bounded'}
    if ids != required: fail('EMF_SLOT_SET_INVALID','/consumer_owned_slots',f'expected {sorted(required)}, got {sorted(ids)}')
    comments={x['penpot_seq_number']:x for x in doc['owner_comment_constraints']}
    if set(comments)!={11,12,13} or any(not x['resolved'] for x in comments.values()): fail('EMF_COMMENT_STATE_INVALID','/owner_comment_constraints','threads 11, 12 and 13 must be recorded with explicit resolved dispositions after Penpot and Git match')
    target=doc['candidate_normalized_radii_px']
    if (target['media'],target['card'],target['enclosing_container']) != (16,24,28): fail('EMF_NORMALIZED_RADII_INVALID','/candidate_normalized_radii_px','expected media/card/enclosing = 16/24/28')
    forbidden=('production-v1','PROMOTED','SOURCE OF TRUTH','verified implementation')
    raw=cp.read_text()
    if any(x in raw for x in forbidden): fail('EMF_FORBIDDEN_CLAIM','/', 'candidate framing contains a forbidden promotion/implementation claim')
    print(json.dumps({'status':'valid','contract':str(cp.relative_to(root)),'contract_payload_sha256':actual,'slots':len(ids),'comments_resolved':[11,12,13]},indent=2))
if __name__=='__main__': main()
