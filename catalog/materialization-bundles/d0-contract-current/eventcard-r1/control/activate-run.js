/**
 * D0 contract-current EventCard R1 ACTIVE-run bootstrap.
 * PUBLISH is the only authorized executor. This is the sole write in this step.
 */
return (() => {
  const NAMESPACE = 'kenigevents';
  const KEY = 'asp-active-run-v1';
  const EXPECTED = Object.freeze({
    schema: 'kenigevents.asp-run-control.v1',
    run_id: '01a05819-82c8-7e70-a088-ed262f425ec6',
    writer_id: '/root/publish_r2',
    state: 'ACTIVE',
    package_id: 'D0-FREE-EVENTCARD-CONTRACT-CURRENT-R1',
    contract_sha256: '54002c01430d48d836af491a09f493526c309e0779c2c6f0deedbf434975cf72',
    page_profile_sha256: 'a2fbdba547f8829308f88231f96fce0cc54c441f741e99a7a846dcf0333ea461',
    asset_registry_sha256: 'bbb07cc7d218d4ff69cc21ee002652b21c9e6c4efdbf65a23b9805f97eb7efb4',
    geometry_proof_sha256: '5395c56376847d36a6ebc8e5d4988a2b06c4cac9acd27426dd73276620031307'
  });
  const FILE_ID = '40e06342-8830-80d6-8008-8fc8a3a4cd4f';
  const PAGE_ID = 'c16498cb-b51d-8030-8008-904bd8fc9c53';
  const ROOT_ID = '313fb1ed-0d5c-8095-8008-9108df52b2ce';
  const ROOT_NAME = 'KenigEvents · G12 bounded L0-L3';
  const fail = (code, detail = {}) => {
    const error = new Error(`${code}: ${JSON.stringify(detail)}`);
    error.code = code;
    error.detail = detail;
    throw error;
  };
  const array = (value) => Array.from(value || []);
  const walk = (root) => {
    const out = [], queue = root ? [root] : [];
    while (queue.length) {
      const shape = queue.shift();
      out.push(shape);
      queue.push(...array(shape?.children));
    }
    return out;
  };
  if (typeof penpot === 'undefined' || !penpot.currentFile || !penpot.currentPage) fail('PENPOT_CONTEXT_MISSING');
  if (penpot.currentFile.id !== FILE_ID || penpot.currentPage.id !== PAGE_ID) {
    fail('PENPOT_TARGET_MISMATCH', { expectedFile: FILE_ID, actualFile: penpot.currentFile.id, expectedPage: PAGE_ID, actualPage: penpot.currentPage.id });
  }
  if (typeof penpot.currentFile.getSharedPluginData !== 'function' || typeof penpot.currentFile.setSharedPluginData !== 'function') fail('PENPOT_SHARED_PLUGIN_DATA_API_MISSING');
  const roots = array(penpot.currentPage.root?.children);
  const root = roots.find((shape) => shape.id === ROOT_ID);
  if (roots.length !== 1 || !root || root.type !== 'board' || root.name !== ROOT_NAME) {
    fail('PENPOT_ACCEPTED_ROOT_MISMATCH', { roots: roots.map(({ id, name, type }) => ({ id, name, type })) });
  }
  const localComponents = array(penpot.library?.local?.components);
  const validation = typeof penpot.currentFile.validate === 'function' ? penpot.currentFile.validate() : null;
  const validationItems = Array.isArray(validation) ? validation : validation == null ? [] : validation;
  const census = {
    revision: Number(penpot.currentFile.revn ?? penpot.currentFile.revision),
    pageDirectRoots: roots.length,
    acceptedRootChildren: array(root.children).length,
    acceptedRootDescendants: walk(root).length - 1,
    localComponents: localComponents.length,
    validation: validationItems
  };
  if (!Number.isFinite(census.revision) || census.revision < 56 || census.acceptedRootChildren !== 16 || census.acceptedRootDescendants !== 137 || census.localComponents !== 15 || census.validation.length !== 0) {
    fail('PENPOT_BASELINE_CENSUS_DRIFT', census);
  }
  const raw = penpot.currentFile.getSharedPluginData(NAMESPACE, KEY) || '';
  let current = null;
  if (raw) {
    try { current = JSON.parse(raw); }
    catch (error) { fail('PENPOT_RUN_CONTROL_INVALID_JSON', { message: String(error?.message || error) }); }
  }
  const same = current && Object.entries(EXPECTED).every(([key, value]) => current[key] === value);
  if (same) return { schema: 'kenigevents.asp-run-bootstrap-receipt.v1', reused: true, mutations: 0, control: current, census };
  if (current) fail('PENPOT_COMPETING_OR_STALE_RUN_CONTROL', { current });
  const activatedAt = new Date().toISOString();
  const control = { ...EXPECTED, activated_at: activatedAt, baseline: census };
  // There is no await between the empty-marker read and this single bootstrap write.
  penpot.currentFile.setSharedPluginData(NAMESPACE, KEY, JSON.stringify(control));
  const persistedRaw = penpot.currentFile.getSharedPluginData(NAMESPACE, KEY) || '';
  let persisted;
  try { persisted = JSON.parse(persistedRaw); }
  catch (error) { fail('PENPOT_RUN_CONTROL_WRITE_READBACK_INVALID', { message: String(error?.message || error) }); }
  if (!Object.entries(control).every(([key, value]) => key === 'baseline' ? JSON.stringify(persisted[key]) === JSON.stringify(value) : persisted[key] === value)) {
    fail('PENPOT_RUN_CONTROL_WRITE_READBACK_MISMATCH', { expected: control, actual: persisted });
  }
  return { schema: 'kenigevents.asp-run-bootstrap-receipt.v1', reused: false, mutations: 1, control: persisted, census };
})();
