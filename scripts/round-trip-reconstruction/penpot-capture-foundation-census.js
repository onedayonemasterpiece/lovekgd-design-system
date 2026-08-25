/**
 * Read-only Penpot Foundation Audit Pack census.
 *
 * Traverses only the 34 native owner boards on 63.01–63.17.  It does not open
 * pages, resolve every library component main, export pages or mutate shapes.
 * Visible and hidden instance usage are reported separately.
 */
function capturePenpotFoundationCensus(penpot) {
  const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
  const PAGE_PREFIX = /^63\.(?:0[1-9]|1[0-7])\b/;
  if (penpot.currentFile?.id !== FILE_ID) throw new Error(`wrong Penpot file: ${penpot.currentFile?.id}`);

  const colors = new Map();
  const typeStyles = new Map();
  const componentUsage = new Map();
  const boardSummaries = [];
  // Four representative consumers per observed value keep the evidence pack
  // bounded; complete consumer coverage remains in board_ids/component_ids.
  const sampleLimit = 4;

  const addConsumer = (entry, board, page, shape, hidden, component) => {
    entry.shape_count += 1;
    entry.visible_shape_count += hidden ? 0 : 1;
    entry.hidden_shape_count += hidden ? 1 : 0;
    entry.board_ids.add(board.id);
    entry.page_ids.add(page.id);
    if (component?.id) entry.component_ids.add(component.id);
    if (entry.samples.length < sampleLimit) entry.samples.push({
      page_id: page.id,
      page_name: page.name,
      board_id: board.id,
      board_name: board.name,
      shape_id: shape.id,
      shape_name: shape.name,
      shape_type: shape.type,
      hidden,
      component: component ? { id: component.id, path: component.path, name: component.name } : null
    });
  };

  const componentFor = shape => {
    try {
      const root = shape.isComponentCopyInstance?.() ? shape : shape.componentRoot?.();
      return root?.component?.() ?? null;
    } catch {
      return null;
    }
  };

  const addColor = (kind, value, opacity, refId, board, page, shape, hidden, component) => {
    if (!value) return;
    const normalizedOpacity = Number.isFinite(Number(opacity)) ? Number(opacity) : 1;
    const key = `${kind}|${String(value).toLowerCase()}|${normalizedOpacity}|${refId ?? ''}`;
    let entry = colors.get(key);
    if (!entry) {
      entry = {
        kind,
        value: String(value).toLowerCase(),
        opacity: normalizedOpacity,
        library_ref_id: refId ?? null,
        shape_count: 0,
        visible_shape_count: 0,
        hidden_shape_count: 0,
        board_ids: new Set(),
        page_ids: new Set(),
        component_ids: new Set(),
        samples: []
      };
      colors.set(key, entry);
    }
    addConsumer(entry, board, page, shape, hidden, component);
  };

  const addTypography = (board, page, shape, hidden, component) => {
    const record = {
      font_family: shape.fontFamily ?? null,
      font_id: shape.fontId ?? null,
      font_variant_id: shape.fontVariantId ?? null,
      font_size: shape.fontSize ?? null,
      font_weight: shape.fontWeight ?? null,
      font_style: shape.fontStyle ?? null,
      line_height: shape.lineHeight ?? null,
      letter_spacing: shape.letterSpacing ?? null,
      text_transform: shape.textTransform ?? null,
      text_decoration: shape.textDecoration ?? null,
      align: shape.align ?? null,
      vertical_align: shape.verticalAlign ?? null,
      grow_type: shape.growType ?? null
    };
    const key = JSON.stringify(record);
    let entry = typeStyles.get(key);
    if (!entry) {
      entry = { ...record, shape_count: 0, visible_shape_count: 0, hidden_shape_count: 0, board_ids: new Set(), page_ids: new Set(), component_ids: new Set(), samples: [] };
      typeStyles.set(key, entry);
    }
    addConsumer(entry, board, page, shape, hidden, component);
  };

  const pages = penpot.currentFile.pages
    .filter(page => PAGE_PREFIX.test(page.name))
    .sort((a, b) => a.name.localeCompare(b.name, 'en'));

  for (const page of pages) {
    const boards = Array.from(page.root.children)
      .filter(shape => shape.type === 'board' && /^Archetype\s*\//.test(shape.name));
    for (const board of boards) {
      let shapes = 0;
      let textShapes = 0;
      let imageFills = 0;
      let gradientFills = 0;
      const queue = Array.from(board.children).map(shape => ({ shape, ancestorHidden: Boolean(board.hidden) }));
      while (queue.length) {
        const { shape, ancestorHidden } = queue.shift();
        const hidden = ancestorHidden || Boolean(shape.hidden) || shape.visible === false;
        const component = componentFor(shape);
        shapes += 1;

        for (const fill of shape.fills ?? []) {
          if (fill.fillImage) imageFills += 1;
          if (fill.fillColorGradient) gradientFills += 1;
          addColor(shape.type === 'text' ? 'text' : 'fill', fill.fillColor, fill.fillOpacity, fill.fillColorRefId, board, page, shape, hidden, component);
        }
        for (const stroke of shape.strokes ?? []) {
          addColor('stroke', stroke.strokeColor, stroke.strokeOpacity, stroke.strokeColorRefId, board, page, shape, hidden, component);
        }
        if (shape.type === 'text') {
          textShapes += 1;
          addTypography(board, page, shape, hidden, component);
        }
        if (component?.id) {
          let usage = componentUsage.get(component.id);
          if (!usage) {
            usage = { component_id: component.id, path: component.path, name: component.name, shape_count: 0, visible_shape_count: 0, board_ids: new Set(), page_ids: new Set() };
            componentUsage.set(component.id, usage);
          }
          usage.shape_count += 1;
          usage.visible_shape_count += hidden ? 0 : 1;
          usage.board_ids.add(board.id);
          usage.page_ids.add(page.id);
        }
        for (const child of shape.children ?? []) queue.push({ shape: child, ancestorHidden: hidden });
      }
      boardSummaries.push({ page_id: page.id, page_name: page.name, board_id: board.id, board_name: board.name, width: board.width, height: board.height, descendant_shapes: shapes, text_shapes: textShapes, image_fills: imageFills, gradient_fills: gradientFills });
    }
  }

  const finalize = entry => ({
    ...entry,
    board_ids: Array.from(entry.board_ids).sort(),
    page_ids: Array.from(entry.page_ids).sort(),
    component_ids: entry.component_ids ? Array.from(entry.component_ids).sort() : undefined
  });

  return {
    schema_version: 'foundation-audit.penpot-census.v1',
    captured_at: new Date().toISOString(),
    file_id: penpot.currentFile.id,
    revision: penpot.currentFile.revn,
    validation: penpot.currentFile.validate(),
    scope: { pages: pages.length, boards: boardSummaries.length },
    library: {
      colors: penpot.library.local.colors.map(color => ({ id: color.id, path: color.path, name: color.name, color: color.color, opacity: color.opacity, has_gradient: Boolean(color.gradient), has_image: Boolean(color.image) })),
      typographies: penpot.library.local.typographies.map(style => ({ id: style.id, path: style.path, name: style.name, font_id: style.fontId, font_family: style.fontFamily, font_variant_id: style.fontVariantId, font_size: style.fontSize, font_weight: style.fontWeight, font_style: style.fontStyle, line_height: style.lineHeight, letter_spacing: style.letterSpacing, text_transform: style.textTransform })),
      color_count: penpot.library.local.colors.length,
      typography_count: penpot.library.local.typographies.length
    },
    observed: {
      colors: Array.from(colors.values()).map(finalize).sort((a, b) => b.shape_count - a.shape_count || `${a.kind}:${a.value}`.localeCompare(`${b.kind}:${b.value}`)),
      typography: Array.from(typeStyles.values()).map(finalize).sort((a, b) => b.shape_count - a.shape_count || JSON.stringify(a).localeCompare(JSON.stringify(b))),
      component_usage: Array.from(componentUsage.values()).map(entry => ({ ...entry, board_ids: Array.from(entry.board_ids).sort(), page_ids: Array.from(entry.page_ids).sort() })).sort((a, b) => b.visible_shape_count - a.visible_shape_count || a.component_id.localeCompare(b.component_id)),
      boards: boardSummaries
    }
  };
}

if (typeof module !== 'undefined') module.exports = { capturePenpotFoundationCensus };
