"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
	Upload,
	Download,
	ShieldCheck,
	Music,
	RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider as SliderPrimitive } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Band {
	freq: number;
	gain: number;
	label: string;
}

const PRESET_BANDS: Band[] = [
	{ freq: 32, gain: 0, label: "32 Hz" },
	{ freq: 64, gain: 0, label: "64 Hz" },
	{ freq: 125, gain: 0, label: "125 Hz" },
	{ freq: 250, gain: 0, label: "250 Hz" },
	{ freq: 500, gain: 0, label: "500 Hz" },
	{ freq: 1000, gain: 0, label: "1 kHz" },
	{ freq: 2000, gain: 0, label: "2 kHz" },
	{ freq: 4000, gain: 0, label: "4 kHz" },
	{ freq: 8000, gain: 0, label: "8 kHz" },
	{ freq: 16000, gain: 0, label: "16 kHz" },
];

const PRESETS: Record<string, { name: string; gains: number[] }> = {
	flat: { name: "Flat", gains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
	rock: { name: "Rock", gains: [3, 2, 1, 0, 0, 0, 1, 2, 3, 2] },
	pop: { name: "Pop", gains: [-1, 0, 1, 2, 2, 0, 0, 1, 2, 1] },
	jazz: { name: "Jazz", gains: [2, 2, 1, 1, 0, 0, 1, 2, 2, 1] },
	classical: { name: "Classical", gains: [3, 2, 1, 0, -1, -1, 0, 1, 2, 3] },
	bass: { name: "Bass Boost", gains: [5, 4, 3, 1, 0, 0, 0, 0, 0, 0] },
	vocal: { name: "Vocal Boost", gains: [-1, 0, 0, 1, 2, 3, 3, 2, 1, 0] },
};

export default function AudioEqualizerTool() {
	const [audioFile, setAudioFile] = useState<File | null>(null);
	const [audioUrl, setAudioUrl] = useState<string>("");
	const [bands, setBands] = useState<Band[]>(PRESET_BANDS.map(b => ({ ...b })));
	const [isPlaying, setIsPlaying] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [processedUrl, setProcessedUrl] = useState<string>("");
	const [currentPreset, setCurrentPreset] = useState<string>("flat");
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const audioContextRef = useRef<AudioContext | null>(null);
	const sourceRef = useRef<AudioBufferSourceNode | null>(null);
	const filtersRef = useRef<BiquadFilterNode[]>([]);
	const gainNodeRef = useRef<GainNode | null>(null);
	const originalBufferRef = useRef<AudioBuffer | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const audioElementRef = useRef<HTMLAudioElement | null>(null);
	const animationRef = useRef<number | null>(null);

	useEffect(() => {
		return () => {
			if (audioContextRef.current) audioContextRef.current.close();
			if (animationRef.current) cancelAnimationFrame(animationRef.current);
			if (audioUrl) URL.revokeObjectURL(audioUrl);
			if (processedUrl) URL.revokeObjectURL(processedUrl);
		};
	}, []);

	const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const validTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/webm", "audio/x-m4a"];
		if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a|webm|flac)$/i)) {
			toast.error("Unsupported audio format.");
			return;
		}

		if (file.size > 100 * 1024 * 1024) {
			toast.error("File too large. Max 100MB.");
			return;
		}

		setAudioFile(file);
		setProcessedUrl("");
		if (audioUrl) URL.revokeObjectURL(audioUrl);
		setAudioUrl(URL.createObjectURL(file));
		e.target.value = "";
	}, [audioUrl]);

	const applyPreset = useCallback((presetKey: string) => {
		const preset = PRESETS[presetKey];
		if (!preset) return;
		setCurrentPreset(presetKey);
		setBands(prev => prev.map((band, i) => ({ ...band, gain: preset.gains[i] || 0 })));
	}, []);

	const updateBandGain = useCallback((index: number, value: number) => {
		setBands(prev => prev.map((b, i) => i === index ? { ...b, gain: value } : b));
		setCurrentPreset("custom");
	}, []);

	const processAudio = useCallback(async () => {
		if (!audioFile) return;
		setIsProcessing(true);

		try {
			const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
			const ctx = new AudioContext();
			audioContextRef.current = ctx;

			const arrayBuffer = await audioFile.arrayBuffer();
			const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
			originalBufferRef.current = audioBuffer;

			const offlineCtx = new OfflineAudioContext(
				audioBuffer.numberOfChannels,
				audioBuffer.length,
				audioBuffer.sampleRate
			);

			const source = offlineCtx.createBufferSource();
			source.buffer = audioBuffer;

			const filters: BiquadFilterNode[] = [];
			bands.forEach((band) => {
				const filter = offlineCtx.createBiquadFilter();
				filter.type = "peaking";
				filter.frequency.value = band.freq;
				filter.Q.value = 1;
				filter.gain.value = band.gain;
				filters.push(filter);
			});

			const gainNode = offlineCtx.createGain();
			gainNode.gain.value = 1;

			// Connect: source -> filters in series -> gain -> destination
			let lastNode: AudioNode = source;
			filters.forEach((filter) => {
				lastNode.connect(filter);
				lastNode = filter;
			});
			lastNode.connect(gainNode);
			gainNode.connect(offlineCtx.destination);

			source.start(0);
			const renderedBuffer = await offlineCtx.startRendering();

			const wavBlob = audioBufferToWav(renderedBuffer);
			const url = URL.createObjectURL(wavBlob);
			if (processedUrl) URL.revokeObjectURL(processedUrl);
			setProcessedUrl(url);
			toast.success("Equalizer applied successfully!");
		} catch (error) {
			console.error(error);
			toast.error("Failed to process audio.");
		} finally {
			setIsProcessing(false);
		}
	}, [audioFile, bands, processedUrl]);

	const audioBufferToWav = (buffer: AudioBuffer): Blob => {
		const numChannels = buffer.numberOfChannels;
		const sampleRate = buffer.sampleRate;
		const format = 1; // PCM
		const bitDepth = 16;

		const bytesPerSample = bitDepth / 8;
		const blockAlign = numChannels * bytesPerSample;
		const dataSize = buffer.length * blockAlign;
		const headerSize = 44;
		const totalSize = headerSize + dataSize;

		const arrayBuffer = new ArrayBuffer(totalSize);
		const view = new DataView(arrayBuffer);

		writeString(view, 0, "RIFF");
		view.setUint32(4, totalSize - 8, true);
		writeString(view, 8, "WAVE");
		writeString(view, 12, "fmt ");
		view.setUint32(16, 16, true);
		view.setUint16(20, format, true);
		view.setUint16(22, numChannels, true);
		view.setUint32(24, sampleRate, true);
		view.setUint32(28, sampleRate * blockAlign, true);
		view.setUint16(32, blockAlign, true);
		view.setUint16(34, bitDepth, true);
		writeString(view, 36, "data");
		view.setUint32(40, dataSize, true);

		const channelData: Float32Array[] = [];
		for (let c = 0; c < numChannels; c++) {
			channelData.push(buffer.getChannelData(c));
		}

		let offset = 44;
		for (let i = 0; i < buffer.length; i++) {
			for (let c = 0; c < numChannels; c++) {
				const sample = Math.max(-1, Math.min(1, channelData[c][i]));
				const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
				view.setInt16(offset, intSample, true);
				offset += 2;
			}
		}

		return new Blob([arrayBuffer], { type: "audio/wav" });
	};

	const writeString = (view: DataView, offset: number, string: string) => {
		for (let i = 0; i < string.length; i++) {
			view.setUint8(offset + i, string.charCodeAt(i));
		}
	};

	const downloadProcessed = () => {
		if (!processedUrl || !audioFile) return;
		const a = document.createElement("a");
		a.href = processedUrl;
		a.download = `${audioFile.name.replace(/\.[^/.]+$/, "")}_equalized.wav`;
		a.click();
		toast.success("Download started!");
	};

	const reset = () => {
		if (audioContextRef.current) audioContextRef.current.close();
		if (animationRef.current) cancelAnimationFrame(animationRef.current);
		if (audioUrl) URL.revokeObjectURL(audioUrl);
		if (processedUrl) URL.revokeObjectURL(processedUrl);
		setAudioFile(null);
		setAudioUrl("");
		setProcessedUrl("");
		setBands(PRESET_BANDS.map(b => ({ ...b })));
		setCurrentPreset("flat");
		setIsPlaying(false);
		setDuration(0);
		setCurrentTime(0);
		audioContextRef.current = null;
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	return (
		<div className="space-y-8 max-w-5xl mx-auto">
			<div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
				<ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
				<span>🔒 100% Client-Side Sandbox: Audio processing runs locally in your browser. No files are uploaded.</span>
			</div>

			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
				<div className="flex items-center gap-4">
					<div className="p-3 bg-primary/10 text-primary rounded-xl">
						<Music className="h-6 w-6" />
					</div>
					<div>
						<h2 className="text-xl font-bold">Audio Equalizer</h2>
						<p className="text-xs text-muted-foreground">10-band graphic equalizer with presets for rock, pop, jazz, and more</p>
					</div>
				</div>
				<div className="flex items-center gap-2 flex-wrap">
					<Button variant="outline" onClick={() => fileInputRef.current?.click()} className="text-xs font-bold">
						<Upload className="mr-2 h-4 w-4" /> {audioFile ? "Change Audio" : "Select Audio"}
					</Button>
					<Button
						disabled={!audioFile || isProcessing}
						onClick={processAudio}
						className="bg-primary hover:bg-primary/90 text-xs font-bold text-white"
					>
						{isProcessing ? "Processing..." : "Apply Equalizer"}
					</Button>
					<Button variant="outline" onClick={reset} disabled={isProcessing}>
						<RefreshCcw className="h-4 w-4" />
					</Button>
				</div>
				<input type="file" accept="audio/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					{!audioFile ? (
						<div
							onClick={() => fileInputRef.current?.click()}
							className="group cursor-pointer flex flex-col items-center justify-center p-12 md:p-24 border-2 border-dashed border-border/40 hover:border-primary/40 bg-card/25 hover:bg-card/40 transition-all rounded-3xl text-center"
						>
							<div className="p-6 bg-primary/5 rounded-2xl group-hover:scale-115 transition-all shadow-sm">
								<Music className="h-12 w-12 text-primary/40 group-hover:text-primary/60" />
							</div>
							<h3 className="mt-6 text-lg font-bold">Upload Audio File</h3>
							<p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
								Upload an MP3, WAV, OGG, or M4A file to adjust its frequency balance with our 10-band equalizer.
							</p>
						</div>
					) : (
						<Card className="border border-border/40 bg-card/20 rounded-3xl">
							<CardHeader>
								<CardTitle className="text-sm font-bold flex items-center gap-2">
									<Music className="h-4 w-4 text-primary" />
									{audioFile.name}
								</CardTitle>
								<CardDescription>Adjust frequency bands below</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* EQ Bands */}
								<div className="space-y-1">
									{bands.map((band, index) => (
										<div key={band.freq} className="grid grid-cols-[60px_1fr_40px] items-center gap-3">
											<span className="text-[10px] font-mono text-muted-foreground text-right">{band.label}</span>
											<SliderPrimitive
												value={[band.gain]}
												onValueChange={([v]) => updateBandGain(index, v)}
												min={-12}
												max={12}
												step={0.5}
												className="flex-1"
											/>
											<span className="text-[10px] font-mono text-foreground w-8 text-right">{band.gain > 0 ? "+" : ""}{band.gain.toFixed(1)}</span>
										</div>
									))}
								</div>

								{/* Audio Preview */}
								{audioUrl && (
									<div className="space-y-2">
										<Label>Preview (original)</Label>
										<audio ref={audioElementRef} src={audioUrl} controls className="w-full h-10" />
									</div>
								)}

								{processedUrl && (
									<div className="space-y-2 pt-2 border-t border-border/20">
										<Label className="text-emerald-500">Equalized Audio</Label>
										<audio src={processedUrl} controls className="w-full h-10" />
										<Button onClick={downloadProcessed} className="w-full text-xs font-bold">
											<Download className="h-4 w-4 mr-2" /> Download Equalized Audio
										</Button>
									</div>
								)}
							</CardContent>
						</Card>
					)}
				</div>

				<div className="space-y-4">
					<Card className="p-5 border border-border/40 bg-card/20 rounded-2xl space-y-3">
						<h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Presets</h4>
						<div className="grid grid-cols-2 gap-1.5">
							{Object.entries(PRESETS).map(([key, preset]) => (
								<Button
									key={key}
									variant={currentPreset === key ? "default" : "outline"}
									size="sm"
									onClick={() => applyPreset(key)}
									className="text-[10px] font-bold h-7"
								>
									{preset.name}
								</Button>
							))}
						</div>
					</Card>

					<Card className="p-5 border border-border/40 bg-card/20 rounded-2xl text-xs leading-relaxed space-y-3">
						<h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">How to Use</h4>
						<ol className="space-y-2 text-muted-foreground list-decimal list-inside">
							<li>Upload an audio file (MP3, WAV, OGG, etc.)</li>
							<li>Select a preset or adjust individual frequency bands</li>
							<li>Click "Apply Equalizer" to process</li>
							<li>Preview and download your equalized audio</li>
						</ol>
					</Card>
				</div>
			</div>
		</div>
	);
}
