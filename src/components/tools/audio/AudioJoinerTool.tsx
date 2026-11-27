"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
	Upload,
	Download,
	ShieldCheck,
	Music,
	Plus,
	Trash2,
	ArrowUp,
	ArrowDown,
	RefreshCcw,
	Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { computeConcatenationSchedule, encodeWavPcm16 } from "@/lib/audio/joiner-utils";

interface AudioItem {
	id: string;
	file: File;
	name: string;
	size: number;
	duration?: number;
}

export default function AudioJoinerTool() {
	const [audioFiles, setAudioFiles] = useState<AudioItem[]>([]);
	const [isProcessing, setIsProcessing] = useState(false);
	const [progress, setProgress] = useState(0);
	const [processedUrl, setProcessedUrl] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement>(null);
	const processedUrlRef = useRef<string>("");

	const replaceProcessedUrl = useCallback((nextUrl: string) => {
		if (processedUrlRef.current && processedUrlRef.current !== nextUrl) {
			URL.revokeObjectURL(processedUrlRef.current);
		}
		processedUrlRef.current = nextUrl;
		setProcessedUrl(nextUrl);
	}, []);

	useEffect(() => {
		return () => {
			if (processedUrlRef.current) {
				URL.revokeObjectURL(processedUrlRef.current);
				processedUrlRef.current = "";
			}
		};
	}, []);

	const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (files.length === 0) return;

		const validTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/webm", "audio/x-m4a"];
		const newItems: AudioItem[] = [];

		for (const file of files) {
			if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a|webm|flac)$/i)) {
				toast.error(`Unsupported format: ${file.name}`);
				continue;
			}
			if (file.size > 100 * 1024 * 1024) {
				toast.error(`File too large: ${file.name}. Max 100MB.`);
				continue;
			}
			newItems.push({
				id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
				file,
				name: file.name,
				size: file.size,
			});
		}

		if (newItems.length > 0) {
			setAudioFiles(prev => [...prev, ...newItems]);
			replaceProcessedUrl("");
			toast.success(`${newItems.length} file(s) added.`);
		}
		e.target.value = "";
	}, [replaceProcessedUrl]);

	const removeFile = useCallback((id: string) => {
		setAudioFiles(prev => prev.filter(f => f.id !== id));
		replaceProcessedUrl("");
	}, [replaceProcessedUrl]);

	const moveFile = useCallback((index: number, direction: "up" | "down") => {
		setAudioFiles(prev => {
			const arr = [...prev];
			const newIndex = direction === "up" ? index - 1 : index + 1;
			if (newIndex < 0 || newIndex >= arr.length) return arr;
			[arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
			return arr;
		});
		replaceProcessedUrl("");
	}, [replaceProcessedUrl]);

	const joinAudios = useCallback(async () => {
		if (audioFiles.length < 2) {
			toast.error("Please add at least 2 audio files to join.");
			return;
		}

		setIsProcessing(true);
		setProgress(0);

		const AudioContextCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
		let ctx: AudioContext | null = null;

		try {
			ctx = new AudioContextCtor();

			const buffers: AudioBuffer[] = [];
			let totalLength = 0;
			const sampleRate = ctx.sampleRate;

			for (let i = 0; i < audioFiles.length; i++) {
				const arrayBuffer = await audioFiles[i].file.arrayBuffer();
				const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
				buffers.push(audioBuffer);
				totalLength += audioBuffer.length;
				setProgress(Math.round(((i + 1) / audioFiles.length) * 40));
			}

			const numChannels = Math.max(...buffers.map(b => b.numberOfChannels));
			const offlineCtx = new OfflineAudioContext(numChannels, totalLength, sampleRate);
			const schedule = computeConcatenationSchedule(buffers.map(b => b.duration));

			for (let i = 0; i < buffers.length; i++) {
				const source = offlineCtx.createBufferSource();
				source.buffer = buffers[i];
				source.connect(offlineCtx.destination);
				source.start(schedule[i].startTime, 0, schedule[i].duration);
				setProgress(40 + Math.round(((i + 1) / buffers.length) * 40));
			}

			const renderedBuffer = await offlineCtx.startRendering();
			setProgress(90);

			const channels = Array.from({ length: renderedBuffer.numberOfChannels }, (_, c) =>
				renderedBuffer.getChannelData(c),
			);
			const wavBlob = encodeWavPcm16(channels, renderedBuffer.sampleRate);
			const url = URL.createObjectURL(wavBlob);
			replaceProcessedUrl(url);
			setProgress(100);

			toast.success(`Joined ${audioFiles.length} audio files successfully!`);
		} catch (error) {
			console.error(error);
			toast.error("Failed to join audio files.");
		} finally {
			if (ctx && ctx.state !== "closed") {
				await ctx.close().catch(() => {});
			}
			setIsProcessing(false);
		}
	}, [audioFiles, replaceProcessedUrl]);

	const downloadJoined = () => {
		if (!processedUrl) return;
		const a = document.createElement("a");
		a.href = processedUrl;
		a.download = `joined-audio.wav`;
		a.click();
		toast.success("Download started!");
	};

	const reset = () => {
		replaceProcessedUrl("");
		setAudioFiles([]);
		setProgress(0);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const formatSize = (bytes: number) => {
		return (bytes / (1024 * 1024)).toFixed(1) + " MB";
	};

	const totalDuration = audioFiles.reduce((sum, f) => sum + (f.duration || 0), 0);

	return (
		<div className="space-y-8 max-w-4xl mx-auto">
			<div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
				<ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
				<span>🔒 100% Client-Side Sandbox: Audio joining runs locally in your browser. No files are uploaded.</span>
			</div>

			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
				<div className="flex items-center gap-4">
					<div className="p-3 bg-primary/10 text-primary rounded-xl">
						<Music className="h-6 w-6" />
					</div>
					<div>
						<h2 className="text-xl font-bold">Audio Joiner</h2>
						<p className="text-xs text-muted-foreground">Combine multiple audio files into one seamless track</p>
					</div>
				</div>
				<div className="flex items-center gap-2 flex-wrap">
					<Button variant="outline" onClick={() => fileInputRef.current?.click()} className="text-xs font-bold">
						<Upload className="mr-2 h-4 w-4" /> Add Audio Files
					</Button>
					<Button
						disabled={audioFiles.length < 2 || isProcessing}
						onClick={joinAudios}
						className="bg-primary hover:bg-primary/90 text-xs font-bold text-white"
					>
						{isProcessing ? (
							<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Joining...</>
						) : (
							<><Plus className="mr-2 h-4 w-4" /> Join Audio</>
						)}
					</Button>
					<Button aria-label="Reset" variant="outline" onClick={reset} disabled={isProcessing}>
						<RefreshCcw className="h-4 w-4" />
					</Button>
				</div>
				<input type="file" accept="audio/*" multiple className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
			</div>

			{audioFiles.length === 0 ? (
				<div
					onClick={() => fileInputRef.current?.click()}
					className="group cursor-pointer flex flex-col items-center justify-center p-12 md:p-24 border-2 border-dashed border-border/40 hover:border-primary/40 bg-card/25 hover:bg-card/40 transition-all rounded-2xl text-center"
				>
					<div className="p-6 bg-primary/5 rounded-2xl group-hover:scale-115 transition-all shadow-sm">
						<Music className="h-12 w-12 text-primary/40 group-hover:text-primary/60" />
					</div>
					<h3 className="mt-6 text-lg font-bold">Add Audio Files</h3>
					<p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
						Upload 2 or more audio files to join them together. Supports MP3, WAV, OGG, M4A, and more.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2 space-y-4">
						<Card className="border border-border/40 bg-card/20 rounded-2xl">
							<CardHeader className="pb-3">
								<CardTitle className="text-sm font-bold">Audio Files ({audioFiles.length})</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								{audioFiles.map((item, index) => (
									<div
										key={item.id}
										className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/20"
									>
										<span className="text-xs font-mono text-muted-foreground w-6">{index + 1}</span>
										<Music className="h-4 w-4 text-primary shrink-0" />
										<div className="flex-1 min-w-0">
											<p className="text-xs font-medium truncate">{item.name}</p>
											<p className="text-[10px] text-muted-foreground">{formatSize(item.size)}</p>
										</div>
										<div className="flex items-center gap-1">
											<Button aria-label="Move audio file up" variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveFile(index, "up")} disabled={index === 0}>
												<ArrowUp className="h-3 w-3" />
											</Button>
											<Button aria-label="Move audio file down" variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveFile(index, "down")} disabled={index === audioFiles.length - 1}>
												<ArrowDown className="h-3 w-3" />
											</Button>
											<Button aria-label="Remove audio file" variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => removeFile(item.id)}>
												<Trash2 className="h-3 w-3" />
											</Button>
										</div>
									</div>
								))}
							</CardContent>
						</Card>

						{isProcessing && (
							<Card className="p-5 border border-border/30 bg-card/25 rounded-2xl">
								<div className="space-y-2">
									<div className="flex justify-between text-xs font-bold">
										<span>Joining audio files...</span>
										<span>{progress}%</span>
									</div>
									<Progress value={progress} className="h-2" />
								</div>
							</Card>
						)}

						{processedUrl && !isProcessing && (
							<Card className="p-5 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl space-y-3">
								<h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">Joined Audio Ready!</h4>
								<audio src={processedUrl} controls className="w-full h-10" />
								<Button onClick={downloadJoined} className="w-full text-xs font-bold">
									<Download className="h-4 w-4 mr-2" /> Download Joined Audio (WAV)
								</Button>
							</Card>
						)}
					</div>

					<div className="space-y-4">
						<Card className="p-5 border border-border/40 bg-card/20 rounded-2xl space-y-3 text-xs">
							<h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Tips</h4>
							<ul className="space-y-2 text-muted-foreground list-disc list-inside">
								<li>Drag to reorder files using the arrow buttons</li>
								<li>Files are joined in the order shown</li>
								<li>Supports mixed formats in one session</li>
								<li>Output is saved as WAV format</li>
							</ul>
						</Card>
					</div>
				</div>
			)}
		</div>
	);
}
