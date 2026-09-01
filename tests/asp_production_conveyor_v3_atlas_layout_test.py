from __future__ import annotations

import hashlib
import json
import re
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ATLAS = ROOT / "catalog/asp-production-conveyor-v3/atlas"
MAP = ATLAS / "penpot-page-map.v1.json"
REGISTRY = ATLAS / "page-template-registry.v1.json"
BINDINGS = ATLAS / "page-unit-bindings.v1.json"
SCHEMA = ATLAS / "atlas-layout.schema.json"


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def canonical(obj) -> bytes:
    return (json.dumps(obj, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode()


class AtlasLayoutTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.page_map = load(MAP)
        cls.registry = load(REGISTRY)
        cls.bindings = load(BINDINGS)
        cls.schema = load(SCHEMA)
        cls.units = cls.page_map["page_units"]

    def test_json_schema_and_exact_inventory(self):
        import jsonschema

        jsonschema.Draft202012Validator.check_schema(self.schema)
        jsonschema.Draft202012Validator(self.schema).validate(self.page_map)
        self.assertEqual(len(self.units), 40)
        self.assertEqual(sum(u["protected_existing"] for u in self.units), 2)
        self.assertEqual(sum(u["inventory_class"] == "F0" for u in self.units), 14)
        self.assertEqual(sum(u["inventory_class"] == "U0" for u in self.units), 6)
        self.assertEqual(sum(u["inventory_class"] == "A0" for u in self.units), 18)
        self.assertEqual(
            self.page_map["inventory_counts"],
            {"total": 40, "protected_existing": 2, "F0": 14, "U0": 6, "A0": 18},
        )

    def test_unique_packages_orders_and_exact_page_name_pins(self):
        packages = [u["package_id"] for u in self.units]
        orders = [u["page_order"] for u in self.units]
        self.assertEqual(len(packages), len(set(packages)))
        self.assertEqual(len(orders), len(set(orders)))
        for unit in self.units:
            source = unit["publication_dependency"]["page_name_source"]
            self.assertEqual(unit["exact_package_page_name"], source["exact_value"])
            self.assertIn(
                unit["publication_dependency"]["dependency_state"],
                {"REMOTE_BOUND", "PROTECTED_EXISTING_REMOTE_BOUND"},
            )

    def test_remote_source_blob_bindings_and_machine_readable_page_names(self):
        for unit in self.units:
            dependency = unit["publication_dependency"]
            binding = dependency["remote_binding"]
            spec = f'{binding["remote_head"]}:{binding["source_path"]}'
            raw = subprocess.check_output(["git", "show", spec], cwd=ROOT)
            blob = subprocess.check_output(
                ["git", "rev-parse", spec], cwd=ROOT, text=True
            ).strip()
            tree = subprocess.check_output(
                ["git", "show", "-s", "--format=%T", binding["remote_head"]],
                cwd=ROOT,
                text=True,
            ).strip()
            self.assertEqual(blob, binding["git_blob_sha1"], unit["package_id"])
            self.assertEqual(tree, binding["remote_tree"], unit["package_id"])
            self.assertEqual(len(raw), binding["byte_count"], unit["package_id"])
            self.assertEqual(
                hashlib.sha256(raw).hexdigest(), binding["sha256"], unit["package_id"]
            )
            page_source = dependency["page_name_source"]
            if page_source["kind"] == "json_pointer":
                value = json.loads(raw)
                for token in page_source["pointer"].strip("/").split("/"):
                    value = value[token]
                self.assertEqual(value, unit["exact_package_page_name"])
            elif page_source["kind"] == "javascript_config":
                self.assertIn(unit["exact_package_page_name"].encode(), raw)

    def test_template_values_slots_and_hard_limits(self):
        templates = self.registry["templates"]
        self.assertEqual(set(self.page_map["template_ids"]), set(templates))
        self.assertEqual(
            templates["FOUNDATION_ASSET_GRID_V1"]["header"], [64, 64, 2048, 128]
        )
        self.assertEqual(templates["FOUNDATION_ASSET_GRID_V1"]["review_grid_columns"], 4)
        self.assertEqual(
            templates["COMPONENT_STATE_GRID_V1"]["master_column"], [64, 256, 448, "AUTO"]
        )
        self.assertEqual(templates["COMPONENT_STATE_GRID_V1"]["state_grid_columns"], 3)
        self.assertEqual(
            templates["ARCHETYPE_DESKTOP_MOBILE_V1"]["desktop"], [64, 256, 1440, "AUTO"]
        )
        self.assertEqual(
            templates["ARCHETYPE_DESKTOP_MOBILE_V1"]["mobile"], [1568, 256, 390, "AUTO"]
        )
        self.assertEqual(
            templates["ARCHETYPE_DESKTOP_MOBILE_V1"]["evidence"], [2048, 256, 512, "AUTO"]
        )
        self.assertEqual(
            templates["COMPOSED_ROUTE_STATES_V1"]["states"],
            ["top", "scrolled", "full", "loading", "empty", "error"],
        )
        for unit in self.units:
            template = templates[unit["template_id"]]
            slots = unit["semantic_slot_bindings"]
            census = unit["hard_limit_census"]
            self.assertTrue(set(template["required_slots"]).issubset(slots), unit["package_id"])
            for key, maximum in template["hard_limits"].items():
                self.assertIsNotNone(census.get(key), f'{unit["package_id"]}:{key}')
                self.assertLessEqual(census[key], maximum, f'{unit["package_id"]}:{key}')
            if unit["template_id"] == "ARCHETYPE_DESKTOP_MOBILE_V1":
                self.assertTrue({"desktop", "mobile", "evidence"}.issubset(slots))
            if unit["template_id"] == "FOUNDATION_ASSET_GRID_V1":
                self.assertTrue({"header", "master_column", "review_grid"}.issubset(slots))
            if unit["template_id"] == "COMPONENT_STATE_GRID_V1":
                self.assertTrue({"header", "master_column", "state_grid"}.issubset(slots))

    def test_candidate_root_and_protected_surface_rules(self):
        for unit in self.units:
            rules = unit["protected_surface_rules"]
            self.assertFalse(rules["managed_nodes_outside_candidate_root_allowed"])
            self.assertTrue(rules["atlas_internal_geometry_mutation_forbidden"])
            if unit["protected_existing"]:
                self.assertTrue(rules["recreate_forbidden"])
                self.assertTrue(rules["delete_forbidden"])
                self.assertEqual(rules["atlas_managed_nodes_on_protected_page"], 0)

    def test_page_order_bands(self):
        for unit in self.units:
            order = unit["page_order"]
            if unit["atlas_page_id"] == "owner-review-index":
                self.assertEqual(order, 0)
            elif unit["inventory_class"] == "F0" or unit["atlas_page_id"] == "foundations-source-index":
                self.assertTrue(1 <= order < 10, unit["package_id"])
            elif unit["section"].startswith("controls"):
                self.assertTrue(10 <= order < 20, unit["package_id"])
            elif unit["section"] in {"content-patterns", "content-free-collection"}:
                self.assertTrue(20 <= order < 30, unit["package_id"])
            elif unit["section"] in {"shell-navigation", "composed-listings"}:
                self.assertTrue(30 <= order < 40, unit["package_id"])
            elif unit["template_id"] == "ARCHETYPE_DESKTOP_MOBILE_V1":
                self.assertTrue(40 <= order < 60, unit["package_id"])

    def test_no_old_penpot_uuid_lineage(self):
        uuid = re.compile(
            rb"\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b",
            re.I,
        )
        for path in [MAP, REGISTRY, BINDINGS, SCHEMA]:
            self.assertIsNone(uuid.search(path.read_bytes()), path.name)

    def test_machine_readable_d0_contract(self):
        contract = self.page_map["d0_binding_contract"]
        self.assertEqual(contract["integrate"]["package_lookup_cardinality"], "EXACTLY_ONCE_IN_PAGE_MAP")
        self.assertEqual(contract["mat"]["executor_coordinate_policy"], "HONOR_AND_CHECK")
        self.assertEqual(contract["mat"]["overlap"], "REJECT")
        self.assertEqual(contract["incompatibility"]["verdict"], "ATLAS_LAYOUT_REPAIR")
        self.assertEqual(contract["incompatibility"]["scope"], "AFFECTED_PACKAGE_ONLY")
        self.assertEqual(contract["publish"]["managed_nodes_boundary"], "CANDIDATE_ROOT_ONLY")
        self.assertEqual(contract["publish"]["page_creation_order"], "page_order_ASC")
        self.assertEqual(
            contract["publish"]["per_page_postflight"],
            ["native_readback", "nonempty_export", "page_scoped_v0_trigger"],
        )

    def test_deterministic_page_map_regeneration_is_byte_stable(self):
        projection = self.schema["x-page-map-projection"]
        fields = projection["unit_fields"]
        units = [{key: unit[key] for key in fields} for unit in self.bindings["units"]]
        units.sort(key=lambda unit: (unit["page_order"], unit["atlas_page_id"]))
        rebuilt = {
            "schema_version": projection["schema_version"],
            "atlas_id": self.bindings["atlas_id"],
            "source_control_plane_base": self.bindings["source_control_plane_base"],
            "inventory_counts": self.bindings["inventory_counts"],
            "template_ids": sorted(self.registry["templates"]),
            "d0_binding_contract": self.schema["x-d0-binding-contract"],
            "page_units": units,
        }
        self.assertEqual(canonical(rebuilt), MAP.read_bytes())
        for path in [MAP, REGISTRY, BINDINGS, SCHEMA]:
            self.assertEqual(canonical(load(path)), path.read_bytes(), path.name)


if __name__ == "__main__":
    unittest.main()
