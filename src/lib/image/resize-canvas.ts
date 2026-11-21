/**
 * @file src/lib/image/resize-canvas.ts
 * @description Browser-side rendering for the Image Resizer: decode an image
 * (createImageBitmap with <img> fallback, always settling), draw it onto a
 * canvas using the pure math in ./resize-math (two-step resample for large
 * downscales), and encode it with `canvas.toBlob`. Client-only.
 */

import {
	computeDrawRect,
	computeOutputSize,
	type EncodableMime,
	type FitMode,
	intermediateDownscaleSize,
	isLossy,
	type OutputChoice,
	outputFileName,
	resolveOutputMime,
	type ResizeMode,
	type Size,
} from "./resize-math";

export type Drawable = ImageBitmap | HTMLImageElement;

export interface RenderOptions {
	mode: ResizeMode;
	width: number;
	height: number;
	lockAspect: boolean;
	fit: FitMode;
	format: OutputChoice;
	/** 10–100, applied to JPEG/WebP only. */
	quality: number;
}

export interface RenderResult {
	blob: Blob;
	/** Object URL for `blob`; the caller owns it and must revoke it. */
	url: string;
	name: string;
	width: number;
	height: number;
}

export const errorMessage = (error: unknown): string =>
	error instanceof Error ? error.message : "Unexpected error";

/** Decodes an image via an object URL; always settles. */
export function loadImageElement(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error("The browser could not decode this image."));
		img.src = url;
	});
}

/** Prefers `createImageBitmap` (off-main-thread decode); falls back to <img>. */
export async function loadDrawable(file: File, url: string): Promise<Drawable> {
	if (file.type !== "image/svg+xml" && typeof createImageBitmap === "function") {
		try {
			return await createImageBitmap(file);
		} catch {
			// Fall through to the <img> path (e.g. unsupported container).
		}
	}
	return loadImageElement(url);
}

export const drawableSize = (drawable: Drawable): Size =>
	drawable instanceof HTMLImageElement
		? { width: drawable.naturalWidth, height: drawable.naturalHeight }
		: { width: drawable.width, height: drawable.height };

export const releaseDrawable = (drawable: Drawable): void => {
	if (!(drawable instanceof HTMLImageElement)) drawable.close();
};

/** Reads intrinsic dimensions, releasing the decoded bitmap afterwards. */
export async function readImageSize(file: File, url: string): Promise<Size> {
	const drawable = await loadDrawable(file, url);
	const size = drawableSize(drawable);
	releaseDrawable(drawable);
	if (size.width < 1 || size.height < 1) {
		throw new Error("The image has no intrinsic size.");
	}
	return size;
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: EncodableMime, quality: number): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => (blob ? resolve(blob) : reject(new Error(`Could not encode ${mime}.`))),
			mime,
			isLossy(mime) ? quality / 100 : undefined,
		);
	});
}

function makeCanvas(size: Size): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
	const canvas = document.createElement("canvas");
	canvas.width = size.width;
	canvas.height = size.height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas 2D is not available in this browser.");
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = "high";
	return { canvas, ctx };
}

/** Resizes `file` according to `options`; rejects instead of hanging. */
export async function renderResized(
	file: File,
	previewUrl: string,
	options: RenderOptions,
): Promise<RenderResult> {
	const drawable = await loadDrawable(file, previewUrl);
	try {
		const source = drawableSize(drawable);
		const output = computeOutputSize({
			sourceWidth: source.width,
			sourceHeight: source.height,
			mode: options.mode,
			width: options.width,
			height: options.height,
			lockAspect: options.lockAspect,
			fit: options.fit,
		});
		const rects = computeDrawRect({
			sourceWidth: source.width,
			sourceHeight: source.height,
			outputWidth: output.width,
			outputHeight: output.height,
			fit: options.fit,
		});
		const mime = resolveOutputMime(file.type, options.format);
		const { canvas, ctx } = makeCanvas(output);
		if (mime === "image/jpeg") {
			// JPEG has no alpha: flatten transparent inputs onto white.
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(0, 0, output.width, output.height);
		}

		const stageSize = intermediateDownscaleSize(
			{ width: rects.source.width, height: rects.source.height },
			{ width: rects.dest.width, height: rects.dest.height },
		);
		if (stageSize) {
			const stage = makeCanvas(stageSize);
			stage.ctx.drawImage(
				drawable,
				rects.source.x, rects.source.y, rects.source.width, rects.source.height,
				0, 0, stageSize.width, stageSize.height,
			);
			ctx.drawImage(
				stage.canvas,
				0, 0, stageSize.width, stageSize.height,
				rects.dest.x, rects.dest.y, rects.dest.width, rects.dest.height,
			);
		} else {
			ctx.drawImage(
				drawable,
				rects.source.x, rects.source.y, rects.source.width, rects.source.height,
				rects.dest.x, rects.dest.y, rects.dest.width, rects.dest.height,
			);
		}

		const blob = await canvasToBlob(canvas, mime, options.quality);
		return {
			blob,
			url: URL.createObjectURL(blob),
			name: outputFileName(file.name, output, mime),
			width: output.width,
			height: output.height,
		};
	} finally {
		releaseDrawable(drawable);
	}
}

export function triggerDownload(url: string, name: string): void {
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = name;
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
}
