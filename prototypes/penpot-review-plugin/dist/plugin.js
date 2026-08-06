(() => {
  'use strict';

  // Prototype 001b is self-contained after installation. The manifest and SVG
  // below are generated from, and validated against, the Git-tracked sources.
  /* GIT_MANIFEST_START */
  const GIT_MANIFEST = Object.freeze(
{
  "schemaVersion": 1,
  "repository": "onedayonemasterpiece/lovekgd-design-system",
  "sourceRevision": "b0748a1b1488c8c6d58a175962e634bab9ec05d2",
  "elements": [
    {
      "id": "core.button.smoke",
      "name": "Button / Primary / Smoke",
      "status": "experimental",
      "version": "0.0.1",
      "state": "default",
      "sourcePath": "prototypes/penpot-review-plugin/data/core.button.smoke.svg",
      "sourceUrl": "https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/b0748a1b1488c8c6d58a175962e634bab9ec05d2/prototypes/penpot-review-plugin/data/core.button.smoke.svg",
      "board": {
        "width": 720,
        "height": 420,
        "x": 0,
        "y": 0,
        "fill": "#F3EFE6"
      },
      "artifact": {
        "path": "data/core.button.smoke.svg",
        "width": 720,
        "height": 420
      }
    }
  ],
  "prompt": {
    "noCommentsText": "— незакрытых комментариев к выбранному board пока нет",
    "template": "@GitHub {{repository}}\n\nДоработай элемент `{{elementId}}` по незакрытым комментариям Penpot.\n\nИсточник элемента в Git:\n{{sourceUrl}}\n\nРевизия источника: `{{sourceRevision}}`\nВерсия элемента: `{{elementVersion}}`\nСостояние: `{{state}}`\n\nКомментарии:\n{{comments}}\n\nСначала сверяйся с указанным Git-источником; не восстанавливай элемент по памяти и не придумывай отсутствующие данные. Подготовь изменение в дизайн-системе и новый проверяемый preview. Production не обновляй без sign-off владельца продукта."
  }
}
  );
  /* GIT_MANIFEST_END */

  /* GIT_SVG_START */
  const GIT_SPECIMEN_SVG = String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420" role="img" aria-labelledby="title desc">
  <title id="title">Тестовый артефакт кнопки для Penpot review-plugin</title>
  <desc id="desc">Экспериментальный пример, источник которого хранится в Git. Не является утверждённым компонентом дизайн-системы.</desc>
  <rect width="720" height="420" rx="28" fill="#F3EFE6"/>
  <rect x="32" y="32" width="656" height="356" rx="20" fill="#FFFDF8" stroke="#D6D0C4"/>
  <text x="64" y="82" fill="#5D574F" font-family="Arial, sans-serif" font-size="14" font-weight="700" letter-spacing="1.4">LOVEKGD · PROTOTYPE 001</text>
  <text x="64" y="126" fill="#201D1A" font-family="Arial, sans-serif" font-size="26" font-weight="700">Button / Primary / Smoke</text>
  <text x="64" y="157" fill="#6E675F" font-family="Arial, sans-serif" font-size="15">Тестовый артефакт из Git — не утверждённый компонент</text>
  <rect x="64" y="202" width="232" height="58" rx="14" fill="#203B57"/>
  <text x="180" y="238" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="17" font-weight="700">Показать события</text>
  <line x1="64" y1="302" x2="656" y2="302" stroke="#DDD7CC"/>
  <text x="64" y="334" fill="#5D574F" font-family="Arial, sans-serif" font-size="13">ID: core.button.smoke</text>
  <text x="64" y="358" fill="#5D574F" font-family="Arial, sans-serif" font-size="13">Источник: prototypes/penpot-review-plugin/data/core.button.smoke.svg</text>
</svg>
`;
  /* GIT_SVG_END */

  const UI_REVISION = '8bdd0af766f889f32324e50d6678b9fbc4cca198';
  const REPOSITORY = 'onedayonemasterpiece/lovekgd-design-system';
  const PROTOTYPE_PATH = 'prototypes/penpot-review-plugin';
  const UI_URL = `https://raw.githack.com/${REPOSITORY}/${UI_REVISION}/${PROTOTYPE_PATH}/dist/ui.html`;
  const NAMESPACE = 'lovekgd.review';
  const ELEMENT_KEY = 'element';

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
    assert(manifest.prompt && typeof manifest.prompt.template === 'string', 'git_prompt_template_missing');
    assert(GIT_SPECIMEN_SVG.includes('<svg') && GIT_SPECIMEN_SVG.includes(element.id), 'git_artifact_contract_failed');
    return manifest;
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
      artifactTransport: 'embedded-git-snapshot'
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
        comments: comments
          .map((comment) => ({ content: String(comment.content || '').trim() }))
          .filter((comment) => comment.content)
      });
    }
    return result;
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
    const manifest = validateManifest(GIT_MANIFEST);
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

    const board = penpot.createBoard();
    board.name = element.name;
    board.resize(element.board.width, element.board.height);
    board.x = element.board.x;
    board.y = element.board.y;
    board.fills = [{ fillColor: element.board.fill }];
    board.clipContent = true;
    board.showInViewMode = true;
    page.root.appendChild(board);

    const specimen = penpot.createShapeFromSvg(GIT_SPECIMEN_SVG);
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
    status('Specimen импортирован из зафиксированного Git-снимка. Теперь поставьте обычный Penpot-комментарий внутри board.', 'ok');
    await sendSelectionState();
  }

  async function buildPrompt() {
    const board = selectedReviewBoard();
    assert(board, 'select_review_board_first');
    const metadata = readBoardMetadata(board);
    assert(metadata, 'review_board_metadata_missing');
    const manifest = validateManifest(GIT_MANIFEST);
    const threads = await commentThreadsForBoard(board);
    const text = renderPrompt(manifest.prompt.template, {
      repository: metadata.repository,
      elementId: metadata.id,
      sourceUrl: metadata.sourceUrl,
      sourceRevision: metadata.sourceRevision,
      elementVersion: metadata.version,
      state: metadata.state,
      comments: commentsText(threads, manifest.prompt.noCommentsText)
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
      status(`Ошибка: ${String(error?.message || error || 'unknown_error').slice(0, 240)}`, 'error');
    }
  });

  penpot.on('selectionchange', () => {
    sendSelectionState().catch(() => undefined);
  });
})();
