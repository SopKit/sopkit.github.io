export interface ConcatenatedTrackSlot {
	startTime: number;
	duration: number;
}

/**
 * Computes sequential start offsets for concatenating audio buffers back-to-back.
 */
export function computeConcatenationSchedule(durations: number[]): ConcatenatedTrackSlot[] {
	let offset = 0;
	return durations.map((rawDuration) => {
		const duration = Number.isFinite(rawDuration) && rawDuration > 0 ? rawDuration : 0;
		const slot = { startTime: offset, duration };
		offset += duration;
		return slot;
	});
}

function writeAsciiString(view: DataView, offset: number, text: string): void {
	for (let i = 0; i < text.length; i++) {
		view.setUint8(offset + i, text.charCodeAt(i));
	}
}

/**
 * Encodes interleaved 16-bit PCM WAV data from per-channel Float32 sample arrays.
 */
export function encodeWavPcm16(channels: Float32Array[], sampleRate: number): Blob {
	const numChannels = channels.length;
	const frameCount = channels[0]?.length ?? 0;
	const bitDepth = 16;
	const bytesPerSample = bitDepth / 8;
	const blockAlign = numChannels * bytesPerSample;
	const dataSize = frameCount * blockAlign;
	const headerSize = 44;
	const totalSize = headerSize + dataSize;

	const arrayBuffer = new ArrayBuffer(totalSize);
	const view = new DataView(arrayBuffer);

	writeAsciiString(view, 0, "RIFF");
	view.setUint32(4, totalSize - 8, true);
	writeAsciiString(view, 8, "WAVE");
	writeAsciiString(view, 12, "fmt ");
	view.setUint32(16, 16, true);
	view.setUint16(20, 1, true); // PCM
	view.setUint16(22, numChannels, true);
	view.setUint32(24, sampleRate, true);
	view.setUint32(28, sampleRate * blockAlign, true);
	view.setUint16(32, blockAlign, true);
	view.setUint16(34, bitDepth, true);
	writeAsciiString(view, 36, "data");
	view.setUint32(40, dataSize, true);

	let offset = headerSize;
	for (let i = 0; i < frameCount; i++) {
		for (let c = 0; c < numChannels; c++) {
			const sample = Math.max(-1, Math.min(1, channels[c][i] ?? 0));
			const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
			view.setInt16(offset, intSample, true);
			offset += bytesPerSample;
		}
	}

	return new Blob([arrayBuffer], { type: "audio/wav" });
}
