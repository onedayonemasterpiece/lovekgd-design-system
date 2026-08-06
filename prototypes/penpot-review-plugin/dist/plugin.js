(() => {
  'use strict';

  // Prototype 001 is intentionally self-contained after installation.
  // The two payloads below are exact UTF-8 snapshots of Git-tracked files:
  // - data/review-manifest.json
  // - data/core.button.smoke.svg
  // CI verifies byte-for-byte equality before the plugin can be accepted.
  const EMBEDDED_MANIFEST_BASE64 = 'ewogICJzY2hlbWFWZXJzaW9uIjogMSwKICAicmVwb3NpdG9yeSI6ICJvbmVkYXlvbmVtYXN0ZXJwaWVjZS9sb3Zla2dkLWRlc2lnbi1zeXN0ZW0iLAogICJzb3VyY2VSZXZpc2lvbiI6ICJiMDc0OGExYjE0ODhjOGM2ZDU4YTE3NTk2MmU2MzRiYWI5ZWMwNWQyIiwKICAiZWxlbWVudHMiOiBbCiAgICB7CiAgICAgICJpZCI6ICJjb3JlLmJ1dHRvbi5zbW9rZSIsCiAgICAgICJuYW1lIjogIkJ1dHRvbiAvIFByaW1hcnkgLyBTbW9rZSIsCiAgICAgICJzdGF0dXMiOiAiZXhwZXJpbWVudGFsIiwKICAgICAgInZlcnNpb24iOiAiMC4wLjEiLAogICAgICAic3RhdGUiOiAiZGVmYXVsdCIsCiAgICAgICJzb3VyY2VQYXRoIjogInByb3RvdHlwZXMvcGVucG90LXJldmlldy1wbHVnaW4vZGF0YS9jb3JlLmJ1dHRvbi5zbW9rZS5zdmciLAogICAgICAic291cmNlVXJsIjogImh0dHBzOi8vZ2l0aHViLmNvbS9vbmVkYXlvbmVtYXN0ZXJwaWVjZS9sb3Zla2dkLWRlc2lnbi1zeXN0ZW0vYmxvYi9iMDc0OGExYjE0ODhjOGM2ZDU4YTE3NTk2MmU2MzRiYWI5ZWMwNWQyL3Byb3RvdHlwZXMvcGVucG90LXJldmlldy1wbHVnaW4vZGF0YS9jb3JlLmJ1dHRvbi5zbW9rZS5zdmciLAogICAgICAiYm9hcmQiOiB7CiAgICAgICAgIndpZHRoIjogNzIwLAogICAgICAgICJoZWlnaHQiOiA0MjAsCiAgICAgICAgIngiOiAwLAogICAgICAgICJ5IjogMCwKICAgICAgICAiZmlsbCI6ICIjRjNFRkU2IgogICAgICB9LAogICAgICAiYXJ0aWZhY3QiOiB7CiAgICAgICAgInBhdGgiOiAiZGF0YS9jb3JlLmJ1dHRvbi5zbW9rZS5zdmciLAogICAgICAgICJ3aWR0aCI6IDcyMCwKICAgICAgICAiaGVpZ2h0IjogNDIwCiAgICAgIH0KICAgIH0KICBdLAogICJwcm9tcHQiOiB7CiAgICAibm9Db21tZW50c1RleHQiOiAi4oCUINC90LXQt9Cw0LrRgNGL0YLRi9GFINC60L7QvNC80LXQvdGC0LDRgNC40LXQsiDQuiDQstGL0LHRgNCw0L3QvdC+0LzRgyBib2FyZCDQv9C+0LrQsCDQvdC10YIiLAogICAgInRlbXBsYXRlIjogIkBHaXRIdWIge3tyZXBvc2l0b3J5fX1cblxu0JTQvtGA0LDQsdC+0YLQsNC5INGN0LvQtdC80LXQvdGCIGB7e2VsZW1lbnRJZH19YCDQv9C+INC90LXQt9Cw0LrRgNGL0YLRi9C8INC60L7QvNC80LXQvdGC0LDRgNC40Y/QvCBQZW5wb3QuXG5cbtCY0YHRgtC+0YfQvdC40Log0Y3Qu9C10LzQtdC90YLQsCDQsiBHaXQ6XG57e3NvdXJjZVVybH19XG5cbtCg0LXQstC40LfQuNGPINC40YHRgtC+0YfQvdC40LrQsDogYHt7c291cmNlUmV2aXNpb259fWBcbtCS0LXRgNGB0LjRjyDRjdC70LXQvNC10L3RgtCwOiBge3tlbGVtZW50VmVyc2lvbn19YFxu0KHQvtGB0YLQvtGP0L3QuNC1OiBge3tzdGF0ZX19YFxuXG7QmtC+0LzQvNC10L3RgtCw0YDQuNC4Olxue3tjb21tZW50c319XG5cbtCh0L3QsNGH0LDQu9CwINGB0LLQtdGA0Y/QudGB0Y8g0YEg0YPQutCw0LfQsNC90L3Ri9C8IEdpdC3QuNGB0YLQvtGH0L3QuNC60L7QvDsg0L3QtSDQstC+0YHRgdGC0LDQvdCw0LLQu9C40LLQsNC5INGN0LvQtdC80LXQvdGCINC/0L4g0L/QsNC80Y/RgtC4INC4INC90LUg0L/RgNC40LTRg9C80YvQstCw0Lkg0L7RgtGB0YPRgtGB0YLQstGD0Y7RidC40LUg0LTQsNC90L3Ri9C1LiDQn9C+0LTQs9C+0YLQvtCy0Ywg0LjQt9C80LXQvdC10L3QuNC1INCyINC00LjQt9Cw0LnQvS3RgdC40YHRgtC10LzQtSDQuCDQvdC+0LLRi9C5INC/0YDQvtCy0LXRgNGP0LXQvNGL0LkgcHJldmlldy4gUHJvZHVjdGlvbiDQvdC1INC+0LHQvdC+0LLQu9GP0Lkg0LHQtdC3IHNpZ24tb2ZmINCy0LvQsNC00LXQu9GM0YbQsCDQv9GA0L7QtNGD0LrRgtCwLiIKICB9Cn0K';
  const EMBEDDED_SVG_BASE64 = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MjAiIGhlaWdodD0iNDIwIiB2aWV3Qm94PSIwIDAgNzIwIDQyMCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsbGVkYnk9InRpdGxlIGRlc2MiPgogIDx0aXRsZSBpZD0idGl0bGUiPtCi0LXRgdGC0L7QstGL0Lkg0LDRgNGC0LXRhNCw0LrRgiDQutC90L7Qv9C60Lgg0LTQu9GPIFBlbnBvdCByZXZpZXctcGx1Z2luPC90aXRsZT4KICA8ZGVzYyBpZD0iZGVzYyI+0K3QutGB0L/QtdGA0LjQvNC10L3RgtCw0LvRjNC90YvQuSDQv9GA0LjQvNC10YAsINC40YHRgtC+0YfQvdC40Log0LrQvtGC0L7RgNC+0LPQviDRhdGA0LDQvdC40YLRgdGPINCyIEdpdC4g0J3QtSDRj9Cy0LvRj9C10YLRgdGPINGD0YLQstC10YDQttC00ZHQvdC90YvQvCDQutC+0LzQv9C+0L3QtdC90YLQvtC8INC00LjQt9Cw0LnQvS3RgdC40YHRgtC10LzRiy48L2Rlc2M+CiAgPHJlY3Qgd2lkdGg9IjcyMCIgaGVpZ2h0PSI0MjAiIHJ4PSIyOCIgZmlsbD0iI0YzRUZFNiIvPgogIDxyZWN0IHg9IjMyIiB5PSIzMiIgd2lkdGg9IjY1NiIgaGVpZ2h0PSIzNTYiIHJ4PSIyMCIgZmlsbD0iI0ZGRkRGOCIgc3Ryb2tlPSIjRDZEMEM0Ii8+CiAgPHRleHQgeD0iNjQiIHk9IjgyIiBmaWxsPSIjNUQ1NzRGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSI3MDAiIGxldHRlci1zcGFjaW5nPSIxLjQiPkxPVkVLR0QgwrcgUFJPVE9UWVBFIDAwMTwvdGV4dD4KICA8dGV4dCB4PSI2NCIgeT0iMTI2IiBmaWxsPSIjMjAxRDFBIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjYiIGZvbnQtd2VpZ2h0PSI3MDAiPkJ1dHRvbiAvIFByaW1hcnkgLyBTbW9rZTwvdGV4dD4KICA8dGV4dCB4PSI2NCIgeT0iMTU3IiBmaWxsPSIjNkU2NzVGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTUiPtCi0LXRgdGC0L7QstGL0Lkg0LDRgNGC0LXRhNCw0LrRgiDQuNC3IEdpdCDigJQg0L3QtSDRg9GC0LLQtdGA0LbQtNC10L3QvdGL0Lkg0LrQvtC80L/QvtC90LXQvdGCPC90ZXh0PgogIDxyZWN0IHg9IjY0IiB5PSIyMDIiIHdpZHRoPSIyMzIiIGhlaWdodD0iNTgiIHJ4PSIxNCIgZmlsbD0iIzIwM0I1NyIvPgogIDx0ZXh0IHg9IjE4MCIgeT0iMjM4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTciIGZvbnQtd2VpZ2h0PSI3MDAiPtCf0L7QutCw0LfQsNGC0Ywg0YHQvtCx0YvRgtC40Y88L3RleHQ+CiAgPGxpbmUgeDE9IjY0IiB5MT0iMzAyIiB4Mj0iNjU2IiB5Mj0iMzAyIiBzdHJva2U9IiNEREQ3Q0MiLz4KICA8dGV4dCB4PSI2NCIgeT0iMzM0IiBmaWxsPSIjNUQ1NzRGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTMiPklEOiBjb3JlLmJ1dHRvbi5zbW9rZTwvdGV4dD4KICA8dGV4dCB4PSI2NCIgeT0iMzU4IiBmaWxsPSIjNUQ1NzRGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTMiPtCY0YHRgtC+0YfQvdC40Lo6IHByb3RvdHlwZXMvcGVucG90LXJldmlldy1wbHVnaW4vZGF0YS9jb3JlLmJ1dHRvbi5zbW9rZS5zdmc8L3RleHQ+Cjwvc3ZnPgo=';
  const UI_REVISION = '8bdd0af766f889f32324e50d6678b9fbc4cca198';
  const REPOSITORY = 'onedayonemasterpiece/lovekgd-design-system';
  const PROTOTYPE_PATH = 'prototypes/penpot-review-plugin';
  const UI_URL = `https://raw.githack.com/${REPOSITORY}/${UI_REVISION}/${PROTOTYPE_PATH}/dist/ui.html`;
  const NAMESPACE = 'lovekgd.review';
  const ELEMENT_KEY = 'element';

  function decodeUtf8Base64(value) {
    const bytes = Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  }

  const EMBEDDED_MANIFEST_TEXT = decodeUtf8Base64(EMBEDDED_MANIFEST_BASE64);
  const EMBEDDED_SVG = decodeUtf8Base64(EMBEDDED_SVG_BASE64);
  const EMBEDDED_MANIFEST = JSON.parse(EMBEDDED_MANIFEST_TEXT);

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
    assert(EMBEDDED_SVG.includes('<svg') && EMBEDDED_SVG.includes(element.id), 'git_artifact_contract_failed');
    return manifest;
  }

  function loadManifest() {
    return validateManifest(EMBEDDED_MANIFEST);
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
      artifactTransport: 'embedded-from-git',
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
    const manifest = loadManifest();
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

    const specimen = penpot.createShapeFromSvg(EMBEDDED_SVG);
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
    status('Specimen импортирован из Git-снимка плагина. Теперь поставьте обычный Penpot-комментарий внутри board.', 'ok');
    await sendSelectionState();
  }

  async function buildPrompt() {
    const board = selectedReviewBoard();
    assert(board, 'select_review_board_first');
    const metadata = readBoardMetadata(board);
    assert(metadata, 'review_board_metadata_missing');
    const manifest = loadManifest();
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
