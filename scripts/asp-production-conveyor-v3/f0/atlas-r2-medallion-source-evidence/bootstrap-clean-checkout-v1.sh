#!/usr/bin/env bash
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
VENV="${ATLAS_EVIDENCE_VENV:-${ROOT}/.venv-atlas-evidence}"
python3 -m venv "${VENV}"
"${VENV}/bin/python" -m pip install --disable-pip-version-check --requirement "${ROOT}/scripts/asp-production-conveyor-v3/f0/atlas-r2-medallion-source-evidence/requirements.atlas-evidence.txt"
"${VENV}/bin/python" "${ROOT}/scripts/asp-production-conveyor-v3/f0/atlas-r2-medallion-source-evidence/generate.py" \
  --repo "${ROOT}" \
  --output-dir "${ROOT}/reports/asp-production-conveyor-v3/atlas-v2/source-bound/f0-medallions"
"${VENV}/bin/python" "${ROOT}/tests/asp-production-conveyor-v3/f0/atlas-r2-medallion-source-evidence/test_evidence.py" \
  --dir "${ROOT}/reports/asp-production-conveyor-v3/atlas-v2/source-bound/f0-medallions"
