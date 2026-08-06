(() => {
  'use strict';

  const UI_REVISION = '7520abb76967491ebdf21697c7970556caa4ff4d';
  const REPOSITORY = 'onedayonemasterpiece/lovekgd-design-system';
  const PROTOTYPE_PATH = 'prototypes/penpot-review-plugin-002a';
  const UI_URL = `https://raw.githack.com/${REPOSITORY}/${UI_REVISION}/${PROTOTYPE_PATH}/dist/ui.html`;
  const NAMESPACE = 'lovekgd.review';
  const ELEMENT_KEY = 'element';

  penpot.ui.open('LoveKGD Review · 002A.1', UI_URL, { width: 450, height: 720 });

  function send(message) {
    penpot.ui.sendMessage(message);
  }

  function status(text, kind = '') {
    send({ type: 'status', text, kind });
  }

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  function validateCatalog(catalog) {
    assert(catalog && typeof catalog === 'object', 'catalog_not_object');
    assert(catalog.schemaVersion === 2, 'catalog_schema_unsupported');
    assert(catalog.repository === REPOSITORY, 'catalog_repository_mismatch');
    assert(typeof catalog.catalogRevision === 'string' && catalog.catalogRevision, 'catalog_revision_missing');
    assert(Array.isArray(catalog.elements) && catalog.elements.length > 0, 'catalog_elements_missing');
    assert(catalog.prompt && typeof catalog.prompt.template === 'string', 'catalog_prompt_missing');
    for (const element of catalog.elements) {
      for (const key of ['id', 'name', 'version', 'state', 'sourceRevision', 'sourcePath', 'sourceUrl', 'contentHash', 'svg']) {
        assert(typeof element[key] === 'string' && element[key], `catalog_element_${key}_missing`);
      }
      assert(element.svg.includes('<svg') && element.svg.includes(element.id), `catalog_element_svg_invalid:${element.id}`);
      assert(element.board && Number.isFinite(element.board.width) && Number.isFinite(element.board.height), `catalog_element_board_invalid:${element.id}`);
    }
    return catalog;
  }

  function readBoardMetadata(board) {
    if (!board || board.type !== 'board') return null;
    const raw = board.getSharedPluginData(NAMESPACE, ELEMENT_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed.id === 'string' ? parsed : null;
    } catch {
      return null;
    }
  }

  function writeBoardMetadata(board, metadata) {
    board.setSharedPluginData(NAMESPACE, ELEMENT_KEY, JSON.stringify(metadata));
  }

  function boardFromShape(shape) {
    let current = shape || null;
    while (current) {
      if (current.type === 'board' && readBoardMetadata(current)) return current;
      current = current.parent || null;
    }
    return null;
  }

  function reviewBoardsOnCurrentPage() {
    const page = penpot.currentPage;
    if (!page) return [];
    return page.findShapes({ type: 'board' }).filter(board => Boolean(readBoardMetadata(board)));
  }

  function boardsForElement(elementId) {
    return reviewBoardsOnCurrentPage().filter(board => readBoardMetadata(board)?.id === elementId);
  }

  function parseVersion(value) {
    return String(value || '0.0.0').split('.').map(part => Number.parseInt(part, 10) || 0).slice(0, 3);
  }

  function compareVersions(left, right) {
    const a = parseVersion(left);
    const b = parseVersion(right);
    for (let index = 0; index < 3; index += 1) {
      if (a[index] !== b[index]) return a[index] - b[index];
    }
    return 0;
  }

  function newestBoard(boards) {
    return [...boards].sort((left, right) => compareVersions(
      readBoardMetadata(left)?.version,
      readBoardMetadata(right)?.version,
    )).at(-1) || null;
  }

  async function unresolvedThreadsOnCurrentPage() {
    const page = penpot.currentPage;
    assert(page, 'penpot_current_page_missing');
    return page.findCommentThreads({ onlyYours: false, showResolved: false });
  }

  async function allThreadsOnCurrentPage() {
    const page = penpot.currentPage;
    assert(page, 'penpot_current_page_missing');
    return page.findCommentThreads({ onlyYours: false, showResolved: true });
  }

  async function commentCountForBoard(board, includeResolved = true) {
    const threads = includeResolved ? await allThreadsOnCurrentPage() : await unresolvedThreadsOnCurrentPage();
    const matching = threads.filter(thread => thread.board?.id === board.id);
    let total = 0;
    for (const thread of matching) {
      total += (await thread.findComments()).length;
    }
    return total;
  }

  async function commentThreadsForBoard(board) {
    const threads = await unresolvedThreadsOnCurrentPage();
    const matching = threads.filter(thread => thread.board?.id === board.id && !thread.resolved);
    const result = [];
    for (const thread of matching) {
      const comments = await thread.findComments();
      result.push({
        seqNumber: thread.seqNumber,
        comments: comments
          .map(comment => ({ content: String(comment.content || '').trim() }))
          .filter(comment => comment.content),
      });
    }
    return result;
  }

  async function resolveReviewBoard() {
    for (const shape of penpot.selection || []) {
      const board = boardFromShape(shape);
      if (board) return board;
    }

    const boards = reviewBoardsOnCurrentPage();
    if (boards.length === 0) return null;
    if (boards.length === 1) return boards[0];

    const threads = await unresolvedThreadsOnCurrentPage();
    const commentedBoardIds = new Set(
      threads.filter(thread => !thread.resolved && thread.board?.id).map(thread => thread.board.id),
    );
    const commentedBoards = boards.filter(board => commentedBoardIds.has(board.id));
    if (commentedBoards.length === 1) return commentedBoards[0];

    const currentBoards = boards.filter(board => readBoardMetadata(board)?.revisionStatus === 'current');
    if (currentBoards.length === 1) return currentBoards[0];

    return null;
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
    const required = ['repository', 'elementId', 'sourceUrl', 'sourceRevision', 'elementVersion', 'state', 'comments'];
    let output = template;
    for (const key of required) {
      assert(Object.prototype.hasOwnProperty.call(values, key), `prompt_value_${key}_missing`);
      output = output.replaceAll(`{{${key}}}`, String(values[key]));
    }
    assert(!/\{\{[a-zA-Z0-9_-]+\}\}/u.test(output), 'prompt_template_has_unresolved_placeholders');
    return output;
  }

  async function inspectCatalog(catalogInput) {
    const catalog = validateCatalog(catalogInput);
    const items = [];
    for (const element of catalog.elements) {
      const boards = boardsForElement(element.id);
      const exact = boards.find(board => readBoardMetadata(board)?.contentHash === element.contentHash);
      const current = newestBoard(boards);
      items.push({
        elementId: element.id,
        targetVersion: element.version,
        currentVersion: current ? readBoardMetadata(current)?.version || null : null,
        action: exact ? 'noop' : current ? 'create-revision' : 'create',
        commentCount: current ? await commentCountForBoard(current, true) : 0,
      });
    }
    send({
      type: 'catalog-inspection',
      catalogRevision: catalog.catalogRevision,
      items,
    });
    return { catalog, items };
  }

  function metadataFromCatalog(catalog, element) {
    return {
      id: element.id,
      name: element.name,
      version: element.version,
      state: element.state,
      status: element.status,
      repository: catalog.repository,
      sourceRevision: element.sourceRevision,
      sourcePath: element.sourcePath,
      sourceUrl: element.sourceUrl,
      contentHash: element.contentHash,
      catalogRevision: catalog.catalogRevision,
      revisionStatus: 'current',
      artifactTransport: 'dynamic-git-catalog',
    };
  }

  function nextBoardPosition(elementId, element) {
    const siblings = boardsForElement(elementId);
    if (siblings.length > 0) {
      const rightmost = [...siblings].sort((left, right) => (left.x + left.width) - (right.x + right.width)).at(-1);
      return {
        x: rightmost.x + rightmost.width + (element.board.gap || 96),
        y: rightmost.y,
      };
    }

    const allBoards = reviewBoardsOnCurrentPage();
    if (allBoards.length === 0) return { x: 0, y: 0 };
    const bottom = Math.max(...allBoards.map(board => board.y + board.height));
    return { x: 0, y: bottom + (element.board.gap || 96) };
  }

  function createRevisionBoard(catalog, element) {
    const page = penpot.currentPage;
    assert(page, 'penpot_current_page_missing');
    const position = nextBoardPosition(element.id, element);
    const previousBoards = boardsForElement(element.id);

    const board = penpot.createBoard();
    board.name = `${element.name} · v${element.version}`;
    board.resize(element.board.width, element.board.height);
    board.x = position.x;
    board.y = position.y;
    board.fills = [{ fillColor: element.board.fill }];
    board.clipContent = true;
    board.showInViewMode = true;
    page.root.appendChild(board);

    const specimen = penpot.createShapeFromSvg(element.svg);
    if (!specimen) {
      board.remove();
      throw new Error(`penpot_svg_import_failed:${element.id}`);
    }
    specimen.name = `${element.id} · v${element.version} · Git specimen`;
    specimen.x = board.x;
    specimen.y = board.y;
    specimen.blocked = true;
    board.appendChild(specimen);
    for (const previous of previousBoards) {
      const metadata = readBoardMetadata(previous);
      if (metadata) writeBoardMetadata(previous, { ...metadata, revisionStatus: 'superseded' });
    }
    writeBoardMetadata(board, metadataFromCatalog(catalog, element));
    return board;
  }

  async function applyCatalog(catalogInput) {
    const { catalog, items } = await inspectCatalog(catalogInput);
    const created = [];
    for (const item of items) {
      if (item.action === 'noop') continue;
      const element = catalog.elements.find(candidate => candidate.id === item.elementId);
      assert(element, `catalog_element_not_found:${item.elementId}`);
      created.push(createRevisionBoard(catalog, element));
    }

    if (created.length > 0) {
      penpot.selection = created;
      penpot.viewport.zoomIntoView(created);
    }
    send({ type: 'catalog-applied', createdCount: created.length });
  }

  async function sendSelectionState() {
    const board = await resolveReviewBoard();
    if (!board) {
      send({ type: 'selection', element: null, commentCount: null });
      return;
    }
    const element = readBoardMetadata(board);
    const threads = await commentThreadsForBoard(board);
    const commentCount = threads.reduce((count, thread) => count + thread.comments.length, 0);
    send({ type: 'selection', element, commentCount });
  }

  async function buildPrompt(catalogInput) {
    const catalog = validateCatalog(catalogInput);
    const board = await resolveReviewBoard();
    assert(board, 'review_board_ambiguous_select_one');
    const metadata = readBoardMetadata(board);
    assert(metadata, 'review_board_metadata_missing');
    const threads = await commentThreadsForBoard(board);
    const comments = commentsText(threads, catalog.prompt.noCommentsText);
    const text = renderPrompt(catalog.prompt.template, {
      repository: metadata.repository,
      elementId: metadata.id,
      sourceUrl: metadata.sourceUrl,
      sourceRevision: metadata.sourceRevision,
      elementVersion: metadata.version,
      state: metadata.state,
      comments,
    });
    send({ type: 'prompt', text, commentCount: threads.length, element: metadata });
  }

  penpot.ui.onMessage(async message => {
    if (!message || typeof message.type !== 'string') return;
    try {
      if (message.type === 'request-state') await sendSelectionState();
      if (message.type === 'inspect-catalog') await inspectCatalog(message.catalog);
      if (message.type === 'apply-catalog') await applyCatalog(message.catalog);
      if (message.type === 'build-prompt') await buildPrompt(message.catalog);
    } catch (error) {
      const safeMessage = String(error?.message || error || 'unknown_error').slice(0, 260);
      status(`Ошибка: ${safeMessage}`, 'error');
    }
  });

  penpot.on('selectionchange', () => {
    sendSelectionState().catch(() => undefined);
  });
})();
