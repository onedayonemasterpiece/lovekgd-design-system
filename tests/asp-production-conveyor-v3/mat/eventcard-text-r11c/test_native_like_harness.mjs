import assert from "node:assert/strict";
import test from "node:test";
import { createHarness, runArtifact, runSuccess } from "../../../../scripts/asp-production-conveyor-v3/mat/eventcard-text-r11c/native_like_harness.mjs";

const executor = "native-repair-executor.v1.js";
const readback = "distinct-later-readback.v1.js";

async function rejectsStop(promise, fragment) {
  await assert.rejects(promise, (error) => error.message.includes(fragment) && error.message.includes("STOP_NO_RETRY"));
}

test("native-like happy path mutates only four exact occurrence targets and later readback passes", async () => {
  const { harness, execution, readback: receipt } = await runSuccess();
  assert.equal(execution.terminal_state, "MUTATED_PENDING_DISTINCT_LATER_READBACK");
  assert.equal(receipt.terminal_state, "COMPATIBLE_OCCURRENCE_PEERS_MEASUREMENT_PASS");
  assert.deepEqual([...new Set(harness.tracker.map((row) => row.id))].sort(), harness.pkg.target_ids);
  assert.equal(receipt.stable_ids, true);
  assert.equal(receipt.protected_untargeted_ids_unchanged, true);
});

test("frozen package authorization false requires separate exact runtime authorization", async () => {
  const harness = createHarness({ authorized: false });
  await rejectsStop(runArtifact(executor, harness), "R11C_EXECUTION_NOT_AUTHORIZED");
  assert.deepEqual(harness.tracker, []);
});

test("unknown post-settlement outcome stops without retry or success receipt", async () => {
  const harness = createHarness({ settle: false });
  await rejectsStop(runArtifact(executor, harness), "R11C_POST_SETTLEMENT_CONTAINMENT_UNKNOWN");
  const written = new Set(harness.tracker.map((row) => row.id));
  assert.ok([...written].every((id) => harness.pkg.target_ids.includes(id)));
});

test("preflight protects all 16 untargeted Free collection offenders", async () => {
  const harness = createHarness();
  const id = harness.pkg.protected_untargeted_offender_ids[0];
  harness.text(id)._characters = "tampered";
  await rejectsStop(runArtifact(executor, harness), "R11C_PROTECTED_DRIFT");
  assert.deepEqual(harness.tracker, []);
});

test("distinct readback fails on protected offender drift", async () => {
  const harness = createHarness();
  await runArtifact(executor, harness);
  const id = harness.pkg.protected_untargeted_offender_ids[3];
  harness.text(id)._growType = "auto-width";
  await rejectsStop(runArtifact(readback, harness), "R11C_PROTECTED_FREE_COLLECTION_DRIFT");
});

test("distinct readback fails on any untargeted managed text ID drift", async () => {
  const harness = createHarness();
  await runArtifact(executor, harness);
  harness.text("harness-contained-text-00").id = "harness-contained-text-tampered";
  await rejectsStop(runArtifact(readback, harness), "R11C_UNTARGETED_ID_OR_CENSUS_DRIFT");
});

test("distinct readback fails on local component stable-ID drift", async () => {
  const harness = createHarness();
  await runArtifact(executor, harness);
  harness.components[0].id = "harness-component-tampered";
  await rejectsStop(runArtifact(readback, harness), "R11C_UNTARGETED_ID_OR_CENSUS_DRIFT");
});

test("executor replay is forbidden and routes to distinct later readback", async () => {
  const harness = createHarness();
  await runArtifact(executor, harness);
  await rejectsStop(runArtifact(executor, harness), "R11C_PREEXISTING_MARKER_UNKNOWN_OUTCOME");
});

test("component paths and component census remain unchanged", async () => {
  const harness = createHarness();
  const before = JSON.stringify(harness.components);
  await runArtifact(executor, harness);
  await runArtifact(readback, harness);
  assert.equal(JSON.stringify(harness.components), before);
  assert.equal(harness.components.length, 18);
});
