# Lane u0-paths-v5 Results

## Status
committed

## Requirement IDs
- U0-PATHS

## Branch
agent/u0-eventcard-paths-v5-r2-20260902

## Worktree
/home/dev/worktrees/d0-u0-resume-v3/paths

## Base SHA
8df1f2f31e84aaf23a3a0876fe269db9045048c6

## Head SHA
383956a2a7a9ed468ff26fa2cf599350749c277d

## Files changed
- EventCard Paths runtime, generated standalone V5 bundle, package manifest, package docs, and package-local tests

## Commands run
- deterministic Python bundle generation + byte comparison
- node --test package suite
- python3 -m unittest package control
- D0_PLUGIN_BUNDLE_CONFORMANCE_V1 at 62f26df

## Tests / verification
- Node: 23/23 PASS
- Python: 9/9 PASS
- shared real-tuple harness: PASS, first created=0, replay created=0
- bundle: 43216 bytes, SHA-256 c675d05081f2a7994b6de0ef3cc6c5ea227d3a360ffe5586918a9f718a578b19

## Risks
- Native execution, independent QA, and INTEGRATE were intentionally not performed.

## Merge notes
- Package-local successor of 8df1; no Penpot, product redesign, merge, deploy, promotion, or Kaggle work.
