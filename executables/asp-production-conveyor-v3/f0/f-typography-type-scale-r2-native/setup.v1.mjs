import { SPEC, PACKAGE, EXECUTION_TUPLE, DECLARED_CHECKOUT } from './data.v1.mjs';

function invariant(ok, message) { if (!ok) throw new Error(message); }
const COMMON_METHODS = ['beginRun','endRun','ensurePage','ensureBoard','ensureGrid','ensureFlex','resolveComponentMaster','ensureLinkedInstance','ensureText','ensureSpecimenVisual','ensureInstanceOverrideGroup','ensureInstanceTextOverride','setSharedPluginData','projectionDigest','validatePackage'];

function assertDocument(document) {
  invariant(document && ['native-like-document-v2','penpot-native-document-v2'].includes(document.kind), 'native Penpot document adapter v2 required');
  for (const name of COMMON_METHODS) invariant(typeof document[name] === 'function', `document adapter missing ${name}`);
  if (SPEC.kind === 'medallions') {
    for (const name of ['ensureComponentMaster','ensureShape','ensureArtwork']) invariant(typeof document[name] === 'function', `medallion adapter missing ${name}`);
  }
}

function exactHandle(handle, descriptor, label) {
  invariant(handle && handle.verified === true, `${label}: provider did not verify exact bytes`);
  for (const key of ['repository','ref','path','git_blob_sha1','sha256','media_type']) invariant(handle[key] === descriptor[key], `${label}: ${key} drift`);
  invariant(Number(handle.bytes) === Number(descriptor.bytes), `${label}: bytes drift`);
  invariant(handle.content_kind === 'provider-verified-exact-bytes-v1', `${label}: non-exact content handle`);
  return Object.freeze({...handle});
}

function exactFontHandle(handle, descriptor, label) {
  invariant(handle && handle.verified === true, `${label}: font provider did not verify exact bytes`);
  for (const key of ['family','sha256']) invariant(handle[key] === descriptor[key], `${label}: ${key} drift`);
  for (const key of ['weight','bytes']) invariant(Number(handle[key]) === Number(descriptor[key]), `${label}: ${key} drift`);
  invariant(handle.content_kind === 'provider-verified-exact-font-bytes-v1', `${label}: non-exact font handle`);
  return Object.freeze({...handle});
}

export async function setupNativeExecutor(context) {
  invariant(PACKAGE.package_id === SPEC.package_id && EXECUTION_TUPLE.package_id === SPEC.package_id, 'package identity mismatch');
  const { document, assetCheckout = null, fontCheckout = null } = context || {};
  assertDocument(document);
  const setString = (node, key, value) => {
    invariant(typeof value === 'string', `shared-plugin-data value must be string: ${key}`);
    document.setSharedPluginData(node, 'kenigevents-atlas-r2-native', key, value);
  };
  const readProtected = () => Object.fromEntries(Object.entries(SPEC.protected_projections).map(([key, expected]) => {
    const actual = document.projectionDigest(expected.projection_id);
    invariant(actual === expected.sha256, `${key}: protected projection preflight drift`);
    return [key, actual];
  }));
  const resolveMaster = (stableId) => {
    const master = document.resolveComponentMaster(stableId);
    invariant(master, `existing component master missing: ${stableId}`);
    return master;
  };
  const readAsset = async (descriptor) => {
    invariant(assetCheckout && typeof assetCheckout.readVerifiedAsset === 'function', 'declared exact asset checkout required');
    invariant(DECLARED_CHECKOUT && DECLARED_CHECKOUT.repository === descriptor.repository && DECLARED_CHECKOUT.ref === descriptor.ref, 'declared checkout mismatch');
    return exactHandle(await assetCheckout.readVerifiedAsset(descriptor), descriptor, descriptor.path);
  };
  const readFonts = async () => {
    invariant(fontCheckout && typeof fontCheckout.readVerifiedFont === 'function', 'exact font checkout required');
    return {
      regular: exactFontHandle(await fontCheckout.readVerifiedFont(SPEC.font_binding.regular), SPEC.font_binding.regular, 'regular'),
      bold: exactFontHandle(await fontCheckout.readVerifiedFont(SPEC.font_binding.bold), SPEC.font_binding.bold, 'bold'),
    };
  };
  return { document, setString, readProtected, resolveMaster, readAsset, readFonts };
}
