#!/usr/bin/env python3
"""Validate every v1.1 normalization record against its Draft 2020-12 schema."""

from __future__ import annotations

import json
import pathlib
import sys

from jsonschema import Draft202012Validator


ROOT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()


def load_json(relative: str):
    return json.loads((ROOT / relative).read_text(encoding="utf-8"))


def load_jsonl(relative: str):
    return [
        json.loads(line)
        for line in (ROOT / relative).read_text(encoding="utf-8").splitlines()
        if line
    ]


TARGETS = (
    (
        "contracts/normalization/findings-disposition.v1.schema.json",
        "catalog/normalization/findings-disposition.jsonl",
        "jsonl",
    ),
    (
        "contracts/normalization/analytical-entity-kinds.v1.schema.json",
        "catalog/normalization/analysis-group-registry.jsonl",
        "jsonl",
    ),
    (
        "contracts/normalization/semantic-readiness.v1.schema.json",
        "catalog/normalization/semantic-readiness.jsonl",
        "jsonl",
    ),
    (
        "contracts/product-value-evidence-binding.v1.schema.json",
        "catalog/normalization/component-applications.jsonl",
        "jsonl",
    ),
    (
        "contracts/normalization/family-lifecycle.v1.schema.json",
        "contracts/normalization/family-lifecycle.v1.json",
        "json",
    ),
)


counts: dict[str, int] = {}
for schema_path, data_path, kind in TARGETS:
    schema = load_json(schema_path)
    Draft202012Validator.check_schema(schema)
    validator = Draft202012Validator(schema)
    rows = load_jsonl(data_path) if kind == "jsonl" else [load_json(data_path)]
    for index, row in enumerate(rows, start=1):
        errors = sorted(validator.iter_errors(row), key=lambda error: list(error.path))
        if errors:
            error = errors[0]
            location = ".".join(str(part) for part in error.path) or "<root>"
            raise SystemExit(
                f"{data_path}:{index}:{location}: schema validation failed: {error.message}"
            )
    counts[data_path] = len(rows)

print(json.dumps({"status": "valid", "draft": "2020-12", "records": counts}, sort_keys=True))
