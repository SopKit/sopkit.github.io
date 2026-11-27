import { describe, it, expect } from "bun:test";
import {
    evaluateTargetSizeStatus,
    resolveDownloadExtension,
} from "../../src/components/tools/image/ImageCompressorTool";

describe("Image Compressor Target Evaluation", () => {
    it("reports 'done' when blob size is within target limit", () => {
        const result = evaluateTargetSizeStatus(150 * 1024, 200);
        expect(result.status).toBe("done");
        expect(result.statusMessage).toBeUndefined();
    });

    it("reports 'done' when blob size exactly matches target limit", () => {
        const result = evaluateTargetSizeStatus(200 * 1024, 200);
        expect(result.status).toBe("done");
    });

    it("truthfully reports 'target-unattainable' when minimum size exceeds target limit", () => {
        const result = evaluateTargetSizeStatus(250 * 1024, 200);
        expect(result.status).toBe("target-unattainable");
        expect(result.statusMessage).toContain("Target 200 KB is unattainable");
    });
});

describe("Image Compressor Download Extension", () => {
    it("resolves explicit output formats directly", () => {
        expect(resolveDownloadExtension("webp", "image/png")).toBe("webp");
        expect(resolveDownloadExtension("png", "image/jpeg")).toBe("png");
        expect(resolveDownloadExtension("jpeg", "image/png")).toBe("jpg");
    });

    it("preserves original MIME extension in original mode instead of defaulting to jpg", () => {
        expect(resolveDownloadExtension("original", "image/png")).toBe("png");
        expect(resolveDownloadExtension("original", "image/webp")).toBe("webp");
        expect(resolveDownloadExtension("original", "image/avif")).toBe("avif");
        expect(resolveDownloadExtension("original", "image/gif")).toBe("gif");
        expect(resolveDownloadExtension("original", "image/jpeg")).toBe("jpg");
        expect(resolveDownloadExtension("original", undefined)).toBe("jpg");
    });
});
