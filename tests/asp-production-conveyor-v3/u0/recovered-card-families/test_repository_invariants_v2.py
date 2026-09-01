import hashlib
import json
import pathlib
import re
import unittest


ROOT = next(parent for parent in pathlib.Path(__file__).resolve().parents if (parent / "catalog").exists() and (parent / "scripts").exists())
PACKAGE_DIR = ROOT / "catalog/asp-production-conveyor-v3/u0/recovered-card-families"
SCRIPT_DIR = ROOT / "scripts/asp-production-conveyor-v3/u0/recovered-card-families"
PACKAGE = json.loads((PACKAGE_DIR / "U-RECOVERED-CARD-FAMILIES.package.v2.json").read_text(encoding="utf-8"))
PRODUCT = json.loads((PACKAGE_DIR / "product-contract.v1.json").read_text(encoding="utf-8"))


def git_blob_sha1(data: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\0" + data).hexdigest()


class NativeSuccessorInvariantTests(unittest.TestCase):
    def test_exact_successor_and_source_tuple(self):
        self.assertEqual(PACKAGE["successor_of"]["head"], "5df944f3b72331fdf7a28205c328827a660b726f")
        self.assertEqual(PACKAGE["successor_of"]["tree"], "0e5b9b8cfd124084f9d08db9e74b83e16931033a")
        self.assertEqual(PACKAGE["source_authority"]["head"], "8f46f068ba41dab4dca538806d11693c8c0d3042")
        self.assertEqual(PACKAGE["source_authority"]["tree"], "a1739a4881262c2db9acd679e7b962a969ab5968")
        exact = {
            "RelatedCardLayout": ("site/src/lib/relatedCardLayout.mjs", "da5dee098242c9842190f1ab21bfd440397c5813"),
            "EventLayout": ("site/src/layouts/EventLayout.astro", "f90eb29949841f72755254e52d58912fc6f27b2e"),
            "FestivalTimelinePage": ("site/src/pages/festivali/index.astro", "4fbd5dd9fde70b9e1b71a5bfa11bc193d4b6e785"),
            "InterestClubCard": ("site/src/components/InterestClubCard.astro", "58fbb987379b35fda7faaadd49042fb1abb18989"),
            "AmberRailArtifact": ("site/src/components/listings/AmberRailArtifact.astro", "74399ec3d49b7069eac4eca20e8adea5d3c862d6"),
            "ArtifactCollection": ("site/src/components/artifacts/ArtifactCollection.astro", "914e0bf8fc092c925f040bfa8b721ba513368e54"),
            "CollectionCatalog": ("site/src/pages/podborki/index.astro", "1a3dc3e2fb6d1df644625d2f2578b3042b3406bb"),
            "EventCard": ("site/src/components/EventCard.astro", "e7b299660572dda731ca15bd5052b3bf5714cd7c"),
        }
        actual = {item["role"]: (item["path"], item["git_blob_sha1"]) for item in PACKAGE["source_authority"]["files"]}
        self.assertEqual(actual, exact)

    def test_all_five_product_families_are_preserved_exactly(self):
        package_units = {unit["unit_id"]: unit for unit in PACKAGE["page_units"]}
        product_families = {family["family_id"]: family for family in PRODUCT["families"]}
        self.assertEqual(set(package_units), set(product_families))
        self.assertEqual(len(package_units), 5)
        for family_id, frozen in product_families.items():
            component = package_units[family_id]["components"][0]
            for key in ("anatomy", "states", "responsive_behavior", "explicit_difference_from_eventcard"):
                self.assertEqual(component[key], frozen[key], f"{family_id}:{key}")
            self.assertEqual([item["state"] for item in package_units[family_id]["specimens"]], frozen["states"])
            self.assertEqual(
                package_units[family_id]["managed_nodes_expected"],
                1 + len(package_units[family_id]["components"]) + len(package_units[family_id]["specimens"]),
            )
        self.assertEqual(PACKAGE["acceptance"]["linked_visible_specimens"], 23)
        self.assertEqual(PACKAGE["acceptance"]["maximum_managed_nodes"], 38)
        self.assertNotIn("cover-ready-future", json.dumps(PACKAGE, ensure_ascii=False))

    def test_executor_is_concrete_native_not_metadata_ensure(self):
        runtime = (SCRIPT_DIR / "native_runtime_v2.js").read_text(encoding="utf-8")
        entry = (SCRIPT_DIR / "native_executor_v2.js").read_text(encoding="utf-8")
        for needle in (
            "penpot.createPage()", "penpot.createBoard()", "penpot.createText(text)", "penpot.createEllipse()",
            "board.addFlexLayout()", "penpot.library.local.createComponent([master])", "component.instance()",
            "makeCompactMaster", "makeFestivalMaster", "makeClubMaster", "makeArtifactMaster", "makeCollectionMaster",
        ):
            self.assertIn(needle, runtime)
        self.assertIn("runNativePackage", entry)
        self.assertNotRegex(runtime, r"penpot\s*\.\s*ensure\s*\(")
        self.assertNotRegex(entry, r"penpot\s*\.\s*ensure\s*\(")
        self.assertNotRegex(runtime, r"\.detach\s*\(")
        self.assertNotRegex(runtime, r"createImage|screenshot-as-design|placeholder", re.IGNORECASE)
        self.assertTrue(PACKAGE["native_materialization"]["metadata_only_execution_removed"])
        self.assertFalse(PACKAGE["native_materialization"]["penpot_ensure_used"])
        self.assertFalse(PACKAGE["native_materialization"]["placeholder_geometry"])

    def test_strict_string_only_shared_plugin_data(self):
        runtime = (SCRIPT_DIR / "native_runtime_v2.js").read_text(encoding="utf-8")
        double = (ROOT / "tests/asp-production-conveyor-v3/u0/recovered-card-families/test_native_executor_v2.js").read_text(encoding="utf-8")
        self.assertIn("typeof value !== 'string'", runtime)
        self.assertIn("assert.equal(typeof value, 'string'", double)
        self.assertNotIn("String(value)", runtime)
        self.assertNotIn("String(value)", double)

    def test_replay_and_integrity_gates_are_executed(self):
        test_source = (ROOT / "tests/asp-production-conveyor-v3/u0/recovered-card-families/test_native_executor_v2.js").read_text(encoding="utf-8")
        for needle in (
            "const first = await run", "const second = await run", "assert.equal(second.created, 0)",
            "DUPLICATE_PAGE", "DETACHED_INSTANCES", "SCREENSHOT_SHAPES", "PROTECTED_PROJECTION_CHANGED",
            "source-lineage", "linked visible specimens",
        ):
            self.assertIn(needle, test_source)
        self.assertEqual(PACKAGE["execution"]["second_run_created"], 0)
        self.assertEqual(PACKAGE["acceptance"]["duplicates"], 0)
        self.assertEqual(PACKAGE["acceptance"]["detached_instances"], 0)
        self.assertEqual(PACKAGE["acceptance"]["screenshot_shapes"], 0)
        self.assertEqual(PACKAGE["acceptance"]["protected_projection_changes"], 0)

    def test_state_projection_and_global_image_gates_are_concrete(self):
        runtime = (SCRIPT_DIR / "native_runtime_v2.js").read_text(encoding="utf-8")
        node_test = (ROOT / "tests/asp-production-conveyor-v3/u0/recovered-card-families/test_native_executor_v2.js").read_text(encoding="utf-8")
        for state in (state for family in PRODUCT["families"] for state in family["states"]):
            self.assertIn(state, runtime, state)
        for required in (
            "managedProjection", "MANAGED_REPLAY_PROJECTION_CHANGED", "shape.type || '').toLowerCase() === 'image'",
            "hasImageFill(shape)", "fillImage", "borderRadius", "pluginData", "component:", "flex:",
            "shadows:", "shadowProjection", "fontFamily", "fontVariantId", "fontStyle", "letterSpacing",
            "textTransform", "textDecoration", "direction", "verticalAlign", "blendMode", "backgroundBlur",
            "layoutChildProjection", "layoutCellProjection", "tokenProjection", "topPadding", "horizontalSizing",
            "getSharedPluginDataNamespaces", "SHARED_PLUGIN_NAMESPACE_ENUMERATION_REQUIRED",
        ):
            self.assertIn(required, runtime)
        self.assertNotIn("PROJECTION_PLUGIN_KEYS", runtime)
        for required in (
            "document-bounded-cover", "visual-media", "document-media", "future-meetings", "reduced-motion",
            "collecting", "found-badge').visible, false", "new Shape('image')", "fillImage:",
            "MANAGED_REPLAY_PROJECTION_CHANGED", "corrupt-shadow", "Untagged nested component copy",
            "foreign-owner-namespace", "SHARED_PLUGIN_NAMESPACE_ENUMERATION_REQUIRED",
        ):
            self.assertIn(required, node_test)

    def test_atlas_extension_request_is_exact_and_order_remains_o0_only(self):
        request = (PACKAGE_DIR / "ASP_ATLAS_EXTENSION_REQUEST_V1.md").read_bytes()
        self.assertEqual(len(request), 995)
        self.assertEqual(git_blob_sha1(request), "1ecbada6d8159723f2d5618b8f809af1e4ad1653")
        self.assertEqual(hashlib.sha256(request).hexdigest(), "b9b7e3264ef59f6fa0fd93b1d1c69666a7212eece763bb02acca990d27c68b55")
        text = request.decode("utf-8")
        self.assertIn("page_order_assignment: O0_ONLY", text)
        self.assertNotRegex(text, r"(?m)^page_order:")
        self.assertFalse(PACKAGE["native_materialization"]["page_order_assignment"])
        self.assertEqual(PACKAGE["execution_gates"]["atlas_extension_binding"], "PENDING")
        self.assertEqual(PACKAGE["authorization"]["status"], "ATLAS_EXTENSION_PENDING")

    def test_boundaries_and_authorization_fail_closed(self):
        self.assertEqual(PACKAGE["boundaries"]["penpot_reads_by_u0"], 0)
        self.assertEqual(PACKAGE["boundaries"]["penpot_mutations_by_u0"], 0)
        self.assertTrue(PACKAGE["boundaries"]["atlas_r2_read_only"])
        self.assertFalse(PACKAGE["boundaries"]["kaggle_used"])
        self.assertFalse(PACKAGE["authorization"]["penpot_execution_authorized"])
        self.assertFalse(PACKAGE["authorization"]["promotion_authorized"])
        self.assertEqual(PACKAGE["authorization"]["visual_acceptance"], "PENDING_V0")


if __name__ == "__main__":
    unittest.main()
