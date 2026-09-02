#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

HERE = Path(__file__).resolve()
GENERATOR = HERE.with_name("generate_direct_plugin_bundles.py")
SPEC = importlib.util.spec_from_file_location("a0_direct_plugin_bundle_generator", GENERATOR)
if SPEC is None or SPEC.loader is None:
    raise RuntimeError("DIRECT_PLUGIN_GENERATOR_LOAD_FAILED")
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)
MODULE.ROOT = HERE.parents[4]
raise SystemExit(MODULE.main())
