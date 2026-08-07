(() => {
  'use strict';

  const UI_SHA = '13fa03d0105fc66c7bb0ebc33cd20a55aed74805';
  const REPO = 'onedayonemasterpiece/lovekgd-design-system';
  const UI_URL = `https://raw.githack.com/${REPO}/${UI_SHA}/prototypes/penpot-as-is-runtime-003/dist/ui.html`;
  const NS = 'lovekgd.runtime.003';
  const KEY = 'element';
  const OWNER = 'lovekgd-runtime-mirror-003';
  const TECHNICAL_NS = 'lovekgd.mirror.002b';
  const TECHNICAL_KEY = 'element';

  penpot.ui.open('LoveKGD Runtime Review · 003', UI_URL, { width: 470, height: 770 });

  const now = () => new Date().toISOString();
  const clock = () => typeof performance === 'undefined' ? Date.now() : performance.now();
  const send = (message) => penpot.ui.sendMessage(message);
  const status = (text, kind = '') => send({ type: 'status', text, kind });
  const fail = (condition, message) => { if (!condition) throw new Error(message); };
  const safe = (error) => String(error?.message || error || 'unknown_error').slice(0, 420);

  function decode(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
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
    } catch { return null; }
  }

  const write = (board, value) => board.setSharedPluginData(NS, KEY, JSON.stringify(value));
  const allPages = () => penpot.currentFile?.pages || [];
  const pageByName = (name) => allPages().find((page) => page.name === name) || null;
  const pageDefinitionMap = (catalog) => new Map(catalog.pages.map((page) => [page.id, page]));

  function technicalBoards(page) {
    return page.findShapes({ type: 'board' }).filter((board) => Boolean(board.getSharedPluginData(TECHNICAL_NS, TECHNICAL_KEY)));
  }

  function renameTechnicalPage() {
    const existing = pageByName('99 — Technical tests');
    for (const page of allPages()) {
      if (technicalBoards(page).length === 0) continue;
      if (page.name === '99 — Technical tests') return page;
      if (!existing) {
        page.name = '99 — Technical tests';
        return page;
      }
      return page;
    }
    return existing;
  }

  function managedBoards(page) {
    return page.findShapes({ type: 'board' }).filter((board) => Boolean(meta(board)));
  }

  function currentRecords() {
    const records = new Map();
    for (const page of allPages()) {
      for (const board of managedBoards(page)) {
        const value = meta(board);
        if ((value.lane || 'current') !== 'current') continue;
        fail(!records.has(value.elementId), `duplicate_current_board:${value.elementId}`);
        records.set(value.elementId, { page, board, meta: value });
      }
    }
    return records;
  }

  function reviewRecords() {
    const result = [];
    for (const page of allPages()) {
      for (const board of managedBoards(page)) {
        const value = meta(board);
        if (value.lane === 'review') result.push({ page, board, meta: value });
      }
    }
    return result;
  }

  const targetSlot = (element) => ({ x: element.board.x, y: element.board.y, width: element.board.width, height: element.board.height });
  const sameSlot = (board, slot) => ['x', 'y', 'width', 'height'].every((key) => Math.abs(Number(board[key]) - Number(slot[key])) < 0.5);

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
        result.get(thread.board.id).push({ seqNumber: thread.seqNumber, resolved: Boolean(thread.resolved), comments, pageName: page.name });
      }
    }
    return result;
  }

  const commentCount = (map, board) => (map.get(board.id) || []).reduce((sum, thread) => sum + thread.comments.length, 0);

  function boardData(catalog, element, lane, pageId, extra = {}) {
    return {
      managedBy: OWNER,
      elementId: element.id,
      pageId,
      name: element.name,
      kind: element.kind,
      status: element.status,
      contentHash: element.artifact.sha256,
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
    return value.catalogSha !== catalog.catalogSha ||
      value.catalogRevision !== catalog.catalogRevision ||
      value.runtimeRevision !== catalog.source.revision ||
      value.sourceUrl !== element.source.url ||
      value.runtimePath !== element.source.runtimePath ||
      value.status !== element.status ||
      value.pageId !== element.pageId;
  }

  async function inspect(catalogInput, loadMetrics = {}) {
    const started = clock();
    const catalog = validate(catalogInput);
    renameTechnicalPage();
    const pageDefs = pageDefinitionMap(catalog);
    const current = currentRecords();
    const comments = await commentThreads(true);
    const items = [];
    const wanted = new Set();
    const existingPages = new Map(allPages().map((page) => [page.name, page]));

    for (const pageDef of catalog.pages) {
      if (!existingPages.has(pageDef.name)) items.push({ pageId: pageDef.id, pageName: pageDef.name, action: 'create-page', commentCount: 0 });
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
      items.push({ elementId, pageId: record.meta.pageId, pageName: record.page.name, action: count ? 'archive-remove' : 'remove', commentCount: count });
    }

    const summary = { pages: 0, create: 0, replace: 0, review: 0, relocate: 0, move: 0, metadata: 0, remove: 0, noop: 0 };
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

    const result = {
      catalog,
      items,
      summary,
      loadMetrics,
      changeCount: items.filter((item) => item.action !== 'noop').length,
      totalCurrent: current.size,
      totalReview: reviewRecords().length,
      pageCount: allPages().length,
      inspectMs: Math.round(clock() - started),
    };
    send({ type: 'catalog-plan', items, summary, changeCount: result.changeCount, totalCurrent: result.totalCurrent, totalReview: result.totalReview, pageCount: result.pageCount });
    return result;
  }

  function ensurePages(catalog) {
    renameTechnicalPage();
    const result = new Map();
    let created = 0;
    for (const pageDef of catalog.pages) {
      let page = pageByName(pageDef.name);
      if (!page) {
        page = penpot.createPage();
        page.name = pageDef.name;
        created += 1;
      }
      result.set(pageDef.id, page);
    }
    return { pages: result, created };
  }

  async function createBoardOnPage(page, catalog, element, lane, position, extra = {}) {
    await penpot.openPage(page);
    const board = penpot.createBoard();
    board.name = element.name;
    board.resize(element.board.width, element.board.height);
    board.x = position.x;
    board.y = position.y;
    board.clipContent = true;
    board.showInViewMode = true;
    board.fills = [{ fillColor: '#FFFFFF' }];
    page.root.appendChild(board);
    write(board, boardData(catalog, element, lane, element.pageId, extra));
    return board;
  }

  async function populate(board, element) {
    const image = await penpot.uploadMediaData(
      `${element.id}-${element.artifact.sha256.slice(0, 10)}`,
      decode(element.payload.bytesBase64),
      element.payload.mimeType,
    );
    fail(image, `penpot_image_upload_failed:${element.id}`);
    const rect = penpot.createRectangle();
    rect.name = `${element.id} · exact Git screenshot`;
    rect.resize(board.width, board.height);
    rect.x = board.x;
    rect.y = board.y;
    rect.fills = [{ fillOpacity: 1, fillImage: image }];
    rect.blocked = true;
    board.appendChild(rect);
    board.blocked = true;
  }

  function stagePosition(index, element) {
    return {
      x: 50000 + (index % 3) * (element.board.width + 80),
      y: Math.floor(index / 3) * (Math.max(element.board.height, 500) + 80),
    };
  }

  function reviewPosition(index, board) {
    return {
      x: 12000 + (index % 3) * (board.width + 80),
      y: Math.floor(index / 3) * (Math.max(board.height, 500) + 80),
    };
  }

  function trashPosition(index, board) {
    return { x: 70000 + (index % 3) * (board.width + 80), y: Math.floor(index / 3) * (Math.max(board.height, 500) + 80) };
  }

  const snapshot = (record) => ({ page: record.page, board: record.board, x: record.board.x, y: record.board.y, width: record.board.width, height: record.board.height, name: record.board.name, metadata: record.meta, blocked: record.board.blocked });
  function restore(value) {
    value.board.blocked = false;
    value.board.x = value.x;
    value.board.y = value.y;
    value.board.resize(value.width, value.height);
    value.board.name = value.name;
    value.board.blocked = value.blocked;
    write(value.board, value.metadata);
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
  }

  async function apply(catalogInput, loadMetrics = {}) {
    const catalog = validate(catalogInput);
    const inspected = await inspect(catalog, loadMetrics);
    if (!inspected.changeCount) {
      send({ type: 'sync-report', result: { pages: 0, created: 0, replaced: 0, reviewed: 0, moved: 0, removed: 0 }, metrics: { loadMs: loadMetrics.totalMs || 0, inspectMs: inspected.inspectMs, stageMs: 0, commitMs: 0 } });
      return;
    }

    const originalPage = penpot.currentPage;
    const ensured = ensurePages(catalog);
    const pageMap = ensured.pages;
    const elements = new Map(catalog.elements.map((element) => [element.id, element]));
    const existing = currentRecords();
    const stageActions = new Set(['create', 'replace', 'archive-replace', 'relocate', 'archive-relocate']);
    const stageItems = inspected.items.filter((item) => stageActions.has(item.action));
    const staged = new Map();
    const snapshots = [];
    const touched = new Set();
    const trash = [];
    const stageStarted = clock();

    try {
      for (let index = 0; index < stageItems.length; index += 1) {
        const item = stageItems[index];
        const element = elements.get(item.elementId);
        fail(element, `catalog_element_missing:${item.elementId}`);
        const page = pageMap.get(element.pageId);
        const board = await createBoardOnPage(page, catalog, element, 'staging', stagePosition(index, element), { stagedAt: now() });
        try { await populate(board, element); } catch (error) { board.remove(); throw error; }
        staged.set(item.elementId, { page, board });
        if ((index + 1) % 5 === 0 || index + 1 === stageItems.length) status(`Staging exact Git screenshot: ${index + 1}/${stageItems.length}.`);
      }
    } catch (error) {
      for (const item of staged.values()) try { item.board.remove(); } catch {}
      if (originalPage) await penpot.openPage(originalPage);
      throw new Error(`staging_failed:${safe(error)}`);
    }

    const stageMs = Math.round(clock() - stageStarted);
    const commitStarted = clock();
    let reviewIndex = reviewRecords().length;
    let trashIndex = 0;
    const result = { pages: ensured.created, created: 0, replaced: 0, reviewed: 0, moved: 0, removed: 0 };

    try {
      for (const item of inspected.items) {
        if (['noop', 'create-page', 'create'].includes(item.action)) continue;
        const record = existing.get(item.elementId);
        fail(record, `existing_board_missing:${item.elementId}`);
        if (!touched.has(record.board.id)) {
          snapshots.push(snapshot(record));
          touched.add(record.board.id);
        }
        record.board.blocked = false;

        if (item.action === 'move') {
          const element = elements.get(item.elementId);
          const target = targetSlot(element);
          record.board.x = target.x; record.board.y = target.y; record.board.resize(target.width, target.height);
          write(record.board, boardData(catalog, element, 'current', element.pageId));
          record.board.blocked = true;
          result.moved += 1;
          continue;
        }

        if (item.action === 'metadata') {
          const element = elements.get(item.elementId);
          write(record.board, boardData(catalog, element, 'current', element.pageId));
          record.board.blocked = true;
          result.moved += 1;
          continue;
        }

        if (['archive-replace', 'archive-relocate', 'archive-remove'].includes(item.action)) {
          const position = reviewPosition(reviewIndex++, record.board);
          record.board.x = position.x; record.board.y = position.y;
          record.board.name = `[Review] ${record.board.name}`;
          write(record.board, { ...record.meta, lane: 'review', archivedAt: now(), supersededByCatalogSha: catalog.catalogSha });
          record.board.blocked = true;
          result.reviewed += 1;
        } else {
          const position = trashPosition(trashIndex++, record.board);
          record.board.x = position.x; record.board.y = position.y;
          trash.push(record.board);
        }
        if (['replace', 'archive-replace', 'relocate', 'archive-relocate'].includes(item.action)) result.replaced += 1;
        if (['remove', 'archive-remove'].includes(item.action)) result.removed += 1;
      }

      for (const item of stageItems) {
        const element = elements.get(item.elementId);
        const stagedRecord = staged.get(item.elementId);
        fail(stagedRecord, `staged_board_missing:${item.elementId}`);
        await penpot.openPage(stagedRecord.page);
        const target = targetSlot(element);
        stagedRecord.board.blocked = false;
        stagedRecord.board.x = target.x; stagedRecord.board.y = target.y; stagedRecord.board.resize(target.width, target.height);
        stagedRecord.board.name = element.name;
        write(stagedRecord.board, boardData(catalog, element, 'current', element.pageId));
        stagedRecord.board.blocked = true;
        if (item.action === 'create') result.created += 1;
      }

      verify(catalog, pageMap);
      for (const board of trash) board.remove();
      const home = pageMap.get('00-system-map');
      if (home) await penpot.openPage(home);
    } catch (error) {
      for (const value of snapshots.reverse()) {
        try { await penpot.openPage(value.page); restore(value); } catch {}
      }
      for (const item of staged.values()) try { item.board.remove(); } catch {}
      if (originalPage) try { await penpot.openPage(originalPage); } catch {}
      throw new Error(`commit_rolled_back:${safe(error)}`);
    }

    send({
      type: 'sync-report',
      result,
      metrics: {
        loadMs: loadMetrics.totalMs || 0,
        inspectMs: inspected.inspectMs,
        stageMs,
        commitMs: Math.round(clock() - commitStarted),
      },
    });
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
    const pageNames = new Map(allPages().map((page) => [page.id, page.name]));
    const targetIds = selected ? new Set([selected.id]) : null;
    const entries = [];

    for (const page of allPages()) {
      for (const board of managedBoards(page)) {
        if (targetIds && !targetIds.has(board.id)) continue;
        const value = meta(board);
        const boardThreads = threads.get(board.id) || [];
        const comments = boardThreads.flatMap((thread) => thread.comments.map((comment) => ({ seqNumber: thread.seqNumber, content: comment.content })));
        if (!comments.length) continue;
        entries.push({ pageName: page.name, value, comments });
      }
    }

    const lines = ['@GitHub onedayonemasterpiece/lovekgd-design-system', '', 'Проведи review AS-IS runtime-артефактов из Penpot. Не восстанавливай интерфейс по памяти и не подменяй наблюдаемое состояние новым дизайном.', '', `Runtime source: onedayonemasterpiece/events-bot-new@${catalog.source.revision}`, `Catalog: ${catalog.catalogRevision} (${catalog.catalogSha})`, ''];
    if (!entries.length) lines.push('Незакрытых комментариев к выбранному элементу или current mirror нет.');
    for (const entry of entries) {
      lines.push(`## ${entry.value.elementId}`, `Penpot page: ${entry.pageName}`, `Source: ${entry.value.sourceUrl}`, `Runtime path: ${entry.value.runtimePath}`, `Viewport: ${entry.value.viewport?.id || 'unknown'}`, `Observed status: ${entry.value.status || 'observed'}`, '', 'Комментарии:');
      entry.comments.forEach((comment, index) => lines.push(`${index + 1}. [Penpot #${comment.seqNumber}] ${comment.content}`));
      lines.push('');
    }
    lines.push('Сначала проверь exact source revision и фактические consumers. Подготовь candidate-preview отдельно от AS-IS; production не обновляй без sign-off владельца продукта.');
    send({ type: 'prompt', text: lines.join('\n'), commentCount: entries.reduce((sum, entry) => sum + entry.comments.length, 0) });
  }

  penpot.ui.onMessage(async (message) => {
    try {
      if (message?.type === 'inspect-catalog') await inspect(message.catalog, message.loadMetrics || {});
      if (message?.type === 'apply-catalog') await apply(message.catalog, message.loadMetrics || {});
      if (message?.type === 'build-prompt') await buildPrompt(message.catalog);
    } catch (error) {
      status(safe(error), 'error');
    }
  });
})();
