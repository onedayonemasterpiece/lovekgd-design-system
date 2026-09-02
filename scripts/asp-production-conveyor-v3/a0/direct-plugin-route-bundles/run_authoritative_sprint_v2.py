#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve()
TARGET = HERE.with_name("run_authoritative_sprint.py")
SPEC = importlib.util.spec_from_file_location("a0_authoritative_direct_plugin_sprint_v2", TARGET)
if SPEC is None or SPEC.loader is None:
    raise RuntimeError("AUTHORITATIVE_SPRINT_LOAD_FAILED")
MODULE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = MODULE
SPEC.loader.exec_module(MODULE)
ORIGINAL_GIT = MODULE.git


def patched_git(*args: str) -> str:
    if args[:1] == ("add",) and len(args) == 2 and args[1].endswith("/blocked"):
        blocked = MODULE.ROOT / args[1]
        if not blocked.exists() or not any(path.is_file() for path in blocked.rglob("*")):
            return ""
    if args[:1] == ("commit",):
        staged = subprocess.run(
            ["git", "diff", "--cached", "--quiet"],
            cwd=MODULE.ROOT,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        if staged.returncode == 0:
            return ORIGINAL_GIT("rev-parse", "HEAD")
    return ORIGINAL_GIT(*args)


MODULE.git = patched_git
raise SystemExit(MODULE.main())
