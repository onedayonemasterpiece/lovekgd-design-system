(() => {
  'use strict';

  const DATA_REVISION = '8109eaa0c0f8eee1060bc9bff280becb79aa5bca';
  const REPOSITORY = 'onedayonemasterpiece/lovekgd-design-system';
  const PROTOTYPE_PATH = 'prototypes/penpot-review-plugin';
  const BASE_URL = `https://cdn.jsdelivr.net/gh/${REPOSITORY}@${DATA_REVISION}/${PROTOTYPE_PATH}`;
  const UI_URL = `https://raw.githack.com/${REPOSITORY}/${DATA_REVISION}/${PROTOTYPE_PATH}/dist/ui.html`;
  const REVIEW_MANIFEST_URL = `${BASE_URL}/data/review-manifest.json`;
  const NAMESPACE = 'lovekgd.review';
  const ELEMENT_KEY = 'element';

  let cachedManifest = null;

  penpot.ui.open('LoveKGD Review', UI_URL, { width: 420, height: 650 });

  function send(message) {
    penpot.ui.sendMessage(message);
  }

  function status(text, kind = '') {
    send({ type: 'status', text, kind });
  }

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  function validateManifest(manifest) {
    assert(manifest && typeof manifest === 'object', 'git_manifest_not_object');
    assert(manifest.schemaVersion === 1, 'git_manifest_schema_unsupported');
    assert(manifest.repository === REPOSITORY, 'git_manifest_repository_mismatch');
    assert(typeof manifest.sourceRevision === 'string' && manifest.sourceRevision, 'git_manifest_revision_missing');
    assert(Array.isArray(manifest.elements) && manifest.elements.length === 1, 'git_manifest_requires_one_smoke_element');
    const element = manifest.elements[0];
    for (const key of ['id', 'name', 'version', 'state', 'sourcePath', 'sourceUrl']) {
      assert(typeof element[key] === 'string' && element[key], `git_element_${key}_missing`);
    }
    assert(element.board && Number.isFinite(element.board.width) && Number.isFinite(element.board.height), 'git_board_geometry_missing');
    assert(element.artifact && typeof element.artifact.path === 'string', 'git_artifact_path_missing');
    assert(manifest.prompt && typeof manifest.prompt.template === 'string', 'git_prompt_template_missing');
    return manifest;
  }

  async function loadManifest() {
    if (cachedManifest) return cachedManifest;
    const response = await fetch(REVIEW_MANIFEST_URL, { cache: 'no-store' });
    assert(response.ok, `git_manifest_http_${response.status}`);
    cachedManifest = validateManifest(await response.json());
    return cachedManifest;
  }

  function elementMetadata(manifest, element) {
    return {
      id: element.id,
      name: element.name,
      version: element.version,
      state: element.state,
      status: element.status,
      repository: manifest.repository,
      sourceRevision: manifest.sourceRevision,
      sourcePath: element.sourcePath,
      sourceUrl: element.sourceUrl,
      manifestUrl: REVIEW_MANIFEST_URL,
      artifactUrl: new URL(element.artifact.path, `${BASE_URL}/`).href
    };
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

  function boardFromShape(shape) {
    let current = shape || null;
    while (current) {
      if (current.type === 'board' && readBoardMetadata(current)) return current;
      current = current.parent || null;
    }
    return null;
  }

  function selectedReviewBoard() {
    for (const shape of penpot.selection || []) {
      const board = boardFromShape(shape);
      if (board) return board;
    }
    return null;
  }

  async function commentThreadsForBoard(board) {
    const page = penpot.currentPage;
    assert(page, 'penpot_current_page_missing');
    const threads = await page.findCommentThreads({ onlyYours: false, showResolved: false });
    const matching = threads.filter((thread) => thread.board?.id === board.id && !thread.resolved);
    const result = [];
    for (const thread of matching) {
      const comments = await thread.findComments();
      result.push({
        seqNumber: thread.seqNumber,
        comments: comments.map((comment) => ({
          content: String(comment.content || '').trim(),
          date: comment.date instanceof Date ? comment.date.toISOString() : String(comment.date || '')
        })).filter((comment) => comment.content)
      });
    }
    return result;
  }

  function commentsText(threads, noCommentsText) {
    if (!threads.length) return noCommentsText;
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

  async function sendSelectionState() {
    const board = selectedReviewBoard();
    if (!board) {
      send({ type: 'selection', element: null, commentCount: null });
      return;
    }
    const element = readBoardMetadata(board);
    let commentCount = null;
    try {
      const threads = await commentThreadsForBoard(board);
      commentCount = threads.reduce((count, thread) => count + thread.comments.length, 0);
    } catch {
      commentCount = null;
    }
    send({ type: 'selection', element, commentCount });
  }

  async function importFromGit() {
    const page = penpot.currentPage;
    assert(page, 'penpot_current_page_missing');
    const manifest = await loadManifest();
    const element = manifest.elements[0];
    const metadata = elementMetadata(manifest, element);

    const existing = page.findShapes({ type: 'board' })
      .find((shape) => readBoardMetadata(shape)?.id === element.id);
    if (existing) {
      penpot.selection = [existing];
      penpot.viewport.zoomIntoView([existing]);
      status('Specimen уже существует. Выбран существующий board; данные не перезаписаны.', 'ok');
      await sendSelectionState();
      return;
    }

    const artifactResponse = await fetch(metadata.artifactUrl, { cache: 'no-store' });
    assert(artifactResponse.ok, `git_artifact_http_${artifactResponse.status}`);
    const svg = await artifactResponse.text();
    assert(svg.includes('<svg') && svg.includes(element.id), 'git_artifact_contract_failed');

    const board = penpot.createBoard();
    board.name = element.name;
    board.resize(element.board.width, element.board.height);
    board.x = element.board.x;
    board.y = element.board.y;
    board.fills = [{ fillColor: element.board.fill }];
    board.clipContent = true;
    board.showInViewMode = true;
    page.root.appendChild(board);

    const specimen = penpot.createShapeFromSvg(svg);
    if (!specimen) {
      board.remove();
      throw new Error('penpot_svg_import_failed');
    }
    specimen.name = `${element.id} · Git specimen`;
    specimen.x = board.x;
    specimen.y = board.y;
    specimen.blocked = true;
    board.appendChild(specimen);
    board.setSharedPluginData(NAMESPACE, ELEMENT_KEY, JSON.stringify(metadata));

    penpot.selection = [board];
    penpot.viewport.zoomIntoView([board]);
    status('Specimen импортирован из Git. Теперь поставьте обычный Penpot-комментарий внутри board.', 'ok');
    await sendSelectionState();
  }

  async function buildPrompt() {
    const board = selectedReviewBoard();
    assert(board, 'select_review_board_first');
    const metadata = readBoardMetadata(board);
    assert(metadata, 'review_board_metadata_missing');
    const manifest = await loadManifest();
    const threads = await commentThreadsForBoard(board);
    const comments = commentsText(threads, manifest.prompt.noCommentsText);
    const text = renderPrompt(manifest.prompt.template, {
      repository: metadata.repository,
      elementId: metadata.id,
      sourceUrl: metadata.sourceUrl,
      sourceRevision: metadata.sourceRevision,
      elementVersion: metadata.version,
      state: metadata.state,
      comments
    });
    const commentCount = threads.reduce((count, thread) => count + thread.comments.length, 0);
    send({ type: 'prompt', text, commentCount, element: metadata });
  }

  penpot.ui.onMessage(async (message) => {
    if (!message || typeof message.type !== 'string') return;
    try {
      if (message.type === 'request-state') await sendSelectionState();
      if (message.type === 'import-from-git') await importFromGit();
      if (message.type === 'build-prompt') await buildPrompt();
    } catch (error) {
      const safeMessage = String(error?.message || error || 'unknown_error').slice(0, 240);
      status(`Ошибка: ${safeMessage}`, 'error');
    }
  });

  penpot.on('selectionchange', () => {
    sendSelectionState().catch(() => undefined);
  });
})();