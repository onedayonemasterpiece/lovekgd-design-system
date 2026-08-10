#!/usr/bin/env python3
"""Validate every v1.1 normalization record against its Draft 2020-12 schema."""

from __future__ import annotations

import json
import pathlib
import sys

from jsonschema import Draft202012Validator


ARGUMENTS = sys.argv[1:]
ROOT = pathlib.Path(ARGUMENTS[0] if ARGUMENTS and not ARGUMENTS[0].startswith("--") else ".").resolve()


def value_after(flag: str) -> pathlib.Path | None:
    if flag not in ARGUMENTS:
        return None
    index = ARGUMENTS.index(flag)
    if index + 1 >= len(ARGUMENTS):
        raise SystemExit(f"{flag} requires a path")
    return pathlib.Path(ARGUMENTS[index + 1]).resolve()


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
    (
        "contracts/normalization/project-normalization-mutation-catalog.v1.schema.json",
        "receipts/normalization/project-normalization-v1-1-mutation-catalog.json",
        "json",
    ),
    (
        "contracts/normalization/project-normalization-v1-1-input-paths.schema.json",
        "contracts/normalization/project-normalization-v1-1-input-paths.json",
        "json",
    ),
)

SCHEMA_ONLY = (
    "contracts/normalization/project-normalization-mutation-run.v1.schema.json",
    "contracts/normalization/project-normalization-v1-1-execution-attestation.v1.schema.json",
)


counts: dict[str, int] = {}
schemas_checked: set[str] = set()
for schema_path, data_path, kind in TARGETS:
    schema = load_json(schema_path)
    Draft202012Validator.check_schema(schema)
    schemas_checked.add(schema_path)
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

for schema_path in SCHEMA_ONLY:
    Draft202012Validator.check_schema(load_json(schema_path))
    schemas_checked.add(schema_path)

RUNTIME_TARGETS = (
    (
        "--mutation-result",
        "contracts/normalization/project-normalization-mutation-run.v1.schema.json",
    ),
    (
        "--execution-attestation",
        "contracts/normalization/project-normalization-v1-1-execution-attestation.v1.schema.json",
    ),
)
for flag, schema_path in RUNTIME_TARGETS:
    document_path = value_after(flag)
    if document_path is None:
        continue
    schema = load_json(schema_path)
    Draft202012Validator.check_schema(schema)
    document = json.loads(document_path.read_text(encoding="utf-8"))
    errors = sorted(Draft202012Validator(schema).iter_errors(document), key=lambda error: list(error.path))
    if errors:
        error = errors[0]
        location = ".".join(str(part) for part in error.path) or "<root>"
        raise SystemExit(f"{document_path}:{location}: schema validation failed: {error.message}")
    counts[str(document_path)] = 1

print(json.dumps({"status": "valid", "draft": "2020-12", "schemas_checked": sorted(schemas_checked), "records": counts}, sort_keys=True))
