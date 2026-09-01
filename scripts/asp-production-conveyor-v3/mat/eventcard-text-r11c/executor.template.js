const PACKAGE_SHA256 = "__PACKAGE_SHA256__";
const pkg = storage.matEventcardTextR11cPackage;
if (!pkg || pkg.package_sha256 !== PACKAGE_SHA256 || pkg.package_id !== "MAT-EVENTCARD-TEXT-R11C-COMPATIBLE-REPAIR") {
  throw new Error("R11C_PACKAGE_NOT_VERIFIED_STOP_NO_RETRY");
}
return await (async function executeEventcardTextR11c(P) {
  const EPS = 0.1;
  const TOL = 2;
  const BEFORE_KEY = "kenigevents-r11c-before-v1";
  const MARK_KEY = "kenigevents-r11c-compatible-repair-v1";
  const SNAPSHOT_KEY = "kenigevents-r11c-stable-snapshot-v1";

  const children = (shape) => Array.from(shape?.children || []);
  const walk = (shape) => [shape, ...children(shape).flatMap(walk)];
  const finite = (values) => values.every(Number.isFinite);
  const near = (a, b) => Math.abs(Number(a) - Number(b)) <= EPS;
  const contained = (shape) => {
    const b = shape?.textBounds;
    return !!b && finite([b.x, b.y, b.width, b.height]) && b.width > 0 && b.height > 0 &&
      b.x >= shape.x - TOL && b.y >= shape.y - TOL &&
      b.x + b.width <= shape.x + shape.width + TOL &&
      b.y + b.height <= shape.y + shape.height + TOL;
  };
  const within = (shape, root) => {
    const b = shape?.textBounds;
    return !!b && !!root && finite([b.x, b.y, b.width, b.height]) && b.width > 0 && b.height > 0 &&
      b.x >= root.x - TOL && b.y >= root.y - TOL &&
      b.x + b.width <= root.x + root.width + TOL &&
      b.y + b.height <= root.y + root.height + TOL;
  };
  const geometry = (shape) => ({
    frame: [shape.x, shape.y, shape.width, shape.height],
    text_bounds: shape.textBounds ? [shape.textBounds.x, shape.textBounds.y, shape.textBounds.width, shape.textBounds.height] : null,
  });
  const sortedIds = (items) => items.map((item) => item.id).sort();
  const assertSame = (actual, expected, code) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`${code}_STOP_NO_RETRY`);
  };
  const readAuthorization = () => {
    let auth;
    try { auth = JSON.parse(storage.matEventcardTextR11cExecutionAuthorization || "null"); }
    catch { throw new Error("R11C_AUTHORIZATION_UNREADABLE_STOP_NO_RETRY"); }
    if (!auth || auth.schema_version !== "kenigevents.mat-execution-authorization.v1" ||
        auth.package_id !== P.package_id || auth.package_sha256 !== PACKAGE_SHA256 ||
        auth.stage !== "EXECUTE" || auth.authorized !== true ||
        auth.qa_exact_bytes_pass !== true || auth.integrate_same_tuple_pass !== true ||
        typeof auth.authorization_nonce !== "string" || !auth.authorization_nonce) {
      throw new Error("R11C_EXECUTION_NOT_AUTHORIZED_STOP_NO_RETRY");
    }
    return auth;
  };
  const active = () => {
    const auth = readAuthorization();
    let control;
    try { control = JSON.parse(penpot.currentFile?.getSharedPluginData?.("kenigevents", "asp-active-run-v1") || "null"); }
    catch { throw new Error("R11C_ACTIVE_RUN_UNREADABLE_STOP_NO_RETRY"); }
    if (!control || control.schema !== "kenigevents.asp-run-control.v1" || control.state !== "ACTIVE" ||
        control.writer_id !== auth.writer_id || control.run_id !== auth.run_id) {
      throw new Error("R11C_ACTIVE_RUN_MISMATCH_STOP_NO_RETRY");
    }
    return auth;
  };

  const auth = active();
  if (P.penpot_execution_authorized !== false) throw new Error("R11C_FROZEN_PACKAGE_AUTHORIZATION_DRIFT_STOP_NO_RETRY");
  if (penpot.currentFile?.id !== P.penpot_target.file_id || penpot.currentPage?.id !== P.penpot_target.page_id) {
    throw new Error("R11C_FILE_OR_PAGE_DRIFT_STOP_NO_RETRY");
  }
  if (penpot.currentFile?.revn !== P.penpot_target.expected_revision) {
    throw new Error("R11C_REVISION_DRIFT_STOP_NO_RETRY");
  }
  if (typeof penpot.waitForLayoutUpdate !== "function") throw new Error("R11C_CONTEXT_WAIT_UNAVAILABLE_STOP_NO_RETRY");

  const pageRoots = children(penpot.currentPage?.root);
  const board = pageRoots.find((shape) => shape.id === P.penpot_target.accepted_root_id);
  const boardChildren = children(board);
  const boardDescendants = board ? walk(board).slice(1) : [];
  const components = Array.from(penpot.library?.local?.components || []);
  const cardIds = new Set(P.accepted_card_root_ids);
  const cards = boardDescendants.filter((shape) => cardIds.has(shape.id));
  const texts = cards.flatMap((card) => walk(card).filter((shape) => shape.type === "text" && shape.characters));
  const textById = new Map(texts.map((shape) => [shape.id, shape]));
  const componentSnapshot = components.map((component) => ({ id: component.id, name: component.name ?? null })).sort((a, b) => a.id.localeCompare(b.id));
  const snapshot = {
    page_root_ids: sortedIds(pageRoots),
    accepted_root_child_ids: sortedIds(boardChildren),
    accepted_root_descendant_ids: sortedIds(boardDescendants),
    component_rows: componentSnapshot,
    card_ids: sortedIds(cards),
    text_ids: sortedIds(texts),
  };
  const census = P.baseline_census;
  const validation = penpot.currentFile?.validate?.() || [];
  if (!board || pageRoots.length !== census.page_direct_roots || boardChildren.length !== census.accepted_root_children ||
      boardDescendants.length !== census.accepted_root_descendants || components.length !== census.local_components ||
      cards.length !== census.accepted_cards || texts.length !== census.managed_texts || validation.length !== 0) {
    throw new Error("R11C_BASELINE_CENSUS_DRIFT_STOP_NO_RETRY");
  }
  assertSame(sortedIds(cards), [...P.accepted_card_root_ids].sort(), "R11C_CARD_ID_DRIFT");
  const preexistingMarkers = P.targets.map((spec) => textById.get(spec.id)?.getPluginData?.(MARK_KEY)).filter(Boolean);
  if (preexistingMarkers.length) throw new Error("R11C_PREEXISTING_MARKER_UNKNOWN_OUTCOME_STOP_NO_RETRY");

  for (const proof of P.proof_targets) {
    const shape = textById.get(proof.id);
    const root = cards.find((card) => card.id === proof.root_id);
    if (!shape || !root || shape.characters !== proof.characters || shape.growType !== "auto-width" || !contained(shape) || !within(shape, root)) {
      throw new Error(`R11C_PROOF_TARGET_DRIFT_${proof.id}_STOP_NO_RETRY`);
    }
  }

  const targetIds = new Set(P.targets.map((target) => target.id));
  const protectedIds = new Set(P.protected_untargeted_offenders.map((target) => target.id));
  const offenderIds = texts.filter((shape) => !contained(shape)).map((shape) => shape.id).sort();
  assertSame(offenderIds, [...targetIds, ...protectedIds].sort(), "R11C_OFFENDER_SET_DRIFT");

  const verifyFrozen = (spec, target) => {
    const shape = textById.get(spec.id);
    const root = cards.find((card) => card.id === spec.root_id);
    const g = shape ? geometry(shape) : { frame: null, text_bounds: null };
    if (!shape || !root || shape.parent?.id !== spec.parent_id || shape.name !== spec.name ||
        shape.characters !== spec.characters || shape.growType !== spec.grow_type ||
        shape.getPluginData?.("kenigevents-g19-child-marker") !== spec.marker ||
        !near(shape.fontSize, spec.font_size) || !near(shape.lineHeight, spec.line_height) ||
        !g.frame?.every((value, index) => near(value, spec.frame[index])) ||
        !g.text_bounds?.every((value, index) => near(value, spec.text_bounds[index])) ||
        contained(shape) || within(shape, root) !== spec.within_root) {
      throw new Error(`R11C_${target ? "TARGET" : "PROTECTED"}_DRIFT_${spec.id}_STOP_NO_RETRY`);
    }
    return shape;
  };
  const targets = P.targets.map((spec) => verifyFrozen(spec, true));
  P.protected_untargeted_offenders.forEach((spec) => verifyFrozen(spec, false));

  const preSnapshotJson = JSON.stringify(snapshot);
  const block = penpot.history.undoBlockBegin();
  const mutated = [];
  try {
    for (const shape of targets) {
      active();
      const before = { ...geometry(shape), grow_type: shape.growType, characters: shape.characters };
      shape.growType = "auto-width";
      active();
      shape.characters = shape.characters;
      active();
      if (typeof shape.waitForLayoutUpdate !== "function") throw new Error("R11C_SHAPE_WAIT_UNAVAILABLE_UNKNOWN_OUTCOME_STOP_NO_RETRY");
      await shape.waitForLayoutUpdate(P.settlement_timeout_ms);
      active();
      await penpot.waitForLayoutUpdate(P.settlement_timeout_ms);
      active();
      if (!contained(shape) || !within(shape, cards.find((card) => card.id === P.targets.find((spec) => spec.id === shape.id).root_id))) {
        throw new Error(`R11C_POST_SETTLEMENT_CONTAINMENT_UNKNOWN_${shape.id}_STOP_NO_RETRY`);
      }
      shape.setPluginData(BEFORE_KEY, JSON.stringify(before));
      shape.setPluginData(SNAPSHOT_KEY, preSnapshotJson);
      shape.setPluginData(MARK_KEY, JSON.stringify({ package_sha256: PACKAGE_SHA256, authorization_nonce: auth.authorization_nonce, state: "PENDING_DISTINCT_LATER_READBACK" }));
      mutated.push(shape.id);
    }
  } finally {
    penpot.history.undoBlockFinish(block);
  }
  assertSame(mutated.sort(), [...P.target_ids].sort(), "R11C_MUTATED_ID_SET_DRIFT");
  return {
    schema_version: "kenigevents.mat-eventcard-text-r11c-execution-receipt.v1",
    terminal_state: "MUTATED_PENDING_DISTINCT_LATER_READBACK",
    mutation_count: mutated.length,
    target_ids: mutated,
    stable_snapshot: snapshot,
    stop_contract: P.stop_readback_contract,
  };
})(pkg);
