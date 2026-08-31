#!/usr/bin/env python3
"""Git-only regression tests for F-MEDALLIONS-BRAND-ASSETS v3."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import unittest

REPO = Path(__file__).resolve().parents[3]
ENTRY_PATH = (
    REPO
    / "scripts/asp-production-conveyor-v3/f0/"
    / "materialize_medallions_brand_assets_v3_entry.py"
)

spec = importlib.util.spec_from_file_location(
    "f0_medallions_brand_candidate_v3_entry", ENTRY_PATH
)
assert spec and spec.loader
entry = importlib.util.module_from_spec(spec)
spec.loader.exec_module(entry)
impl = entry.impl


class MedallionsBrandCandidateV3Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        (
            cls.base,
            cls.resolver,
            cls.package,
            cls.package_identity,
            cls.source,
            cls.context_identity,
        ) = impl.load_context(REPO, impl.DEFAULT_PACKAGE)
        cls.effective = impl.effective_package(cls.package, cls.source)
        cls.evidence = impl.resolve_evidence(
            cls.base,
            cls.resolver,
            REPO,
            REPO,
            cls.effective,
        )

    def test_current_file_candidate_and_protected_surface(self) -> None:
        self.assertEqual(
            self.package["target_penpot_page"]["file_id"],
            impl.CURRENT_FILE_ID,
        )
        self.assertEqual(
            self.effective["target_penpot_page"]["file_id"],
            impl.CURRENT_FILE_ID,
        )
        self.assertEqual(
            self.package["target_penpot_page"]["candidate_label"],
            "CANDIDATE_BUILD_NOT_ACCEPTED",
        )
        self.assertFalse(self.package["protected_surface"]["mutation_allowed"])
        self.assertNotEqual(
            self.package["target_penpot_page"].get("page_id"),
            self.package["protected_surface"]["page_id"],
        )

    def test_schema_exact_resolver_closes_inventory(self) -> None:
        resolved = self.evidence["resolved_medallions"]
        self.assertEqual(
            resolved["resolver"],
            "event-medallion-candidate-v1-primary-asset-resolver.v3",
        )
        self.assertEqual(resolved["records_count"], 39)
        self.assertEqual(resolved["consumer_binding_count"], 43)
        self.assertEqual(resolved["unique_visual_count"], 42)
        self.assertEqual(len(resolved["visuals"]), 42)
        self.assertEqual(len(resolved["bindings"]), 43)
        self.assertEqual(resolved["fallback_assets_used"], 0)
        self.assertEqual(resolved["old_penpot_bindings_used"], 0)
        self.assertEqual(len(self.evidence["resolved_brand"]), 3)

    def test_generic_v2_resolver_is_not_valid_for_this_manifest(self) -> None:
        registry = json.loads(
            (
                REPO / "contracts/assets/ui-medallion-asset-registry.v1.json"
            ).read_text(encoding="utf-8")
        )
        manifest = json.loads(
            (
                REPO
                / "catalog/normalization/families/event-preview-representations/"
                / "event-medallion-candidate-v1.json"
            ).read_text(encoding="utf-8")
        )
        generic = self.base.generic_resolve_manifest(manifest, registry)
        with self.assertRaises(AssertionError):
            self.base.validate_resolved_inventory(generic, registry)

    def test_plan_is_exact_and_does_not_claim_promotion(self) -> None:
        plan = impl.build_plan(
            self.base,
            self.package,
            self.package_identity,
            self.context_identity,
            self.effective,
            self.evidence,
            "a" * 40,
        )
        self.assertEqual(
            plan["marker"], "F0_MEDALLIONS_BRAND_CANDIDATE_PLAN_PASS"
        )
        self.assertEqual(plan["target"]["file_id"], impl.CURRENT_FILE_ID)
        self.assertEqual(plan["resolved_counts"]["unique_visuals"], 42)
        self.assertTrue(plan["write_contract"]["candidate_build_not_accepted"])
        self.assertFalse(plan["write_contract"]["visual_acceptance_claimed"])
        self.assertEqual(plan["write_contract"]["fallback_assets_used"], 0)
        self.assertEqual(plan["write_contract"]["old_penpot_bindings_used"], 0)


if __name__ == "__main__":
    unittest.main()
