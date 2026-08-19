#!/usr/bin/env node
/**
 * Decode a raw Figma `fig-kiwi` checkpoint into JSON.
 *
 * This script operates on the same read-only checkpoint bytes loaded by the
 * public Figma Community viewer. It does not call authenticated APIs and does
 * not mutate Figma.
 *
 * Binary envelope:
 *   8 bytes  `fig-kiwi`
 *   4 bytes  version, uint32 LE
 *   repeated: 4-byte chunk size + compressed chunk bytes
 *
 * Chunk 0 embeds a deflate-raw Kiwi schema. Chunk 1 contains the document
 * message, normally zstd-compressed in current files. The format is
 * self-describing; no project-specific schema is hard-coded here.
 *
 * Runtime dependencies:
 *   npm install --no-save kiwi-schema pako fzstd
 */

const fs = require('node:fs');
const {TextDecoder} = require('node:util');
const {decodeBinarySchema, compileSchema} = require('kiwi-schema');
const pako = require('pako');
const fzstd = require('fzstd');

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
    console.error('Usage: node decode_fig_kiwi.cjs <checkpoint.fig> <decoded.json>');
    process.exit(2);
}

const data = fs.readFileSync(inputPath);
const bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
const prelude = new TextDecoder().decode(bytes.subarray(0, 8));
if (prelude !== 'fig-kiwi') {
    throw new Error(`Unsupported checkpoint prelude: ${JSON.stringify(prelude)}`);
}

const version = view.getUint32(8, true);
let offset = 12;
const chunks = [];
while (offset + 4 <= bytes.length) {
    const size = view.getUint32(offset, true);
    offset += 4;
    if (size === 0 || offset + size > bytes.length) {
        throw new Error(`Invalid chunk size ${size} at offset ${offset - 4}`);
    }
    chunks.push(bytes.subarray(offset, offset + size));
    offset += size;
}
if (offset !== bytes.length) {
    throw new Error(`Trailing or truncated bytes: parsed ${offset} of ${bytes.length}`);
}
if (chunks.length < 2) {
    throw new Error(`Expected schema and message chunks, received ${chunks.length}`);
}

const schemaBytes = pako.inflateRaw(chunks[0]);
const schema = decodeBinarySchema(schemaBytes);
const decoder = compileSchema(schema);

const zstdMagic =
    chunks[1].length >= 4 &&
    chunks[1][0] === 0x28 &&
    chunks[1][1] === 0xb5 &&
    chunks[1][2] === 0x2f &&
    chunks[1][3] === 0xfd;
const messageBytes = zstdMagic ? fzstd.decompress(chunks[1]) : pako.inflateRaw(chunks[1]);
const message = decoder.decodeMessage(messageBytes);

const envelope = {
    _decoder: {
        prelude,
        version,
        chunkCount: chunks.length,
        chunkSizes: chunks.map((chunk) => chunk.length),
        schemaDefinitionCount: Array.isArray(schema.definitions) ? schema.definitions.length : null,
        schemaBytes: schemaBytes.length,
        messageCompression: zstdMagic ? 'zstd' : 'deflate-raw',
        messageBytes: messageBytes.length,
    },
    ...message,
};

fs.writeFileSync(outputPath, JSON.stringify(envelope));
console.log(
    JSON.stringify(
        {
            inputPath,
            outputPath,
            version,
            chunkSizes: envelope._decoder.chunkSizes,
            schemaDefinitionCount: envelope._decoder.schemaDefinitionCount,
            messageCompression: envelope._decoder.messageCompression,
            messageBytes: envelope._decoder.messageBytes,
            topLevelKeys: Object.keys(message),
            nodeChangeCount: Array.isArray(message.nodeChanges) ? message.nodeChanges.length : null,
        },
        null,
        2,
    ),
);
