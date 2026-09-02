# D0 morning — Atlas R2 medallions balance evidence successor

- Exact parent: `d0/atlas-r2-source-bound-evidence-8of8-v1-20260901-r2@0fbfd4839343de71d5128b2e9c2ad232dde6abf4` (`tree 6e84d13d660b46cedd23f76312b31076e4a6132f`).
- Scope is evidence-only `V0-ATLAS-R2-MEDALLIONS-BALANCE-001`; Atlas product contracts and Penpot are unchanged.
- The `r2-medallions-densest` final two cells occupy exact DENSE tracks 3–4 (`x=976,1256`), while all eight source assets, eight masters, 24 linked specimens, six columns, cell geometry, and tier order remain immutable.
- Occupied rows are derived as `ceil(8 / 6) = 2`; content/ledger height is `2×288 + 24 = 600`; root height is `256 + 600 + 64 = 920`.
- Exact source snapshots are self-contained and validated against the frozen events-bot-new byte count, SHA-256, and Git blob for all 8 assets. Producer package bytes are not changed.
- Clean-checkout bootstrap pins `CairoSVG==2.7.1` and `Pillow==10.4.0`; deterministic regeneration reproduces all six medallion evidence outputs byte-for-byte.
- All seven other R2 representatives (SVG+PNG) and all six Atlas contract files are byte-identical to the exact parent: protected parent-byte census 20/20.
- Aggregate evidence remains 8/8 source-bound with overlaps/clipping/content-outside-root all zero. Visual acceptance remains `PENDING_V0`; this Git evidence repair does not self-issue a V0 verdict or Penpot authorization.
- Tests: package evidence PASS, balance successor 7/7 PASS, A0 aggregate 7/7 PASS, deterministic regeneration PASS.
- Penpot reads/mutations: 0/0. Kaggle, merge, deploy, promotion: none.
