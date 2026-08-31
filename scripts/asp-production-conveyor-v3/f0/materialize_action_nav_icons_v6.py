#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(HERE))
from f0_small_page_runtime_v1 import cli

PACKAGE = ROOT / 'catalog/asp-production-conveyor-v3/f0/F-ACTION-NAV-ICONS.package.v6.json'

if __name__ == "__main__":
    raise SystemExit(cli(PACKAGE))
