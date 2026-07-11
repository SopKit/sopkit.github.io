"use client";

import { useState } from "react";
import { Code, Copy, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function YouTubeEmbedGeneratorTool() {
	const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
	const [startTime, setStartTime] = useState("");
	const [showControls, setShowControls] = useState(true);
	const [loop, setLoop] = useState(false);
	const [autoplay, setAutoplay] = useState(false);
	const [privacyMode, setPrivacyMode] = useState(true);
	const [copied, setCopied] = useState(false);

	const extractVideoId = (url: string) => {
		const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
		const match = url.match(regExp);
		return (match && match[2].length === 11) ? match[2] : url;
	};

	const videoId = extractVideoId(videoUrl);

	const getEmbedUrl = () => {
		const baseHost = privacyMode ? "www.youtube-nocookie.com" : "www.youtube.com";
		let url = `https://${baseHost}/embed/${videoId}`;
		const params = [];
		if (startTime) params.push(`start=${startTime}`);
		if (!showControls) params.push("controls=0");
		if (loop) params.push(`loop=1&playlist=${videoId}`);
		if (autoplay) params.push("autoplay=1&mute=1");
		if (params.length > 0) {
			url += `?${params.join("&")}`;
		}
		return url;
	};

	const embedCode = `<iframe width="560" height="315" src="${getEmbedUrl()}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;

	const handleCopy = () => {
		navigator.clipboard.writeText(embedCode);
		setCopied(true);
		toast.success("Embed code copied to clipboard!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full max-w-4xl mx-auto space-y-8 animate-in">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Settings panel */}
				<Card className="border border-border/40 bg-card/60 backdrop-blur-sm shadow-xl p-6 space-y-6">
					<CardHeader className="p-0 pb-4 border-b border-border/20">
						<CardTitle className="text-xl font-bold flex items-center gap-2">
							<Code className="w-5 h-5 text-primary" />
							Embed Settings
						</CardTitle>
					</CardHeader>
					<CardContent className="p-0 space-y-5">
						<div className="space-y-2">
							<Label htmlFor="video-url" className="text-sm font-semibold">YouTube Video URL or ID</Label>
							<Input
								id="video-url"
								value={videoUrl}
								onChange={(e) => setVideoUrl(e.target.value)}
								placeholder="https://www.youtube.com/watch?v=..."
								className="h-11 rounded-xl bg-muted/20 border border-border/40 focus:ring-primary/20"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="start-time" className="text-sm font-semibold">Start Time (in seconds)</Label>
							<Input
								id="start-time"
								type="number"
								value={startTime}
								onChange={(e) => setStartTime(e.target.value)}
								placeholder="e.g. 30"
								className="h-11 rounded-xl bg-muted/20 border border-border/40 focus:ring-primary/20"
							/>
						</div>

						<div className="space-y-4 pt-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="show-controls" className="flex flex-col gap-0.5 cursor-pointer">
									<span className="font-semibold text-sm">Show Player Controls</span>
									<span className="text-xs text-muted-foreground">Allow viewers to pause, seek, and toggle settings.</span>
								</Label>
								<Switch
									id="show-controls"
									checked={showControls}
									onCheckedChange={setShowControls}
									className=""
								/>
							</div>

							<div className="flex items-center justify-between">
								<Label htmlFor="privacy-mode" className="flex flex-col gap-0.5 cursor-pointer">
									<span className="font-semibold text-sm">Enhanced Privacy Mode</span>
									<span className="text-xs text-muted-foreground">Prevent YouTube from tracking cookies unless player is clicked.</span>
								</Label>
								<Switch
									id="privacy-mode"
									checked={privacyMode}
									onCheckedChange={setPrivacyMode}
									className=""
								/>
							</div>

							<div className="flex items-center justify-between">
								<Label htmlFor="loop" className="flex flex-col gap-0.5 cursor-pointer">
									<span className="font-semibold text-sm">Loop Video</span>
									<span className="text-xs text-muted-foreground">Automatically restart the video after it ends.</span>
								</Label>
								<Switch
									id="loop"
									checked={loop}
									onCheckedChange={setLoop}
									className=""
								/>
							</div>

							<div className="flex items-center justify-between">
								<Label htmlFor="autoplay" className="flex flex-col gap-0.5 cursor-pointer">
									<span className="font-semibold text-sm">Autoplay (Muted)</span>
									<span className="text-xs text-muted-foreground">Start playing the video automatically in muted state.</span>
								</Label>
								<Switch
									id="autoplay"
									checked={autoplay}
									onCheckedChange={setAutoplay}
									className=""
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Preview panel */}
				<div className="space-y-6">
					<Card className="border border-border/40 bg-card/60 backdrop-blur-sm shadow-xl p-6 flex flex-col h-full">
						<CardHeader className="p-0 pb-4 border-b border-border/20 flex flex-row items-center justify-between">
							<CardTitle className="text-xl font-bold flex items-center gap-2">
								<Eye className="w-5 h-5 text-primary" />
								Iframe Preview
							</CardTitle>
						</CardHeader>
						<CardContent className="p-0 pt-6 flex-1 flex flex-col justify-between space-y-6">
							{videoId && videoId.length === 11 ? (
								<div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-black shadow-inner">
									<iframe
										src={getEmbedUrl()}
										title="YouTube video player preview"
										className="absolute inset-0 w-full h-full"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
										allowFullScreen
									/>
								</div>
							) : (
								<div className="aspect-video w-full bg-muted/40 border border-dashed rounded-xl flex items-center justify-center text-xs text-muted-foreground italic">
									Please enter a valid YouTube Video URL to see preview
								</div>
							)}

							<div className="space-y-3">
								<span className="text-sm font-semibold text-muted-foreground">Generated HTML Code</span>
								<div className="relative">
									<textarea
										readOnly
										value={embedCode}
										className="w-full h-24 p-3 bg-muted/60 text-xs font-mono border rounded-lg resize-none focus:outline-none"
									/>
									<Button
										size="icon"
										variant="ghost"
										className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-foreground"
										onClick={handleCopy}
										aria-label="Copy embed code to clipboard"
									>
										{copied ? (
											<Check className="h-4 w-4 text-emerald-500" />
										) : (
											<Copy className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
