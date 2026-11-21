import { describe, it, expect } from "bun:test";
import {
	computeDrawRect,
	computeOutputSize,
	formatBytes,
	formatPercentChange,
	heightForWidth,
	intermediateDownscaleSize,
	isSupportedImage,
	outputExtension,
	outputFileName,
	percentChange,
	resolveOutputMime,
	widthForHeight,
} from "../../src/lib/image/resize-math";

describe("computeOutputSize", () => {
	it("scales both axes in percent mode", () => {
		const size = computeOutputSize({
			sourceWidth: 2000,
			sourceHeight: 1000,
			mode: "percent",
			width: 50,
			height: 50,
			lockAspect: false,
			fit: "stretch",
		});
		expect(size).toEqual({ width: 1000, height: 500 });
	});

	it("rounds percent results and clamps to at least 1px", () => {
		const size = computeOutputSize({
			sourceWidth: 3,
			sourceHeight: 3,
			mode: "percent",
			width: 10,
			height: 10,
			lockAspect: false,
			fit: "stretch",
		});
		expect(size).toEqual({ width: 1, height: 1 });
	});

	it("returns the exact box for stretch without aspect lock", () => {
		const size = computeOutputSize({
			sourceWidth: 1600,
			sourceHeight: 900,
			mode: "pixels",
			width: 500,
			height: 500,
			lockAspect: false,
			fit: "stretch",
		});
		expect(size).toEqual({ width: 500, height: 500 });
	});

	it("locks aspect for a wider source by shrinking the height", () => {
		const size = computeOutputSize({
			sourceWidth: 1600,
			sourceHeight: 900,
			mode: "pixels",
			width: 800,
			height: 800,
			lockAspect: true,
			fit: "stretch",
		});
		expect(size).toEqual({ width: 800, height: 450 });
	});

	it("locks aspect for a taller source by shrinking the width", () => {
		const size = computeOutputSize({
			sourceWidth: 900,
			sourceHeight: 1600,
			mode: "pixels",
			width: 800,
			height: 800,
			lockAspect: true,
			fit: "stretch",
		});
		expect(size).toEqual({ width: 450, height: 800 });
	});

	it("contain fit keeps the source ratio inside the box", () => {
		const size = computeOutputSize({
			sourceWidth: 4000,
			sourceHeight: 3000,
			mode: "pixels",
			width: 1920,
			height: 1080,
			lockAspect: false,
			fit: "contain",
		});
		expect(size).toEqual({ width: 1440, height: 1080 });
	});

	it("cover fit keeps the full box", () => {
		const size = computeOutputSize({
			sourceWidth: 4000,
			sourceHeight: 3000,
			mode: "pixels",
			width: 1920,
			height: 1080,
			lockAspect: false,
			fit: "cover",
		});
		expect(size).toEqual({ width: 1920, height: 1080 });
	});

	it("clamps zero and negative pixel input to 1px", () => {
		const size = computeOutputSize({
			sourceWidth: 100,
			sourceHeight: 100,
			mode: "pixels",
			width: 0,
			height: -5,
			lockAspect: false,
			fit: "stretch",
		});
		expect(size).toEqual({ width: 1, height: 1 });
	});
});

describe("computeDrawRect", () => {
	it("stretch maps the full source onto the full canvas", () => {
		const rects = computeDrawRect({
			sourceWidth: 1000,
			sourceHeight: 500,
			outputWidth: 300,
			outputHeight: 300,
			fit: "stretch",
		});
		expect(rects.source).toEqual({ x: 0, y: 0, width: 1000, height: 500 });
		expect(rects.dest).toEqual({ x: 0, y: 0, width: 300, height: 300 });
	});

	it("cover crops a centred region with the output ratio (wider source)", () => {
		const rects = computeDrawRect({
			sourceWidth: 2000,
			sourceHeight: 1000,
			outputWidth: 500,
			outputHeight: 500,
			fit: "cover",
		});
		expect(rects.source).toEqual({ x: 500, y: 0, width: 1000, height: 1000 });
		expect(rects.dest).toEqual({ x: 0, y: 0, width: 500, height: 500 });
	});

	it("cover crops a centred region with the output ratio (taller source)", () => {
		const rects = computeDrawRect({
			sourceWidth: 1000,
			sourceHeight: 2000,
			outputWidth: 500,
			outputHeight: 500,
			fit: "cover",
		});
		expect(rects.source).toEqual({ x: 0, y: 500, width: 1000, height: 1000 });
	});

	it("contain letterboxes the source centred in the canvas", () => {
		const rects = computeDrawRect({
			sourceWidth: 2000,
			sourceHeight: 1000,
			outputWidth: 400,
			outputHeight: 400,
			fit: "contain",
		});
		expect(rects.source).toEqual({ x: 0, y: 0, width: 2000, height: 1000 });
		expect(rects.dest).toEqual({ x: 0, y: 100, width: 400, height: 200 });
	});
});

describe("intermediateDownscaleSize", () => {
	it("returns a 2x stage for downscales above 2x", () => {
		expect(
			intermediateDownscaleSize({ width: 4000, height: 3000 }, { width: 400, height: 300 }),
		).toEqual({ width: 800, height: 600 });
	});

	it("returns null at or below 2x and for upscales", () => {
		expect(
			intermediateDownscaleSize({ width: 800, height: 600 }, { width: 400, height: 300 }),
		).toBeNull();
		expect(
			intermediateDownscaleSize({ width: 400, height: 300 }, { width: 800, height: 600 }),
		).toBeNull();
	});
});

describe("aspect helpers", () => {
	it("derives the other dimension from a w/h ratio", () => {
		expect(heightForWidth(1600, 16 / 9)).toBe(900);
		expect(widthForHeight(900, 16 / 9)).toBe(1600);
	});

	it("never returns less than 1px", () => {
		expect(heightForWidth(0, 2)).toBe(1);
		expect(widthForHeight(1, 0.001)).toBe(1);
	});
});

describe("resolveOutputMime", () => {
	it("keeps encodable inputs", () => {
		expect(resolveOutputMime("image/webp", "keep")).toBe("image/webp");
		expect(resolveOutputMime("image/jpeg", "keep")).toBe("image/jpeg");
		expect(resolveOutputMime("image/png", "keep")).toBe("image/png");
	});

	it("falls back to PNG for formats the canvas cannot encode", () => {
		expect(resolveOutputMime("image/gif", "keep")).toBe("image/png");
		expect(resolveOutputMime("image/svg+xml", "keep")).toBe("image/png");
		expect(resolveOutputMime("image/bmp", "keep")).toBe("image/png");
		expect(resolveOutputMime("image/avif", "keep")).toBe("image/png");
	});

	it("an explicit choice overrides the input type", () => {
		expect(resolveOutputMime("image/gif", "image/webp")).toBe("image/webp");
		expect(resolveOutputMime("image/png", "image/jpeg")).toBe("image/jpeg");
	});
});

describe("names and extensions", () => {
	it("maps MIME types to extensions", () => {
		expect(outputExtension("image/jpeg")).toBe("jpg");
		expect(outputExtension("image/png")).toBe("png");
		expect(outputExtension("image/webp")).toBe("webp");
	});

	it("builds <basename>-<w>x<h>.<ext>", () => {
		expect(outputFileName("holiday.photo.HEIC.png", { width: 800, height: 600 }, "image/webp")).toBe(
			"holiday.photo.HEIC-800x600.webp",
		);
		expect(outputFileName("noext", { width: 10, height: 20 }, "image/png")).toBe("noext-10x20.png");
	});

	it("accepts supported images by type or by extension when the type is empty", () => {
		expect(isSupportedImage("image/avif", "a.avif")).toBe(true);
		expect(isSupportedImage("", "photo.JPG")).toBe(true);
		expect(isSupportedImage("application/pdf", "doc.pdf")).toBe(false);
		expect(isSupportedImage("image/tiff", "scan.tiff")).toBe(false);
	});
});

describe("formatting", () => {
	it("formats byte counts", () => {
		expect(formatBytes(0)).toBe("0 B");
		expect(formatBytes(512)).toBe("512 B");
		expect(formatBytes(1536)).toBe("1.5 KB");
		expect(formatBytes(2 * 1024 * 1024)).toBe("2 MB");
	});

	it("percentChange is negative when the output is smaller", () => {
		expect(percentChange(1000, 250)).toBe(-75);
		expect(percentChange(1000, 1500)).toBe(50);
		expect(percentChange(0, 100)).toBe(0);
	});

	it("formatPercentChange shows sign and rounds", () => {
		expect(formatPercentChange(-74.6)).toBe("−75%");
		expect(formatPercentChange(12.2)).toBe("+12%");
		expect(formatPercentChange(0.2)).toBe("±0%");
	});
});
