#!/usr/bin/env python3
from __future__ import annotations

import json
import pathlib
import shutil
import subprocess
import tempfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
FILES = [
    "catalog/normalization/families/event-preview-representations/event-medallion-candidate-v1.json",
    "catalog/normalization/families/event-preview-representations/event-artifact-candidate-v1.json",
    "catalog/normalization/families/event-preview-representations/event-card-taxonomy-candidate-v1.json",
    "contracts/normalization/event-medallion-candidate.v1.schema.json",
    "contracts/normalization/event-artifact-candidate.v1.schema.json",
    "scripts/validate-event-card-assets-candidate-v1.py",
]


def fixture() -> pathlib.Path:
    root = pathlib.Path(tempfile.mkdtemp(prefix="event-card-assets-negative-"))
    for rel in FILES:
        target = root / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT / rel, target)
    return root


def run(root: pathlib.Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["python3", "scripts/validate-event-card-assets-candidate-v1.py", "--root", "."],
        cwd=root,
        text=True,
        capture_output=True,
    )


def main() -> None:
    cases = []
    root = fixture()
    med_path = root / FILES[0]
    med = json.loads(med_path.read_text())
    med["visuals"].pop()
    med_path.write_text(json.dumps(med))
    cases.append(("medallion-count-or-hash", run(root)))

    root = fixture()
    art_path = root / FILES[1]
    art = json.loads(art_path.read_text())
    art["runtime_product"]["valid_state_keys"].remove("presence=amber-tail;lifecycle=keyboard-focus;motion=full")
    art_path.write_text(json.dumps(art))
    cases.append(("amber-state-or-hash", run(root)))

    failed = [(name, result.stdout, result.stderr) for name, result in cases if result.returncode == 0]
    if failed:
        raise SystemExit(f"negative validator unexpectedly accepted: {failed}")
    print(json.dumps({"status": "valid", "negative_cases": len(cases)}))


if __name__ == "__main__":
    main()
