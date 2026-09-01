from __future__ import annotations
import json
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[4]
CAT = ROOT / "catalog/asp-production-conveyor-v3/u0/eventcard-product-acceptance"

class AcceptanceMatrixTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.matrix = json.loads((CAT / "U0-EVENTCARD-THREE-REPAIRS.acceptance-matrix.v1.json").read_text(encoding="utf-8"))
        cls.addenda = json.loads((CAT / "ASP_BUILD_REQUEST_V2.corrected-addenda.v1.json").read_text(encoding="utf-8"))

    def test_exact_four_cases(self):
        rows = self.matrix["cases"]
        self.assertEqual(4, len(rows))
        self.assertEqual(4, len({row["root_id"] for row in rows}))
        self.assertEqual(4, len({row["component_id"] for row in rows}))
        self.assertEqual(26, sum(row["linked_leaf_instances"] for row in rows))

    def test_text_scope_is_four_plus_sixteen(self):
        text = self.matrix["packages"]["text_repair"]
        self.assertEqual(4, len(text["affected_ids"]))
        self.assertEqual(16, len(text["protected_ids"]))
        self.assertEqual(16, text["expected_post_readback"]["remaining_offenders"])

    def test_domain_isolation_and_no_penpot(self):
        self.assertEqual(0, self.matrix["u0_boundaries"]["penpot_reads"])
        self.assertEqual(0, self.matrix["u0_boundaries"]["penpot_mutations"])
        self.assertEqual(0, self.matrix["u0_boundaries"]["new_card_families"])
        self.assertFalse(self.matrix["non_regression_invariants"]["visual_pass_from_structural_or_readback_only"])

    def test_mandatory_addenda(self):
        self.assertEqual(3, len(self.addenda["addenda"]))
        by_id = {row["package_id"]: row for row in self.addenda["addenda"]}
        self.assertEqual("DISTINCT_LATER_READBACK", by_id["MAT-EVENTCARD-TEXT-R11C-COMPATIBLE-REPAIR"]["fields"]["second_run_kind"])
        self.assertTrue(by_id["MAT-EVENTCARD-MEDIA-COVERAGE-REPAIR-R1"]["fields"]["pre_execution_read_only_target_projection_required"])
        self.assertEqual("0/18", by_id["MAT-EVENTCARD-NATIVE-COMPONENT-PATHS-REPAIR-R1"]["fields"]["baseline_exact_canonical_paths"])

if __name__ == "__main__":
    unittest.main()
