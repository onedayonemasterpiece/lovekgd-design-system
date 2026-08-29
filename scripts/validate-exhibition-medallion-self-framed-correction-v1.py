#!/usr/bin/env python3
import hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
C=ROOT/'catalog/normalization/families/event-preview-representations/exhibition-medallion-self-framed-correction-v1.json'
R=ROOT/'receipts/penpot/exhibition-medallion-self-framed-remediation-v1.json'
def stable(d):
 p=dict(d);p.pop('contract_payload_sha256',None)
 return hashlib.sha256(json.dumps(p,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
c=json.loads(C.read_text());r=json.loads(R.read_text())
assert c['contract_payload_sha256']==stable(c)
assert c['asset_anatomy']['synthetic_inner_ring']=='forbidden'
assert c['asset_anatomy']['penpot_artwork_master']['primary_asset_px']==[88,88]
assert c['consumer_geometry']['normalized_frame']['tiers_px']=={'compact44':44,'standard60':60,'feature88':88}
e=c['consumer_geometry']['exhibition_overlay44'];assert e['outer_slot_px']==[44,44] and e['consumer_stroke_px']==1 and e['linked_artwork_px']==[42,42] and e['linked_artwork_inset_px']==[1,1]
assert c['penpot_materialization']['artwork_masters_corrected']==41
assert c['penpot_materialization']['bad_exhibition_component_main_instances_after_readback']==0
assert r['contract']['sha256']==c['contract_payload_sha256']
assert r['propagation_readback']['bad_medallion_component_main_instances_on_page_40_5']==0
assert r['overall_card_family_status']=='unfinished'
print(f"PASS {C.relative_to(ROOT)} {c['contract_payload_sha256']}")
