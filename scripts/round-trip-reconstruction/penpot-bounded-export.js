/**
 * Penpot plugin-context helpers for bounded, chunked visual exports.
 * Install these functions through execute_code, prepare one exact stable-ID
 * shape, then read the stored base64 in small chunks.
 */
const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function bytesToBase64(bytes) {
  let output = '';
  for (let index = 0; index < bytes.length; index += 3) {
    const a = bytes[index];
    const b = index + 1 < bytes.length ? bytes[index + 1] : 0;
    const c = index + 2 < bytes.length ? bytes[index + 2] : 0;
    const value = (a << 16) | (b << 8) | c;
    output += BASE64[(value >> 18) & 63];
    output += BASE64[(value >> 12) & 63];
    output += index + 1 < bytes.length ? BASE64[(value >> 6) & 63] : '=';
    output += index + 2 < bytes.length ? BASE64[value & 63] : '=';
  }
  return output;
}

async function prepareBoundedExport(penpot, storage, shapeId, options = {}) {
  const type = options.type || 'png';
  const storageKey = options.storageKey || 'penpotBoundedExportB64';
  if (!['png', 'svg'].includes(type)) throw new Error(`unsupported export type: ${type}`);
  const shape = penpot.currentPage?.getShapeById(shapeId);
  if (!shape) return { ok: false, pageId: penpot.currentPage?.id ?? null, shapeId };
  const bytes = await shape.export({ type });
  const base64 = bytesToBase64(bytes);
  storage[storageKey] = base64;
  return {
    ok: true,
    pageId: penpot.currentPage.id,
    shapeId: shape.id,
    shapeName: shape.name,
    width: shape.width,
    height: shape.height,
    type,
    bytes: bytes.length,
    base64Length: base64.length,
    storageKey,
  };
}

function readBoundedExportChunk(storage, storageKey = 'penpotBoundedExportB64', offset = 0, length = 48_000) {
  const base64 = storage[storageKey] || '';
  return {
    chunk: base64.slice(offset, offset + length),
    done: offset + length >= base64.length,
    total: base64.length,
    offset,
  };
}

if (typeof module !== 'undefined') module.exports = { bytesToBase64, prepareBoundedExport, readBoundedExportChunk };
