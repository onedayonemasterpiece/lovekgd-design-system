#!/usr/bin/env python3
"""Canonically regenerate the Atlas R2.1 overlay JSON files."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent


def canonical_bytes(path: Path) -> bytes:
    payload = json.loads(path.read_text(encoding="utf-8"))
    return (json.dumps(payload, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")


def main() -> None:
    for path in sorted(ROOT.glob("*.json")):
        path.write_bytes(canonical_bytes(path))


if __name__ == "__main__":
    main()
