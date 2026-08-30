#!/usr/bin/env node
import path from 'node:path';
import { writeOrCheckMaterializationDocuments } from './lib.mjs';
import { ComponentSynthesisValidationError } from './structured-error.mjs';

const args = process.argv.slice(2);
const value = (flag, fallback) => {
  const index = args.indexOf(flag);
  return index === -1 ? fallback : args[index + 1];
};
const root = path.resolve(value('--root', '.'));
const check = args.includes('--check');

try {
  const { ir } = writeOrCheckMaterializationDocuments({ root, check });
  process.stdout.write(`${JSON.stringify({
    status: 'PASS',
    mode: check ? 'check' : 'write',
    components: ir.counts.native_component_masters,
    variants: ir.counts.concrete_component_variants,
    nested_instances: ir.counts.nested_component_instances,
    fixture_specimen_instances: ir.counts.fixture_specimen_instances,
    archetypes: ir.counts.archetypes,
    archetype_instances: ir.counts.archetype_instances,
    explicit_gaps: ir.counts.explicit_gaps,
  })}\n`);
} catch (error) {
  const detail = error instanceof ComponentSynthesisValidationError ? error.toJSON() : { name: error.name, code: 'ACS_UNEXPECTED', diagnostic: error.message };
  process.stderr.write(`${JSON.stringify({ status: 'REJECTED', error: detail })}\n`);
  process.exitCode = 1;
}
