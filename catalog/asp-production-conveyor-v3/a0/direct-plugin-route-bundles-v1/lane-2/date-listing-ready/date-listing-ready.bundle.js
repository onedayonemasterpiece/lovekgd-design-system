(function(root){
'use strict';
const DATA={"additional_record_sources":[{"field":"record_sha256","name":"date-replay-data"}],"atlas_authorization":{"branch":"d0/atlas-r2-medallions-balance-evidence-v1-20260902","bundle_readiness_is_not_penpot_execution_authorization":true,"comment":5506769941,"future_visual_pass_implied":false,"head":"9c2f0578cc58c2e490248a66bfe6e8297ab9410c","initial_batch_max_new_pages":3,"parent":"0fbfd4839343de71d5128b2e9c2ad232dde6abf4","tree":"c22812886dd41578364808d56e2915e7df1ad2aa"},"callability_contract_comments":[5506830213,5506836084],"content_kind":"DATE_COMPOSED","dependency_specs":[{"exact_tuple_required":true,"key":"u0.component.shared-header","semantic_id":"u0.component.shared-header"},{"exact_tuple_required":true,"key":"u0.component.date-listing","semantic_id":"u0.component.date-listing"},{"exact_tuple_required":true,"key":"u0.component.event-card","semantic_id":"u0.component.event-card"},{"exact_tuple_required":true,"key":"u0.component.shared-footer","semantic_id":"u0.component.shared-footer"},{"exact_tuple_required":true,"key":"u0.component.mobile-bottom-navigation","semantic_id":"u0.component.mobile-bottom-navigation"}],"exact_tuple":{"evidence_only_representations":[{"fixture_ids":["event.real.4240","event.real.8006","event.real.8200"],"fixture_semantics":"REFERENCE_ONLY_NOT_ROUTE_MEMBERSHIP","projection_ref":null,"representation":"stress","scenario_id":"a0.date.stress.desktop.v1","shell":"date-listing-stress","viewport":{"height":1000,"id":"desktop","width":1280}}],"execution_states":[{"fixture_ids":["event.real.8006"],"fixture_semantics":"EXACT_PROJECTION_MEMBERSHIP","projection_ref":"date.tomorrow.2026-09-02","representation":"typical","scenario_id":"a0.date.typical.desktop.v1","shell":"date-listing-body-crop","state":"ready","viewport":{"height":900,"id":"desktop","width":1280}},{"fixture_ids":["event.real.8006"],"fixture_semantics":"EXACT_PROJECTION_MEMBERSHIP","projection_ref":"date.tomorrow.2026-09-02","representation":"typical","scenario_id":"a0.date.typical.mobile.v1","shell":"date-listing-body-crop","state":"ready","viewport":{"height":844,"id":"mobile","width":390}},{"fixture_ids":["event.real.8200"],"fixture_semantics":"EXACT_PROJECTION_MEMBERSHIP","projection_ref":"date.explicit.2026-09-06","representation":"sparse","scenario_id":"a0.date.sparse.desktop.v1","shell":"date-listing-body-crop","state":"ready","viewport":{"height":760,"id":"desktop","width":1280}},{"fixture_ids":["event.real.8006"],"fixture_semantics":"EXACT_PROJECTION_MEMBERSHIP","projection_ref":"date.tomorrow.2026-09-02","representation":"full-page-shell","scenario_id":"a0.date.full.desktop.v1","shell":"desktop-v1","state":"ready","viewport":{"height":900,"id":"desktop","width":1280}},{"fixture_ids":["event.real.8006"],"fixture_semantics":"EXACT_PROJECTION_MEMBERSHIP","projection_ref":"date.tomorrow.2026-09-02","representation":"full-page-shell","scenario_id":"a0.date.full.mobile.v1","shell":"mobile-v1-menu-bottom-nav","state":"ready","viewport":{"height":844,"id":"mobile","width":390}}],"projection_role":"READY","projection_sources":{"a0_correction_payload_sha":"d85b38c7883d53f43b628d885513c5851c164b25","canonical_corpus_sha256":"b1746f0cd68be6dd6060858fb765c6863535aefbcf4844b9b50c279d69e9306a"},"routes":["/segodnya/","/zavtra/","/date-2026-09-06/"],"selected_representations":[{"fixture_ids":["event.real.8006"],"projection_ref":"date.tomorrow.2026-09-02","representation":"typical","scenario_id":"a0.date.typical.desktop.v1","shell":"date-listing-body-crop","viewport":{"height":900,"id":"desktop","width":1280}},{"fixture_ids":["event.real.8006"],"projection_ref":"date.tomorrow.2026-09-02","representation":"typical","scenario_id":"a0.date.typical.mobile.v1","shell":"date-listing-body-crop","viewport":{"height":844,"id":"mobile","width":390}},{"fixture_ids":["event.real.8200"],"projection_ref":"date.explicit.2026-09-06","representation":"sparse","scenario_id":"a0.date.sparse.desktop.v1","shell":"date-listing-body-crop","viewport":{"height":760,"id":"desktop","width":1280}},{"fixture_ids":["event.real.8006"],"projection_ref":"date.tomorrow.2026-09-02","representation":"full-page-shell","scenario_id":"a0.date.full.desktop.v1","shell":"desktop-v1","viewport":{"height":900,"id":"desktop","width":1280}},{"fixture_ids":["event.real.8006"],"projection_ref":"date.tomorrow.2026-09-02","representation":"full-page-shell","scenario_id":"a0.date.full.mobile.v1","shell":"mobile-v1-menu-bottom-nav","viewport":{"height":844,"id":"mobile","width":390}}],"source_projections":[{"date":"2026-09-01","fixture_ids":["event.real.4240"],"membership_basis":"start_date_exact","projection_id":"date.today.2026-09-01","projection_sha256":"2bc98e1a727ab3936912950a0e087232d4dbcf7bfa601ff7da95a231855b6b58","route":"/segodnya/"},{"date":"2026-09-02","fixture_ids":["event.real.8006"],"membership_basis":"start_date_exact","projection_id":"date.tomorrow.2026-09-02","projection_sha256":"c2377b3b22436b1e7259ab40bc543ae01badc27200ee13932a75b02386ee2c42","route":"/zavtra/"},{"date":"2026-09-06","fixture_ids":["event.real.8200"],"membership_basis":"start_date_exact","projection_id":"date.explicit.2026-09-06","projection_sha256":"08877f7ddca78649243bc6cfb4ed2c83e644be7c683cb087ea88e66e750e6b79","route":"/date-2026-09-06/"}]},"factual_bytes_changed":0,"job_id":"A0-DIRECT-PLUGIN-DATE-LISTING-READY-V1","lane":"lane-2","limits":{"max_creates_per_invocation":3,"second_terminal_replay_created":0},"missing_dependency_action":"ABORT; NO_SUBSTITUTE_EVENT_CARDS_OR_SHELL","page_contract":{"candidate_roots":1,"desktop_mobile_side_by_side":true,"external_component_substitution":"FORBIDDEN","native_structure":"createPage + one createBoard root + two native component mains + exact semantic-region boards + two linked instances + root export","page_name":"A0 · Date Listing + Shell · Candidate","root_name":"CANDIDATE_BUILD_NOT_ACCEPTED · A0 · Date Listing + Shell","route_or_archetype_pages":1,"variants":[{"id":"desktop","scenario_id":"a0.date.full.desktop.v1","semantic_regions":["slot.shared-header","slot.date-heading","slot.date-navigation","slot.listing-body","slot.shared-footer"],"source_root_key":"a0.candidate.root.date.full.desktop.v1","viewport":{"height":900,"width":1280}},{"id":"mobile","scenario_id":"a0.date.full.mobile.v1","semantic_regions":["slot.shared-header","slot.date-heading","slot.date-navigation","slot.listing-body","slot.mobile-bottom-navigation"],"source_root_key":"a0.candidate.root.date.full.mobile.v1","viewport":{"height":844,"width":390}}]},"penpot_mutations_by_a0":0,"penpot_reads_by_a0":0,"primary_record_field":"package_record_sha256","primary_source_name":"physical-date-page-unit","projection_role":"READY","protected_projections":{"foundations":{"chars":43736,"page_id":"313fb1ed-0d5c-8095-8008-9183322ab3a9","placements":37,"rejected_scalar_sha256":"523e43cfe95df7962f8034c4dc2e9f04f02114b15ad488587c707e35b6fed8f1","root_id":"313fb1ed-0d5c-8095-8008-918a0c1473af","sha256":"1b119d154376505b8d28036cbf33e97f9009a007bf0a5a5765de2750644da1fa","utf8_bytes":43746},"free":{"chars":84033,"page_id":"c16498cb-b51d-8030-8008-904bd8fc9c53","root_ids":["313fb1ed-0d5c-8095-8008-9108df52b2ce","313fb1ed-0d5c-8095-8008-912c45090653"],"sha256":"0b00102e348367601fe35de30e06dc22b10883577a22917320955058115fc042","utf8_bytes":84034},"minimum_revision":113},"run_control":{"cancel_token":"ef5c5ad4037ce5d6d290c4c156a6ce019a7effa54ff7971e610d4fdb660c0aaf","lease_token":"db304b5c8d3aaf86c20a48598e6ad756b9a944721c5552ed244b7637011f3bb9","package_id":"A0-DIRECT-PLUGIN-DATE-LISTING-READY-V1","run_id":"9ebe2675-bb15-4804-aeb2-4a1cc39ff1d3","schema":"kenigevents.asp-run-control.v1","state":"ACTIVE_REQUIRED","writer_id":"/root/publish_r2"},"schema_version":"kenigevents.a0.direct-plugin-route-bundle-data.v1","slug":"date-listing-ready","source_package_id":"A0-PAGE-AUX-DATE_LISTING_SHELL-R1","source_package_record_sha256":"169f325feb50b65caca38cefe1a2448f46248811bd01a4b8cf7a47e32e9efb33","source_raw":{"candidate-adapter":"{\n  \"schema_version\": \"kenigevents.asp-conveyor.a0.candidate-adapter.v1\",\n  \"adapter_id\": \"A-DATE-LISTING-SHELL-CANDIDATE-ADAPTER.v1\",\n  \"package_manifest\": {\n    \"package_id\": \"A-DATE-LISTING-SHELL-CANDIDATE-ADAPTER\",\n    \"owner\": \"A0\",\n    \"priority\": \"P0\",\n    \"status\": \"READY_TO_PUBLISH\",\n    \"branch\": \"a0/asp-production-conveyor-20260831\",\n    \"sha\": \"a02a4cfb5a9d76b81b071804a0bc25c37d523803\",\n    \"paths\": [\n      \"catalog/asp-production-conveyor-v3/a0/date-listing-shell-candidate-adapter.v1.json\",\n      \"catalog/asp-production-conveyor-v3/a0/candidate-adapter.schema.json\",\n      \"tests/asp_production_conveyor_v3_a0_candidate_adapters_test.py\",\n      \"catalog/asp-production-conveyor-v3/a0/candidate-adapter-receipt.v1.json\"\n    ],\n    \"source_and_donor_lineage\": [\n      {\n        \"source\": \"A-DATE-LISTING-SHELL-REPLAY\",\n        \"disposition\": \"REUSE_CANONICAL_DATA\",\n        \"scope\": \"current seven A0 representations, current projections, fixtures and viewports\"\n      },\n      {\n        \"pr\": 42,\n        \"commit\": \"7a26772828a5d74a9683c08e7e6774ff15ac61a5\",\n        \"disposition\": \"REUSE_CANONICAL_DATA\",\n        \"scope\": \"canonical Golden Corpus data only\"\n      },\n      {\n        \"pr\": 43,\n        \"commit\": \"da16dde8812220125a806bd5a03d5015357d4c07\",\n        \"disposition\": \"REUSE_STRUCTURE_AFTER_RECONSTRUCTION\",\n        \"scope\": \"seven-representation ordering and shell case classes only; no Penpot lineage or visual status\"\n      },\n      {\n        \"pr\": 50,\n        \"commit\": \"9b8043f3bdb86fab4eee00bf94b0f10d4f029c50\",\n        \"disposition\": \"REUSE_CANONICAL_DATA\",\n        \"scope\": \"archetype.listing.date and production route identities only\"\n      }\n    ],\n    \"corpus_projection_state_tuple\": {\n      \"source_head\": \"2586a77858ba41a8107d1c74b2d2d8f9db1941c8\",\n      \"canonical_corpus_sha256\": \"b1746f0cd68be6dd6060858fb765c6863535aefbcf4844b9b50c279d69e9306a\",\n      \"a0_correction_payload_sha\": \"d85b38c7883d53f43b628d885513c5851c164b25\",\n      \"date_replay_record_sha256\": \"75ef44c4b460c8c7f5632feaad667e4f5a80f01063874286da0001ceeda96023\",\n      \"projection_sha256_by_id\": {\n        \"date.today.2026-09-01\": \"2bc98e1a727ab3936912950a0e087232d4dbcf7bfa601ff7da95a231855b6b58\",\n        \"date.tomorrow.2026-09-02\": \"c2377b3b22436b1e7259ab40bc543ae01badc27200ee13932a75b02386ee2c42\",\n        \"date.explicit.2026-09-06\": \"08877f7ddca78649243bc6cfb4ed2c83e644be7c683cb087ea88e66e750e6b79\"\n      }\n    },\n    \"archetype_or_route_ids\": [\n      \"archetype.listing.date\",\n      \"/segodnya/\",\n      \"/zavtra/\",\n      \"/date-2026-09-06/\"\n    ],\n    \"dependencies\": [\n      \"A-DATE-LISTING-SHELL-REPLAY\",\n      \"U-SHARED-PATTERNS\",\n      \"U-EVENTCARD-FOUR-CASES\",\n      \"F-SHARED-FOUNDATION-BINDINGS\",\n      \"F-TYPOGRAPHY-LAYOUT\",\n      \"F-ACTION-NAV-ICONS\"\n    ],\n    \"target_penpot_page\": \"a0.candidate.page.date-listing-shell-replay.v1\",\n    \"expected_roots\": [\n      \"a0.candidate.root.date.typical.desktop.v1\",\n      \"a0.candidate.root.date.typical.mobile.v1\",\n      \"a0.candidate.root.date.sparse.desktop.v1\",\n      \"a0.candidate.root.date.state-matrix.mobile.v1\",\n      \"a0.candidate.root.date.stress.desktop.v1\",\n      \"a0.candidate.root.date.full.desktop.v1\",\n      \"a0.candidate.root.date.full.mobile.v1\"\n    ],\n    \"expected_components\": [\n      \"u0.component.date-listing\",\n      \"u0.component.event-card\",\n      \"u0.component.mobile-bottom-navigation\",\n      \"u0.component.shared-footer\",\n      \"u0.component.shared-header\",\n      \"u0.component.state-panel\"\n    ],\n    \"expected_instances\": {\n      \"semantic_pages\": 1,\n      \"scenario_roots\": 7,\n      \"event_cards_across_cases\": 8,\n      \"state_panels\": 3\n    },\n    \"materialization_entry_point\": \"D0/MAT or D0/INTEGRATE consumes build_contract.steps in order; D0/PUBLISH assigns all new Penpot identities and performs bounded pre/post readback.\",\n    \"validation\": {\n      \"schema\": \"candidate-adapter.schema.json#/$defs/candidate_adapter\",\n      \"negative_tests\": \"tests/asp_production_conveyor_v3_a0_candidate_adapters_test.py\",\n      \"visual_acceptance\": \"PENDING_V0\",\n      \"promotion_authorized\": false\n    },\n    \"astro_evidence_cases\": [\n      \"a0.date.typical.desktop.v1\",\n      \"a0.date.typical.mobile.v1\",\n      \"a0.date.sparse.desktop.v1\",\n      \"a0.date.state-matrix.mobile.v1\",\n      \"a0.date.stress.desktop.v1\",\n      \"a0.date.full.desktop.v1\",\n      \"a0.date.full.mobile.v1\"\n    ],\n    \"explicit_gaps\": [\n      \"A0 supplies no acceptance-grade component geometry; U0/F0 dependency packages are authoritative.\",\n      \"V0 visual acceptance remains pending.\",\n      \"D0 assigns every Penpot identity and must abort when dependency readback is incomplete.\"\n    ],\n    \"package_record_sha256\": \"2ac73a2448ee479d515986f0f8894b472546532f647ecb14f65b631cabece92c\"\n  },\n  \"materialization_status\": \"READY_TO_MATERIALIZE_CANDIDATE\",\n  \"acceptance_status\": \"CANDIDATE_BUILD_NOT_ACCEPTED\",\n  \"visual_acceptance\": \"PENDING_V0\",\n  \"promotion_authorized\": false,\n  \"penpot_mutations\": 0,\n  \"canonicalization\": {\n    \"algorithm\": \"RFC8785-compatible project subset: UTF-8 JSON, recursively sorted object keys, arrays preserved, no insignificant whitespace, ensure_ascii=false\",\n    \"record_hash_scope\": \"entire adapter object excluding receipts\",\n    \"idempotency_hash_scope\": \"canonical idempotency_material object\",\n    \"file_receipt_scope\": \"exact committed file bytes\"\n  },\n  \"source_inputs\": [\n    {\n      \"path\": \"catalog/asp-production-conveyor-v3/a0/date-listing-shell-replay.v1.json\",\n      \"git_commit\": \"2586a77858ba41a8107d1c74b2d2d8f9db1941c8\",\n      \"file_sha256\": \"88e4e9607fd3344b58f1e50e2c42680c14c0ca02835929584df1aefe4201393a\",\n      \"record_sha256\": \"75ef44c4b460c8c7f5632feaad667e4f5a80f01063874286da0001ceeda96023\"\n    },\n    {\n      \"path\": \"catalog/asp-production-conveyor-v3/a0/production-bundle.v1.json\",\n      \"git_commit\": \"2586a77858ba41a8107d1c74b2d2d8f9db1941c8\",\n      \"file_sha256\": \"4126d436ecec0e38210b73301a61c4a6013450fe57bc29fdb559051c34d54a0d\"\n    },\n    {\n      \"path\": \"catalog/fixtures/ui-reference-events/v2/corpus.json\",\n      \"git_commit\": \"immutable-canonical-v2-ref\",\n      \"file_sha256\": \"b1746f0cd68be6dd6060858fb765c6863535aefbcf4844b9b50c279d69e9306a\"\n    },\n    {\n      \"path\": \"catalog/page-archetypes/date-listing-shell-v1/fixture-manifest.v1.json\",\n      \"git_commit\": \"da16dde8812220125a806bd5a03d5015357d4c07\",\n      \"file_sha256\": \"4c0e3d11bf98dde644f296429ad246ff7044f6a663cb54cf770897a424f5c373\",\n      \"usage\": \"STRUCTURE_ONLY_AFTER_RECONSTRUCTION\"\n    }\n  ],\n  \"dependency_refs\": [\n    {\n      \"package_id\": \"U-SHARED-PATTERNS\",\n      \"owner\": \"U0\",\n      \"required_at\": \"MATERIALIZATION\",\n      \"a0_readiness_assertion\": \"NONE\"\n    },\n    {\n      \"package_id\": \"U-EVENTCARD-FOUR-CASES\",\n      \"owner\": \"U0\",\n      \"required_at\": \"MATERIALIZATION\",\n      \"a0_readiness_assertion\": \"NONE\"\n    },\n    {\n      \"package_id\": \"F-SHARED-FOUNDATION-BINDINGS\",\n      \"owner\": \"F0\",\n      \"required_at\": \"MATERIALIZATION\",\n      \"a0_readiness_assertion\": \"NONE\"\n    },\n    {\n      \"package_id\": \"F-TYPOGRAPHY-LAYOUT\",\n      \"owner\": \"F0\",\n      \"required_at\": \"MATERIALIZATION\",\n      \"a0_readiness_assertion\": \"NONE\"\n    },\n    {\n      \"package_id\": \"F-ACTION-NAV-ICONS\",\n      \"owner\": \"F0\",\n      \"required_at\": \"MATERIALIZATION\",\n      \"a0_readiness_assertion\": \"NONE\"\n    }\n  ],\n  \"target\": {\n    \"semantic_page_key\": \"a0.candidate.page.date-listing-shell-replay.v1\",\n    \"semantic_page_name\": \"A0 Candidate · Date Listing + Shell Replay\",\n    \"semantic_root_order\": [\n      \"a0.candidate.root.date.typical.desktop.v1\",\n      \"a0.candidate.root.date.typical.mobile.v1\",\n      \"a0.candidate.root.date.sparse.desktop.v1\",\n      \"a0.candidate.root.date.state-matrix.mobile.v1\",\n      \"a0.candidate.root.date.stress.desktop.v1\",\n      \"a0.candidate.root.date.full.desktop.v1\",\n      \"a0.candidate.root.date.full.mobile.v1\"\n    ],\n    \"identity_assignment\": \"D0_ASSIGNS_ALL_NEW_PENPOT_IDENTITIES\"\n  },\n  \"bounded_mutation_scope\": {\n    \"allowed_paths\": [\n      \"a0.candidate.page.date-listing-shell-replay.v1\",\n      \"a0.candidate.root.date.typical.desktop.v1\",\n      \"a0.candidate.root.date.typical.mobile.v1\",\n      \"a0.candidate.root.date.sparse.desktop.v1\",\n      \"a0.candidate.root.date.state-matrix.mobile.v1\",\n      \"a0.candidate.root.date.stress.desktop.v1\",\n      \"a0.candidate.root.date.full.desktop.v1\",\n      \"a0.candidate.root.date.full.mobile.v1\"\n    ],\n    \"max_semantic_pages\": 1,\n    \"max_semantic_roots\": 7,\n    \"existing_non_candidate_pages\": \"NO_MUTATION\",\n    \"acceptance_geometry\": \"NOT_OWNED_BY_A0\",\n    \"reversibility\": \"DELETE_OR_REBUILD_ONLY_ROOTS_WITH_EXACT_IDEMPOTENCY_DIGEST\"\n  },\n  \"build_contract\": {\n    \"ordering\": \"STRICT_ASCENDING_ORDER\",\n    \"steps\": [\n      {\n        \"order\": 1,\n        \"semantic_root_key\": \"a0.candidate.root.date.typical.desktop.v1\",\n        \"scenario_id\": \"a0.date.typical.desktop.v1\",\n        \"representation\": \"typical\",\n        \"viewport\": {\n          \"id\": \"desktop\",\n          \"width\": 1280,\n          \"height\": 900\n        },\n        \"projection_ref\": \"date.tomorrow.2026-09-02\",\n        \"projection_sha256\": \"c2377b3b22436b1e7259ab40bc543ae01badc27200ee13932a75b02386ee2c42\",\n        \"fixture_ids\": [\n          \"event.real.8006\"\n        ],\n        \"fixture_semantics\": \"EXACT_PROJECTION_MEMBERSHIP\",\n        \"required_states\": [\n          \"ready\"\n        ],\n        \"active_candidate_state\": \"ready\",\n        \"shell_ref\": \"date-listing-body-crop\",\n        \"shell_semantic_slots\": [\n          \"slot.date-heading\",\n          \"slot.date-navigation\",\n          \"slot.listing-body\"\n        ],\n        \"component_semantic_refs\": [\n          \"u0.component.date-listing\",\n          \"u0.component.event-card\"\n        ],\n        \"expected_instances\": {\n          \"semantic_roots\": 1,\n          \"event_card_instances\": 1,\n          \"state_panel_instances\": 0\n        },\n        \"geometry_authority\": \"CURRENT_DATE_REPLAY_VIEWPORT_ONLY; U0/F0 OWN COMPONENT_GEOMETRY\"\n      },\n      {\n        \"order\": 2,\n        \"semantic_root_key\": \"a0.candidate.root.date.typical.mobile.v1\",\n        \"scenario_id\": \"a0.date.typical.mobile.v1\",\n        \"representation\": \"typical\",\n        \"viewport\": {\n          \"id\": \"mobile\",\n          \"width\": 390,\n          \"height\": 844\n        },\n        \"projection_ref\": \"date.tomorrow.2026-09-02\",\n        \"projection_sha256\": \"c2377b3b22436b1e7259ab40bc543ae01badc27200ee13932a75b02386ee2c42\",\n        \"fixture_ids\": [\n          \"event.real.8006\"\n        ],\n        \"fixture_semantics\": \"EXACT_PROJECTION_MEMBERSHIP\",\n        \"required_states\": [\n          \"ready\"\n        ],\n        \"active_candidate_state\": \"ready\",\n        \"shell_ref\": \"date-listing-body-crop\",\n        \"shell_semantic_slots\": [\n          \"slot.date-heading\",\n          \"slot.date-navigation\",\n          \"slot.listing-body\"\n        ],\n        \"component_semantic_refs\": [\n          \"u0.component.date-listing\",\n          \"u0.component.event-card\"\n        ],\n        \"expected_instances\": {\n          \"semantic_roots\": 1,\n          \"event_card_instances\": 1,\n          \"state_panel_instances\": 0\n        },\n        \"geometry_authority\": \"CURRENT_DATE_REPLAY_VIEWPORT_ONLY; U0/F0 OWN COMPONENT_GEOMETRY\"\n      },\n      {\n        \"order\": 3,\n        \"semantic_root_key\": \"a0.candidate.root.date.sparse.desktop.v1\",\n        \"scenario_id\": \"a0.date.sparse.desktop.v1\",\n        \"representation\": \"sparse\",\n        \"viewport\": {\n          \"id\": \"desktop\",\n          \"width\": 1280,\n          \"height\": 760\n        },\n        \"projection_ref\": \"date.explicit.2026-09-06\",\n        \"projection_sha256\": \"08877f7ddca78649243bc6cfb4ed2c83e644be7c683cb087ea88e66e750e6b79\",\n        \"fixture_ids\": [\n          \"event.real.8200\"\n        ],\n        \"fixture_semantics\": \"EXACT_PROJECTION_MEMBERSHIP\",\n        \"required_states\": [\n          \"ready\"\n        ],\n        \"active_candidate_state\": \"ready\",\n        \"shell_ref\": \"date-listing-body-crop\",\n        \"shell_semantic_slots\": [\n          \"slot.date-heading\",\n          \"slot.date-navigation\",\n          \"slot.listing-body\"\n        ],\n        \"component_semantic_refs\": [\n          \"u0.component.date-listing\",\n          \"u0.component.event-card\"\n        ],\n        \"expected_instances\": {\n          \"semantic_roots\": 1,\n          \"event_card_instances\": 1,\n          \"state_panel_instances\": 0\n        },\n        \"geometry_authority\": \"CURRENT_DATE_REPLAY_VIEWPORT_ONLY; U0/F0 OWN COMPONENT_GEOMETRY\"\n      },\n      {\n        \"order\": 4,\n        \"semantic_root_key\": \"a0.candidate.root.date.state-matrix.mobile.v1\",\n        \"scenario_id\": \"a0.date.state-matrix.mobile.v1\",\n        \"representation\": \"state-matrix\",\n        \"viewport\": {\n          \"id\": \"mobile\",\n          \"width\": 390,\n          \"height\": 720\n        },\n        \"projection_ref\": null,\n        \"projection_sha256\": null,\n        \"fixture_ids\": [],\n        \"fixture_semantics\": \"NO_ROUTE_MEMBERSHIP_ASSERTED\",\n        \"required_states\": [\n          \"loading\",\n          \"empty\",\n          \"error\"\n        ],\n        \"active_candidate_state\": \"state-matrix\",\n        \"shell_ref\": \"date-listing-state-matrix\",\n        \"shell_semantic_slots\": [\n          \"slot.date-heading\",\n          \"slot.date-navigation\",\n          \"slot.listing-state-region\"\n        ],\n        \"component_semantic_refs\": [\n          \"u0.component.date-listing\",\n          \"u0.component.state-panel\"\n        ],\n        \"expected_instances\": {\n          \"semantic_roots\": 1,\n          \"event_card_instances\": 0,\n          \"state_panel_instances\": 3\n        },\n        \"geometry_authority\": \"CURRENT_DATE_REPLAY_VIEWPORT_ONLY; U0/F0 OWN COMPONENT_GEOMETRY\"\n      },\n      {\n        \"order\": 5,\n        \"semantic_root_key\": \"a0.candidate.root.date.stress.desktop.v1\",\n        \"scenario_id\": \"a0.date.stress.desktop.v1\",\n        \"representation\": \"stress\",\n        \"viewport\": {\n          \"id\": \"desktop\",\n          \"width\": 1280,\n          \"height\": 1000\n        },\n        \"projection_ref\": null,\n        \"projection_sha256\": null,\n        \"fixture_ids\": [\n          \"event.real.4240\",\n          \"event.real.8006\",\n          \"event.real.8200\"\n        ],\n        \"fixture_semantics\": \"REFERENCE_ONLY_NOT_ROUTE_MEMBERSHIP\",\n        \"required_states\": [\n          \"ready\"\n        ],\n        \"active_candidate_state\": \"ready\",\n        \"shell_ref\": \"date-listing-stress\",\n        \"shell_semantic_slots\": [\n          \"slot.date-heading\",\n          \"slot.date-navigation\",\n          \"slot.listing-body\"\n        ],\n        \"component_semantic_refs\": [\n          \"u0.component.date-listing\",\n          \"u0.component.event-card\"\n        ],\n        \"expected_instances\": {\n          \"semantic_roots\": 1,\n          \"event_card_instances\": 3,\n          \"state_panel_instances\": 0\n        },\n        \"geometry_authority\": \"CURRENT_DATE_REPLAY_VIEWPORT_ONLY; U0/F0 OWN COMPONENT_GEOMETRY\"\n      },\n      {\n        \"order\": 6,\n        \"semantic_root_key\": \"a0.candidate.root.date.full.desktop.v1\",\n        \"scenario_id\": \"a0.date.full.desktop.v1\",\n        \"representation\": \"full-page-shell\",\n        \"viewport\": {\n          \"id\": \"desktop\",\n          \"width\": 1280,\n          \"height\": 900\n        },\n        \"projection_ref\": \"date.tomorrow.2026-09-02\",\n        \"projection_sha256\": \"c2377b3b22436b1e7259ab40bc543ae01badc27200ee13932a75b02386ee2c42\",\n        \"fixture_ids\": [\n          \"event.real.8006\"\n        ],\n        \"fixture_semantics\": \"EXACT_PROJECTION_MEMBERSHIP\",\n        \"required_states\": [\n          \"ready\"\n        ],\n        \"active_candidate_state\": \"ready\",\n        \"shell_ref\": \"desktop-v1\",\n        \"shell_semantic_slots\": [\n          \"slot.shared-header\",\n          \"slot.date-heading\",\n          \"slot.date-navigation\",\n          \"slot.listing-body\",\n          \"slot.shared-footer\"\n        ],\n        \"component_semantic_refs\": [\n          \"u0.component.shared-header\",\n          \"u0.component.date-listing\",\n          \"u0.component.event-card\",\n          \"u0.component.shared-footer\"\n        ],\n        \"expected_instances\": {\n          \"semantic_roots\": 1,\n          \"event_card_instances\": 1,\n          \"state_panel_instances\": 0\n        },\n        \"geometry_authority\": \"CURRENT_DATE_REPLAY_VIEWPORT_ONLY; U0/F0 OWN COMPONENT_GEOMETRY\"\n      },\n      {\n        \"order\": 7,\n        \"semantic_root_key\": \"a0.candidate.root.date.full.mobile.v1\",\n        \"scenario_id\": \"a0.date.full.mobile.v1\",\n        \"representation\": \"full-page-shell\",\n        \"viewport\": {\n          \"id\": \"mobile\",\n          \"width\": 390,\n          \"height\": 844\n        },\n        \"projection_ref\": \"date.tomorrow.2026-09-02\",\n        \"projection_sha256\": \"c2377b3b22436b1e7259ab40bc543ae01badc27200ee13932a75b02386ee2c42\",\n        \"fixture_ids\": [\n          \"event.real.8006\"\n        ],\n        \"fixture_semantics\": \"EXACT_PROJECTION_MEMBERSHIP\",\n        \"required_states\": [\n          \"ready\"\n        ],\n        \"active_candidate_state\": \"ready\",\n        \"shell_ref\": \"mobile-v1-menu-bottom-nav\",\n        \"shell_semantic_slots\": [\n          \"slot.shared-header\",\n          \"slot.date-heading\",\n          \"slot.date-navigation\",\n          \"slot.listing-body\",\n          \"slot.mobile-bottom-navigation\"\n        ],\n        \"component_semantic_refs\": [\n          \"u0.component.shared-header\",\n          \"u0.component.date-listing\",\n          \"u0.component.event-card\",\n          \"u0.component.mobile-bottom-navigation\"\n        ],\n        \"expected_instances\": {\n          \"semantic_roots\": 1,\n          \"event_card_instances\": 1,\n          \"state_panel_instances\": 0\n        },\n        \"geometry_authority\": \"CURRENT_DATE_REPLAY_VIEWPORT_ONLY; U0/F0 OWN COMPONENT_GEOMETRY\"\n      }\n    ]\n  },\n  \"readback_contract\": {\n    \"pre\": [\n      \"one exact D0/PUBLISH writer\",\n      \"target semantic page absent or tagged with exact idempotency digest\",\n      \"all source/dependency hashes and ordered fixture/state tuples match\",\n      \"no unmanaged root will be mutated\"\n    ],\n    \"post\": [\n      \"one semantic page with exact idempotency digest\",\n      \"semantic roots match target.semantic_root_order byte-for-byte and in order\",\n      \"each root reports scenario, viewport, projection, fixtures, states and semantic component bindings\",\n      \"all persisted IDs are newly assigned by D0 and are absent from this adapter\",\n      \"validation is empty before V0 handoff\"\n    ]\n  },\n  \"abort_conditions\": [\n    \"SOURCE_FILE_HASH_MISMATCH\",\n    \"CORPUS_OR_PROJECTION_HASH_MISMATCH\",\n    \"FIXTURE_ID_OR_ORDER_MISMATCH\",\n    \"REQUIRED_STATE_OMITTED_OR_CHANGED\",\n    \"U0_COMPONENT_DEPENDENCY_MISSING_OR_STALE\",\n    \"F0_ASSET_FOUNDATION_OR_GEOMETRY_DEPENDENCY_MISSING_OR_STALE\",\n    \"SEMANTIC_ROOT_ORDER_MISMATCH\",\n    \"MULTIPLE_PENPOT_WRITERS\",\n    \"EXISTING_ROOT_IDEMPOTENCY_DIGEST_MISMATCH\",\n    \"OLD_PENPOT_UUID_OR_DIRECT_URL_PRESENT\",\n    \"STALE_VISUAL_PASS_OR_ACCEPTANCE_CLAIM\",\n    \"PROMOTION_REQUESTED_FROM_CANDIDATE_ADAPTER\"\n  ],\n  \"idempotency\": {\n    \"key\": \"a0.date-listing-shell-candidate.v1:45bc4c601acc9b8bf1bc8be784fbe20e2d1436af89a72915fdc2040e7c5b9155\",\n    \"sha256\": \"45bc4c601acc9b8bf1bc8be784fbe20e2d1436af89a72915fdc2040e7c5b9155\",\n    \"material\": {\n      \"adapter_id\": \"A-DATE-LISTING-SHELL-CANDIDATE-ADAPTER.v1\",\n      \"source_tuple\": {\n        \"source_head\": \"2586a77858ba41a8107d1c74b2d2d8f9db1941c8\",\n        \"canonical_corpus_sha256\": \"b1746f0cd68be6dd6060858fb765c6863535aefbcf4844b9b50c279d69e9306a\",\n        \"a0_correction_payload_sha\": \"d85b38c7883d53f43b628d885513c5851c164b25\",\n        \"date_replay_record_sha256\": \"75ef44c4b460c8c7f5632feaad667e4f5a80f01063874286da0001ceeda96023\",\n        \"projection_sha256_by_id\": {\n          \"date.today.2026-09-01\": \"2bc98e1a727ab3936912950a0e087232d4dbcf7bfa601ff7da95a231855b6b58\",\n          \"date.tomorrow.2026-09-02\": \"c2377b3b22436b1e7259ab40bc543ae01badc27200ee13932a75b02386ee2c42\",\n          \"date.explicit.2026-09-06\": \"08877f7ddca78649243bc6cfb4ed2c83e644be7c683cb087ea88e66e750e6b79\"\n        }\n      },\n      \"target\": {\n        \"semantic_page_key\": \"a0.candidate.page.date-listing-shell-replay.v1\",\n        \"semantic_page_name\": \"A0 Candidate · Date Listing + Shell Replay\",\n        \"semantic_root_order\": [\n          \"a0.candidate.root.date.typical.desktop.v1\",\n          \"a0.candidate.root.date.typical.mobile.v1\",\n          \"a0.candidate.root.date.sparse.desktop.v1\",\n          \"a0.candidate.root.date.state-matrix.mobile.v1\",\n          \"a0.candidate.root.date.stress.desktop.v1\",\n          \"a0.candidate.root.date.full.desktop.v1\",\n          \"a0.candidate.root.date.full.mobile.v1\"\n        ],\n        \"identity_assignment\": \"D0_ASSIGNS_ALL_NEW_PENPOT_IDENTITIES\"\n      },\n      \"build_steps\": [\n        {\n          \"order\": 1,\n          \"semantic_root_key\": \"a0.candidate.root.date.typical.desktop.v1\",\n          \"scenario_id\": \"a0.date.typical.desktop.v1\",\n          \"representation\": \"typical\",\n          \"viewport\": {\n            \"id\": \"desktop\",\n            \"width\": 1280,\n            \"height\": 900\n          },\n          \"projection_ref\": \"date.tomorrow.2026-09-02\",\n          \"projection_sha256\": \"c2377b3b22436b1e7259ab40bc543ae01badc27200ee13932a75b02386ee2c42\",\n          \"fixture_ids\": [\n            \"event.real.8006\"\n          ],\n          \"fixture_semantics\": \"EXACT_PROJECTION_MEMBERSHIP\",\n          \"required_states\": [\n            \"ready\"\n          ],\n          \"active_candidate_state\": \"ready\",\n          \"shell_ref\": \"date-listing-body-crop\",\n          \"shell_semantic_slots\": [\n            \"slot.date-heading\",\n            \"slot.date-navigation\",\n            \"slot.listing-body\"\n          ],\n          \"component_semantic_refs\": [\n            \"u0.component.date-listing\",\n            \"u0.component.event-card\"\n          ],\n          \"expected_instances\": {\n            \"semantic_roots\": 1,\n            \"event_card_instances\": 1,\n            \"state_panel_instances\": 0\n          },\n          \"geometry_authority\": \"CURRENT_DATE_REPLAY_VIEWPORT_ONLY; U0/F0 OWN COMPONENT_GEOMETRY\"\n        },\n        {\n          \"order\": 2,\n          \"semantic_root_key\": \"a0.candidate.root.date.typical.mobile.v1\",\n          \"scenario_id\": \"a0.date.typical.mobile.v1\",\n          \"representation\": \"typical\",\n          \"viewport\": {\n            \"id\": \"mobile\",\n            \"width\": 390,\n            \"height\": 844\n          },\n          \"projection_ref\": \"date.tomorrow.2026-09-02\",\n          \"projection_sha256\": \"c2377b3b22436b1e7259ab40bc543ae01badc27200ee13932a75b02386ee2c42\",\n          \"fixture_ids\": [\n            \"event.real.8006\"\n          ],\n          \"fixture_semantics\": \"EXACT_PROJECTION_MEMBERSHIP\",\n          \"required_states\": [\n            \"ready\"\n          ],\n          \"active_candidate_state\": \"ready\",\n          \"shell_ref\": \"date-listing-body-crop\",\n          \"shell_semantic_slots\": [\n            \"slot.date-heading\",\n            \"slot.date-navigation\",\n            \"slot.listing-body\"\n          ],\n          \"component_semantic_refs\": [\n            \"u0.component.date-listing\",\n            \"u0.component.event-card\"\n          ],\n          \"expected_instances\": {\n            \"semantic_roots\": 1,\n            \"event_card_instances\": 1,\n            \"state_panel_instances\": 0\n          },\n          \"geometry_authority\": \"CURRENT_DATE_REPLAY_VIEWPORT_ONLY; U0/F0 OWN COMPONENT_GEOMETRY\"\n        },\n        {\n          \"order\": 3,\n          \"semantic_root_key\": \"a0.candidate.root.date.sparse.desktop.v1\",\n          \"scenario_id\": \"a0.date.sparse.desktop.v1\",\n          \"representation\": \"sparse\",\n          \"viewport\": {\n            \"id\": \"desktop\",\n            \"width\": 1280,\n            \"height\": 760\n          },\n          \"projection_ref\": \"date.explicit.2026-09-06\",\n          \"projection_sha256\": \"08877f7ddca78649243bc6cfb4ed2c83e644be7c683cb087ea88e66e750e6b79\",\n          \"fixture_ids\": [\n            \"event.real.8200\"\n          ],\n          \"fixture_semantics\": \"EXACT_PROJECTION_MEMBERSHIP\",\n          \"required_states\": [\n            \"ready\"\n          ],\n          \"active_candidate_state\": \"ready\",\n          \"shell_ref\": \"date-listing-body-crop\",\n          \"shell_semantic_slots\": [\n            \"slot.date-heading\",\n            \"slot.date-navigation\",\n            \"slot.listing-body\"\n          ],\n          \"component_semantic_refs\": [\n            \"u0.component.date-listing\",\n            \"u0.component.event-card\"\n          ],\n          \"expected_instances\": {\n            \"semantic_roots\": 1,\n            \"event_card_instances\": 1,\n            \"state_panel_instances\": 0\n          },\n          \"geometry_authority\": \"CURRENT_DATE_REPLAY_VIEWPORT_ONLY; U0/F0 OWN COMPONENT_GEOMETRY\"\n        },\n        {\n          \"order\": 4,\n          \"semantic_root_key\": \"a0.candidate.root.date.state-matrix.mobile.v1\",\n          \"scenario_id\": \"a0.date.state-matrix.mobile.v1\",\n          \"representation\": \"state-matrix\",\n          \"viewport\": {\n            \"id\": \"mobile\",\n            \"width\": 390,\n            \"height\": 720\n          },\n          \"projection_ref\": null,\n          \"projection_sha256\": null,\n          \"fixture_ids\": [],\n          \"fixture_semantics\": \"NO_ROUTE_MEMBERSHIP_ASSERTED\",\n          \"required_states\": [\n            \"loading\",\n            \"empty\",\n            \"error\"\n          ],\n          \"active_candidate_state\": \"state-matrix\",\n          \"shell_ref\": \"date-listing-state-matrix\",\n          \"shell_semantic_slots\": [\n            \"slot.date-heading\",\n            \"slot.date-navigation\",\n            \"slot.listing-state-region\"\n          ],\n          \"component_semantic_refs\": [\n            \"u0.component.date-listing\",\n            \"u0.component.state-panel\"\n          ],\n          \"expected_instances\": {\n            \"semantic_roots\": 1,\n            \"event_card_instances\": 0,\n            \"state_panel_instances\": 3\n          },\n          \"geometry_authority\": \"CURRENT_DATE_REPLAY_VIEWPORT_ONLY; U0/F0 OWN COMPONENT_GEOMETRY\"\n        },\n        {\n          \"order\": 5,\n          \"semantic_root_key\": \"a0.candidate.root.date.stress.desktop.v1\",\n          \"scenario_id\": \"a0.date.stress.desktop.v1\",\n          \"representation\": \"stress\",\n          \"viewport\": {\n            \"id\": \"desktop\",\n            \"width\": 1280,\n            \"height\": 1000\n          },\n          \"projection_ref\": null,\n          \"projection_sha256\": null,\n          \"fixture_ids\": [\n            \"event.real.4240\",\n            \"event.real.8006\",\n            \"event.real.8200\"\n          ],\n          \"fixture_semantics\": \"REFERENCE_ONLY_NOT_ROUTE_MEMBERSHIP\",\n          \"required_states\": [\n            \"ready\"\n          ],\n          \"active_candidate_state\": \"ready\",\n          \"shell_ref\": \"date-listing-stress\",\n          \"shell_semantic_slots\": [\n            \"slot.date-heading\",\n            \"slot.date-navigation\",\n            \"slot.listing-body\"\n          ],\n          \"component_semantic_refs\": [\n            \"u0.component.date-listing\",\n            \"u0.component.event-card\"\n          ],\n          \"expected_instances\": {\n            \"semantic_roots\": 1,\n            \"event_card_instances\": 3,\n            \"state_panel_instances\": 0\n          },\n          \"geometry_authority\": \"CURRENT_DATE_REPLAY_VIEWPORT_ONLY; U0/F0 OWN COMPONENT_GEOMETRY\"\n        },\n        {\n          \"order\": 6,\n          \"semantic_root_key\": \"a0.candidate.root.date.full.desktop.v1\",\n          \"scenario_id\": \"a0.date.full.desktop.v1\",\n          \"representation\": \"full-page-shell\",\n          \"viewport\": {\n            \"id\": \"desktop\",\n            \"width\": 1280,\n            \"height\": 900\n          },\n          \"projection_ref\": \"date.tomorrow.2026-09-02\",\n          \"projection_sha256\": \"c2377b3b22436b1e7259ab40bc543ae01badc27200ee13932a75b02386ee2c42\",\n          \"fixture_ids\": [\n            \"event.real.8006\"\n          ],\n          \"fixture_semantics\": \"EXACT_PROJECTION_MEMBERSHIP\",\n          \"required_states\": [\n            \"ready\"\n          ],\n          \"active_candidate_state\": \"ready\",\n          \"shell_ref\": \"desktop-v1\",\n          \"shell_semantic_slots\": [\n            \"slot.shared-header\",\n            \"slot.date-heading\",\n            \"slot.date-navigation\",\n            \"slot.listing-body\",\n            \"slot.shared-footer\"\n          ],\n          \"component_semantic_refs\": [\n            \"u0.component.shared-header\",\n            \"u0.component.date-listing\",\n            \"u0.component.event-card\",\n            \"u0.component.shared-footer\"\n          ],\n          \"expected_instances\": {\n            \"semantic_roots\": 1,\n            \"event_card_instances\": 1,\n            \"state_panel_instances\": 0\n          },\n          \"geometry_authority\": \"CURRENT_DATE_REPLAY_VIEWPORT_ONLY; U0/F0 OWN COMPONENT_GEOMETRY\"\n        },\n        {\n          \"order\": 7,\n          \"semantic_root_key\": \"a0.candidate.root.date.full.mobile.v1\",\n          \"scenario_id\": \"a0.date.full.mobile.v1\",\n          \"representation\": \"full-page-shell\",\n          \"viewport\": {\n            \"id\": \"mobile\",\n            \"width\": 390,\n            \"height\": 844\n          },\n          \"projection_ref\": \"date.tomorrow.2026-09-02\",\n          \"projection_sha256\": \"c2377b3b22436b1e7259ab40bc543ae01badc27200ee13932a75b02386ee2c42\",\n          \"fixture_ids\": [\n            \"event.real.8006\"\n          ],\n          \"fixture_semantics\": \"EXACT_PROJECTION_MEMBERSHIP\",\n          \"required_states\": [\n            \"ready\"\n          ],\n          \"active_candidate_state\": \"ready\",\n          \"shell_ref\": \"mobile-v1-menu-bottom-nav\",\n          \"shell_semantic_slots\": [\n            \"slot.shared-header\",\n            \"slot.date-heading\",\n            \"slot.date-navigation\",\n            \"slot.listing-body\",\n            \"slot.mobile-bottom-navigation\"\n          ],\n          \"component_semantic_refs\": [\n            \"u0.component.shared-header\",\n            \"u0.component.date-listing\",\n            \"u0.component.event-card\",\n            \"u0.component.mobile-bottom-navigation\"\n          ],\n          \"expected_instances\": {\n            \"semantic_roots\": 1,\n            \"event_card_instances\": 1,\n            \"state_panel_instances\": 0\n          },\n          \"geometry_authority\": \"CURRENT_DATE_REPLAY_VIEWPORT_ONLY; U0/F0 OWN COMPONENT_GEOMETRY\"\n        }\n      ],\n      \"bounded_mutation_scope\": {\n        \"allowed_paths\": [\n          \"a0.candidate.page.date-listing-shell-replay.v1\",\n          \"a0.candidate.root.date.typical.desktop.v1\",\n          \"a0.candidate.root.date.typical.mobile.v1\",\n          \"a0.candidate.root.date.sparse.desktop.v1\",\n          \"a0.candidate.root.date.state-matrix.mobile.v1\",\n          \"a0.candidate.root.date.stress.desktop.v1\",\n          \"a0.candidate.root.date.full.desktop.v1\",\n          \"a0.candidate.root.date.full.mobile.v1\"\n        ],\n        \"max_semantic_pages\": 1,\n        \"max_semantic_roots\": 7,\n        \"existing_non_candidate_pages\": \"NO_MUTATION\",\n        \"acceptance_geometry\": \"NOT_OWNED_BY_A0\",\n        \"reversibility\": \"DELETE_OR_REBUILD_ONLY_ROOTS_WITH_EXACT_IDEMPOTENCY_DIGEST\"\n      }\n    }\n  },\n  \"receipts\": {\n    \"receipt_path\": \"catalog/asp-production-conveyor-v3/a0/candidate-adapter-receipt.v1.json\",\n    \"adapter_record_sha256\": \"72e2aaea9817352ac5a570bdc7ccdfe25dc70a706073f2ad137098678538e788\"\n  }\n}\n","date-replay-data":"{\"schema_version\":\"kenigevents.asp-conveyor.a0.date-listing-replay.v1\",\"donor\":{\"pr\":43,\"commit\":\"da16dde8812220125a806bd5a03d5015357d4c07\",\"disposition\":\"REUSE_STRUCTURE_AFTER_RECONSTRUCTION\",\"canonical\":false,\"promoted\":false,\"manifest_path\":\"catalog/page-archetypes/date-listing-shell-v1/fixture-manifest.v1.json\"},\"source\":{\"events_bot_commit\":\"f2d658e8be057f3b75431f6b77e4887af4536028\",\"clock\":\"2026-09-01T12:00:00+02:00\"},\"projection_sources\":{\"canonical_corpus_sha256\":\"b1746f0cd68be6dd6060858fb765c6863535aefbcf4844b9b50c279d69e9306a\",\"a0_correction_payload_sha\":\"d85b38c7883d53f43b628d885513c5851c164b25\"},\"projections\":[{\"projection_id\":\"date.today.2026-09-01\",\"route\":\"/segodnya/\",\"date\":\"2026-09-01\",\"fixture_ids\":[\"event.real.4240\"],\"membership_basis\":\"start_date_exact\",\"projection_sha256\":\"2bc98e1a727ab3936912950a0e087232d4dbcf7bfa601ff7da95a231855b6b58\"},{\"projection_id\":\"date.tomorrow.2026-09-02\",\"route\":\"/zavtra/\",\"date\":\"2026-09-02\",\"fixture_ids\":[\"event.real.8006\"],\"membership_basis\":\"start_date_exact\",\"projection_sha256\":\"c2377b3b22436b1e7259ab40bc543ae01badc27200ee13932a75b02386ee2c42\"},{\"projection_id\":\"date.explicit.2026-09-06\",\"route\":\"/date-2026-09-06/\",\"date\":\"2026-09-06\",\"fixture_ids\":[\"event.real.8200\"],\"membership_basis\":\"start_date_exact\",\"projection_sha256\":\"08877f7ddca78649243bc6cfb4ed2c83e644be7c683cb087ea88e66e750e6b79\"}],\"representations\":[{\"scenario_id\":\"a0.date.typical.desktop.v1\",\"representation\":\"typical\",\"viewport\":{\"id\":\"desktop\",\"width\":1280,\"height\":900},\"projection_ref\":\"date.tomorrow.2026-09-02\",\"fixture_ids\":[\"event.real.8006\"],\"shell\":\"date-listing-body-crop\"},{\"scenario_id\":\"a0.date.typical.mobile.v1\",\"representation\":\"typical\",\"viewport\":{\"id\":\"mobile\",\"width\":390,\"height\":844},\"projection_ref\":\"date.tomorrow.2026-09-02\",\"fixture_ids\":[\"event.real.8006\"],\"shell\":\"date-listing-body-crop\"},{\"scenario_id\":\"a0.date.sparse.desktop.v1\",\"representation\":\"sparse\",\"viewport\":{\"id\":\"desktop\",\"width\":1280,\"height\":760},\"projection_ref\":\"date.explicit.2026-09-06\",\"fixture_ids\":[\"event.real.8200\"],\"shell\":\"date-listing-body-crop\"},{\"scenario_id\":\"a0.date.state-matrix.mobile.v1\",\"representation\":\"state-matrix\",\"viewport\":{\"id\":\"mobile\",\"width\":390,\"height\":720},\"projection_ref\":null,\"fixture_ids\":[],\"states\":[\"loading\",\"empty\",\"error\"],\"shell\":\"date-listing-state-matrix\"},{\"scenario_id\":\"a0.date.stress.desktop.v1\",\"representation\":\"stress\",\"viewport\":{\"id\":\"desktop\",\"width\":1280,\"height\":1000},\"projection_ref\":null,\"fixture_ids\":[\"event.real.4240\",\"event.real.8006\",\"event.real.8200\"],\"fixture_semantics\":\"REFERENCE_ONLY_NOT_ROUTE_MEMBERSHIP\",\"shell\":\"date-listing-stress\"},{\"scenario_id\":\"a0.date.full.desktop.v1\",\"representation\":\"full-page-shell\",\"viewport\":{\"id\":\"desktop\",\"width\":1280,\"height\":900},\"projection_ref\":\"date.tomorrow.2026-09-02\",\"fixture_ids\":[\"event.real.8006\"],\"shell\":\"desktop-v1\"},{\"scenario_id\":\"a0.date.full.mobile.v1\",\"representation\":\"full-page-shell\",\"viewport\":{\"id\":\"mobile\",\"width\":390,\"height\":844},\"projection_ref\":\"date.tomorrow.2026-09-02\",\"fixture_ids\":[\"event.real.8006\"],\"shell\":\"mobile-v1-menu-bottom-nav\"}],\"rules\":{\"old_penpot_lineage\":\"FORBIDDEN\",\"visual_status_inheritance\":\"FORBIDDEN\",\"publisher_fixture_discovery\":\"FORBIDDEN\"},\"record_sha256\":\"75ef44c4b460c8c7f5632feaad667e4f5a80f01063874286da0001ceeda96023\"}","physical-date-page-unit":"{\"schema_version\":\"kenigevents.asp-penpot-page-wave-unit.v1\",\"unit_id\":\"A0-PAGE-AUX-DATE_LISTING_SHELL-R1\",\"package_id\":\"A0-PAGE-AUX-DATE_LISTING_SHELL-R1\",\"owner\":\"A0\",\"lane\":\"aux\",\"order\":17,\"state\":\"MAT_PACKAGE_READY_QA_INTEGRATE_GATED\",\"penpot_execution_authorized\":false,\"base\":{\"head\":\"68cd4f88ef759c7b4ec57ddc2da7f867f79a5b92\",\"tree\":\"f0ae4ee0a5603cafae74cb7b93524c835e21beb9\"},\"target_branch\":\"a0/asp-penpot-page-wave-v1-20260901\",\"namespace\":\"kenigevents-a0-page-wave-a0-page-aux-date-listing-shell-r1\",\"storage\":{\"binding\":\"pw_3b860a48c1c9_b\",\"receipt\":\"pw_3b860a48c1c9_r\",\"baseline\":\"pw_3b860a48c1c9_p\"},\"source_adapter\":{\"path\":\"catalog/asp-production-conveyor-v3/a0/date-listing-shell-candidate-adapter.v1.json\",\"git_blob_sha1\":\"20d6e95421da1ba9396b4e30f0f6af70465387fc\",\"adapter_record_sha256\":\"72e2aaea9817352ac5a570bdc7ccdfe25dc70a706073f2ad137098678538e788\",\"package_record_sha256\":\"2ac73a2448ee479d515986f0f8894b472546532f647ecb14f65b631cabece92c\",\"byte_identical_required\":true},\"source_unit_digest\":\"048e77feebd74d17c37d4b5054d5339748490bd1096eda007dab76eab117e3a5\",\"subject\":{\"id\":\"archetype.listing.date\",\"routes\":[\"/segodnya/\",\"/zavtra/\",\"/date-2026-09-06/\"],\"source_pages\":[],\"states\":[\"ready\"],\"excluded_unmaterialized_states\":[],\"active_state\":\"ready\",\"fixtures\":[\"event.real.8006\"],\"fixture_semantics\":\"EXACT_PROJECTION_MEMBERSHIP\",\"projection\":{\"ref\":\"date.tomorrow.2026-09-02\",\"sha256\":\"c2377b3b22436b1e7259ab40bc543ae01badc27200ee13932a75b02386ee2c42\"},\"contract\":{\"path\":\"catalog/global-archetype-sot-v1/archetype-contracts/listing-date.semantic-contract.v1.json\",\"git_commit\":\"9b8043f3bdb86fab4eee00bf94b0f10d4f029c50\"},\"facts\":{\"date_projection\":\"2026-09-02\"}},\"page_contract\":{\"page_name\":\"A0 · Date Listing + Shell · Candidate\",\"root_name\":\"CANDIDATE_BUILD_NOT_ACCEPTED · A0 · Date Listing + Shell\",\"candidate_roots\":1,\"route_or_archetype_pages\":1,\"desktop_mobile_side_by_side\":true,\"variants\":[{\"id\":\"desktop\",\"source_root_key\":\"a0.candidate.root.date.full.desktop.v1\",\"scenario_id\":\"a0.date.full.desktop.v1\",\"viewport\":{\"width\":1280,\"height\":900},\"semantic_regions\":[\"slot.shared-header\",\"slot.date-heading\",\"slot.date-navigation\",\"slot.listing-body\",\"slot.shared-footer\"]},{\"id\":\"mobile\",\"source_root_key\":\"a0.candidate.root.date.full.mobile.v1\",\"scenario_id\":\"a0.date.full.mobile.v1\",\"viewport\":{\"width\":390,\"height\":844},\"semantic_regions\":[\"slot.shared-header\",\"slot.date-heading\",\"slot.date-navigation\",\"slot.listing-body\",\"slot.mobile-bottom-navigation\"]}],\"native_structure\":\"createPage + one createBoard root + two native component mains + exact semantic-region boards + two linked instances + root export\",\"external_component_substitution\":\"FORBIDDEN\"},\"semantic_dependencies\":{\"state\":\"QA_INTEGRATE_GATED\",\"component_refs\":[\"u0.component.shared-header\",\"u0.component.date-listing\",\"u0.component.event-card\",\"u0.component.shared-footer\",\"u0.component.mobile-bottom-navigation\"],\"missing_or_stale_action\":\"ABORT; NO_PLACEHOLDER_OR_SCREENSHOT\"},\"run_control\":{\"schema\":\"kenigevents.asp-run-control.v1\",\"state\":\"ACTIVE_REQUIRED\",\"writer_id\":\"/root/publish_r2\",\"run_id\":\"3b860a48-c1c9-fc95-9576-5eb9761fbbce\",\"lease_token\":\"75ea54825fec8cfa605b0ae5fd130231dfa83266b1bbaea01f58cd204d4fae17\",\"cancel_token\":\"0867978c25e7e5166cd1b93366fff294f703355053f525eba0072aa6e846d6d1\",\"separate_package_lease\":true},\"limits\":{\"component_families\":1,\"managed_nodes\":15,\"hard_managed_node_limit\":30,\"max_managed_creations_per_invocation\":3,\"executor_bytes\":11238,\"executor_max_bytes\":65000},\"artifacts\":{\"runtime\":{\"path\":\"catalog/asp-production-conveyor-v3/a0/page-wave-v1/runtime-contract.v1.json\",\"bytes\":4082,\"sha256\":\"5830231383fb451f4a2dcc66d08a35bde03e3c9396833e6ef23a841193808226\",\"git_blob_sha1\":\"c3f4a96cccb9ef8c94aa1a7c1a9b331ed6d351c3\"},\"executor\":{\"path\":\"scripts/asp-production-conveyor-v3/a0/page-wave-v1/native-page-unit-executor.v1.js\",\"bytes\":11238,\"sha256\":\"d0cff3136a9cd99736db5b6adba79e2a5a63a5345df78e9457cf5d5a89108d5d\",\"git_blob_sha1\":\"5643b0373aa092ae64d03d79abf29a7de9b2ab45\"},\"setup\":{\"path\":\"scripts/asp-production-conveyor-v3/a0/page-wave-v1/setup-page-unit.v1.js\",\"bytes\":1905,\"sha256\":\"0af0d47ca129b771de25d05dd6af425c2bac39ecf14cb4e2eb30219e4176b222\",\"git_blob_sha1\":\"edbdd37d487f74968b45f10494cd72c1bfbb1c39\"},\"test\":{\"path\":\"tests/asp-production-conveyor-v3/a0/page-wave-v1/page-wave.test.js\",\"bytes\":6529,\"sha256\":\"89091e402a5506f32d9ee3b6fd9a158854509b05e4ec48d3f86e0e2c30e3ffa5\",\"git_blob_sha1\":\"45eddb7c297db428af994be039b315a2d3a57f94\"}},\"materialization_entry_point\":{\"setup\":\"setupPageUnit(package,runtime,{penpot,storage})\",\"execute\":\"runPageUnit(package,runtime,{penpot,storage})\",\"resume\":\"repeat execute with same ACTIVE lease until terminal; second terminal run created=0\"},\"negative_tests\":[\"duplicate-page/root/main/instance\",\"detached-instance\",\"screenshot/image-fill\",\"stale-package/source/executor/runtime hash\",\"cancelled-or-inactive-lease\",\"protected-free/foundations-projection-drift\"],\"terminal_contract\":{\"page_nonempty\":true,\"root_nonempty\":true,\"export_nonempty\":true,\"native_readback\":true,\"second_run_created\":0,\"page_scoped_v0_trigger\":true},\"visual_acceptance\":\"PENDING_V0\",\"promotion_authorized\":false,\"old_penpot_lineage\":\"FORBIDDEN\",\"package_record_sha256\":\"169f325feb50b65caca38cefe1a2448f46248811bd01a4b8cf7a47e32e9efb33\"}\n","runtime-contract":"{\"schema_version\":\"kenigevents.asp-penpot-page-wave-runtime-contract.v1\",\"repository\":\"onedayonemasterpiece/lovekgd-design-system\",\"base\":{\"branch\":\"a0/asp-production-conveyor-20260831\",\"head\":\"68cd4f88ef759c7b4ec57ddc2da7f867f79a5b92\",\"tree\":\"f0ae4ee0a5603cafae74cb7b93524c835e21beb9\"},\"target_branch\":\"a0/asp-penpot-page-wave-v1-20260901\",\"penpot\":{\"file_id\":\"40e06342-8830-80d6-8008-8fc8a3a4cd4f\",\"sole_writer\":\"/root/publish_r2\",\"a0_penpot_mutations\":0},\"policy\":{\"schema\":\"kenigevents.asp-penpot-page-wave.v1\",\"comment\":5483175166,\"fresh_read_tip\":5483869282,\"pr55_head\":\"7bf067475a1dd03b5208b804ced9dbed277cdf30\"},\"protected_projections\":{\"minimum_revision\":113,\"free\":{\"page_id\":\"c16498cb-b51d-8030-8008-904bd8fc9c53\",\"root_ids\":[\"313fb1ed-0d5c-8095-8008-9108df52b2ce\",\"313fb1ed-0d5c-8095-8008-912c45090653\"],\"chars\":84033,\"utf8_bytes\":84034,\"sha256\":\"0b00102e348367601fe35de30e06dc22b10883577a22917320955058115fc042\"},\"foundations\":{\"page_id\":\"313fb1ed-0d5c-8095-8008-9183322ab3a9\",\"root_id\":\"313fb1ed-0d5c-8095-8008-918a0c1473af\",\"placements\":37,\"chars\":43736,\"utf8_bytes\":43746,\"sha256\":\"1b119d154376505b8d28036cbf33e97f9009a007bf0a5a5765de2750644da1fa\",\"rejected_scalar_sha256\":\"523e43cfe95df7962f8034c4dc2e9f04f02114b15ad488587c707e35b6fed8f1\"}},\"exact_current_dependencies\":{\"f0_action_nav\":{\"package_id\":\"F-ACTION-NAV-ICONS\",\"revision\":\"R5.2\",\"state\":\"MAT_PACKAGE_READY_QA_INTEGRATE_GATED\",\"branch\":\"agent/f-action-nav-icons-r5/mat\",\"head\":\"fecb90c6b1c475687d77b8cce4c905d932a0bf23\",\"tree\":\"0bcfaf6b5db1182da27e459df502d742e1470f93\",\"package\":{\"path\":\"catalog/asp-production-conveyor-v3/f0/F-ACTION-NAV-ICONS.package.v5.json\",\"git_blob_sha1\":\"b211bcec98a144a8e3ee7ed87098c37757fb8298\",\"sha256\":\"9a89a0b283f110a811a06317a5b4f0a54b28f553de81a40b43b7261c0d864c7a\",\"bytes\":16493},\"setup\":{\"path\":\"scripts/asp-production-conveyor-v3/f0/action_nav_icons_setup_v5.js\",\"git_blob_sha1\":\"9d3945c5b940563fb32f556ede93d69868b8d20f\",\"sha256\":\"1f1415cb31d562c90c08c0367bbdc2c3615ccd04066ca630443bd91c4ed0a33a\",\"bytes\":2273},\"executor\":{\"path\":\"scripts/asp-production-conveyor-v3/f0/action_nav_icons_native_executor_v5.js\",\"git_blob_sha1\":\"f19a55d8faf6526f977e88424676a8564c9d5dba\",\"sha256\":\"429cb2b8cf948bcd553f4e16af994b04af5ded33290022b0d336a4c77a665bca\",\"bytes\":33722},\"test\":{\"path\":\"tests/asp-production-conveyor-v3/f0/test_action_nav_icons_native_executor_v5.js\",\"git_blob_sha1\":\"5984081d8290b8a5a92a42aec9d445929707bd49\",\"sha256\":\"ace0fa7d14c01d7ec30f3703754246442a2d81cb330dd4908d70b0638b8f9f4b\",\"bytes\":15285}},\"u0_controls\":{\"package_id\":\"U-CONTROLS-PRIMITIVES\",\"revision\":\"R2\",\"state\":\"READY_FOR_D0_INTEGRATE\",\"comment\":5481555626,\"branch\":\"u0/controls-primitives-v3-r2\",\"head\":\"294a02609d5c0322f9afcca36b773b67df148d13\",\"asset_closure\":{\"path\":\"catalog/asp-production-conveyor-v3/u0/U-CONTROLS-PRIMITIVES.asset-closure.v2.json\",\"git_blob_sha1\":\"9cfd6d9f1bfdd0a5d75014287ff38fb11913b10d\",\"bytes\":9734},\"compiler\":{\"path\":\"scripts/asp-production-conveyor-v3/u0/compile_controls_primitives_asset_closure.py\",\"git_blob_sha1\":\"737820d18c0da49a833ba53d432933093580720e\",\"bytes\":14918},\"test\":{\"path\":\"tests/asp-production-conveyor-v3/u0/test_controls_primitives_asset_closure.py\",\"git_blob_sha1\":\"d88c58ef609a4822b9a378c9880da313ae03fe15\",\"bytes\":5961},\"base_candidate\":{\"head\":\"0f6d98fe8c4798b1be630f5fc635252c0ac5ace9\",\"package_git_blob_sha1\":\"ffe05f3fc99529448eeadc30108f965ecce2ba7f\"}}},\"source_queue\":{\"path\":\"catalog/asp-production-conveyor-v3/a0/candidate-adapter-queue.v1.json\",\"git_blob_sha1\":\"1b9ac4ed1a38011fab7a1237f4b533e0cfe57205\",\"record_sha256\":\"43fe9a789dc11c803aee68de3f6eb7047a5a585fcabd6c18a2a1cd3eb77a49de\"},\"constraints\":{\"candidate_roots_per_unit\":1,\"desktop_mobile_side_by_side\":true,\"component_families_max\":3,\"managed_nodes_max\":30,\"executor_bytes_max\":65000,\"managed_creations_per_invocation_max\":3,\"second_run_created\":0,\"visual_acceptance\":\"PENDING_V0\",\"promotion_authorized\":false,\"screenshots_or_placeholders\":\"FORBIDDEN\",\"source_adapters_byte_identical\":true},\"record_sha256\":\"00c49796eb7caecef3fab5dfc84e8b49c365786561fcf5c02f91b864e269dfc0\"}\n"},"source_records":[{"bytes":5321,"git_blob_sha1":"052c8950004b61cee9095080409e4ecaba30e771","name":"physical-date-page-unit","path":"catalog/asp-production-conveyor-v3/a0/page-wave-v1/units/17-archetype-listing-date.package.v1.json","ref":"4edc859861fba3f18fab0e65e9d2e8c0a7394bdb","sha256":"d844ee7a5ca77fe0b3ba2da9d1a8e7505152e4b7e7dde7b6c2edddf4cc223990"},{"bytes":3324,"git_blob_sha1":"f630503261b0b46063c39e1d08dda37812341964","name":"date-replay-data","path":"catalog/asp-production-conveyor-v3/a0/date-listing-shell-replay.v1.json","ref":"4edc859861fba3f18fab0e65e9d2e8c0a7394bdb","sha256":"88e4e9607fd3344b58f1e50e2c42680c14c0ca02835929584df1aefe4201393a"},{"bytes":31069,"git_blob_sha1":"20d6e95421da1ba9396b4e30f0f6af70465387fc","name":"candidate-adapter","path":"catalog/asp-production-conveyor-v3/a0/date-listing-shell-candidate-adapter.v1.json","ref":"4edc859861fba3f18fab0e65e9d2e8c0a7394bdb","sha256":"5b463f30dd931bdbaba8cb3000d1b2c654aea4d6197640a57eb1ad835b3fdc56"},{"bytes":4082,"git_blob_sha1":"c3f4a96cccb9ef8c94aa1a7c1a9b331ed6d351c3","name":"runtime-contract","path":"catalog/asp-production-conveyor-v3/a0/page-wave-v1/runtime-contract.v1.json","ref":"4edc859861fba3f18fab0e65e9d2e8c0a7394bdb","sha256":"5830231383fb451f4a2dcc66d08a35bde03e3c9396833e6ef23a841193808226"}],"state":"DIRECT_PLUGIN_BUNDLE_READY_D0_QA_INTEGRATE","states":[{"fixture_ids":["event.real.8006"],"fixture_semantics":"EXACT_PROJECTION_MEMBERSHIP","projection_ref":"date.tomorrow.2026-09-02","representation":"typical","scenario_id":"a0.date.typical.desktop.v1","shell":"date-listing-body-crop","state":"ready","viewport":{"height":900,"id":"desktop","width":1280}},{"fixture_ids":["event.real.8006"],"fixture_semantics":"EXACT_PROJECTION_MEMBERSHIP","projection_ref":"date.tomorrow.2026-09-02","representation":"typical","scenario_id":"a0.date.typical.mobile.v1","shell":"date-listing-body-crop","state":"ready","viewport":{"height":844,"id":"mobile","width":390}},{"fixture_ids":["event.real.8200"],"fixture_semantics":"EXACT_PROJECTION_MEMBERSHIP","projection_ref":"date.explicit.2026-09-06","representation":"sparse","scenario_id":"a0.date.sparse.desktop.v1","shell":"date-listing-body-crop","state":"ready","viewport":{"height":760,"id":"desktop","width":1280}},{"fixture_ids":["event.real.8006"],"fixture_semantics":"EXACT_PROJECTION_MEMBERSHIP","projection_ref":"date.tomorrow.2026-09-02","representation":"full-page-shell","scenario_id":"a0.date.full.desktop.v1","shell":"desktop-v1","state":"ready","viewport":{"height":900,"id":"desktop","width":1280}},{"fixture_ids":["event.real.8006"],"fixture_semantics":"EXACT_PROJECTION_MEMBERSHIP","projection_ref":"date.tomorrow.2026-09-02","representation":"full-page-shell","scenario_id":"a0.date.full.mobile.v1","shell":"mobile-v1-menu-bottom-nav","state":"ready","viewport":{"height":844,"id":"mobile","width":390}}],"target_file_id":"40e06342-8830-80d6-8008-8fc8a3a4cd4f","target_mode":"CREATE_OR_RESUME_PAGE","target_page_name":"A0 · Date Listing + Shell · Candidate","target_root_name":"CANDIDATE_BUILD_NOT_ACCEPTED · A0 · Date Listing + Shell · READY","target_root_stable_id":"date-root/ready"};
function utf8Bytes(text){
  const out=[];
  for(let i=0;i<text.length;i++){
    let c=text.charCodeAt(i);
    if(c<0x80){out.push(c);continue}
    if(c<0x800){out.push(0xc0|(c>>6),0x80|(c&63));continue}
    if(c>=0xd800&&c<=0xdbff&&i+1<text.length){
      const d=text.charCodeAt(++i);
      if(d>=0xdc00&&d<=0xdfff){
        const cp=0x10000+((c-0xd800)<<10)+(d-0xdc00);
        out.push(0xf0|(cp>>18),0x80|((cp>>12)&63),0x80|((cp>>6)&63),0x80|(cp&63));
        continue
      }
      i--;
    }
    out.push(0xe0|(c>>12),0x80|((c>>6)&63),0x80|(c&63));
  }
  return out
}
function sha256Hex(input){
  const bytes=typeof input==='string'?utf8Bytes(input):Array.from(input||[]);
  const k=[
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
  ];
  const h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const data=bytes.slice();
  const bitLen=bytes.length*8;
  data.push(0x80);
  while((data.length%64)!==56)data.push(0);
  const hi=Math.floor(bitLen/0x100000000);
  const lo=bitLen>>>0;
  for(let shift=24;shift>=0;shift-=8)data.push((hi>>>shift)&255);
  for(let shift=24;shift>=0;shift-=8)data.push((lo>>>shift)&255);
  const w=new Array(64);
  const rotr=(x,n)=>(x>>>n)|(x<<(32-n));
  for(let off=0;off<data.length;off+=64){
    for(let i=0;i<16;i++){
      const j=off+i*4;
      w[i]=((data[j]<<24)|(data[j+1]<<16)|(data[j+2]<<8)|data[j+3])>>>0;
    }
    for(let i=16;i<64;i++){
      const a=w[i-15],b=w[i-2];
      const s0=(rotr(a,7)^rotr(a,18)^(a>>>3))>>>0;
      const s1=(rotr(b,17)^rotr(b,19)^(b>>>10))>>>0;
      w[i]=(w[i-16]+s0+w[i-7]+s1)>>>0;
    }
    let [a,b,c,d,e,f,g,q]=h;
    for(let i=0;i<64;i++){
      const S1=(rotr(e,6)^rotr(e,11)^rotr(e,25))>>>0;
      const ch=((e&f)^((~e)&g))>>>0;
      const t1=(q+S1+ch+k[i]+w[i])>>>0;
      const S0=(rotr(a,2)^rotr(a,13)^rotr(a,22))>>>0;
      const maj=((a&b)^(a&c)^(b&c))>>>0;
      const t2=(S0+maj)>>>0;
      q=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;
    }
    h[0]=(h[0]+a)>>>0;h[1]=(h[1]+b)>>>0;h[2]=(h[2]+c)>>>0;h[3]=(h[3]+d)>>>0;
    h[4]=(h[4]+e)>>>0;h[5]=(h[5]+f)>>>0;h[6]=(h[6]+g)>>>0;h[7]=(h[7]+q)>>>0;
  }
  return h.map(x=>x.toString(16).padStart(8,'0')).join('');
}
const fail=(code,detail)=>{throw new Error(detail?code+':'+detail:code)};
const ok=(value,code,detail)=>{if(!value)fail(code,detail)};
const clone=value=>JSON.parse(JSON.stringify(value));
const canonical=value=>{
  if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
  if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+canonical(value[key])).join(',')+'}';
  return JSON.stringify(value);
};
const deepFreeze=value=>{
  if(value&&typeof value==='object'&&!Object.isFrozen(value)){
    Object.freeze(value);
    for(const key of Object.keys(value))deepFreeze(value[key]);
  }
  return value;
};
deepFreeze(DATA);
const NS='kenigevents-a0-direct-plugin-'+DATA.slug;
const STATE_KEY=NS+':resume-state-v1';
const children=shape=>Array.from(shape&&shape.children||[]);
const walk=shape=>shape?[shape].concat(children(shape).flatMap(walk)):[];
const get=(shape,key,namespace=NS)=>shape&&typeof shape.getSharedPluginData==='function'?(shape.getSharedPluginData(namespace,key)||''):'';
const set=(shape,key,value,namespace=NS)=>{ok(shape&&typeof shape.setSharedPluginData==='function','PLUGIN_DATA_UNAVAILABLE',key);shape.setSharedPluginData(namespace,key,String(value))};
const parseSource=name=>{
  const raw=DATA.source_raw[name];
  ok(typeof raw==='string','SOURCE_RAW_MISSING',name);
  try{return JSON.parse(raw)}catch(error){fail('SOURCE_JSON_INVALID',name)}
};
const sourceMeta=name=>DATA.source_records.find(item=>item.name===name);
const verifyRecord=(name,field)=>{
  const object=parseSource(name),expected=object[field];
  ok(typeof expected==='string'&&/^[0-9a-f]{64}$/.test(expected),'SOURCE_RECORD_HASH_MISSING',name+':'+field);
  const copy=clone(object);delete copy[field];
  ok(sha256Hex(canonical(copy))===expected,'SOURCE_RECORD_HASH_MISMATCH',name);
  return expected;
};
function verifySources(){
  const verified=[];
  for(const item of DATA.source_records){
    const raw=DATA.source_raw[item.name];
    ok(typeof raw==='string','SOURCE_RAW_MISSING',item.name);
    ok(utf8Bytes(raw).length===item.bytes,'SOURCE_BYTES_MISMATCH',item.name);
    ok(sha256Hex(raw)===item.sha256,'SOURCE_SHA256_MISMATCH',item.name);
    verified.push({name:item.name,path:item.path,ref:item.ref,bytes:item.bytes,sha256:item.sha256,git_blob_sha1:item.git_blob_sha1});
  }
  const primary=verifyRecord(DATA.primary_source_name,DATA.primary_record_field);
  ok(primary===DATA.source_package_record_sha256,'PRIMARY_PACKAGE_BINDING_MISMATCH');
  for(const extra of DATA.additional_record_sources||[])verifyRecord(extra.name,extra.field);
  ok(DATA.factual_bytes_changed===0,'FACTUAL_BYTES_CHANGED');
  return verified;
}
function readState(penpot){
  const storage=penpot&&penpot.localStorage;
  if(!storage||typeof storage.getItem!=='function')return null;
  const raw=storage.getItem(STATE_KEY);
  if(!raw)return null;
  try{return JSON.parse(raw)}catch(error){fail('RESUME_STATE_INVALID')}
}
function writeState(penpot,state){
  const storage=penpot&&penpot.localStorage;
  ok(storage&&typeof storage.setItem==='function','LOCAL_STORAGE_UNAVAILABLE');
  storage.setItem(STATE_KEY,JSON.stringify(state));
}
function activeRun(penpot){
  let active;
  try{active=JSON.parse(penpot.currentFile.getSharedPluginData('kenigevents','asp-active-run-v1')||'null')}catch(error){fail('ACTIVE_RUN_INVALID')}
  const expected=DATA.run_control;
  ok(active&&active.schema===expected.schema,'ACTIVE_RUN_SCHEMA');
  ok(active.package_id===expected.package_id&&active.run_id===expected.run_id,'ACTIVE_RUN_PACKAGE');
  ok(active.writer_id===expected.writer_id,'ACTIVE_RUN_WRITER');
  ok(active.lease_token===expected.lease_token&&active.cancel_token===expected.cancel_token,'ACTIVE_RUN_TOKEN');
  ok(active.state==='ACTIVE'&&active.cancelled===false,'CANCELLED_OR_INACTIVE_LEASE');
}
function shapeProjection(shape){
  const component=typeof shape.component==='function'?shape.component():null;
  return {
    id:shape.id||null,name:shape.name||'',type:shape.type||'',
    x:Number(shape.x||0),y:Number(shape.y||0),width:Number(shape.width||0),height:Number(shape.height||0),
    hidden:shape.hidden===true,visible:shape.visible!==false,componentId:component&&component.id||null,
    children:children(shape).map(shapeProjection)
  };
}
function findPageById(penpot,id){return Array.from(penpot.currentFile.pages||[]).find(page=>page.id===id)||null}
function findShapeById(page,id){return walk(page&&page.root).find(shape=>shape.id===id)||null}
function captureProtected(penpot){
  const policy=DATA.protected_projections;
  const freePage=findPageById(penpot,policy.free.page_id);
  const foundationPage=findPageById(penpot,policy.foundations.page_id);
  ok(freePage&&foundationPage,'PROTECTED_PAGE_MISSING');
  const freeRoots=policy.free.root_ids.map(id=>findShapeById(freePage,id));
  const foundationRoot=findShapeById(foundationPage,policy.foundations.root_id);
  ok(freeRoots.every(Boolean)&&foundationRoot,'PROTECTED_ROOT_MISSING');
  const placements=children(foundationRoot).filter(shape=>get(shape,'placement-id','kenigevents-f0-r3'));
  ok(placements.length===policy.foundations.placements,'PROTECTED_FOUNDATION_PLACEMENT_COUNT');
  const descriptor={free:freeRoots.map(shapeProjection),foundations:[shapeProjection(foundationRoot)]};
  return {
    descriptor,
    digest:sha256Hex(canonical(descriptor)),
    identity:{
      free_page_id:freePage.id,free_root_ids:freeRoots.map(shape=>shape.id),
      foundation_page_id:foundationPage.id,foundation_root_id:foundationRoot.id,
      foundation_placements:placements.length
    },
    historical_receipt:{
      free_sha256:policy.free.sha256,
      foundations_sha256:policy.foundations.sha256,
      minimum_revision:policy.minimum_revision
    }
  };
}
function verifyProtected(penpot,state){
  const current=captureProtected(penpot);
  ok(state&&state.protected_digest===current.digest,'PROTECTED_PROJECTION_DRIFT');
  return current;
}
function targetPages(penpot){return Array.from(penpot.currentFile.pages||[]).filter(page=>page.name===DATA.target_page_name)}
function validateExistingAtlasPage(page){
  const binding=DATA.atlas_binding;
  ok(binding&&page,'ATLAS_PAGE_MISSING');
  ok(page.name===binding.physical_page_name,'ATLAS_PAGE_NAME_MISMATCH');
  ok(get(page,'source-package-id','kenigevents-atlas-v2')===binding.source_package_id,'ATLAS_SOURCE_PACKAGE_MISMATCH');
  ok(get(page,'projection-role','kenigevents-atlas-v2')===DATA.projection_role,'ATLAS_PROJECTION_ROLE_MISMATCH');
}
async function openExactPage(penpot,page){
  ok(page&&page.id,'TARGET_PAGE_MISSING');
  if(!penpot.currentPage||penpot.currentPage.id!==page.id)await penpot.openPage(page);
  ok(penpot.currentPage&&penpot.currentPage.id===page.id,'CURRENT_PAGE_ID_PROOF_FAILED');
  ok(penpot.currentPage.name===DATA.target_page_name,'CURRENT_PAGE_NAME_PROOF_FAILED');
  return {id:page.id,name:page.name};
}
function findStable(page,id){return walk(page.root).filter(shape=>get(shape,'stable-id')===id)}
function exactlyZeroOrOne(list,code,id){ok(list.length<=1,code,id);return list[0]||null}
function append(parent,child){ok(parent&&typeof parent.appendChild==='function','APPEND_PARENT_INVALID');parent.appendChild(child);return child}
function mutateGroup(penpot,label,expectedCost,fn){
  activeRun(penpot);
  const begin=penpot.history&&penpot.history.undoBlockBegin;
  const finish=penpot.history&&penpot.history.undoBlockFinish;
  const token=typeof begin==='function'?begin.call(penpot.history):null;
  const before=Number(penpot.__a0CreateCount||0);
  try{
    const result=fn();
    ok(!(result&&typeof result.then==='function'),'ASYNC_MUTATION_GROUP_FORBIDDEN',label);
    const after=Number(penpot.__a0CreateCount||before+expectedCost);
    if('__a0CreateCount' in penpot)ok(after-before===expectedCost,'CREATE_COST_MISMATCH',label);
    return result;
  }finally{
    if(token!==null&&typeof finish==='function')finish.call(penpot.history,token);
  }
}
function createBoard(penpot,parent,id,name,width,height,x,y,metadata){
  const board=penpot.createBoard();
  board.name=name;board.x=Number(x||0);board.y=Number(y||0);board.resize(Number(width),Number(height));
  board.fills=[{fillColor:'#FBF7EF',fillOpacity:1}];
  set(board,'stable-id',id);set(board,'managed','true');set(board,'job-id',DATA.job_id);
  set(board,'source-package-sha256',DATA.source_package_record_sha256);
  set(board,'candidate-label','CANDIDATE_BUILD_NOT_ACCEPTED');
  for(const [key,value] of Object.entries(metadata||{}))set(board,key,typeof value==='string'?value:canonical(value));
  return append(parent,board);
}
function createText(penpot,parent,id,characters,x,y,width,height){
  ok(typeof characters==='string'&&characters.trim().length>0,'BLANK_SOURCE_BOUND_TEXT',id);
  ok(!/\b(?:placeholder|lorem ipsum|sample text)\b/i.test(characters),'PLACEHOLDER_TEXT_FORBIDDEN',id);
  const text=penpot.createText(characters);
  text.name=id;text.x=Number(x||0);text.y=Number(y||0);
  if(typeof text.resize==='function')text.resize(Number(width||240),Number(height||80));
  text.fontSize='12';text.lineHeight='1.35';text.growType='fixed';
  text.fills=[{fillColor:'#221A14',fillOpacity:1}];
  set(text,'stable-id',id);set(text,'managed','true');set(text,'job-id',DATA.job_id);
  return append(parent,text);
}
function createBoardAndText(penpot,parent,id,name,width,height,x,y,characters,metadata){
  return mutateGroup(penpot,id,2,()=>{
    const board=createBoard(penpot,parent,id,name,width,height,x,y,metadata);
    createText(penpot,board,id+'/text',characters,16,16,Math.max(80,width-32),Math.max(48,height-32));
    return board;
  });
}
function dependencyMap(input){
  const out={};
  for(const expected of DATA.dependency_specs||[]){
    const actual=input&&input[expected.key];
    ok(actual,'DEPENDENCY_MISSING',expected.key);
    ok(actual.semantic_id===expected.semantic_id,'DEPENDENCY_SEMANTIC_ID_MISMATCH',expected.key);
    if(expected.package_id)ok(actual.package_id===expected.package_id,'DEPENDENCY_PACKAGE_MISMATCH',expected.key);
    if(expected.remote_head)ok(actual.remote_head===expected.remote_head,'DEPENDENCY_HEAD_MISMATCH',expected.key);
    if(expected.git_blob_sha1)ok(actual.git_blob_sha1===expected.git_blob_sha1,'DEPENDENCY_BLOB_MISMATCH',expected.key);
    ok(actual.component&&typeof actual.component.instance==='function','DEPENDENCY_NOT_NATIVE_COMPONENT',expected.key);
    out[expected.key]=actual.component;
  }
  return out;
}
function createLinked(penpot,parent,id,component,metadata){
  return mutateGroup(penpot,id,1,()=>{
    const instance=component.instance();
    ok(instance&&typeof instance.component==='function'&&instance.component(),'DETACHED_DEPENDENCY_INSTANCE',id);
    instance.name=id;set(instance,'stable-id',id);set(instance,'managed','true');set(instance,'job-id',DATA.job_id);
    for(const [key,value] of Object.entries(metadata||{}))set(instance,key,typeof value==='string'?value:canonical(value));
    return append(parent,instance);
  });
}
function pageRoot(page){return page.root}
function componentForMain(penpot,variantId){
  return Array.from(penpot.library.local.components||[]).find(component=>{
    const main=typeof component.mainInstance==='function'?component.mainInstance():component.mainInstance;
    return main&&get(main,'stable-id')==='main/'+variantId&&get(main,'job-id')===DATA.job_id;
  })||null;
}
function regionPayload(variant,region){
  const base={
    job_id:DATA.job_id,subject:DATA.exact_tuple.subject,routes:DATA.exact_tuple.routes,
    active_state:DATA.exact_tuple.active_state,states:DATA.exact_tuple.states,
    fixtures:DATA.exact_tuple.fixtures,fixture_semantics:DATA.exact_tuple.fixture_semantics,
    projection:DATA.exact_tuple.projection,variant:variant.id,scenario_id:variant.scenario_id,
    viewport:variant.viewport,semantic_region:region,required_dependencies:DATA.dependency_specs.map(item=>item.semantic_id)
  };
  if(DATA.extra_factual_data&&DATA.extra_factual_data.owner_review){
    const owner=DATA.extra_factual_data.owner_review;
    if(region==='owner-review.case-table')base.rows=owner.rows;
    if(region==='owner-review.package-groups')base.summary=owner.summary;
    if(region==='owner-review.status-legend')base.rules=owner.rules;
    if(region==='owner-review.header')base.columns=owner.columns;
  }
  if(DATA.extra_factual_data&&DATA.extra_factual_data.archetype_projection)base.archetype_projection=DATA.extra_factual_data.archetype_projection;
  return canonical(base);
}
function pageTasks(penpot,page,components){
  const tasks=[];
  const rootId='root/'+DATA.slug;
  let rootBoard=exactlyZeroOrOne(findStable(page,rootId),'DUPLICATE_ROOT',rootId);
  if(!rootBoard){
    tasks.push({id:rootId,cost:2,run:()=>createBoardAndText(
      penpot,pageRoot(page),rootId,DATA.target_root_name,1800,
      Math.max(...DATA.page_contract.variants.map(v=>v.viewport.height))+160,32,32,
      canonical({job_id:DATA.job_id,subject:DATA.exact_tuple.subject,routes:DATA.exact_tuple.routes,states:DATA.exact_tuple.states,fixtures:DATA.exact_tuple.fixtures,projection:DATA.exact_tuple.projection}),
      {'subject':DATA.exact_tuple.subject,'routes':DATA.exact_tuple.routes,'projection-role':DATA.projection_role}
    )});
  }
  for(let index=0;index<DATA.page_contract.variants.length;index++){
    const variant=DATA.page_contract.variants[index],mainId='main/'+variant.id;
    const main=exactlyZeroOrOne(findStable(page,mainId),'DUPLICATE_MAIN',mainId);
    if(!main){
      tasks.push({id:mainId,cost:2,run:()=>createBoardAndText(
        penpot,pageRoot(page),mainId,DATA.exact_tuple.subject+'/'+variant.id,
        variant.viewport.width,variant.viewport.height,2000,index*1000,
        canonical({job_id:DATA.job_id,variant:variant.id,scenario_id:variant.scenario_id,viewport:variant.viewport,routes:DATA.exact_tuple.routes,state:DATA.exact_tuple.active_state,fixtures:DATA.exact_tuple.fixtures}),
        {'variant':variant.id,'scenario-id':variant.scenario_id,'source-root-key':variant.source_root_key,'projection-sha256':DATA.exact_tuple.projection.sha256}
      )});
      continue;
    }
    const header=exactlyZeroOrOne(findStable(page,mainId+'/text'),'DUPLICATE_MAIN_TEXT',mainId);
    ok(header,'PARTIAL_ATOMIC_GROUP_DRIFT',mainId);
    for(let ri=0;ri<variant.semantic_regions.length;ri++){
      const region=variant.semantic_regions[ri],regionId='region/'+variant.id+'/'+region;
      const found=exactlyZeroOrOne(findStable(page,regionId),'DUPLICATE_REGION',regionId);
      if(!found){
        tasks.push({id:regionId,cost:2,run:()=>createBoardAndText(
          penpot,main,regionId,'Region/'+region,Math.max(160,variant.viewport.width-48),
          Math.max(96,Math.floor((variant.viewport.height-80)/Math.max(1,variant.semantic_regions.length))),
          24,64+ri*Math.max(104,Math.floor((variant.viewport.height-80)/Math.max(1,variant.semantic_regions.length))),
          regionPayload(variant,region),
          {'semantic-region':region,'variant':variant.id,'dependency-substitute':'false','source-bound':'true'}
        )});
      }else{
        const text=exactlyZeroOrOne(findStable(page,regionId+'/text'),'DUPLICATE_REGION_TEXT',regionId);
        ok(text&&typeof text.characters==='string'&&text.characters.trim(),'REGION_NOT_SOURCE_BOUND',regionId);
      }
    }
    const allRegions=variant.semantic_regions.every(region=>{
      const id='region/'+variant.id+'/'+region;
      return findStable(page,id).length===1&&findStable(page,id+'/text').length===1;
    });
    if(allRegions&&!componentForMain(penpot,variant.id)){
      tasks.push({id:'component/'+variant.id,cost:1,run:()=>mutateGroup(penpot,'component/'+variant.id,1,()=>{
        activeRun(penpot);
        const component=penpot.library.local.createComponent([main]);
        component.name=DATA.exact_tuple.subject+' '+variant.id;
        component.path='A0 / Direct Plugin / '+DATA.exact_tuple.subject;
        return component;
      })});
    }
  }
  rootBoard=exactlyZeroOrOne(findStable(page,rootId),'DUPLICATE_ROOT',rootId);
  if(rootBoard){
    for(const variant of DATA.page_contract.variants){
      const component=componentForMain(penpot,variant.id);
      if(component){
        const id='instance/'+variant.id;
        if(!exactlyZeroOrOne(findStable(page,id),'DUPLICATE_INSTANCE',id)){
          tasks.push({id,cost:1,run:()=>createLinked(penpot,rootBoard,id,component,{'variant':variant.id,'scenario-id':variant.scenario_id,'source-bound':'true'})});
        }
      }
    }
  }
  return tasks;
}
function statePayload(state){
  return canonical({job_id:DATA.job_id,projection_role:DATA.projection_role,route:DATA.exact_tuple.route||DATA.exact_tuple.routes,source_package_id:DATA.source_package_id,state});
}
function freeTasks(penpot,page,components){
  const tasks=[],rootId=DATA.target_root_stable_id;
  let rootBoard=exactlyZeroOrOne(findStable(page,rootId),'DUPLICATE_ROOT',rootId);
  if(!rootBoard){
    tasks.push({id:rootId,cost:2,run:()=>createBoardAndText(penpot,pageRoot(page),rootId,DATA.target_root_name,1480,Math.max(900,DATA.states.length*620),32,32,canonical({job_id:DATA.job_id,route:DATA.exact_tuple.route,projection_role:DATA.projection_role,factual_fixture_order:DATA.exact_tuple.factual_fixture_order,rows:DATA.exact_tuple.rows}),{'projection-role':DATA.projection_role,'route':DATA.exact_tuple.route})});
    return tasks;
  }
  for(let si=0;si<DATA.states.length;si++){
    const state=DATA.states[si],sid='state/'+state.scenario_id;
    let stateBoard=exactlyZeroOrOne(findStable(page,sid),'DUPLICATE_STATE',sid);
    if(!stateBoard){
      tasks.push({id:sid,cost:2,run:()=>createBoardAndText(penpot,rootBoard,sid,state.viewport.id+' · '+state.state,state.viewport.width,state.viewport.height,24,96+si*(state.viewport.height+32),statePayload(state),{'scenario-id':state.scenario_id,'state':state.state,'projection-role':DATA.projection_role,'source-bound':'true'})});
      continue;
    }
    ok(findStable(page,sid+'/text').length===1,'STATE_NOT_SOURCE_BOUND',sid);
    const shellId='shell/'+state.scenario_id;
    if(!exactlyZeroOrOne(findStable(page,shellId),'DUPLICATE_SHELL',shellId))tasks.push({id:shellId,cost:1,run:()=>createLinked(penpot,stateBoard,shellId,components.free_shell,{'scenario-id':state.scenario_id,'state':state.state})});
    const brandId='brand/'+state.scenario_id;
    if(!exactlyZeroOrOne(findStable(page,brandId),'DUPLICATE_BRAND',brandId))tasks.push({id:brandId,cost:1,run:()=>createLinked(penpot,stateBoard,brandId,components.brand,{'scenario-id':state.scenario_id,'semantic-id':DATA.dependency_specs.find(x=>x.key==='brand').semantic_id})});
    for(const fixtureId of state.rendered_fixture_ids){
      const cardId='card/'+state.scenario_id+'/'+fixtureId;
      if(!exactlyZeroOrOne(findStable(page,cardId),'DUPLICATE_CARD',cardId))tasks.push({id:cardId,cost:1,run:()=>createLinked(penpot,stateBoard,cardId,components.event_card,{'scenario-id':state.scenario_id,'fixture-id':fixtureId,'fixture-semantics':'EXACT_PROJECTION_MEMBERSHIP'})});
    }
  }
  return tasks;
}
function dateDependencyKey(fragment){
  const hit=DATA.dependency_specs.find(item=>item.key.indexOf(fragment)>=0);
  ok(hit,'DATE_DEPENDENCY_MAPPING_MISSING',fragment);
  return hit.key;
}
function dateTasks(penpot,page,components){
  const tasks=[],rootId=DATA.target_root_stable_id;
  let rootBoard=exactlyZeroOrOne(findStable(page,rootId),'DUPLICATE_ROOT',rootId);
  if(!rootBoard){
    tasks.push({id:rootId,cost:2,run:()=>createBoardAndText(penpot,pageRoot(page),rootId,DATA.target_root_name,1480,Math.max(900,DATA.states.length*940),32,32,canonical({job_id:DATA.job_id,routes:DATA.exact_tuple.routes,projection_role:DATA.projection_role,source_projections:DATA.exact_tuple.source_projections,selected_representations:DATA.exact_tuple.selected_representations,evidence_only_representations:DATA.exact_tuple.evidence_only_representations}),{'projection-role':DATA.projection_role,'subject':'archetype.listing.date'})});
    return tasks;
  }
  const headerKey=dateDependencyKey('shared-header'),listingKey=dateDependencyKey('date-listing'),cardKey=dateDependencyKey('event-card'),footerKey=dateDependencyKey('shared-footer'),mobileKey=dateDependencyKey('mobile-bottom-navigation');
  for(let si=0;si<DATA.states.length;si++){
    const state=DATA.states[si],sid='state/'+state.scenario_id;
    let stateBoard=exactlyZeroOrOne(findStable(page,sid),'DUPLICATE_STATE',sid);
    if(!stateBoard){
      tasks.push({id:sid,cost:2,run:()=>createBoardAndText(penpot,rootBoard,sid,state.viewport.id+' · '+state.representation+' · '+state.state,state.viewport.width,state.viewport.height,24,96+si*(state.viewport.height+32),statePayload(state),{'scenario-id':state.scenario_id,'state':state.state,'representation':state.representation,'source-bound':'true'})});
      continue;
    }
    ok(findStable(page,sid+'/text').length===1,'STATE_NOT_SOURCE_BOUND',sid);
    const headerId='header/'+state.scenario_id;
    if(!exactlyZeroOrOne(findStable(page,headerId),'DUPLICATE_HEADER',headerId))tasks.push({id:headerId,cost:1,run:()=>createLinked(penpot,stateBoard,headerId,components[headerKey],{'scenario-id':state.scenario_id})});
    const listingId='listing/'+state.scenario_id;
    if(!exactlyZeroOrOne(findStable(page,listingId),'DUPLICATE_LISTING',listingId))tasks.push({id:listingId,cost:1,run:()=>createLinked(penpot,stateBoard,listingId,components[listingKey],{'scenario-id':state.scenario_id,'projection-ref':state.projection_ref||'none','state':state.state})});
    for(const fixtureId of state.fixture_ids||[]){
      const cardId='card/'+state.scenario_id+'/'+fixtureId;
      if(!exactlyZeroOrOne(findStable(page,cardId),'DUPLICATE_CARD',cardId))tasks.push({id:cardId,cost:1,run:()=>createLinked(penpot,stateBoard,cardId,components[cardKey],{'scenario-id':state.scenario_id,'fixture-id':fixtureId,'fixture-semantics':state.fixture_semantics})});
    }
    const shellKey=state.viewport.id==='mobile'?mobileKey:footerKey,shellId=(state.viewport.id==='mobile'?'mobile-nav/':'footer/')+state.scenario_id;
    if(!exactlyZeroOrOne(findStable(page,shellId),'DUPLICATE_SHELL_END',shellId))tasks.push({id:shellId,cost:1,run:()=>createLinked(penpot,stateBoard,shellId,components[shellKey],{'scenario-id':state.scenario_id})});
  }
  return tasks;
}
function pendingTasks(penpot,page,components){
  if(DATA.content_kind==='PAGE_UNIT')return pageTasks(penpot,page,components);
  if(DATA.content_kind==='FREE_COMPOSED')return freeTasks(penpot,page,components);
  if(DATA.content_kind==='DATE_COMPOSED')return dateTasks(penpot,page,components);
  fail('CONTENT_KIND_UNSUPPORTED',DATA.content_kind);
}
function executeTasks(penpot,tasks){
  let used=0,created=0,executed=[];
  for(const task of tasks){
    if(used+task.cost>DATA.limits.max_creates_per_invocation)break;
    task.run();used+=task.cost;created+=task.cost;executed.push(task.id);
  }
  ok(created<=3,'CREATE_LIMIT_EXCEEDED');
  ok(tasks.length===0||created>0,'TASK_SCHEDULER_STALLED');
  return {created,executed};
}
function verifyPageTerminal(penpot,page){
  const rootId='root/'+DATA.slug,rootBoard=exactlyZeroOrOne(findStable(page,rootId),'DUPLICATE_ROOT',rootId);
  ok(rootBoard&&findStable(page,rootId+'/text').length===1,'ROOT_MISSING_OR_BLANK');
  for(const variant of DATA.page_contract.variants){
    const mainId='main/'+variant.id,main=exactlyZeroOrOne(findStable(page,mainId),'DUPLICATE_MAIN',mainId);
    ok(main&&findStable(page,mainId+'/text').length===1,'MAIN_MISSING_OR_BLANK',variant.id);
    for(const region of variant.semantic_regions){
      const id='region/'+variant.id+'/'+region,board=exactlyZeroOrOne(findStable(page,id),'DUPLICATE_REGION',id),text=exactlyZeroOrOne(findStable(page,id+'/text'),'DUPLICATE_REGION_TEXT',id);
      ok(board&&text&&typeof text.characters==='string'&&text.characters.trim(),'REGION_MISSING_OR_BLANK',id);
      ok(get(board,'dependency-substitute')==='false','DEPENDENCY_SUBSTITUTE_FORBIDDEN',id);
    }
    const component=componentForMain(penpot,variant.id);
    ok(component,'COMPONENT_MISSING',variant.id);
    const instance=exactlyZeroOrOne(findStable(page,'instance/'+variant.id),'DUPLICATE_INSTANCE',variant.id);
    ok(instance&&typeof instance.component==='function'&&instance.component()&&instance.component().id===component.id,'DETACHED_INSTANCE',variant.id);
  }
  return rootBoard;
}
function verifyFreeTerminal(page,components){
  const rootBoard=exactlyZeroOrOne(findStable(page,DATA.target_root_stable_id),'DUPLICATE_ROOT',DATA.target_root_stable_id);
  ok(rootBoard&&findStable(page,DATA.target_root_stable_id+'/text').length===1,'ROOT_MISSING_OR_BLANK');
  for(const state of DATA.states){
    const sid='state/'+state.scenario_id,sb=exactlyZeroOrOne(findStable(page,sid),'DUPLICATE_STATE',sid);
    ok(sb&&findStable(page,sid+'/text').length===1,'STATE_MISSING_OR_BLANK',sid);
    const shell=exactlyZeroOrOne(findStable(page,'shell/'+state.scenario_id),'DUPLICATE_SHELL',sid);
    const brand=exactlyZeroOrOne(findStable(page,'brand/'+state.scenario_id),'DUPLICATE_BRAND',sid);
    ok(shell&&shell.component().id===components.free_shell.id,'SHELL_DEPENDENCY_DRIFT',sid);
    ok(brand&&brand.component().id===components.brand.id,'BRAND_DEPENDENCY_DRIFT',sid);
    const cards=children(sb).filter(shape=>get(shape,'fixture-id')).map(shape=>get(shape,'fixture-id'));
    ok(canonical(cards)===canonical(state.rendered_fixture_ids),'STATE_FIXTURE_RENDER_DRIFT',sid);
    for(const card of children(sb).filter(shape=>get(shape,'fixture-id')))ok(card.component().id===components.event_card.id,'CARD_DEPENDENCY_DRIFT',sid);
  }
  return rootBoard;
}
function verifyDateTerminal(page,components){
  const rootBoard=exactlyZeroOrOne(findStable(page,DATA.target_root_stable_id),'DUPLICATE_ROOT',DATA.target_root_stable_id);
  ok(rootBoard&&findStable(page,DATA.target_root_stable_id+'/text').length===1,'ROOT_MISSING_OR_BLANK');
  for(const state of DATA.states){
    const sid='state/'+state.scenario_id,sb=exactlyZeroOrOne(findStable(page,sid),'DUPLICATE_STATE',sid);
    ok(sb&&findStable(page,sid+'/text').length===1,'STATE_MISSING_OR_BLANK',sid);
    const cards=children(sb).filter(shape=>get(shape,'fixture-id')).map(shape=>get(shape,'fixture-id'));
    ok(canonical(cards)===canonical(state.fixture_ids||[]),'DATE_FIXTURE_RENDER_DRIFT',sid);
  }
  return rootBoard;
}
function verifyNoScreenshot(rootBoard){
  const images=walk(rootBoard).filter(shape=>shape.type==='image'||Array.from(shape.fills||[]).some(fill=>fill&&fill.fillImage));
  ok(images.length===0,'SCREENSHOT_IMPLEMENTATION_FORBIDDEN');
}
async function ensurePageOnly(ctx){
  const penpot=ctx.penpot;
  ok(penpot&&penpot.currentFile&&penpot.currentFile.id===DATA.target_file_id,'WRONG_PENPOT_FILE');
  activeRun(penpot);verifySources();
  const existingState=readState(penpot);
  if(existingState&&existingState.page_only_complete)return null;
  const before=captureProtected(penpot);
  const pages=targetPages(penpot);ok(pages.length<=1,'DUPLICATE_TARGET_PAGE');
  let page=pages[0]||null,created=0;
  if(DATA.target_mode==='EXACT_EXISTING_ATLAS_PAGE'){
    ok(page,'ATLAS_PAGE_MISSING');validateExistingAtlasPage(page);
  }else if(!page){
    activeRun(penpot);
    page=penpot.createPage();page.name=DATA.target_page_name;
    set(page,'job-id',DATA.job_id);set(page,'source-package-sha256',DATA.source_package_record_sha256);
    set(page,'page-only-first-phase','true');created=1;
  }else{
    const owned=get(page,'job-id');
    ok(!owned||owned===DATA.job_id,'TARGET_PAGE_OWNERSHIP_DRIFT');
    if(!owned){activeRun(penpot);set(page,'job-id',DATA.job_id);set(page,'source-package-sha256',DATA.source_package_record_sha256);set(page,'page-only-first-phase','true')}
  }
  const proof=await openExactPage(penpot,page);
  const after=captureProtected(penpot);ok(after.digest===before.digest,'PROTECTED_PROJECTION_DRIFT');
  writeState(penpot,{schema:'kenigevents.a0.direct-plugin-resume.v1',job_id:DATA.job_id,page_id:page.id,page_only_complete:true,protected_digest:before.digest,settled:false});
  return {schema:'kenigevents.a0.direct-plugin-result.v1',job_id:DATA.job_id,phase:'PAGE_ONLY',created,currentPage:proof,protected_digest:before.digest,terminal:false};
}
async function execute(ctx){
  const penpot=ctx&&ctx.penpot;
  const pageOnly=await ensurePageOnly(ctx||{});
  if(pageOnly)return pageOnly;
  const state=readState(penpot);ok(state&&state.job_id===DATA.job_id&&state.page_only_complete,'PAGE_ONLY_PHASE_REQUIRED');
  const pages=targetPages(penpot);ok(pages.length===1,'TARGET_PAGE_CENSUS');const page=pages[0];
  if(DATA.target_mode==='EXACT_EXISTING_ATLAS_PAGE')validateExistingAtlasPage(page);else ok(get(page,'job-id')===DATA.job_id,'TARGET_PAGE_OWNERSHIP_DRIFT');
  await openExactPage(penpot,page);activeRun(penpot);verifyProtected(penpot,state);
  const components=dependencyMap(ctx.dependencies);
  const tasks=pendingTasks(penpot,page,components);
  if(!tasks.length)return {schema:'kenigevents.a0.direct-plugin-result.v1',job_id:DATA.job_id,phase:'EXECUTION_TERMINAL',created:0,currentPage:{id:page.id,name:page.name},terminal:true,second_terminal_replay_created:0};
  const result=executeTasks(penpot,tasks);
  verifyProtected(penpot,state);
  return {schema:'kenigevents.a0.direct-plugin-result.v1',job_id:DATA.job_id,phase:'RESUME_REQUIRED',created:result.created,created_ids:result.executed,currentPage:{id:page.id,name:page.name},terminal:false};
}
async function settle(ctx){
  const penpot=ctx&&ctx.penpot;
  ok(penpot&&penpot.currentFile&&penpot.currentFile.id===DATA.target_file_id,'WRONG_PENPOT_FILE');
  const state=readState(penpot);ok(state&&state.page_only_complete,'PAGE_ONLY_PHASE_REQUIRED');
  const pages=targetPages(penpot);ok(pages.length===1,'TARGET_PAGE_CENSUS');const page=pages[0];
  await openExactPage(penpot,page);activeRun(penpot);verifySources();verifyProtected(penpot,state);
  const components=dependencyMap(ctx.dependencies);
  ok(pendingTasks(penpot,page,components).length===0,'EXECUTION_NOT_TERMINAL');
  let rootBoard;
  if(DATA.content_kind==='PAGE_UNIT')rootBoard=verifyPageTerminal(penpot,page);
  else if(DATA.content_kind==='FREE_COMPOSED')rootBoard=verifyFreeTerminal(page,components);
  else rootBoard=verifyDateTerminal(page,components);
  verifyNoScreenshot(rootBoard);
  const validation=penpot.currentFile.validate()||[];ok(validation.length===0,'PENPOT_VALIDATION_NOT_EMPTY');
  const raw=await rootBoard.export({type:'png',scale:1});
  const bytes=raw instanceof Uint8Array?raw:new Uint8Array(raw);
  ok(bytes.length>0,'ROOT_EXPORT_EMPTY');
  const label=DATA.job_id+' · DIRECT_PLUGIN_BUNDLE_VERIFIED · '+DATA.run_control.run_id;
  let versions=await penpot.currentFile.findVersions();let version=Array.from(versions||[]).find(item=>item.label===label);
  if(!version){activeRun(penpot);version=await penpot.currentFile.saveVersion(label)}
  verifyProtected(penpot,state);
  state.settled=true;state.settlement_sha256=sha256Hex(canonical({job_id:DATA.job_id,page_id:page.id,root_id:rootBoard.id,source_package_sha256:DATA.source_package_record_sha256,export_sha256:sha256Hex(bytes)}));writeState(penpot,state);
  return {schema:'kenigevents.a0.direct-plugin-settlement.v1',job_id:DATA.job_id,terminal_state:'DIRECT_PLUGIN_BUNDLE_READY_D0_QA_INTEGRATE',created:0,second_terminal_replay_created:0,page_id:page.id,root_id:rootBoard.id,source_package_sha256:DATA.source_package_record_sha256,export:{bytes:bytes.length,sha256:sha256Hex(bytes)},version_id:version&&version.id||null,validation,visual_pass_declared:false,penpot_execution_authorized:false,penpot_reads_by_a0:0,penpot_mutations_by_a0:0};
}
function inspect(){
  return clone({schema_version:DATA.schema_version,job_id:DATA.job_id,state:DATA.state,content_kind:DATA.content_kind,source_package_id:DATA.source_package_id,source_package_record_sha256:DATA.source_package_record_sha256,sources:verifySources(),run_control:DATA.run_control,limits:DATA.limits,protected_projections:DATA.protected_projections,atlas_authorization:DATA.atlas_authorization,callability_contract_comments:DATA.callability_contract_comments});
}
function project(){verifySources();return clone({job_id:DATA.job_id,projection_role:DATA.projection_role,target:{file_id:DATA.target_file_id,mode:DATA.target_mode,page_name:DATA.target_page_name,root_name:DATA.target_root_name},exact_tuple:DATA.exact_tuple,page_contract:DATA.page_contract||null,dependency_specs:DATA.dependency_specs,extra_factual_data:DATA.extra_factual_data||null});}
const api=deepFreeze({inspect,project,execute,settle,sha256Hex,canonical});
const registry=root.KenigEventsA0DirectPluginBundles||(root.KenigEventsA0DirectPluginBundles=Object.create(null));
ok(!registry[DATA.job_id],'BUNDLE_GLOBAL_COLLISION',DATA.job_id);
registry[DATA.job_id]=api;
})(globalThis);
