import { describe, it, expect } from "bun:test";
import {
	encodeGif,
	quantizeFrame,
	lzwEncode,
	packSubBlocks,
	colorTableBits,
	delayToCentiseconds,
} from "../../src/lib/gif/encode-gif";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type Rgb = [number, number, number];

/** Builds an RGBA frame where pixel (x, y) takes `pick(x, y)`. */
function makeFrame(width: number, height: number, pick: (x: number, y: number) => Rgb): Uint8ClampedArray {
	const rgba = new Uint8ClampedArray(width * height * 4);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const [r, g, b] = pick(x, y);
			const o = (y * width + x) * 4;
			rgba[o] = r;
			rgba[o + 1] = g;
			rgba[o + 2] = b;
			rgba[o + 3] = 255;
		}
	}
	return rgba;
}

const ascii = (bytes: Uint8Array, start: number, length: number): string =>
	String.fromCharCode(...bytes.subarray(start, start + length));

const readUint16 = (bytes: Uint8Array, offset: number): number => bytes[offset] | (bytes[offset + 1] << 8);

function indexOfSequence(haystack: Uint8Array, needle: number[]): number {
	outer: for (let i = 0; i <= haystack.length - needle.length; i++) {
		for (let j = 0; j < needle.length; j++) {
			if (haystack[i + j] !== needle[j]) continue outer;
		}
		return i;
	}
	return -1;
}

const NETSCAPE = [0x21, 0xff, 0x0b, ...Array.from("NETSCAPE2.0", (c) => c.charCodeAt(0))];

interface ParsedFrame {
	gceOffset: number;
	delayCs: number;
	descriptorOffset: number;
	width: number;
	height: number;
	tableBits: number;
	minCodeSize: number;
	data: Uint8Array;
}

/** Walks the GIF block structure and returns every frame (GCE + descriptor + data). */
function parseGif(bytes: Uint8Array): { width: number; height: number; frames: ParsedFrame[]; trailerAt: number } {
	const width = readUint16(bytes, 6);
	const height = readUint16(bytes, 8);
	const packed = bytes[10];
	let offset = 13;
	if (packed & 0x80) offset += 3 * (1 << ((packed & 0x07) + 1));

	const frames: ParsedFrame[] = [];
	let pendingGce: { offset: number; delayCs: number } | null = null;

	const skipSubBlocks = (start: number): number => {
		let p = start;
		while (bytes[p] !== 0) p += bytes[p] + 1;
		return p + 1;
	};
	const readSubBlocks = (start: number): { data: Uint8Array; end: number } => {
		const chunks: number[] = [];
		let p = start;
		while (bytes[p] !== 0) {
			const len = bytes[p];
			chunks.push(...bytes.subarray(p + 1, p + 1 + len));
			p += len + 1;
		}
		return { data: Uint8Array.from(chunks), end: p + 1 };
	};

	while (offset < bytes.length) {
		const marker = bytes[offset];
		if (marker === 0x3b) return { width, height, frames, trailerAt: offset };
		if (marker === 0x21) {
			const label = bytes[offset + 1];
			if (label === 0xf9) {
				pendingGce = { offset, delayCs: readUint16(bytes, offset + 4) };
			}
			offset = skipSubBlocks(offset + 2);
			continue;
		}
		if (marker === 0x2c) {
			const w = readUint16(bytes, offset + 5);
			const h = readUint16(bytes, offset + 7);
			const imgPacked = bytes[offset + 9];
			let p = offset + 10;
			const tableBits = imgPacked & 0x80 ? (imgPacked & 0x07) + 1 : 0;
			p += 3 * (tableBits ? 1 << tableBits : 0);
			const minCodeSize = bytes[p++];
			const { data, end } = readSubBlocks(p);
			frames.push({
				gceOffset: pendingGce?.offset ?? -1,
				delayCs: pendingGce?.delayCs ?? -1,
				descriptorOffset: offset,
				width: w,
				height: h,
				tableBits,
				minCodeSize,
				data,
			});
			pendingGce = null;
			offset = end;
			continue;
		}
		throw new Error(`Unexpected block marker 0x${marker.toString(16)} at ${offset}`);
	}
	throw new Error("GIF trailer not found");
}

/** Minimal GIF LZW decoder used to round-trip the encoder output. */
function lzwDecode(data: Uint8Array, minCodeSize: number, expectedPixels: number): Uint8Array {
	const clearCode = 1 << minCodeSize;
	const eoiCode = clearCode + 1;
	const out = new Uint8Array(expectedPixels);
	let outPos = 0;

	let codeSize = minCodeSize + 1;
	let dictionary: number[][] = [];
	let next = eoiCode + 2;
	const resetDictionary = () => {
		dictionary = [];
		for (let i = 0; i < clearCode; i++) dictionary[i] = [i];
		dictionary[clearCode] = [];
		dictionary[eoiCode] = [];
		next = eoiCode + 1;
		codeSize = minCodeSize + 1;
	};
	resetDictionary();

	let bitBuffer = 0;
	let bitCount = 0;
	let bytePos = 0;
	const readCode = (): number => {
		while (bitCount < codeSize) {
			if (bytePos >= data.length) throw new Error("LZW stream ended early");
			bitBuffer |= data[bytePos++] << bitCount;
			bitCount += 8;
		}
		const code = bitBuffer & ((1 << codeSize) - 1);
		bitBuffer >>>= codeSize;
		bitCount -= codeSize;
		return code;
	};

	let previous: number[] | null = null;
	for (;;) {
		const code = readCode();
		if (code === clearCode) {
			resetDictionary();
			previous = null;
			continue;
		}
		if (code === eoiCode) break;

		let entry: number[];
		if (code < next && dictionary[code]) {
			entry = dictionary[code];
			if (previous && next < 4096) dictionary[next++] = [...previous, entry[0]];
		} else if (code === next && previous) {
			entry = [...previous, previous[0]];
			if (next < 4096) dictionary[next++] = entry;
		} else {
			throw new Error(`Invalid LZW code ${code} (next=${next})`);
		}
		for (const v of entry) out[outPos++] = v;
		if (next === 1 << codeSize && codeSize < 12) codeSize++;
		previous = entry;
	}
	if (outPos !== expectedPixels) throw new Error(`Decoded ${outPos} pixels, expected ${expectedPixels}`);
	return out;
}

/* ------------------------------------------------------------------ */
/* Fixtures                                                            */
/* ------------------------------------------------------------------ */

const twoColor8x8 = makeFrame(8, 8, (x, y) => ((x + y) % 2 === 0 ? [0, 0, 0] : [255, 255, 255]));
const solidRed8x8 = makeFrame(8, 8, () => [255, 0, 0]);

/* ------------------------------------------------------------------ */
/* Tests                                                               */
/* ------------------------------------------------------------------ */

describe("GIF encoder: container structure", () => {
	const gif = encodeGif(
		[
			{ rgba: twoColor8x8, width: 8, height: 8 },
			{ rgba: solidRed8x8, width: 8, height: 8 },
		],
		{ delayMs: 250, loop: true },
	);

	it("starts with the GIF89a signature and ends with the 0x3B trailer", () => {
		expect(ascii(gif, 0, 6)).toBe("GIF89a");
		expect(gif[gif.length - 1]).toBe(0x3b);
	});

	it("writes the logical screen size without a global colour table", () => {
		expect(readUint16(gif, 6)).toBe(8);
		expect(readUint16(gif, 8)).toBe(8);
		expect(gif[10] & 0x80).toBe(0);
	});

	it("emits one image descriptor per frame", () => {
		const parsed = parseGif(gif);
		expect(parsed.frames).toHaveLength(2);
		expect(parsed.frames.every((f) => gif[f.descriptorOffset] === 0x2c)).toBe(true);
		expect(parsed.trailerAt).toBe(gif.length - 1);
	});

	it("encodes the delay in centiseconds on every Graphic Control Extension", () => {
		const parsed = parseGif(gif);
		for (const frame of parsed.frames) {
			expect(frame.gceOffset).toBeGreaterThanOrEqual(0);
			expect(gif[frame.gceOffset + 1]).toBe(0xf9);
			expect(frame.delayCs).toBe(25);
		}
		expect(delayToCentiseconds(1000)).toBe(100);
		expect(delayToCentiseconds(55)).toBe(6);
		expect(delayToCentiseconds(999999)).toBe(65535);
	});

	it("throws when frames differ in size", () => {
		const small = makeFrame(4, 4, () => [1, 2, 3]);
		expect(() =>
			encodeGif(
				[
					{ rgba: twoColor8x8, width: 8, height: 8 },
					{ rgba: small, width: 4, height: 4 },
				],
				{ delayMs: 100, loop: true },
			),
		).toThrow(/does not match/);
	});
});

describe("GIF encoder: looping", () => {
	const frames = [
		{ rgba: twoColor8x8, width: 8, height: 8 },
		{ rgba: solidRed8x8, width: 8, height: 8 },
	];

	it("includes the NETSCAPE2.0 block with loop count 0 when looping forever", () => {
		const gif = encodeGif(frames, { delayMs: 100, loop: true });
		const at = indexOfSequence(gif, NETSCAPE);
		expect(at).toBe(13);
		expect(gif[at + 14]).toBe(0x03);
		expect(gif[at + 15]).toBe(0x01);
		expect(readUint16(gif, at + 16)).toBe(0);
		expect(gif[at + 18]).toBe(0x00);
	});

	it("stores a finite loop count", () => {
		const gif = encodeGif(frames, { delayMs: 100, loop:3 });
		const at = indexOfSequence(gif, NETSCAPE);
		expect(readUint16(gif, at + 16)).toBe(3);
	});

	it("omits the NETSCAPE2.0 block when not looping", () => {
		const gif = encodeGif(frames, { delayMs: 100, loop: false });
		expect(indexOfSequence(gif, NETSCAPE)).toBe(-1);
		expect(gif[13]).toBe(0x21);
		expect(gif[14]).toBe(0xf9);
	});
});

describe("GIF encoder: local colour tables", () => {
	it("uses a 2-entry table and minCodeSize 2 for a two-colour frame", () => {
		const gif = encodeGif([{ rgba: twoColor8x8, width: 8, height: 8 }], { delayMs: 100, loop: false });
		const [frame] = parseGif(gif).frames;
		expect(frame.tableBits).toBe(1);
		expect(gif[frame.descriptorOffset + 9]).toBe(0x80);
		expect(frame.minCodeSize).toBe(2);
	});

	it("rounds a 200-colour frame up to a 256-entry table with minCodeSize 8", () => {
		// 200 distinct greys on a 20x10 canvas.
		const frame = makeFrame(20, 10, (x, y) => {
			const v = y * 20 + x;
			return [v, v, v];
		});
		const gif = encodeGif([{ rgba: frame, width: 20, height: 10 }], { delayMs: 100, loop: false });
		const [parsed] = parseGif(gif).frames;
		expect(parsed.tableBits).toBe(8);
		expect(gif[parsed.descriptorOffset + 9]).toBe(0x87);
		expect(parsed.minCodeSize).toBe(8);
		expect(colorTableBits(200)).toBe(8);
		expect(colorTableBits(2)).toBe(1);
		expect(colorTableBits(3)).toBe(2);
		expect(colorTableBits(256)).toBe(8);
	});
});

describe("GIF encoder: quantisation", () => {
	it("reproduces a 4-colour image exactly with maxColors 256 and no dithering", () => {
		const colors: Rgb[] = [
			[255, 0, 0],
			[0, 255, 0],
			[0, 0, 255],
			[250, 200, 10],
		];
		const frame = makeFrame(8, 8, (x, y) => colors[(x + y * 3) % 4]);
		const { palette, indices } = quantizeFrame(frame, 8, 8, { maxColors: 256, dither: false });
		expect(palette.length / 3).toBe(4);
		for (let p = 0; p < 64; p++) {
			const i = indices[p] * 3;
			expect([palette[i], palette[i + 1], palette[i + 2]]).toEqual([frame[p * 4], frame[p * 4 + 1], frame[p * 4 + 2]]);
		}
	});

	it("reduces a gradient to the requested palette size", () => {
		const frame = makeFrame(64, 4, (x) => [x * 4, 255 - x * 4, 128]);
		const { palette, indices } = quantizeFrame(frame, 64, 4, { maxColors: 16, dither: true });
		expect(palette.length / 3).toBeLessThanOrEqual(16);
		expect(palette.length / 3).toBeGreaterThan(1);
		expect(indices.every((i) => i < palette.length / 3)).toBe(true);
	});

	it("composites transparent pixels onto the background colour", () => {
		const rgba = new Uint8ClampedArray(4 * 4);
		// pixel 0 opaque red, others fully transparent
		rgba.set([255, 0, 0, 255], 0);
		const { palette, indices } = quantizeFrame(rgba, 2, 2, { maxColors: 256, background: [10, 20, 30] });
		const colorOf = (p: number): Rgb => [palette[indices[p] * 3], palette[indices[p] * 3 + 1], palette[indices[p] * 3 + 2]];
		expect(colorOf(0)).toEqual([255, 0, 0]);
		expect(colorOf(1)).toEqual([10, 20, 30]);
		expect(colorOf(3)).toEqual([10, 20, 30]);
	});
});

describe("GIF encoder: LZW", () => {
	it("round-trips the first frame of an 8x8 two-colour image exactly", () => {
		const { indices } = quantizeFrame(twoColor8x8, 8, 8, { maxColors: 256, dither: false });
		const gif = encodeGif([{ rgba: twoColor8x8, width: 8, height: 8 }], { delayMs: 100, loop: true });
		const [frame] = parseGif(gif).frames;
		const decoded = lzwDecode(frame.data, frame.minCodeSize, 64);
		expect(Array.from(decoded)).toEqual(Array.from(indices));
	});

	it("round-trips a long noisy stream that forces code-size growth and table resets", () => {
		// Deterministic pseudo-random indices over 256 symbols: fills the 4096 table several times.
		const length = 40000;
		const indices = new Uint8Array(length);
		let seed = 12345;
		for (let i = 0; i < length; i++) {
			seed = (seed * 1103515245 + 12345) & 0x7fffffff;
			indices[i] = (seed >> 16) & 0xff;
		}
		const encoded = lzwEncode(indices, 8);
		const decoded = lzwDecode(encoded, 8, length);
		expect(Array.from(decoded)).toEqual(Array.from(indices));
	});

	it("round-trips a highly repetitive stream with minCodeSize 2", () => {
		const indices = new Uint8Array(5000);
		for (let i = 0; i < indices.length; i++) indices[i] = i % 7 === 0 ? 1 : 0;
		const decoded = lzwDecode(lzwEncode(indices, 2), 2, indices.length);
		expect(Array.from(decoded)).toEqual(Array.from(indices));
	});

	it("packs sub-blocks of at most 255 bytes with a zero terminator", () => {
		const data = new Uint8Array(600).fill(7);
		const packed = packSubBlocks(data);
		expect(packed[0]).toBe(255);
		expect(packed[256]).toBe(255);
		expect(packed[512]).toBe(90);
		expect(packed[packed.length - 1]).toBe(0);
		expect(packed.length).toBe(600 + 3 + 1);
	});
});
