"use client";

import React, { useState, useEffect } from "react";
import { 
	FilmIcon, 
	UploadIcon, 
	DownloadIcon, 
	PlayIcon, 
	TrashIcon,
	ArrowUpIcon,
	ArrowDownIcon,
	Loader2Icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { toast } from "sonner";

declare global {
	interface Window {
		gifshot: any;
	}
}

interface Frame {
	id: string;
	src: string;
	name: string;
}

export default function GifGeneratorTool() {
	const [frames, setFrames] = useState<Frame[]>([]);
	const [delay, setDelay] = useState<number>(300); // ms per frame
	const [width, setWidth] = useState<number>(400);
	const [height, setHeight] = useState<number>(400);
	const [gifResult, setGifResult] = useState<string>("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [libLoaded, setLibLoaded] = useState(false);

	useEffect(() => {
		if (!window.gifshot) {
			const script = document.createElement("script");
			script.src = "https://cdnjs.cloudflare.com/ajax/libs/gifshot/0.4.5/gifshot.min.js";
			script.async = true;
			script.onload = () => setLibLoaded(true);
			script.onerror = () => {
				toast.error("Failed to load GIF creation engine.");
			};
			document.head.appendChild(script);
		} else {
			setLibLoaded(true);
		}
	}, []);

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const loadedFrames: Frame[] = [];
		let processed = 0;

		Array.from(files).forEach((file, idx) => {
			const reader = new FileReader();
			reader.onload = () => {
				loadedFrames.push({
					id: `${Date.now()}-${idx}-${Math.random()}`,
					src: reader.result as string,
					name: file.name
				});
				processed++;
				if (processed === files.length) {
					setFrames(prev => [...prev, ...loadedFrames]);
					toast.success(`Loaded ${files.length} frames successfully!`);
				}
			};
			reader.readAsDataURL(file);
		});
	};

	const moveFrame = (index: number, direction: "up" | "down") => {
		const targetIndex = direction === "up" ? index - 1 : index + 1;
		if (targetIndex < 0 || targetIndex >= frames.length) return;

		const updated = [...frames];
		const temp = updated[index];
		updated[index] = updated[targetIndex];
		updated[targetIndex] = temp;
		setFrames(updated);
	};

	const removeFrame = (id: string) => {
		setFrames(prev => prev.filter(f => f.id !== id));
		toast.success("Frame removed");
	};

	const generateGif = () => {
		if (frames.length < 2) {
			toast.error("Please upload at least 2 image frames to create a GIF.");
			return;
		}

		if (!window.gifshot) {
			toast.error("GIF creation engine is still loading. Please wait.");
			return;
		}

		setIsGenerating(true);
		setGifResult("");

		const images = frames.map(f => f.src);

		window.gifshot.createGIF({
			images: images,
			interval: delay / 1000, // gifshot interval is in seconds
			gifWidth: width,
			gifHeight: height,
			numWorkers: 2,
		}, (obj: any) => {
			setIsGenerating(false);
			if (!obj.error) {
				setGifResult(obj.image);
				toast.success("GIF generated successfully!");
			} else {
				toast.error(`GIF creation failed: ${obj.error}`);
			}
		});
	};

	const downloadGif = () => {
		if (!gifResult) return;
		const link = document.createElement("a");
		link.href = gifResult;
		link.download = "animated-generator.gif";
		link.click();
		toast.success("GIF downloaded!");
	};

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
				{/* Workspace & Frame Manager */}
				<GlassCard className="p-6 space-y-6 flex flex-col justify-between">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
								<FilmIcon className="h-4 w-4" />
								<span>Frame Manager ({frames.length} uploaded)</span>
							</div>
							{!libLoaded && (
								<div className="flex items-center gap-1 text-[10px] text-primary animate-pulse font-bold">
									<Loader2Icon className="h-3 w-3 animate-spin" /> Loading Engine
								</div>
							)}
						</div>

						{/* File Upload Zone */}
						<Button variant="outline" className="relative cursor-pointer w-full">
							<UploadIcon className="h-4 w-4 mr-2" />
							Upload Image Frames (Multiple)
							<input 
								type="file" 
								multiple
								accept="image/*" 
								onChange={handleImageUpload}
								className="absolute inset-0 opacity-0 cursor-pointer"
							/>
						</Button>

						{/* List of frames */}
						{frames.length > 0 && (
							<div className="max-h-[220px] overflow-y-auto space-y-2 border border-border/30 rounded-xl p-2 bg-muted/10">
								{frames.map((frame, idx) => (
									<div 
										key={frame.id} 
										className="flex items-center justify-between p-2 bg-muted/40 border border-border/40 rounded-lg text-xs"
									>
										<div className="flex items-center gap-2 max-w-[60%]">
											<img 
												src={frame.src} 
												alt={frame.name} 
												className="h-8 w-8 object-cover rounded-md border border-border/50"
											/>
											<span className="truncate font-semibold">{frame.name}</span>
										</div>
										<div className="flex gap-1">
											<Button 
												variant="ghost" 
												size="icon" 
												className="h-7 w-7"
												disabled={idx === 0}
												onClick={() => moveFrame(idx, "up")}
											>
												<ArrowUpIcon className="h-3.5 w-3.5" />
											</Button>
											<Button 
												variant="ghost" 
												size="icon" 
												className="h-7 w-7"
												disabled={idx === frames.length - 1}
												onClick={() => moveFrame(idx, "down")}
											>
												<ArrowDownIcon className="h-3.5 w-3.5" />
											</Button>
											<Button 
												variant="ghost" 
												size="icon" 
												className="h-7 w-7 text-muted-foreground hover:text-destructive"
												onClick={() => removeFrame(frame.id)}
											>
												<TrashIcon className="h-3.5 w-3.5" />
											</Button>
										</div>
									</div>
								))}
							</div>
						)}

						{/* Settings */}
						{frames.length > 0 && (
							<div className="grid grid-cols-2 gap-4 pt-2">
								<div className="space-y-1">
									<label className="text-xs font-semibold text-muted-foreground">Frame Delay (ms)</label>
									<input 
										type="number"
										value={delay}
										min="50"
										max="5000"
										step="50"
										onChange={(e) => setDelay(Number(e.target.value))}
										className="w-full p-2 text-sm bg-muted/40 border border-border/40 rounded-xl focus:outline-none"
									/>
								</div>
								<div className="space-y-1">
									<label className="text-xs font-semibold text-muted-foreground">Dimensions (Square PX)</label>
									<input 
										type="number"
										value={width}
										min="100"
										max="1000"
										onChange={(e) => {
											setWidth(Number(e.target.value));
											setHeight(Number(e.target.value));
										}}
										className="w-full p-2 text-sm bg-muted/40 border border-border/40 rounded-xl focus:outline-none"
									/>
								</div>
							</div>
						)}
					</div>

					<Button 
						onClick={generateGif} 
						disabled={frames.length < 2 || isGenerating}
						className="w-full font-bold pt-2"
					>
						{isGenerating ? (
							<>
								<Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
								Generating GIF...
							</>
						) : (
							<>
								<PlayIcon className="h-4 w-4 mr-2" />
								Compile GIF
							</>
						)}
					</Button>
				</GlassCard>

				{/* Preview Area */}
				<GlassCard className="p-6 flex flex-col items-center justify-center min-h-[350px]">
					<span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
						GIF Preview / Output
					</span>

					{isGenerating ? (
						<div className="flex flex-col items-center gap-2 text-muted-foreground">
							<Loader2Icon className="h-8 w-8 animate-spin text-primary" />
							<p className="text-xs font-semibold">Compiling animation frames...</p>
						</div>
					) : gifResult ? (
						<div className="flex flex-col items-center gap-4">
							<img 
								src={gifResult} 
								alt="Animated GIF Result" 
								style={{ maxWidth: "100%", maxHeight: "250px" }}
								className="rounded-lg shadow border border-border/40 object-contain"
							/>
							<Button onClick={downloadGif} className="font-semibold gap-1.5">
								<DownloadIcon className="h-4 w-4" /> Download Animated GIF
							</Button>
						</div>
					) : (
						<div className="text-center text-muted-foreground">
							<FilmIcon className="h-8 w-8 mb-2 mx-auto opacity-40" />
							<p className="text-xs font-semibold">Upload at least 2 images and compile</p>
						</div>
					)}
				</GlassCard>
			</div>
		</div>
	);
}
