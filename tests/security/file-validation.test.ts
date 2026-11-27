import { describe, it, expect } from "bun:test";
import {
  validateMagicBytes,
  sanitizeFileName,
  isDecompressionBomb,
} from "../../src/server/security/file-validation";

describe("File Security & Decompression Guard", () => {
  it("validates PNG magic bytes", () => {
    const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
    expect(validateMagicBytes(pngBytes, "image/png")).toBe(true);

    const fakePng = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]); // GIF header
    expect(validateMagicBytes(fakePng, "image/png")).toBe(false);
  });

  it("validates full RIFF+WEBP signature for WebP and rejects RIFF-WAV spoofing", () => {
    const validWebp = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00,
      0x57, 0x45, 0x42, 0x50, 0x56, 0x50, 0x38, 0x20,
    ]);
    expect(validateMagicBytes(validWebp, "image/webp")).toBe(true);

    const wavSpoof = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00,
      0x57, 0x41, 0x56, 0x45, 0x66, 0x6d, 0x74, 0x20,
    ]);
    expect(validateMagicBytes(wavSpoof, "image/webp")).toBe(false);
  });

  it("sanitizes malicious filenames against path traversal", () => {
    expect(sanitizeFileName("../../../etc/passwd")).toBe("etc/passwd");
    expect(sanitizeFileName("....//....//etc/passwd")).toBe("etc/passwd");
    expect(sanitizeFileName("..")).toBe("unnamed_file");
    expect(sanitizeFileName("dir/..")).toBe("dir");
    expect(sanitizeFileName("..\\..\\windows\\system32\\cmd.exe")).toBe("windows\\system32\\cmd.exe");
    expect(sanitizeFileName("valid-file.pdf")).toBe("valid-file.pdf");
    expect(sanitizeFileName("")).toBe("unnamed_file");
  });

  it("detects decompression bombs (excessive ratio / size)", () => {
    // 1KB compressed expands to 200MB (ratio 200,000:1)
    const result = isDecompressionBomb(1024, 200 * 1024 * 1024, 10);
    expect(result.isBomb).toBe(true);
    expect(result.reason).toBeDefined();

    // Normal safe archive (10MB compressed expands to 15MB, 20 files)
    const safe = isDecompressionBomb(10 * 1024 * 1024, 15 * 1024 * 1024, 20);
    expect(safe.isBomb).toBe(false);
  });
});
