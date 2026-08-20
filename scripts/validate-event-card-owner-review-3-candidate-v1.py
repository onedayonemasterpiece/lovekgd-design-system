#!/usr/bin/env python3
from __future__ import annotations
import hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
PATH=ROOT/'catalog/normalization/families/event-preview-representations/event-card-owner-review-3-candidate-v1.json'
def stable(d):
 p=dict(d);p.pop('contract_payload_sha256',None)
 return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
d=json.loads(PATH.read_text())
assert d['canonical'] is False and d['promotion_status']=='not_promoted'
assert d['status']=='materialized-awaiting-owner-rereview'
assert d['source_baseline']['exact_commit']=='7d4b1d32710f60d65c7eb0dbd084d8cad058b5dc'
assert d['contract_payload_sha256']==stable(d)
b=d['owner_comment_binding']; assert b['thread_range']==[126,148] and b['thread_count']==23
assert [x['seq'] for x in b['threads']]==list(range(126,149)); assert len({x['thread_id'] for x in b['threads']})==23
assert b['duplicate_threads']==[[137,138]]; assert b['materialized_file_revn']==1131
assert all(x['status']=='materialized-awaiting-owner-rereview' for x in b['threads']+b['reopened_threads'])
assert [x['seq'] for x in b['reopened_threads']]==[99,100,103,104,107,108,114,117,119,120]
c=d['component_contracts']; assert c['calendar']['event_card_order']==['icon','label']; assert c['calendar']['event_card_icon_only'] is False
assert c['like_with_count']['passive_listing_proof_separate'] is True
assert c['mobile_rail']['order'][-1]=='optional research artifact'; assert c['mobile_rail']['cue'].endswith('#8a7f76')
assert c['medallions']['pushkin']['overflow']=='visible'; assert c['medallions']['tiers']['compact44']['artwork']==36
assert 'broad patch rectangle covering donor content' in d['page_organization']['forbidden']
print(f"PASS {PATH.relative_to(ROOT)} {d['contract_payload_sha256']}")
