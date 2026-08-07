(() => {
  'use strict';

  const UI_SHA = '8cf3c007c462a20bdc252d5685adf3d4dfe54c23';
  const REPOSITORY = 'onedayonemasterpiece/lovekgd-design-system';
  const UI_URL = `https://raw.githack.com/${REPOSITORY}/${UI_SHA}/prototypes/penpot-as-is-runtime-0032/dist/ui.html`;
  const NS = 'lovekgd.runtime.003';
  const KEY = 'element';
  const OWNER = 'lovekgd-runtime-mirror-003';
  const TECHNICAL_NS = 'lovekgd.mirror.002b';
  const TECHNICAL_KEY = 'element';
  const CHECKPOINT_KEY = 'lovekgd.runtime.0032.checkpoint';

  const MAX_UPLOAD_ATTEMPTS = 3;
  const PAGE_SETTLE_MS = 550;
  const BOARD_SETTLE_MS = 90;
  const UPLOAD_SETTLE_MS = 140;
  const BATCH_SETTLE_MS = 420;
  const MUTATION_BATCH_SIZE = 4;

  penpot.ui.open('LoveKGD Runtime Review · 003.2', UI_URL, { width: 520, height: 840 });

  const now = () => new Date().toISOString();
  const clock = () => typeof performance === 'undefined' ? Date.now() : performance.now();
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const send = (message) => penpot.ui.sendMessage(message);
  const status = (text, kind = '') => send({ type: 'status', text, kind });
  const progress = (value) => {
    checkpoint(value);
    send({ type: 'sync-progress', ...value });
  };
  const fail = (condition, message) => { if (!condition) throw new Error(message); };

  let operationActive = false;

  function normalize(value, depth = 0, seen = new WeakSet()) {
    if (value == null || ['string', 'number', 'boolean'].includes(typeof value)) return value;
    if (typeof value === 'bigint') return String(value);
    if (typeof value === 'function') return `[function ${value.name || 'anonymous'}]`;
    if (depth > 4) return '[depth-limit]';
    if (typeof value !== 'object') return String(value);
    if (seen.has(value)) return '[circular]';
    seen.add(value);
    if (Array.isArray(value)) return value.slice(0, 40).map((item) => normalize(item, depth + 1, seen));
    const result = {};
    const keys = new Set([
      ...Object.keys(value),
      ...Object.getOwnPropertyNames(value),
      'name', 'message', 'stack', 'type', 'code', 'status', 'hint', 'uri', 'data', 'cause', 'details',
    ]);
    for (const key of keys) {
      try {
        const item = value[key];
        if (item === undefined) continue;
        result[key] = key === 'stack' && typeof item === 'string'
          ? item.split('\n').slice(0, 12).join('\n')
          : normalize(item, depth + 1, seen);
      } catch (error) {
        result[key] = `[unreadable:${String(error?.message || error)}]`;
      }
    }
    return result;
  }

  function checkpoint(value) {
    try {
      const payload = {
        schemaVersion: 1,
        updatedAt: now(),
        penpotVersion: penpot.version || null,
        currentPage: penpot.currentPage?.name || null,
        ...value,
      };
      penpot.localStorage.setItem(CHECKPOINT_KEY, JSON.stringify(payload));
    } catch {}
  }

  function readCheckpoint() {
    try {
      const raw = penpot.localStorage.getItem(CHECKPOINT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function clearCheckpoint() {
    try { penpot.localStorage.setItem(CHECKPOINT_KEY, ''); } catch {}
  }

  function incidentId(context) {
    const phase = String(context.phase || 'unknown').replace(/[^a-z0-9-]+/giu, '-').slice(0, 30);
    const element = String(context.element?.id || 'none').replace(/[^a-z0-9-]+/giu, '-').slice(0, 42);
    return `${Date.now().toString(36)}-${phase}-${element}`;
  }

  function diagnostic(context, error) {
    const element = context.element || null;
    const payload = element?.payload || null;
    return {
      schemaVersion: 2,
      incidentId: incidentId(context),
      occurredAt: now(),
      phase: context.phase || 'unknown',
      operation: context.operation || null,
      index: context.index ?? null,
      total: context.total ?? null,
      attempt: context.attempt ?? null,
      maxAttempts: context.maxAttempts ?? null,
      syncRunId: context.syncRunId || null,
      lastCheckpoint: readCheckpoint(),
      element: element ? {
        id: element.id,
        name: element.name,
        pageId: element.pageId,
        kind: element.kind,
        status: element.status,
        source: element.source,
        artifact: element.artifact,
        board: element.board,
        transport: payload ? {
          mimeType: payload.mimeType,
          byteLength: payload.byteLength,
          sha256: payload.sha256,
          width: payload.width,
          height: payload.height,
          transformed: Boolean(payload.transformed),
          transformReason: payload.transformReason || null,
        } : null,
      } : null,
      catalog: context.catalog ? {
        revision: context.catalog.catalogRevision,
        sha: context.catalog.catalogSha,
        runtimeRevision: context.catalog.source?.revision,
        elementCount: context.catalog.elements?.length,
      } : null,
      penpot: {
        version: penpot.version || null,
        currentPage: penpot.currentPage?.name || null,
        currentPageId: penpot.currentPage?.id || null,
        pageCount: penpot.currentFile?.pages?.length || 0,
      },
      error: normalize(error),
    };
  }

  function reportDiagnostic(context, error) {
    const value = diagnostic(context, error);
    send({ type: 'diagnostic', diagnostic: value });
    return value;
  }

  function decode(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes;
  }

  function validate(catalog) {
    fail(catalog?.schemaVersion === 1, 'catalog_schema_unsupported');
    fail(catalog.contract?.mode === 'observed-as-is', 'catalog_mode_invalid');
    fail(/^[0-9a-f]{40}$/u.test(catalog.catalogSha || ''), 'catalog_sha_invalid');
    fail(/^[0-9a-f]{40}$/u.test(catalog.source?.revision || ''), 'runtime_sha_invalid');
    fail(Array.isArray(catalog.pages) && catalog.pages.length === 9, 'catalog_pages_invalid');
    fail(Array.isArray(catalog.elements) && catalog.elements.length >= 24, 'catalog_elements_invalid');
    const pageIds = new Set(catalog.pages.map((page) => page.id));
    const ids = new Set();
    for (const element of catalog.elements) {
      fail(element.id && !ids.has(element.id), `duplicate_catalog_element:${element.id}`);
      ids.add(element.id);
      fail(pageIds.has(element.pageId), `catalog_page_missing:${element.id}`);
      fail(element.payload?.type === 'image' && element.payload.bytesBase64, `payload_missing:${element.id}`);
      fail(element.payload.mimeType?.startsWith('image/'), `payload_mime:${element.id}`);
      fail(Number.isFinite(element.payload.byteLength) && element.payload.byteLength > 0, `payload_size:${element.id}`);
      fail(/^[0-9a-f]{64}$/u.test(element.payload.sha256 || ''), `payload_hash:${element.id}`);
      fail(Number.isFinite(element.board?.x) && Number.isFinite(element.board?.y), `slot_missing:${element.id}`);
      fail(Number.isFinite(element.board?.width) && element.board.width > 0, `width_missing:${element.id}`);
      fail(Number.isFinite(element.board?.height) && element.board.height > 0, `height_missing:${element.id}`);
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
    } catch {
      return null;
    }
  }

  const write = (board, value) => board.setSharedPluginData(NS, KEY, JSON.stringify(value));
  const allPages = () => penpot.currentFile?.pages || [];
  const pageByName = (name) => allPages().find((page) => page.name === name) || null;
  const pageDefinitionMap = (catalog) => new Map(catalog.pages.map((page) => [page.id, page]));

  function withUndoBlock(callback) {
    const blockId = penpot.history.undoBlockBegin();
    try {
      return callback();
    } finally {
      penpot.history.undoBlockFinish(blockId);
    }
  }

  async function safeOpenPage(page, context = {}) {
    fail(page?.id, 'page_missing');
    if (penpot.currentPage?.id === page.id) {
      await delay(40);
      return;
    }
    progress({
      phase: 'page-open',
      pageId: context.pageId || null,
      pageName: page.name,
      index: context.index ?? null,
      total: context.total ?? null,
      elementId: context.elementId || null,
    });
    await penpot.openPage(page);
    await delay(PAGE_SETTLE_MS);
    if (penpot.currentPage?.id !== page.id) {
      await delay(PAGE_SETTLE_MS);
    }
    fail(penpot.currentPage?.id === page.id, `page_open_not_settled:${page.name}`);
  }

  function technicalBoards(page) {
    return page.findShapes({ type: 'board' })
      .filter((board) => Boolean(board.getSharedPluginData(TECHNICAL_NS, TECHNICAL_KEY)));
  }

  function renameTechnicalPage() {
    const existing = pageByName('99 — Technical tests');
    for (const page of allPages()) {
      if (technicalBoards(page).length === 0) continue;
      if (page.name === '99 — Technical tests') return page;
      if (!existing) {
        withUndoBlock(() => { page.name = '99 — Technical tests'; });
        return page;
      }
      return page;
    }
    return existing;
  }

  function managedBoards(page) {
    return page.findShapes({ type: 'board' }).filter((board) => Boolean(meta(board)));
  }

  function recordsByLane(lane) {
    const result = [];
    for (const page of allPages()) {
      for (const board of managedBoards(page)) {
        const value = meta(board);
        if ((value.lane || 'current') === lane) result.push({ page, board, meta: value });
      }
    }
    return result;
  }

  function currentRecords() {
    const result = new Map();
    for (const record of recordsByLane('current')) {
      fail(!result.has(record.meta.elementId), `duplicate_current_board:${record.meta.elementId}`);
      result.set(record.meta.elementId, record);
    }
    return result;
  }

  const reviewRecords = () => recordsByLane('review');
  const stagingRecords = () => recordsByLane('staging');
  const trashRecords = () => recordsByLane('trash');

  const targetSlot = (element) => ({
    x: element.board.x,
    y: element.board.y,
    width: element.board.width,
    height: element.board.height,
  });

  const sameSlot = (board, slot) => ['x', 'y', 'width', 'height']
    .every((key) => Math.abs(Number(board[key]) - Number(slot[key])) < 0.5);

  async function commentThreads(showResolved = true) {
    const result = new Map();
    for (const page of allPages()) {
      const threads = await page.findCommentThreads({ onlyYours: false, showResolved });
      for (const thread of threads) {
        if (!thread.board?.id || (!showResolved && thread.resolved)) continue;
        const comments = (await thread.findComments())
          .map((comment) => ({ content: String(comment.content || '').trim() }))
          .filter((comment) => comment.content);
        if (!result.has(thread.board.id)) result.set(thread.board.id, []);
        result.get(thread.board.id).push({
          seqNumber: thread.seqNumber,
          resolved: Boolean(thread.resolved),
          comments,
          pageName: page.name,
        });
      }
    }
    return result;
  }

  const commentCount = (map, board) => (map.get(board.id) || [])
    .reduce((sum, thread) => sum + thread.comments.length, 0);

  function boardData(catalog, element, lane, pageId, extra = {}) {
    return {
      managedBy: OWNER,
      elementId: element.id,
      pageId,
      name: element.name,
      kind: element.kind,
      status: element.status,
      contentHash: element.artifact.sha256,
      transportHash: element.payload.sha256,
      transportMimeType: element.payload.mimeType,
      transportByteLength: element.payload.byteLength,
      transportDimensions: { width: element.payload.width, height: element.payload.height },
      transportTransformed: Boolean(element.payload.transformed),
      catalogRevision: catalog.catalogRevision,
      catalogSha: catalog.catalogSha,
      runtimeRevision: catalog.source.revision,
      sourceUrl: element.source.url,
      runtimePath: element.source.runtimePath,
      selector: element.source.selector,
      viewport: element.source.viewport,
      lane,
      targetSlot: targetSlot(element),
      syncedAt: now(),
      ...extra,
    };
  }

  function metadataChanged(value, catalog, element) {
    return value.catalogSha !== catalog.catalogSha
      || value.catalogRevision !== catalog.catalogRevision
      || value.runtimeRevision !== catalog.source.revision
      || value.sourceUrl !== element.source.url
      || value.runtimePath !== element.source.runtimePath
      || value.status !== element.status
      || value.pageId !== element.pageId
      || value.transportHash !== element.payload.sha256;
  }

  async function inspect(catalogInput, loadMetrics = {}) {
    const started = clock();
    const catalog = validate(catalogInput);
    const pageDefs = pageDefinitionMap(catalog);
    const current = currentRecords();
    const comments = await commentThreads(true);
    const items = [];
    const wanted = new Set();
    const existingPages = new Map(allPages().map((page) => [page.name, page]));

    for (const pageDef of catalog.pages) {
      if (!existingPages.has(pageDef.name)) {
        items.push({ pageId: pageDef.id, pageName: pageDef.name, action: 'create-page', commentCount: 0 });
      }
    }

    for (const element of catalog.elements) {
      wanted.add(element.id);
      const pageDef = pageDefs.get(element.pageId);
      const record = current.get(element.id);
      if (!record) {
        items.push({ elementId: element.id, pageId: element.pageId, pageName: pageDef.name, action: 'create', commentCount: 0 });
        continue;
      }
      const count = commentCount(comments, record.board);
      if (record.page.name !== pageDef.name) {
        items.push({ elementId: element.id, pageId: element.pageId, pageName: pageDef.name, action: count ? 'archive-relocate' : 'relocate', commentCount: count });
      } else if (record.meta.contentHash !== element.artifact.sha256) {
        items.push({ elementId: element.id, pageId: element.pageId, pageName: pageDef.name, action: count ? 'archive-replace' : 'replace', commentCount: count });
      } else if (!sameSlot(record.board, targetSlot(element))) {
        items.push({ elementId: element.id, pageId: element.pageId, pageName: pageDef.name, action: 'move', commentCount: count });
      } else if (metadataChanged(record.meta, catalog, element)) {
        items.push({ elementId: element.id, pageId: element.pageId, pageName: pageDef.name, action: 'metadata', commentCount: count });
      } else {
        items.push({ elementId: element.id, pageId: element.pageId, pageName: pageDef.name, action: 'noop', commentCount: count });
      }
    }

    for (const [elementId, record] of current) {
      if (wanted.has(elementId)) continue;
      const count = commentCount(comments, record.board);
      items.push({
        elementId,
        pageId: record.meta.pageId,
        pageName: record.page.name,
        action: count ? 'archive-remove' : 'remove',
        commentCount: count,
      });
    }

    const summary = {
      pages: 0, create: 0, replace: 0, review: 0, relocate: 0,
      move: 0, metadata: 0, remove: 0, noop: 0,
    };
    for (const item of items) {
      if (item.action === 'create-page') summary.pages += 1;
      if (item.action === 'create') summary.create += 1;
      if (['replace', 'archive-replace'].includes(item.action)) summary.replace += 1;
      if (['archive-replace', 'archive-relocate', 'archive-remove'].includes(item.action)) summary.review += 1;
      if (['relocate', 'archive-relocate'].includes(item.action)) summary.relocate += 1;
      if (item.action === 'move') summary.move += 1;
      if (item.action === 'metadata') summary.metadata += 1;
      if (['remove', 'archive-remove'].includes(item.action)) summary.remove += 1;
      if (item.action === 'noop') summary.noop += 1;
    }

    const interruptedStaging = stagingRecords().length;
    const result = {
      catalog,
      items,
      summary,
      loadMetrics,
      changeCount: items.filter((item) => item.action !== 'noop').length,
      totalCurrent: current.size,
      totalReview: reviewRecords().length,
      totalInterruptedStaging: interruptedStaging,
      pageCount: allPages().length,
      inspectMs: Math.round(clock() - started),
    };
    send({
      type: 'catalog-plan',
      items,
      summary,
      changeCount: result.changeCount,
      totalCurrent: result.totalCurrent,
      totalReview: result.totalReview,
      totalInterruptedStaging: interruptedStaging,
      pageCount: result.pageCount,
    });
    return result;
  }

  async function ensurePages(catalog, syncRunId) {
    renameTechnicalPage();
    const result = new Map();
    let created = 0;
    for (let index = 0; index < catalog.pages.length; index += 1) {
      const pageDef = catalog.pages[index];
      let page = pageByName(pageDef.name);
      if (!page) {
        progress({
          phase: 'create-page',
          index: index + 1,
          total: catalog.pages.length,
          pageId: pageDef.id,
          pageName: pageDef.name,
          syncRunId,
        });
        page = withUndoBlock(() => {
          const value = penpot.createPage();
          value.name = pageDef.name;
          return value;
        });
        created += 1;
        await delay(180);
      }
      result.set(pageDef.id, page);
    }
    return { pages: result, created };
  }

  async function removeRecordsSafely(records, phase, syncRunId) {
    if (!records.length) return 0;
    const groups = new Map();
    for (const record of records) {
      if (!groups.has(record.page.id)) groups.set(record.page.id, { page: record.page, records: [] });
      groups.get(record.page.id).records.push(record);
    }
    let removed = 0;
    for (const group of groups.values()) {
      await safeOpenPage(group.page, { phase, pageName: group.page.name, syncRunId });
      for (let offset = 0; offset < group.records.length; offset += MUTATION_BATCH_SIZE) {
        const chunk = group.records.slice(offset, offset + MUTATION_BATCH_SIZE);
        progress({
          phase,
          index: removed + 1,
          total: records.length,
          pageName: group.page.name,
          elementId: chunk[0]?.meta?.elementId || null,
          syncRunId,
        });
        withUndoBlock(() => {
          for (const record of chunk) record.board.remove();
        });
        removed += chunk.length;
        await delay(BATCH_SETTLE_MS);
      }
    }
    return removed;
  }

  async function cleanupInterruptedStaging(syncRunId) {
    const records = stagingRecords();
    if (!records.length) return 0;
    send({ type: 'staging-cleanup', count: records.length, state: 'started' });
    const removed = await removeRecordsSafely(records, 'cleanup-interrupted-staging', syncRunId);
    send({ type: 'staging-cleanup', count: removed, state: 'completed' });
    return removed;
  }

  async function uploadMedia(element, context) {
    const name = `${element.id}-${element.payload.sha256.slice(0, 12)}`;
    const bytes = decode(element.payload.bytesBase64);
    let lastError = null;
    for (let attempt = 1; attempt <= MAX_UPLOAD_ATTEMPTS; attempt += 1) {
      try {
        progress({
          phase: 'media-upload',
          index: context.index,
          total: context.total,
          attempt,
          maxAttempts: MAX_UPLOAD_ATTEMPTS,
          elementId: element.id,
          pageId: element.pageId,
          transportBytes: element.payload.byteLength,
          transportMimeType: element.payload.mimeType,
          transportDimensions: `${element.payload.width}×${element.payload.height}`,
          syncRunId: context.syncRunId,
        });
        const image = await penpot.uploadMediaData(name, bytes, element.payload.mimeType);
        fail(image, `penpot_image_upload_returned_null:${element.id}`);
        await delay(UPLOAD_SETTLE_MS);
        return image;
      } catch (error) {
        lastError = error;
        if (attempt >= MAX_UPLOAD_ATTEMPTS) break;
        progress({
          phase: 'media-upload-retry',
          index: context.index,
          total: context.total,
          attempt,
          maxAttempts: MAX_UPLOAD_ATTEMPTS,
          elementId: element.id,
          message: String(error?.message || error),
          syncRunId: context.syncRunId,
        });
        await delay(800 * (2 ** (attempt - 1)));
      }
    }
    const wrapped = new Error(`media_upload_failed:${element.id}`);
    wrapped.cause = lastError;
    wrapped.details = {
      name,
      mimeType: element.payload.mimeType,
      byteLength: element.payload.byteLength,
      width: element.payload.width,
      height: element.payload.height,
      transformed: Boolean(element.payload.transformed),
    };
    throw wrapped;
  }

  function stagePosition(index, element, action) {
    if (action === 'create') return targetSlot(element);
    return {
      x: 50000 + (index % 3) * (element.board.width + 80),
      y: Math.floor(index / 3) * (Math.max(element.board.height, 500) + 80),
      width: element.board.width,
      height: element.board.height,
    };
  }

  function reviewPosition(index, board) {
    return {
      x: 12000 + (index % 3) * (board.width + 80),
      y: Math.floor(index / 3) * (Math.max(board.height, 500) + 80),
    };
  }

  function trashPosition(index, board) {
    return {
      x: 70000 + (index % 3) * (board.width + 80),
      y: Math.floor(index / 3) * (Math.max(board.height, 500) + 80),
    };
  }

  function createBoardWithImage(page, catalog, element, image, lane, position, syncRunId, extra = {}) {
    fail(penpot.currentPage?.id === page.id, `wrong_active_page:${page.name}`);
    let board = null;
    try {
      return withUndoBlock(() => {
        board = penpot.createBoard();
        board.name = element.name;
        board.x = position.x;
        board.y = position.y;
        board.resize(position.width, position.height);
        board.clipContent = true;
        board.showInViewMode = true;
        board.fills = [{ fillColor: '#FFFFFF' }];

        const rect = penpot.createRectangle();
        rect.name = `${element.id} · verified runtime image`;
        rect.x = position.x;
        rect.y = position.y;
        rect.resize(position.width, position.height);
        rect.fills = [{ fillOpacity: 1, fillImage: image }];
        rect.blocked = true;
        board.appendChild(rect);

        write(board, boardData(catalog, element, lane, element.pageId, {
          syncRunId,
          ...extra,
        }));
        board.blocked = true;
        return board;
      });
    } catch (error) {
      try { board?.remove(); } catch {}
      throw error;
    }
  }

  const snapshot = (record) => ({
    page: record.page,
    board: record.board,
    x: record.board.x,
    y: record.board.y,
    width: record.board.width,
    height: record.board.height,
    name: record.board.name,
    metadata: record.meta,
    blocked: record.board.blocked,
  });

  function restore(value) {
    withUndoBlock(() => {
      value.board.blocked = false;
      value.board.x = value.x;
      value.board.y = value.y;
      value.board.resize(value.width, value.height);
      value.board.name = value.name;
      write(value.board, value.metadata);
      value.board.blocked = value.blocked;
    });
  }

  function verify(catalog, pages) {
    const records = currentRecords();
    fail(records.size === catalog.elements.length, `current_count_mismatch:${records.size}:${catalog.elements.length}`);
    for (const element of catalog.elements) {
      const record = records.get(element.id);
      fail(record, `current_board_missing:${element.id}`);
      const targetPage = pages.get(element.pageId);
      fail(record.page.id === targetPage.id, `current_page_mismatch:${element.id}`);
      fail(record.meta.contentHash === element.artifact.sha256, `current_hash_mismatch:${element.id}`);
      fail(record.meta.catalogSha === catalog.catalogSha, `current_catalog_sha_mismatch:${element.id}`);
      fail(sameSlot(record.board, targetSlot(element)), `current_slot_mismatch:${element.id}`);
    }
    fail(stagingRecords().length === 0, `staging_not_empty:${stagingRecords().length}`);
  }

  function groupItemsByPage(items, pageMap, elements) {
    const groups = new Map();
    for (const item of items) {
      const element = elements.get(item.elementId);
      const page = pageMap.get(element.pageId);
      if (!groups.has(page.id)) groups.set(page.id, { page, items: [] });
      groups.get(page.id).items.push(item);
    }
    return [...groups.values()];
  }

  async function apply(catalogInput, loadMetrics = {}) {
    if (operationActive) {
      status('operation_already_active', 'error');
      return;
    }
    operationActive = true;
    const syncRunId = `sync-${Date.now().toString(36)}`;
    const originalPage = penpot.currentPage;
    checkpoint({ phase: 'apply-start', syncRunId });

    try {
      const catalog = validate(catalogInput);
      await cleanupInterruptedStaging(syncRunId);
      const inspected = await inspect(catalog, loadMetrics);
      if (!inspected.changeCount) {
        clearCheckpoint();
        send({
          type: 'sync-report',
          result: { pages: 0, created: 0, replaced: 0, reviewed: 0, moved: 0, removed: 0, cleanedStaging: 0 },
          metrics: { loadMs: loadMetrics.totalMs || 0, inspectMs: inspected.inspectMs, uploadMs: 0, stageMs: 0, commitMs: 0 },
        });
        return;
      }

      const ensured = await ensurePages(catalog, syncRunId);
      const pageMap = ensured.pages;
      const elements = new Map(catalog.elements.map((element) => [element.id, element]));
      const existing = currentRecords();
      const stageActions = new Set(['create', 'replace', 'archive-replace', 'relocate', 'archive-relocate']);
      const stageItems = inspected.items.filter((item) => stageActions.has(item.action));
      const staged = new Map();
      const media = new Map();
      const snapshots = [];
      const touched = new Set();
      const trash = [];
      const result = {
        pages: ensured.created,
        created: 0,
        replaced: 0,
        reviewed: 0,
        moved: 0,
        removed: 0,
        cleanedStaging: inspected.totalInterruptedStaging || 0,
      };

      const uploadStarted = clock();
      for (let index = 0; index < stageItems.length; index += 1) {
        const item = stageItems[index];
        const element = elements.get(item.elementId);
        fail(element, `catalog_element_missing:${item.elementId}`);
        try {
          const image = await uploadMedia(element, {
            index: index + 1,
            total: stageItems.length,
            syncRunId,
          });
          media.set(element.id, image);
        } catch (error) {
          const value = reportDiagnostic({
            phase: 'media-upload',
            operation: item.action,
            index: index + 1,
            total: stageItems.length,
            element,
            catalog,
            syncRunId,
          }, error);
          error.__diagnosticSent = true;
          error.__incidentId = value.incidentId;
          throw error;
        }
      }
      const uploadMs = Math.round(clock() - uploadStarted);

      const stageStarted = clock();
      const stageGroups = groupItemsByPage(stageItems, pageMap, elements);
      let stageIndex = 0;
      try {
        for (let groupIndex = 0; groupIndex < stageGroups.length; groupIndex += 1) {
          const group = stageGroups[groupIndex];
          await safeOpenPage(group.page, {
            phase: 'staging-page',
            pageName: group.page.name,
            index: groupIndex + 1,
            total: stageGroups.length,
            syncRunId,
          });
          for (let localIndex = 0; localIndex < group.items.length; localIndex += 1) {
            const item = group.items[localIndex];
            const element = elements.get(item.elementId);
            const image = media.get(element.id);
            fail(image, `uploaded_media_missing:${element.id}`);
            stageIndex += 1;
            progress({
              phase: 'staging-shape',
              index: stageIndex,
              total: stageItems.length,
              elementId: element.id,
              pageId: element.pageId,
              pageName: group.page.name,
              syncRunId,
            });
            const position = stagePosition(stageIndex - 1, element, item.action);
            const board = createBoardWithImage(
              group.page,
              catalog,
              element,
              image,
              'staging',
              position,
              syncRunId,
              { stagedAt: now(), intendedAction: item.action },
            );
            staged.set(item.elementId, { page: group.page, board });
            await delay(BOARD_SETTLE_MS);
            if (stageIndex % MUTATION_BATCH_SIZE === 0) await delay(BATCH_SETTLE_MS);
          }
          await delay(PAGE_SETTLE_MS);
        }
      } catch (error) {
        if (!error.__diagnosticSent) {
          const item = stageItems[Math.max(0, stageIndex - 1)] || null;
          const element = item ? elements.get(item.elementId) : null;
          const value = reportDiagnostic({
            phase: 'staging-shape',
            operation: item?.action || null,
            index: stageIndex,
            total: stageItems.length,
            element,
            catalog,
            syncRunId,
          }, error);
          error.__incidentId = value.incidentId;
          error.__diagnosticSent = true;
        }
        await removeRecordsSafely(
          [...staged.values()].map((value) => ({
            page: value.page,
            board: value.board,
            meta: meta(value.board) || { elementId: 'unknown' },
          })),
          'cleanup-failed-staging',
          syncRunId,
        );
        throw error;
      }
      const stageMs = Math.round(clock() - stageStarted);

      const commitStarted = clock();
      let reviewIndex = reviewRecords().length;
      let trashIndex = 0;

      try {
        const existingItems = inspected.items.filter((item) => !['noop', 'create-page', 'create'].includes(item.action));
        const existingGroups = new Map();
        for (const item of existingItems) {
          const record = existing.get(item.elementId);
          fail(record, `existing_board_missing:${item.elementId}`);
          if (!existingGroups.has(record.page.id)) existingGroups.set(record.page.id, { page: record.page, items: [] });
          existingGroups.get(record.page.id).items.push({ item, record });
        }

        let existingIndex = 0;
        for (const group of existingGroups.values()) {
          await safeOpenPage(group.page, {
            phase: 'commit-existing-page',
            pageName: group.page.name,
            syncRunId,
          });
          for (const entry of group.items) {
            const { item, record } = entry;
            existingIndex += 1;
            progress({
              phase: 'commit-existing',
              index: existingIndex,
              total: existingItems.length,
              elementId: item.elementId,
              pageName: group.page.name,
              syncRunId,
            });
            if (!touched.has(record.board.id)) {
              snapshots.push(snapshot(record));
              touched.add(record.board.id);
            }
            const element = elements.get(item.elementId);
            withUndoBlock(() => {
              record.board.blocked = false;
              if (item.action === 'move') {
                const target = targetSlot(element);
                record.board.x = target.x;
                record.board.y = target.y;
                record.board.resize(target.width, target.height);
                write(record.board, boardData(catalog, element, 'current', element.pageId, { syncRunId }));
                record.board.blocked = true;
                result.moved += 1;
                return;
              }
              if (item.action === 'metadata') {
                write(record.board, boardData(catalog, element, 'current', element.pageId, { syncRunId }));
                record.board.blocked = true;
                result.moved += 1;
                return;
              }
              if (['archive-replace', 'archive-relocate', 'archive-remove'].includes(item.action)) {
                const position = reviewPosition(reviewIndex++, record.board);
                record.board.x = position.x;
                record.board.y = position.y;
                record.board.name = `[Review] ${record.board.name}`;
                write(record.board, {
                  ...record.meta,
                  lane: 'review',
                  archivedAt: now(),
                  supersededByCatalogSha: catalog.catalogSha,
                  syncRunId,
                });
                record.board.blocked = true;
                result.reviewed += 1;
              } else {
                const position = trashPosition(trashIndex++, record.board);
                record.board.x = position.x;
                record.board.y = position.y;
                write(record.board, {
                  ...record.meta,
                  lane: 'trash',
                  retiredAt: now(),
                  supersededByCatalogSha: catalog.catalogSha,
                  syncRunId,
                });
                record.board.blocked = true;
                trash.push({ page: record.page, board: record.board, meta: meta(record.board) });
              }
              if (['replace', 'archive-replace', 'relocate', 'archive-relocate'].includes(item.action)) result.replaced += 1;
              if (['remove', 'archive-remove'].includes(item.action)) result.removed += 1;
            });
            await delay(BOARD_SETTLE_MS);
            if (existingIndex % MUTATION_BATCH_SIZE === 0) await delay(BATCH_SETTLE_MS);
          }
          await delay(PAGE_SETTLE_MS);
        }

        const commitGroups = groupItemsByPage(stageItems, pageMap, elements);
        let commitIndex = 0;
        for (const group of commitGroups) {
          await safeOpenPage(group.page, {
            phase: 'commit-staging-page',
            pageName: group.page.name,
            syncRunId,
          });
          for (const item of group.items) {
            const element = elements.get(item.elementId);
            const stagedRecord = staged.get(item.elementId);
            fail(stagedRecord, `staged_board_missing:${item.elementId}`);
            commitIndex += 1;
            progress({
              phase: 'commit-staging',
              index: commitIndex,
              total: stageItems.length,
              elementId: element.id,
              pageName: group.page.name,
              syncRunId,
            });
            withUndoBlock(() => {
              stagedRecord.board.blocked = false;
              if (item.action !== 'create') {
                const target = targetSlot(element);
                stagedRecord.board.x = target.x;
                stagedRecord.board.y = target.y;
                stagedRecord.board.resize(target.width, target.height);
              }
              stagedRecord.board.name = element.name;
              write(stagedRecord.board, boardData(catalog, element, 'current', element.pageId, { syncRunId }));
              stagedRecord.board.blocked = true;
            });
            if (item.action === 'create') result.created += 1;
            await delay(BOARD_SETTLE_MS);
            if (commitIndex % MUTATION_BATCH_SIZE === 0) await delay(BATCH_SETTLE_MS);
          }
          await delay(PAGE_SETTLE_MS);
        }

        progress({
          phase: 'verify',
          index: catalog.elements.length,
          total: catalog.elements.length,
          syncRunId,
        });
        verify(catalog, pageMap);
        await removeRecordsSafely(trash, 'remove-retired', syncRunId);
        const home = pageMap.get('00-system-map');
        if (home) await safeOpenPage(home, { phase: 'open-system-map', syncRunId });
      } catch (error) {
        for (const value of snapshots.reverse()) {
          try {
            await safeOpenPage(value.page, { phase: 'rollback-existing', syncRunId });
            restore(value);
            await delay(BOARD_SETTLE_MS);
          } catch {}
        }
        const stagedToRemove = [];
        for (const value of staged.values()) {
          try {
            stagedToRemove.push({
              page: value.page,
              board: value.board,
              meta: meta(value.board) || { elementId: 'unknown' },
            });
          } catch {}
        }
        try { await removeRecordsSafely(stagedToRemove, 'rollback-staged', syncRunId); } catch {}
        if (originalPage) {
          try { await safeOpenPage(originalPage, { phase: 'rollback-original-page', syncRunId }); } catch {}
        }
        const value = reportDiagnostic({ phase: 'commit-verify', catalog, syncRunId }, error);
        const wrapped = new Error(`commit_rolled_back:${value.incidentId}`);
        wrapped.__diagnosticSent = true;
        throw wrapped;
      }

      clearCheckpoint();
      send({
        type: 'sync-report',
        result,
        metrics: {
          loadMs: loadMetrics.totalMs || 0,
          inspectMs: inspected.inspectMs,
          uploadMs,
          stageMs,
          commitMs: Math.round(clock() - commitStarted),
        },
      });
    } catch (error) {
      if (originalPage) {
        try { await safeOpenPage(originalPage, { phase: 'restore-original-page', syncRunId }); } catch {}
      }
      if (!error.__diagnosticSent) {
        const value = reportDiagnostic({ phase: 'apply', catalog: catalogInput, syncRunId }, error);
        error.__incidentId = value.incidentId;
      }
      status(String(error?.message || error).slice(0, 240), 'error');
    } finally {
      operationActive = false;
    }
  }

  function selectedBoard() {
    let shape = penpot.selection?.[0] || null;
    while (shape && shape.type !== 'board') shape = shape.parent || null;
    return shape?.type === 'board' && meta(shape) ? shape : null;
  }

  async function buildPrompt(catalogInput) {
    const catalog = validate(catalogInput);
    const selected = selectedBoard();
    const threads = await commentThreads(false);
    const targetIds = selected ? new Set([selected.id]) : null;
    const entries = [];

    for (const page of allPages()) {
      for (const board of managedBoards(page)) {
        if (targetIds && !targetIds.has(board.id)) continue;
        const value = meta(board);
        const boardThreads = threads.get(board.id) || [];
        const comments = boardThreads.flatMap((thread) => thread.comments
          .map((comment) => ({ seqNumber: thread.seqNumber, content: comment.content })));
        if (!comments.length) continue;
        entries.push({ pageName: page.name, value, comments });
      }
    }

    const lines = [
      '@GitHub onedayonemasterpiece/lovekgd-design-system',
      '',
      'Проведи review AS-IS runtime-артефактов из Penpot. Не восстанавливай интерфейс по памяти и не подменяй наблюдаемое состояние новым дизайном.',
      '',
      `Runtime source: onedayonemasterpiece/events-bot-new@${catalog.source.revision}`,
      `Catalog: ${catalog.catalogRevision} (${catalog.catalogSha})`,
      '',
    ];
    if (!entries.length) lines.push('Незакрытых комментариев к выбранному элементу или current mirror нет.');
    for (const entry of entries) {
      lines.push(
        `## ${entry.value.elementId}`,
        `Penpot page: ${entry.pageName}`,
        `Source: ${entry.value.sourceUrl}`,
        `Runtime path: ${entry.value.runtimePath}`,
        `Viewport: ${entry.value.viewport?.id || 'unknown'}`,
        `Observed status: ${entry.value.status || 'observed'}`,
        '',
        'Комментарии:',
      );
      entry.comments.forEach((comment, index) => lines.push(`${index + 1}. [Penpot #${comment.seqNumber}] ${comment.content}`));
      lines.push('');
    }
    lines.push('Сначала проверь exact source revision и фактические consumers. Подготовь candidate-preview отдельно от AS-IS; production не обновляй без sign-off владельца продукта.');
    send({
      type: 'prompt',
      text: lines.join('\n'),
      commentCount: entries.reduce((sum, entry) => sum + entry.comments.length, 0),
    });
  }

  penpot.ui.onMessage(async (message) => {
    try {
      if (message?.type === 'plugin-ready') {
        send({
          type: 'recovery-state',
          checkpoint: readCheckpoint(),
          penpotVersion: penpot.version || null,
          interruptedStaging: stagingRecords().length,
        });
        return;
      }
      if (message?.type === 'inspect-catalog') await inspect(message.catalog, message.loadMetrics || {});
      if (message?.type === 'apply-catalog') await apply(message.catalog, message.loadMetrics || {});
      if (message?.type === 'cleanup-staging') {
        const syncRunId = `cleanup-${Date.now().toString(36)}`;
        await cleanupInterruptedStaging(syncRunId);
        send({ type: 'cleanup-complete', remaining: stagingRecords().length });
      }
      if (message?.type === 'build-prompt') await buildPrompt(message.catalog);
    } catch (error) {
      if (!error.__diagnosticSent) {
        reportDiagnostic({ phase: `message:${message?.type || 'unknown'}`, catalog: message?.catalog }, error);
      }
      status(String(error?.message || error).slice(0, 240), 'error');
      operationActive = false;
    }
  });
})();