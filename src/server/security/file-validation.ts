/**
 * @file src/server/security/file-validation.ts
 * @description File security hardening: magic byte inspection, ZIP bomb detection, path traversal defense.
 */

interface MagicSegment {
  offset: number;
  bytes: number[];
}

// Magic byte signatures (each variant is a list of required offset+bytes segments)
const MAGIC_SIGNATURES: Record<string, MagicSegment[][]> = {
  "image/png": [[{ offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }]],
  "image/jpeg": [[{ offset: 0, bytes: [0xff, 0xd8, 0xff] }]],
  "image/gif": [
    [{ offset: 0, bytes: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61] }],
    [{ offset: 0, bytes: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61] }],
  ],
  "image/webp": [
    [
      { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] }, // 'RIFF'
      { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] }, // 'WEBP'
    ],
  ],
  "application/pdf": [[{ offset: 0, bytes: [0x25, 0x50, 0x44, 0x46] }]], // '%PDF'
  "application/zip": [
    [{ offset: 0, bytes: [0x50, 0x4b, 0x03, 0x04] }],
    [{ offset: 0, bytes: [0x50, 0x4b, 0x05, 0x06] }],
  ],
};

/**
 * Validates file buffer against expected MIME type using magic bytes
 */
export function validateMagicBytes(buffer: Uint8Array, expectedMime: string): boolean {
  const variants = MAGIC_SIGNATURES[expectedMime];
  if (!variants) {
    // If unknown mime, permit text formats or defer
    return true;
  }

  return variants.some((segments) =>
    segments.every(({ offset, bytes }) => {
      if (buffer.length < offset + bytes.length) return false;
      for (let i = 0; i < bytes.length; i++) {
        if (buffer[offset + i] !== bytes[i]) return false;
      }
      return true;
    })
  );
}

/**
 * Sanitizes user-provided filenames against path traversal attacks (e.g. `../../etc/passwd`)
 */
export function sanitizeFileName(filename: string): string {
  // 1. Strip null bytes and ASCII control characters
  let clean = filename.replace(/[\0-\x1f\x7f]/g, "");
  // 2. Iteratively remove drive letters, leading slashes, and dot-traversal segments
  //    so nested sequences like `....//` or trailing `..` cannot survive a single pass.
  let prev: string;
  do {
    prev = clean;
    clean = clean
      .replace(/^[a-zA-Z]:[\/\\]*/, "")
      .replace(/^[\/\\]+/, "")
      .replace(/[\/\\]+\.{2,}$/g, "")
      .replace(/(^|[\/\\])\.{2,}([\/\\]+|$)/g, "$1")
      .replace(/^[\/\\]+/, "");
  } while (clean !== prev);

  // 3. Fallback if empty
  if (!clean.trim()) {
    clean = "unnamed_file";
  }
  return clean;
}

export interface ZipBombCheckOptions {
  maxUncompressedSizeBytes?: number; // Default 50MB
  maxCompressionRatio?: number; // Default 100:1
  maxFileCount?: number; // Default 500 files
}

/**
 * Checks if parsed archive metadata exhibits characteristics of a decompression bomb
 */
export function isDecompressionBomb(
  compressedSize: number,
  uncompressedSize: number,
  fileCount: number,
  options: ZipBombCheckOptions = {}
): { isBomb: boolean; reason?: string } {
  const maxSize = options.maxUncompressedSizeBytes ?? 50 * 1024 * 1024; // 50MB
  const maxRatio = options.maxCompressionRatio ?? 100;
  const maxFiles = options.maxFileCount ?? 500;

  if (uncompressedSize > maxSize) {
    return {
      isBomb: true,
      reason: `Uncompressed size (${(uncompressedSize / 1024 / 1024).toFixed(1)}MB) exceeds maximum permitted limit (${maxSize / 1024 / 1024}MB).`,
    };
  }

  if (compressedSize > 0) {
    const ratio = uncompressedSize / compressedSize;
    if (ratio > maxRatio) {
      return {
        isBomb: true,
        reason: `Decompression expansion ratio (${ratio.toFixed(1)}:1) exceeds safe threshold (${maxRatio}:1).`,
      };
    }
  }

  if (fileCount > maxFiles) {
    return {
      isBomb: true,
      reason: `Archive contains too many entries (${fileCount} > ${maxFiles}).`,
    };
  }

  return { isBomb: false };
}
