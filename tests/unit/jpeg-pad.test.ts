import { describe, it, expect } from "bun:test";
import {
	dataUrlToBytes,
	isJpeg,
	padJpegToMinimumSize,
	paddingNeeded,
} from "../../src/lib/image/jpeg-pad";

// Smallest structure that still looks like a JPEG to the padder: SOI, one
// APP0 segment, then EOI. Real decoders need more, but the padder only
// inspects the SOI marker and keeps everything after it intact.
function fakeJpeg(bodyLength: number): Uint8Array {
	const bytes = new Uint8Array(4 + bodyLength);
	bytes[0] = 0xff;
	bytes[1] = 0xd8;
	for (let i = 2; i < 2 + bodyLength; i++) bytes[i] = i & 0xff;
	bytes[bytes.length - 2] = 0xff;
	bytes[bytes.length - 1] = 0xd9;
	return bytes;
}

/** Walks the segments after SOI and returns the COM payload lengths found. */
function comSegmentPayloads(bytes: Uint8Array): number[] {
	const out: number[] = [];
	let offset = 2;
	while (offset + 4 <= bytes.length && bytes[offset] === 0xff && bytes[offset + 1] === 0xfe) {
		const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
		out.push(length - 2);
		offset += 2 + length;
	}
	return out;
}

describe("padJpegToMinimumSize", () => {
	it("returns the same bytes when already at or above the minimum", () => {
		const input = fakeJpeg(100);
		expect(padJpegToMinimumSize(input, 50)).toBe(input);
		expect(padJpegToMinimumSize(input, input.length)).toBe(input);
	});

	it("leaves non-JPEG input untouched", () => {
		const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0]);
		expect(padJpegToMinimumSize(png, 1000)).toBe(png);
	});

	it("pads to at least the minimum with valid COM segments and keeps the original payload", () => {
		const input = fakeJpeg(100);
		const minBytes = 20 * 1024;
		const padded = padJpegToMinimumSize(input, minBytes);
		expect(padded.length).toBeGreaterThanOrEqual(minBytes);
		expect(isJpeg(padded)).toBe(true);
		const payloads = comSegmentPayloads(padded);
		expect(payloads.length).toBeGreaterThan(0);
		const comBytes = payloads.reduce((sum, p) => sum + p + 4, 0);
		expect(padded.length).toBe(input.length + comBytes);
		// Original bytes after SOI follow the COM segments unchanged.
		expect(Array.from(padded.subarray(2 + comBytes))).toEqual(Array.from(input.subarray(2)));
		// Ends with EOI.
		expect(padded[padded.length - 2]).toBe(0xff);
		expect(padded[padded.length - 1]).toBe(0xd9);
	});

	it("splits large padding into segments no longer than 65533 payload bytes", () => {
		const padded = padJpegToMinimumSize(fakeJpeg(10), 200 * 1024);
		const payloads = comSegmentPayloads(padded);
		expect(payloads.length).toBeGreaterThanOrEqual(4);
		for (const p of payloads) expect(p).toBeLessThanOrEqual(65533);
		expect(padded.length).toBeGreaterThanOrEqual(200 * 1024);
	});

	it("never under-shoots when the remainder is smaller than a segment header", () => {
		const input = fakeJpeg(10);
		for (let extra = 1; extra <= 8; extra++) {
			const padded = padJpegToMinimumSize(input, input.length + extra);
			expect(padded.length).toBeGreaterThanOrEqual(input.length + extra);
		}
	});

	it("reports padding needed and decodes data URLs", () => {
		expect(paddingNeeded(100, 150)).toBe(50);
		expect(paddingNeeded(200, 150)).toBe(0);
		const bytes = dataUrlToBytes("data:image/jpeg;base64," + Buffer.from([0xff, 0xd8, 0xff, 0xd9]).toString("base64"));
		expect(Array.from(bytes)).toEqual([0xff, 0xd8, 0xff, 0xd9]);
	});
});
