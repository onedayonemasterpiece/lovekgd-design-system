#!/usr/bin/env python3
"""Fail-closed validation for owner re-review threads 96–125."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "catalog/normalization/families/event-preview-representations/event-card-owner-review-2-candidate-v1.json"


def stable_hash(data: dict) -> str:
    payload = dict(data)
    payload.pop("contract_payload_sha256", None)
    raw = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()
    return hashlib.sha256(raw).hexdigest()


def main() -> None:
    data = json.loads(PATH.read_text())
    assert data["authority_mode"] == "owner-comment-correction-over-reconstructed-source"
    assert data["canonical"] is False
    assert data["promotion_status"] == "not_promoted"
    assert data["source_baseline"]["exact_commit"] == "7d4b1d32710f60d65c7eb0dbd084d8cad058b5dc"
    assert stable_hash(data) == data["contract_payload_sha256"]

    binding = data["owner_comment_binding"]
    assert binding["thread_range"] == [96, 125]
    assert binding["thread_count"] == 30
    threads = binding["threads"]
    assert [item["seq"] for item in threads] == list(range(96, 126))
    assert len({item["thread_id"] for item in threads}) == 30
    assert binding["duplicate_threads"] == [[105, 106]]

    contracts = data["component_contracts"]
    large = contracts["event_card_large"]
    assert large["not_interested"].startswith("mandatory")
    assert large["calendar"]["states"] == ["available", "added", "absent"]
    assert large["calendar"]["added_label"] == "Добавлено"
    assert large["admission"]["layout"] == "inline-flex hug-content"
    assert large["media_loading"]["scope"] == "media only"
    assert large["authorized_search_skeleton"]["separate_from_event_card_media_loading"] is True

    listing = contracts["listing_event_card"]
    assert listing["inside_proof"]["surface"] == "translucent light pill"
    assert listing["placement"]["axis"] == "derived overlay|side|none"

    rail = contracts["mobile_listing_rail"]
    assert "clip=false" in rail["track"]
    assert len(rail["required_review_diversity"]) >= 7

    exhibition = contracts["exhibition_row"]
    assert exhibition["medallion"]["fixture_5376"] == "world-ocean-museum"
    assert exhibition["share_proof"]["action"] is False
    assert exhibition["like_action"]["count"].startswith("always visible")

    assert contracts["medallions"]["public_frame_tiers"] == ["compact44", "standard60", "feature88"]
    assert "monolithic source skeleton as component internals" in contracts["festival_card"]["forbidden"]

    lifecycle = data["page_lifecycle"]["page_40_1b"]
    assert lifecycle["decision"] == "delete after reference cleanup"
    assert data["page_lifecycle"]["page_41"]["owner_review_link"].startswith("omit")

    non_claims = set(data["non_claims"])
    assert {"owner visual acceptance", "Astro reverse integration", "production mutation", "family promotion"} <= non_claims
    print(f"PASS {PATH.relative_to(ROOT)} {data['contract_payload_sha256']}")


if __name__ == "__main__":
    main()
