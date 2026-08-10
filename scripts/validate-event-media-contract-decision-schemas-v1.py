#!/usr/bin/env python3
"""Validate Event Media decision records with JSON Schema Draft 2020-12."""

from __future__ import annotations

import argparse
import json
import pathlib
import sys

from jsonschema import Draft202012Validator

CATALOG_SCHEMA = "contracts/normalization/event-media-contract-decision-catalog.v1.schema.json"
CANDIDATE_SCHEMA = "contracts/normalization/event-media-candidate-contract.v1.schema.json"
RECEIPT_SCHEMA = "contracts/normalization/event-media-contract-decision-receipt.v1.schema.json"
RECEIPT = "receipts/normalization/event-media-contract-decision-v1.json"
CATALOGS = (
    "catalog/normalization/event-media/consumer-requirement-matrix.jsonl",
    "catalog/normalization/event-media/semantic-media-types.jsonl",
    "catalog/normalization/event-media/boundary-model.jsonl",
    "catalog/normalization/event-media/blocker-closure.jsonl",
    "catalog/normalization/event-media/alternatives-and-recommendations.jsonl",
    "catalog/normalization/event-media/readiness.jsonl",
    "catalog/normalization/event-media/owner-decision-queue.jsonl",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--skip-receipt", action="store_true")
    return parser.parse_args()


def load_json(path: pathlib.Path):
    return json.loads(path.read_text(encoding="utf-8"))


def validate_document(validator: Draft202012Validator, document, relative: str, index: int = 1) -> None:
    errors = sorted(validator.iter_errors(document), key=lambda error: list(error.absolute_path))
    if not errors:
        return
    error = errors[0]
    pointer = "/" + "/".join(str(part) for part in error.absolute_path)
    payload = {
        "status": "rejected",
        "error": {
            "name": "EventMediaSchemaValidationError",
            "code": "EMV_SCHEMA_REJECTED",
            "stage": "schema",
            "record": f"{relative}:{index}",
            "path": pointer,
            "diagnostic": error.message,
        },
    }
    print(json.dumps(payload, sort_keys=True), file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    args = parse_args()
    root = pathlib.Path(args.root).resolve()
    schema_paths = (CATALOG_SCHEMA, CANDIDATE_SCHEMA, RECEIPT_SCHEMA)
    schemas = {relative: load_json(root / relative) for relative in schema_paths}
    try:
        for schema in schemas.values():
            Draft202012Validator.check_schema(schema)
    except Exception as error:
        print(json.dumps({
            "status": "rejected",
            "error": {"name": type(error).__name__, "code": "EMV_SCHEMA_INVALID", "stage": "schema", "record": "schema", "path": "/", "diagnostic": str(error)},
        }, sort_keys=True), file=sys.stderr)
        raise SystemExit(1) from error

    catalog_validator = Draft202012Validator(schemas[CATALOG_SCHEMA])
    counts: dict[str, int] = {}
    for relative in CATALOGS:
        rows = [json.loads(line) for line in (root / relative).read_text(encoding="utf-8").splitlines() if line]
        for index, row in enumerate(rows, start=1):
            validate_document(catalog_validator, row, relative, index)
        counts[relative] = len(rows)

    candidate_validator = Draft202012Validator(schemas[CANDIDATE_SCHEMA])
    candidate_dir = root / "catalog/normalization/event-media/candidate-contracts"
    candidates = sorted(candidate_dir.glob("*.json"))
    for candidate in candidates:
        relative = candidate.relative_to(root).as_posix()
        validate_document(candidate_validator, load_json(candidate), relative)
    counts["catalog/normalization/event-media/candidate-contracts/*.json"] = len(candidates)

    receipt_path = root / RECEIPT
    if not args.skip_receipt:
        if not receipt_path.is_file():
            print(json.dumps({
                "status": "rejected",
                "error": {"name": "EventMediaSchemaValidationError", "code": "EMV_RECEIPT_MISSING", "stage": "receipt", "record": RECEIPT, "path": "/", "diagnostic": "receipt is required unless --skip-receipt is explicit"},
            }, sort_keys=True), file=sys.stderr)
            raise SystemExit(1)
        validate_document(Draft202012Validator(schemas[RECEIPT_SCHEMA]), load_json(receipt_path), RECEIPT)
        counts[RECEIPT] = 1

    print(json.dumps({"status": "valid", "draft": "2020-12", "schemas_checked": list(schema_paths), "records": counts}, sort_keys=True))


if __name__ == "__main__":
    main()
