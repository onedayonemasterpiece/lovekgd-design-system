(() => {
  'use strict';

  const UI_SHA = 'e58fa1529a7ef3676d4f2d8c34145e39d4f52c28';
  const REPO = 'onedayonemasterpiece/lovekgd-design-system';
  const NS = 'lovekgd.mirror.002b';
  const KEY = 'element';
  const OWNER = 'lovekgd-current-mirror-002b';
  const UI = `https://raw.githack.com/${REPO}/${UI_SHA}/prototypes/penpot-review-plugin-002b/dist/ui.html`;

  penpot.ui.open('LoveKGD Review · 002B', UI, { width: 470, height: 760 });

  const now = () => new Date().toISOString();
  const clock = () => typeof performance === 'undefined' ? Date.now() : performance.now();
  const send = (message) => penpot.ui.sendMessage(message);
  const fail = (condition, message) => { if (!condition) throw new Error(message); };
  const safe = (error) => String(error?.message || error || 'unknown_error').slice(0, 320);
  const status = (text, kind = '') => send({ type: 'status', text, kind });

  function bytes(base64) {
    const binary = atob(base64);
    const result = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) result[index] = binary.charCodeAt(index);
    return result;
  }

  function validate(catalog) {
    fail(catalog?.schemaVersion === 3, 'catalog_schema_unsupported');
    fail(catalog.repository === REPO, 'catalog_repository_mismatch');
    fail(catalog.mirror?.namespace === NS, 'catalog_namespace_mismatch');
    fail(/^[0-9a-f]{40}$/u.test(catalog.catalogSha || ''), 'catalog_sha_invalid');
    fail(Array.isArray(catalog.elements) && catalog.elements.length >= 50, 'catalog_load_corpus_too_small');
    fail(typeof catalog.prompt?.template === 'string', 'catalog_prompt_missing');
    const ids = new Set();
    for (const element of catalog.elements) {
      fail(typeof element.id === 'string' && element.id, 'element_id_missing');
      fail(!ids.has(element.id), `duplicate_catalog_element:${element.id}`);
      ids.add(element.id);
      fail(typeof element.contentHash === 'string', `content_hash_missing:${element.id}`);
      fail(Number.isFinite(element.board?.x) && Number.isFinite(element.board?.y), `board_slot_missing:${element.id}`);
      fail(['svg', 'image'].includes(element.payload?.type), `payload_missing:${element.id}`);
      if (element.payload.type === 'svg') fail(element.payload.svg?.includes('<svg'), `svg_payload_invalid:${element.id}`);
      if (element.payload.type === 'image') {
        fail(Boolean(element.payload.bytesBase64), `image_bytes_missing:${element.id}`);
        fail(element.payload.mimeType?.startsWith('image/'), `image_mime_invalid:${element.id}`);
        fail(element.payload.frameSvg?.includes('<svg'), `image_frame_invalid:${element.id}`);
      }
    }
    return catalog;
  }

  function meta(board) {
    if (!board || board.type !== 'board') return null;
    const raw = board.getSharedPluginData(NS, KEY);
    if (!raw) return null;
    try {
      const value = JSON.parse(raw);
      return value?.managedBy === OWNER && typeof value.elementId === 'string' ? value : null;
    } catch { return null; }
  }

  const write = (board, value) => board.setSharedPluginData(NS, KEY, JSON.stringify(value));
  const boards = () => penpot.currentPage?.findShapes({ type: 'board' }).filter((board) => Boolean(meta(board))) || [];
  const current = () => boards().filter((board) => (meta(board)?.lane || 'current') === 'current');
  const reviews = () => boards().filter((board) => meta(board)?.lane === 'review');

  function currentMap() {
    const result = new Map();
    for (const board of current()) {
      const value = meta(board);
      fail(!result.has(value.elementId), `duplicate_current_board:${value.elementId}`);
      result.set(value.elementId, board);
    }
    return result;
  }

  const slot = (catalog, element) => ({
    x: catalog.mirror.origin.x + element.board.x,
    y: catalog.mirror.origin.y + element.board.y,
    width: element.board.width,
    height: element.board.height,
  });

  const sameSlot = (board, target) => ['x', 'y', 'width', 'height'].every((key) => Math.abs(board[key] - target[key]) < 0.5);

  async function threadMap(showResolved = true) {
    fail(penpot.currentPage, 'penpot_current_page_missing');
    const result = new Map();
    const threads = await penpot.currentPage.findCommentThreads({ onlyYours: false, showResolved });
    for (const thread of threads) {
      if (!thread.board?.id || (!showResolved && thread.resolved)) continue;
      const comments = (await thread.findComments())
        .map((comment) => ({ content: String(comment.content || '').trim() }))
        .filter((comment) => comment.content);
      if (!result.has(thread.board.id)) result.set(thread.board.id, []);
      result.get(thread.board.id).push({ seqNumber: thread.seqNumber, comments });
    }
    return result;
  }

  const commentCount = (map, board) => (map.get(board.id) || []).reduce((sum, thread) => sum + thread.comments.length, 0);

  function data(catalog, element, lane, extra = {}) {
    return {
      managedBy: OWNER,
      elementId: element.id,
      name: element.name,
      kind: element.kind,
      section: element.section,
      status: element.status,
      version: element.version,
      state: element.state,
      repository: catalog.repository,
      sourceRevision: element.sourceRevision,
      sourcePath: element.sourcePath,
      sourceUrl: element.sourceUrl,
      contentHash: element.contentHash,
      catalogRevision: catalog.catalogRevision,
      catalogSha: catalog.catalogSha,
      lane,
      targetSlot: slot(catalog, element),
      syncedAt: now(),
      ...extra,
    };
  }

  const metadataChanged = (value, catalog, element) =>
    value.catalogSha !== catalog.catalogSha || value.catalogRevision !== catalog.catalogRevision ||
    value.version !== element.version || value.state !== element.state ||
    value.sourceRevision !== element.sourceRevision || value.sourceUrl !== element.sourceUrl ||
    value.section !== element.section;

  async function plan(catalogInput, loadMetrics = null) {
    const started = clock();
    const catalog = validate(catalogInput);
    const map = currentMap();
    const comments = await threadMap(true);
    const items = [];
    const wanted = new Set();

    for (const element of catalog.elements) {
      wanted.add(element.id);
      const board = map.get(element.id);
      if (!board) { items.push({ elementId: element.id, action: 'create', commentCount: 0 }); continue; }
      const value = meta(board);
      const count = commentCount(comments, board);
      if (value.contentHash !== element.contentHash) items.push({ elementId: element.id, action: count ? 'archive-replace' : 'replace', commentCount: count });
      else if (!sameSlot(board, slot(catalog, element))) items.push({ elementId: element.id, action: 'move', commentCount: count });
      else if (metadataChanged(value, catalog, element)) items.push({ elementId: element.id, action: 'metadata', commentCount: count });
      else items.push({ elementId: element.id, action: 'noop', commentCount: count });
    }

    for (const [elementId, board] of map) {
      if (wanted.has(elementId)) continue;
      const count = commentCount(comments, board);
      items.push({ elementId, action: count ? 'archive-remove' : 'remove', commentCount: count });
    }

    const summary = { create: 0, replace: 0, archive: 0, move: 0, metadata: 0, remove: 0, noop: 0 };
    for (const item of items) {
      if (item.action === 'create') summary.create += 1;
      if (item.action === 'replace') summary.replace += 1;
      if (item.action === 'archive-replace') { summary.replace += 1; summary.archive += 1; }
      if (item.action === 'move') summary.move += 1;
      if (item.action === 'metadata') summary.metadata += 1;
      if (item.action === 'remove') summary.remove += 1;
      if (item.action === 'archive-remove') { summary.remove += 1; summary.archive += 1; }
      if (item.action === 'noop') summary.noop += 1;
    }

    const result = {
      catalog, items, summary, loadMetrics,
      changeCount: items.filter((item) => item.action !== 'noop').length,
      totalCurrent: map.size,
      totalReview: reviews().length,
      inspectMs: Math.round(clock() - started),
    };
    send({ type: 'catalog-plan', ...result, catalog: undefined, loadMetrics: undefined });
    return result;
  }

  function newBoard(catalog, element, position, lane, extra = {}) {
    fail(penpot.currentPage, 'penpot_current_page_missing');
    const board = penpot.createBoard();
    board.name = `${element.section} · ${element.name}`;
    board.resize(element.board.width, element.board.height);
    board.x = position.x; board.y = position.y;
    board.fills = [{ fillColor: element.board.fill || '#F3EFE6' }];
    board.clipContent = true; board.showInViewMode = true;
    penpot.currentPage.root.appendChild(board);
    write(board, data(catalog, element, lane, extra));
    return board;
  }

  function addSvg(board, svg, name) {
    const shape = penpot.createShapeFromSvg(svg);
    fail(shape, `penpot_svg_import_failed:${name}`);
    shape.name = name;
    const sourceWidth = Math.max(Number(shape.width) || board.width, 1);
    const sourceHeight = Math.max(Number(shape.height) || board.height, 1);
    const scale = Math.min(board.width / sourceWidth, board.height / sourceHeight);
    const width = sourceWidth * scale;
    const height = sourceHeight * scale;
    shape.resize(width, height);
    shape.x = board.x + (board.width - width) / 2;
    shape.y = board.y + (board.height - height) / 2;
    shape.blocked = true;
    board.appendChild(shape);
    return shape;
  }

  async function populate(board, element) {
    if (element.payload.type === 'svg') { addSvg(board, element.payload.svg, `${element.id} · Git SVG`); return; }
    addSvg(board, element.payload.frameSvg, `${element.id} · image frame`);
    const image = await penpot.uploadMediaData(`${element.id}-${element.version}`, bytes(element.payload.bytesBase64), element.payload.mimeType);
    fail(image, `penpot_image_upload_failed:${element.id}`);
    const info = element.artifact.imageRect;
    const rectangle = penpot.createRectangle();
    rectangle.name = `${element.id} · product image`;
    rectangle.resize(info.width, info.height);
    rectangle.x = board.x + info.x; rectangle.y = board.y + info.y;
    rectangle.fills = [{ fillOpacity: 1, fillImage: image }];
    rectangle.blocked = true;
    board.appendChild(rectangle);
  }

  const stagedAt = (catalog, index, element) => ({
    x: catalog.mirror.stagingOrigin.x + (index % 5) * (element.board.width + 40),
    y: catalog.mirror.stagingOrigin.y + Math.floor(index / 5) * (Math.max(element.board.height, 300) + 40),
  });
  const trashAt = (catalog, index, board) => ({
    x: catalog.mirror.trashOrigin.x + (index % 4) * (board.width + 40),
    y: catalog.mirror.trashOrigin.y + Math.floor(index / 4) * (Math.max(board.height, 300) + 40),
  });
  const reviewAt = (catalog, index, board) => ({
    x: catalog.mirror.reviewOrigin.x + (index % (catalog.mirror.reviewColumns || 3)) * (board.width + (catalog.mirror.reviewGap || 60)),
    y: catalog.mirror.reviewOrigin.y + Math.floor(index / (catalog.mirror.reviewColumns || 3)) * (Math.max(board.height, 300) + (catalog.mirror.reviewGap || 60)),
  });

  const snapshot = (board) => ({ board, x: board.x, y: board.y, width: board.width, height: board.height, name: board.name, metadata: meta(board) });
  function restore(value) {
    value.board.x = value.x; value.board.y = value.y; value.board.resize(value.width, value.height); value.board.name = value.name;
    if (value.metadata) write(value.board, value.metadata);
  }

  function verify(catalog) {
    const map = currentMap();
    fail(map.size === catalog.elements.length, `current_count_mismatch:${map.size}:${catalog.elements.length}`);
    for (const element of catalog.elements) {
      const board = map.get(element.id);
      fail(board, `current_board_missing:${element.id}`);
      const value = meta(board);
      fail(value.contentHash === element.contentHash, `current_hash_mismatch:${element.id}`);
      fail(value.catalogSha === catalog.catalogSha, `current_catalog_sha_mismatch:${element.id}`);
      fail(sameSlot(board, slot(catalog, element)), `current_slot_mismatch:${element.id}`);
    }
  }

  async function apply(catalogInput, loadMetrics = {}) {
    const catalog = validate(catalogInput);
    const inspected = await plan(catalog, loadMetrics);
    if (!inspected.changeCount) {
      send({ type: 'sync-report', result: { created: 0, replaced: 0, archived: 0, moved: 0, removed: 0 }, metrics: { loadMs: loadMetrics.totalMs || 0, inspectMs: inspected.inspectMs, stageMs: 0, commitMs: 0 } });
      return;
    }

    const elements = new Map(catalog.elements.map((element) => [element.id, element]));
    const existing = currentMap();
    const staged = new Map();
    const old = [];
    const touched = new Set();
    const trash = [];
    const stageItems = inspected.items.filter((item) => ['create', 'replace', 'archive-replace'].includes(item.action));
    const stageStarted = clock();

    try {
      for (let index = 0; index < stageItems.length; index += 1) {
        const item = stageItems[index];
        const element = elements.get(item.elementId);
        const board = newBoard(catalog, element, stagedAt(catalog, index, element), 'staging', { stagedAt: now() });
        try { await populate(board, element); } catch (error) { board.remove(); throw error; }
        staged.set(item.elementId, board);
        if ((index + 1) % 10 === 0 || index + 1 === stageItems.length) status(`Staging: ${index + 1}/${stageItems.length} boards готовы.`);
      }
    } catch (error) {
      for (const board of staged.values()) try { board.remove(); } catch {}
      throw new Error(`staging_failed:${safe(error)}`);
    }

    const stageMs = Math.round(clock() - stageStarted);
    const commitStarted = clock();
    let reviewIndex = reviews().length;
    let trashIndex = 0;
    const result = { created: 0, replaced: 0, archived: 0, moved: 0, removed: 0 };

    try {
      for (const item of inspected.items) {
        if (['noop', 'create'].includes(item.action)) continue;
        const board = existing.get(item.elementId);
        fail(board, `existing_current_board_missing:${item.elementId}`);
        if (!touched.has(board.id)) { old.push(snapshot(board)); touched.add(board.id); }

        if (item.action === 'move') {
          const element = elements.get(item.elementId); const target = slot(catalog, element);
          board.x = target.x; board.y = target.y; board.resize(target.width, target.height);
          write(board, data(catalog, element, 'current', { retainedBoardId: board.id })); result.moved += 1;
        } else if (item.action === 'metadata') {
          const element = elements.get(item.elementId); write(board, data(catalog, element, 'current', { retainedBoardId: board.id }));
        } else if (item.action === 'archive-replace' || item.action === 'archive-remove') {
          const position = reviewAt(catalog, reviewIndex++, board); const value = meta(board);
          board.x = position.x; board.y = position.y; board.name = `REVIEW · ${value.name} · ${value.version}`;
          write(board, { ...value, lane: 'review', archivedAt: now(), archivedFromCatalogSha: value.catalogSha, archiveReason: item.action });
          result.archived += 1; if (item.action === 'archive-remove') result.removed += 1;
        } else {
          const position = trashAt(catalog, trashIndex++, board); const value = meta(board);
          board.x = position.x; board.y = position.y; write(board, { ...value, lane: 'trash', trashedAt: now(), trashReason: item.action });
          trash.push(board); if (item.action === 'remove') result.removed += 1;
        }
      }

      for (const item of stageItems) {
        const board = staged.get(item.elementId); const element = elements.get(item.elementId); const target = slot(catalog, element);
        board.x = target.x; board.y = target.y; board.resize(target.width, target.height); board.name = `${element.section} · ${element.name}`; board.blocked = true;
        write(board, data(catalog, element, 'current', { promotedAt: now(), replacedBoardId: existing.get(item.elementId)?.id || null }));
        if (item.action === 'create') result.created += 1; else result.replaced += 1;
      }
      verify(catalog);
    } catch (error) {
      for (const board of staged.values()) try { board.remove(); } catch {}
      for (const value of old.reverse()) try { restore(value); } catch {}
      throw new Error(`commit_rolled_back:${safe(error)}`);
    }

    for (const board of trash) board.remove();
    const commitMs = Math.round(clock() - commitStarted);
    const visible = current();
    if (visible.length) { penpot.selection = visible.slice(0, 12); penpot.viewport.zoomIntoView(visible); }
    send({ type: 'sync-report', result, metrics: { loadMs: loadMetrics.totalMs || 0, inspectMs: inspected.inspectMs, stageMs, commitMs } });
  }

  function boardFrom(shape) {
    let value = shape || null;
    while (value) { if (value.type === 'board' && meta(value)) return value; value = value.parent || null; }
    return null;
  }

  async function promptBoard() {
    for (const shape of penpot.selection || []) { const board = boardFrom(shape); if (board) return board; }
    const unresolved = await threadMap(false);
    const candidates = boards().filter((board) => (unresolved.get(board.id) || []).length);
    return candidates.length === 1 ? candidates[0] : null;
  }

  function render(template, values) {
    let text = template;
    for (const [key, value] of Object.entries(values)) text = text.replaceAll(`{{${key}}}`, String(value));
    fail(!/\{\{[a-zA-Z0-9_-]+\}\}/u.test(text), 'prompt_template_unresolved_placeholders');
    return text;
  }

  async function buildPrompt(catalogInput) {
    const catalog = validate(catalogInput);
    const board = await promptBoard(); fail(board, 'review_board_ambiguous_select_one');
    const value = meta(board); const unresolved = await threadMap(false); const threads = unresolved.get(board.id) || [];
    const lines = [];
    for (const thread of threads) for (const comment of thread.comments) lines.push(`${lines.length + 1}. [Penpot #${thread.seqNumber}] ${comment.content}`);
    const text = render(catalog.prompt.template, {
      repository: value.repository, elementId: value.elementId, sourceUrl: value.sourceUrl,
      sourceRevision: value.sourceRevision, elementVersion: value.version, state: value.state,
      catalogSha: value.catalogSha, lane: value.lane,
      comments: lines.length ? lines.join('\n') : catalog.prompt.noCommentsText,
    });
    send({ type: 'prompt', text, commentCount: lines.length, element: value });
  }

  penpot.ui.onMessage(async (message) => {
    if (!message || typeof message.type !== 'string') return;
    try {
      if (message.type === 'inspect-catalog') await plan(message.catalog, message.loadMetrics || null);
      if (message.type === 'apply-catalog') await apply(message.catalog, message.loadMetrics || {});
      if (message.type === 'build-prompt') await buildPrompt(message.catalog);
    } catch (error) { status(`Ошибка: ${safe(error)}`, 'error'); }
  });
})();
