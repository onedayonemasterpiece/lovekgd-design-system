(() => {
  'use strict';

  const UI_REVISION = '596a2f4836c66954d08073006460909a2a0864e3';
  const REPOSITORY = 'onedayonemasterpiece/lovekgd-design-system';
  const UI_URL = `https://raw.githack.com/${REPOSITORY}/${UI_REVISION}/prototypes/penpot-review-plugin-002b/dist/ui.html`;
  const NAMESPACE = 'lovekgd.mirror.002b';
  const ELEMENT_KEY = 'element';
  const MANAGED_BY = 'lovekgd-current-mirror-002b';

  penpot.ui.open('LoveKGD Review · 002B', UI_URL, { width: 470, height: 760 });

  const nowIso = () => new Date().toISOString();
  const monotonic = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

  function send(message) {
    penpot.ui.sendMessage(message);
  }

  function status(text, kind = '') {
    send({ type: 'status', text, kind });
  }

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  function safeMessage(error) {
    return String(error?.message || error || 'unknown_error').slice(0, 320);
  }

  function decodeBase64(value) {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes;
  }

  function validateCatalog(catalog) {
    assert(catalog && typeof catalog === 'object', 'catalog_not_object');
    assert(catalog.schemaVersion === 3, 'catalog_schema_unsupported');
    assert(catalog.repository === REPOSITORY, 'catalog_repository_mismatch');
    assert(catalog.mirror?.namespace === NAMESPACE, 'catalog_namespace_mismatch');
    assert(/^[0-9a-f]{40}$/u.test(catalog.catalogSha || ''), 'catalog_sha_invalid');
    assert(Array.isArray(catalog.elements) && catalog.elements.length >= 50, 'catalog_load_corpus_too_small');
    assert(catalog.prompt && typeof catalog.prompt.template === 'string', 'catalog_prompt_missing');

    const ids = new Set();
    for (const element of catalog.elements) {
      assert(typeof element.id === 'string' && element.id, 'element_id_missing');
      assert(!ids.has(element.id), `duplicate_catalog_element:${element.id}`);
      ids.add(element.id);
      assert(typeof element.contentHash === 'string' && element.contentHash, `content_hash_missing:${element.id}`);
      assert(element.board && Number.isFinite(element.board.x) && Number.isFinite(element.board.y), `board_slot_missing:${element.id}`);
      assert(element.payload && ['svg', 'image'].includes(element.payload.type), `payload_missing:${element.id}`);
      if (element.payload.type === 'svg') assert(typeof element.payload.svg === 'string' && element.payload.svg.includes('<svg'), `svg_payload_invalid:${element.id}`);
      if (element.payload.type === 'image') {
        assert(typeof element.payload.bytesBase64 === 'string' && element.payload.bytesBase64, `image_bytes_missing:${element.id}`);
        assert(typeof element.payload.mimeType === 'string' && element.payload.mimeType.startsWith('image/'), `image_mime_invalid:${element.id}`);
        assert(typeof element.payload.frameSvg === 'string' && element.payload.frameSvg.includes('<svg'), `image_frame_invalid:${element.id}`);
      }
    }
    return catalog;
  }

  function readMetadata(board) {
    if (!board || board.type !== 'board') return null;
    const raw = board.getSharedPluginData(NAMESPACE, ELEMENT_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.managedBy !== MANAGED_BY || typeof parsed.elementId !== 'string') return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function writeMetadata(board, metadata) {
    board.setSharedPluginData(NAMESPACE, ELEMENT_KEY, JSON.stringify(metadata));
  }

  function managedBoards() {
    const page = penpot.currentPage;
    if (!page) return [];
    return page.findShapes({ type: 'board' }).filter((board) => Boolean(readMetadata(board)));
  }

  function currentBoards() {
    return managedBoards().filter((board) => (readMetadata(board)?.lane || 'current') === 'current');
  }

  function reviewBoards() {
    return managedBoards().filter((board) => readMetadata(board)?.lane === 'review');
  }

  function currentBoardMap() {
    const map = new Map();
    for (const board of currentBoards()) {
      const metadata = readMetadata(board);
      assert(metadata, 'managed_board_metadata_missing');
      assert(!map.has(metadata.elementId), `duplicate_current_board:${metadata.elementId}`);
      map.set(metadata.elementId, board);
    }
    return map;
  }

  function absoluteSlot(catalog, element) {
    return {
      x: catalog.mirror.origin.x + element.board.x,
      y: catalog.mirror.origin.y + element.board.y,
      width: element.board.width,
      height: element.board.height,
    };
  }

  function sameSlot(board, slot) {
    const epsilon = 0.5;
    return Math.abs(board.x - slot.x) < epsilon
      && Math.abs(board.y - slot.y) < epsilon
      && Math.abs(board.width - slot.width) < epsilon
      && Math.abs(board.height - slot.height) < epsilon;
  }

  async function commentsByBoard({ includeResolved = true } = {}) {
    const page = penpot.currentPage;
    assert(page, 'penpot_current_page_missing');
    const threads = await page.findCommentThreads({ onlyYours: false, showResolved: includeResolved });
    const map = new Map();
    for (const thread of threads) {
      const boardId = thread.board?.id;
      if (!boardId) continue;
      if (!includeResolved && thread.resolved) continue;
      const comments = await thread.findComments();
      const entries = comments
        .map((comment) => ({ content: String(comment.content || '').trim() }))
        .filter((comment) => comment.content);
      if (!map.has(boardId)) map.set(boardId, []);
      map.get(boardId).push({ seqNumber: thread.seqNumber, resolved: Boolean(thread.resolved), comments: entries });
    }
    return map;
  }

  function commentCount(threadMap, board) {
    return (threadMap.get(board.id) || []).reduce((total, thread) => total + thread.comments.length, 0);
  }

  function metadataFor(catalog, element, lane, extra = {}) {
    return {
      managedBy: MANAGED_BY,
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
      targetSlot: absoluteSlot(catalog, element),
      syncedAt: nowIso(),
      ...extra,
    };
  }

  function metadataNeedsRefresh(metadata, catalog, element) {
    return metadata.catalogSha !== catalog.catalogSha
      || metadata.catalogRevision !== catalog.catalogRevision
      || metadata.version !== element.version
      || metadata.state !== element.state
      || metadata.sourceRevision !== element.sourceRevision
      || metadata.sourceUrl !== element.sourceUrl
      || metadata.section !== element.section;
  }

  async function inspectCatalog(catalogInput, loadMetrics = null) {
    const started = monotonic();
    const catalog = validateCatalog(catalogInput);
    const currentMap = currentBoardMap();
    const threadMap = await commentsByBoard({ includeResolved: true });
    const items = [];
    const catalogIds = new Set();

    for (const element of catalog.elements) {
      catalogIds.add(element.id);
      const board = currentMap.get(element.id) || null;
      if (!board) {
        items.push({ elementId: element.id, action: 'create', commentCount: 0 });
        continue;
      }
      const metadata = readMetadata(board);
      const comments = commentCount(threadMap, board);
      const slot = absoluteSlot(catalog, element);
      if (metadata.contentHash !== element.contentHash) {
        items.push({ elementId: element.id, action: comments > 0 ? 'archive-replace' : 'replace', commentCount: comments });
      } else if (!sameSlot(board, slot)) {
        items.push({ elementId: element.id, action: 'move', commentCount: comments });
      } else if (metadataNeedsRefresh(metadata, catalog, element)) {
        items.push({ elementId: element.id, action: 'metadata', commentCount: comments });
      } else {
        items.push({ elementId: element.id, action: 'noop', commentCount: comments });
      }
    }

    for (const [elementId, board] of currentMap.entries()) {
      if (catalogIds.has(elementId)) continue;
      const comments = commentCount(threadMap, board);
      items.push({ elementId, action: comments > 0 ? 'archive-remove' : 'remove', commentCount: comments });
    }

    const summary = {
      create: 0, replace: 0, archive: 0, move: 0, metadata: 0, remove: 0, noop: 0,
    };
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

    const plan = {
      catalog,
      items,
      summary,
      changeCount: items.filter((item) => item.action !== 'noop').length,
      totalCurrent: currentMap.size,
      totalReview: reviewBoards().length,
      inspectMs: Math.round(monotonic() - started),
      loadMetrics,
    };

    send({
      type: 'catalog-plan',
      catalogRevision: catalog.catalogRevision,
      catalogSha: catalog.catalogSha,
      items,
      summary,
      changeCount: plan.changeCount,
      totalCurrent: plan.totalCurrent,
      totalReview: plan.totalReview,
      inspectMs: plan.inspectMs,
    });
    return plan;
  }

  function createBoardShell(catalog, element, position, lane, extraMetadata = {}) {
    const page = penpot.currentPage;
    assert(page, 'penpot_current_page_missing');
    const board = penpot.createBoard();
    board.name = `${element.section} · ${element.name}`;
    board.resize(element.board.width, element.board.height);
    board.x = position.x;
    board.y = position.y;
    board.fills = [{ fillColor: element.board.fill || '#F3EFE6' }];
    board.clipContent = true;
    board.showInViewMode = true;
    page.root.appendChild(board);
    writeMetadata(board, metadataFor(catalog, element, lane, extraMetadata));
    return board;
  }

  function appendSvg(board, svg, name) {
    const shape = penpot.createShapeFromSvg(svg);
    assert(shape, `penpot_svg_import_failed:${name}`);
    shape.name = name;
    shape.x = board.x;
    shape.y = board.y;
    shape.blocked = true;
    board.appendChild(shape);
    return shape;
  }

  async function populateBoard(board, element) {
    if (element.payload.type === 'svg') {
      appendSvg(board, element.payload.svg, `${element.id} · Git SVG`);
      return;
    }

    const bytes = decodeBase64(element.payload.bytesBase64);
    const image = await penpot.uploadMediaData(`${element.id}-${element.version}`, bytes, element.payload.mimeType);
    assert(image, `penpot_image_upload_failed:${element.id}`);
    const rectInfo = element.artifact.imageRect;
    const imageRect = penpot.createRectangle();
    imageRect.name = `${element.id} · product image`;
    imageRect.resize(rectInfo.width, rectInfo.height);
    imageRect.x = board.x + rectInfo.x;
    imageRect.y = board.y + rectInfo.y;
    imageRect.fills = [{ fillOpacity: 1, fillImage: image }];
    imageRect.blocked = true;
    board.appendChild(imageRect);
    appendSvg(board, element.payload.frameSvg, `${element.id} · image frame`);
  }

  function stagingPosition(catalog, index, element) {
    const columns = 5;
    const gap = 40;
    return {
      x: catalog.mirror.stagingOrigin.x + (index % columns) * (element.board.width + gap),
      y: catalog.mirror.stagingOrigin.y + Math.floor(index / columns) * (Math.max(element.board.height, 300) + gap),
    };
  }

  function trashPosition(catalog, index, board) {
    const columns = 4;
    const gap = 40;
    return {
      x: catalog.mirror.trashOrigin.x + (index % columns) * (board.width + gap),
      y: catalog.mirror.trashOrigin.y + Math.floor(index / columns) * (Math.max(board.height, 300) + gap),
    };
  }

  function reviewPosition(catalog, index, board) {
    const columns = catalog.mirror.reviewColumns || 3;
    const gap = catalog.mirror.reviewGap || 60;
    return {
      x: catalog.mirror.reviewOrigin.x + (index % columns) * (board.width + gap),
      y: catalog.mirror.reviewOrigin.y + Math.floor(index / columns) * (Math.max(board.height, 300) + gap),
    };
  }

  function snapshotBoard(board) {
    return {
      board,
      x: board.x,
      y: board.y,
      width: board.width,
      height: board.height,
      name: board.name,
      metadata: readMetadata(board),
    };
  }

  function restoreSnapshot(snapshot) {
    const { board } = snapshot;
    board.x = snapshot.x;
    board.y = snapshot.y;
    board.resize(snapshot.width, snapshot.height);
    board.name = snapshot.name;
    if (snapshot.metadata) writeMetadata(board, snapshot.metadata);
  }

  function planElementMap(catalog) {
    return new Map(catalog.elements.map((element) => [element.id, element]));
  }

  function verifyCurrentMirror(catalog) {
    const map = currentBoardMap();
    assert(map.size === catalog.elements.length, `current_count_mismatch:${map.size}:${catalog.elements.length}`);
    for (const element of catalog.elements) {
      const board = map.get(element.id);
      assert(board, `current_board_missing:${element.id}`);
      const metadata = readMetadata(board);
      assert(metadata.contentHash === element.contentHash, `current_hash_mismatch:${element.id}`);
      assert(metadata.catalogSha === catalog.catalogSha, `current_catalog_sha_mismatch:${element.id}`);
      assert(sameSlot(board, absoluteSlot(catalog, element)), `current_slot_mismatch:${element.id}`);
    }
  }

  async function applyCatalog(catalogInput, loadMetrics = {}) {
    const catalog = validateCatalog(catalogInput);
    const plan = await inspectCatalog(catalog, loadMetrics);
    if (plan.changeCount === 0) {
      send({
        type: 'sync-report',
        result: { created: 0, replaced: 0, archived: 0, moved: 0, removed: 0 },
        metrics: { loadMs: loadMetrics.totalMs || 0, inspectMs: plan.inspectMs, stageMs: 0, commitMs: 0 },
      });
      return;
    }

    const elements = planElementMap(catalog);
    const currentMap = currentBoardMap();
    const staged = new Map();
    const snapshots = [];
    const trash = [];
    const touched = new Set();
    const stageStarted = monotonic();

    const stageItems = plan.items.filter((item) => ['create', 'replace', 'archive-replace'].includes(item.action));
    try {
      for (let index = 0; index < stageItems.length; index += 1) {
        const item = stageItems[index];
        const element = elements.get(item.elementId);
        assert(element, `catalog_element_missing:${item.elementId}`);
        const position = stagingPosition(catalog, index, element);
        const board = createBoardShell(catalog, element, position, 'staging', { stagedAt: nowIso() });
        try {
          await populateBoard(board, element);
        } catch (error) {
          board.remove();
          throw error;
        }
        staged.set(item.elementId, board);
        if ((index + 1) % 10 === 0 || index === stageItems.length - 1) {
          status(`Staging: ${index + 1}/${stageItems.length} boards готовы.`);
        }
      }
    } catch (error) {
      for (const board of staged.values()) {
        try { board.remove(); } catch { /* best effort */ }
      }
      throw new Error(`staging_failed:${safeMessage(error)}`);
    }

    const stageMs = Math.round(monotonic() - stageStarted);
    const commitStarted = monotonic();
    let reviewIndex = reviewBoards().length;
    let trashIndex = 0;
    const result = { created: 0, replaced: 0, archived: 0, moved: 0, removed: 0 };

    try {
      for (const item of plan.items) {
        if (item.action === 'noop' || item.action === 'create') continue;
        const board = currentMap.get(item.elementId);
        assert(board, `existing_current_board_missing:${item.elementId}`);
        if (!touched.has(board.id)) {
          snapshots.push(snapshotBoard(board));
          touched.add(board.id);
        }

        if (item.action === 'move') {
          const element = elements.get(item.elementId);
          const slot = absoluteSlot(catalog, element);
          board.x = slot.x;
          board.y = slot.y;
          board.resize(slot.width, slot.height);
          writeMetadata(board, metadataFor(catalog, element, 'current', { retainedBoardId: board.id }));
          result.moved += 1;
        } else if (item.action === 'metadata') {
          const element = elements.get(item.elementId);
          writeMetadata(board, metadataFor(catalog, element, 'current', { retainedBoardId: board.id }));
        } else if (item.action === 'archive-replace' || item.action === 'archive-remove') {
          const position = reviewPosition(catalog, reviewIndex++, board);
          const metadata = readMetadata(board);
          board.x = position.x;
          board.y = position.y;
          board.name = `REVIEW · ${metadata.name} · ${metadata.version}`;
          writeMetadata(board, {
            ...metadata,
            lane: 'review',
            archivedAt: nowIso(),
            archivedFromCatalogSha: metadata.catalogSha,
            archiveReason: item.action,
          });
          result.archived += 1;
          if (item.action === 'archive-remove') result.removed += 1;
        } else if (item.action === 'replace' || item.action === 'remove') {
          const position = trashPosition(catalog, trashIndex++, board);
          board.x = position.x;
          board.y = position.y;
          const metadata = readMetadata(board);
          writeMetadata(board, { ...metadata, lane: 'trash', trashedAt: nowIso(), trashReason: item.action });
          trash.push(board);
          if (item.action === 'remove') result.removed += 1;
        }
      }

      for (const item of stageItems) {
        const board = staged.get(item.elementId);
        const element = elements.get(item.elementId);
        const slot = absoluteSlot(catalog, element);
        board.x = slot.x;
        board.y = slot.y;
        board.resize(slot.width, slot.height);
        board.name = `${element.section} · ${element.name}`;
        board.blocked = true;
        writeMetadata(board, metadataFor(catalog, element, 'current', {
          promotedAt: nowIso(),
          replacedBoardId: currentMap.get(item.elementId)?.id || null,
        }));
        if (item.action === 'create') result.created += 1;
        else result.replaced += 1;
      }

      verifyCurrentMirror(catalog);
    } catch (error) {
      for (const board of staged.values()) {
        try { board.remove(); } catch { /* best effort */ }
      }
      for (const snapshot of snapshots.reverse()) {
        try { restoreSnapshot(snapshot); } catch { /* best effort */ }
      }
      throw new Error(`commit_rolled_back:${safeMessage(error)}`);
    }

    for (const board of trash) board.remove();
    const commitMs = Math.round(monotonic() - commitStarted);

    const visible = currentBoards();
    if (visible.length > 0) {
      penpot.selection = visible.slice(0, Math.min(visible.length, 12));
      penpot.viewport.zoomIntoView(visible);
    }

    send({
      type: 'sync-report',
      result,
      metrics: {
        loadMs: loadMetrics.totalMs || 0,
        inspectMs: plan.inspectMs,
        stageMs,
        commitMs,
      },
    });
  }

  function boardFromShape(shape) {
    let current = shape || null;
    while (current) {
      if (current.type === 'board' && readMetadata(current)) return current;
      current = current.parent || null;
    }
    return null;
  }

  async function resolvePromptBoard() {
    for (const shape of penpot.selection || []) {
      const board = boardFromShape(shape);
      if (board) return board;
    }
    const unresolved = await commentsByBoard({ includeResolved: false });
    const candidates = managedBoards().filter((board) => (unresolved.get(board.id) || []).length > 0);
    return candidates.length === 1 ? candidates[0] : null;
  }

  function commentsText(threads, noCommentsText) {
    const lines = [];
    for (const thread of threads) {
      for (const comment of thread.comments) {
        lines.push(`${lines.length + 1}. [Penpot #${thread.seqNumber}] ${comment.content}`);
      }
    }
    return lines.length ? lines.join('\n') : noCommentsText;
  }

  function renderPrompt(template, values) {
    let result = template;
    for (const [key, value] of Object.entries(values)) result = result.replaceAll(`{{${key}}}`, String(value));
    assert(!/\{\{[a-zA-Z0-9_-]+\}\}/u.test(result), 'prompt_template_unresolved_placeholders');
    return result;
  }

  async function buildPrompt(catalogInput) {
    const catalog = validateCatalog(catalogInput);
    const board = await resolvePromptBoard();
    assert(board, 'review_board_ambiguous_select_one');
    const metadata = readMetadata(board);
    assert(metadata, 'review_board_metadata_missing');
    const unresolved = await commentsByBoard({ includeResolved: false });
    const threads = unresolved.get(board.id) || [];
    const text = renderPrompt(catalog.prompt.template, {
      repository: metadata.repository,
      elementId: metadata.elementId,
      sourceUrl: metadata.sourceUrl,
      sourceRevision: metadata.sourceRevision,
      elementVersion: metadata.version,
      state: metadata.state,
      catalogSha: metadata.catalogSha,
      lane: metadata.lane,
      comments: commentsText(threads, catalog.prompt.noCommentsText),
    });
    send({
      type: 'prompt',
      text,
      commentCount: threads.reduce((total, thread) => total + thread.comments.length, 0),
      element: metadata,
    });
  }

  penpot.ui.onMessage(async (message) => {
    if (!message || typeof message.type !== 'string') return;
    try {
      if (message.type === 'inspect-catalog') await inspectCatalog(message.catalog, message.loadMetrics || null);
      if (message.type === 'apply-catalog') await applyCatalog(message.catalog, message.loadMetrics || {});
      if (message.type === 'build-prompt') await buildPrompt(message.catalog);
    } catch (error) {
      status(`Ошибка: ${safeMessage(error)}`, 'error');
    }
  });
})();
