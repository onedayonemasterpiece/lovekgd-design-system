# Telegram and retention

Authorized review target: `https://t.me/c/4337049383/1030` only.

Before the first send, load the existing `telegram-human-session` skill, read
message 1030, and verify the resolved chat/entity and topic root. Never create a
new auth flow or use the role-scoped S22/Kaggle session. Fail closed on mismatch.

Publishing is an explicit `--publish-telegram` step and is disabled in default
local/CI runs. Once the owner authorizes an interactive review run, Telegram is
also the live progress ledger. Every case is a separate publish transaction:
as soon as that case reaches a terminal agent verdict, send it, read it back,
and persist the receipt **before beginning the next case**. Never accumulate
ready cases for a later batch or replace their individual posts with a summary.
Summaries are optional and never satisfy this per-case gate.

The main PNG is Astro left, Penpot right, same scale, no stretch, with a Russian
status strip, component/state/fixture, geometry/pixel summary, run ID, authority
mode, and short contract hash. If the exact Penpot export is unavailable, post
a clearly labeled diagnostic board immediately: it must say the visual
comparison was not run, name the blocker, and link the bounded Penpot board.
It must not show a fabricated Penpot rendering or claim `PASS`. When export is
restored, publish the actual comparison as a new message that supersedes the
diagnostic.

Caption always separates `Agent verdict` from `Owner status`. Identical content
hashes deduplicate. A changed rerun creates a new message with
`supersedes_message_id`; never edit away review history. Read back the exact
message/media and persist the schema-backed receipt. Do not background-poll.

Use `scripts/send-telegram-topic.py` for the existing human-session transport.
It deliberately accepts exactly one plan, verifies the authorized forum/topic
on every invocation, sends one message, reads that message back, and writes one
receipt. Repeating `--plan` or passing a batch is unsupported by design.

Ephemeral runs live in `artifacts/ui-conformance/<run-id>/` and require both
`.ui-conformance-run` and a valid `manifest.json`. Defaults: local success 6h,
published read-back 24h, fail/blocked 72h, Actions 3d, mass owner review 7d,
local cap 2GB with oldest eligible first.

Cleanup is root-bound and refuses `/`, `$HOME`, repository root, short paths,
symlink escapes, active `.lock`, `keep:true`, invalid/missing marker/manifest,
and durable references. Run dry-run before real deletion. Accepted exports,
contracts, exception decisions, and final receipts are durable.
