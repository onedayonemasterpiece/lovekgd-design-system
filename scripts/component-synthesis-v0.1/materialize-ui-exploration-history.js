/* LoveKGD Component Synthesis v0.1 — historicalize the superseded Event Media owner pack.
 * Input: explicit options.plan or storage.componentSynthesisV01UiHistoryPlan.
 * Execute only while connected to the exact UI Exploration file.
 */
(function installUiExplorationHistoryMaterializer(global) {
  'use strict';
  const FILE_ID = '81f57451-85cc-819d-8008-76829a28696b';
  const NS = 'lovekgd.component-synthesis.v0.1';
  const fail = (code, message, detail) => { const error = new Error(message); error.code = code; error.detail = detail; throw error; };
  const requireValue = (condition, code, message, detail) => { if (!condition) fail(code, message, detail); };
  const pages = (penpot) => Array.from(penpot.currentFile.pages ?? []);
  const shapes = (penpot) => pages(penpot).flatMap((page) => Array.from(page.findShapes?.({}) ?? []));
  const shapeById = (penpot, id) => {
    const matches = shapes(penpot).filter((shape) => shape.id === id);
    requireValue(matches.length === 1, 'ACS_UI_HISTORY_OBJECT', `expected exact existing Penpot object ${id}`, { matches: matches.length });
    return matches[0];
  };
  const set = (shape, key, value) => shape.setSharedPluginData(NS, key, String(value));
  const mark = (shape, objectKind) => {
    set(shape, 'object_kind', objectKind);
    set(shape, 'owner_review_status', 'WITHDRAWN_FROM_OWNER_REVIEW');
    set(shape, 'revision_disposition', 'NEEDS_REVISION');
    set(shape, 'selected', false); set(shape, 'accepted', false); set(shape, 'promotion_ready', false); set(shape, 'canonical', false);
  };
  const addVisibleNote = (penpot, board, decisionId) => {
    const existing = Array.from(board.children ?? []).find((child) => child.name === `History status / ${decisionId}`);
    if (existing) return existing;
    const text = penpot.createText('Снято с рассмотрения владельца · Требует переработки');
    requireValue(text, 'ACS_UI_HISTORY_TEXT', `could not create visible history note for ${decisionId}`);
    text.name = `History status / ${decisionId}`; text.fontSize = '16'; text.fontWeight = '600'; text.x = 24; text.y = 24;
    board.appendChild(text); return text;
  };
  const threadsById = (penpot) => {
    const result = new Map();
    for (const page of pages(penpot)) for (const thread of Array.from(page.findCommentThreads?.({}) ?? [])) result.set(thread.id, thread);
    return result;
  };
  async function materialize(options) {
    const penpot = options?.penpot ?? global.penpot;
    const storage = options?.storage ?? global.storage ?? {};
    const plan = options?.plan ?? storage.componentSynthesisV01UiHistoryPlan;
    const mode = options?.mode ?? 'dry-run';
    requireValue(penpot?.currentFile?.id === FILE_ID, 'ACS_UI_HISTORY_FILE', `expected UI Exploration ${FILE_ID}`);
    requireValue(plan?.target?.file_id === FILE_ID && plan.execution_status === 'BLOCKED_EXTERNAL_EVIDENCE', 'ACS_UI_HISTORY_PLAN', 'missing or wrong historicalization plan');
    const decisions = plan.boards?.decisions ?? [];
    requireValue(decisions.length === 3, 'ACS_UI_HISTORY_COUNT', 'exactly three decision boards are required');
    const operations = [];
    for (const decision of decisions) {
      operations.push({ kind: 'mark_board_historical', decision_id: decision.decision_id, object_id: decision.board_id });
      for (const id of decision.option_component_ids) operations.push({ kind: 'mark_option_master_historical', decision_id: decision.decision_id, object_id: id });
      for (const id of decision.option_instance_ids) operations.push({ kind: 'mark_option_instance_historical', decision_id: decision.decision_id, object_id: id });
      operations.push({ kind: 'reply_and_resolve_comment', decision_id: decision.decision_id, thread_id: decision.comment_thread_id });
    }
    if (mode === 'dry-run') return { status: 'DRY_RUN_ONLY_NOT_READBACK_EVIDENCE', operations };
    requireValue(mode === 'materialize', 'ACS_UI_HISTORY_MODE', `unsupported mode ${mode}`);
    mark(shapeById(penpot, plan.boards.exploration_map.board_id), 'historical_exploration_map');
    mark(shapeById(penpot, plan.boards.owner_overview.board_id), 'historical_owner_overview');
    const threads = threadsById(penpot);
    for (const decision of decisions) {
      const board = shapeById(penpot, decision.board_id); mark(board, 'historical_decision_board'); addVisibleNote(penpot, board, decision.decision_id);
      for (const id of decision.option_component_ids) mark(shapeById(penpot, id), 'historical_option_master');
      for (const id of decision.option_instance_ids) mark(shapeById(penpot, id), 'historical_option_instance');
      const thread = threads.get(decision.comment_thread_id);
      requireValue(thread, 'ACS_UI_HISTORY_COMMENT', `missing exact comment thread ${decision.comment_thread_id}`);
      const comments = Array.from(thread.findComments?.({}) ?? []);
      const alreadyReplied = comments.some((comment) => String(comment.content ?? comment.text ?? '').includes('снят с рассмотрения владельца'));
      if (!alreadyReplied) await thread.reply(decision.comment_action.reply_ru);
      thread.resolved = true;
    }
    const open = [...threads.values()].filter((thread) => decisions.some((decision) => decision.comment_thread_id === thread.id) && thread.resolved !== true);
    requireValue(open.length === 0, 'ACS_UI_HISTORY_COMMENT', 'obsolete owner threads remain actionable', open.map((thread) => thread.id));
    return { status: 'PASS', selected_count: 0, accepted_count: 0, open_actionable_comment_count: 0, preserved_ids: true, operations };
  }
  global.LoveKGDComponentSynthesisV01UiHistory = { materialize, fileId: FILE_ID, namespace: NS };
})(typeof globalThis === 'undefined' ? this : globalThis);
