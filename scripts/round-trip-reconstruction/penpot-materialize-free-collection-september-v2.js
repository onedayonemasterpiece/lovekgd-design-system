'use strict';

const { executeMaterialization, runCli } = require('./materialization-execution-kernel.js');
const BUNDLE_PATH = 'catalog/materialization-bundles/free-collection-page.g4.ready-v1.json';

function materializeFreeCollectionSeptemberV2(options) {
  return executeMaterialization({ ...options, bundlePath: options.bundlePath || BUNDLE_PATH });
}

if (require.main === module) {
  runCli({ bundlePath: BUNDLE_PATH }).then((code) => { process.exitCode = code; });
}

module.exports = { BUNDLE_PATH, materializeFreeCollectionSeptemberV2 };
