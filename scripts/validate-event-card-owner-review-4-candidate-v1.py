#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTRACT = ROOT / "catalog/normalization/families/event-preview-representations/event-card-owner-review-4-candidate-v1.json"
RECEIPT = ROOT / "receipts/penpot/event-card-owner-review-4-remediation-v1.json"


def stable(payload: dict) -> str:
    normalized = dict(payload)
    normalized.pop("contract_payload_sha256", None)
    return hashlib.sha256(
        json.dumps(normalized, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()
    ).hexdigest()


contract = json.loads(CONTRACT.read_text())
assert contract["canonical"] is False
assert contract["promotion_status"] == "not_promoted"
assert contract["status"] in {"materialized-awaiting-owner-rereview", "followup-recorded-before-penpot-materialization"}
assert contract["source_baseline"]["exact_commit"] == "7d4b1d32710f60d65c7eb0dbd084d8cad058b5dc"
assert contract["contract_payload_sha256"] == stable(contract)

binding = contract["owner_comment_binding"]
assert binding["observed_file_revn"] == 1212
assert [item["seq"] for item in binding["new_threads"]] == list(range(149, 163))
assert [item["seq"] for item in binding["previously_unattended_threads"]] == [
    27, 31, 64, 70, 74, 88, 90, 91, 92, 93, 94, 95, 97, 132, 133, 145
]
assert all(
    item["status"] in {"materialized-awaiting-owner-rereview", "sot-recorded-pending-followup-materialization"}
    for group in ("new_threads", "previously_unattended_threads")
    for item in binding[group]
)
assert contract["page_contracts"]["large"]["active_review_state_count"] == 11
assert contract["page_contracts"]["rail"]["display_state_labels"].startswith("T01–T16 consecutive")
assert contract["followup_decisions"][0]["id"] == "OR4-F02"
assert contract["followup_decisions"][0]["status"] == "materialized-awaiting-owner-rereview"
assert contract["followup_decisions"][1]["id"] == "OR4-F03"
assert contract["page_contracts"]["exhibition"]["keyboard_keycap"].startswith("linked reusable component")
assert contract["followup_decisions"][1]["status"] == "materialized-awaiting-owner-rereview"
assert contract["followup_decisions"][2]["id"] == "OR4-F04"
assert contract["page_contracts"]["large"]["calendar_action"]["active_states"] == ["rest", "hover", "focus-visible", "pressed", "added"]
assert contract["followup_decisions"][2]["status"] == "materialized-awaiting-owner-rereview"
assert contract["followup_decisions"][3]["id"] == "OR4-F05"
assert contract["page_contracts"]["large"]["not_interested_action"]["active_states"] == ["rest", "hover", "focus-visible", "pressed"]
assert contract["followup_decisions"][3]["status"] == "materialized-awaiting-owner-rereview"
assert contract["followup_decisions"][4]["id"] == "OR4-F06"
assert contract["page_contracts"]["large"]["share_action"]["status_labels"]["busy"] == "Готовим картинку…"
assert contract["page_contracts"]["large"]["share_action"]["background"] == "always transparent"
assert contract["followup_decisions"][4]["status"] == "materialized-awaiting-owner-rereview"
assert contract["followup_decisions"][5]["id"] == "OR4-F07"
assert contract["followup_decisions"][5]["status"] == "materialized-awaiting-owner-rereview"
assert contract["followup_decisions"][6]["id"] == "OR4-F08"
assert contract["followup_decisions"][6]["status"] == "materialized-awaiting-owner-rereview"
assert contract["followup_decisions"][7]["id"] == "OR4-F09"
assert contract["followup_decisions"][7]["status"] == "materialized-awaiting-owner-rereview"
assert contract["followup_decisions"][8]["id"] == "OR4-F10"
assert contract["followup_decisions"][8]["status"] == "materialized-awaiting-owner-rereview"
assert contract["page_contracts"]["large"]["review_layout"].endswith("zero top-level geometric overlaps")
assert contract["page_contracts"]["large"]["like_content_primitive"]["not_an_action_state_machine"] is True
assert contract["page_contracts"]["large"]["like_action"]["active_states"] == ["rest", "hover", "focus-visible", "pressed"]

parity = contract["archetype_visual_parity_gate"]
assert parity["source_screenshot_is_sot"] is False
assert parity["detached_archetype_patch_allowed"] is False
assert parity["unexplained_delta_blocks_archetype"] is True
assert "capture and hash source screenshot" in parity["required_sequence"]
assert "build adjacent reconstruction from linked components only" in parity["required_sequence"]
assert "inspect side-by-side and 50-percent overlay/blink; diff when available" in parity["required_sequence"]
assert contract["page_contracts"]["rail"]["track"].startswith("max-content 112px")
assert contract["page_contracts"]["exhibition"]["keyboard"] == "bordered kbd L/X only on selected row"

receipt = json.loads(RECEIPT.read_text())
assert receipt["readback"]["rail_review_labels"] == [f"T{i:02d}" for i in range(1, 17)]
assert receipt["status"] == "materialized-awaiting-owner-rereview"
assert receipt["file_revn"] == 1212
if contract["status"] == "materialized-awaiting-owner-rereview":
    assert receipt["contract_payload_sha256"] == contract["contract_payload_sha256"]
assert receipt["readback"]["current_file_validate_errors"] == 0
assert receipt["readback"]["variant_errors"] == 0
assert receipt["readback"]["overlay_controls_references_on_page_40_1a"] == 0
assert receipt["readback"]["artifact_mobile_board"]["width"] == 390
assert receipt["readback"]["local_component_count"] == 244
assert receipt["readback"]["exhibition_keyboard_keycap"]["idle_instance_count"] == 0
assert receipt["readback"]["exhibition_keyboard_keycap"]["selected_labels"] == ["L", "X"]
assert receipt["readback"]["calendar_active_states"] == ["rest", "hover", "focus-visible", "pressed", "added"]
assert receipt["readback"]["calendar_disabled_shape_present"] is False
assert receipt["readback"]["not_interested_active_states"] == ["rest", "hover", "focus-visible", "pressed"]
assert receipt["readback"]["not_interested_committed_shape_present"] is False
assert receipt["readback"]["share_action_variant_count"] == 11
assert receipt["readback"]["share_action_nontransparent_root_count"] == 0
assert receipt["readback"]["share_action_variant_errors"] == 0
assert receipt["readback"]["like_action_variant_count"] == 6
assert receipt["readback"]["like_action_busy_error_present"] is False
assert receipt["readback"]["like_action_redundant_selected_state_present"] is False
assert receipt["readback"]["like_action_variant_errors"] == 0
assert receipt["readback"]["like_content_component"]["path"] == "Event cards / Shared / Content"
assert receipt["readback"]["like_content_component"]["axis"] == {"content": ["with-count", "icon-only"]}
assert receipt["readback"]["semantic_gallery_top_level_overlap_count"] == 0
assert receipt["readback"]["page30_review_root_top_level_shape_count"] == 27
assert receipt["readback"]["page30_review_root_top_level_overlap_count"] == 0
assert receipt["readback"]["large_review_root_top_level_shape_count"] == 41
assert receipt["readback"]["large_review_root_top_level_overlap_count"] == 0
assert receipt["readback"]["large_review_duplicate_primary_annotation_present"] is False
assert receipt["readback"]["share_action_transient_labels"] == {"busy": "Готовим картинку…", "shared": "Поделились", "copied": "Ссылка скопирована", "error": "Не удалось"}
assert receipt["persistence"]["named_version_created"] is False
assert receipt["idempotency_readback"]["unintended_component_create_delta"] == 0
assert receipt["idempotency_readback"]["unintended_page_create_delta"] == 0
assert [item["order"] for item in receipt["review_sequence"]] == list(range(1, 8))
assert all(item["url"].startswith("https://design.penpot.app/#/workspace?") for item in receipt["review_sequence"])
assert "owner visual acceptance" in receipt["non_claims"]
assert "Astro reverse integration" in receipt["non_claims"]

print(f"PASS {CONTRACT.relative_to(ROOT)} {contract['contract_payload_sha256']} + {RECEIPT.relative_to(ROOT)} rev{receipt['file_revn']}")
