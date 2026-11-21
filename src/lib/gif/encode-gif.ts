/**
 * @file src/lib/gif/encode-gif.ts
 * @description Dependency-free GIF89a encoder (pure TypeScript, no DOM).
 *
 * Output layout (all multi-byte integers little-endian):
 *
 *   "GIF89a"
 *   Logical Screen Descriptor   width, height, packed(no global colour table), bg index, aspect
 *   [NETSCAPE2.0 extension]     only when looping; loop count 0 = forever
 *   per frame:
 *     Graphic Control Extension 0x21 0xF9 0x04 packed(disposal 1) delay(cs) transparent-index 0x00
 *     Image Descriptor          0x2C left top width height packed(local colour table, size bits)
 *     Local Colour Table        2^n entries of r,g,b (n = max(1, ceil(log2(colours))))
 *     LZW minimum code size     max(2, n)
 *     Image data                LZW stream split into 255-byte sub-blocks, 0x00 terminator
 *   0x3B trailer
 *
 * Every frame carries its own local colour table (median-cut quantised, optional
 * Floyd–Steinberg dithering), so colour-rich animations do not have to share
 * one 256-entry global palette.
 */

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type RgbTriple = [number, number, number];

export interface QuantizeOptions {
	/** Palette size, 2..256. */
	maxColors: number;
	/** Floyd–Steinberg error diffusion. */
	dither?: boolean;
	/** Colour composited under pixels with alpha < 128. Default white. */
	background?: RgbTriple;
}

export interface QuantizedFrame {
	/** r,g,b triples, `palette.length / 3` colours. */
	palette: Uint8Array;
	/** One palette index per pixel, row-major. */
	indices: Uint8Array;
}

export interface GifFrameInput {
	rgba: Uint8ClampedArray | Uint8Array;
	width: number;
	height: number;
}

export interface EncodeGifOptions {
	/** Delay between frames in milliseconds (stored in centiseconds). */
	delayMs: number;
	/** `true` / `0` = loop forever, `false` = play once, `n` = loop n times. */
	loop: boolean | number;
	maxColors?: number;
	dither?: boolean;
	background?: RgbTriple;
}

const MAX_CODE_TABLE = 4096;
const MAX_CODE_BITS = 12;
const ALPHA_THRESHOLD = 128;
const DEFAULT_BACKGROUND: RgbTriple = [255, 255, 255];

/* ------------------------------------------------------------------ */
/* Byte writer                                                         */
/* ------------------------------------------------------------------ */

class ByteWriter {
	private buffer: Uint8Array;
	private length = 0;

	constructor(initialCapacity = 1024) {
		this.buffer = new Uint8Array(initialCapacity);
	}

	private ensure(extra: number): void {
		const needed = this.length + extra;
		if (needed <= this.buffer.length) return;
		let capacity = this.buffer.length * 2;
		while (capacity < needed) capacity *= 2;
		const next = new Uint8Array(capacity);
		next.set(this.buffer.subarray(0, this.length));
		this.buffer = next;
	}

	byte(value: number): void {
		this.ensure(1);
		this.buffer[this.length++] = value & 0xff;
	}

	uint16(value: number): void {
		this.byte(value & 0xff);
		this.byte((value >> 8) & 0xff);
	}

	bytes(values: Uint8Array | number[]): void {
		this.ensure(values.length);
		this.buffer.set(values, this.length);
		this.length += values.length;
	}

	ascii(text: string): void {
		for (let i = 0; i < text.length; i++) this.byte(text.charCodeAt(i));
	}

	toUint8Array(): Uint8Array {
		return this.buffer.slice(0, this.length);
	}
}

/* ------------------------------------------------------------------ */
/* Quantisation                                                        */
/* ------------------------------------------------------------------ */

interface ColorEntry {
	r: number;
	g: number;
	b: number;
	count: number;
}

const packRgb = (r: number, g: number, b: number): number => (r << 16) | (g << 8) | b;

/** Replaces transparent pixels with the background and returns opaque rgb per pixel. */
function compositeToRgb(
	rgba: Uint8ClampedArray | Uint8Array,
	pixelCount: number,
	background: RgbTriple,
): Uint8Array {
	const rgb = new Uint8Array(pixelCount * 3);
	for (let p = 0, s = 0, d = 0; p < pixelCount; p++, s += 4, d += 3) {
		if (rgba[s + 3] < ALPHA_THRESHOLD) {
			rgb[d] = background[0];
			rgb[d + 1] = background[1];
			rgb[d + 2] = background[2];
		} else {
			rgb[d] = rgba[s];
			rgb[d + 1] = rgba[s + 1];
			rgb[d + 2] = rgba[s + 2];
		}
	}
	return rgb;
}

function buildHistogram(rgb: Uint8Array): ColorEntry[] {
	const counts = new Map<number, number>();
	for (let i = 0; i < rgb.length; i += 3) {
		const key = packRgb(rgb[i], rgb[i + 1], rgb[i + 2]);
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}
	const entries: ColorEntry[] = [];
	counts.forEach((count, key) => {
		entries.push({ r: (key >> 16) & 0xff, g: (key >> 8) & 0xff, b: key & 0xff, count });
	});
	return entries;
}

type Channel = "r" | "g" | "b";

interface ColorBox {
	entries: ColorEntry[];
	range: number;
	channel: Channel;
}

function measureBox(entries: ColorEntry[]): ColorBox {
	let rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0;
	for (const e of entries) {
		if (e.r < rMin) rMin = e.r;
		if (e.r > rMax) rMax = e.r;
		if (e.g < gMin) gMin = e.g;
		if (e.g > gMax) gMax = e.g;
		if (e.b < bMin) bMin = e.b;
		if (e.b > bMax) bMax = e.b;
	}
	const rRange = rMax - rMin;
	const gRange = gMax - gMin;
	const bRange = bMax - bMin;
	// Green carries the most luminance; prefer it on ties.
	if (gRange >= rRange && gRange >= bRange) return { entries, range: gRange, channel: "g" };
	if (rRange >= bRange) return { entries, range: rRange, channel: "r" };
	return { entries, range: bRange, channel: "b" };
}

/** Splits a box at its population median along its widest channel. */
function splitBox(box: ColorBox): [ColorBox, ColorBox] | null {
	if (box.entries.length < 2 || box.range === 0) return null;
	const channel = box.channel;
	const sorted = [...box.entries].sort((a, b) => a[channel] - b[channel]);
	const total = sorted.reduce((sum, e) => sum + e.count, 0);
	let running = 0;
	let cut = 0;
	for (let i = 0; i < sorted.length - 1; i++) {
		running += sorted[i].count;
		if (running * 2 >= total) {
			cut = i + 1;
			break;
		}
	}
	if (cut === 0) cut = Math.ceil(sorted.length / 2);
	return [measureBox(sorted.slice(0, cut)), measureBox(sorted.slice(cut))];
}

function averageColor(entries: ColorEntry[]): RgbTriple {
	let r = 0, g = 0, b = 0, n = 0;
	for (const e of entries) {
		r += e.r * e.count;
		g += e.g * e.count;
		b += e.b * e.count;
		n += e.count;
	}
	if (n === 0) return [0, 0, 0];
	return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
}

/** Median-cut: repeatedly split the box with the widest colour range. */
function medianCutPalette(entries: ColorEntry[], maxColors: number): Uint8Array {
	if (entries.length <= maxColors) {
		const exact = new Uint8Array(entries.length * 3);
		entries.forEach((e, i) => {
			exact[i * 3] = e.r;
			exact[i * 3 + 1] = e.g;
			exact[i * 3 + 2] = e.b;
		});
		return exact;
	}
	const boxes: ColorBox[] = [measureBox(entries)];
	while (boxes.length < maxColors) {
		let widest = -1;
		let widestRange = -1;
		for (let i = 0; i < boxes.length; i++) {
			if (boxes[i].range > widestRange && boxes[i].entries.length > 1) {
				widestRange = boxes[i].range;
				widest = i;
			}
		}
		if (widest < 0) break;
		const halves = splitBox(boxes[widest]);
		if (!halves) break;
		boxes.splice(widest, 1, halves[0], halves[1]);
	}
	const palette = new Uint8Array(boxes.length * 3);
	boxes.forEach((box, i) => {
		const [r, g, b] = averageColor(box.entries);
		palette[i * 3] = r;
		palette[i * 3 + 1] = g;
		palette[i * 3 + 2] = b;
	});
	return palette;
}

/** Nearest-palette lookup with a memo keyed by packed rgb. */
class PaletteMatcher {
	private readonly cache = new Map<number, number>();
	private readonly count: number;

	constructor(private readonly palette: Uint8Array) {
		this.count = palette.length / 3;
	}

	nearest(r: number, g: number, b: number): number {
		const key = packRgb(r, g, b);
		const cached = this.cache.get(key);
		if (cached !== undefined) return cached;
		let best = 0;
		let bestDistance = Number.POSITIVE_INFINITY;
		for (let i = 0; i < this.count; i++) {
			const dr = this.palette[i * 3] - r;
			const dg = this.palette[i * 3 + 1] - g;
			const db = this.palette[i * 3 + 2] - b;
			const distance = dr * dr + dg * dg + db * db;
			if (distance < bestDistance) {
				bestDistance = distance;
				best = i;
				if (distance === 0) break;
			}
		}
		this.cache.set(key, best);
		return best;
	}
}

function mapWithoutDither(rgb: Uint8Array, matcher: PaletteMatcher): Uint8Array {
	const pixelCount = rgb.length / 3;
	const indices = new Uint8Array(pixelCount);
	for (let p = 0, s = 0; p < pixelCount; p++, s += 3) {
		indices[p] = matcher.nearest(rgb[s], rgb[s + 1], rgb[s + 2]);
	}
	return indices;
}

const clampByte = (value: number): number => (value < 0 ? 0 : value > 255 ? 255 : Math.round(value));

/** Floyd–Steinberg: 7/16 right, 3/16 below-left, 5/16 below, 1/16 below-right. */
function mapWithFloydSteinberg(
	rgb: Uint8Array,
	width: number,
	height: number,
	palette: Uint8Array,
	matcher: PaletteMatcher,
): Uint8Array {
	const indices = new Uint8Array(width * height);
	const work = new Float32Array(rgb.length);
	for (let i = 0; i < rgb.length; i++) work[i] = rgb[i];

	const diffuse = (x: number, y: number, dr: number, dg: number, db: number, weight: number) => {
		if (x < 0 || x >= width || y >= height) return;
		const o = (y * width + x) * 3;
		work[o] += dr * weight;
		work[o + 1] += dg * weight;
		work[o + 2] += db * weight;
	};

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const o = (y * width + x) * 3;
			const r = clampByte(work[o]);
			const g = clampByte(work[o + 1]);
			const b = clampByte(work[o + 2]);
			const index = matcher.nearest(r, g, b);
			indices[y * width + x] = index;
			const er = r - palette[index * 3];
			const eg = g - palette[index * 3 + 1];
			const eb = b - palette[index * 3 + 2];
			if (er === 0 && eg === 0 && eb === 0) continue;
			diffuse(x + 1, y, er, eg, eb, 7 / 16);
			diffuse(x - 1, y + 1, er, eg, eb, 3 / 16);
			diffuse(x, y + 1, er, eg, eb, 5 / 16);
			diffuse(x + 1, y + 1, er, eg, eb, 1 / 16);
		}
	}
	return indices;
}

/**
 * Reduces an RGBA frame to at most `maxColors` colours (median cut) and maps
 * every pixel to a palette index, optionally with Floyd–Steinberg dithering.
 * Pixels with alpha < 128 are composited onto `background`.
 */
export function quantizeFrame(
	rgba: Uint8ClampedArray | Uint8Array,
	width: number,
	height: number,
	options: QuantizeOptions,
): QuantizedFrame {
	if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
		throw new Error("quantizeFrame: width and height must be positive integers");
	}
	const pixelCount = width * height;
	if (rgba.length < pixelCount * 4) {
		throw new Error("quantizeFrame: rgba buffer is shorter than width * height * 4");
	}
	const maxColors = Math.min(256, Math.max(2, Math.floor(options.maxColors)));
	const background = options.background ?? DEFAULT_BACKGROUND;

	const rgb = compositeToRgb(rgba, pixelCount, background);
	const palette = medianCutPalette(buildHistogram(rgb), maxColors);
	const matcher = new PaletteMatcher(palette);
	const indices = options.dither
		? mapWithFloydSteinberg(rgb, width, height, palette, matcher)
		: mapWithoutDither(rgb, matcher);
	return { palette, indices };
}

/* ------------------------------------------------------------------ */
/* LZW                                                                 */
/* ------------------------------------------------------------------ */

/** Packs variable-width codes LSB-first into bytes. */
class BitPacker {
	private readonly out = new ByteWriter();
	private accumulator = 0;
	private bitCount = 0;

	write(code: number, bits: number): void {
		this.accumulator |= code << this.bitCount;
		this.bitCount += bits;
		while (this.bitCount >= 8) {
			this.out.byte(this.accumulator & 0xff);
			this.accumulator >>>= 8;
			this.bitCount -= 8;
		}
	}

	finish(): Uint8Array {
		if (this.bitCount > 0) {
			this.out.byte(this.accumulator & 0xff);
			this.accumulator = 0;
			this.bitCount = 0;
		}
		return this.out.toUint8Array();
	}
}

/**
 * GIF variable-length LZW. Emits a clear code first, grows the code size from
 * `minCodeSize + 1` up to 12 bits as the table fills, re-emits a clear code
 * when the table reaches 4096 entries, and ends with the end-of-information
 * code. Code-size growth mirrors the decoder: it is checked against the table
 * size *before* the new entry is added, so both sides switch width together.
 */
export function lzwEncode(indices: Uint8Array, minCodeSize: number): Uint8Array {
	if (minCodeSize < 2 || minCodeSize > 8) {
		throw new Error("lzwEncode: minCodeSize must be between 2 and 8");
	}
	const clearCode = 1 << minCodeSize;
	const eoiCode = clearCode + 1;
	const packer = new BitPacker();
	const table = new Map<number, number>();

	let codeSize = minCodeSize + 1;
	let nextCode = eoiCode + 1;

	const reset = () => {
		table.clear();
		codeSize = minCodeSize + 1;
		nextCode = eoiCode + 1;
	};
	const growIfNeeded = () => {
		if (nextCode >= 1 << codeSize && codeSize < MAX_CODE_BITS) codeSize++;
	};

	packer.write(clearCode, codeSize);
	if (indices.length === 0) {
		packer.write(eoiCode, codeSize);
		return packer.finish();
	}

	let prefix = indices[0];
	for (let i = 1; i < indices.length; i++) {
		const k = indices[i];
		const key = (prefix << 8) | k;
		const existing = table.get(key);
		if (existing !== undefined) {
			prefix = existing;
			continue;
		}
		packer.write(prefix, codeSize);
		growIfNeeded();
		if (nextCode < MAX_CODE_TABLE) {
			table.set(key, nextCode++);
		} else {
			packer.write(clearCode, codeSize);
			reset();
		}
		prefix = k;
	}
	packer.write(prefix, codeSize);
	growIfNeeded();
	packer.write(eoiCode, codeSize);
	return packer.finish();
}

/** Splits a byte stream into GIF data sub-blocks (≤255 bytes each) plus the 0x00 terminator. */
export function packSubBlocks(data: Uint8Array): Uint8Array {
	const out = new ByteWriter(data.length + Math.ceil(data.length / 255) + 1);
	for (let offset = 0; offset < data.length; offset += 255) {
		const chunk = data.subarray(offset, Math.min(offset + 255, data.length));
		out.byte(chunk.length);
		out.bytes(chunk);
	}
	out.byte(0);
	return out.toUint8Array();
}

/* ------------------------------------------------------------------ */
/* GIF structure                                                       */
/* ------------------------------------------------------------------ */

/** Number of bits needed to index `colorCount` colours (at least 1). */
export function colorTableBits(colorCount: number): number {
	let bits = 1;
	while (1 << bits < colorCount) bits++;
	return bits;
}

/** Converts milliseconds to the GIF centisecond delay field (0..65535). */
export function delayToCentiseconds(delayMs: number): number {
	const cs = Math.round(delayMs / 10);
	return Math.min(65535, Math.max(0, cs));
}

/** "GIF89a" + logical screen descriptor + optional NETSCAPE2.0 loop block. */
export function encodeGifHeader(width: number, height: number, loop: boolean | number): Uint8Array {
	if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
		throw new Error("encodeGif: width and height must be positive integers");
	}
	if (width > 65535 || height > 65535) {
		throw new Error("encodeGif: dimensions exceed the GIF limit of 65535");
	}
	const out = new ByteWriter(64);
	out.ascii("GIF89a");
	out.uint16(width);
	out.uint16(height);
	// Packed: no global colour table (bit 7 = 0), colour resolution 8 bits (bits 6-4 = 111).
	out.byte(0x70);
	out.byte(0); // background colour index
	out.byte(0); // pixel aspect ratio
	if (loop !== false) {
		const loopCount = loop === true ? 0 : Math.min(65535, Math.max(0, Math.floor(loop)));
		out.byte(0x21);
		out.byte(0xff);
		out.byte(0x0b);
		out.ascii("NETSCAPE2.0");
		out.byte(0x03);
		out.byte(0x01);
		out.uint16(loopCount);
		out.byte(0x00);
	}
	return out.toUint8Array();
}

/** Graphic Control Extension + Image Descriptor + local colour table + LZW image data. */
export function encodeGifFrame(
	frame: GifFrameInput,
	options: Pick<EncodeGifOptions, "delayMs" | "maxColors" | "dither" | "background">,
): Uint8Array {
	const { palette, indices } = quantizeFrame(frame.rgba, frame.width, frame.height, {
		maxColors: options.maxColors ?? 256,
		dither: options.dither ?? false,
		background: options.background,
	});
	const bits = colorTableBits(palette.length / 3);
	const tableSize = 1 << bits;
	const minCodeSize = Math.max(2, bits);

	const out = new ByteWriter(indices.length / 2 + tableSize * 3 + 32);
	// Graphic Control Extension: disposal 1 (leave in place), no transparency.
	out.byte(0x21);
	out.byte(0xf9);
	out.byte(0x04);
	out.byte(0x04);
	out.uint16(delayToCentiseconds(options.delayMs));
	out.byte(0x00);
	out.byte(0x00);
	// Image Descriptor with a local colour table of 2^bits entries.
	out.byte(0x2c);
	out.uint16(0);
	out.uint16(0);
	out.uint16(frame.width);
	out.uint16(frame.height);
	out.byte(0x80 | (bits - 1));
	const table = new Uint8Array(tableSize * 3);
	table.set(palette);
	out.bytes(table);
	out.byte(minCodeSize);
	out.bytes(packSubBlocks(lzwEncode(indices, minCodeSize)));
	return out.toUint8Array();
}

export const GIF_TRAILER = 0x3b;

/** Concatenates header, frame chunks and the trailer into one file. */
export function assembleGif(header: Uint8Array, frames: Uint8Array[]): Uint8Array {
	const total = header.length + frames.reduce((sum, f) => sum + f.length, 0) + 1;
	const out = new Uint8Array(total);
	out.set(header, 0);
	let offset = header.length;
	for (const chunk of frames) {
		out.set(chunk, offset);
		offset += chunk.length;
	}
	out[offset] = GIF_TRAILER;
	return out;
}

/**
 * Encodes RGBA frames into a complete animated GIF89a. All frames must share
 * the logical screen size of the first frame.
 */
export function encodeGif(frames: GifFrameInput[], options: EncodeGifOptions): Uint8Array {
	if (frames.length === 0) throw new Error("encodeGif: at least one frame is required");
	const { width, height } = frames[0];
	for (const frame of frames) {
		if (frame.width !== width || frame.height !== height) {
			throw new Error(
				`encodeGif: frame size ${frame.width}x${frame.height} does not match screen ${width}x${height}`,
			);
		}
	}
	const header = encodeGifHeader(width, height, options.loop);
	const chunks = frames.map((frame) => encodeGifFrame(frame, options));
	return assembleGif(header, chunks);
}
