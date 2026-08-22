#!/usr/bin/env python3
"""Fail-closed structural validation for the bounded systemic boundary overlay."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "catalog/normalization/families/event-preview-representations/event-card-systemic-boundaries-candidate-v1.json"
RECEIPT_PATH = ROOT / "receipts/penpot/event-card-systemic-component-remediation-v1.json"
AUTHORITY_RECEIPT_PATH = ROOT / "receipts/normalization/exhibition-slider-astro-authority-v1.json"
LISTING_RECEIPT_PATH = ROOT / "receipts/penpot/listing-event-card-source-geometry-remediation-v1.json"
RAIL_RECEIPT_PATH = ROOT / "receipts/penpot/mobile-listing-rail-systemic-remediation-v1.json"
FESTIVAL_RECEIPT_PATH = ROOT / "receipts/penpot/festival-card-architecture-audit-v1.json"
EXHIBITION_RECEIPT_PATH = ROOT / "receipts/penpot/exhibition-row-outer-surface-remediation-v1.json"
EXCEPTION_REGISTRY_PATH = ROOT / "catalog/ui-conformance/exception-registry.v1.json"


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
    rail_readback = families["listing.rail-row"]["penpot_readback"]
    assert rail_readback["track_horizontal_sizing"] == "auto"
    assert rail_readback["track_wrap"] == "nowrap" and rail_readback["track_clip"] is False
    assert rail_readback["composition_proof_count"] == 16
    assert rail_readback["composition_proofs_are_component_instances"] is False
    assert rail_readback["viewport_variant_axis"] == {"state": [f"T{i:02d}" for i in range(1, 17)]}
    assert rail_readback["validation_issues"] == []
    listing = families["listing.event-card"]
    listing_layout = listing["layout_contract"]
    assert listing_layout["visual_gap_px"] == 4
    assert listing_layout["tail_width_px"] == {
        "none": 0,
        "proof-only": 40,
        "compact-identity-or-proof": 64,
        "split-three-identities-plus-proof": 100,
    }
    assert listing_layout["social_proof_rail"] == {
        "width_px": 36,
        "min_height_px": 24,
        "row_gap_px": 4,
        "vertical_alignment": "media bottom",
        "padding_px": 0,
    }
    assert listing_layout["desktop_overlay_medallion"] == {
        "tier": "standard60",
        "diameter_px": 60,
        "right_px": 10,
        "bottom_px": 10,
    }
    assert listing["penpot_readback"]["detached_review_root_count"] == 0
    assert listing["penpot_readback"]["validation_issues"] == []
    listing_same_data = listing["penpot_readback"]["same_data_conformance"]
    assert listing_same_data["status"] == "instrumental-pass-render-export-gateway-blocked"
    assert listing_same_data["fixture_id"] == "event.real.3132"
    assert listing_same_data["preview_event_sha256"] == (
        "3b722cf9514969274be612bb6341db52d0b83d2d93f322b1c9e992aeb2596818"
    )
    assert listing_same_data["resolved_content_equal"] is True
    assert listing_same_data["media_bytes_equal"] is True
    assert listing_same_data["root_geometry_px"] == {
        "astro": [420, 279.797],
        "penpot_master": [420, 279.797],
        "penpot_linked_review": [420, 279.797],
    }
    assert listing_same_data["like_count_inside_component"] is True
    assert listing_same_data["share_state"] == "absent-at-master"
    assert listing_same_data["title_and_place_separate_parent_owned_slots"] is True
    assert listing_same_data["terminal_instance_geometry_overrides"] == 0
    festival = families["festival.card"]
    assert festival["aggregate_count"].startswith("absent")
    assert festival["source_contract"]["favorite"]["count"] == "absent"
    assert festival["component_boundary"]["source_skeleton_role"].startswith("evidence only")
    assert "fixture-specific geometry patches on review instances" in festival["component_boundary"]["forbidden"]
    assert festival["penpot_audit"]["variant_count"] == 9
    assert festival["penpot_audit"]["linked_review_instance_count"] == 9
    assert festival["penpot_audit"]["detached_review_root_count"] == 0
    assert festival["penpot_audit"]["masters_with_evidence_skeleton_dependency"] == 0
    assert festival["penpot_audit"]["masters_with_duplicate_category_icon"] == 0
    assert festival["penpot_audit"]["wide_master_with_duplicate_raw_meta_layers"] == 0
    assert festival["penpot_audit"]["meta_hug_readback"]["status"] == (
        "pass-exact-source-fixture-geometry"
    )
    favorite = festival["penpot_audit"]["favorite_action_variant_set"]
    assert favorite["path"] == "Event cards / Festival / Action / Favorite"
    assert favorite["variant_count"] == 5 and favorite["variant_errors"] == 0
    assert len(favorite["component_ids"]) == len(set(favorite["component_ids"])) == 5
    assert favorite["aggregate_count"] == "absent"
    assert festival["penpot_audit"]["materializer_idempotency"] == {
        "rerun_master_count": 9,
        "favorite_instances_created_on_rerun": 0,
        "pass": True,
    }
    assert festival["penpot_audit"]["file_validation_issues"] == []
    assert festival["penpot_audit"]["remediation_status"] == (
        "readback-pass-same-data-visual-conformance-pass-with-engine-limits"
    )
    festival_same_data = festival["penpot_audit"]["same_data_conformance"]
    assert festival_same_data["fixture"] == "festival.more-vnutri"
    assert festival_same_data["root_geometry_px"] == {
        "astro": [263.469, 277.719],
        "penpot": [263.469, 277.719],
    }
    assert festival_same_data["resolved_content_equal"] is True
    assert festival_same_data["media_source_equal"] is True
    assert festival_same_data["terminal_instance_geometry_overrides"] == 0
    exhibition = families["exhibition.row"]
    authority = exhibition["authority_exception"]
    guard = exhibition["reverse_generation_guard"]
    assert authority["region"] == guard["protected_region"] == "media_deck.slider"
    assert authority["implementation_authority"] == "astro-reference"
    assert authority["penpot_role"] == "linked-static-checkpoint-only"
    assert guard["direction"] == "penpot-to-sot-to-astro"
    assert guard["policy"] == "preserve-source-no-overwrite"
    assert {"[data-deck]", "[data-deck-frame]", "[data-deck-cursor]", "[data-deck-phase]"} <= set(authority["protected_source_selectors"])
    assert len(authority["protected_source_paths"]) == 2
    exhibition_readback = exhibition["penpot_readback"]
    assert exhibition_readback["variant_count"] == 7
    assert exhibition_readback["variant_errors"] == 0
    assert exhibition_readback["linked_review_root_count"] == 8
    assert exhibition_readback["detached_review_root_count"] == 0
    assert exhibition_readback["evidence_skeleton_descendant_count"] == 0
    assert exhibition_readback["loose_functional_icon_count"] == 0
    assert exhibition_readback["deprecated_medallion_wrapper_count"] == 0
    assert exhibition_readback["semantic_components"]["share_proof"]["count_inside"] is True
    assert exhibition_readback["semantic_components"]["like_with_count"]["count_inside"] is True
    assert len(exhibition_readback["protected_slider_shape_ids_unchanged"]) == 8
    assert exhibition_readback["materializer_idempotency"] == {
        "rerun_master_count": 7,
        "created_on_rerun": 0,
        "deleted_on_rerun": 0,
        "pass": True,
    }
    assert exhibition_readback["file_validation_issues"] == []
    assert exhibition_readback["remediation_status"] == (
        "outer-surface-same-data-instrumental-pass-slider-protected-visual-export-gateway-blocked"
    )
    exhibition_same_data = exhibition_readback["same_data_conformance"]
    assert exhibition_same_data["fixture_event_id"] == "4240"
    assert exhibition_same_data["resolved_content_equal"] is True
    assert exhibition_same_data["root_geometry_px"] == {
        "astro": [1194, 132.531],
        "penpot_master": [1194, 132.531],
        "penpot_linked_review": [1194, 132.531],
    }
    assert exhibition_same_data["outer_regions_geometry_equal"] is True
    assert exhibition_same_data["like_count_inside_component"] is True
    assert exhibition_same_data["terminal_instance_geometry_overrides"] == 0
    assert exhibition_same_data["protected_region"] == "media_deck.slider"
    assert exhibition_same_data["protected_evidence_mask_descendant_count"] == 4
    assert exhibition_readback["linked_same_data_evidence_root_count"] == 1
    assert exhibition_readback["same_data_evidence_idempotency"] == {
        "board_count": 1,
        "linked_evidence_root_count": 1,
        "created_on_rerun": 0,
        "pass": True,
    }

    non_claims = set(data["non_claims"])
    assert {"owner visual acceptance", "Astro reverse integration", "production mutation", "family promotion"} <= non_claims

    receipt = json.loads(RECEIPT_PATH.read_text())
    assert receipt["status"] == "ready-for-owner-rereview"
    assert receipt["source"]["ui_commit"] == data["source_baseline"]["exact_commit"]
    assert receipt["source"]["materialized_contract_sha256"] == data["penpot_reconciliation"]["materialization_receipt_contract_sha256"]
    assert data["supersedes_contract_payload_sha256"] == receipt["source"]["materialized_contract_sha256"]
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
    # This older receipt preserved the original claim that all 16 proof roots were
    # linked Track instances. The bounded rail read-back below corrects that claim:
    # they are composition proofs with linked semantic children, while the reusable
    # max-content Track is a separate native component master.
    assert rail["full_track_instances"] == rail["unique_vertical_rows"] == 16
    assert rail["all_tracks_unclipped"] is True and rail["outer_board_clipped"] is False
    assert rail["viewport_width"] == 390 and rail["viewport_patterns_clipped"] is True
    assert pages["festival_card"]["readback"]["aggregate_count_text"] == 0
    assert pages["exhibition_row"]["readback"]["loose_functional_icons"] == 0

    receipt_non_claims = set(receipt["non_claims"])
    assert {"owner visual acceptance", "Astro reverse integration", "production mutation", "family promotion"} <= receipt_non_claims

    authority_receipt = json.loads(AUTHORITY_RECEIPT_PATH.read_text())
    assert authority_receipt["decision_status"] == "owner_approved_contract_encoded"
    assert authority_receipt["contract"]["contract_payload_sha256"] == data["contract_payload_sha256"]
    assert authority_receipt["scope"]["reverse_generation_policy"] == guard["policy"]

    registry = json.loads(EXCEPTION_REGISTRY_PATH.read_text())
    exception = next(row for row in registry["exceptions"] if row["exception_id"] == authority["exception_ref"])
    assert exception["component_id"] == "exhibition.row"
    assert exception["decision_status"] == "owner_approved" and exception["approved_at"]
    assert exception["conformance_profile"] == "structure-and-behavior"
    assert set(exception["region_or_behavior_scope"]) == {
        "media_deck.slider.framing",
        "media_deck.slider.sequence",
        "media_deck.slider.interaction",
        "media_deck.slider.loading-state",
    }
    assert all(region.startswith("media_deck.slider.") for region in exception["region_or_behavior_scope"])

    listing_receipt = json.loads(LISTING_RECEIPT_PATH.read_text())
    assert listing_receipt["status"] == (
        "readback-pass-same-data-instrumental-pass-visual-export-gateway-blocked"
    )
    assert listing_receipt["contract"]["sha256"] == data["contract_payload_sha256"]
    assert listing_receipt["readback"]["canonical_master_count"] == 10
    assert listing_receipt["readback"]["linked_review_root_count"] == 10
    assert listing_receipt["readback"]["detached_review_root_count"] == 0
    assert listing_receipt["readback"]["all_medallions_linked"] is True
    assert listing_receipt["readback"]["desktop_overlay_geometry_px"] == {
        "width": 60,
        "height": 60,
        "right": 10,
        "bottom": 10,
    }
    assert listing_receipt["readback"]["file_validation_issues"] == []
    assert listing_receipt["readback"]["linked_same_data_evidence_root_count"] == 1
    receipt_listing_same_data = listing_receipt["same_data_conformance"]
    assert receipt_listing_same_data["fixture_id"] == "event.real.3132"
    assert receipt_listing_same_data["surface_placement_status"] == "PASS"
    assert receipt_listing_same_data["resolved_content_equal"] is True
    assert receipt_listing_same_data["media_bytes_equal"] is True
    assert receipt_listing_same_data["root_geometry"] == {
        "astro_px": {"width": 420, "height": 279.797},
        "penpot_master_px": {"width": 420, "height": 279.797},
        "penpot_linked_review_px": {"width": 420, "height": 279.797},
    }
    assert receipt_listing_same_data["like_proof"] == {
        "x": 176.875,
        "y": 185,
        "width": 36,
        "height": 36,
        "count": "2",
        "count_inside_component": True,
    }
    assert receipt_listing_same_data["share_state"] == "absent-at-master"
    assert receipt_listing_same_data["terminal_instance_geometry_overrides"] == 0
    assert receipt_listing_same_data["penpot_validation_issues"] == []
    assert set(receipt_listing_same_data["artifacts"]) == {
        "astro-listing-event-card-3132-desktop.png",
        "astro-listing-event-card-3132-desktop-facts.json",
        "astro-surface-placement-receipt.json",
        "penpot-facts.json",
    }

    rail_receipt = json.loads(RAIL_RECEIPT_PATH.read_text())
    assert rail_receipt["status"] == "readback-pass-visual-export-pending"
    assert rail_receipt["contract"]["sha256"] == data["contract_payload_sha256"]
    assert rail_receipt["reusable_track_component"]["layout"] == {
        "horizontal_sizing": "auto",
        "direction": "row",
        "wrap": "nowrap",
        "gap_px": 7,
        "clip": False,
    }
    assert rail_receipt["reusable_track_component"]["fixture_specific_overrides"] == 0
    assert rail_receipt["review_page"]["full_intrinsic_composition_proofs"] == 16
    assert rail_receipt["review_page"]["proof_roots_are_reusable_component_instances"] is False
    assert rail_receipt["review_page"]["root_board_count_after"] == 5
    assert rail_receipt["viewport_pattern"]["axis"] == {
        "state": [f"T{i:02d}" for i in range(1, 17)]
    }
    assert rail_receipt["viewport_pattern"]["all_variant_errors_null"] is True
    assert rail_receipt["penpot"]["validation_issues"] == []

    festival_receipt = json.loads(FESTIVAL_RECEIPT_PATH.read_text())
    assert festival_receipt["status"] == (
        "readback-pass-same-data-visual-conformance-pass-with-engine-limits"
    )
    assert festival_receipt["contract"]["sha256"] == data["contract_payload_sha256"]
    assert festival_receipt["penpot"]["variant_count"] == 9
    assert festival_receipt["penpot"]["linked_review_instance_count"] == 9
    assert festival_receipt["penpot"]["detached_review_root_count"] == 0
    assert festival_receipt["penpot"]["file_validation_issues"] == []
    assert festival_receipt["preserved_correct_structure"]["favorite_action_linked_and_count_absent"] is True
    assert festival_receipt["preserved_correct_structure"]["source_skeleton_descendant_count"] == 0
    assert festival_receipt["preserved_correct_structure"]["duplicate_category_icon_count"] == 0
    assert festival_receipt["semantic_component_readback"]["favorite_variant_set"]["variant_count"] == 5
    assert festival_receipt["idempotency"] == {
        "rerun_master_count": 9,
        "favorite_instances_created_on_rerun": 0,
        "result": "pass",
    }
    assert len(festival_receipt["visual_sanity"]["exports"]) == 5
    festival_same_data = festival_receipt["same_data_conformance"]
    assert festival_same_data["fixture"] == "festival.more-vnutri"
    assert festival_same_data["resolved_content_equal"] is True
    assert festival_same_data["media_source_equal"] is True
    assert festival_same_data["terminal_instance_geometry_overrides"] == 0
    assert festival_same_data["root_geometry"]["astro_px"] == {
        "width": 263.469,
        "height": 277.719,
    }
    assert festival_same_data["root_geometry"]["penpot_px"] == {
        "width": 263.469,
        "height": 277.719,
    }
    assert set(festival_same_data["artifacts"]) == {
        "astro.png",
        "astro-facts.json",
        "penpot-after-systemic.png",
        "penpot-after-systemic-crop.png",
        "penpot-facts.json",
        "same-data-side-by-side-after.png",
    }

    exhibition_receipt = json.loads(EXHIBITION_RECEIPT_PATH.read_text())
    assert exhibition_receipt["status"] == (
        "outer-surface-same-data-instrumental-pass-slider-protected-visual-export-gateway-blocked"
    )
    assert exhibition_receipt["contract"]["sha256"] == data["contract_payload_sha256"]
    assert exhibition_receipt["penpot"]["variant_count"] == 7
    assert exhibition_receipt["penpot"]["linked_review_root_count"] == 8
    assert exhibition_receipt["penpot"]["detached_review_root_count"] == 0
    assert exhibition_receipt["penpot"]["file_validation_issues"] == []
    assert exhibition_receipt["outer_surface_readback"]["evidence_skeleton_descendant_count"] == 0
    assert exhibition_receipt["outer_surface_readback"]["loose_functional_icon_count"] == 0
    assert exhibition_receipt["outer_surface_readback"]["deprecated_medallion_wrapper_count"] == 0
    assert exhibition_receipt["outer_surface_readback"]["semantic_components"]["share_proof"]["count_inside"] is True
    assert exhibition_receipt["outer_surface_readback"]["semantic_components"]["like_with_count"]["count_inside"] is True
    assert exhibition_receipt["protected_slider"]["policy"] == "preserve-source-no-overwrite"
    assert exhibition_receipt["protected_slider"]["reverse_generated_from_penpot"] is False
    assert exhibition_receipt["protected_slider"]["shape_ids_unchanged"] == exhibition_readback["protected_slider_shape_ids_unchanged"]
    protected_evidence = exhibition_receipt["protected_slider"]["comparison_evidence"]
    assert protected_evidence["linked_instance_id"] == exhibition_readback["same_data_evidence_linked_instance_id"]
    assert protected_evidence["masked_descendant_count"] == 4
    assert protected_evidence["medallion_preserved"] is True
    assert protected_evidence["idempotency"] == exhibition_readback["same_data_evidence_idempotency"]
    assert exhibition_receipt["idempotency"] == exhibition_readback["materializer_idempotency"]
    assert len(exhibition_receipt["visual_sanity"]["exports"]) == 3
    exhibition_visual = exhibition_receipt["visual_sanity"]["same_data_outer_surface"]
    assert exhibition_visual["status"] == "instrumental-pass-render-export-blocked"
    assert exhibition_visual["resolved_content_equal"] is True
    assert exhibition_visual["outer_regions_geometry_equal"] is True
    assert exhibition_visual["terminal_instance_geometry_overrides"] == 0
    assert exhibition_visual["penpot_validation_issues"] == []
    assert exhibition_visual["export_observation"]["status"] == "HTTP 504"
    assert set(exhibition_visual["artifacts"]) == {
        "astro-facts.json",
        "astro-outer-surface-1194-slider-blocked.png",
        "penpot-facts.json",
    }
    print(
        f"PASS {PATH.relative_to(ROOT)} {data['contract_payload_sha256']} "
        f"+ {RECEIPT_PATH.relative_to(ROOT)} rev{receipt['penpot']['file_revn_readback']}"
    )


if __name__ == "__main__":
    main()
