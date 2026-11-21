/**
 * @file src/lib/image/resize-math.ts
 * @description Pure, DOM-free math for the Image Resizer tool: output size
 * resolution (pixels / percent, aspect lock, fit modes), draw rectangles for
 * letterbox / cover crops, MIME and filename resolution, and small formatting
 * helpers. Everything here is unit-tested in tests/unit/resize-math.test.ts.
 */

export type ResizeMode = "pixels" | "percent";
export type FitMode = "stretch" | "contain" | "cover";
export type EncodableMime = "image/jpeg" | "image/png" | "image/webp";
export type OutputChoice = "keep" | EncodableMime;

export interface Size {
	width: number;
	height: number;
}

export interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface OutputSizeInput {
	sourceWidth: number;
	sourceHeight: number;
	mode: ResizeMode;
	/** Target width in px (pixels mode) or percent of the source (percent mode). */
	width: number;
	/** Target height in px (pixels mode) or percent of the source (percent mode). */
	height: number;
	lockAspect: boolean;
	fit: FitMode;
}

export interface DrawRectInput {
	sourceWidth: number;
	sourceHeight: number;
	outputWidth: number;
	outputHeight: number;
	fit: FitMode;
}

export interface DrawRects {
	/** Region of the source image to sample. */
	source: Rect;
	/** Region of the output canvas to paint into. */
	dest: Rect;
}

export interface ResizePreset {
	label: string;
	width: number;
	height: number;
}

export interface ResizePresetGroup {
	platform: string;
	presets: ResizePreset[];
}

/** Input formats the resizer accepts (decoded by the browser). */
export const SUPPORTED_INPUT_TYPES: ReadonlySet<string> = new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
	"image/bmp",
	"image/x-ms-bmp",
	"image/avif",
	"image/svg+xml",
]);

const SUPPORTED_EXTENSIONS: ReadonlySet<string> = new Set([
	"jpg",
	"jpeg",
	"png",
	"webp",
	"gif",
	"bmp",
	"avif",
	"svg",
]);

/** Formats a canvas can encode via `toBlob`. Everything else falls back to PNG. */
const ENCODABLE_MIMES: ReadonlySet<string> = new Set<EncodableMime>([
	"image/jpeg",
	"image/png",
	"image/webp",
]);

export const MAX_FILE_BYTES = 50 * 1024 * 1024;

/** Downscale factor above which a two-step resample is used for quality. */
export const TWO_STEP_DOWNSCALE_FACTOR = 2;

export const RESIZE_PRESET_GROUPS: readonly ResizePresetGroup[] = [
	{
		platform: "Instagram",
		presets: [
			{ label: "Square 1080×1080", width: 1080, height: 1080 },
			{ label: "Portrait 1080×1350", width: 1080, height: 1350 },
			{ label: "Story 1080×1920", width: 1080, height: 1920 },
		],
	},
	{
		platform: "Facebook",
		presets: [
			{ label: "Post 1200×630", width: 1200, height: 630 },
			{ label: "Cover 1640×859", width: 1640, height: 859 },
			{ label: "Profile 400×400", width: 400, height: 400 },
		],
	},
	{
		platform: "Twitter / X",
		presets: [
			{ label: "Post 1200×675", width: 1200, height: 675 },
			{ label: "Header 1500×500", width: 1500, height: 500 },
			{ label: "Profile 400×400", width: 400, height: 400 },
		],
	},
	{
		platform: "YouTube",
		presets: [
			{ label: "Thumbnail 1280×720", width: 1280, height: 720 },
			{ label: "Channel art 2560×1440", width: 2560, height: 1440 },
		],
	},
	{
		platform: "LinkedIn",
		presets: [
			{ label: "Post 1200×627", width: 1200, height: 627 },
			{ label: "Cover 1584×396", width: 1584, height: 396 },
		],
	},
];

const clampDimension = (value: number): number => {
	if (!Number.isFinite(value)) return 1;
	return Math.max(1, Math.round(value));
};

/** Largest size with `ratio` (w/h) that fits inside `box`. */
function fitRatioInside(box: Size, ratio: number): Size {
	if (box.width / box.height > ratio) {
		return { width: box.height * ratio, height: box.height };
	}
	return { width: box.width, height: box.width / ratio };
}

/**
 * Resolves the final canvas size. Percent mode scales the source; pixels mode
 * uses the fields directly. Locking the aspect ratio or choosing the
 * "contain" fit shrinks the target box to the source ratio. "stretch" and
 * "cover" keep the full target box. Dimensions are rounded and never < 1.
 */
export function computeOutputSize(input: OutputSizeInput): Size {
	const { sourceWidth, sourceHeight, mode, width, height, lockAspect, fit } = input;
	const target: Size =
		mode === "percent"
			? {
					width: (sourceWidth * width) / 100,
					height: (sourceHeight * height) / 100,
				}
			: { width, height };

	const box: Size = {
		width: clampDimension(target.width),
		height: clampDimension(target.height),
	};

	const keepRatio = lockAspect || fit === "contain";
	if (!keepRatio || sourceWidth <= 0 || sourceHeight <= 0) return box;

	const fitted = fitRatioInside(box, sourceWidth / sourceHeight);
	return {
		width: clampDimension(fitted.width),
		height: clampDimension(fitted.height),
	};
}

/**
 * Source / destination rectangles for `drawImage`. "stretch" maps the whole
 * source onto the whole canvas; "contain" letterboxes the source centred in
 * the canvas; "cover" crops a centred region of the source with the canvas
 * ratio and fills the canvas.
 */
export function computeDrawRect(input: DrawRectInput): DrawRects {
	const { sourceWidth, sourceHeight, outputWidth, outputHeight, fit } = input;
	const fullSource: Rect = { x: 0, y: 0, width: sourceWidth, height: sourceHeight };
	const fullDest: Rect = { x: 0, y: 0, width: outputWidth, height: outputHeight };

	if (fit === "stretch" || sourceWidth <= 0 || sourceHeight <= 0) {
		return { source: fullSource, dest: fullDest };
	}

	const sourceRatio = sourceWidth / sourceHeight;
	const outputRatio = outputWidth / outputHeight;

	if (fit === "contain") {
		const fitted = fitRatioInside({ width: outputWidth, height: outputHeight }, sourceRatio);
		const width = Math.round(fitted.width);
		const height = Math.round(fitted.height);
		return {
			source: fullSource,
			dest: {
				x: Math.round((outputWidth - width) / 2),
				y: Math.round((outputHeight - height) / 2),
				width,
				height,
			},
		};
	}

	// cover: crop the source to the output ratio, centred.
	const cropWidth = sourceRatio > outputRatio ? sourceHeight * outputRatio : sourceWidth;
	const cropHeight = sourceRatio > outputRatio ? sourceHeight : sourceWidth / outputRatio;
	return {
		source: {
			x: Math.round((sourceWidth - cropWidth) / 2),
			y: Math.round((sourceHeight - cropHeight) / 2),
			width: Math.round(cropWidth),
			height: Math.round(cropHeight),
		},
		dest: fullDest,
	};
}

/**
 * Intermediate canvas size for a two-step downscale, or null when the scale
 * factor is at or below `TWO_STEP_DOWNSCALE_FACTOR` in either axis.
 */
export function intermediateDownscaleSize(source: Size, dest: Size): Size | null {
	if (dest.width <= 0 || dest.height <= 0) return null;
	const factor = Math.min(source.width / dest.width, source.height / dest.height);
	if (factor <= TWO_STEP_DOWNSCALE_FACTOR) return null;
	return {
		width: clampDimension(dest.width * TWO_STEP_DOWNSCALE_FACTOR),
		height: clampDimension(dest.height * TWO_STEP_DOWNSCALE_FACTOR),
	};
}

/** Height that keeps `ratio` (w/h) for `width`, rounded, min 1. */
export function heightForWidth(width: number, ratio: number): number {
	if (!Number.isFinite(ratio) || ratio <= 0) return clampDimension(width);
	return clampDimension(width / ratio);
}

/** Width that keeps `ratio` (w/h) for `height`, rounded, min 1. */
export function widthForHeight(height: number, ratio: number): number {
	if (!Number.isFinite(ratio) || ratio <= 0) return clampDimension(height);
	return clampDimension(height * ratio);
}

export function fileExtension(name: string): string {
	const dot = name.lastIndexOf(".");
	return dot === -1 ? "" : name.slice(dot + 1).toLowerCase();
}

export function fileBasename(name: string): string {
	const dot = name.lastIndexOf(".");
	return dot <= 0 ? name : name.slice(0, dot);
}

/** Accepts by MIME type, falling back to the extension when the type is empty. */
export function isSupportedImage(type: string, name: string): boolean {
	if (type && SUPPORTED_INPUT_TYPES.has(type.toLowerCase())) return true;
	if (type) return false;
	return SUPPORTED_EXTENSIONS.has(fileExtension(name));
}

/** Whether the canvas can encode `type` natively (JPEG, PNG, WebP). */
export function isEncodable(type: string): type is EncodableMime {
	return ENCODABLE_MIMES.has(type);
}

/**
 * Output MIME: an explicit choice wins; "keep" returns the input type when the
 * canvas can encode it, otherwise PNG (GIF, BMP, AVIF, SVG inputs).
 */
export function resolveOutputMime(inputType: string, choice: OutputChoice): EncodableMime {
	if (choice !== "keep") return choice;
	const lower = inputType.toLowerCase();
	return isEncodable(lower) ? lower : "image/png";
}

export function outputExtension(mime: EncodableMime): string {
	switch (mime) {
		case "image/jpeg":
			return "jpg";
		case "image/webp":
			return "webp";
		default:
			return "png";
	}
}

export function isLossy(mime: EncodableMime): boolean {
	return mime === "image/jpeg" || mime === "image/webp";
}

/** `<basename>-<w>x<h>.<ext>` */
export function outputFileName(originalName: string, size: Size, mime: EncodableMime): string {
	const base = fileBasename(originalName).trim() || "image";
	return `${base}-${size.width}x${size.height}.${outputExtension(mime)}`;
}

export function formatBytes(bytes: number, decimals = 1): string {
	if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
	const units = ["B", "KB", "MB", "GB"];
	const index = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
	const value = bytes / 1024 ** index;
	return `${parseFloat(value.toFixed(index === 0 ? 0 : decimals))} ${units[index]}`;
}

/** Signed percent change from `before` to `after`; 0 when `before` is 0. */
export function percentChange(before: number, after: number): number {
	if (before <= 0 || !Number.isFinite(before)) return 0;
	return ((after - before) / before) * 100;
}

/** "−42%" / "+8%" / "±0%" for display. */
export function formatPercentChange(value: number): string {
	const rounded = Math.round(value);
	if (rounded === 0) return "±0%";
	return `${rounded > 0 ? "+" : "−"}${Math.abs(rounded)}%`;
}
