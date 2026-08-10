#!/usr/bin/env bash
set -euo pipefail

BASE_SHA='317938bc72cf7a47ea798b2614d92d3d285dd97a'
EVENTS_SHA_EXPECTED='66bc0d43e36299417626f992021cfb7299ddf704'

usage() {
  cat >&2 <<'EOF'
Usage: replay.sh \
  --source-bundle PATH --source-sha SHA \
  --events-bundle PATH --events-sha SHA \
  --prior-archive PATH --closure-archive PATH \
  --output-dir PATH --checkout-dir PATH

The checkout directory must not exist. The output directory may already contain
the source bundles, deterministic archives, visual inputs, replay.sh and tools.
EOF
  exit 2
}

source_bundle=''
source_sha=''
events_bundle=''
events_sha=''
prior_archive=''
closure_archive=''
output_dir=''
checkout_dir=''
while (($#)); do
  case "$1" in
    --source-bundle) source_bundle=${2:-}; shift 2 ;;
    --source-sha) source_sha=${2:-}; shift 2 ;;
    --events-bundle) events_bundle=${2:-}; shift 2 ;;
    --events-sha) events_sha=${2:-}; shift 2 ;;
    --prior-archive) prior_archive=${2:-}; shift 2 ;;
    --closure-archive) closure_archive=${2:-}; shift 2 ;;
    --output-dir) output_dir=${2:-}; shift 2 ;;
    --checkout-dir) checkout_dir=${2:-}; shift 2 ;;
    *) usage ;;
  esac
done

[[ $source_sha =~ ^[a-f0-9]{40}$ ]] || usage
[[ $events_sha == "$EVENTS_SHA_EXPECTED" ]] || usage
for required_file in "$source_bundle" "$events_bundle" "$prior_archive" "$closure_archive"; do
  [[ -f $required_file ]] || { echo "missing replay input: $required_file" >&2; exit 2; }
done
[[ -n $output_dir && -n $checkout_dir ]] || usage

source_bundle=$(realpath "$source_bundle")
events_bundle=$(realpath "$events_bundle")
prior_archive=$(realpath "$prior_archive")
closure_archive=$(realpath "$closure_archive")
mkdir -p "$output_dir"
output_dir=$(realpath "$output_dir")
checkout_parent=$(dirname "$checkout_dir")
mkdir -p "$checkout_parent"
checkout_parent=$(realpath "$checkout_parent")
checkout_dir="$checkout_parent/$(basename "$checkout_dir")"
[[ ! -e $checkout_dir ]] || { echo "checkout directory must not exist: $checkout_dir" >&2; exit 2; }

script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
if [[ -f "$script_dir/tools/workflow-command-ledger.mjs" ]]; then
  ledger_tool="$script_dir/tools/workflow-command-ledger.mjs"
else
  ledger_tool="$script_dir/workflow-command-ledger.mjs"
fi
[[ -f $ledger_tool ]] || { echo 'workflow command ledger tool is missing' >&2; exit 2; }

ledger="$output_dir/command-ledger.jsonl"
logs="$output_dir/logs"
mutation_result="$output_dir/project-normalization-v1-1-mutation-results.json"
design="$checkout_dir/design"
events="$checkout_dir/events"
historical="$checkout_dir/historical-v1"
mkdir -p "$checkout_dir" "$logs"
: > "$ledger"

run() {
  local label=$1
  local cwd=$2
  local cwd_label=$3
  shift 3
  node "$ledger_tool" \
    --ledger "$ledger" \
    --logs-dir "$logs" \
    --label "$label" \
    --cwd "$cwd" \
    --cwd-label "$cwd_label" \
    -- "$@"
}

run_capture_stdout() {
  local label=$1
  local cwd=$2
  local cwd_label=$3
  local stdout_file=$4
  shift 4
  node "$ledger_tool" \
    --ledger "$ledger" \
    --logs-dir "$logs" \
    --label "$label" \
    --cwd "$cwd" \
    --cwd-label "$cwd_label" \
    --stdout-file "$stdout_file" \
    -- "$@"
}

run clone-design "$checkout_dir" replay git clone --no-checkout "$source_bundle" "$design"
run verify-design-bundle "$design" design git bundle verify "$source_bundle"
run checkout-design "$design" design git checkout --detach "$source_sha"
run clone-events "$checkout_dir" replay git clone --no-checkout "$events_bundle" "$events"
run verify-events-bundle "$events" events git bundle verify "$events_bundle"
run checkout-events "$events" events git checkout --detach "$events_sha"
run design-clean-before "$design" design git status --porcelain
run events-clean-before "$events" events git status --porcelain

# This gate covers the committed remediation range. Exactly two byte-preserved
# audit inputs are excluded here; build-workflow-attestation.mjs independently
# verifies the expected byte length and SHA-256 of each one.
run committed-range-diff-check "$design" design git diff --check "$BASE_SHA..$source_sha" -- . \
  ':(exclude)docs/audits/project-normalization-synthesis-v1-independent-red-team-audit.md' \
  ':(exclude)docs/audits/project-normalization-synthesis-v1-1-independent-red-team-reaudit.md'
run verify-inputs-before "$design" design node scripts/normalization-v1-1/build-workflow-attestation.mjs \
  --verify-inputs-only --root "$design" --events-repo "$events" --source-sha "$source_sha"

run clone-historical "$checkout_dir" replay git clone --no-checkout "$source_bundle" "$historical"
run checkout-historical "$historical" historical git checkout --detach "$BASE_SHA"
run validate-historical-v1 "$historical" historical node scripts/validate-project-normalization-synthesis-v1.mjs "$historical" \
  --events-repo "$events"

run validate-workflow-path-filters "$design" design node scripts/normalization-v1-1/validate-workflow-path-filters.mjs --root "$design"
run test-workflow-path-filters "$design" design node --test tests/project-normalization-v1-1-workflow-path-filters.mjs
run build-raw-partition "$design" design node scripts/normalization-v1-1/build-raw-partition.mjs --check --self-test
run build-registry-readiness "$design" design node scripts/normalization-v1-1/build-registry-readiness.mjs --check --self-test
run validate-event-media-dossier "$design" design node scripts/normalization-v1-1/validate-event-media-dossier.mjs --root "$design"
run validate-medallions-navigation "$design" design node scripts/validate-project-normalization-v1-1-medallions-navigation.mjs "$design"
run validate-family-lifecycle "$design" design node scripts/validate-family-lifecycle-v1.mjs --root "$design"
run validate-resource-graph "$design" design node scripts/validate-resource-graph-004-contracts.mjs
run validate-normalization-schemas "$design" design python3 scripts/validate-normalization-schemas-v1-1.py "$design"
run validate-current-synthesis "$design" design node scripts/validate-project-normalization-synthesis-v1-1.mjs "$design" \
  --events-repo "$events" \
  --prior-archive "$prior_archive" \
  --closure-archive "$closure_archive"

run test-registry-readiness "$design" design node tests/normalization-v1-1-registry-readiness.mjs
run test-event-media-dossier "$design" design node scripts/normalization-v1-1/test-event-media-dossier-validator.mjs "$design"
run test-medallions-navigation "$design" design node --test scripts/validate-project-normalization-v1-1-medallions-navigation.test.mjs
run test-family-lifecycle "$design" design node tests/family-lifecycle-v1-negative.mjs "$design"
run test-evidence-value-gates "$design" design node scripts/test-evidence-value-gates-v1-1-negative.mjs "$design"
run_capture_stdout test-project-mutations "$design" design "$mutation_result" \
  node tests/project-normalization-synthesis-v1-1-negative.mjs "$design"
run scan-secrets "$design" design python3 scripts/scan-normalization-v1-1-secrets.py "$design" "$BASE_SHA"

run design-clean-after "$design" design git status --porcelain
run events-clean-after "$events" events git status --porcelain

node "$design/scripts/normalization-v1-1/build-workflow-attestation.mjs" \
  --root "$design" \
  --events-repo "$events" \
  --source-sha "$source_sha" \
  --ledger "$ledger" \
  --mutation-result "$mutation_result" \
  --output-dir "$output_dir" \
  ${GITHUB_ACTIONS:+--require-actions-runner-version}

(
  cd "$output_dir"
  find . -type f ! -name SHA256SUMS -printf '%P\0' \
    | sort -z \
    | xargs -0 sha256sum > SHA256SUMS
  sha256sum --check SHA256SUMS
)
