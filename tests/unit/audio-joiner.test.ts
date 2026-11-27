import { describe, expect, it } from "bun:test";
import { computeConcatenationSchedule, encodeWavPcm16 } from "../../src/lib/audio/joiner-utils";

describe("Audio Joiner Utilities", () => {
	it("computes cumulative sequential start offsets for concatenated tracks", () => {
		const schedule = computeConcatenationSchedule([2.5, 4.0, 1.25]);
		expect(schedule).toEqual([
			{ startTime: 0, duration: 2.5 },
			{ startTime: 2.5, duration: 4.0 },
			{ startTime: 6.5, duration: 1.25 },
		]);
	});

	it("clamps invalid or negative track durations to zero without corrupting offsets", () => {
		const schedule = computeConcatenationSchedule([3, -1, Number.NaN, 2]);
		expect(schedule).toEqual([
			{ startTime: 0, duration: 3 },
			{ startTime: 3, duration: 0 },
			{ startTime: 3, duration: 0 },
			{ startTime: 3, duration: 2 },
		]);
	});

	it("encodes valid RIFF/WAVE PCM16 headers and interleaved samples", async () => {
		const left = new Float32Array([0, 0.5, -0.5]);
		const right = new Float32Array([0, -0.5, 0.5]);
		const wavBlob = encodeWavPcm16([left, right], 44100);

		expect(wavBlob.type).toBe("audio/wav");
		const buf = await wavBlob.arrayBuffer();
		const view = new DataView(buf);

		expect(String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3))).toBe("RIFF");
		expect(String.fromCharCode(view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11))).toBe("WAVE");
		expect(view.getUint16(22, true)).toBe(2); // channels
		expect(view.getUint32(24, true)).toBe(44100); // sample rate
		expect(view.getUint32(40, true)).toBe(3 * 2 * 2); // 3 frames * 2 ch * 2 bytes
		expect(buf.byteLength).toBe(44 + 12);
	});
});
