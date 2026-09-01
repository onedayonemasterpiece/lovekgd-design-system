'use strict';

const { runNativePackage } = require('./native_runtime_v2');
const { packageDefinition } = require('./setup_v2');

async function run({ penpot, storage, lease }) {
  return runNativePackage({ penpot, storage, lease, packageDefinition });
}

module.exports = { run };
