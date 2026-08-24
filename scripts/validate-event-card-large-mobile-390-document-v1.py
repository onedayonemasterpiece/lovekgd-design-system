#!/usr/bin/env python3
import hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
CASE=ROOT/'catalog/fixtures/ui-reference-events/v1/cases/event-card-large-ocr-protected-4327-mobile-390.case.json'
RESOLVED=ROOT/'catalog/fixtures/ui-reference-events/v1/cases/resolved/event-card-large-ocr-protected-4327-mobile-390.resolved-render-case.json'
RECEIPT=ROOT/'receipts/penpot/event-card-large-mobile-390-document-materialization-v1.json'
TELEGRAM=ROOT/'receipts/ui-conformance/incremental-event-components-20260822/telegram/event-card-large-4327-mobile-390.json'
def stable_resolved(v):
 p=dict(v);p.pop('resolved_render_case_sha256',None)
 c=json.dumps(p,sort_keys=True,separators=(',',':'),ensure_ascii=False)
 return hashlib.sha256(f'{c}\n'.encode()).hexdigest()
case=json.loads(CASE.read_text());resolved=json.loads(RESOLVED.read_text());receipt=json.loads(RECEIPT.read_text());telegram=json.loads(TELEGRAM.read_text())
assert case['penpot_binding']['binding_status']=='bound'
assert case['penpot_binding']['board_or_component_id']==receipt['review_board_id']
assert case['penpot_binding']['export_sha256']==receipt['comparison']['penpot_export_sha256']
assert resolved['resolved_render_case_sha256']==stable_resolved(resolved)
assert case['resolved_render_case_sha256']==resolved['resolved_render_case_sha256']
g=resolved['resolved_media']['frame_geometry']
assert g['content_width']==388 and g['content_height']==258.565625
assert g['intrinsic_width']==1280 and g['intrinsic_height']==853
assert resolved['resolved_media']['fit']=='contain'
assert resolved['resolved_visibility']['calendar'] is False
assert receipt['astro_readback']['calendar_nodes']==0
assert receipt['penpot_readback']['calendar_shapes']==0
assert receipt['penpot_readback']['terminal_card_override'] is False
assert receipt['penpot_readback']['detached_nested_boards']==0
assert receipt['penpot_readback']['penpot_validation_errors']==0
assert receipt['penpot_readback']['media_component']['linked_instance'] is True
assert receipt['penpot_readback']['place_component']['linked_instance'] is True
assert receipt['overall_card_family_status']=='unfinished'
assert telegram['message_id']==1072 and telegram['read_back_status']=='verified'
assert telegram['telegram_media_metadata']['caption_exact'] is True
assert telegram['telegram_media_metadata']['reply_to_message_id']==1030
print(f'PASS {CASE.relative_to(ROOT)} {resolved["resolved_render_case_sha256"]}')
