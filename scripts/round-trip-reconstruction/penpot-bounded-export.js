/**
 * Penpot plugin-context helper for crash-safe owner-board PNG exports.
 *
 * Callers must open exactly one owner page in a separate MCP invocation, wait
 * for page initialization to settle, and only then call prepareBoundedPng on
 * the exact owner board.  The PNG is kept in plugin storage as base64 so the
 * orchestrator can fetch small chunks without asking Penpot to export a heavy
 * whole page or serializing a Uint8Array as hundreds of thousands of JSON
 * properties.
 */
const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const bytesToBase64 = bytes => {
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
};

async function prepareBoundedPng(penpot, storage, shapeId) {
  const shape = penpot.currentPage?.getShapeById(shapeId);
  if (!shape) return { ok: false, page_id: penpot.currentPage?.id ?? null, shape_id: shapeId };
  const bytes = await shape.export({ type: 'png' });
  const base64 = bytesToBase64(bytes);
  storage.roundTripExportB64 = base64;
  return {
    ok: true,
    page_id: penpot.currentPage.id,
    shape_id: shape.id,
    shape_name: shape.name,
    width: shape.width,
    height: shape.height,
    bytes: bytes.length,
    base64_length: base64.length
  };
}

function readBoundedPngChunk(storage, offset, length = 48_000) {
  const base64 = storage.roundTripExportB64 ?? '';
  return {
    chunk: base64.slice(offset, offset + length),
    done: offset + length >= base64.length,
    total: base64.length
  };
}

if (typeof module !== 'undefined') module.exports = { bytesToBase64, prepareBoundedPng, readBoundedPngChunk };
