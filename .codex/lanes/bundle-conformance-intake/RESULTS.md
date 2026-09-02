# Lane bundle-conformance-intake Results

## Status
committed

## Requirement IDs
- Q2 / D0_PLUGIN_BUNDLE_CONFORMANCE_V1

## Branch
agent/d0-plugin-bundle-conformance-v1-20260902

## Worktree
/home/dev/.worktrees/d0-plugin-bundle-conformance-v1

## Base SHA
be4918e5d8e1c1bba5da478acfd08f8035cfc1a5

## Head SHA
Recorded by the terminal provider readback.

## Files changed
- tests/asp-production-conveyor-v3/d0/d0_plugin_bundle_conformance_v1.mjs
- .codex/lanes/bundle-conformance-intake/RESULTS.md

## Commands run
- `node --check tests/asp-production-conveyor-v3/d0/d0_plugin_bundle_conformance_v1.mjs`
- `node tests/asp-production-conveyor-v3/d0/d0_plugin_bundle_conformance_v1.mjs --self-test`

## Tests / verification
The self-test loads one conforming single-file bundle in a browser/Penpot-like VM and drives projection, bounded execution, settlement, and a fresh-storage replay. It also rejects require, module/exports, process, Buffer, dynamic import, filesystem APIs, and an incorrect exact SHA-256. The native-like host exposes `currentFile.revn` without a manufactured `revision` alias; omits browser-only crypto/text encoders, bare `structuredClone`, and caller-injected dependency, storage, coverage, and ACTIVE-marker helpers; and traps orchestration-owned `saveVersion` calls. Writer packages must actually read a physical ACTIVE marker from `currentFile` shared plugin data. Component mocks expose the real `mainInstance()` method contract and may not substitute a `.main` property. Portable in-bundle fallbacks remain allowed when they execute in that host, while conformance-only authorization bypasses are rejected.

## Risks
The harness is a technical callability gate only. Package-specific semantics, protected projections, authorization, native readback, and visual acceptance remain independent gates.

## Merge notes
No merge, deploy, promotion, Penpot read, or Penpot mutation was performed.
