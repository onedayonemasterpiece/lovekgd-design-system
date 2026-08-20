#!/usr/bin/env python3
"""Fail-closed structural validation for the bounded systemic boundary overlay."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "catalog/normalization/families/event-preview-representations/event-card-systemic-boundaries-candidate-v1.json"


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
    print(f"PASS {PATH.relative_to(ROOT)} {data['contract_payload_sha256']}")


if __name__ == "__main__":
    main()
