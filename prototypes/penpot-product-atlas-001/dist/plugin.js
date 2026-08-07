(() => {
  'use strict';

  const REPOSITORY = 'onedayonemasterpiece/lovekgd-design-system';
  const ROOT_PATH = 'prototypes/penpot-product-atlas-001';
  const UI_URL = `https://cdn.jsdelivr.net/gh/${REPOSITORY}@main/${ROOT_PATH}/dist/ui.html`;
  const NS = 'lovekgd.productatlas.001';
  const OWNER = 'lovekgd-product-atlas-001';
  const FILE_KIND_KEY = 'file-kind';
  const FILE_KIND = 'product-atlas';
  const ELEMENT_KEY = 'element';
  const RESOURCE_GRAPH_NS = 'lovekgd.resourcegraph.004a';
  const RUNTIME_REVIEW_NS = 'lovekgd.runtime.003';
  const PAGE_SETTLE_MS = 260;

  const TOKENS = Object.freeze({
    canvas: '#fbf7ef',
    canvasSoft: '#f2e7d7',
    surface: '#fffdf8',
    surfaceStrong: '#ffffff',
    ink: '#221a14',
    copy: '#44362d',
    muted: '#6d6259',
    line: '#e1d3c2',
    brand: '#98401f',
    accent: '#0f766e',
    warning: '#a16207',
    danger: '#a92d2d',
    info: '#1f658d'
  });

  penpot.ui.open('LoveKGD Product Atlas · pilot 001', UI_URL, { width: 540, height: 820 });

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const now = () => new Date().toISOString();
  const send = (message) => penpot.ui.sendMessage(message);
  const fail = (condition, message) => { if (!condition) throw new Error(message); };
  const textValue = (value) => value == null ? '' : String(value);
  let operationActive = false;

  function status(title, text = '', kind = '') {
    send({ type: 'status', title, text, kind });
  }

  function progress(phase, completed, total, detail = '') {
    send({ type: 'progress', phase, completed, total, detail });
  }

  function allPages() {
    return penpot.currentFile?.pages || [];
  }

  function pageByName(name) {
    return allPages().find((page) => page.name === name) || null;
  }

  async function openPage(page) {
    fail(page?.id, 'page_missing');
    if (penpot.currentPage?.id !== page.id) {
      await penpot.openPage(page);
      await delay(PAGE_SETTLE_MS);
    }
    fail(penpot.currentPage?.id === page.id, `page_open_failed:${page.name}`);
  }

  function sharedGet(target, namespace, key) {
    try { return target?.getSharedPluginData(namespace, key) || ''; } catch { return ''; }
  }

  function sharedSet(target, namespace, key, value) {
    target?.setSharedPluginData(namespace, key, textValue(value));
  }

  function readMeta(board) {
    const raw = sharedGet(board, NS, ELEMENT_KEY);
    if (!raw) return null;
    try {
      const value = JSON.parse(raw);
      return value?.managedBy === OWNER ? value : null;
    } catch {
      return null;
    }
  }

  function writeMeta(board, value) {
    sharedSet(board, NS, ELEMENT_KEY, JSON.stringify(value));
    sharedSet(board, NS, 'managed', 'true');
    sharedSet(board, NS, FILE_KIND_KEY, FILE_KIND);
  }

  function withUndo(callback) {
    const begin = penpot.history?.undoBlockBegin;
    const finish = penpot.history?.undoBlockFinish;
    if (typeof begin !== 'function' || typeof finish !== 'function') return callback();
    const block = begin.call(penpot.history);
    try { return callback(); } finally { finish.call(penpot.history, block); }
  }

  function validateCatalog(catalog) {
    fail(catalog?.schemaVersion === 1, 'catalog_schema_unsupported');
    fail(catalog.catalogKind === 'lovekgd-product-atlas', 'wrong_catalog_kind');
    fail(/^[0-9a-f]{64}$/u.test(catalog.catalogSha256 || ''), 'catalog_sha_invalid');
    fail(Array.isArray(catalog.pages) && catalog.pages.length === 9, 'catalog_pages_invalid');
    fail(Array.isArray(catalog.elements) && catalog.elements.length > 0, 'catalog_elements_invalid');
    const pageIds = new Set(catalog.pages.map((page) => page.id));
    const ids = new Set();
    for (const element of catalog.elements) {
      fail(element.id && !ids.has(element.id), `duplicate_element:${element.id}`);
      ids.add(element.id);
      fail(pageIds.has(element.pageId), `unknown_page:${element.id}`);
      fail(Number.isFinite(element.slot?.x) && Number.isFinite(element.slot?.y), `slot_missing:${element.id}`);
      fail(Number.isFinite(element.slot?.width) && element.slot.width > 0, `width_missing:${element.id}`);
      fail(Number.isFinite(element.slot?.height) && element.slot.height > 0, `height_missing:${element.id}`);
    }
    return catalog;
  }

  function designSystemEvidence() {
    const uniqueDesignPages = new Set([
      '10 — Brand assets',
      '20 — Foundations',
      '25 — Iconography',
      '30 — Core UI resources',
      '40 — Announcements components',
      '50 — Product patterns',
      '60 — Page archetypes',
      '70 — Coverage and fragmentation',
      '90 — Evidence / desktop',
      '91 — Evidence / tablet',
      '92 — Evidence / mobile',
      '93 — Evidence / interaction and accessibility'
    ]);
    const reasons = [];
    for (const page of allPages()) {
      if (uniqueDesignPages.has(page.name)) reasons.push(`design_page:${page.name}`);
      if (sharedGet(page, RESOURCE_GRAPH_NS, 'managed') === 'true') reasons.push(`resource_graph_page:${page.name}`);
      let boards = [];
      try { boards = page.findShapes({ type: 'board' }); } catch {}
      for (const board of boards) {
        if (sharedGet(board, RESOURCE_GRAPH_NS, 'managed') === 'true') reasons.push(`resource_graph_board:${board.name}`);
        if (sharedGet(board, RUNTIME_REVIEW_NS, ELEMENT_KEY)) reasons.push(`runtime_review_board:${board.name}`);
      }
    }
    return reasons.slice(0, 12);
  }

  function productMarkers() {
    const markers = [];
    for (const page of allPages()) {
      if (sharedGet(page, NS, FILE_KIND_KEY) === FILE_KIND) markers.push(`page:${page.name}`);
      let boards = [];
      try { boards = page.findShapes({ type: 'board' }); } catch {}
      for (const board of boards) {
        if (sharedGet(board, NS, FILE_KIND_KEY) === FILE_KIND) markers.push(`board:${board.name}`);
      }
    }
    return markers;
  }

  function assertCorrectFile() {
    const designReasons = designSystemEvidence();
    if (designReasons.length) {
      const error = new Error(`wrong_file_kind:design-system:${designReasons.join(',')}`);
      error.code = 'WRONG_FILE_KIND';
      throw error;
    }
    return { initialized: productMarkers().length > 0 };
  }

  function managedBoards(page = null) {
    const pages = page ? [page] : allPages();
    const result = [];
    for (const current of pages) {
      let boards = [];
      try { boards = current.findShapes({ type: 'board' }); } catch {}
      for (const board of boards) {
        const meta = readMeta(board);
        if (meta) result.push({ page: current, board, meta });
      }
    }
    return result;
  }

  function currentMap() {
    const result = new Map();
    for (const record of managedBoards()) {
      if (record.meta.lane !== 'current') continue;
      fail(!result.has(record.meta.elementId), `duplicate_current:${record.meta.elementId}`);
      result.set(record.meta.elementId, record);
    }
    return result;
  }

  function contentHash(element) {
    const stable = JSON.stringify({
      kind: element.kind,
      title: element.title,
      subtitle: element.subtitle,
      body: element.body || [],
      relations: element.relations || [],
      sourceRefs: element.sourceRefs || [],
      statusFacets: element.statusFacets || {},
      severity: element.severity || null,
      problemType: element.problemType || null,
      matrix: element.matrix || null,
      stakeholderLane: element.stakeholderLane || null
    });
    let hash = 2166136261;
    for (let index = 0; index < stable.length; index += 1) {
      hash ^= stable.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }

  function sameSlot(board, slot) {
    return ['x', 'y', 'width', 'height'].every((key) => Math.abs(Number(board[key]) - Number(slot[key])) < 0.5);
  }

  async function commentThreads(showResolved = false) {
    const result = new Map();
    for (const page of allPages()) {
      let threads = [];
      try { threads = await page.findCommentThreads({ onlyYours: false, showResolved }); } catch {}
      for (const thread of threads) {
        if (!thread.board?.id || (!showResolved && thread.resolved)) continue;
        const comments = (await thread.findComments())
          .map((comment) => ({ content: textValue(comment.content).trim() }))
          .filter((comment) => comment.content);
        if (!comments.length) continue;
        if (!result.has(thread.board.id)) result.set(thread.board.id, []);
        result.get(thread.board.id).push({
          seqNumber: thread.seqNumber,
          resolved: Boolean(thread.resolved),
          pageName: page.name,
          comments
        });
      }
    }
    return result;
  }

  const commentCount = (threads, board) => (threads.get(board.id) || [])
    .reduce((sum, thread) => sum + thread.comments.length, 0);

  function createText(text, options = {}) {
    const shape = penpot.createText(textValue(text));
    fail(shape, 'text_create_failed');
    shape.name = options.name || textValue(text).slice(0, 64) || 'Text';
    shape.x = Number(options.x || 0);
    shape.y = Number(options.y || 0);
    shape.fontFamily = 'Inter';
    shape.fontSize = textValue(options.fontSize || 14);
    shape.fontWeight = textValue(options.fontWeight || 500);
    shape.lineHeight = textValue(options.lineHeight || '1.35');
    shape.growType = 'auto-height';
    shape.fills = [{ fillColor: options.color || TOKENS.ink, fillOpacity: options.opacity ?? 1 }];
    if (Number.isFinite(options.width) && Number.isFinite(options.height)) shape.resize(options.width, options.height);
    return shape;
  }

  function createRect(options = {}) {
    const shape = penpot.createRectangle();
    shape.name = options.name || 'Rectangle';
    shape.x = Number(options.x || 0);
    shape.y = Number(options.y || 0);
    shape.resize(Number(options.width || 100), Number(options.height || 100));
    shape.fills = [{ fillColor: options.fill || TOKENS.surface, fillOpacity: options.fillOpacity ?? 1 }];
    shape.strokes = options.stroke ? [{
      strokeColor: options.stroke,
      strokeOpacity: 1,
      strokeStyle: options.dashed ? 'dashed' : 'solid',
      strokeWidth: options.strokeWidth || 1,
      strokeAlignment: 'inner'
    }] : [];
    shape.borderRadius = Number(options.radius || 0);
    return shape;
  }

  function append(board, shape) {
    board.appendChild(shape);
    return shape;
  }

  function facetLabel(key, value) {
    return `${key}: ${value}`;
  }

  function facetColor(value) {
    if (['broken', 'missing', 'required'].includes(value)) return TOKENS.danger;
    if (['partial', 'hypothesis', 'insufficient_data', 'unknown', 'not_modeled'].includes(value)) return TOKENS.warning;
    if (['healthy', 'verified', 'released', 'accepted'].includes(value)) return TOKENS.accent;
    return TOKENS.info;
  }

  function problemStyle(element) {
    const colors = {
      product_gap: TOKENS.brand,
      coverage_gap: TOKENS.warning,
      runtime_incident: TOKENS.danger,
      evidence_gap: TOKENS.info,
      decision_gap: TOKENS.warning,
      design_drift: TOKENS.accent
    };
    return colors[element.problemType] || TOKENS.brand;
  }

  function createBoardForElement(page, catalog, element, lane = 'current') {
    const slot = element.slot;
    const board = penpot.createBoard();
    board.name = `${element.kind} · ${element.id}`;
    board.x = slot.x;
    board.y = slot.y;
    board.resize(slot.width, slot.height);
    board.clipContent = true;
    board.showInViewMode = true;
    board.fills = [{ fillColor: element.kind === 'problem' ? TOKENS.surfaceStrong : TOKENS.surface }];
    board.strokes = [{
      strokeColor: element.kind === 'problem' ? problemStyle(element) : TOKENS.line,
      strokeOpacity: 1,
      strokeStyle: 'solid',
      strokeWidth: element.kind === 'problem' ? 4 : 1,
      strokeAlignment: 'inner'
    }];
    board.borderRadius = element.kind === 'problem' ? 26 : 18;

    if (element.kind === 'problem') {
      append(board, createText(element.severity || 'M', {
        x: slot.x + slot.width - 64,
        y: slot.y + 22,
        fontSize: 20,
        fontWeight: 900,
        color: problemStyle(element),
        width: 38,
        height: 30
      }));
    }

    append(board, createText(element.title || element.id, {
      x: slot.x + 26,
      y: slot.y + 24,
      fontSize: element.kind === 'overview' ? 30 : 19,
      fontWeight: 900,
      lineHeight: '1.15',
      color: TOKENS.ink,
      width: slot.width - 52 - (element.kind === 'problem' ? 54 : 0),
      height: element.kind === 'overview' ? 60 : 52
    }));

    let cursorY = slot.y + (element.kind === 'overview' ? 96 : 80);
    if (element.subtitle) {
      append(board, createText(element.subtitle, {
        x: slot.x + 26,
        y: cursorY,
        fontSize: 14,
        fontWeight: 500,
        color: TOKENS.muted,
        width: slot.width - 52,
        height: 54
      }));
      cursorY += 58;
    }

    const facets = Object.entries(element.statusFacets || {});
    if (facets.length) {
      let cursorX = slot.x + 26;
      let rowY = cursorY;
      for (const [key, value] of facets) {
        const label = facetLabel(key, value);
        const width = Math.min(210, Math.max(110, label.length * 7 + 24));
        if (cursorX + width > slot.x + slot.width - 26) {
          cursorX = slot.x + 26;
          rowY += 34;
        }
        append(board, createRect({
          x: cursorX,
          y: rowY,
          width,
          height: 27,
          fill: TOKENS.surfaceStrong,
          stroke: facetColor(value),
          strokeWidth: 2,
          radius: 999
        }));
        append(board, createText(label, {
          x: cursorX + 10,
          y: rowY + 4,
          fontSize: 11,
          fontWeight: 700,
          color: TOKENS.ink,
          width: width - 20,
          height: 18
        }));
        cursorX += width + 8;
      }
      cursorY = rowY + 42;
    }

    if (element.matrix) {
      const columns = element.matrix.columns || [];
      const rows = element.matrix.rows || [];
      const tableX = slot.x + 26;
      const tableY = cursorY;
      const tableW = slot.width - 52;
      const colW = tableW / Math.max(1, columns.length);
      const rowH = 62;
      columns.forEach((column, index) => {
        append(board, createRect({ x: tableX + index * colW, y: tableY, width: colW, height: rowH, fill: TOKENS.canvasSoft, stroke: TOKENS.line }));
        append(board, createText(column, { x: tableX + index * colW + 8, y: tableY + 10, width: colW - 16, height: 42, fontSize: 12, fontWeight: 700 }));
      });
      rows.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const value = textValue(cell);
          const color = value.toLowerCase() === 'unknown' ? TOKENS.warning : value === 'N/A' ? TOKENS.muted : TOKENS.ink;
          append(board, createRect({
            x: tableX + colIndex * colW,
            y: tableY + (rowIndex + 1) * rowH,
            width: colW,
            height: rowH,
            fill: colIndex === 0 ? TOKENS.surfaceStrong : TOKENS.surface,
            stroke: TOKENS.line
          }));
          append(board, createText(value, {
            x: tableX + colIndex * colW + 8,
            y: tableY + (rowIndex + 1) * rowH + 14,
            width: colW - 16,
            height: 36,
            fontSize: 12,
            fontWeight: colIndex === 0 ? 700 : 500,
            color
          }));
        });
      });
    } else {
      for (const line of element.body || []) {
        append(board, createText(`• ${line}`, {
          x: slot.x + 26,
          y: cursorY,
          fontSize: 13,
          fontWeight: 500,
          color: TOKENS.copy,
          width: slot.width - 52,
          height: 30
        }));
        cursorY += 30;
      }
    }

    const footerParts = [];
    if (element.stakeholderLane) footerParts.push(`lane: ${element.stakeholderLane}`);
    if ((element.relations || []).length) footerParts.push(`links: ${element.relations.join(', ')}`);
    if ((element.sourceRefs || []).length) footerParts.push(`sources: ${element.sourceRefs.join(' · ')}`);
    if (footerParts.length && slot.height > 220) {
      append(board, createText(footerParts.join('\n'), {
        x: slot.x + 26,
        y: slot.y + slot.height - 62,
        fontSize: 10,
        fontWeight: 500,
        color: TOKENS.muted,
        width: slot.width - 52,
        height: 46
      }));
    }

    writeMeta(board, {
      managedBy: OWNER,
      fileKind: FILE_KIND,
      catalogKind: catalog.catalogKind,
      catalogRevision: catalog.catalogRevision,
      catalogSha256: catalog.catalogSha256,
      sourceRepository: catalog.source.repository,
      sourceRevision: catalog.source.revision,
      elementId: element.id,
      entityType: element.kind,
      title: element.title,
      pageId: element.pageId,
      stakeholderLane: element.stakeholderLane || null,
      relations: element.relations || [],
      sourceRefs: element.sourceRefs || [],
      statusFacets: element.statusFacets || {},
      problemType: element.problemType || null,
      severity: element.severity || null,
      contentHash: contentHash(element),
      lane,
      syncedAt: now()
    });
    return board;
  }

  function ensurePages(catalog) {
    const result = new Map();
    for (const definition of catalog.pages) {
      let page = pageByName(definition.name);
      if (!page) {
        page = penpot.createPage();
        page.name = definition.name;
      }
      sharedSet(page, NS, 'managed', 'true');
      sharedSet(page, NS, FILE_KIND_KEY, FILE_KIND);
      sharedSet(page, NS, 'page-id', definition.id);
      sharedSet(page, NS, 'catalog-sha', catalog.catalogSha256);
      result.set(definition.id, page);
    }
    return result;
  }

  async function inspect(catalogInput) {
    const catalog = validateCatalog(catalogInput);
    let guard;
    try {
      guard = assertCorrectFile();
    } catch (error) {
      send({ type: 'plan', guardError: textValue(error.message), changeCount: 0 });
      throw error;
    }
    const current = currentMap();
    const wanted = new Set();
    const threads = await commentThreads(false);
    const actions = [];
    for (const element of catalog.elements) {
      wanted.add(element.id);
      const record = current.get(element.id);
      const hash = contentHash(element);
      if (!record) actions.push({ elementId: element.id, action: 'create', comments: 0 });
      else if (record.meta.contentHash !== hash) actions.push({ elementId: element.id, action: commentCount(threads, record.board) ? 'archive-replace' : 'replace', comments: commentCount(threads, record.board) });
      else if (!sameSlot(record.board, element.slot)) actions.push({ elementId: element.id, action: 'move', comments: commentCount(threads, record.board) });
      else actions.push({ elementId: element.id, action: 'noop', comments: commentCount(threads, record.board) });
    }
    for (const [elementId, record] of current) {
      if (wanted.has(elementId)) continue;
      actions.push({ elementId, action: commentCount(threads, record.board) ? 'archive-remove' : 'remove', comments: commentCount(threads, record.board) });
    }
    const changeCount = actions.filter((item) => item.action !== 'noop').length;
    const result = { initialized: guard.initialized, changeCount, current: current.size, wanted: catalog.elements.length, actions };
    send({ type: 'plan', ...result });
    return { catalog, result, actions, threads };
  }

  function archiveSlot(index, board) {
    return { x: 10000 + (index % 3) * (board.width + 80), y: Math.floor(index / 3) * (Math.max(board.height, 300) + 80) };
  }

  async function apply(catalogInput) {
    if (operationActive) return status('Операция уже выполняется', '', 'error');
    operationActive = true;
    try {
      const inspected = await inspect(catalogInput);
      const catalog = inspected.catalog;
      const pageMap = ensurePages(catalog);
      const elements = new Map(catalog.elements.map((element) => [element.id, element]));
      const current = currentMap();
      const archivePage = pageMap.get('89-archive');
      let archiveIndex = managedBoards(archivePage).length;
      const result = { created: 0, replaced: 0, archived: 0, moved: 0, removed: 0, noop: 0 };
      let completed = 0;

      for (const action of inspected.actions) {
        completed += 1;
        progress('reconcile', completed, inspected.actions.length, `${action.action}: ${action.elementId}`);
        const element = elements.get(action.elementId);
        const record = current.get(action.elementId);
        if (action.action === 'noop') { result.noop += 1; continue; }
        if (action.action === 'move') {
          await openPage(record.page);
          withUndo(() => {
            record.board.x = element.slot.x;
            record.board.y = element.slot.y;
            record.board.resize(element.slot.width, element.slot.height);
            writeMeta(record.board, { ...record.meta, catalogSha256: catalog.catalogSha256, catalogRevision: catalog.catalogRevision, syncedAt: now() });
          });
          result.moved += 1;
          continue;
        }
        if (['archive-replace', 'archive-remove'].includes(action.action)) {
          await openPage(record.page);
          const target = archiveSlot(archiveIndex++, record.board);
          withUndo(() => {
            record.board.x = target.x;
            record.board.y = target.y;
            record.board.name = `[Archive] ${record.board.name}`;
            writeMeta(record.board, { ...record.meta, pageId: '89-archive', lane: 'archive', archivedAt: now(), supersededByCatalogSha: catalog.catalogSha256 });
          });
          await openPage(archivePage);
          try { archivePage.root.appendChild(record.board); } catch {}
          result.archived += 1;
        } else if (record && ['replace', 'remove'].includes(action.action)) {
          await openPage(record.page);
          withUndo(() => record.board.remove());
          if (action.action === 'remove') result.removed += 1;
        }
        if (['create', 'replace', 'archive-replace'].includes(action.action)) {
          const page = pageMap.get(element.pageId);
          await openPage(page);
          withUndo(() => createBoardForElement(page, catalog, element, 'current'));
          if (action.action === 'create') result.created += 1;
          else result.replaced += 1;
        }
      }

      const home = pageMap.get('00-executive');
      if (home) await openPage(home);
      send({ type: 'report', result });
    } catch (error) {
      status('Product Atlas update failed', textValue(error?.message || error), 'error');
    } finally {
      operationActive = false;
    }
  }

  function selectedManagedBoard() {
    let shape = penpot.selection?.[0] || null;
    while (shape && shape.type !== 'board') shape = shape.parent || null;
    return shape?.type === 'board' && readMeta(shape) ? shape : null;
  }

  async function buildPrompt(catalogInput) {
    const catalog = validateCatalog(catalogInput);
    assertCorrectFile();
    const selected = selectedManagedBoard();
    const threads = await commentThreads(false);
    const entries = [];
    for (const record of managedBoards()) {
      if (record.meta.lane !== 'current') continue;
      if (selected && record.board.id !== selected.id) continue;
      const boardThreads = threads.get(record.board.id) || [];
      const comments = boardThreads.flatMap((thread) => thread.comments.map((comment) => ({ seqNumber: thread.seqNumber, content: comment.content })));
      if (!comments.length) continue;
      entries.push({ pageName: record.page.name, meta: record.meta, comments });
    }
    entries.sort((a, b) => `${a.pageName}:${a.meta.elementId}`.localeCompare(`${b.pageName}:${b.meta.elementId}`, 'ru'));

    const lines = [
      '@GitHub onedayonemasterpiece/events-bot-new',
      '',
      '# Системный продуктовый review по комментариям Product Atlas',
      '',
      'Рассмотри все комментарии как одну связанную продуктовую систему. Не превращай каждый комментарий автоматически в отдельную UI-задачу.',
      '',
      'Сначала восстанови затронутые user/owner/future partner Jobs и outcomes, journeys, capabilities, scenarios и guardrails. Объедини дубли, выяви противоречия и общие причины. Отдели наблюдаемую проблему от предложенного решения.',
      '',
      `Product model source: ${catalog.source.repository}@${catalog.source.revision}`,
      `Product Atlas catalog: ${catalog.catalogRevision} (${catalog.catalogSha256})`,
      `Scope: ${selected ? `selected entity ${readMeta(selected).elementId}` : 'all unresolved comments on current Product Atlas boards'}`,
      '',
      '## Требуемый результат',
      '',
      '1. Сводная карта продуктовых проблем и сквозных тем.',
      '2. Дубли, противоречия и зависимости между комментариями.',
      '3. Затронутые Jobs, user outcomes, owner outcomes и будущие partner considerations.',
      '4. Варианты решений с trade-offs и рисками ложного пути.',
      '5. Последствия по слоям: product intent; UX/journey; UI/design system; implementation/enablers; acceptance/testing; statistics/measurement; documentation.',
      '6. Отдельный список решений, которые должен принять владелец продукта.',
      '7. Предложение analysis/decision records для events-bot-new с сохранением всех ссылок на Penpot threads.',
      '',
      'Не меняй production, не создавай GitHub Issues и не закрывай Penpot comments автоматически.',
      ''
    ];

    if (!entries.length) {
      lines.push('Незакрытых комментариев в выбранном scope нет.');
    }

    for (const entry of entries) {
      lines.push(
        `## [${entry.meta.entityType}] ${entry.meta.title || entry.meta.elementId}`,
        `Entity ID: ${entry.meta.elementId}`,
        `Penpot page: ${entry.pageName}`,
        `Stakeholder lane: ${entry.meta.stakeholderLane || 'not set'}`,
        `Relations: ${(entry.meta.relations || []).join(', ') || 'none'}`,
        `Status facets: ${JSON.stringify(entry.meta.statusFacets || {})}`,
        `Sources: ${(entry.meta.sourceRefs || []).join(' · ') || 'none'}`,
        `Problem type / severity: ${entry.meta.problemType || 'n/a'} / ${entry.meta.severity || 'n/a'}`,
        '',
        'Комментарии:'
      );
      entry.comments.forEach((comment, index) => lines.push(`${index + 1}. [Penpot #${comment.seqNumber}] ${comment.content}`));
      lines.push('');
    }

    send({
      type: 'prompt',
      text: lines.join('\n'),
      commentCount: entries.reduce((sum, entry) => sum + entry.comments.length, 0),
      entityCount: entries.length
    });
  }

  penpot.ui.onMessage(async (message) => {
    try {
      if (message?.type === 'plugin-ready') {
        try {
          const guard = assertCorrectFile();
          status('File guard passed', guard.initialized ? 'Product Atlas marker найден.' : 'Чистый файл: можно инициализировать Product Atlas.');
        } catch (error) {
          status('Неправильный Penpot-файл', textValue(error.message), 'error');
        }
        return;
      }
      if (message?.type === 'inspect-catalog') await inspect(message.catalog);
      if (message?.type === 'apply-catalog') await apply(message.catalog);
      if (message?.type === 'build-prompt') await buildPrompt(message.catalog);
    } catch (error) {
      status('Операция завершилась ошибкой', textValue(error?.message || error), 'error');
      operationActive = false;
    }
  });
})();
