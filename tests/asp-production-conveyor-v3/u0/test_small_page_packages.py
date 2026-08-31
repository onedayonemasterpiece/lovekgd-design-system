#!/usr/bin/env python3
from __future__ import annotations
import copy
import importlib.util
import json
from pathlib import Path
import unittest
REPO = Path(__file__).resolve().parents[3]
SCRIPT = REPO / 'scripts/asp-production-conveyor-v3/u0/compile_small_page_packages.py'
INDEX = REPO / 'catalog/asp-production-conveyor-v3/u0/small-pages/U-SMALL-PAGE-PRODUCER-SPRINT.index.v1.json'
spec = importlib.util.spec_from_file_location('u0_small_pages', SCRIPT)
assert spec and spec.loader
compiler = importlib.util.module_from_spec(spec)
spec.loader.exec_module(compiler)

class SmallPagePackagesTest(unittest.TestCase):

    def setUp(self) -> None:
        self.index = json.loads(INDEX.read_text(encoding='utf-8'))
        self.packages = {row['package_id']: json.loads((REPO / row['path']).read_text(encoding='utf-8')) for row in self.index['packages']}

    def reject_package(self, value: dict, fragment: str) -> None:
        with self.assertRaises(compiler.ContractError) as error:
            compiler.validate_package(value)
        self.assertIn(fragment, str(error.exception))

    def reject_index(self, value: dict, fragment: str) -> None:
        with self.assertRaises(compiler.ContractError) as error:
            compiler.validate_index(value)
        self.assertIn(fragment, str(error.exception))

    def test_01_exact_bytes_and_all_packages_validate(self) -> None:
        compiler.validate_index(self.index)
        receipt = compiler.verify_repository_inputs(REPO, self.index)
        self.assertEqual(list(receipt), compiler.ORDER)
        for package in self.packages.values():
            compiler.validate_package(package)

    def test_02_controls_split_preserves_all_fifty_specimens(self) -> None:
        ids = compiler.ORDER[:3]
        self.assertEqual([self.packages[item]['scope']['review_instance_count'] for item in ids], [14, 19, 17])
        self.assertEqual(sum((self.packages[item]['scope']['review_instance_count'] for item in ids)), 50)
        self.assertEqual(sum((self.packages[item]['scope']['family_count'] for item in ids)), 7)

    def test_03_every_page_is_small_nonempty_and_unique(self) -> None:
        pages = set()
        roots = set()
        for package in self.packages.values():
            self.assertLessEqual(package['scope']['family_count'], 3)
            self.assertLessEqual(package['scope']['review_instance_count'], 24)
            self.assertGreater(package['scope']['review_instance_count'], 0)
            self.assertEqual(package['page_wave_policy']['candidate_roots'], 1)
            self.assertFalse(package['page_wave_policy']['empty_or_setup_only_page'])
            self.assertFalse(package['page_wave_policy']['mega_page'])
            pages.add(package['target']['exact_page_name'])
            roots.add(package['target']['root_name'])
        self.assertEqual((len(pages), len(roots)), (7, 7))

    def test_04_desktop_and_mobile_share_factual_order_without_new_masters(self) -> None:
        for package_id in compiler.ORDER[3:5]:
            package = self.packages[package_id]
            self.assertEqual(package['scope']['fixture_order'], compiler.FIXTURES)
            self.assertEqual(package['nonempty_proof']['linked_eventcards'], 5)
            dependency = package['eventcard_dependency']
            self.assertFalse(dependency['candidate_materialization_waits_for_eventcard_visual_repair'])
            self.assertTrue(dependency['promotion_waits_for_eventcard_visual_pass'])
            self.assertEqual(dependency['new_eventcard_masters'], 0)

    def test_05_shell_pages_have_no_eventcard_gate(self) -> None:
        for package_id in compiler.ORDER[5:]:
            dependency = self.packages[package_id]['eventcard_dependency']
            self.assertFalse(dependency['blocking_for_candidate_page'])
            self.assertFalse(dependency['blocking_for_promotion'])

    def test_06_header_uses_current_reference4_blob_and_no_selected_free_state(self) -> None:
        package = self.packages[compiler.ORDER[5]]
        blobs = {row['path']: row['git_blob_sha1'] for row in package['source_authority']['files']}
        self.assertEqual(blobs['site/src/components/Reference4MobileMenu.astro'], '05c9d4ea7ef5d912ce4b571c7d4b92a4e3b4aeb2')
        self.assertTrue(package['navigation_contract']['current_route_literal_mismatch']['preserve_no_selected_state'])

    def test_07_action_assets_are_exact_and_have_no_fallback(self) -> None:
        assets = self.packages[compiler.ORDER[2]]['asset_contract']
        self.assertFalse(assets['fallback'])
        self.assertEqual(assets['icon.action.copy'], {'bytes': 405, 'sha256': '48710ac3735ed6a66aa775294d266f68800c140641dee0ed1029a85cb48cd049'})
        self.assertEqual(assets['icon.status.check'], {'bytes': 230, 'sha256': '3baf2a43953c61ce4d654002042c682ef9ecca73baff7d527359d170a6a40558'})

    def test_08_compiler_is_deterministic_and_independent(self) -> None:
        first = compiler.render(compiler.compile_materializer_input(self.index, self.packages, compiler.ORDER))
        second = compiler.render(compiler.compile_materializer_input(copy.deepcopy(self.index), copy.deepcopy(self.packages), list(compiler.ORDER)))
        self.assertEqual(first, second)
        output = json.loads(first)
        self.assertEqual(output['schema_version'], compiler.OUT_SCHEMA)
        self.assertFalse(output['execution_contract']['one_failure_blocks_other_packages'])
        self.assertFalse(output['execution_contract']['eventcard_repair_blocks_candidate_wave'])

    def test_09_page_limit_tampering_fails_closed(self) -> None:
        broken = copy.deepcopy(self.packages[compiler.ORDER[0]])
        broken['scope']['component_families'].append('extra')
        self.reject_package(broken, 'exact census')
        broken = copy.deepcopy(self.packages[compiler.ORDER[1]])
        broken['scope']['review_instances'].extend([f'extra.{i}' for i in range(6)])
        self.reject_package(broken, 'exact census')
        broken = copy.deepcopy(self.packages[compiler.ORDER[5]])
        broken['page_wave_policy']['empty_or_setup_only_page'] = True
        self.reject_package(broken, 'page shape')

    def test_10_duplicate_page_and_all_or_nothing_fail_closed(self) -> None:
        broken = copy.deepcopy(self.index)
        broken['packages'][1]['target_page'] = broken['packages'][0]['target_page']
        self.reject_index(broken, 'duplicate target page')
        broken = copy.deepcopy(self.index)
        broken['independence']['one_failure_blocks_other_packages'] = True
        self.reject_index(broken, 'all-or-nothing wave')

    def test_11_eventcard_and_shell_dependency_tampering_fails_closed(self) -> None:
        broken = copy.deepcopy(self.packages[compiler.ORDER[3]])
        broken['eventcard_dependency']['candidate_materialization_waits_for_eventcard_visual_repair'] = True
        self.reject_package(broken, 'waits for EventCard')
        broken = copy.deepcopy(self.packages[compiler.ORDER[5]])
        broken['eventcard_dependency']['blocking_for_candidate_page'] = True
        self.reject_package(broken, 'shell EventCard gate')

    def test_12_u0_cannot_publish_promote_mutate_or_embed_adapter(self) -> None:
        broken = copy.deepcopy(self.packages[compiler.ORDER[6]])
        broken['lifecycle']['ready_to_publish'] = True
        self.reject_package(broken, 'U0 self-publish')
        broken = copy.deepcopy(self.packages[compiler.ORDER[4]])
        broken['lifecycle']['promotion_authorized'] = True
        self.reject_package(broken, 'U0 promotion')
        broken = copy.deepcopy(self.packages[compiler.ORDER[2]])
        broken['materialization_entry_point']['penpot_adapter_included'] = True
        self.reject_package(broken, 'U0 adapter')
        broken = copy.deepcopy(self.packages[compiler.ORDER[0]])
        broken['lifecycle']['penpot_mutations_by_u0'] = 1
        self.reject_package(broken, 'U0 mutation')
if __name__ == '__main__':
    unittest.main()
