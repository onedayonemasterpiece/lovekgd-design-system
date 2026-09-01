const PACKAGE_SHA256 = "9a051662432f7c6ac66d569df20e3bfe9d546a7a73b110f769912a6e73977e7f";
const pkg = storage.matEventcardTextR11cPackage;
if (!pkg || pkg.package_sha256 !== PACKAGE_SHA256 || pkg.package_id !== "MAT-EVENTCARD-TEXT-R11C-COMPATIBLE-REPAIR") {
  throw new Error("R11C_PACKAGE_NOT_VERIFIED_STOP_NO_RETRY");
}
return await (async function readEventcardTextR11c(P) {
  const EPS = 0.1;
  const TOL = 2;
  const BEFORE_KEY = "kenigevents-r11c-before-v1";
  const MARK_KEY = "kenigevents-r11c-compatible-repair-v1";
  const SNAPSHOT_KEY = "kenigevents-r11c-stable-snapshot-v1";
  const children = (shape) => Array.from(shape?.children || []);
  const walk = (shape) => [shape, ...children(shape).flatMap(walk)];
  const sortedIds = (items) => items.map((item) => item.id).sort();
  const finite = (values) => values.every(Number.isFinite);
  const near = (a, b) => Math.abs(Number(a) - Number(b)) <= EPS;
  const contained = (shape) => {
    const b = shape?.textBounds;
    return !!b && finite([b.x, b.y, b.width, b.height]) && b.width > 0 && b.height > 0 &&
      b.x >= shape.x - TOL && b.y >= shape.y - TOL && b.x + b.width <= shape.x + shape.width + TOL && b.y + b.height <= shape.y + shape.height + TOL;
  };
  const within = (shape, root) => {
    const b = shape?.textBounds;
    return !!b && !!root && finite([b.x, b.y, b.width, b.height]) && b.width > 0 && b.height > 0 &&
      b.x >= root.x - TOL && b.y >= root.y - TOL && b.x + b.width <= root.x + root.width + TOL && b.y + b.height <= root.y + root.height + TOL;
  };
  const geometry = (shape) => ({ frame: [shape.x, shape.y, shape.width, shape.height], text_bounds: shape.textBounds ? [shape.textBounds.x, shape.textBounds.y, shape.textBounds.width, shape.textBounds.height] : null });
  const same = (a, b, code) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${code}_STOP_NO_RETRY`); };
  let auth;
  try { auth = JSON.parse(storage.matEventcardTextR11cReadbackAuthorization || "null"); }
  catch { throw new Error("R11C_READBACK_AUTHORIZATION_UNREADABLE_STOP_NO_RETRY"); }
  if (!auth || auth.schema_version !== "kenigevents.mat-readback-authorization.v1" || auth.package_id !== P.package_id ||
      auth.package_sha256 !== PACKAGE_SHA256 || auth.stage !== "DISTINCT_LATER_READBACK" || auth.authorized !== true ||
      auth.execution_terminal_state !== "MUTATED_PENDING_DISTINCT_LATER_READBACK" ||
      typeof auth.authorization_nonce !== "string" || !auth.authorization_nonce) {
    throw new Error("R11C_DISTINCT_READBACK_NOT_AUTHORIZED_STOP_NO_RETRY");
  }
  if (typeof penpot.waitForLayoutUpdate !== "function") throw new Error("R11C_CONTEXT_WAIT_UNAVAILABLE_STOP_NO_RETRY");
  await penpot.waitForLayoutUpdate(P.settlement_timeout_ms);
  if (penpot.currentFile?.id !== P.penpot_target.file_id || penpot.currentPage?.id !== P.penpot_target.page_id) throw new Error("R11C_FILE_OR_PAGE_DRIFT_STOP_NO_RETRY");

  const pageRoots = children(penpot.currentPage?.root);
  const board = pageRoots.find((shape) => shape.id === P.penpot_target.accepted_root_id);
  const boardChildren = children(board);
  const boardDescendants = board ? walk(board).slice(1) : [];
  const components = Array.from(penpot.library?.local?.components || []);
  const cardIds = new Set(P.accepted_card_root_ids);
  const cards = boardDescendants.filter((shape) => cardIds.has(shape.id));
  const texts = cards.flatMap((card) => walk(card).filter((shape) => shape.type === "text" && shape.characters));
  const textById = new Map(texts.map((shape) => [shape.id, shape]));
  const snapshot = {
    page_root_ids: sortedIds(pageRoots),
    accepted_root_child_ids: sortedIds(boardChildren),
    accepted_root_descendant_ids: sortedIds(boardDescendants),
    component_rows: components.map((component) => ({ id: component.id, name: component.name ?? null })).sort((a, b) => a.id.localeCompare(b.id)),
    card_ids: sortedIds(cards),
    text_ids: sortedIds(texts),
  };
  const expected = P.post_readback_census;
  const validation = penpot.currentFile?.validate?.() || [];
  if (!board || pageRoots.length !== expected.page_direct_roots || boardChildren.length !== expected.accepted_root_children ||
      boardDescendants.length !== expected.accepted_root_descendants || components.length !== expected.local_components ||
      cards.length !== expected.accepted_cards || texts.length !== expected.managed_texts || validation.length !== 0) {
    throw new Error("R11C_READBACK_CENSUS_DRIFT_STOP_NO_RETRY");
  }
  same(sortedIds(cards), [...P.accepted_card_root_ids].sort(), "R11C_CARD_ID_DRIFT");

  const rows = [];
  let frozenSnapshot = null;
  for (const spec of P.targets) {
    const shape = textById.get(spec.id);
    const root = cards.find((card) => card.id === spec.root_id);
    if (!shape || !root || typeof shape.waitForLayoutUpdate !== "function") throw new Error(`R11C_TARGET_MISSING_${spec.id}_STOP_NO_RETRY`);
    await shape.waitForLayoutUpdate(P.settlement_timeout_ms);
    await penpot.waitForLayoutUpdate(P.settlement_timeout_ms);
    const mark = JSON.parse(shape.getPluginData?.(MARK_KEY) || "null");
    const before = JSON.parse(shape.getPluginData?.(BEFORE_KEY) || "null");
    const saved = JSON.parse(shape.getPluginData?.(SNAPSHOT_KEY) || "null");
    if (!frozenSnapshot) frozenSnapshot = saved; else same(saved, frozenSnapshot, "R11C_TARGET_SNAPSHOT_DIVERGENCE");
    const after = geometry(shape);
    const changed = !!before && (after.frame.some((value, index) => !near(value, before.frame[index])) || after.text_bounds.some((value, index) => !near(value, before.text_bounds[index])));
    if (!mark || mark.package_sha256 !== PACKAGE_SHA256 || mark.authorization_nonce !== auth.authorization_nonce || mark.state !== "PENDING_DISTINCT_LATER_READBACK" ||
        !before || before.grow_type !== "fixed" || before.characters !== spec.characters || shape.characters !== spec.characters || shape.growType !== "auto-width" ||
        !contained(shape) || !within(shape, root) || !changed || after.text_bounds[3] > before.frame[3] + TOL) {
      throw new Error(`R11C_UNKNOWN_OR_UNCONTAINED_OUTCOME_${spec.id}_STOP_NO_RETRY`);
    }
    rows.push({ id: shape.id, before, after, contained: true, within_root: true, changed: true });
  }
  same(snapshot, frozenSnapshot, "R11C_UNTARGETED_ID_OR_CENSUS_DRIFT");

  for (const spec of P.protected_untargeted_offenders) {
    const shape = textById.get(spec.id);
    const g = shape ? geometry(shape) : { frame: null, text_bounds: null };
    if (!shape || shape.parent?.id !== spec.parent_id || shape.characters !== spec.characters || shape.growType !== spec.grow_type ||
        shape.getPluginData?.("kenigevents-g19-child-marker") !== spec.marker ||
        !g.frame?.every((value, index) => near(value, spec.frame[index])) || !g.text_bounds?.every((value, index) => near(value, spec.text_bounds[index])) || contained(shape)) {
      throw new Error(`R11C_PROTECTED_FREE_COLLECTION_DRIFT_${spec.id}_STOP_NO_RETRY`);
    }
  }
  const offenderIds = texts.filter((shape) => !contained(shape)).map((shape) => shape.id).sort();
  same(offenderIds, P.protected_untargeted_offender_ids, "R11C_POST_READBACK_OFFENDER_SET_DRIFT");
  if (texts.length - offenderIds.length !== expected.contained || offenderIds.length !== expected.offenders) throw new Error("R11C_POST_READBACK_CONTAINMENT_COUNT_DRIFT_STOP_NO_RETRY");

  return {
    schema_version: "kenigevents.mat-eventcard-text-r11c-readback-receipt.v1",
    terminal_state: "COMPATIBLE_OCCURRENCE_PEERS_MEASUREMENT_PASS",
    mutation_count: 0,
    target_ids: P.target_ids,
    rows,
    census: expected,
    stable_ids: true,
    protected_untargeted_ids_unchanged: true,
    validation: [],
    terminal_recommendation: "QA may accept exact committed bytes; INTEGRATE may issue a separate execution authorization. Do not infer EventCard visual PASS; media, component-path, and 16 protected text offenders remain outside this package.",
  };
})(pkg);
