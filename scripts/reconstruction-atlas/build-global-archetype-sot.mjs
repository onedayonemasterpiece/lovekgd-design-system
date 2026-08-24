#!/usr/bin/env node
// Compatibility entry point. The durable fail-closed implementation lives in
// scripts/global-archetype-sot-v1/build.mjs.
await import('../global-archetype-sot-v1/build.mjs');
