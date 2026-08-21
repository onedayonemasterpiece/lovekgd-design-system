# Telegram and retention

Authorized review target: `https://t.me/c/4337049383/1030` only.

Before the first send, load the existing `telegram-human-session` skill, read
message 1030, and verify the resolved chat/entity and topic root. Never create a
new auth flow or use the role-scoped S22/Kaggle session. Fail closed on mismatch.

Publishing is an explicit `--publish-telegram` step and is disabled in default
local/CI runs. The main PNG is Astro left, Penpot right, same scale, no stretch,
with a Russian status strip, component/state/fixture, geometry/pixel summary,
run ID, authority mode, and short contract hash. Up to four cases publish
individually; larger runs publish one summary plus non-pass detail cases.

Caption always separates `Agent verdict` from `Owner status`. Identical content
hashes deduplicate. A changed rerun creates a new message with
`supersedes_message_id`; never edit away review history. Read back the exact
message/media and persist the schema-backed receipt. Do not background-poll.

Ephemeral runs live in `artifacts/ui-conformance/<run-id>/` and require both
`.ui-conformance-run` and a valid `manifest.json`. Defaults: local success 6h,
published read-back 24h, fail/blocked 72h, Actions 3d, mass owner review 7d,
local cap 2GB with oldest eligible first.

Cleanup is root-bound and refuses `/`, `$HOME`, repository root, short paths,
symlink escapes, active `.lock`, `keep:true`, invalid/missing marker/manifest,
and durable references. Run dry-run before real deletion. Accepted exports,
contracts, exception decisions, and final receipts are durable.
