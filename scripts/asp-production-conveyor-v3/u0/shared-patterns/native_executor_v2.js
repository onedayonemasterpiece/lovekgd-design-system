'use strict';

const { runNativeSuccessor } = require('./native_runtime_v2');
const { nativeContract, predecessor, productContract, successor } = require('./setup_v2');

async function run({ penpot, storage, lease }) {
  return runNativeSuccessor({ penpot, storage, lease, successor, predecessor, productContract, nativeContract });
}

module.exports = { run };
