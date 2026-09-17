import { describe, it, expect } from "bun:test";
import { evaluateTargetSizeStatus } from "../../src/components/tools/image/ImageCompressorTool";

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
