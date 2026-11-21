"use client";

import {
	AlertCircle,
	Download,
	Eraser,
	ImageIcon,
	Loader2,
	Lock,
	Package,
	Scaling,
	Unlock,
	X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
	DS,
	ToolDropzone,
	ToolField,
	ToolFileBar,
	ToolGrid,
	ToolGridMain,
	ToolGridSide,
	ToolModeTabs,
	ToolPanel,
	ToolPreviewFrame,
	ToolSectionTitle,
	ToolShell,
} from "@/components/tools/shared/design-system";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
	computeOutputSize,
	type FitMode,
	formatBytes,
	formatPercentChange,
	heightForWidth,
	isEncodable,
	isLossy,
	isSupportedImage,
	MAX_FILE_BYTES,
	type OutputChoice,
	percentChange,
	RESIZE_PRESET_GROUPS,
	type ResizeMode,
	type ResizePreset,
	resolveOutputMime,
	type Size,
	widthForHeight,
} from "@/lib/image/resize-math";
import {
	errorMessage,
	readImageSize,
	type RenderOptions,
	type RenderResult,
	renderResized,
	triggerDownload,
} from "@/lib/image/resize-canvas";

type FileStatus = "pending" | "processing" | "done" | "error";

interface ResizeFile {
	id: string;
	file: File;
	previewUrl: string;
	width: number;
	height: number;
	status: FileStatus;
	result: RenderResult | null;
	error?: string;
}

interface ResizeSettings {
	mode: ResizeMode;
	pixel: Size;
	percent: Size;
	lockAspect: boolean;
	fit: FitMode;
	format: OutputChoice;
	quality: number;
}

const INITIAL_SETTINGS: ResizeSettings = {
	mode: "pixels",
	pixel: { width: 1200, height: 800 },
	percent: { width: 50, height: 50 },
	lockAspect: true,
	fit: "contain",
	format: "keep",
	quality: 90,
};

const MODE_TABS = [
	{ value: "pixels", label: "Pixels" },
	{ value: "percent", label: "Percentage" },
];

const STATUS_BADGE: Record<FileStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
	pending: { label: "Pending", variant: "outline" },
	processing: { label: "Resizing", variant: "secondary" },
	done: { label: "Done", variant: "default" },
	error: { label: "Error", variant: "destructive" },
};

const makeId = (): string =>
	typeof crypto !== "undefined" && "randomUUID" in crypto
		? crypto.randomUUID()
		: `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const yieldToEventLoop = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

function revokeEntry(entry: ResizeFile): void {
	URL.revokeObjectURL(entry.previewUrl);
	if (entry.result) URL.revokeObjectURL(entry.result.url);
}

function toRenderOptions(settings: ResizeSettings): RenderOptions {
	const dims = settings.mode === "pixels" ? settings.pixel : settings.percent;
	return {
		mode: settings.mode,
		width: dims.width,
		height: dims.height,
		lockAspect: settings.lockAspect,
		fit: settings.fit,
		format: settings.format,
		quality: settings.quality,
	};
}

export default function ImageResizerTool() {
	const [files, setFiles] = useState<ResizeFile[]>([]);
	const [settings, setSettings] = useState<ResizeSettings>(INITIAL_SETTINGS);
	const [isProcessing, setIsProcessing] = useState(false);
	const [progress, setProgress] = useState(0);
	const filesRef = useRef<ResizeFile[]>([]);

	useEffect(() => {
		filesRef.current = files;
	}, [files]);

	// Object URLs live until the file is removed, cleared or the tool unmounts.
	useEffect(() => () => filesRef.current.forEach(revokeEntry), []);

	const firstFile = files[0];
	const firstRatio = firstFile ? firstFile.width / firstFile.height : null;
	const dims = settings.mode === "pixels" ? settings.pixel : settings.percent;
	const unit = settings.mode === "pixels" ? "px" : "%";

	const previewSize: Size | null = firstFile
		? computeOutputSize({
				sourceWidth: firstFile.width,
				sourceHeight: firstFile.height,
				mode: settings.mode,
				width: dims.width,
				height: dims.height,
				lockAspect: settings.lockAspect,
				fit: settings.fit,
			})
		: null;

	const effectiveMimes = files.map((entry) => resolveOutputMime(entry.file.type, settings.format));
	const showQuality =
		settings.format === "image/jpeg" ||
		settings.format === "image/webp" ||
		(settings.format === "keep" && effectiveMimes.some(isLossy));
	const nonEncodableNames = files
		.filter((entry) => !isEncodable(entry.file.type.toLowerCase()))
		.map((entry) => entry.file.name);
	const keepHint =
		settings.format === "keep" && nonEncodableNames.length > 0
			? `GIF, BMP, AVIF and SVG cannot be re-encoded by the browser; ${nonEncodableNames.length === 1 ? "that file" : `${nonEncodableNames.length} files`} will be saved as PNG.`
			: undefined;

	const doneFiles = files.filter((entry) => entry.status === "done" && entry.result);

	const updateDims = useCallback((next: Size) => {
		setSettings((prev) =>
			prev.mode === "pixels" ? { ...prev, pixel: next } : { ...prev, percent: next },
		);
	}, []);

	const handleWidthChange = (raw: string) => {
		const width = Math.max(0, parseInt(raw, 10) || 0);
		if (!settings.lockAspect) {
			updateDims({ ...dims, width });
			return;
		}
		if (settings.mode === "percent") {
			updateDims({ width, height: width });
			return;
		}
		updateDims({ width, height: firstRatio ? heightForWidth(width, firstRatio) : dims.height });
	};

	const handleHeightChange = (raw: string) => {
		const height = Math.max(0, parseInt(raw, 10) || 0);
		if (!settings.lockAspect) {
			updateDims({ ...dims, height });
			return;
		}
		if (settings.mode === "percent") {
			updateDims({ width: height, height });
			return;
		}
		updateDims({ height, width: firstRatio ? widthForHeight(height, firstRatio) : dims.width });
	};

	const handleLockChange = (lockAspect: boolean) => {
		setSettings((prev) => {
			if (!lockAspect) return { ...prev, lockAspect };
			if (prev.mode === "percent") {
				return { ...prev, lockAspect, percent: { ...prev.percent, height: prev.percent.width } };
			}
			if (!firstRatio) return { ...prev, lockAspect };
			return {
				...prev,
				lockAspect,
				pixel: { ...prev.pixel, height: heightForWidth(prev.pixel.width, firstRatio) },
			};
		});
	};

	const applyPreset = (preset: ResizePreset) => {
		setSettings((prev) => ({
			...prev,
			mode: "pixels",
			lockAspect: false,
			fit: prev.fit === "contain" ? "cover" : prev.fit,
			pixel: { width: preset.width, height: preset.height },
		}));
		toast.success(`Preset applied: ${preset.width} × ${preset.height}`);
	};

	const handleFiles = useCallback(async (incoming: File[]) => {
		const accepted: ResizeFile[] = [];
		for (const file of incoming) {
			if (!isSupportedImage(file.type, file.name)) {
				toast.error(`${file.name}: unsupported format. Use JPEG, PNG, WebP, GIF, BMP, AVIF or SVG.`);
				continue;
			}
			if (file.size > MAX_FILE_BYTES) {
				toast.error(`${file.name}: larger than ${formatBytes(MAX_FILE_BYTES, 0)}.`);
				continue;
			}
			const previewUrl = URL.createObjectURL(file);
			try {
				const size = await readImageSize(file, previewUrl);
				accepted.push({
					id: makeId(),
					file,
					previewUrl,
					width: size.width,
					height: size.height,
					status: "pending",
					result: null,
				});
			} catch (error: unknown) {
				URL.revokeObjectURL(previewUrl);
				toast.error(`${file.name}: ${errorMessage(error)}`);
			}
		}
		if (accepted.length === 0) return;
		setFiles((prev) => [...prev, ...accepted]);
		setSettings((prev) => {
			if (prev.mode !== "pixels" || !prev.lockAspect || filesRef.current.length > 0) return prev;
			const lead = accepted[0];
			return { ...prev, pixel: { ...prev.pixel, height: heightForWidth(prev.pixel.width, lead.width / lead.height) } };
		});
	}, []);

	const removeFile = (id: string) => {
		setFiles((prev) => {
			const target = prev.find((entry) => entry.id === id);
			if (target) revokeEntry(target);
			return prev.filter((entry) => entry.id !== id);
		});
	};

	const clearAll = () => {
		setFiles((prev) => {
			prev.forEach(revokeEntry);
			return [];
		});
		setProgress(0);
	};

	const patchFile = (id: string, patch: Partial<ResizeFile>) =>
		setFiles((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));

	const resizeAll = async () => {
		if (files.length === 0 || isProcessing) return;
		const snapshot = toRenderOptions(settings);
		const queue = filesRef.current;
		setIsProcessing(true);
		setProgress(0);
		let failures = 0;

		for (let index = 0; index < queue.length; index += 1) {
			const entry = queue[index];
			if (entry.result) URL.revokeObjectURL(entry.result.url);
			patchFile(entry.id, { status: "processing", result: null, error: undefined });
			try {
				const result = await renderResized(entry.file, entry.previewUrl, snapshot);
				patchFile(entry.id, { status: "done", result });
			} catch (error: unknown) {
				failures += 1;
				patchFile(entry.id, { status: "error", error: errorMessage(error) });
			}
			setProgress(Math.round(((index + 1) / queue.length) * 100));
			await yieldToEventLoop();
		}

		setIsProcessing(false);
		if (failures === 0) {
			toast.success(queue.length === 1 ? "Image resized" : `${queue.length} images resized`);
		} else {
			toast.error(`${failures} of ${queue.length} image${queue.length === 1 ? "" : "s"} failed`);
		}
	};

	const downloadAll = async () => {
		if (doneFiles.length === 0) return;
		if (doneFiles.length === 1 && doneFiles[0].result) {
			triggerDownload(doneFiles[0].result.url, doneFiles[0].result.name);
			return;
		}
		try {
			const JSZip = (await import("jszip")).default;
			const zip = new JSZip();
			const used = new Set<string>();
			for (const entry of doneFiles) {
				if (!entry.result) continue;
				let name = entry.result.name;
				let counter = 2;
				while (used.has(name)) {
					name = entry.result.name.replace(/(\.[a-z0-9]+)$/i, `-${counter}$1`);
					counter += 1;
				}
				used.add(name);
				zip.file(name, entry.result.blob);
			}
			const archive = await zip.generateAsync({ type: "blob" });
			const url = URL.createObjectURL(archive);
			triggerDownload(url, `resized-images-${doneFiles.length}.zip`);
			setTimeout(() => URL.revokeObjectURL(url), 10_000);
		} catch (error: unknown) {
			toast.error(`Could not build the ZIP: ${errorMessage(error)}`);
		}
	};

	return (
		<ToolShell>
			<ToolDropzone
				title={files.length === 0 ? "Click or drag images here" : "Add more images"}
				subtitle="JPEG, PNG, WebP, GIF, BMP, AVIF or SVG · up to 50 MB each · processed in your browser"
				accept="image/*"
				multiple
				onFiles={handleFiles}
				disabled={isProcessing}
				icon={<ImageIcon aria-hidden="true" className="h-7 w-7 text-(--color-text-primary)" />}
			/>

			<ToolGrid>
				<ToolGridMain>
					<ToolPanel>
						<div className="flex items-center justify-between gap-3 flex-wrap">
							<ToolSectionTitle
								icon={<ImageIcon aria-hidden="true" className="h-3.5 w-3.5" />}
								title={files.length === 0 ? "Images" : `Images (${files.length})`}
								description={
									files.length === 0
										? "Your queue is empty. Drop images above to start."
										: undefined
								}
							/>
							{files.length > 0 && (
								<Button
									variant="ghost"
									size="sm"
									onClick={clearAll}
									disabled={isProcessing}
									type="button"
								>
									<Eraser aria-hidden="true" className="h-4 w-4" />
									Clear all
								</Button>
							)}
						</div>

						{files.length > 0 && (
							<ul className="space-y-3" aria-label="Images to resize">
								{files.map((entry) => (
									<FileRow
										key={entry.id}
										entry={entry}
										disabled={isProcessing}
										onRemove={() => removeFile(entry.id)}
									/>
								))}
							</ul>
						)}

						{files.length > 0 && (
							<div className={DS.panel.divider}>
								{isProcessing && (
									<div className="space-y-2 mb-4">
										<Progress value={progress} aria-label="Resize progress" />
										<p className="text-xs text-(--color-text-secondary)">Resizing… {progress}%</p>
									</div>
								)}
								<div className={DS.actionRow}>
									<Button onClick={resizeAll} disabled={isProcessing} type="button">
										{isProcessing ? (
											<Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
										) : (
											<Scaling aria-hidden="true" className="h-4 w-4" />
										)}
										{isProcessing ? "Resizing…" : files.length === 1 ? "Resize image" : "Resize all"}
									</Button>
									<Button
										variant="outline"
										onClick={downloadAll}
										disabled={isProcessing || doneFiles.length === 0}
										type="button"
									>
										{doneFiles.length > 1 ? (
											<Package aria-hidden="true" className="h-4 w-4" />
										) : (
											<Download aria-hidden="true" className="h-4 w-4" />
										)}
										{doneFiles.length > 1 ? `Download all (${doneFiles.length}) as ZIP` : "Download"}
									</Button>
								</div>
							</div>
						)}
					</ToolPanel>
				</ToolGridMain>

				<ToolGridSide>
					<ToolPanel>
						<ToolSectionTitle
							icon={<Scaling aria-hidden="true" className="h-3.5 w-3.5" />}
							title="Resize settings"
						/>

						<ToolModeTabs
							tabs={MODE_TABS}
							value={settings.mode}
							ariaLabel="Resize by"
							onChange={(value) => setSettings((prev) => ({ ...prev, mode: value as ResizeMode }))}
						/>

						<div className="grid grid-cols-2 gap-3">
							<ToolField
								label={`Width (${unit})`}
								fieldId="resize-width"
								type="number"
								min={1}
								inputMode="numeric"
								value={dims.width === 0 ? "" : dims.width}
								onChange={(event) => handleWidthChange(event.target.value)}
							/>
							<ToolField
								label={`Height (${unit})`}
								fieldId="resize-height"
								type="number"
								min={1}
								inputMode="numeric"
								value={dims.height === 0 ? "" : dims.height}
								onChange={(event) => handleHeightChange(event.target.value)}
							/>
						</div>

						<div className="flex items-center justify-between gap-3">
							<label htmlFor="resize-lock" className="flex items-center gap-2 text-sm text-(--color-text-primary)">
								{settings.lockAspect ? (
									<Lock aria-hidden="true" className="h-4 w-4" />
								) : (
									<Unlock aria-hidden="true" className="h-4 w-4" />
								)}
								Lock aspect ratio
							</label>
							<Switch
								id="resize-lock"
								checked={settings.lockAspect}
								onCheckedChange={handleLockChange}
								aria-label="Lock aspect ratio"
							/>
						</div>

						<ToolField label="Fit" fieldId="resize-fit">
							<Select
								value={settings.fit}
								onValueChange={(value) => setSettings((prev) => ({ ...prev, fit: value as FitMode }))}
							>
								<SelectTrigger id="resize-fit" className="w-full" aria-label="Fit mode">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="stretch">Exact size (stretch)</SelectItem>
									<SelectItem value="contain">Fit inside (keep ratio)</SelectItem>
									<SelectItem value="cover">Fill and crop (cover)</SelectItem>
								</SelectContent>
							</Select>
						</ToolField>

						<ToolField label="Output format" fieldId="resize-format" hint={keepHint}>
							<Select
								value={settings.format}
								onValueChange={(value) =>
									setSettings((prev) => ({ ...prev, format: value as OutputChoice }))
								}
							>
								<SelectTrigger id="resize-format" className="w-full" aria-label="Output format">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="keep">Keep original</SelectItem>
									<SelectItem value="image/jpeg">JPEG</SelectItem>
									<SelectItem value="image/png">PNG</SelectItem>
									<SelectItem value="image/webp">WebP</SelectItem>
								</SelectContent>
							</Select>
						</ToolField>

						{showQuality && (
							<div className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span className="text-(--color-text-primary)">Quality</span>
									<span className="font-mono text-xs text-(--color-text-secondary)">{settings.quality}%</span>
								</div>
								<Slider
									id="resize-quality"
									aria-label="Output quality"
									min={10}
									max={100}
									step={1}
									value={[settings.quality]}
									onValueChange={([quality]) => setSettings((prev) => ({ ...prev, quality }))}
								/>
							</div>
						)}

						<ToolFileBar aria-live="polite">
							{firstFile && previewSize ? (
								<>
									<span>
										Output: <strong className="text-(--color-text-primary)">{previewSize.width} × {previewSize.height}</strong>
									</span>
									<span>
										from {firstFile.width} × {firstFile.height}
										{files.length > 1 ? ` (first of ${files.length})` : ""}
									</span>
								</>
							) : (
								<span>Output size appears here once an image is added.</span>
							)}
						</ToolFileBar>
					</ToolPanel>

					<ToolPanel>
						<ToolSectionTitle
							title="Social and web presets"
							description="Sets pixel mode and the exact size. Use “Fill and crop” to avoid distortion."
						/>
						<div className="space-y-3">
							{RESIZE_PRESET_GROUPS.map((group) => (
								<div key={group.platform} className="space-y-1.5">
									<p className="text-xs font-medium text-(--color-text-secondary)">{group.platform}</p>
									<div className="flex flex-wrap gap-1.5">
										{group.presets.map((preset) => (
											<Button
												key={preset.label}
												variant="outline"
												size="sm"
												type="button"
												className="text-xs"
												onClick={() => applyPreset(preset)}
												disabled={isProcessing}
											>
												{preset.label}
											</Button>
										))}
									</div>
								</div>
							))}
						</div>
					</ToolPanel>
				</ToolGridSide>
			</ToolGrid>
		</ToolShell>
	);
}

interface FileRowProps {
	entry: ResizeFile;
	disabled: boolean;
	onRemove: () => void;
}

function FileRow({ entry, disabled, onRemove }: FileRowProps) {
	const badge = STATUS_BADGE[entry.status];
	const change = entry.result ? percentChange(entry.file.size, entry.result.blob.size) : null;

	return (
		<li>
			<ToolPreviewFrame className="p-3 flex items-center gap-3">
				<div className="relative shrink-0">
					<img
						src={entry.result?.url ?? entry.previewUrl}
						alt=""
						width={56}
						height={56}
						className={`h-14 w-14 object-cover ${DS.radius.lg} border border-(--color-border) bg-(--color-background-card)`}
					/>
					{entry.status === "processing" && (
						<div className={`absolute inset-0 flex items-center justify-center bg-black/50 ${DS.radius.lg}`}>
							<Loader2 aria-hidden="true" className="h-4 w-4 text-white animate-spin" />
						</div>
					)}
				</div>

				<div className="min-w-0 flex-1 space-y-0.5">
					<p className="truncate text-sm font-medium text-(--color-text-primary)" title={entry.file.name}>
						{entry.file.name}
					</p>
					<p className="text-xs text-(--color-text-secondary)">
						{entry.width} × {entry.height} · {formatBytes(entry.file.size)}
					</p>
					{entry.result && change !== null && (
						<p className="text-xs text-(--color-text-primary)">
							→ {entry.result.width} × {entry.result.height} · {formatBytes(entry.result.blob.size)}{" "}
							<span className={change <= 0 ? "text-(--color-text-success)" : "text-(--color-text-secondary)"}>
								({formatPercentChange(change)})
							</span>
						</p>
					)}
					{entry.status === "error" && entry.error && (
						<p className="flex items-center gap-1 text-xs text-(--color-text-error)">
							<AlertCircle aria-hidden="true" className="h-3 w-3 shrink-0" />
							{entry.error}
						</p>
					)}
				</div>

				<div className="flex items-center gap-1.5 shrink-0">
					<Badge variant={badge.variant}>{badge.label}</Badge>
					{entry.result && (
						<Button asChild variant="outline" size="icon" aria-label={`Download ${entry.result.name}`}>
							<a href={entry.result.url} download={entry.result.name}>
								<Download aria-hidden="true" className="h-4 w-4" />
							</a>
						</Button>
					)}
					<Button
						variant="ghost"
						size="icon"
						type="button"
						aria-label={`Remove ${entry.file.name}`}
						onClick={onRemove}
						disabled={disabled}
					>
						<X aria-hidden="true" className="h-4 w-4" />
					</Button>
				</div>
			</ToolPreviewFrame>
		</li>
	);
}
