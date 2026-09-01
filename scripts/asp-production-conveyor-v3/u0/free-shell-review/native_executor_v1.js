'use strict';

const { runExecutablePackage } = require('./native_runtime_v1');
const { packageDefinition } = require('./setup_v1');

async function run({ penpot, storage, lease }) {
  return runExecutablePackage({ penpot, storage, lease, packageDefinition });
}

module.exports = { run };
