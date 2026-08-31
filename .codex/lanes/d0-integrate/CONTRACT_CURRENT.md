# D0 contract-current EventCard integration

The only authorized mutation slice is `D0-FREE-EVENTCARD-CONTRACT-CURRENT-R1` on the exact connected Penpot file/page/root stated in the active page profile. `/root/publish_r2` is the sole writer. INTEGRATE never writes Penpot.

Immutable inputs integrated so far:

- profile: `task/d0-free-eventcard-contract-integration-20260831@8b2e8f603c60d58bebc43c6f66f21f55094bd779`, blob `8049669639d6229f61eab1533127f81a218fc61d`, raw SHA-256 `a2fbdba547f8829308f88231f96fce0cc54c441f741e99a7a846dcf0333ea461`;
- registry: commit `0eb4c0a505e0aea522da2138cb1fb40f97d45edf`, blob `271a622633f399bb52cfe322c259a8dc4162bf7e`, raw SHA-256 `bbb07cc7d218d4ff69cc21ee002652b21c9e6c4efdbf65a23b9805f97eb7efb4`;
- geometry: `task/d0-corpus-20260831@bf7a4c9aa20978d297bd8f53058042e0436f8554`, raw SHA-256 `f176e96786b7f0e56cd292e122fb3ce006c2983d3c6fac8686fcf36d9862442b`, proof payload `5395c56376847d36a6ebc8e5d4988a2b06c4cac9acd27426dd73276620031307`.

The run-control bootstrap remains non-executable until the final MAT manifest is contract-current, independently QA-passed, copied into this immutable publisher bundle, and INTEGRATE emits an exact PASS/READY receipt.
