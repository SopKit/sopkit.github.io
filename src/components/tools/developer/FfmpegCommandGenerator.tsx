"use client";

import { useState, useMemo } from "react";
import { Copy, Check, Film, Terminal, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Workflow = "convert" | "compress" | "trim" | "extract-audio" | "make-gif" | "resize-scale" | "mute-video" | "frame-screenshot" | "concatenate";

interface FlagPart {
	flag: string;
	meaning: string;
}

const WORKFLOWS: { id: Workflow; label: string }[] = [
	{ id: "convert", label: "Convert" },
	{ id: "compress", label: "Compress" },
	{ id: "trim", label: "Trim" },
	{ id: "extract-audio", label: "Extract Audio" },
	{ id: "make-gif", label: "Make GIF" },
	{ id: "resize-scale", label: "Resize / Scale" },
	{ id: "mute-video", label: "Mute Video" },
	{ id: "frame-screenshot", label: "Frame Screenshot" },
	{ id: "concatenate", label: "Concatenate" },
];

const CRF_LABELS: Record<number, string> = {
	18: "high quality",
	23: "default",
	28: "small file",
};

function SelectField({
	label,
	value,
	onChange,
	options,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	options: { value: string; label: string }[];
}) {
	return (
		<div className="space-y-2">
			<Label className="text-xs font-semibold">{label}</Label>
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger className="w-full" aria-label={label}><SelectValue /></SelectTrigger>
				<SelectContent>
					{options.map((o) => (
						<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

export default function FfmpegCommandGenerator() {
	const [workflow, setWorkflow] = useState<Workflow>("convert");
	const [inputFile, setInputFile] = useState("input.mp4");
	const [videoCodec, setVideoCodec] = useState("libx264");
	const [audioCodec, setAudioCodec] = useState("aac");
	const [crf, setCrf] = useState(23);
	const [preset, setPreset] = useState("medium");
	const [resolution, setResolution] = useState("source");
	const [fps, setFps] = useState("source");
	const [audioBitrate, setAudioBitrate] = useState("128k");
	const [trimStart, setTrimStart] = useState("00:00:05");
	const [trimDuration, setTrimDuration] = useState("30");
	const [gifFps, setGifFps] = useState("15");
	const [gifWidth, setGifWidth] = useState("480");
	const [screenshotTime, setScreenshotTime] = useState("00:00:03");
	const [concatFiles, setConcatFiles] = useState(["clip1.mp4", "clip2.mp4"]);
	const [copied, setCopied] = useState(false);

	const baseName = useMemo(() => {
		const dot = inputFile.lastIndexOf(".");
		return dot > 0 ? inputFile.slice(0, dot) : inputFile || "input";
	}, [inputFile]);

	const outputName = useMemo(() => {
		switch (workflow) {
			case "compress": return `${baseName}_compressed.mp4`;
			case "trim": return `${baseName}_trimmed.mp4`;
			case "extract-audio": return audioCodec === "libmp3lame" ? `${baseName}.mp3` : audioCodec === "libopus" ? `${baseName}.opus` : `${baseName}.m4a`;
			case "make-gif": return `${baseName}.gif`;
			case "mute-video": return `${baseName}_muted.mp4`;
			case "frame-screenshot": return `${baseName}_frame.png`;
			case "concatenate": return "output.mp4";
			default: return `${baseName}_out.mp4`;
		}
	}, [workflow, baseName, audioCodec]);

	const build = useMemo((): { lines: string[]; parts: FlagPart[] } => {
		const parts: FlagPart[] = [];
		let head: FlagPart[];
		switch (workflow) {
			case "trim":
				head = [
					{ flag: "-ss " + trimStart, meaning: `jump to the start time (${trimStart}) before decoding, which is fast` },
					{ flag: "-t " + trimDuration, meaning: `keep ${trimDuration} seconds of footage from that point` },
					{ flag: "-i " + (inputFile || "input.mp4"), meaning: "the input file to read" },
				];
				break;
			case "frame-screenshot":
				head = [
					{ flag: "-ss " + screenshotTime, meaning: `seek to ${screenshotTime} in the source video` },
					{ flag: "-i " + (inputFile || "input.mp4"), meaning: "the input file to read" },
				];
				break;
			default:
				head = [{ flag: "-i " + (inputFile || "input.mp4"), meaning: "the input file to read" }];
		}

		const filters: string[] = [];
		if ((workflow === "convert" || workflow === "compress" || workflow === "resize-scale") && resolution !== "source") {
			filters.push(`scale=${resolution.split("x")[0]}:-2`);
		}
		if (fps !== "source" && workflow !== "make-gif" && workflow !== "extract-audio") {
			filters.push(`fps=${fps}`);
		}
		if (filters.length > 0) {
			parts.push({ flag: '-vf "' + filters.join(",") + '"', meaning: "video filters applied in order: resize keeping an even width, then frame rate" });
		}

		const needsVideoFlags = ["convert", "compress", "resize-scale"].includes(workflow) || (workflow === "trim" && filters.length > 0);
		const effectiveVideoCodec = videoCodec === "copy" && filters.length > 0 ? "libx264" : videoCodec;

		if (needsVideoFlags) {
			if (effectiveVideoCodec === "copy") {
				parts.push({ flag: "-c:v copy", meaning: "stream-copy the video without re-encoding (fastest, no quality loss)" });
			} else {
				parts.push(
					{ flag: "-c:v " + effectiveVideoCodec, meaning: `encode video with the ${effectiveVideoCodec} codec${videoCodec === "copy" ? " (filters force a re-encode)" : ""}` },
					{ flag: "-crf " + crf, meaning: `constant rate factor ${crf}: lower = better quality, larger file (${CRF_LABELS[crf] ?? "custom"})` },
					{ flag: "-preset " + preset, meaning: `encoding speed preset "${preset}" — slower presets compress better at the same quality` },
				);
			}
		}

		switch (workflow) {
			case "extract-audio":
				parts.push({ flag: "-vn", meaning: "drop the video stream entirely" });
				if (audioCodec !== "copy") {
					parts.push({ flag: "-c:a " + audioCodec, meaning: `encode audio with the ${audioCodec} codec` }, { flag: "-b:a " + audioBitrate, meaning: `target audio bitrate ${audioBitrate}` });
				} else {
					parts.push({ flag: "-c:a copy", meaning: "copy the audio track untouched into the new container" });
				}
				break;
			case "frame-screenshot":
				parts.push({ flag: "-frames:v 1", meaning: "stop after writing exactly one video frame" });
				break;
			case "concatenate":
				head = [
					{ flag: "-f concat", meaning: "use the concat demuxer, which reads a playlist file instead of a single input" },
					{ flag: "-safe 0", meaning: "allow absolute or unusual file paths listed inside list.txt" },
					{ flag: "-i list.txt", meaning: "the playlist file containing your clips, one 'file' line per input" },
				];
				parts.push({ flag: "-c copy", meaning: "stream-copy all streams — works only when every clip shares identical codecs and parameters" });
				break;
			case "mute-video":
				parts.push({ flag: "-an", meaning: "strip all audio — this is what mutes the video" });
				break;
			case "trim":
				if (filters.length === 0) {
					parts.push({ flag: "-c copy", meaning: "stream-copy both streams — instant cut with zero quality loss" });
				} else if (audioCodec === "none") {
					parts.push({ flag: "-an", meaning: "disable audio recording — output has no sound track" });
				} else if (audioCodec !== "copy") {
					parts.push({ flag: "-c:a " + audioCodec, meaning: `encode audio with the ${audioCodec} codec` }, { flag: "-b:a " + audioBitrate, meaning: `target audio bitrate ${audioBitrate}` });
				} else {
					parts.push({ flag: "-c:a copy", meaning: "copy the audio stream as-is without re-encoding" });
				}
				break;
			default:
				if (audioCodec === "none") {
					parts.push({ flag: "-an", meaning: "disable audio recording — output has no sound track" });
				} else if (audioCodec === "copy") {
					parts.push({ flag: "-c:a copy", meaning: "copy the audio stream as-is without re-encoding" });
				} else {
					parts.push({ flag: "-c:a " + audioCodec, meaning: `encode audio with the ${audioCodec} codec` }, { flag: "-b:a " + audioBitrate, meaning: `target audio bitrate ${audioBitrate}` });
				}
		}

		parts.push({ flag: outputName, meaning: outputName === "output.mp4" ? "the merged output file" : "the generated output filename" });

		if (workflow === "make-gif") {
			const gifFilter = `fps=${gifFps},scale=${gifWidth}:-2:flags=lanczos`;
			const lines = [
				`ffmpeg -i ${inputFile} -vf "${gifFilter},palettegen" palette.png`,
				`ffmpeg -i ${inputFile} -i palette.png -lavfi "${gifFilter}[x];[x][1:v]paletteuse" ${outputName}`,
			];
			return {
				lines,
				parts: [
					{ flag: "palettegen", meaning: "pass 1 builds an optimal 256-color palette from the whole clip" },
					{ flag: gifFilter, meaning: `sample ${gifFps} frames per second and scale to ${gifWidth}px wide, keeping aspect ratio` },
					{ flag: "paletteuse", meaning: "pass 2 applies that palette while encoding — dramatically smoother colors than a one-pass GIF" },
					{ flag: outputName, meaning: "the animated GIF output file" },
				],
			};
		}

		const cmdParts = [...head.map((p) => p.flag), ...parts.map((p) => p.flag)];
		return { lines: [`ffmpeg ${cmdParts.join(" ")}`], parts: [...head, ...parts] };
	}, [workflow, inputFile, videoCodec, audioCodec, crf, preset, resolution, fps, audioBitrate, trimStart, trimDuration, gifFps, gifWidth, screenshotTime, outputName]);

	const listTxtContent = concatFiles.map((f) => `file '${f}'`).join("\n");

	const handleCopy = () => {
		navigator.clipboard.writeText(build.lines.join("\n\n"));
		setCopied(true);
		toast.success("FFmpeg command copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	const sharedControls = (
		<>
			<div className="space-y-2">
				<Label htmlFor="input-file" className="text-xs font-semibold">Input File</Label>
				<Input id="input-file" value={inputFile} onChange={(e) => setInputFile(e.target.value)} className="font-mono text-sm" />
			</div>
			<SelectField
				label="Video Codec"
				value={videoCodec}
				onChange={setVideoCodec}
				options={[
					{ value: "libx264", label: "libx264 · H.264" },
					{ value: "libx265", label: "libx265 · H.265" },
					{ value: "libvpx-vp9", label: "libvpx-vp9 · VP9" },
					{ value: "libsvtav1", label: "libsvtav1 · AV1" },
					{ value: "copy", label: "copy · no re-encode" },
				]}
			/>
			<SelectField
				label="Audio Codec"
				value={audioCodec}
				onChange={setAudioCodec}
				options={[
					{ value: "aac", label: "AAC" },
					{ value: "libmp3lame", label: "MP3" },
					{ value: "libopus", label: "Opus" },
					{ value: "copy", label: "copy" },
					{ value: "none", label: "none · silent" },
				]}
			/>
			<div className="space-y-2 sm:col-span-2">
				<div className="flex items-center justify-between text-xs font-semibold text-foreground">
					<Label htmlFor="crf-slider">Quality (CRF)</Label>
					<span className="text-blue-600 dark:text-blue-400">{crf} · {CRF_LABELS[crf] ?? (crf < 18 ? "very high" : crf <= 26 ? "balanced" : "small file")}</span>
				</div>
				<Slider id="crf-slider" value={[crf]} min={18} max={32} step={1} onValueChange={(v) => setCrf(v[0])} />
			</div>
			<SelectField label="Speed Preset" value={preset} onChange={setPreset} options={["ultrafast", "superfast", "veryfast", "faster", "fast", "medium", "slow", "slower", "veryslow"].map((p) => ({ value: p, label: p }))} />
			<SelectField label="Resolution" value={resolution} onChange={setResolution} options={[{ value: "source", label: "source" }, { value: "1920x1080", label: "1920×1080" }, { value: "1280x720", label: "1280×720" }, { value: "854x480", label: "854×480" }]} />
			<SelectField label="Frame Rate" value={fps} onChange={setFps} options={["source", "60", "30", "24"].map((f) => ({ value: f, label: f === "source" ? "source" : `${f} fps` }))} />
			<SelectField label="Audio Bitrate" value={audioBitrate} onChange={setAudioBitrate} options={["128k", "192k", "320k"].map((b) => ({ value: b, label: b }))} />
		</>
	);

	return (
		<div className="space-y-8 max-w-5xl mx-auto">
			<Tabs value={workflow} onValueChange={(v) => setWorkflow(v as Workflow)}>
				<TabsList className="flex-wrap h-auto w-full">
					{WORKFLOWS.map((w) => (
						<TabsTrigger key={w.id} value={w.id}>{w.label}</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value={workflow} className="pt-6 space-y-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-2xl bg-card border border-border/60 shadow-sm">
						{sharedControls}
						{workflow === "trim" && (
							<>
								<div className="space-y-2">
									<Label htmlFor="trim-start" className="text-xs font-semibold">Start (−ss)</Label>
									<Input id="trim-start" type="time" step={1} value={trimStart} onChange={(e) => setTrimStart(e.target.value)} />
								</div>
								<div className="space-y-2">
									<Label htmlFor="trim-duration" className="text-xs font-semibold">Duration −t (s)</Label>
									<Input id="trim-duration" type="number" min={1} value={trimDuration} onChange={(e) => setTrimDuration(String(Math.max(1, Number(e.target.value) || 1)))} />
								</div>
							</>
						)}
						{workflow === "make-gif" && (
							<>
								<SelectField label="GIF FPS" value={gifFps} onChange={setGifFps} options={[{ value: "12", label: "12 fps" }, { value: "15", label: "15 fps" }]} />
								<SelectField label="GIF Width" value={gifWidth} onChange={setGifWidth} options={[{ value: "480", label: "480 px" }, { value: "640", label: "640 px" }]} />
							</>
						)}
						{workflow === "frame-screenshot" && (
							<div className="space-y-2">
								<Label htmlFor="shot-time" className="text-xs font-semibold">Timestamp (−ss)</Label>
								<Input id="shot-time" type="time" step={1} value={screenshotTime} onChange={(e) => setScreenshotTime(e.target.value)} />
							</div>
						)}
					</div>

					{workflow === "concatenate" && (
						<div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-base font-bold text-foreground">Input Clips (in order)</h3>
								<Button size="sm" variant="outline" onClick={() => setConcatFiles((prev) => [...prev, `clip${prev.length + 1}.mp4`])} className="h-7 text-xs">Add Clip</Button>
							</div>
							<div className="space-y-2">
								{concatFiles.map((file, i) => (
									<div key={i} className="flex items-center gap-2">
										<span className="text-xs font-bold text-muted-foreground w-8">{i + 1}.</span>
										<Input value={file} onChange={(e) => setConcatFiles((prev) => prev.map((f, j) => (j === i ? e.target.value : f)))} className="font-mono text-sm h-8 flex-1" />
										<Button size="sm" variant="ghost" disabled={concatFiles.length <= 1} onClick={() => setConcatFiles((prev) => prev.filter((_, j) => j !== i))} className="h-7 w-7 p-0 text-red-500 hover:bg-red-500/10">×</Button>
									</div>
								))}
							</div>
							<div className="space-y-1.5">
								<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">list.txt contents</p>
								<pre className="p-3 rounded-xl bg-muted/50 border border-border/40 font-mono text-[12px] whitespace-pre-wrap">{listTxtContent}</pre>
								<p className="text-[11px] text-muted-foreground">Create list.txt next to your clips with exactly these lines before running the command below.</p>
							</div>
						</div>
					)}
				</TabsContent>
			</Tabs>

			<div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm space-y-4">
				<div className="flex items-center justify-between gap-3 flex-wrap">
					<div className="flex items-center gap-2">
						<Film className="h-4 w-4 text-blue-600 dark:text-blue-400" />
						<h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Command Preview</h4>
					</div>
					<Button size="sm" onClick={handleCopy} className="h-8 text-xs gap-1.5">
						{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
						Copy Command
					</Button>
				</div>
				<pre className="flex items-start gap-2 p-4 rounded-xl bg-zinc-950 border border-border/40 font-mono text-[12px] leading-relaxed text-emerald-400 overflow-x-auto">
					<Terminal className="h-4 w-4 shrink-0 mt-0.5 text-zinc-600" />
					<span className="whitespace-pre">{build.lines.join("\n\n")}</span>
				</pre>
			</div>

			<div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm space-y-3">
				<h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Flag-by-Flag Explanation</h4>
				<ul className="space-y-2">
					{build.parts.map((part, i) => (
						<li key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 text-sm">
							<code className="shrink-0 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-bold">{part.flag}</code>
							<span className="text-muted-foreground">{part.meaning}</span>
						</li>
					))}
				</ul>
			</div>

			<div className="flex gap-2.5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300">
				<TriangleAlert className="h-4 w-4 shrink-0 mt-0.5" />
				<p className="text-xs leading-relaxed">These commands require FFmpeg installed locally on your machine. Verify your installation with <code className="font-mono font-bold">ffmpeg -version</code>, then run commands from the folder containing your media files.</p>
			</div>
		</div>
	);
}
