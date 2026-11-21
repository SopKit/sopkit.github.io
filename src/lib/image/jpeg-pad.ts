/**
 * JPEG size padding for exam-portal uploads.
 *
 * Indian exam and government portals often require a photo or signature
 * between a minimum and a maximum size (for example 20 KB to 50 KB). A small,
 * clean image can compress far below the minimum even at quality 0.95, and the
 * portal then rejects it. The standard way to reach the floor without touching
 * pixels is to insert JPEG comment (COM, 0xFFFE) segments after the SOI marker:
 * every decoder ignores them, so the image is byte-for-byte identical in
 * appearance and still a valid baseline JPEG.
 */

const SOI = [0xff, 0xd8] as const;
const COM_MARKER = [0xff, 0xfe] as const;
/** A segment length field is 2 bytes and includes itself, so payload max is 65535 - 2. */
const MAX_COM_PAYLOAD = 65533;
/** Marker (2) + length field (2). */
const COM_OVERHEAD = 4;

export function isJpeg(bytes: Uint8Array): boolean {
	return bytes.length >= 4 && bytes[0] === SOI[0] && bytes[1] === SOI[1];
}

/** Bytes of COM segments needed to lift `currentSize` to at least `minBytes`. */
export function paddingNeeded(currentSize: number, minBytes: number): number {
	return Math.max(0, Math.ceil(minBytes) - currentSize);
}

function buildComSegment(payloadLength: number): Uint8Array {
	const segment = new Uint8Array(COM_OVERHEAD + payloadLength);
	segment[0] = COM_MARKER[0];
	segment[1] = COM_MARKER[1];
	const lengthField = payloadLength + 2;
	segment[2] = (lengthField >> 8) & 0xff;
	segment[3] = lengthField & 0xff;
	// Spaces: printable, and harmless to any tool that displays comments.
	segment.fill(0x20, COM_OVERHEAD);
	return segment;
}

/**
 * Returns a copy of `bytes` whose length is at least `minBytes`, or the same
 * array when no padding is needed or the input is not a JPEG. Padding is
 * split into COM segments of at most 65533 payload bytes each. A segment can
 * never be shorter than its 4-byte overhead, so a remainder below 4 bytes
 * rounds up to one extra byte of payload rather than under-shooting.
 */
export function padJpegToMinimumSize(bytes: Uint8Array, minBytes: number): Uint8Array {
	let remaining = paddingNeeded(bytes.length, minBytes);
	if (remaining === 0 || !isJpeg(bytes)) {
		return bytes;
	}

	const segments: Uint8Array[] = [];
	while (remaining > 0) {
		const payload = Math.min(MAX_COM_PAYLOAD, Math.max(1, remaining - COM_OVERHEAD));
		const segment = buildComSegment(payload);
		segments.push(segment);
		remaining -= segment.length;
	}

	const total = bytes.length + segments.reduce((sum, s) => sum + s.length, 0);
	const out = new Uint8Array(total);
	out.set(bytes.subarray(0, 2), 0);
	let offset = 2;
	for (const segment of segments) {
		out.set(segment, offset);
		offset += segment.length;
	}
	out.set(bytes.subarray(2), offset);
	return out;
}

/** Decodes a `data:image/jpeg;base64,...` URL into bytes. */
export function dataUrlToBytes(dataUrl: string): Uint8Array {
	const comma = dataUrl.indexOf(",");
	const base64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}
