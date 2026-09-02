#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

HERE = Path(__file__).resolve()
GENERATOR = HERE.with_name("generate_direct_plugin_bundles.py")
SPEC = importlib.util.spec_from_file_location("a0_direct_plugin_bundle_generator_v3", GENERATOR)
if SPEC is None or SPEC.loader is None:
    raise RuntimeError("DIRECT_PLUGIN_GENERATOR_LOAD_FAILED")
MODULE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = MODULE
SPEC.loader.exec_module(MODULE)
MODULE.ROOT = HERE.parents[4]
ORIGINAL = MODULE.make_bundle


def make_bundle_v3(*args, **kwargs):
    bundle, meta = ORIGINAL(*args, **kwargs)
    old = "function allShapes(page) { try { return page.findShapes({}) || []; } catch (_) { return pageBoards(page); } }"
    new = "function allShapes(page) { const out = []; for (const type of ['board', 'text']) { try { for (const shape of (page.findShapes({ type }) || [])) out.push(shape); } catch (_) {} } return out; }"
    if old not in bundle:
        raise RuntimeError("ALL_SHAPES_PATCH_ANCHOR_MISSING")
    return bundle.replace(old, new), meta


MODULE.make_bundle = make_bundle_v3
raise SystemExit(MODULE.main())
