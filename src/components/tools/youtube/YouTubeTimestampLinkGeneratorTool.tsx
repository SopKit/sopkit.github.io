"use client";

import { useState } from "react";
import { Clock, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function YouTubeTimestampLinkGeneratorTool() {
	const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
	const [minutes, setMinutes] = useState("1");
	const [seconds, setSeconds] = useState("30");
	const [copied, setCopied] = useState(false);

	const generateTimestampUrl = () => {
		if (!videoUrl) return "";
		let cleanUrl = videoUrl.trim();
		const totalSeconds = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
		if (totalSeconds <= 0) return cleanUrl;

		// Handle short youtu.be format
		if (cleanUrl.includes("youtu.be/")) {
			const parts = cleanUrl.split("youtu.be/");
			const id = parts[1].split("?")[0];
			return `https://youtu.be/${id}?t=${totalSeconds}`;
		}
		// Handle standard watch?v= format
		if (cleanUrl.includes("youtube.com/watch")) {
			const reg = /[?&]v=([^&#]*)/;
			const match = cleanUrl.match(reg);
			if (match && match[1]) {
				return `https://youtube.com/watch?v=${match[1]}&t=${totalSeconds}s`;
			}
		}
		return `${cleanUrl}?t=${totalSeconds}s`;
	};

	const handleCopy = () => {
		const link = generateTimestampUrl();
		if (!link) return;
		navigator.clipboard.writeText(link);
		setCopied(true);
		toast.success("Timestamp link copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6 animate-in">
			<Card className="border border-border/40 bg-card/60 backdrop-blur-sm shadow-xl">
				<CardHeader className="pb-4">
					<CardTitle className="text-2xl font-bold flex items-center gap-2">
						<Clock className="w-6 h-6 text-primary" />
						YouTube Timestamp Link Generator
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<label className="text-sm font-semibold">YouTube Video URL</label>
						<Input
							value={videoUrl}
							onChange={(e) => setVideoUrl(e.target.value)}
							placeholder="https://www.youtube.com/watch?v=..."
							className="h-12 text-base px-4 bg-muted/20 border-2 border-primary/5 focus:border-primary/20 rounded-xl"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="text-sm font-semibold">Minutes</label>
							<Input
								type="number"
								value={minutes}
								onChange={(e) => setMinutes(e.target.value)}
								min="0"
								placeholder="0"
								className="h-12 text-base px-4 bg-muted/20 border-2 border-primary/5 focus:border-primary/20 rounded-xl"
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-semibold">Seconds</label>
							<Input
								type="number"
								value={seconds}
								onChange={(e) => setSeconds(e.target.value)}
								min="0"
								max="59"
								placeholder="30"
								className="h-12 text-base px-4 bg-muted/20 border-2 border-primary/5 focus:border-primary/20 rounded-xl"
							/>
						</div>
					</div>

					<div className="pt-4 border-t border-border/40 space-y-3">
						<div className="flex justify-between items-center">
							<span className="text-sm font-semibold text-muted-foreground">Generated Timestamp Link</span>
						</div>
						<div className="p-4 bg-muted/40 border border-border/40 rounded-xl min-h-[50px] flex items-center justify-between gap-4 font-mono text-sm leading-relaxed whitespace-pre-wrap select-all">
							<span className="text-foreground font-semibold">
								{generateTimestampUrl() || <span className="italic text-muted-foreground">Input video URL and time parameter...</span>}
							</span>
							<Button
								size="icon"
								variant="ghost"
								disabled={!generateTimestampUrl()}
								onClick={handleCopy}
								className="shrink-0"
							>
								{copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
