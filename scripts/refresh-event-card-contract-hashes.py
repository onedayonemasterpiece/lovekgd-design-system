#!/usr/bin/env python3
"""Refresh deterministic joins after an intentional event-card SoT edit."""
from __future__ import annotations
import hashlib, json, pathlib

ROOT=pathlib.Path(__file__).resolve().parents[1]
T=ROOT/'catalog/normalization/families/event-preview-representations/event-card-taxonomy-candidate-v1.json'
M=ROOT/'catalog/normalization/families/event-preview-representations/screenshot-consumer-bindings-v1.json'
V=ROOT/'catalog/normalization/families/event-preview-representations/event-card-visual-spec-candidate-v1.json'
I=ROOT/'catalog/normalization/iconography/event-card-icon-registry-candidate-v1.json'
MED=ROOT/'catalog/normalization/families/event-preview-representations/event-medallion-candidate-v1.json'
ART=ROOT/'catalog/normalization/families/event-preview-representations/event-artifact-candidate-v1.json'

def load(p): return json.loads(p.read_text())
def dump(p,d): p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def stable(d):
 c=dict(d); c.pop('contract_payload_sha256',None)
 return hashlib.sha256(json.dumps(c,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()

def main():
 t,m,v,i,med,art=map(load,(T,M,V,I,MED,ART))
 t['package_bindings']['iconography']['contract_payload_sha256']=i['contract_payload_sha256']
 t['package_bindings']['iconography']['required_icon_count']=len(i['icons'])
 t['package_bindings']['medallions']['contract_payload_sha256']=med['contract_payload_sha256']
 t['package_bindings']['artifacts']['contract_payload_sha256']=art['contract_payload_sha256']
 for c in t['components']:
  c['icon_registry_binding']['contract_payload_sha256']=i['contract_payload_sha256']
 h=stable(t);t['contract_payload_sha256']=h
 m['contract_payload_sha256']=h;m['contract_version']=t['contract_version']
 v['source']['commit']=t['source_baseline']['exact_commit'];v['contract_binding']['contract_payload_sha256']=h;v['contract_binding']['expected_native_state_count']=sum(len(c['valid_combinations']) for c in t['components'])
 dump(T,t);dump(M,m);dump(V,v)
 print(h)

if __name__=='__main__': main()
