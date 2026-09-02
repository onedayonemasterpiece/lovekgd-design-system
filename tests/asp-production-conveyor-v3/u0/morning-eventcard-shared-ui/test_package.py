import json
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[4]
DIR = ROOT / "catalog/asp-production-conveyor-v3/u0/morning-eventcard-shared-ui"

class MorningAcceptanceTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.profile = json.loads((DIR / "MAT-EVENTCARD-TEXT-R11C-MINIMAL-PROFILE-PROPOSAL-R3.json").read_text())
        cls.acceptance = json.loads((DIR / "U0-SHARED-UI-ANATOMY-STATE-ACCEPTANCE.v1.json").read_text())
        cls.atlas = json.loads((DIR / "ASP_ATLAS_EXTENSION_HANDOFF_V1.json").read_text())

    def test_profile_is_not_applied(self):
        self.assertEqual(self.profile["status"], "PROPOSAL_INACTIVE")
        self.assertFalse(self.profile["applied"])
        self.assertFalse(self.profile["authority"]["this_proposal_authorizes_penpot_execution"])

    def test_profile_scope(self):
        self.assertEqual(len(self.profile["targets"]), 4)
        self.assertEqual(len(self.profile["protected_offenders"]), 16)
        self.assertEqual(self.profile["lifecycle"]["ttl_seconds"], 900)
        self.assertEqual(self.profile["lifecycle"]["execution_count"], 1)

    def test_shared_acceptance_heads(self):
        self.assertEqual(self.acceptance["free_shell"]["head"], "60ff5406bd4654d8b1961a6fa9ea3e766cb76dab")
        self.assertEqual(self.acceptance["recovered_cards"]["head"], "3f8e54e9d39fb8489877e4df5fc2decfab7c88d6")
        self.assertEqual(self.acceptance["shared_patterns"]["requested_input_head"], "d139adac27c96041026f70e12daad2fa9728fcc0")
        self.assertEqual(self.acceptance["shared_patterns"]["execution_head"], "6c0496874764b3019cdaafcac53ed330664f323e")

    def test_no_new_card_families_or_penpot(self):
        b = self.acceptance["shared_boundaries"]
        self.assertEqual(b["new_card_families"], 0)
        self.assertEqual(b["penpot_reads_by_u0"], 0)
        self.assertEqual(b["penpot_mutations_by_u0"], 0)

    def test_atlas_is_o0_only(self):
        self.assertEqual(self.atlas["to"], "O0_ATLAS_EXTENSION")
        self.assertEqual(self.atlas["page_order_assignment"], "O0_ONLY")
        self.assertEqual(len(self.atlas["packages"]), 3)

if __name__ == "__main__":
    unittest.main()
