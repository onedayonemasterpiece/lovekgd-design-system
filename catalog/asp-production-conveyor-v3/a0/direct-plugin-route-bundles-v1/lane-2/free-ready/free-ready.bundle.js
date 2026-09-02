(function(root){
'use strict';
const DATA={"additional_record_sources":[{"field":"record_sha256","name":"logical-free-package"},{"field":"record_sha256","name":"free-rows-package"}],"atlas_authorization":{"branch":"d0/atlas-r2-medallions-balance-evidence-v1-20260902","bundle_readiness_is_not_penpot_execution_authorization":true,"comment":5506769941,"future_visual_pass_implied":false,"head":"9c2f0578cc58c2e490248a66bfe6e8297ab9410c","initial_batch_max_new_pages":3,"parent":"0fbfd4839343de71d5128b2e9c2ad232dde6abf4","tree":"c22812886dd41578364808d56e2915e7df1ad2aa"},"atlas_binding":{"atlas_id":"ASP_PENPOT_ATLAS_LAYOUT_V2","atlas_mutation_by_a0":false,"bindings_git_blob_sha1":"23475806beebfbe21bd77759440c169c60627550","bindings_path":"catalog/asp-production-conveyor-v3/atlas-v2/page-unit-bindings.v2.json","logical_source_unit_id":"free-collection-eventcard","page_order":"0200","physical_page_name":"00 · Components · Free collection","projection_role":"READY","remote_head":"663be702d481972cb2e8863af500f1c35dda1d8c","remote_tree":"cf9a1e6a5e0a84aea5636334dbd3be4961039b75","source_package_id":"PROTECTED-FREE-COLLECTION-EVENTCARD"},"callability_contract_comments":[5506830213,5506836084],"content_kind":"FREE_COMPOSED","dependency_specs":[{"exact_tuple_required":true,"fallback":"FORBIDDEN","git_blob_sha1":"fc904c1284bcd237f77853a8a4fd41efa153ebe9","key":"brand","package_id":"F-MEDALLIONS-BRAND-ASSETS","remote_head":"8c7fcdb00f583b7de1849d9fa21542bc585f2cea","required_state":"D0_QA_INTEGRATE_EXACT_PASS","semantic_id":"brand.identity-and-pwa"},{"exact_tuple_required":true,"fallback":"FORBIDDEN","git_blob_sha1":"6496f9fdf2c19cce06c2a07d5b4d48061afe5522","key":"event_card","package_id":"U-EVENTCARD-FOUR-CASES","remote_head":"c2d6ff107c632311d1c1d0cb1b74d7eb0a465b18","required_state":"D0_QA_INTEGRATE_EXACT_PASS","semantic_id":"component.event-card.free-collection"},{"exact_tuple_required":true,"fallback":"FORBIDDEN","git_blob_sha1":"4e7479dea2ab321b51ef937425bd3c78e5bc06cb","key":"free_shell","package_id":"U-FREE-SHELL","remote_head":"9342d785df1d583ac9104dff2253df0e05b687dd","remote_tree":"9f45472edccce1836f84f21aa7a55764745f3f28","required_state":"D0_QA_INTEGRATE_EXACT_PASS","semantic_id":"free.collection.route"}],"exact_tuple":{"factual_fixture_order":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"projection_role":"READY","route":"/podborki/besplatnye-sobytiya/","rows":[{"count":2,"fixture_ids":["event.real.8006","event.real.8200"],"group":"events","heading":"События","order":1,"semantic_id":"a0.free.rows.events.r2"},{"count":3,"fixture_ids":["event.real.2182","event.real.6711","event.real.7609"],"group":"exhibitions","heading":"Выставки","order":2,"semantic_id":"a0.free.rows.exhibitions.r2"}],"states":[{"factual_fixture_order":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"rendered_fixture_ids":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"rows":[{"count":2,"fixture_ids":["event.real.8006","event.real.8200"],"group":"events"},{"count":3,"fixture_ids":["event.real.2182","event.real.6711","event.real.7609"],"group":"exhibitions"}],"scenario_id":"a0.free.desktop.top.r2","shell_contract":{"header":"default","hero":"visible","medallion":"normal"},"state":"top","state_packet_sha256":"689bd109987c0774ff165b53d90668191cc06965ad048f8357a8ad531b123a3b","state_semantics":"READY route at initial scroll; hero visible; exact 2+3 rows rendered.","viewport":{"height":800,"id":"desktop","width":1280}},{"factual_fixture_order":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"rendered_fixture_ids":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"rows":[{"count":2,"fixture_ids":["event.real.8006","event.real.8200"],"group":"events"},{"count":3,"fixture_ids":["event.real.2182","event.real.6711","event.real.7609"],"group":"exhibitions"}],"scenario_id":"a0.free.mobile.top.r2","shell_contract":{"header":"default","hero":"visible","medallion":"normal"},"state":"top","state_packet_sha256":"d0f28a994d33030ddfc3a1a1cbbca6449f334812a15946bf409da9c4259306ff","state_semantics":"READY route at initial scroll; hero visible; exact 2+3 rows rendered.","viewport":{"height":844,"id":"mobile","width":390}},{"factual_fixture_order":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"rendered_fixture_ids":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"rows":[{"count":2,"fixture_ids":["event.real.8006","event.real.8200"],"group":"events"},{"count":3,"fixture_ids":["event.real.2182","event.real.6711","event.real.7609"],"group":"exhibitions"}],"scenario_id":"a0.free.desktop.scrolled.r2","shell_contract":{"header":"scrolled","hero":"past-or-full","medallion":"sticky/floating"},"state":"scrolled","state_packet_sha256":"07669631fd165c9e48f7731abd080d34df04703ea35214e33eef304bd7028cd0","state_semantics":"READY route after shell scroll transition; exact 2+3 rows remain unchanged.","viewport":{"height":800,"id":"desktop","width":1280}},{"factual_fixture_order":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"rendered_fixture_ids":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"rows":[{"count":2,"fixture_ids":["event.real.8006","event.real.8200"],"group":"events"},{"count":3,"fixture_ids":["event.real.2182","event.real.6711","event.real.7609"],"group":"exhibitions"}],"scenario_id":"a0.free.mobile.scrolled.r2","shell_contract":{"header":"scrolled","hero":"past-or-full","medallion":"sticky/floating"},"state":"scrolled","state_packet_sha256":"ac31508ec217eab2944698d5f049e459633eab8705836a26dde11d77456c70b9","state_semantics":"READY route after shell scroll transition; exact 2+3 rows remain unchanged.","viewport":{"height":844,"id":"mobile","width":390}},{"factual_fixture_order":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"rendered_fixture_ids":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"rows":[{"count":2,"fixture_ids":["event.real.8006","event.real.8200"],"group":"events"},{"count":3,"fixture_ids":["event.real.2182","event.real.6711","event.real.7609"],"group":"exhibitions"}],"scenario_id":"a0.free.desktop.full.r2","shell_contract":{"header":"scrolled","hero":"past-or-full","medallion":"sticky/floating"},"state":"full","state_packet_sha256":"d81d0533fb7cdb5852d846e5fc9dedd3e79c7ff0d32e1ab6a8c107fbf55e7975","state_semantics":"READY full-route composition; exact 2+3 rows and terminal footer/navigation state.","viewport":{"height":800,"id":"desktop","width":1280}},{"factual_fixture_order":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"rendered_fixture_ids":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"rows":[{"count":2,"fixture_ids":["event.real.8006","event.real.8200"],"group":"events"},{"count":3,"fixture_ids":["event.real.2182","event.real.6711","event.real.7609"],"group":"exhibitions"}],"scenario_id":"a0.free.mobile.full.r2","shell_contract":{"header":"scrolled","hero":"past-or-full","medallion":"sticky/floating"},"state":"full","state_packet_sha256":"1b7398baeb8bb3d3758a90e5cf1585ccf25738c588e996a19bcfb8b5daffde00","state_semantics":"READY full-route composition; exact 2+3 rows and terminal footer/navigation state.","viewport":{"height":844,"id":"mobile","width":390}}]},"factual_bytes_changed":0,"job_id":"A0-DIRECT-PLUGIN-FREE-READY-V1","lane":"lane-2","limits":{"max_creates_per_invocation":3,"second_terminal_replay_created":0},"missing_dependency_action":"ABORT; NO_SUBSTITUTE_CARDS_OR_SHELL","penpot_mutations_by_a0":0,"penpot_reads_by_a0":0,"primary_record_field":"record_sha256","primary_source_name":"physical-free-unit","projection_role":"READY","protected_projections":{"foundations":{"chars":43736,"page_id":"313fb1ed-0d5c-8095-8008-9183322ab3a9","placements":37,"rejected_scalar_sha256":"523e43cfe95df7962f8034c4dc2e9f04f02114b15ad488587c707e35b6fed8f1","root_id":"313fb1ed-0d5c-8095-8008-918a0c1473af","sha256":"1b119d154376505b8d28036cbf33e97f9009a007bf0a5a5765de2750644da1fa","utf8_bytes":43746},"free":{"chars":84033,"page_id":"c16498cb-b51d-8030-8008-904bd8fc9c53","root_ids":["313fb1ed-0d5c-8095-8008-9108df52b2ce","313fb1ed-0d5c-8095-8008-912c45090653"],"sha256":"0b00102e348367601fe35de30e06dc22b10883577a22917320955058115fc042","utf8_bytes":84034},"minimum_revision":113},"run_control":{"cancel_token":"57ae4aebd5b9f2f27ae94c047e28bca166a3d442df79579d86beb3e10282674d","lease_token":"c52f4becb53f561469884a169928db60f70305f160ab79bdd3414cb8b8c51687","package_id":"A0-DIRECT-PLUGIN-FREE-READY-V1","run_id":"2d5a5d14-23a0-4a02-adf2-75c0d7e4bf8f","schema":"kenigevents.asp-run-control.v1","state":"ACTIVE_REQUIRED","writer_id":"/root/publish_r2"},"schema_version":"kenigevents.a0.direct-plugin-route-bundle-data.v1","slug":"free-ready","source_package_id":"A-FREE-FULL-PAGE-R2-READY","source_package_record_sha256":"eaee8022664de1dab8a1d4ab47327794ed57788dd8947988b88f3a81eb34a8be","source_raw":{"free-rows-package":"{\n  \"artifacts\": {\n    \"executor\": {\n      \"bytes\": 11595,\n      \"git_blob_sha1\": \"6bc05ad3c36d03295371d30281fa6790ad1fe12b\",\n      \"path\": \"scripts/asp-production-conveyor-v3/a0/free-rows-data-r2/free_rows_native_executor_r2.js\",\n      \"sha256\": \"12b82e9b2b70548dda65f704fd539b7554bd87a073d0d162b051cf93e2de6cdc\"\n    },\n    \"schema\": {\n      \"path\": \"catalog/asp-production-conveyor-v3/a0/free-rows-data-r2/schema.v1.json\"\n    },\n    \"setup\": {\n      \"bytes\": 1587,\n      \"git_blob_sha1\": \"a0b86dc0ee642c3589301438fa8a1908918872fe\",\n      \"path\": \"scripts/asp-production-conveyor-v3/a0/free-rows-data-r2/setup_free_rows_data_r2.js\",\n      \"sha256\": \"41730e7cc7c1b1907c12f0ea3032db75ee6159cfc1ab4df31200f59cca1f2a2e\"\n    },\n    \"test\": {\n      \"bytes\": 8041,\n      \"git_blob_sha1\": \"e8499ff1722e49d9f97c86f4f37927aaeed475fc\",\n      \"path\": \"tests/asp-production-conveyor-v3/a0/free-rows-data-r2/free_rows_data_r2.test.js\",\n      \"sha256\": \"ca6a76d81b64d19396c7ee1031d4436cc49bcc7db94752ce424c71f4ad3249e7\"\n    }\n  },\n  \"atlas_binding\": {\n    \"atlas_id\": \"ASP_PENPOT_ATLAS_LAYOUT_V2\",\n    \"atlas_mutation_by_a0\": false,\n    \"binding_kind\": \"DATA_SOURCE_FOR_EXISTING_READY_PROJECTION\",\n    \"bindings_git_blob_sha1\": \"23475806beebfbe21bd77759440c169c60627550\",\n    \"bindings_path\": \"catalog/asp-production-conveyor-v3/atlas-v2/page-unit-bindings.v2.json\",\n    \"bindings_sha256\": \"cf9925bae600db40d306902d60a9dbd157628057c875fc5a83191140e527ac81\",\n    \"logical_source_unit_id\": \"free-collection-eventcard\",\n    \"page_order\": \"0200\",\n    \"physical_page_name\": \"00 · Components · Free collection\",\n    \"projection_role\": \"READY\",\n    \"remote_branch\": \"o0/penpot-atlas-layout-v2-20260901\",\n    \"remote_head\": \"663be702d481972cb2e8863af500f1c35dda1d8c\",\n    \"remote_tree\": \"cf9a1e6a5e0a84aea5636334dbd3be4961039b75\",\n    \"source_package_id\": \"PROTECTED-FREE-COLLECTION-EVENTCARD\"\n  },\n  \"dependency_gates\": {\n    \"event_card\": {\n      \"bytes\": 20051,\n      \"fallback\": \"FORBIDDEN\",\n      \"git_blob_sha1\": \"6496f9fdf2c19cce06c2a07d5b4d48061afe5522\",\n      \"package_id\": \"U-EVENTCARD-FOUR-CASES\",\n      \"path\": \"catalog/asp-production-conveyor-v3/u0/U-EVENTCARD-FOUR-CASES.package.v1.json\",\n      \"remote_head\": \"c2d6ff107c632311d1c1d0cb1b74d7eb0a465b18\",\n      \"remote_tree\": \"ddff285e2a16f2f0590ac2964b27dedd853d4de8\",\n      \"required_state\": \"D0_QA_INTEGRATE_EXACT_PASS\",\n      \"semantic_id\": \"component.event-card.free-collection\",\n      \"sha256\": \"bf25934808144ba1a34c6676fdb4dd6147916713da783eaf7c7e50a61b196f81\"\n    },\n    \"medallion\": {\n      \"fallback\": \"FORBIDDEN\",\n      \"git_blob_sha1\": \"fc904c1284bcd237f77853a8a4fd41efa153ebe9\",\n      \"package_id\": \"F-MEDALLIONS-BRAND-ASSETS\",\n      \"path\": \"catalog/asp-production-conveyor-v3/f0/F-MEDALLIONS-BRAND-ASSETS.package.v3.json\",\n      \"remote_head\": \"8c7fcdb00f583b7de1849d9fa21542bc585f2cea\",\n      \"required_state\": \"D0_QA_INTEGRATE_EXACT_PASS\",\n      \"semantic_id\": \"mapping.admission-free\"\n    }\n  },\n  \"fixture_order\": [\n    \"event.real.2182\",\n    \"event.real.6711\",\n    \"event.real.7609\",\n    \"event.real.8006\",\n    \"event.real.8200\"\n  ],\n  \"frozen_base\": {\n    \"branch\": \"a0/asp-penpot-page-wave-v1-20260901\",\n    \"head\": \"4edc859861fba3f18fab0e65e9d2e8c0a7394bdb\",\n    \"repository\": \"onedayonemasterpiece/lovekgd-design-system\",\n    \"tree\": \"3132550212222ec3dea716710821e732ad0d92bb\"\n  },\n  \"kaggle_used\": false,\n  \"limits\": {\n    \"fixture_discovery_calls\": 0,\n    \"max_managed_creations_per_invocation\": 3,\n    \"second_terminal_run_created\": 0\n  },\n  \"negative_test_classes\": [\n    \"fixture-order-drift\",\n    \"runtime-discovery-enabled\",\n    \"missing-eventcard-dependency\",\n    \"stale-medallion-dependency\",\n    \"wrong-atlas-projection-role\",\n    \"duplicate-semantic-id\",\n    \"screenshot-implementation\",\n    \"cancelled-lease\",\n    \"protected-projection-drift\"\n  ],\n  \"old_penpot_lineage\": \"FORBIDDEN\",\n  \"owner\": \"A0\",\n  \"package_id\": \"A-FREE-ROWS-DATA-R2\",\n  \"penpot_execution_authorized\": false,\n  \"penpot_mutations_by_a0\": 0,\n  \"promotion_authorized\": false,\n  \"record_sha256\": \"0acf045d499c196f10cbdbdecf0e8463bdc5328ce7b38cdb68c462a02c021129\",\n  \"render_order\": [\n    \"event.real.8006\",\n    \"event.real.8200\",\n    \"event.real.2182\",\n    \"event.real.6711\",\n    \"event.real.7609\"\n  ],\n  \"route\": \"/podborki/besplatnye-sobytiya/\",\n  \"rows\": [\n    {\n      \"count\": 2,\n      \"fixture_ids\": [\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"group\": \"events\",\n      \"heading\": \"События\",\n      \"order\": 1,\n      \"semantic_id\": \"a0.free.rows.events.r2\"\n    },\n    {\n      \"count\": 3,\n      \"fixture_ids\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\"\n      ],\n      \"group\": \"exhibitions\",\n      \"heading\": \"Выставки\",\n      \"order\": 2,\n      \"semantic_id\": \"a0.free.rows.exhibitions.r2\"\n    }\n  ],\n  \"run_control\": {\n    \"cancel_token\": \"a393dd838f822e55e70c690c6e201cda1d5c10600647bd10d7415cf985371786\",\n    \"lease_token\": \"95ca769415065408ed8c7d0b4b12533f4eceefb271e2fc19866c8c7e9b3ecd61\",\n    \"run_id\": \"8712a5a5-a539-5ed5-97c8-78159ea8bf1c\",\n    \"schema\": \"kenigevents.asp-run-control.v1\",\n    \"separate_package_lease\": true,\n    \"state\": \"ACTIVE_REQUIRED\",\n    \"writer_id\": \"/root/publish_r2\"\n  },\n  \"runtime_fixture_discovery\": false,\n  \"schema_version\": \"kenigevents.a0.free-rows-data-r2.package.v1\",\n  \"selection_policy\": {\n    \"membership\": \"EXACT_FROZEN_PROJECTION_ONLY\",\n    \"missing_eventcard_variant\": \"ABORT_NO_GUESSED_SUBSTITUTION\",\n    \"missing_medallion\": \"ABORT_NO_GUESSED_SUBSTITUTION\",\n    \"runtime_query_or_discovery\": \"FORBIDDEN\"\n  },\n  \"source_tuple\": {\n    \"a0_projection\": {\n      \"head\": \"4edc859861fba3f18fab0e65e9d2e8c0a7394bdb\",\n      \"path\": \"catalog/asp-production-conveyor-v3/a0/production-bundle.v1.json#/free_route_projection\",\n      \"projection_record_sha256\": \"e645fb8e023c2271ee05b109bcc828e0e95959162ef3008653d0b2be08b4c471\"\n    },\n    \"a0_state_packet\": {\n      \"head\": \"4edc859861fba3f18fab0e65e9d2e8c0a7394bdb\",\n      \"packet_id\": \"free-collection.six-cases.a0.v1\",\n      \"path\": \"catalog/asp-production-conveyor-v3/a0/production-bundle.v1.json#/free_route_state_packets\",\n      \"state_packet_sha256\": \"afeda31dfc19de3d98d35d4574cda757b01b8d5144c6227eaa60c3595a4e86f2\"\n    },\n    \"canonical_projection\": {\n      \"canonical_projection_sha256\": \"c1cf986815f1e217c9bf482151252b729109f7cb932aff9b153b265ebe411c12\",\n      \"git_blob_sha1\": \"64d8e2a17bd8d4a8b5f9efd65e66a2ad825ec9be\",\n      \"head\": \"7bf067475a1dd03b5208b804ced9dbed277cdf30\",\n      \"path\": \"catalog/fixtures/ui-reference-events/v2/projections/free-collection-september.v1.json\",\n      \"projection_id\": \"free-collection-september.v1\",\n      \"tree\": \"47095a9f2089e3fc8f99752252bbcc367034d84c\"\n    },\n    \"golden_corpus\": {\n      \"corpus_id\": \"ui-reference-events.v2\",\n      \"corpus_sha256\": \"b1746f0cd68be6dd6060858fb765c6863535aefbcf4844b9b50c279d69e9306a\",\n      \"head\": \"7bf067475a1dd03b5208b804ced9dbed277cdf30\",\n      \"immutable\": true,\n      \"path\": \"catalog/fixtures/ui-reference-events/v2/corpus.json\",\n      \"tree\": \"47095a9f2089e3fc8f99752252bbcc367034d84c\"\n    },\n    \"old_factual_bundle\": {\n      \"bytes\": 14039,\n      \"git_blob_sha1\": \"7165c7055040aeac87340e8773378f1cd50430b5\",\n      \"head\": \"4edc859861fba3f18fab0e65e9d2e8c0a7394bdb\",\n      \"path\": \"catalog/asp-production-conveyor-v3/a0/production-bundle.v1.json\",\n      \"sha256\": \"4126d436ecec0e38210b73301a61c4a6013450fe57bc29fdb559051c34d54a0d\",\n      \"tree\": \"3132550212222ec3dea716710821e732ad0d92bb\"\n    }\n  },\n  \"state\": \"MAT_PACKAGE_READY_QA_INTEGRATE_GATED\",\n  \"storage\": {\n    \"protected_baseline\": \"a0_free_rows_r2_baseline\",\n    \"setup_receipt\": \"a0_free_rows_r2_setup\"\n  },\n  \"supersedes\": {\n    \"kind\": \"CURRENT_EXECUTABLE_SUCCESSOR\",\n    \"old_package_reissued\": false,\n    \"package_id\": \"A-FREE-ROWS-DATA\",\n    \"reason\": \"Freeze the current corpus/projection/state tuple and add a concrete dependency-gated native executor.\"\n  },\n  \"target\": {\n    \"existing_atlas_content\": \"NO_MUTATION\",\n    \"managed_scope\": \"PACKAGE_ROOT_ONLY\",\n    \"mode\": \"D0_BINDS_EXISTING_ATLAS_READY_PAGE\",\n    \"root_name\": \"CANDIDATE_BUILD_NOT_ACCEPTED · A-FREE-ROWS-DATA-R2\",\n    \"root_semantic_id\": \"a0.free.rows.r2.root\"\n  },\n  \"terminal_contract\": {\n    \"detached_instances\": 0,\n    \"event_card_instances\": 5,\n    \"events\": 2,\n    \"exhibitions\": 3,\n    \"medallion_instances\": 2,\n    \"root_export_nonempty\": true,\n    \"rows\": 2,\n    \"screenshot_shapes\": 0,\n    \"second_run_created\": 0,\n    \"validation\": []\n  },\n  \"visual_acceptance\": \"PENDING_V0\"\n}\n","logical-free-package":"{\n  \"factual_fixture_order\": [\n    \"event.real.2182\",\n    \"event.real.6711\",\n    \"event.real.7609\",\n    \"event.real.8006\",\n    \"event.real.8200\"\n  ],\n  \"factual_sections\": [\n    {\n      \"count\": 2,\n      \"fixture_ids\": [\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"group\": \"events\",\n      \"order\": 1\n    },\n    {\n      \"count\": 3,\n      \"fixture_ids\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\"\n      ],\n      \"group\": \"exhibitions\",\n      \"order\": 2\n    }\n  ],\n  \"frozen_base\": {\n    \"head\": \"4edc859861fba3f18fab0e65e9d2e8c0a7394bdb\",\n    \"tree\": \"3132550212222ec3dea716710821e732ad0d92bb\"\n  },\n  \"lane1_binding\": {\n    \"dependency_rule\": \"EXACT_REMOTE_COMMIT_ANCESTRY_REQUIRED\",\n    \"package_id\": \"A-FREE-ROWS-DATA-R2\",\n    \"package_record_sha256\": \"0acf045d499c196f10cbdbdecf0e8463bdc5328ce7b38cdb68c462a02c021129\",\n    \"path\": \"catalog/asp-production-conveyor-v3/a0/free-rows-data-r2/A-FREE-ROWS-DATA-R2.package.v1.json\"\n  },\n  \"lane1_terminal_head\": \"9e8edbed95eb40807059e6c6f10af74beeaee683\",\n  \"owner\": \"A0\",\n  \"package_id\": \"A-FREE-FULL-PAGE-R2\",\n  \"penpot_mutations_by_a0\": 0,\n  \"physical_units\": [\n    {\n      \"package_id\": \"A-FREE-FULL-PAGE-R2-READY\",\n      \"path\": \"catalog/asp-production-conveyor-v3/a0/free-full-page-r2/A-FREE-FULL-PAGE-R2-READY.package.v1.json\",\n      \"projection_role\": \"READY\"\n    },\n    {\n      \"package_id\": \"A-FREE-FULL-PAGE-R2-EXCEPTION\",\n      \"path\": \"catalog/asp-production-conveyor-v3/a0/free-full-page-r2/A-FREE-FULL-PAGE-R2-EXCEPTION.package.v1.json\",\n      \"projection_role\": \"EXCEPTION\"\n    }\n  ],\n  \"record_sha256\": \"33ce556aff7535126fea202443bdfd6212d4049e4896a0073d620c53eea046be\",\n  \"route\": \"/podborki/besplatnye-sobytiya/\",\n  \"rules\": {\n    \"guessed_eventcard_variants\": \"FORBIDDEN\",\n    \"old_penpot_lineage\": \"FORBIDDEN\",\n    \"placeholders\": \"FORBIDDEN\",\n    \"promotion_authorized\": false,\n    \"runtime_fixture_discovery\": false,\n    \"screenshots_as_implementation\": \"FORBIDDEN\",\n    \"visual_acceptance\": \"PENDING_V0\"\n  },\n  \"schema_version\": \"kenigevents.a0.free-full-page-r2.logical-package.v1\",\n  \"source_tuple\": {\n    \"a0_projection\": {\n      \"head\": \"4edc859861fba3f18fab0e65e9d2e8c0a7394bdb\",\n      \"sha256\": \"e645fb8e023c2271ee05b109bcc828e0e95959162ef3008653d0b2be08b4c471\"\n    },\n    \"a0_ready_state_packet\": {\n      \"head\": \"4edc859861fba3f18fab0e65e9d2e8c0a7394bdb\",\n      \"sha256\": \"afeda31dfc19de3d98d35d4574cda757b01b8d5144c6227eaa60c3595a4e86f2\"\n    },\n    \"canonical_projection\": {\n      \"git_blob_sha1\": \"64d8e2a17bd8d4a8b5f9efd65e66a2ad825ec9be\",\n      \"head\": \"7bf067475a1dd03b5208b804ced9dbed277cdf30\",\n      \"sha256\": \"c1cf986815f1e217c9bf482151252b729109f7cb932aff9b153b265ebe411c12\"\n    },\n    \"golden_corpus\": {\n      \"corpus_sha256\": \"b1746f0cd68be6dd6060858fb765c6863535aefbcf4844b9b50c279d69e9306a\",\n      \"head\": \"7bf067475a1dd03b5208b804ced9dbed277cdf30\"\n    }\n  },\n  \"state\": \"MAT_PACKAGE_READY_QA_INTEGRATE_GATED\",\n  \"state_packet_sha256\": \"23d505c4af0a94aed28ac322beb39d2895ccab0320fe5ccca8cdb015e3254d09\",\n  \"state_partition\": {\n    \"EXCEPTION\": [\n      \"a0.free.desktop.loading.r2\",\n      \"a0.free.mobile.loading.r2\",\n      \"a0.free.desktop.empty.r2\",\n      \"a0.free.mobile.empty.r2\",\n      \"a0.free.desktop.error.r2\",\n      \"a0.free.mobile.error.r2\"\n    ],\n    \"READY\": [\n      \"a0.free.desktop.top.r2\",\n      \"a0.free.mobile.top.r2\",\n      \"a0.free.desktop.scrolled.r2\",\n      \"a0.free.mobile.scrolled.r2\",\n      \"a0.free.desktop.full.r2\",\n      \"a0.free.mobile.full.r2\"\n    ],\n    \"all_states_exactly_once\": true\n  },\n  \"states\": [\n    {\n      \"factual_fixture_order\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"projection_role\": \"READY\",\n      \"rendered_fixture_ids\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"route\": \"/podborki/besplatnye-sobytiya/\",\n      \"rows\": [\n        {\n          \"count\": 2,\n          \"fixture_ids\": [\n            \"event.real.8006\",\n            \"event.real.8200\"\n          ],\n          \"group\": \"events\"\n        },\n        {\n          \"count\": 3,\n          \"fixture_ids\": [\n            \"event.real.2182\",\n            \"event.real.6711\",\n            \"event.real.7609\"\n          ],\n          \"group\": \"exhibitions\"\n        }\n      ],\n      \"scenario_id\": \"a0.free.desktop.top.r2\",\n      \"shell_contract\": {\n        \"header\": \"default\",\n        \"hero\": \"visible\",\n        \"medallion\": \"normal\"\n      },\n      \"state\": \"top\",\n      \"state_packet_sha256\": \"689bd109987c0774ff165b53d90668191cc06965ad048f8357a8ad531b123a3b\",\n      \"state_semantics\": \"READY route at initial scroll; hero visible; exact 2+3 rows rendered.\",\n      \"viewport\": {\n        \"height\": 800,\n        \"id\": \"desktop\",\n        \"width\": 1280\n      }\n    },\n    {\n      \"factual_fixture_order\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"projection_role\": \"READY\",\n      \"rendered_fixture_ids\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"route\": \"/podborki/besplatnye-sobytiya/\",\n      \"rows\": [\n        {\n          \"count\": 2,\n          \"fixture_ids\": [\n            \"event.real.8006\",\n            \"event.real.8200\"\n          ],\n          \"group\": \"events\"\n        },\n        {\n          \"count\": 3,\n          \"fixture_ids\": [\n            \"event.real.2182\",\n            \"event.real.6711\",\n            \"event.real.7609\"\n          ],\n          \"group\": \"exhibitions\"\n        }\n      ],\n      \"scenario_id\": \"a0.free.mobile.top.r2\",\n      \"shell_contract\": {\n        \"header\": \"default\",\n        \"hero\": \"visible\",\n        \"medallion\": \"normal\"\n      },\n      \"state\": \"top\",\n      \"state_packet_sha256\": \"d0f28a994d33030ddfc3a1a1cbbca6449f334812a15946bf409da9c4259306ff\",\n      \"state_semantics\": \"READY route at initial scroll; hero visible; exact 2+3 rows rendered.\",\n      \"viewport\": {\n        \"height\": 844,\n        \"id\": \"mobile\",\n        \"width\": 390\n      }\n    },\n    {\n      \"factual_fixture_order\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"projection_role\": \"READY\",\n      \"rendered_fixture_ids\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"route\": \"/podborki/besplatnye-sobytiya/\",\n      \"rows\": [\n        {\n          \"count\": 2,\n          \"fixture_ids\": [\n            \"event.real.8006\",\n            \"event.real.8200\"\n          ],\n          \"group\": \"events\"\n        },\n        {\n          \"count\": 3,\n          \"fixture_ids\": [\n            \"event.real.2182\",\n            \"event.real.6711\",\n            \"event.real.7609\"\n          ],\n          \"group\": \"exhibitions\"\n        }\n      ],\n      \"scenario_id\": \"a0.free.desktop.scrolled.r2\",\n      \"shell_contract\": {\n        \"header\": \"scrolled\",\n        \"hero\": \"past-or-full\",\n        \"medallion\": \"sticky/floating\"\n      },\n      \"state\": \"scrolled\",\n      \"state_packet_sha256\": \"07669631fd165c9e48f7731abd080d34df04703ea35214e33eef304bd7028cd0\",\n      \"state_semantics\": \"READY route after shell scroll transition; exact 2+3 rows remain unchanged.\",\n      \"viewport\": {\n        \"height\": 800,\n        \"id\": \"desktop\",\n        \"width\": 1280\n      }\n    },\n    {\n      \"factual_fixture_order\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"projection_role\": \"READY\",\n      \"rendered_fixture_ids\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"route\": \"/podborki/besplatnye-sobytiya/\",\n      \"rows\": [\n        {\n          \"count\": 2,\n          \"fixture_ids\": [\n            \"event.real.8006\",\n            \"event.real.8200\"\n          ],\n          \"group\": \"events\"\n        },\n        {\n          \"count\": 3,\n          \"fixture_ids\": [\n            \"event.real.2182\",\n            \"event.real.6711\",\n            \"event.real.7609\"\n          ],\n          \"group\": \"exhibitions\"\n        }\n      ],\n      \"scenario_id\": \"a0.free.mobile.scrolled.r2\",\n      \"shell_contract\": {\n        \"header\": \"scrolled\",\n        \"hero\": \"past-or-full\",\n        \"medallion\": \"sticky/floating\"\n      },\n      \"state\": \"scrolled\",\n      \"state_packet_sha256\": \"ac31508ec217eab2944698d5f049e459633eab8705836a26dde11d77456c70b9\",\n      \"state_semantics\": \"READY route after shell scroll transition; exact 2+3 rows remain unchanged.\",\n      \"viewport\": {\n        \"height\": 844,\n        \"id\": \"mobile\",\n        \"width\": 390\n      }\n    },\n    {\n      \"factual_fixture_order\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"projection_role\": \"READY\",\n      \"rendered_fixture_ids\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"route\": \"/podborki/besplatnye-sobytiya/\",\n      \"rows\": [\n        {\n          \"count\": 2,\n          \"fixture_ids\": [\n            \"event.real.8006\",\n            \"event.real.8200\"\n          ],\n          \"group\": \"events\"\n        },\n        {\n          \"count\": 3,\n          \"fixture_ids\": [\n            \"event.real.2182\",\n            \"event.real.6711\",\n            \"event.real.7609\"\n          ],\n          \"group\": \"exhibitions\"\n        }\n      ],\n      \"scenario_id\": \"a0.free.desktop.full.r2\",\n      \"shell_contract\": {\n        \"header\": \"scrolled\",\n        \"hero\": \"past-or-full\",\n        \"medallion\": \"sticky/floating\"\n      },\n      \"state\": \"full\",\n      \"state_packet_sha256\": \"d81d0533fb7cdb5852d846e5fc9dedd3e79c7ff0d32e1ab6a8c107fbf55e7975\",\n      \"state_semantics\": \"READY full-route composition; exact 2+3 rows and terminal footer/navigation state.\",\n      \"viewport\": {\n        \"height\": 800,\n        \"id\": \"desktop\",\n        \"width\": 1280\n      }\n    },\n    {\n      \"factual_fixture_order\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"projection_role\": \"READY\",\n      \"rendered_fixture_ids\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"route\": \"/podborki/besplatnye-sobytiya/\",\n      \"rows\": [\n        {\n          \"count\": 2,\n          \"fixture_ids\": [\n            \"event.real.8006\",\n            \"event.real.8200\"\n          ],\n          \"group\": \"events\"\n        },\n        {\n          \"count\": 3,\n          \"fixture_ids\": [\n            \"event.real.2182\",\n            \"event.real.6711\",\n            \"event.real.7609\"\n          ],\n          \"group\": \"exhibitions\"\n        }\n      ],\n      \"scenario_id\": \"a0.free.mobile.full.r2\",\n      \"shell_contract\": {\n        \"header\": \"scrolled\",\n        \"hero\": \"past-or-full\",\n        \"medallion\": \"sticky/floating\"\n      },\n      \"state\": \"full\",\n      \"state_packet_sha256\": \"1b7398baeb8bb3d3758a90e5cf1585ccf25738c588e996a19bcfb8b5daffde00\",\n      \"state_semantics\": \"READY full-route composition; exact 2+3 rows and terminal footer/navigation state.\",\n      \"viewport\": {\n        \"height\": 844,\n        \"id\": \"mobile\",\n        \"width\": 390\n      }\n    },\n    {\n      \"factual_fixture_order\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"projection_role\": \"EXCEPTION\",\n      \"rendered_fixture_ids\": [],\n      \"route\": \"/podborki/besplatnye-sobytiya/\",\n      \"rows\": [\n        {\n          \"count\": 2,\n          \"fixture_ids\": [\n            \"event.real.8006\",\n            \"event.real.8200\"\n          ],\n          \"group\": \"events\"\n        },\n        {\n          \"count\": 3,\n          \"fixture_ids\": [\n            \"event.real.2182\",\n            \"event.real.6711\",\n            \"event.real.7609\"\n          ],\n          \"group\": \"exhibitions\"\n        }\n      ],\n      \"scenario_id\": \"a0.free.desktop.loading.r2\",\n      \"shell_contract\": {\n        \"header\": \"default\",\n        \"hero\": \"visible\",\n        \"surface\": \"loading\"\n      },\n      \"state\": \"loading\",\n      \"state_packet_sha256\": \"be6a046157757b102694d7390cc389cda4187c85de267689ff997ee224308208\",\n      \"state_semantics\": \"EXCEPTION runtime pending state; exact factual input remains bound but no EventCard instance is rendered.\",\n      \"viewport\": {\n        \"height\": 800,\n        \"id\": \"desktop\",\n        \"width\": 1280\n      }\n    },\n    {\n      \"factual_fixture_order\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"projection_role\": \"EXCEPTION\",\n      \"rendered_fixture_ids\": [],\n      \"route\": \"/podborki/besplatnye-sobytiya/\",\n      \"rows\": [\n        {\n          \"count\": 2,\n          \"fixture_ids\": [\n            \"event.real.8006\",\n            \"event.real.8200\"\n          ],\n          \"group\": \"events\"\n        },\n        {\n          \"count\": 3,\n          \"fixture_ids\": [\n            \"event.real.2182\",\n            \"event.real.6711\",\n            \"event.real.7609\"\n          ],\n          \"group\": \"exhibitions\"\n        }\n      ],\n      \"scenario_id\": \"a0.free.mobile.loading.r2\",\n      \"shell_contract\": {\n        \"header\": \"default\",\n        \"hero\": \"visible\",\n        \"surface\": \"loading\"\n      },\n      \"state\": \"loading\",\n      \"state_packet_sha256\": \"bcac07ba43a75785899d7e67e455c6eb7b19075ab48f784a210ff44e390858b1\",\n      \"state_semantics\": \"EXCEPTION runtime pending state; exact factual input remains bound but no EventCard instance is rendered.\",\n      \"viewport\": {\n        \"height\": 844,\n        \"id\": \"mobile\",\n        \"width\": 390\n      }\n    },\n    {\n      \"factual_fixture_order\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"projection_role\": \"EXCEPTION\",\n      \"rendered_fixture_ids\": [],\n      \"route\": \"/podborki/besplatnye-sobytiya/\",\n      \"rows\": [\n        {\n          \"count\": 2,\n          \"fixture_ids\": [\n            \"event.real.8006\",\n            \"event.real.8200\"\n          ],\n          \"group\": \"events\"\n        },\n        {\n          \"count\": 3,\n          \"fixture_ids\": [\n            \"event.real.2182\",\n            \"event.real.6711\",\n            \"event.real.7609\"\n          ],\n          \"group\": \"exhibitions\"\n        }\n      ],\n      \"scenario_id\": \"a0.free.desktop.empty.r2\",\n      \"shell_contract\": {\n        \"header\": \"default\",\n        \"hero\": \"visible\",\n        \"surface\": \"empty\"\n      },\n      \"state\": \"empty\",\n      \"state_packet_sha256\": \"4ff28da9a9b9ad460b99e019db5333e60acdbfc9f69dfd0fe2138215f0550d8a\",\n      \"state_semantics\": \"EXCEPTION successful zero-result presentation; exact factual input remains a provenance receipt, not visible cards.\",\n      \"viewport\": {\n        \"height\": 800,\n        \"id\": \"desktop\",\n        \"width\": 1280\n      }\n    },\n    {\n      \"factual_fixture_order\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"projection_role\": \"EXCEPTION\",\n      \"rendered_fixture_ids\": [],\n      \"route\": \"/podborki/besplatnye-sobytiya/\",\n      \"rows\": [\n        {\n          \"count\": 2,\n          \"fixture_ids\": [\n            \"event.real.8006\",\n            \"event.real.8200\"\n          ],\n          \"group\": \"events\"\n        },\n        {\n          \"count\": 3,\n          \"fixture_ids\": [\n            \"event.real.2182\",\n            \"event.real.6711\",\n            \"event.real.7609\"\n          ],\n          \"group\": \"exhibitions\"\n        }\n      ],\n      \"scenario_id\": \"a0.free.mobile.empty.r2\",\n      \"shell_contract\": {\n        \"header\": \"default\",\n        \"hero\": \"visible\",\n        \"surface\": \"empty\"\n      },\n      \"state\": \"empty\",\n      \"state_packet_sha256\": \"555d669174f69898753bac6f61262633251742ca833e2c598d866ea645b3c7f5\",\n      \"state_semantics\": \"EXCEPTION successful zero-result presentation; exact factual input remains a provenance receipt, not visible cards.\",\n      \"viewport\": {\n        \"height\": 844,\n        \"id\": \"mobile\",\n        \"width\": 390\n      }\n    },\n    {\n      \"factual_fixture_order\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"projection_role\": \"EXCEPTION\",\n      \"rendered_fixture_ids\": [],\n      \"route\": \"/podborki/besplatnye-sobytiya/\",\n      \"rows\": [\n        {\n          \"count\": 2,\n          \"fixture_ids\": [\n            \"event.real.8006\",\n            \"event.real.8200\"\n          ],\n          \"group\": \"events\"\n        },\n        {\n          \"count\": 3,\n          \"fixture_ids\": [\n            \"event.real.2182\",\n            \"event.real.6711\",\n            \"event.real.7609\"\n          ],\n          \"group\": \"exhibitions\"\n        }\n      ],\n      \"scenario_id\": \"a0.free.desktop.error.r2\",\n      \"shell_contract\": {\n        \"header\": \"default\",\n        \"hero\": \"visible\",\n        \"surface\": \"error\"\n      },\n      \"state\": \"error\",\n      \"state_packet_sha256\": \"07518d455dd7d0c166b031b837c3a4bc5065f96182f74231c3526132af8eed41\",\n      \"state_semantics\": \"EXCEPTION recoverable failure presentation; exact factual input remains a provenance receipt, not visible cards.\",\n      \"viewport\": {\n        \"height\": 800,\n        \"id\": \"desktop\",\n        \"width\": 1280\n      }\n    },\n    {\n      \"factual_fixture_order\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"projection_role\": \"EXCEPTION\",\n      \"rendered_fixture_ids\": [],\n      \"route\": \"/podborki/besplatnye-sobytiya/\",\n      \"rows\": [\n        {\n          \"count\": 2,\n          \"fixture_ids\": [\n            \"event.real.8006\",\n            \"event.real.8200\"\n          ],\n          \"group\": \"events\"\n        },\n        {\n          \"count\": 3,\n          \"fixture_ids\": [\n            \"event.real.2182\",\n            \"event.real.6711\",\n            \"event.real.7609\"\n          ],\n          \"group\": \"exhibitions\"\n        }\n      ],\n      \"scenario_id\": \"a0.free.mobile.error.r2\",\n      \"shell_contract\": {\n        \"header\": \"default\",\n        \"hero\": \"visible\",\n        \"surface\": \"error\"\n      },\n      \"state\": \"error\",\n      \"state_packet_sha256\": \"ce5b520a27b1206b35c8e2e813012f86b51e13fe838f16645ab5ff323c2414c7\",\n      \"state_semantics\": \"EXCEPTION recoverable failure presentation; exact factual input remains a provenance receipt, not visible cards.\",\n      \"viewport\": {\n        \"height\": 844,\n        \"id\": \"mobile\",\n        \"width\": 390\n      }\n    }\n  ]\n}\n","physical-free-unit":"{\n  \"artifacts\": {\n    \"executor\": {\n      \"bytes\": 9613,\n      \"git_blob_sha1\": \"622a4f50980e3e486d18c279e3fe2c524bc082c9\",\n      \"path\": \"scripts/asp-production-conveyor-v3/a0/free-full-page-r2/free_full_page_native_executor_r2.js\",\n      \"sha256\": \"526ed164791cd6342e211d98030be2dc5c55e1778e5e400eab7e2f862c7516a0\"\n    },\n    \"schema\": {\n      \"path\": \"catalog/asp-production-conveyor-v3/a0/free-full-page-r2/schema.v1.json\"\n    },\n    \"setup\": {\n      \"bytes\": 1537,\n      \"git_blob_sha1\": \"8441799cb113134dfef332c7cd3dadddd24faac3\",\n      \"path\": \"scripts/asp-production-conveyor-v3/a0/free-full-page-r2/setup_free_full_page_r2.js\",\n      \"sha256\": \"9c04f64ffc5089a2227004fb44f70bd909e3e724fcd27487397538f5522c5422\"\n    },\n    \"test\": {\n      \"bytes\": 8219,\n      \"git_blob_sha1\": \"09760974530cbdcec124bf3af609f9733ede47b7\",\n      \"path\": \"tests/asp-production-conveyor-v3/a0/free-full-page-r2/free_full_page_r2.test.js\",\n      \"sha256\": \"9af5dc7c0ea40c4aa32bb2d1aa20c2c3645e895b9ba59fbd23807cd291682238\"\n    }\n  },\n  \"atlas_binding\": {\n    \"atlas_id\": \"ASP_PENPOT_ATLAS_LAYOUT_V2\",\n    \"atlas_mutation_by_a0\": false,\n    \"bindings_git_blob_sha1\": \"23475806beebfbe21bd77759440c169c60627550\",\n    \"bindings_path\": \"catalog/asp-production-conveyor-v3/atlas-v2/page-unit-bindings.v2.json\",\n    \"logical_source_unit_id\": \"free-collection-eventcard\",\n    \"page_order\": \"0200\",\n    \"physical_page_name\": \"00 · Components · Free collection\",\n    \"projection_role\": \"READY\",\n    \"remote_head\": \"663be702d481972cb2e8863af500f1c35dda1d8c\",\n    \"remote_tree\": \"cf9a1e6a5e0a84aea5636334dbd3be4961039b75\",\n    \"source_package_id\": \"PROTECTED-FREE-COLLECTION-EVENTCARD\"\n  },\n  \"dependency_gates\": {\n    \"brand\": {\n      \"fallback\": \"FORBIDDEN\",\n      \"git_blob_sha1\": \"fc904c1284bcd237f77853a8a4fd41efa153ebe9\",\n      \"package_id\": \"F-MEDALLIONS-BRAND-ASSETS\",\n      \"remote_head\": \"8c7fcdb00f583b7de1849d9fa21542bc585f2cea\",\n      \"required_state\": \"D0_QA_INTEGRATE_EXACT_PASS\",\n      \"semantic_id\": \"brand.identity-and-pwa\"\n    },\n    \"event_card\": {\n      \"fallback\": \"FORBIDDEN\",\n      \"git_blob_sha1\": \"6496f9fdf2c19cce06c2a07d5b4d48061afe5522\",\n      \"package_id\": \"U-EVENTCARD-FOUR-CASES\",\n      \"remote_head\": \"c2d6ff107c632311d1c1d0cb1b74d7eb0a465b18\",\n      \"required_state\": \"D0_QA_INTEGRATE_EXACT_PASS\",\n      \"semantic_id\": \"component.event-card.free-collection\"\n    },\n    \"free_shell\": {\n      \"fallback\": \"FORBIDDEN\",\n      \"git_blob_sha1\": \"4e7479dea2ab321b51ef937425bd3c78e5bc06cb\",\n      \"package_id\": \"U-FREE-SHELL\",\n      \"remote_head\": \"9342d785df1d583ac9104dff2253df0e05b687dd\",\n      \"remote_tree\": \"9f45472edccce1836f84f21aa7a55764745f3f28\",\n      \"required_state\": \"D0_QA_INTEGRATE_EXACT_PASS\",\n      \"semantic_id\": \"free.collection.route\"\n    }\n  },\n  \"frozen_base\": {\n    \"head\": \"4edc859861fba3f18fab0e65e9d2e8c0a7394bdb\",\n    \"tree\": \"3132550212222ec3dea716710821e732ad0d92bb\"\n  },\n  \"lane1_terminal_head\": \"9e8edbed95eb40807059e6c6f10af74beeaee683\",\n  \"limits\": {\n    \"max_managed_creations_per_invocation\": 3,\n    \"second_terminal_run_created\": 0\n  },\n  \"logical_package_id\": \"A-FREE-FULL-PAGE-R2\",\n  \"logical_package_path\": \"catalog/asp-production-conveyor-v3/a0/free-full-page-r2/A-FREE-FULL-PAGE-R2.logical-package.v1.json\",\n  \"logical_package_record_sha256\": \"33ce556aff7535126fea202443bdfd6212d4049e4896a0073d620c53eea046be\",\n  \"negative_test_classes\": [\n    \"lane1-head-drift\",\n    \"logical-record-drift\",\n    \"duplicate-state\",\n    \"stale-dependency\",\n    \"wrong-atlas-role\",\n    \"cancelled-lease\",\n    \"screenshot-implementation\",\n    \"protected-projection-drift\"\n  ],\n  \"old_penpot_lineage\": \"FORBIDDEN\",\n  \"owner\": \"A0\",\n  \"package_id\": \"A-FREE-FULL-PAGE-R2-READY\",\n  \"penpot_execution_authorized\": false,\n  \"penpot_mutations_by_a0\": 0,\n  \"projection_role\": \"READY\",\n  \"promotion_authorized\": false,\n  \"record_sha256\": \"eaee8022664de1dab8a1d4ab47327794ed57788dd8947988b88f3a81eb34a8be\",\n  \"route\": \"/podborki/besplatnye-sobytiya/\",\n  \"run_control\": {\n    \"cancel_token\": \"e150485de72f28cf094c568cc645fd752712bbf7771adadaabe00fc989e418fd\",\n    \"lease_token\": \"113e8bf53677c8ebc13ec54f6b93ae003c724d53c118172042ae3828903a040d\",\n    \"run_id\": \"c979dc5c-6f57-5901-a7d8-a0d627ee1a49\",\n    \"schema\": \"kenigevents.asp-run-control.v1\",\n    \"separate_package_lease\": true,\n    \"state\": \"ACTIVE_REQUIRED\",\n    \"writer_id\": \"/root/publish_r2\"\n  },\n  \"schema_version\": \"kenigevents.a0.free-full-page-r2.physical-unit.v1\",\n  \"state\": \"MAT_PACKAGE_READY_QA_INTEGRATE_GATED\",\n  \"states\": [\n    {\n      \"factual_fixture_order\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"projection_role\": \"READY\",\n      \"rendered_fixture_ids\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"route\": \"/podborki/besplatnye-sobytiya/\",\n      \"rows\": [\n        {\n          \"count\": 2,\n          \"fixture_ids\": [\n            \"event.real.8006\",\n            \"event.real.8200\"\n          ],\n          \"group\": \"events\"\n        },\n        {\n          \"count\": 3,\n          \"fixture_ids\": [\n            \"event.real.2182\",\n            \"event.real.6711\",\n            \"event.real.7609\"\n          ],\n          \"group\": \"exhibitions\"\n        }\n      ],\n      \"scenario_id\": \"a0.free.desktop.top.r2\",\n      \"shell_contract\": {\n        \"header\": \"default\",\n        \"hero\": \"visible\",\n        \"medallion\": \"normal\"\n      },\n      \"state\": \"top\",\n      \"state_packet_sha256\": \"689bd109987c0774ff165b53d90668191cc06965ad048f8357a8ad531b123a3b\",\n      \"state_semantics\": \"READY route at initial scroll; hero visible; exact 2+3 rows rendered.\",\n      \"viewport\": {\n        \"height\": 800,\n        \"id\": \"desktop\",\n        \"width\": 1280\n      }\n    },\n    {\n      \"factual_fixture_order\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"projection_role\": \"READY\",\n      \"rendered_fixture_ids\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"route\": \"/podborki/besplatnye-sobytiya/\",\n      \"rows\": [\n        {\n          \"count\": 2,\n          \"fixture_ids\": [\n            \"event.real.8006\",\n            \"event.real.8200\"\n          ],\n          \"group\": \"events\"\n        },\n        {\n          \"count\": 3,\n          \"fixture_ids\": [\n            \"event.real.2182\",\n            \"event.real.6711\",\n            \"event.real.7609\"\n          ],\n          \"group\": \"exhibitions\"\n        }\n      ],\n      \"scenario_id\": \"a0.free.mobile.top.r2\",\n      \"shell_contract\": {\n        \"header\": \"default\",\n        \"hero\": \"visible\",\n        \"medallion\": \"normal\"\n      },\n      \"state\": \"top\",\n      \"state_packet_sha256\": \"d0f28a994d33030ddfc3a1a1cbbca6449f334812a15946bf409da9c4259306ff\",\n      \"state_semantics\": \"READY route at initial scroll; hero visible; exact 2+3 rows rendered.\",\n      \"viewport\": {\n        \"height\": 844,\n        \"id\": \"mobile\",\n        \"width\": 390\n      }\n    },\n    {\n      \"factual_fixture_order\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"projection_role\": \"READY\",\n      \"rendered_fixture_ids\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"route\": \"/podborki/besplatnye-sobytiya/\",\n      \"rows\": [\n        {\n          \"count\": 2,\n          \"fixture_ids\": [\n            \"event.real.8006\",\n            \"event.real.8200\"\n          ],\n          \"group\": \"events\"\n        },\n        {\n          \"count\": 3,\n          \"fixture_ids\": [\n            \"event.real.2182\",\n            \"event.real.6711\",\n            \"event.real.7609\"\n          ],\n          \"group\": \"exhibitions\"\n        }\n      ],\n      \"scenario_id\": \"a0.free.desktop.scrolled.r2\",\n      \"shell_contract\": {\n        \"header\": \"scrolled\",\n        \"hero\": \"past-or-full\",\n        \"medallion\": \"sticky/floating\"\n      },\n      \"state\": \"scrolled\",\n      \"state_packet_sha256\": \"07669631fd165c9e48f7731abd080d34df04703ea35214e33eef304bd7028cd0\",\n      \"state_semantics\": \"READY route after shell scroll transition; exact 2+3 rows remain unchanged.\",\n      \"viewport\": {\n        \"height\": 800,\n        \"id\": \"desktop\",\n        \"width\": 1280\n      }\n    },\n    {\n      \"factual_fixture_order\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"projection_role\": \"READY\",\n      \"rendered_fixture_ids\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"route\": \"/podborki/besplatnye-sobytiya/\",\n      \"rows\": [\n        {\n          \"count\": 2,\n          \"fixture_ids\": [\n            \"event.real.8006\",\n            \"event.real.8200\"\n          ],\n          \"group\": \"events\"\n        },\n        {\n          \"count\": 3,\n          \"fixture_ids\": [\n            \"event.real.2182\",\n            \"event.real.6711\",\n            \"event.real.7609\"\n          ],\n          \"group\": \"exhibitions\"\n        }\n      ],\n      \"scenario_id\": \"a0.free.mobile.scrolled.r2\",\n      \"shell_contract\": {\n        \"header\": \"scrolled\",\n        \"hero\": \"past-or-full\",\n        \"medallion\": \"sticky/floating\"\n      },\n      \"state\": \"scrolled\",\n      \"state_packet_sha256\": \"ac31508ec217eab2944698d5f049e459633eab8705836a26dde11d77456c70b9\",\n      \"state_semantics\": \"READY route after shell scroll transition; exact 2+3 rows remain unchanged.\",\n      \"viewport\": {\n        \"height\": 844,\n        \"id\": \"mobile\",\n        \"width\": 390\n      }\n    },\n    {\n      \"factual_fixture_order\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"projection_role\": \"READY\",\n      \"rendered_fixture_ids\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"route\": \"/podborki/besplatnye-sobytiya/\",\n      \"rows\": [\n        {\n          \"count\": 2,\n          \"fixture_ids\": [\n            \"event.real.8006\",\n            \"event.real.8200\"\n          ],\n          \"group\": \"events\"\n        },\n        {\n          \"count\": 3,\n          \"fixture_ids\": [\n            \"event.real.2182\",\n            \"event.real.6711\",\n            \"event.real.7609\"\n          ],\n          \"group\": \"exhibitions\"\n        }\n      ],\n      \"scenario_id\": \"a0.free.desktop.full.r2\",\n      \"shell_contract\": {\n        \"header\": \"scrolled\",\n        \"hero\": \"past-or-full\",\n        \"medallion\": \"sticky/floating\"\n      },\n      \"state\": \"full\",\n      \"state_packet_sha256\": \"d81d0533fb7cdb5852d846e5fc9dedd3e79c7ff0d32e1ab6a8c107fbf55e7975\",\n      \"state_semantics\": \"READY full-route composition; exact 2+3 rows and terminal footer/navigation state.\",\n      \"viewport\": {\n        \"height\": 800,\n        \"id\": \"desktop\",\n        \"width\": 1280\n      }\n    },\n    {\n      \"factual_fixture_order\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"projection_role\": \"READY\",\n      \"rendered_fixture_ids\": [\n        \"event.real.2182\",\n        \"event.real.6711\",\n        \"event.real.7609\",\n        \"event.real.8006\",\n        \"event.real.8200\"\n      ],\n      \"route\": \"/podborki/besplatnye-sobytiya/\",\n      \"rows\": [\n        {\n          \"count\": 2,\n          \"fixture_ids\": [\n            \"event.real.8006\",\n            \"event.real.8200\"\n          ],\n          \"group\": \"events\"\n        },\n        {\n          \"count\": 3,\n          \"fixture_ids\": [\n            \"event.real.2182\",\n            \"event.real.6711\",\n            \"event.real.7609\"\n          ],\n          \"group\": \"exhibitions\"\n        }\n      ],\n      \"scenario_id\": \"a0.free.mobile.full.r2\",\n      \"shell_contract\": {\n        \"header\": \"scrolled\",\n        \"hero\": \"past-or-full\",\n        \"medallion\": \"sticky/floating\"\n      },\n      \"state\": \"full\",\n      \"state_packet_sha256\": \"1b7398baeb8bb3d3758a90e5cf1585ccf25738c588e996a19bcfb8b5daffde00\",\n      \"state_semantics\": \"READY full-route composition; exact 2+3 rows and terminal footer/navigation state.\",\n      \"viewport\": {\n        \"height\": 844,\n        \"id\": \"mobile\",\n        \"width\": 390\n      }\n    }\n  ],\n  \"storage\": {\n    \"protected_baseline\": \"a0_free_full_page_ready_baseline\",\n    \"setup_receipt\": \"a0_free_full_page_ready_setup\"\n  },\n  \"target\": {\n    \"existing_atlas_content\": \"NO_MUTATION\",\n    \"managed_scope\": \"PACKAGE_ROOT_ONLY\",\n    \"mode\": \"D0_BINDS_EXISTING_ATLAS_PHYSICAL_PAGE\",\n    \"root_name\": \"CANDIDATE_BUILD_NOT_ACCEPTED · A-FREE-FULL-PAGE-R2 · READY\",\n    \"root_semantic_id\": \"a0.free.full-page.r2.ready.root\"\n  },\n  \"terminal_contract\": {\n    \"candidate_roots\": 1,\n    \"detached_instances\": 0,\n    \"physical_pages\": 1,\n    \"root_export_nonempty\": true,\n    \"screenshot_shapes\": 0,\n    \"second_run_created\": 0,\n    \"state_boards\": 6,\n    \"states_exactly_once\": true\n  },\n  \"visual_acceptance\": \"PENDING_V0\"\n}\n","runtime-contract":"{\"schema_version\":\"kenigevents.asp-penpot-page-wave-runtime-contract.v1\",\"repository\":\"onedayonemasterpiece/lovekgd-design-system\",\"base\":{\"branch\":\"a0/asp-production-conveyor-20260831\",\"head\":\"68cd4f88ef759c7b4ec57ddc2da7f867f79a5b92\",\"tree\":\"f0ae4ee0a5603cafae74cb7b93524c835e21beb9\"},\"target_branch\":\"a0/asp-penpot-page-wave-v1-20260901\",\"penpot\":{\"file_id\":\"40e06342-8830-80d6-8008-8fc8a3a4cd4f\",\"sole_writer\":\"/root/publish_r2\",\"a0_penpot_mutations\":0},\"policy\":{\"schema\":\"kenigevents.asp-penpot-page-wave.v1\",\"comment\":5483175166,\"fresh_read_tip\":5483869282,\"pr55_head\":\"7bf067475a1dd03b5208b804ced9dbed277cdf30\"},\"protected_projections\":{\"minimum_revision\":113,\"free\":{\"page_id\":\"c16498cb-b51d-8030-8008-904bd8fc9c53\",\"root_ids\":[\"313fb1ed-0d5c-8095-8008-9108df52b2ce\",\"313fb1ed-0d5c-8095-8008-912c45090653\"],\"chars\":84033,\"utf8_bytes\":84034,\"sha256\":\"0b00102e348367601fe35de30e06dc22b10883577a22917320955058115fc042\"},\"foundations\":{\"page_id\":\"313fb1ed-0d5c-8095-8008-9183322ab3a9\",\"root_id\":\"313fb1ed-0d5c-8095-8008-918a0c1473af\",\"placements\":37,\"chars\":43736,\"utf8_bytes\":43746,\"sha256\":\"1b119d154376505b8d28036cbf33e97f9009a007bf0a5a5765de2750644da1fa\",\"rejected_scalar_sha256\":\"523e43cfe95df7962f8034c4dc2e9f04f02114b15ad488587c707e35b6fed8f1\"}},\"exact_current_dependencies\":{\"f0_action_nav\":{\"package_id\":\"F-ACTION-NAV-ICONS\",\"revision\":\"R5.2\",\"state\":\"MAT_PACKAGE_READY_QA_INTEGRATE_GATED\",\"branch\":\"agent/f-action-nav-icons-r5/mat\",\"head\":\"fecb90c6b1c475687d77b8cce4c905d932a0bf23\",\"tree\":\"0bcfaf6b5db1182da27e459df502d742e1470f93\",\"package\":{\"path\":\"catalog/asp-production-conveyor-v3/f0/F-ACTION-NAV-ICONS.package.v5.json\",\"git_blob_sha1\":\"b211bcec98a144a8e3ee7ed87098c37757fb8298\",\"sha256\":\"9a89a0b283f110a811a06317a5b4f0a54b28f553de81a40b43b7261c0d864c7a\",\"bytes\":16493},\"setup\":{\"path\":\"scripts/asp-production-conveyor-v3/f0/action_nav_icons_setup_v5.js\",\"git_blob_sha1\":\"9d3945c5b940563fb32f556ede93d69868b8d20f\",\"sha256\":\"1f1415cb31d562c90c08c0367bbdc2c3615ccd04066ca630443bd91c4ed0a33a\",\"bytes\":2273},\"executor\":{\"path\":\"scripts/asp-production-conveyor-v3/f0/action_nav_icons_native_executor_v5.js\",\"git_blob_sha1\":\"f19a55d8faf6526f977e88424676a8564c9d5dba\",\"sha256\":\"429cb2b8cf948bcd553f4e16af994b04af5ded33290022b0d336a4c77a665bca\",\"bytes\":33722},\"test\":{\"path\":\"tests/asp-production-conveyor-v3/f0/test_action_nav_icons_native_executor_v5.js\",\"git_blob_sha1\":\"5984081d8290b8a5a92a42aec9d445929707bd49\",\"sha256\":\"ace0fa7d14c01d7ec30f3703754246442a2d81cb330dd4908d70b0638b8f9f4b\",\"bytes\":15285}},\"u0_controls\":{\"package_id\":\"U-CONTROLS-PRIMITIVES\",\"revision\":\"R2\",\"state\":\"READY_FOR_D0_INTEGRATE\",\"comment\":5481555626,\"branch\":\"u0/controls-primitives-v3-r2\",\"head\":\"294a02609d5c0322f9afcca36b773b67df148d13\",\"asset_closure\":{\"path\":\"catalog/asp-production-conveyor-v3/u0/U-CONTROLS-PRIMITIVES.asset-closure.v2.json\",\"git_blob_sha1\":\"9cfd6d9f1bfdd0a5d75014287ff38fb11913b10d\",\"bytes\":9734},\"compiler\":{\"path\":\"scripts/asp-production-conveyor-v3/u0/compile_controls_primitives_asset_closure.py\",\"git_blob_sha1\":\"737820d18c0da49a833ba53d432933093580720e\",\"bytes\":14918},\"test\":{\"path\":\"tests/asp-production-conveyor-v3/u0/test_controls_primitives_asset_closure.py\",\"git_blob_sha1\":\"d88c58ef609a4822b9a378c9880da313ae03fe15\",\"bytes\":5961},\"base_candidate\":{\"head\":\"0f6d98fe8c4798b1be630f5fc635252c0ac5ace9\",\"package_git_blob_sha1\":\"ffe05f3fc99529448eeadc30108f965ecce2ba7f\"}}},\"source_queue\":{\"path\":\"catalog/asp-production-conveyor-v3/a0/candidate-adapter-queue.v1.json\",\"git_blob_sha1\":\"1b9ac4ed1a38011fab7a1237f4b533e0cfe57205\",\"record_sha256\":\"43fe9a789dc11c803aee68de3f6eb7047a5a585fcabd6c18a2a1cd3eb77a49de\"},\"constraints\":{\"candidate_roots_per_unit\":1,\"desktop_mobile_side_by_side\":true,\"component_families_max\":3,\"managed_nodes_max\":30,\"executor_bytes_max\":65000,\"managed_creations_per_invocation_max\":3,\"second_run_created\":0,\"visual_acceptance\":\"PENDING_V0\",\"promotion_authorized\":false,\"screenshots_or_placeholders\":\"FORBIDDEN\",\"source_adapters_byte_identical\":true},\"record_sha256\":\"00c49796eb7caecef3fab5dfc84e8b49c365786561fcf5c02f91b864e269dfc0\"}\n"},"source_records":[{"bytes":13358,"git_blob_sha1":"bda6fc7c232c0a1d087fcfe2bdd715b0caf107e8","name":"physical-free-unit","path":"catalog/asp-production-conveyor-v3/a0/free-full-page-r2/A-FREE-FULL-PAGE-R2-READY.package.v1.json","ref":"4ee9651c97da4e46b0fda4e244f9d5dea634e063","sha256":"782c2d5dbadf0391c4df2c0ce78016b4387fcc7712fc90d1dc8c37a64b83e8c9"},{"bytes":19150,"git_blob_sha1":"550dbe3aea81fa0c91b25f23107ddeaba51f0d4a","name":"logical-free-package","path":"catalog/asp-production-conveyor-v3/a0/free-full-page-r2/A-FREE-FULL-PAGE-R2.logical-package.v1.json","ref":"4ee9651c97da4e46b0fda4e244f9d5dea634e063","sha256":"3dbc860808e0842e8e05e3f183ca338a2b7557937b890e2b7a625682d23c6252"},{"bytes":8541,"git_blob_sha1":"76a0d4b27266cb68027a58bd86365f21f61ff808","name":"free-rows-package","path":"catalog/asp-production-conveyor-v3/a0/free-rows-data-r2/A-FREE-ROWS-DATA-R2.package.v1.json","ref":"9e8edbed95eb40807059e6c6f10af74beeaee683","sha256":"5645d6241cd93d7f775448eeda6ea49c2eda01eb4ef8d8536ff6ec5ba97297e3"},{"bytes":4082,"git_blob_sha1":"c3f4a96cccb9ef8c94aa1a7c1a9b331ed6d351c3","name":"runtime-contract","path":"catalog/asp-production-conveyor-v3/a0/page-wave-v1/runtime-contract.v1.json","ref":"4edc859861fba3f18fab0e65e9d2e8c0a7394bdb","sha256":"5830231383fb451f4a2dcc66d08a35bde03e3c9396833e6ef23a841193808226"}],"state":"DIRECT_PLUGIN_BUNDLE_READY_D0_QA_INTEGRATE","states":[{"factual_fixture_order":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"projection_role":"READY","rendered_fixture_ids":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"route":"/podborki/besplatnye-sobytiya/","rows":[{"count":2,"fixture_ids":["event.real.8006","event.real.8200"],"group":"events"},{"count":3,"fixture_ids":["event.real.2182","event.real.6711","event.real.7609"],"group":"exhibitions"}],"scenario_id":"a0.free.desktop.top.r2","shell_contract":{"header":"default","hero":"visible","medallion":"normal"},"state":"top","state_packet_sha256":"689bd109987c0774ff165b53d90668191cc06965ad048f8357a8ad531b123a3b","state_semantics":"READY route at initial scroll; hero visible; exact 2+3 rows rendered.","viewport":{"height":800,"id":"desktop","width":1280}},{"factual_fixture_order":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"projection_role":"READY","rendered_fixture_ids":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"route":"/podborki/besplatnye-sobytiya/","rows":[{"count":2,"fixture_ids":["event.real.8006","event.real.8200"],"group":"events"},{"count":3,"fixture_ids":["event.real.2182","event.real.6711","event.real.7609"],"group":"exhibitions"}],"scenario_id":"a0.free.mobile.top.r2","shell_contract":{"header":"default","hero":"visible","medallion":"normal"},"state":"top","state_packet_sha256":"d0f28a994d33030ddfc3a1a1cbbca6449f334812a15946bf409da9c4259306ff","state_semantics":"READY route at initial scroll; hero visible; exact 2+3 rows rendered.","viewport":{"height":844,"id":"mobile","width":390}},{"factual_fixture_order":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"projection_role":"READY","rendered_fixture_ids":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"route":"/podborki/besplatnye-sobytiya/","rows":[{"count":2,"fixture_ids":["event.real.8006","event.real.8200"],"group":"events"},{"count":3,"fixture_ids":["event.real.2182","event.real.6711","event.real.7609"],"group":"exhibitions"}],"scenario_id":"a0.free.desktop.scrolled.r2","shell_contract":{"header":"scrolled","hero":"past-or-full","medallion":"sticky/floating"},"state":"scrolled","state_packet_sha256":"07669631fd165c9e48f7731abd080d34df04703ea35214e33eef304bd7028cd0","state_semantics":"READY route after shell scroll transition; exact 2+3 rows remain unchanged.","viewport":{"height":800,"id":"desktop","width":1280}},{"factual_fixture_order":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"projection_role":"READY","rendered_fixture_ids":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"route":"/podborki/besplatnye-sobytiya/","rows":[{"count":2,"fixture_ids":["event.real.8006","event.real.8200"],"group":"events"},{"count":3,"fixture_ids":["event.real.2182","event.real.6711","event.real.7609"],"group":"exhibitions"}],"scenario_id":"a0.free.mobile.scrolled.r2","shell_contract":{"header":"scrolled","hero":"past-or-full","medallion":"sticky/floating"},"state":"scrolled","state_packet_sha256":"ac31508ec217eab2944698d5f049e459633eab8705836a26dde11d77456c70b9","state_semantics":"READY route after shell scroll transition; exact 2+3 rows remain unchanged.","viewport":{"height":844,"id":"mobile","width":390}},{"factual_fixture_order":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"projection_role":"READY","rendered_fixture_ids":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"route":"/podborki/besplatnye-sobytiya/","rows":[{"count":2,"fixture_ids":["event.real.8006","event.real.8200"],"group":"events"},{"count":3,"fixture_ids":["event.real.2182","event.real.6711","event.real.7609"],"group":"exhibitions"}],"scenario_id":"a0.free.desktop.full.r2","shell_contract":{"header":"scrolled","hero":"past-or-full","medallion":"sticky/floating"},"state":"full","state_packet_sha256":"d81d0533fb7cdb5852d846e5fc9dedd3e79c7ff0d32e1ab6a8c107fbf55e7975","state_semantics":"READY full-route composition; exact 2+3 rows and terminal footer/navigation state.","viewport":{"height":800,"id":"desktop","width":1280}},{"factual_fixture_order":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"projection_role":"READY","rendered_fixture_ids":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"],"route":"/podborki/besplatnye-sobytiya/","rows":[{"count":2,"fixture_ids":["event.real.8006","event.real.8200"],"group":"events"},{"count":3,"fixture_ids":["event.real.2182","event.real.6711","event.real.7609"],"group":"exhibitions"}],"scenario_id":"a0.free.mobile.full.r2","shell_contract":{"header":"scrolled","hero":"past-or-full","medallion":"sticky/floating"},"state":"full","state_packet_sha256":"1b7398baeb8bb3d3758a90e5cf1585ccf25738c588e996a19bcfb8b5daffde00","state_semantics":"READY full-route composition; exact 2+3 rows and terminal footer/navigation state.","viewport":{"height":844,"id":"mobile","width":390}}],"target_file_id":"40e06342-8830-80d6-8008-8fc8a3a4cd4f","target_mode":"EXACT_EXISTING_ATLAS_PAGE","target_page_name":"00 · Components · Free collection","target_root_name":"CANDIDATE_BUILD_NOT_ACCEPTED · A-FREE-FULL-PAGE-R2 · READY","target_root_stable_id":"a0.free.full-page.r2.ready.root"};
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
