"use client";

import {
	ArrowDownIcon,
	ArrowUpIcon,
	CopyIcon,
	DownloadIcon,
	FilmIcon,
	ImagesIcon,
	Loader2Icon,
	PaletteIcon,
	PlayIcon,
	Trash2Icon,
	TimerIcon,
	ScalingIcon,
	XIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
	DS,
	ToolDropzone,
	ToolField,
	ToolGrid,
	ToolGridMain,
	ToolGridSide,
	ToolModeTabs,
	ToolPanel,
	ToolPreviewFrame,
	ToolSectionTitle,
	ToolShell,
} from "@/components/tools/shared/design-system";
import { assembleGif, encodeGifFrame, encodeGifHeader } from "@/lib/gif/encode-gif";
import {
	drawFrameToImageData,
	hexToRgb,
	loadImageElement,
	type FitMode,
} from "@/lib/gif/draw-frame";

/* ------------------------------------------------------------------ */
/* Constants & types                                                   */
/* ------------------------------------------------------------------ */

const DELAY_MIN_MS = 50;
const DELAY_MAX_MS = 2000;
const DELAY_STEP_MS = 10;
const DIMENSION_MIN = 16;
const DIMENSION_MAX = 2048;
/** Longest side used for the default output size of the first frame. */
const DEFAULT_MAX_SIDE = 600;
const MIN_FRAMES = 2;
const COLOR_OPTIONS = ["256", "128", "64", "32"] as const;
const FIT_TABS = [
	{ value: "contain", label: "Fit inside" },
	{ value: "cover", label: "Fill and crop" },
];

interface Frame {
	id: string;
	name: string;
	file: File;
	url: string;
	width: number;
	height: number;
}

interface GifResult {
	url: string;
	bytes: number;
	frameCount: number;
	width: number;
	height: number;
}

const makeId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const clampDimension = (value: number): number =>
	Math.min(DIMENSION_MAX, Math.max(DIMENSION_MIN, Math.round(value)));

const formatKb = (bytes: number): string => `${(bytes / 1024).toFixed(1)} KB`;

const yieldToBrowser = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

/** Default output size: natural size scaled so the longest side is ≤ DEFAULT_MAX_SIDE. */
function defaultOutputSize(width: number, height: number): { width: number; height: number } {
	const longest = Math.max(width, height);
	const scale = longest > DEFAULT_MAX_SIDE ? DEFAULT_MAX_SIDE / longest : 1;
	return { width: clampDimension(width * scale), height: clampDimension(height * scale) };
}

/* ------------------------------------------------------------------ */
/* Frame row                                                           */
/* ------------------------------------------------------------------ */

interface FrameRowProps {
	frame: Frame;
	index: number;
	total: number;
	disabled: boolean;
	onMove: (index: number, direction: -1 | 1) => void;
	onDuplicate: (index: number) => void;
	onRemove: (index: number) => void;
}

function FrameRow({ frame, index, total, disabled, onMove, onDuplicate, onRemove }: FrameRowProps) {
	return (
		<li className="flex items-center gap-3 p-2 border border-(--color-border) bg-(--color-background-muted) rounded-lg">
			<span className="w-6 shrink-0 text-center text-[11px] font-mono text-(--color-text-secondary)">
				{index + 1}
			</span>
			<img
				src={frame.url}
				alt={`Frame ${index + 1}: ${frame.name}`}
				width={48}
				height={48}
				className="h-12 w-12 shrink-0 object-cover rounded-lg border border-(--color-border) bg-(--color-background-card)"
			/>
			<div className="min-w-0 flex-1">
				<p className="truncate text-xs font-semibold text-(--color-text-primary)">{frame.name}</p>
				<p className="text-[11px] text-(--color-text-secondary)">
					{frame.width} × {frame.height} px
				</p>
			</div>
			<div className="flex items-center gap-0.5">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					aria-label={`Move frame ${index + 1} up`}
					disabled={disabled || index === 0}
					onClick={() => onMove(index, -1)}
				>
					<ArrowUpIcon className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					aria-label={`Move frame ${index + 1} down`}
					disabled={disabled || index === total - 1}
					onClick={() => onMove(index, 1)}
				>
					<ArrowDownIcon className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					aria-label={`Duplicate frame ${index + 1}`}
					disabled={disabled}
					onClick={() => onDuplicate(index)}
				>
					<CopyIcon className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					aria-label={`Remove frame ${index + 1}`}
					disabled={disabled}
					onClick={() => onRemove(index)}
				>
					<XIcon className="h-4 w-4" />
				</Button>
			</div>
		</li>
	);
}

/* ------------------------------------------------------------------ */
/* Tool                                                                */
/* ------------------------------------------------------------------ */

export default function GifGeneratorTool() {
	const [frames, setFrames] = useState<Frame[]>([]);
	const [delayMs, setDelayMs] = useState(300);
	const [width, setWidth] = useState(400);
	const [height, setHeight] = useState(400);
	const [lockRatio, setLockRatio] = useState(true);
	const [fitMode, setFitMode] = useState<FitMode>("contain");
	const [background, setBackground] = useState("#ffffff");
	const [maxColors, setMaxColors] = useState<(typeof COLOR_OPTIONS)[number]>("256");
	const [dither, setDither] = useState(true);
	const [loop, setLoop] = useState(true);
	const [isGenerating, setIsGenerating] = useState(false);
	const [progress, setProgress] = useState(0);
	const [result, setResult] = useState<GifResult | null>(null);

	// Mirrors for unmount cleanup of object URLs.
	const framesRef = useRef<Frame[]>([]);
	const resultUrlRef = useRef<string | null>(null);
	const sizeInitializedRef = useRef(false);

	useEffect(() => {
		framesRef.current = frames;
	}, [frames]);
	useEffect(() => {
		resultUrlRef.current = result?.url ?? null;
	}, [result]);
	useEffect(() => {
		return () => {
			framesRef.current.forEach((frame) => URL.revokeObjectURL(frame.url));
			if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
		};
	}, []);

	const ratio = frames.length > 0 && frames[0].height > 0 ? frames[0].width / frames[0].height : 1;

	const clearResult = useCallback(() => {
		setResult((previous) => {
			if (previous) URL.revokeObjectURL(previous.url);
			return null;
		});
	}, []);

	/* ---------------- frames ---------------- */

	const addFiles = useCallback(
		async (files: File[]) => {
			const images = files.filter((file) => file.type.startsWith("image/"));
			if (images.length === 0) {
				toast.error("Only image files can be used as frames.");
				return;
			}
			const loaded: Frame[] = [];
			for (const file of images) {
				const url = URL.createObjectURL(file);
				try {
					const img = await loadImageElement(url);
					loaded.push({
						id: makeId(),
						name: file.name,
						file,
						url,
						width: img.naturalWidth,
						height: img.naturalHeight,
					});
				} catch {
					URL.revokeObjectURL(url);
					toast.error(`Could not read ${file.name}.`);
				}
			}
			if (loaded.length === 0) return;
			if (!sizeInitializedRef.current) {
				const size = defaultOutputSize(loaded[0].width, loaded[0].height);
				setWidth(size.width);
				setHeight(size.height);
				sizeInitializedRef.current = true;
			}
			setFrames((previous) => [...previous, ...loaded]);
			clearResult();
			toast.success(`Added ${loaded.length} frame${loaded.length === 1 ? "" : "s"}.`);
		},
		[clearResult],
	);

	const moveFrame = useCallback(
		(index: number, direction: -1 | 1) => {
			setFrames((previous) => {
				const target = index + direction;
				if (target < 0 || target >= previous.length) return previous;
				const next = [...previous];
				[next[index], next[target]] = [next[target], next[index]];
				return next;
			});
			clearResult();
		},
		[clearResult],
	);

	const duplicateFrame = useCallback(
		(index: number) => {
			const source = frames[index];
			if (!source) return;
			// Own object URL per frame so removing either copy never breaks the other.
			const copy: Frame = { ...source, id: makeId(), url: URL.createObjectURL(source.file) };
			setFrames((previous) => [...previous.slice(0, index + 1), copy, ...previous.slice(index + 1)]);
			clearResult();
		},
		[frames, clearResult],
	);

	const removeFrame = useCallback(
		(index: number) => {
			setFrames((previous) => {
				const target = previous[index];
				if (target) URL.revokeObjectURL(target.url);
				return previous.filter((_, i) => i !== index);
			});
			clearResult();
		},
		[clearResult],
	);

	const clearAll = useCallback(() => {
		setFrames((previous) => {
			previous.forEach((frame) => URL.revokeObjectURL(frame.url));
			return [];
		});
		clearResult();
		setProgress(0);
		sizeInitializedRef.current = false;
	}, [clearResult]);

	/* ---------------- settings ---------------- */

	const handleWidthChange = (value: number) => {
		if (!Number.isFinite(value)) return;
		const nextWidth = clampDimension(value);
		setWidth(nextWidth);
		if (lockRatio) setHeight(clampDimension(nextWidth / ratio));
	};

	const handleHeightChange = (value: number) => {
		if (!Number.isFinite(value)) return;
		const nextHeight = clampDimension(value);
		setHeight(nextHeight);
		if (lockRatio) setWidth(clampDimension(nextHeight * ratio));
	};

	const handleLockChange = (checked: boolean) => {
		setLockRatio(checked);
		if (checked) setHeight(clampDimension(width / ratio));
	};

	const handleDelayChange = (value: number) => {
		if (!Number.isFinite(value)) return;
		setDelayMs(Math.min(DELAY_MAX_MS, Math.max(DELAY_MIN_MS, Math.round(value))));
	};

	/* ---------------- encode ---------------- */

	const generate = async () => {
		if (frames.length < MIN_FRAMES) {
			toast.error(`Add at least ${MIN_FRAMES} frames to build an animation.`);
			return;
		}
		setIsGenerating(true);
		setProgress(0);
		clearResult();
		try {
			const canvas = document.createElement("canvas");
			const header = encodeGifHeader(width, height, loop);
			const backgroundRgb = hexToRgb(background);
			const chunks: Uint8Array[] = [];
			for (let i = 0; i < frames.length; i++) {
				const image = await loadImageElement(frames[i].url);
				const pixels = drawFrameToImageData(canvas, image, width, height, fitMode, background);
				chunks.push(
					encodeGifFrame(
						{ rgba: pixels.data, width, height },
						{ delayMs, maxColors: Number(maxColors), dither, background: backgroundRgb },
					),
				);
				setProgress(Math.round(((i + 1) / frames.length) * 100));
				await yieldToBrowser();
			}
			const bytes = assembleGif(header, chunks);
			const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
			const blob = new Blob([buffer], { type: "image/gif" });
			setResult({
				url: URL.createObjectURL(blob),
				bytes: blob.size,
				frameCount: frames.length,
				width,
				height,
			});
			toast.success("GIF ready.");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unexpected error";
			toast.error(`GIF encoding failed: ${message}`);
		} finally {
			setIsGenerating(false);
		}
	};

	const canGenerate = frames.length >= MIN_FRAMES && !isGenerating;
	const totalDurationSeconds = ((frames.length * delayMs) / 1000).toFixed(1);

	/* ---------------- render ---------------- */

	return (
		<ToolShell>
			<ToolGrid>
				<ToolGridMain>
					<ToolDropzone
						title={frames.length === 0 ? "Drop your image frames here" : "Add more frames"}
						subtitle="PNG, JPG, WebP or GIF stills. Select several at once; order them below."
						accept="image/*"
						multiple
						onFiles={addFiles}
						disabled={isGenerating}
						icon={<ImagesIcon aria-hidden="true" className="h-7 w-7" />}
					/>

					<ToolPanel>
						<div className="flex items-center justify-between gap-3">
							<ToolSectionTitle icon={<FilmIcon aria-hidden="true" className="h-3.5 w-3.5" />}>
								Frames ({frames.length})
							</ToolSectionTitle>
							{frames.length > 0 && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									disabled={isGenerating}
									onClick={clearAll}
								>
									<Trash2Icon aria-hidden="true" className="h-4 w-4" />
									Clear all
								</Button>
							)}
						</div>
						{frames.length === 0 ? (
							<p className="text-sm text-(--color-text-secondary)">
								No frames yet. Each image becomes one frame; you need at least {MIN_FRAMES}.
							</p>
						) : (
							<ul className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
								{frames.map((frame, index) => (
									<FrameRow
										key={frame.id}
										frame={frame}
										index={index}
										total={frames.length}
										disabled={isGenerating}
										onMove={moveFrame}
										onDuplicate={duplicateFrame}
										onRemove={removeFrame}
									/>
								))}
							</ul>
						)}
						{frames.length > 0 && (
							<p className="text-xs text-(--color-text-secondary)">
								{frames.length} frames × {delayMs} ms ≈ {totalDurationSeconds}s per loop
							</p>
						)}
					</ToolPanel>

					{result && (
						<ToolPanel>
							<ToolSectionTitle icon={<PlayIcon aria-hidden="true" className="h-3.5 w-3.5" />}>
								Result
							</ToolSectionTitle>
							<ToolPreviewFrame className="flex items-center justify-center">
								<img
									src={result.url}
									alt={`Animated GIF preview, ${result.frameCount} frames`}
									width={result.width}
									height={result.height}
									className="max-h-[360px] w-auto max-w-full object-contain rounded-lg"
								/>
							</ToolPreviewFrame>
							<div className={DS.actionRow}>
								<p className="text-xs text-(--color-text-secondary)">
									{formatKb(result.bytes)} · {result.frameCount} frames · {result.width} × {result.height} px
								</p>
								<Button asChild>
									<a href={result.url} download="animation.gif">
										<DownloadIcon aria-hidden="true" className="h-4 w-4" />
										Download GIF
									</a>
								</Button>
							</div>
						</ToolPanel>
					)}
				</ToolGridMain>

				<ToolGridSide>
					<ToolPanel>
						<ToolSectionTitle icon={<TimerIcon aria-hidden="true" className="h-3.5 w-3.5" />}>
							Timing
						</ToolSectionTitle>
						<ToolField label="Frame delay (ms)" fieldId="gif-delay" hint="Time each frame stays on screen.">
							<div className="flex items-center gap-3">
								<Slider
									aria-label="Frame delay in milliseconds"
									min={DELAY_MIN_MS}
									max={DELAY_MAX_MS}
									step={DELAY_STEP_MS}
									value={[delayMs]}
									onValueChange={([value]) => handleDelayChange(value)}
									disabled={isGenerating}
									className="flex-1"
								/>
								<Input
									id="gif-delay"
									type="number"
									min={DELAY_MIN_MS}
									max={DELAY_MAX_MS}
									step={DELAY_STEP_MS}
									value={delayMs}
									onChange={(event) => handleDelayChange(Number(event.target.value))}
									disabled={isGenerating}
									className="w-24"
								/>
							</div>
						</ToolField>
					</ToolPanel>

					<ToolPanel>
						<ToolSectionTitle icon={<ScalingIcon aria-hidden="true" className="h-3.5 w-3.5" />}>
							Output size
						</ToolSectionTitle>
						<div className="grid grid-cols-2 gap-3">
							<ToolField
								label="Width (px)"
								fieldId="gif-width"
								type="number"
								min={DIMENSION_MIN}
								max={DIMENSION_MAX}
								value={width}
								onChange={(event) => handleWidthChange(Number(event.target.value))}
								disabled={isGenerating}
							/>
							<ToolField
								label="Height (px)"
								fieldId="gif-height"
								type="number"
								min={DIMENSION_MIN}
								max={DIMENSION_MAX}
								value={height}
								onChange={(event) => handleHeightChange(Number(event.target.value))}
								disabled={isGenerating}
							/>
						</div>
						<div className="flex items-center justify-between gap-3">
							<Label htmlFor="gif-lock-ratio" className="text-sm">
								Lock aspect ratio
							</Label>
							<Switch
								id="gif-lock-ratio"
								aria-label="Lock aspect ratio to the first frame"
								checked={lockRatio}
								onCheckedChange={handleLockChange}
								disabled={isGenerating}
							/>
						</div>
						<div className="space-y-1.5">
							<span className="text-sm font-medium text-(--color-text-primary)">Fit mode</span>
							<ToolModeTabs
								ariaLabel="Fit mode"
								tabs={FIT_TABS}
								value={fitMode}
								onChange={(value) => setFitMode(value === "cover" ? "cover" : "contain")}
							/>
							<p className="text-xs text-(--color-text-secondary)">
								{fitMode === "contain"
									? "Whole image visible; empty space filled with the background colour."
									: "Image fills the canvas; edges are cropped."}
							</p>
						</div>
						<ToolField
							label="Background colour"
							fieldId="gif-background"
							type="color"
							value={background}
							onChange={(event) => setBackground(event.target.value)}
							disabled={isGenerating}
							hint="Used for letterboxing and under transparent pixels."
							className="[&_input]:h-10 [&_input]:w-full"
						/>
					</ToolPanel>

					<ToolPanel>
						<ToolSectionTitle icon={<PaletteIcon aria-hidden="true" className="h-3.5 w-3.5" />}>
							Palette & playback
						</ToolSectionTitle>
						<ToolField label="Colours per frame" fieldId="gif-colors" hint="Fewer colours mean a smaller file.">
							<Select
								value={maxColors}
								onValueChange={(value) => setMaxColors(value as (typeof COLOR_OPTIONS)[number])}
								disabled={isGenerating}
							>
								<SelectTrigger id="gif-colors" className="w-full">
									<SelectValue placeholder="Colours" />
								</SelectTrigger>
								<SelectContent>
									{COLOR_OPTIONS.map((option) => (
										<SelectItem key={option} value={option}>
											{option} colours
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</ToolField>
						<div className="flex items-center justify-between gap-3">
							<Label htmlFor="gif-dither" className="text-sm">
								Dithering
							</Label>
							<Switch
								id="gif-dither"
								aria-label="Floyd–Steinberg dithering"
								checked={dither}
								onCheckedChange={setDither}
								disabled={isGenerating}
							/>
						</div>
						<div className="flex items-center justify-between gap-3">
							<Label htmlFor="gif-loop" className="text-sm">
								Loop forever
							</Label>
							<Switch
								id="gif-loop"
								aria-label="Loop the animation forever"
								checked={loop}
								onCheckedChange={setLoop}
								disabled={isGenerating}
							/>
						</div>

						<div className={DS.panel.divider}>
							<Button type="button" className="w-full" disabled={!canGenerate} onClick={generate}>
								{isGenerating ? (
									<>
										<Loader2Icon aria-hidden="true" className="h-4 w-4 animate-spin" />
										Encoding {progress}%
									</>
								) : (
									<>
										<PlayIcon aria-hidden="true" className="h-4 w-4" />
										Generate GIF
									</>
								)}
							</Button>
							{frames.length < MIN_FRAMES && (
								<p className="mt-2 text-xs text-(--color-text-secondary)">
									Add {MIN_FRAMES - frames.length} more frame{MIN_FRAMES - frames.length === 1 ? "" : "s"} to enable.
								</p>
							)}
							{isGenerating && (
								<div className="mt-3">
									<Progress value={progress} aria-label="GIF encoding progress" />
								</div>
							)}
						</div>
					</ToolPanel>
				</ToolGridSide>
			</ToolGrid>
		</ToolShell>
	);
}
