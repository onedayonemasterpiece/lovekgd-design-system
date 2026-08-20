#!/usr/bin/env python3
"""Fail-closed structural validation for the bounded systemic boundary overlay."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "catalog/normalization/families/event-preview-representations/event-card-systemic-boundaries-candidate-v1.json"
RECEIPT_PATH = ROOT / "receipts/penpot/event-card-systemic-component-remediation-v1.json"


def stable_hash(data: dict) -> str:
    payload = dict(data)
    payload.pop("contract_payload_sha256", None)
    raw = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()
    return hashlib.sha256(raw).hexdigest()


def main() -> None:
    data = json.loads(PATH.read_text())
    assert data["authority_mode"] == "reconstructed"
    assert data["canonical"] is False
    assert data["promotion_status"] == "not_promoted"
    assert data["source_baseline"]["exact_commit"] == "7d4b1d32710f60d65c7eb0dbd084d8cad058b5dc"
    assert stable_hash(data) == data["contract_payload_sha256"]

    semantic = data["semantic_components"]
    for component_id in ("event.social-proof.share", "event.social-proof.like"):
        item = semantic[component_id]
        assert "count text inside component" in item["required_children"]
        assert any("raw count sibling" in rule for rule in item["forbidden"])

    assert semantic["event.action.share"]["composition"] == ["linked event.social-proof.share"]
    assert semantic["event.action.like"]["composition"] == ["linked event.social-proof.like"]
    assert "Medallion" in semantic["event.identity.medallion"]["instance_name_template"]

    slots = data["semantic_slots"]
    assert "not a standalone library component" in slots["event.content.title"]["kind"]
    assert "not a standalone library component" in slots["event.content.location"]["kind"]

    families = data["family_composition"]
    assert set(("event.card", "listing.event-card", "listing.rail-row", "festival.card", "exhibition.row")) <= set(families)
    track = families["listing.rail-row"]["track"]
    viewport = families["listing.rail-row"]["viewport"]
    assert track["width"] == "intrinsic max-content" and track["nowrap"] is True and track["clip"] is False
    assert viewport["clip"] is True and viewport["not_the_track_component"] is True
    assert families["festival.card"]["aggregate_count"].startswith("absent")

    non_claims = set(data["non_claims"])
    assert {"owner visual acceptance", "Astro reverse integration", "production mutation", "family promotion"} <= non_claims

    receipt = json.loads(RECEIPT_PATH.read_text())
    assert receipt["status"] == "ready-for-owner-rereview"
    assert receipt["source"]["ui_commit"] == data["source_baseline"]["exact_commit"]
    assert receipt["source"]["materialized_contract_sha256"] == data["contract_payload_sha256"]
    assert receipt["penpot"]["file_revn_readback"] >= 1034
    assert receipt["penpot"]["validation_issues"] == []
    assert receipt["comment_disposition"]["threads"] == list(range(85, 96))
    assert receipt["comment_disposition"]["all_replied"] is True
    assert receipt["comment_disposition"]["all_left_open_for_owner_visual_acceptance"] is True

    native = receipt["native_components"]
    managed_ids = [
        native["social_proof"]["variant_component_id"],
        native["like_action"]["variant_component_id"],
        native["medallion_consumer"]["component_id"],
        native["reject_action"]["component_id"],
        native["admission"]["component_id"],
    ]
    assert len(managed_ids) == len(set(managed_ids))
    assert native["social_proof"]["member_count"] == 6

    pages = receipt["pages"]
    assert pages["event_card_large"]["readback"]["variants"] == 12
    assert pages["listing_event_card"]["readback"]["loose_social_proof_counts"] == 0
    rail = pages["mobile_rail"]["readback"]
    assert rail["full_track_instances"] == rail["linked_full_track_instances"] == rail["unique_vertical_rows"] == 16
    assert rail["all_tracks_unclipped"] is True and rail["outer_board_clipped"] is False
    assert rail["viewport_width"] == 390 and rail["viewport_patterns_clipped"] is True
    assert pages["festival_card"]["readback"]["aggregate_count_text"] == 0
    assert pages["exhibition_row"]["readback"]["loose_functional_icons"] == 0

    receipt_non_claims = set(receipt["non_claims"])
    assert {"owner visual acceptance", "Astro reverse integration", "production mutation", "family promotion"} <= receipt_non_claims
    print(
        f"PASS {PATH.relative_to(ROOT)} {data['contract_payload_sha256']} "
        f"+ {RECEIPT_PATH.relative_to(ROOT)} rev{receipt['penpot']['file_revn_readback']}"
    )


if __name__ == "__main__":
    main()
