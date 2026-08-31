#!/usr/bin/env python3
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path
from typing import Any
INDEX_REL = Path('catalog/asp-production-conveyor-v3/u0/small-pages/U-SMALL-PAGE-PRODUCER-SPRINT.index.v1.json')
SCHEMA = 'kenigevents.asp-u0-small-page-package.v1'
OUT_SCHEMA = 'kenigevents.u0-small-page-mat-input.v1'
SOURCE_COMMIT = '7b44306b0b58889506b987627fffb3848aa00ed6'
SOURCE_TREE = '1e1383589bcaa68a3173bfb5ec86714ef8408f18'
BRANCH = 'u0/small-page-producer-sprint-v1'
BASE_HEAD = 'c2d6ff107c632311d1c1d0cb1b74d7eb0a465b18'
FILE_ID = '40e06342-8830-80d6-8008-8fc8a3a4cd4f'
WRITER = '/root/publish_r2'
REQ_SHA = '54002c01430d48d836af491a09f493526c309e0779c2c6f0deedbf434975cf72'
POLICY_COMMENT = 5483175166
ORDER = ['U-CONTROLS-BUTTONS-SMALL-PAGE', 'U-CONTROLS-INPUT-STATUS-SMALL-PAGE', 'U-CONTROLS-ACTIONS-SMALL-PAGE', 'U-FREE-DESKTOP-ROWS-SMALL-PAGE', 'U-FREE-MOBILE-GROUPS-SMALL-PAGE', 'U-SHELL-HEADER-NAVIGATION-SMALL-PAGE', 'U-SHELL-FOOTER-BREADCRUMBS-SMALL-PAGE']
COUNTS = {ORDER[0]: (1, 14), ORDER[1]: (3, 19), ORDER[2]: (3, 17), ORDER[3]: (3, 7), ORDER[4]: (3, 7), ORDER[5]: (3, 16), ORDER[6]: (3, 14)}
PAGES = {ORDER[0]: '04.1 · Controls · Buttons · Candidate', ORDER[1]: '04.2 · Controls · Inputs & status · Candidate', ORDER[2]: '04.3 · Controls · Copy & event actions · Candidate', ORDER[3]: '05.1 · Free collection · Desktop rows · Candidate', ORDER[4]: '05.2 · Free collection · Mobile groups · Candidate', ORDER[5]: '06.1 · Shell · Header & navigation · Candidate', ORDER[6]: '06.2 · Shell · Footer & breadcrumbs · Candidate'}
FIXTURES = {'events': ['event.real.8006', 'event.real.8200'], 'exhibitions': ['event.real.2182', 'event.real.6711', 'event.real.7609']}

class ContractError(ValueError):
    pass

def need(condition: bool, message: str) -> None:
    if not condition:
        raise ContractError(message)

def read_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError) as exc:
        raise ContractError(f'cannot read JSON {path}: {exc}') from exc
    need(isinstance(value, dict), 'top-level object required')
    return value

def render(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + '\n'

def validate_index(index: dict[str, Any]) -> None:
    need(index.get('schema_version') == 'kenigevents.asp-u0-small-page-sprint-index.v1', 'index schema')
    need(index.get('owner') == 'U0' and index.get('status') == 'READY_FOR_D0_INTEGRATE', 'index lifecycle')
    binding = index.get('branch_binding', {})
    need(binding.get('branch') == BRANCH and binding.get('base_head') == BASE_HEAD, 'index branch')
    policy = index.get('page_wave_policy', {})
    need(policy.get('source_comment') == POLICY_COMMENT, 'index policy source')
    need(policy.get('component_families_max_per_page') == 3, 'index family limit')
    need(policy.get('review_instances_typical_max_per_page') == 24, 'index instance limit')
    need(policy.get('candidate_roots_per_page') == 1, 'index roots')
    source = index.get('source_authority', {})
    need(source.get('commit') == SOURCE_COMMIT and source.get('tree') == SOURCE_TREE, 'index source')
    need(index.get('requirements_contract', {}).get('sha256') == REQ_SHA, 'index requirements')
    entries = index.get('packages', [])
    need([row.get('package_id') for row in entries] == ORDER, 'index package order')
    need([row.get('order') for row in entries] == list(range(1, 8)), 'index ordinals')
    need(len({row.get('path') for row in entries}) == 7, 'duplicate package path')
    need(len({row.get('target_page') for row in entries}) == 7, 'duplicate target page')
    for row in entries:
        package_id = row['package_id']
        need((row.get('family_count'), row.get('review_instance_count')) == COUNTS[package_id], f'{package_id}: index census')
        need(row.get('target_page') == PAGES[package_id], f'{package_id}: index page')
        need(isinstance(row.get('bytes'), int) and row['bytes'] > 0, f'{package_id}: index bytes')
        digest = row.get('sha256', '')
        need(len(digest) == 64 and all((c in '0123456789abcdef' for c in digest)), f'{package_id}: index digest')
    totals = index.get('totals', {})
    need((totals.get('packages'), totals.get('pages')) == (7, 7), 'index totals')
    need((totals.get('controls_component_families'), totals.get('controls_review_instances')) == (7, 50), 'controls totals')
    need(totals.get('review_instances') == 94, 'review total')
    independent = index.get('independence', {})
    need(independent.get('all_packages_independently_integratable') is True, 'not independently integratable')
    need(independent.get('one_failure_blocks_other_packages') is False, 'all-or-nothing wave')
    need(independent.get('eventcard_visual_repair_blocks_candidate_materialization') is False, 'EventCard blocks candidate wave')
    need(independent.get('sole_penpot_writer') == WRITER, 'writer drift')
    need(independent.get('penpot_mutations_by_u0') == 0, 'U0 Penpot mutation')

def validate_package(package: dict[str, Any]) -> None:
    package_id = package.get('package_id')
    need(package_id in COUNTS, 'unknown package')
    need(package.get('schema_version') == SCHEMA, f'{package_id}: schema')
    need(package.get('owner') == 'U0' and package.get('status') == 'READY_FOR_D0_INTEGRATE', f'{package_id}: lifecycle')
    binding = package.get('branch_binding', {})
    need(binding.get('branch') == BRANCH and binding.get('base_head') == BASE_HEAD, f'{package_id}: branch')
    life = package.get('lifecycle', {})
    need(life.get('ready_for_d0_integrate') is True, f'{package_id}: not ready')
    need(life.get('ready_to_publish') is False, f'{package_id}: U0 self-publish')
    need(life.get('promotion_authorized') is False, f'{package_id}: U0 promotion')
    need(life.get('penpot_mutations_by_u0') == 0 and life.get('astro_mutations_by_u0') == 0, f'{package_id}: U0 mutation')
    need(life.get('sole_penpot_writer') == WRITER, f'{package_id}: writer')
    policy = package.get('page_wave_policy', {})
    need(policy.get('source_comment') == POLICY_COMMENT, f'{package_id}: policy source')
    need(policy.get('component_families_max') == 3 and policy.get('review_instances_typical_max') == 24, f'{package_id}: page limits')
    need(policy.get('candidate_roots') == 1 and policy.get('empty_or_setup_only_page') is False and (policy.get('mega_page') is False), f'{package_id}: page shape')
    scope = package.get('scope', {})
    families, instances = (scope.get('component_families', []), scope.get('review_instances', []))
    need((len(families), len(instances)) == COUNTS[package_id], f'{package_id}: exact census')
    need(scope.get('family_count') == len(families) and scope.get('review_instance_count') == len(instances), f'{package_id}: declared census')
    need(len(set(families)) == len(families) and len(set(instances)) == len(instances), f'{package_id}: duplicate specimen')
    target = package.get('target', {})
    need(target.get('file_id') == FILE_ID and target.get('exact_page_name') == PAGES[package_id], f'{package_id}: target')
    need(target.get('candidate_label') == 'CANDIDATE_BUILD_NOT_ACCEPTED', f'{package_id}: label')
    need(target.get('protected_free_page_mutation') is False, f'{package_id}: protected mutation')
    source = package.get('source_authority', {})
    need(source.get('commit') == SOURCE_COMMIT and source.get('tree') == SOURCE_TREE, f'{package_id}: source')
    need(all((len(row.get('git_blob_sha1', '')) == 40 for row in source.get('files', []))), f'{package_id}: source blob')
    need(package.get('requirements_contract', {}).get('sha256') == REQ_SHA, f'{package_id}: requirements')
    materializer = package.get('materialization_entry_point', {})
    need(materializer.get('consumer') == 'D0/MAT_THEN_D0_PUBLISH', f'{package_id}: consumer')
    need(materializer.get('penpot_adapter_included') is False, f'{package_id}: U0 adapter')
    need(bool(package.get('nonempty_proof')), f'{package_id}: empty package')
    if package_id in {ORDER[3], ORDER[4]}:
        dep = package.get('eventcard_dependency', {})
        need(scope.get('fixture_order') == FIXTURES, f'{package_id}: fixtures')
        need(dep.get('candidate_materialization_waits_for_eventcard_visual_repair') is False, f'{package_id}: waits for EventCard')
        need(dep.get('promotion_waits_for_eventcard_visual_pass') is True and dep.get('new_eventcard_masters') == 0, f'{package_id}: EventCard gate')
    if package_id == ORDER[2]:
        dep = package.get('eventcard_repair_dependency', {})
        need(dep.get('blocking_for_candidate_page') is False and dep.get('blocking_for_promotion') is True, f'{package_id}: EventCard dependency')
        need(package.get('asset_contract', {}).get('fallback') is False, f'{package_id}: asset fallback')
    if package_id.startswith('U-SHELL-'):
        dep = package.get('eventcard_dependency', {})
        need(dep.get('blocking_for_candidate_page') is False and dep.get('blocking_for_promotion') is False, f'{package_id}: shell EventCard gate')

def load_repository(repo: Path) -> tuple[dict[str, Any], dict[str, dict[str, Any]]]:
    index = read_json(repo / INDEX_REL)
    validate_index(index)
    packages = {}
    for row in index['packages']:
        package = read_json(repo / row['path'])
        validate_package(package)
        packages[package['package_id']] = package
    return (index, packages)

def verify_repository_inputs(repo: Path, index: dict[str, Any]) -> dict[str, dict[str, Any]]:
    receipt = {}
    for row in index['packages']:
        raw = (repo / row['path']).read_bytes()
        need(hashlib.sha256(raw).hexdigest() == row['sha256'], f"{row['package_id']}: hash mismatch")
        need(len(raw) == row['bytes'], f"{row['package_id']}: byte mismatch")
        receipt[row['package_id']] = {'path': row['path'], 'sha256': row['sha256'], 'bytes': row['bytes']}
    return receipt

def compile_materializer_input(index: dict[str, Any], packages: dict[str, dict[str, Any]], selected: list[str]) -> dict[str, Any]:
    return {'schema_version': OUT_SCHEMA, 'sprint_id': index['sprint_id'], 'selected_package_ids': selected, 'packages': [{'package_id': package_id, 'priority': packages[package_id]['priority'], 'target': packages[package_id]['target'], 'scope': packages[package_id]['scope'], 'source_authority': packages[package_id]['source_authority'], 'preflight': packages[package_id]['materialization_entry_point']['required_preflight'], 'postflight': packages[package_id]['materialization_entry_point']['required_postflight']} for package_id in selected], 'execution_contract': {'independent_verdict_per_package': True, 'one_failure_blocks_other_packages': False, 'eventcard_repair_blocks_candidate_wave': False, 'penpot_writer': WRITER, 'u0_penpot_mutations': 0}}

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--repo', type=Path, default=Path.cwd())
    parser.add_argument('--package-id', action='append', default=[])
    parser.add_argument('--check-repository-inputs', action='store_true')
    parser.add_argument('--emit', default='-')
    args = parser.parse_args()
    index, packages = load_repository(args.repo.resolve())
    requested = args.package_id or ['all']
    selected = ORDER if requested == ['all'] else requested
    need(all((item in packages for item in selected)), 'unknown requested package')
    compiled = compile_materializer_input(index, packages, selected)
    if args.check_repository_inputs:
        compiled['repository_verification'] = {key: value for key, value in verify_repository_inputs(args.repo.resolve(), index).items() if key in selected}
    output = render(compiled)
    if args.emit == '-':
        print(output, end='')
    else:
        Path(args.emit).write_text(output, encoding='utf-8')
    return 0
if __name__ == '__main__':
    raise SystemExit(main())
