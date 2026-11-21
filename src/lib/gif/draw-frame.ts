/**
 * @file src/lib/gif/draw-frame.ts
 * @description Canvas helpers for the GIF Generator: fit an image into the
 * output size (letterbox or crop) and read back RGBA pixels for the encoder.
 */

import type { RgbTriple } from "./encode-gif";

export type FitMode = "contain" | "cover";

export interface FitRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

/** Destination rectangle that fits `srcW x srcH` into `dstW x dstH`. */
export function computeFitRect(
	srcW: number,
	srcH: number,
	dstW: number,
	dstH: number,
	mode: FitMode,
): FitRect {
	if (srcW <= 0 || srcH <= 0) return { x: 0, y: 0, width: dstW, height: dstH };
	const scaleX = dstW / srcW;
	const scaleY = dstH / srcH;
	const scale = mode === "contain" ? Math.min(scaleX, scaleY) : Math.max(scaleX, scaleY);
	const width = Math.round(srcW * scale);
	const height = Math.round(srcH * scale);
	return {
		x: Math.round((dstW - width) / 2),
		y: Math.round((dstH - height) / 2),
		width,
		height,
	};
}

/** "#rrggbb" (or "#rgb") to an rgb triple; falls back to white on bad input. */
export function hexToRgb(hex: string): RgbTriple {
	const clean = hex.trim().replace(/^#/, "");
	const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
	if (!/^[0-9a-fA-F]{6}$/.test(full)) return [255, 255, 255];
	const value = parseInt(full, 16);
	return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}

/** Loads an image from an object URL; rejects on decode failure. */
export function loadImageElement(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error("Could not decode image"));
		img.src = url;
	});
}

/** Natural size of a file via a temporary object URL (revoked before returning). */
export async function readImageSize(file: File): Promise<{ width: number; height: number }> {
	const url = URL.createObjectURL(file);
	try {
		const img = await loadImageElement(url);
		return { width: img.naturalWidth, height: img.naturalHeight };
	} finally {
		URL.revokeObjectURL(url);
	}
}

/**
 * Paints `image` onto `canvas` at `width x height` using the fit mode over a
 * solid background and returns the RGBA pixels.
 */
export function drawFrameToImageData(
	canvas: HTMLCanvasElement,
	image: HTMLImageElement,
	width: number,
	height: number,
	mode: FitMode,
	backgroundHex: string,
): ImageData {
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	if (!ctx) throw new Error("Canvas 2D context unavailable");
	ctx.fillStyle = backgroundHex;
	ctx.fillRect(0, 0, width, height);
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = "high";
	const rect = computeFitRect(image.naturalWidth, image.naturalHeight, width, height, mode);
	ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height);
	return ctx.getImageData(0, 0, width, height);
}
