'use strict';

const { executeMaterialization, runCli } = require('./materialization-execution-kernel.js');
const { runPenpotPhaseB } = require('./penpot-phase-b-executor.js');
const BUNDLE_PATH = 'catalog/materialization-bundles/eventcard-free-slice.g4.ready-v1.json';

function materializeEventCardUnifiedGoldenV2(options) {
  if (options?.mode === 'production' && (options.nativeApi || options.capsuleDirectory)) {
    return runPenpotPhaseB(options);
  }
  return executeMaterialization({ ...options, bundlePath: options.bundlePath || BUNDLE_PATH });
}

if (require.main === module) {
  runCli({ bundlePath: BUNDLE_PATH }).then((code) => { process.exitCode = code; });
}

module.exports = { BUNDLE_PATH, materializeEventCardUnifiedGoldenV2, runPenpotPhaseB };
