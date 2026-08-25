/**
 * Read-only Penpot plugin-context collector for the 63.01-63.17 owner pages.
 *
 * It intentionally reads only the two top-level owner boards on each page and
 * direct children needed by the executable binding layer.  It neither opens
 * pages nor walks full descendant trees, keeping the read bounded.
 */
function captureRoundTripSnapshot(penpot) {
  const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
  const PAGE_PREFIX = /^63\.(?:0[1-9]|1[0-7])\b/;
  if (penpot.currentFile?.id !== FILE_ID) {
    throw new Error(`wrong Penpot file: ${penpot.currentFile?.id}`);
  }

  const componentOf = shape => {
    if (!shape) return null;
    if (typeof shape.component === 'function') return shape.component();
    return shape.component ?? null;
  };
  const isCopy = shape => typeof shape?.isComponentCopyInstance === 'function'
    ? shape.isComponentCopyInstance()
    : Boolean(shape?.isComponentCopy);
  const isMain = shape => typeof shape?.isComponentMainInstance === 'function'
    ? shape.isComponentMainInstance()
    : Boolean(shape?.isComponentMain);
  const componentRef = shape => {
    const component = componentOf(shape);
    return component ? {
      id: component.id,
      library_id: component.libraryId,
      path: component.path,
      name: component.name
    } : null;
  };
  const directChild = (shape, parentIndex) => ({
    shape_id: shape.id,
    name: shape.name,
    type: shape.type,
    x: shape.x,
    y: shape.y,
    width: shape.width,
    height: shape.height,
    parent_index: parentIndex,
    hidden: shape.hidden,
    is_component_copy: isCopy(shape),
    is_component_main: isMain(shape),
    component: componentRef(shape)
  });
  const childrenOf = shape => 'children' in shape && shape.children ? Array.from(shape.children) : [];
  const reuseAudit = board => {
    const terminals = [];
    const visit = shape => {
      const children = childrenOf(shape);
      if (children.length === 0) {
        let componentRoot = null;
        try {
          componentRoot = typeof shape.componentRoot === 'function' ? shape.componentRoot() : null;
        } catch {
          componentRoot = null;
        }
        terminals.push({
          shape_id: shape.id,
          name: shape.name,
          type: shape.type,
          registered: Boolean(componentRoot),
          component_root_id: componentRoot?.id ?? null
        });
        return;
      }
      children.forEach(visit);
    };
    childrenOf(board).forEach(visit);
    const unregistered = terminals.filter(item => !item.registered);
    return {
      terminal_count: terminals.length,
      registered_terminal_count: terminals.length - unregistered.length,
      unregistered_terminal_shapes: unregistered
    };
  };

  const pages = penpot.currentFile.pages
    .filter(page => PAGE_PREFIX.test(page.name))
    .sort((a, b) => a.name.localeCompare(b.name, 'en'))
    .map(page => {
      const topLevel = Array.from(page.root.children);
      const boards = topLevel
        .filter(shape => shape.type === 'board')
        .filter(shape => /^Archetype\s*\//.test(shape.name))
        .sort((a, b) => a.x - b.x)
        .map(shape => ({
          shape_id: shape.id,
          name: shape.name,
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
          component: componentRef(shape),
          direct_children: Array.from(shape.children).map(directChild),
          reuse_audit: reuseAudit(shape)
        }));
      const ownerIds = new Set(boards.map(board => board.shape_id));
      const topLevelNonOwnerShapes = topLevel
        .filter(shape => !ownerIds.has(shape.id))
        .map((shape, parentIndex) => directChild(shape, parentIndex));
      return {
        page_id: page.id,
        page_name: page.name,
        boards,
        top_level_non_owner_shapes: topLevelNonOwnerShapes
      };
    });

  // Do not call mainInstance() for the full library.  The executable join uses
  // exact component IDs and names; resolving 600+ main trees needlessly wakes
  // text layout for component-heavy pages and raises workspace crash risk.
  const libraryComponents = penpot.library.local.components
    .map(component => ({
      id: component.id,
      library_id: component.libraryId,
      path: component.path,
      name: component.name
    }))
    .sort((a, b) => `${a.path}/${a.name}`.localeCompare(`${b.path}/${b.name}`, 'en'));

  return {
    schema_version: 'round-trip-penpot-live-snapshot.v1',
    captured_at: new Date().toISOString(),
    file_id: penpot.currentFile.id,
    revision: penpot.currentFile.revn,
    validation: penpot.currentFile.validate(),
    library_component_count: libraryComponents.length,
    pages,
    library_components: libraryComponents
  };
}

if (typeof module !== 'undefined') module.exports = { captureRoundTripSnapshot };
