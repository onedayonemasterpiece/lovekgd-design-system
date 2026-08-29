#!/usr/bin/env python3
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTRACT = ROOT / "catalog/normalization/families/event-preview-representations/event-card-large-mobile-390-framing-correction-v1.json"
CASE = ROOT / "catalog/fixtures/ui-reference-events/v1/cases/event-card-large-landscape-crop-safe-7906-mobile-390.case.json"
RESOLVED = ROOT / "catalog/fixtures/ui-reference-events/v1/cases/resolved/event-card-large-landscape-crop-safe-7906-mobile-390.resolved-render-case.json"
RECEIPT = ROOT / "receipts/penpot/event-card-large-mobile-390-materialization-v1.json"
TELEGRAM = ROOT / "receipts/ui-conformance/incremental-event-components-20260822/telegram/event-card-large-7906-mobile-390.json"


def stable_contract(value):
    payload = dict(value)
    payload.pop("contract_payload_sha256", None)
    return hashlib.sha256(
        json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()
    ).hexdigest()


def stable_resolved(value):
    payload = dict(value)
    payload.pop("resolved_render_case_sha256", None)
    canonical = json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(f"{canonical}\n".encode()).hexdigest()


contract = json.loads(CONTRACT.read_text())
case = json.loads(CASE.read_text())
resolved = json.loads(RESOLVED.read_text())
receipt = json.loads(RECEIPT.read_text())
telegram = json.loads(TELEGRAM.read_text())

assert contract["contract_payload_sha256"] == stable_contract(contract)
assert contract["framing_policy"]["visual_landscape"]["frame"] == "5:4"
assert contract["framing_policy"]["ocr_or_document"]["blanket_5x4_or_4x5"] == "forbidden"
assert contract["astro_capture"]["media_ratio"] == 1.25
assert contract["astro_capture"]["media_shell_px"] == [388, 310.390625]
assert contract["penpot_materialization"]["component_root_px"] == [390, 519.828125]
assert contract["component_graph_rule"]["terminal_geometry_patch"] == "forbidden"
assert contract["overall_card_family_status"] == "unfinished"

assert case["contract_sha256"] == contract["contract_payload_sha256"]
assert case["penpot_binding"]["binding_status"] == "bound"
assert case["penpot_binding"]["page_label"] == "Page 40.1c"
assert case["penpot_binding"]["board_or_component_id"] == contract["penpot_materialization"]["review_board_id"]
assert case["penpot_binding"]["export_sha256"] == contract["visual_evidence"]["penpot_export_sha256"]

assert resolved["resolved_render_case_sha256"] == stable_resolved(resolved)
assert case["resolved_render_case_sha256"] == resolved["resolved_render_case_sha256"]
assert resolved["contract_sha256"] == contract["contract_payload_sha256"]
geometry = resolved["resolved_media"]["frame_geometry"]
assert geometry["content_width"] == 388
assert geometry["content_height"] == 310.4
assert resolved["resolved_media"]["fit"] == "cover"

assert receipt["contract"]["sha256"] == contract["contract_payload_sha256"]
assert receipt["resolver_correction"]["commit"] == "1587a70b74d29e70308334f709f0f9f8fb6cf659"
assert receipt["penpot_readback"]["terminal_card_override"] is False
assert receipt["penpot_readback"]["penpot_validation_errors"] == 0
assert receipt["overall_card_family_status"] == "unfinished"
assert telegram["message_id"] == 1071
assert telegram["read_back_status"] == "verified"
assert telegram["telegram_media_metadata"]["caption_exact"] is True

print(f"PASS {CONTRACT.relative_to(ROOT)} {contract['contract_payload_sha256']}")
