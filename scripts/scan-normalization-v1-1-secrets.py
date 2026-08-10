#!/usr/bin/env python3
"""Fail closed on credential-like material added by the v1.1 remediation."""

from __future__ import annotations

import pathlib
import re
import subprocess
import sys


ROOT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
BASE = sys.argv[2] if len(sys.argv) > 2 else "317938bc72cf7a47ea798b2614d92d3d285dd97a"
tracked = subprocess.check_output(
    ["git", "diff", "--name-only", "--diff-filter=ACMR", f"{BASE}...HEAD"],
    cwd=ROOT,
    text=True,
).splitlines()

patterns = (
    re.compile(r"BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY"),
    re.compile(r"gh[pousr]_[A-Za-z0-9_]{20,}"),
    re.compile(r"AKIA[0-9A-Z]{16}"),
    re.compile(r"Bearer\s+[A-Za-z0-9._~+/-]{20,}"),
    re.compile(
        r"(?:api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*['\"][^'\"]{8,}",
        re.IGNORECASE,
    ),
)

hits: list[str] = []
for relative in tracked:
    file_path = ROOT / relative
    if not file_path.is_file():
        continue
    try:
        text = file_path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        continue
    for line_number, line in enumerate(text.splitlines(), start=1):
        if any(pattern.search(line) for pattern in patterns):
            hits.append(f"{relative}:{line_number}")

if hits:
    raise SystemExit("potential secrets found:\n" + "\n".join(hits))
print({"status": "PASS", "scanned_files": len(tracked), "matches": 0})
