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
 * The first two chunks contain the embedded Kiwi schema and document message.
 * Current checkpoints may use Zstandard for either chunk; older snapshots can
 * use raw DEFLATE or a zlib-wrapped stream. Compression is therefore detected
 * independently for every chunk. No project-specific schema is hard-coded.
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

function isZstd(chunk) {
    return (
        chunk.length >= 4 &&
        chunk[0] === 0x28 &&
        chunk[1] === 0xb5 &&
        chunk[2] === 0x2f &&
        chunk[3] === 0xfd
    );
}

function decompressChunk(chunk, label) {
    if (isZstd(chunk)) {
        return {
            bytes: fzstd.decompress(chunk),
            compression: 'zstd',
        };
    }

    try {
        return {
            bytes: pako.inflateRaw(chunk),
            compression: 'deflate-raw',
        };
    } catch (rawError) {
        try {
            return {
                bytes: pako.inflate(chunk),
                compression: 'zlib-or-gzip',
            };
        } catch (wrappedError) {
            throw new Error(
                `${label} chunk is not supported zstd, raw-DEFLATE, zlib or gzip: ` +
                    `raw=${rawError.message}; wrapped=${wrappedError.message}`,
            );
        }
    }
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

const schemaChunk = decompressChunk(chunks[0], 'schema');
const schema = decodeBinarySchema(schemaChunk.bytes);
const decoder = compileSchema(schema);

const messageChunk = decompressChunk(chunks[1], 'message');
const message = decoder.decodeMessage(messageChunk.bytes);

const envelope = {
    _decoder: {
        prelude,
        version,
        chunkCount: chunks.length,
        chunkSizes: chunks.map((chunk) => chunk.length),
        schemaDefinitionCount: Array.isArray(schema.definitions) ? schema.definitions.length : null,
        schemaCompression: schemaChunk.compression,
        schemaBytes: schemaChunk.bytes.length,
        messageCompression: messageChunk.compression,
        messageBytes: messageChunk.bytes.length,
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
            schemaCompression: envelope._decoder.schemaCompression,
            schemaBytes: envelope._decoder.schemaBytes,
            messageCompression: envelope._decoder.messageCompression,
            messageBytes: envelope._decoder.messageBytes,
            topLevelKeys: Object.keys(message),
            nodeChangeCount: Array.isArray(message.nodeChanges) ? message.nodeChanges.length : null,
        },
        null,
        2,
    ),
);
