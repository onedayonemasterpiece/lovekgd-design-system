#!/usr/bin/env python3
"""Validate the Apply Component Synthesis v0.1 machine documents."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from jsonschema import Draft202012Validator


ROOT_REL = Path("catalog/normalization/component-synthesis-v0.1")


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def load_jsonl(path: Path):
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def validate(schema_path: Path, documents: list[tuple[str, object]]) -> int:
    schema = load_json(schema_path)
    Draft202012Validator.check_schema(schema)
    validator = Draft202012Validator(schema)
    count = 0
    for label, document in documents:
        errors = sorted(validator.iter_errors(document), key=lambda error: list(error.absolute_path))
        if errors:
            error = errors[0]
            pointer = "/".join(map(str, error.absolute_path))
            raise AssertionError(f"{label}#/{pointer}: {error.message}")
        count += 1
    return count


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--require-receipt", action="store_true")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    corpus = root / ROOT_REL

    registry_documents: list[tuple[str, object]] = []
    for relative in ("entity-registry.jsonl", "current-to-candidate-mapping.jsonl", "page-archetype-registry.jsonl", "technical-reconciliation-queue.jsonl"):
        registry_documents.extend((f"{relative}:{index}", row) for index, row in enumerate(load_jsonl(corpus / relative), 1))
    for relative in ("component-hierarchy.json", "owner-ambiguities.json", "penpot-materialization-plan.json"):
        registry_documents.append((relative, load_json(corpus / relative)))

    registry_count = validate(
        root / "contracts/normalization/component-synthesis-registry.v0.1.schema.json",
        registry_documents,
    )

    contract_index = load_json(corpus / "contracts/index.json")
    contract_documents = [(row["path"], load_json(root / row["path"])) for row in contract_index["contracts"]]
    contract_count = validate(
        root / "contracts/normalization/component-synthesis-contract.v0.1.schema.json",
        contract_documents,
    )

    archetype_index = load_json(corpus / "archetypes/index.json")
    archetype_documents = [(row["path"], load_json(root / row["path"])) for row in archetype_index["graph_files"]]
    archetype_count = validate(
        root / "contracts/normalization/component-synthesis-archetype.v0.1.schema.json",
        archetype_documents,
    )

    receipt_path = root / "receipts/normalization/apply-component-synthesis-v0.1.json"
    receipt_schema = root / "contracts/normalization/apply-component-synthesis-receipt.v0.1.schema.json"
    Draft202012Validator.check_schema(load_json(receipt_schema))
    receipt_count = 0
    if receipt_path.exists():
        receipt_count = validate(receipt_schema, [(str(receipt_path.relative_to(root)), load_json(receipt_path))])
    elif args.require_receipt:
        raise AssertionError(f"missing required receipt: {receipt_path.relative_to(root)}")

    print(json.dumps({
        "status": "PASS",
        "registry_documents": registry_count,
        "candidate_contracts": contract_count,
        "archetype_graphs": archetype_count,
        "receipts": receipt_count,
    }, separators=(",", ":")))


if __name__ == "__main__":
    main()
