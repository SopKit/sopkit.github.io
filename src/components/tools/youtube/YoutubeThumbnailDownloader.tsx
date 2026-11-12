"use client";

import { useState } from "react";
import { AlertCircle, Download, ExternalLink, Image as ImageIcon, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function YoutubeThumbnailDownloader() {
	const [url, setUrl] = useState("");
	const [videoId, setVideoId] = useState<string | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const extractVideoId = (inputUrl: string) => {
		const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
		const match = inputUrl.match(regExp);
		return match && match[2].length === 11 ? match[2] : null;
	};

	const handleProcess = (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setVideoId(null);

		if (!url.trim()) {
			setError("Please enter a YouTube video URL.");
			return;
		}

		setLoading(true);
		const id = extractVideoId(url);

		if (id) {
			setVideoId(id);
		} else {
			setError("Invalid YouTube URL. Please make sure it contains a valid 11-character video ID.");
		}
		setLoading(false);
	};

	const resolutions = [
		{
			key: "maxresdefault",
			name: "Ultra HD / Maximum Resolution (1080p / 720p)",
			url: (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
		},
		{
			key: "sddefault",
			name: "Standard Definition (SD 480p)",
			url: (id: string) => `https://img.youtube.com/vi/${id}/sddefault.jpg`,
		},
		{
			key: "hqdefault",
			name: "High Quality (HQ 360p)",
			url: (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
		},
		{
			key: "mqdefault",
			name: "Medium Quality (MQ 180p)",
			url: (id: string) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
		},
	];

	return (
		<div className="w-full max-w-4xl mx-auto space-y-8 font-sans">
			<Card className="border border-border/40 bg-card/30 backdrop-blur-md">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl font-black">
						<ImageIcon className="h-5 w-5 text-red-500" />
						YouTube Thumbnail Downloader
					</CardTitle>
					<CardDescription>
						Extract and download High-Quality (HQ) and Ultra HD YouTube video thumbnails instantly.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<form onSubmit={handleProcess} className="flex flex-col sm:flex-row gap-3">
						<div className="relative flex-1">
							<Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								type="url"
								placeholder="Paste YouTube video link here (e.g. https://www.youtube.com/watch?v=...)"
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 font-bold shrink-0">
							{loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <ImageIcon className="h-4 w-4 mr-1" />}
							Get Thumbnails
						</Button>
					</form>

					{error && (
						<div className="flex items-center gap-2 p-3.5 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
							<AlertCircle className="h-4 w-4 shrink-0" />
							<span>{error}</span>
						</div>
					)}

					{videoId && (
						<div className="space-y-6 animate-fade-in">
							<h3 className="text-base font-bold text-foreground">Available Thumbnail Resolutions:</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{resolutions.map((res) => {
									const imgUrl = res.url(videoId);
									return (
										<Card key={res.key} className="border border-border/40 bg-muted/20 overflow-hidden flex flex-col justify-between">
											<div className="aspect-video relative bg-zinc-950 flex items-center justify-center border-b border-border/40">
												<img
													src={imgUrl}
													alt={res.name}
													className="w-full h-full object-contain"
													onError={(e) => {
														// Hide unavailable higher resolutions (like maxresdefault for some older videos)
														(e.target as HTMLElement).parentElement?.classList.add("hidden");
													}}
												/>
											</div>
											<CardContent className="p-4 space-y-3">
												<p className="text-xs font-bold text-muted-foreground line-clamp-1">{res.name}</p>
												<div className="flex gap-2">
													<Button size="sm" asChild className="flex-1 bg-red-600 hover:bg-red-700 font-bold text-xs gap-1.5">
														<a href={imgUrl} download={`youtube-thumbnail-${videoId}.jpg`} target="_blank" rel="noopener noreferrer">
															<Download className="h-3.5 w-3.5" />
															Download HD
														</a>
													</Button>
													<Button size="sm" variant="outline" asChild className="text-xs font-bold gap-1.5">
														<a href={imgUrl} target="_blank" rel="noopener noreferrer">
															Open Link
															<ExternalLink className="h-3 w-3" />
														</a>
													</Button>
												</div>
											</CardContent>
										</Card>
									);
								})}
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
