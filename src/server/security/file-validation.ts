/**
 * @file src/server/security/file-validation.ts
 * @description File security hardening: magic byte inspection, ZIP bomb detection, path traversal defense.
 */

// Magic byte signatures
const MAGIC_SIGNATURES: Record<string, number[][]> = {
  "image/png": [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/gif": [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
  ],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // Bytes 0-3: 'RIFF', byte 8-11: 'WEBP'
  "application/pdf": [[0x25, 0x50, 0x44, 0x46]], // '%PDF'
  "application/zip": [
    [0x50, 0x4b, 0x03, 0x04],
    [0x50, 0x4b, 0x05, 0x06],
  ],
};

/**
 * Validates file buffer against expected MIME type using magic bytes
 */
export function validateMagicBytes(buffer: Uint8Array, expectedMime: string): boolean {
  const signatures = MAGIC_SIGNATURES[expectedMime];
  if (!signatures) {
    // If unknown mime, permit text formats or defer
    return true;
  }

  return signatures.some((sig) => {
    if (buffer.length < sig.length) return false;
    for (let i = 0; i < sig.length; i++) {
      if (buffer[i] !== sig[i]) return false;
    }
    return true;
  });
}

/**
 * Sanitizes user-provided filenames against path traversal attacks (e.g. `../../etc/passwd`)
 */
export function sanitizeFileName(filename: string): string {
  // 1. Strip null bytes
  let clean = filename.replace(/\0/g, "");
  // 2. Remove directory traversals
  clean = clean.replace(/(\.\.[\/\\])+/g, "");
  // 3. Remove leading slashes and drive letters
  clean = clean.replace(/^[a-zA-Z]:[\/\\]+/, "").replace(/^[\/\\]+/, "");
  // 4. Fallback if empty
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
