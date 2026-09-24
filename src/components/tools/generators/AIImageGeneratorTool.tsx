"use client";

import {
	Clock,
	CopyIcon,
	DownloadIcon,
	HeartIcon,
	History,
	ImageIcon,
	InfoIcon,
	Palette,
	RefreshCwIcon,
	Settings,
	Sparkles,
	Star,
	TrashIcon,
	Wand2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface ImageGeneration {
	id: number;
	url: string;
	prompt: string;
	style: string;
	size: string;
	aspectRatio: string;
	seed: string;
	timestamp: string;
}

interface StyleOption {
	value: string;
	label: string;
	description: string;
	icon: string;
}

interface AspectRatio {
	value: string;
	label: string;
	sizes: string[];
}

const STYLES: StyleOption[] = [
	{
		value: "photorealistic",
		label: "Photorealistic",
		description: "Detailed, camera-like images",
		icon: "📸",
	},
	{
		value: "digital-art",
		label: "Digital Art",
		description: "Modern illustration style",
		icon: "🎨",
	},
	{
		value: "oil-painting",
		label: "Oil Painting",
		description: "Classic painted texture",
		icon: "🖼️",
	},
	{
		value: "watercolor",
		label: "Watercolor",
		description: "Soft, flowing artwork",
		icon: "🌊",
	},
	{
		value: "cartoon",
		label: "Cartoon",
		description: "Bright, playful illustration",
		icon: "🎪",
	},
	{
		value: "anime",
		label: "Anime",
		description: "Japanese animation aesthetic",
		icon: "🌸",
	},
	{
		value: "cyberpunk",
		label: "Cyberpunk",
		description: "Neon, futuristic atmosphere",
		icon: "🌃",
	},
	{
		value: "fantasy",
		label: "Fantasy",
		description: "Magical, mystical themes",
		icon: "🔮",
	},
];

const ASPECT_RATIOS: AspectRatio[] = [
	{ value: "square", label: "Square · 1:1", sizes: ["512x512", "1024x1024"] },
	{
		value: "landscape",
		label: "Landscape · 4:3",
		sizes: ["1024x768", "1600x1200"],
	},
	{
		value: "portrait",
		label: "Portrait · 3:4",
		sizes: ["768x1024", "1200x1600"],
	},
	{
		value: "wide",
		label: "Widescreen · 16:9",
		sizes: ["1920x1080", "1280x720"],
	},
	{
		value: "ultra-wide",
		label: "Ultra-wide · 21:9",
		sizes: ["2560x1080", "1920x823"],
	},
];

const EXAMPLE_PROMPTS = [
	{
		category: "Nature",
		prompts: [
			"A majestic dragon flying over a medieval castle at sunset",
			"Peaceful zen garden with cherry blossoms and koi pond",
			"Underwater coral reef city with mermaids and sea creatures",
		],
	},
	{
		category: "Sci-Fi",
		prompts: [
			"Futuristic city with flying cars and neon lights",
			"Post-apocalyptic wasteland with overgrown ruins",
			"Space station orbiting a distant planet with rings",
		],
	},
	{
		category: "Fantasy",
		prompts: [
			"Victorian steampunk inventor's workshop with gears and gadgets",
			"Magical forest with glowing mushrooms and fairy lights",
			"Ancient library filled with floating books and mystical orbs",
		],
	},
	{
		category: "Abstract",
		prompts: [
			"Abstract cosmic landscape with swirling nebulas",
			"Geometric patterns in vibrant colors and flowing shapes",
			"Surreal dreamscape with impossible architecture",
		],
	},
];

const STYLE_PREFIX: Record<string, string> = {
	photorealistic:
		"photorealistic, highly detailed, professional photography, 8k resolution",
	"digital-art":
		"digital art, illustration, artstation trending, concept art",
	"oil-painting":
		"oil painting, classical art style, brushstrokes, canvas texture",
	watercolor: "watercolor painting, soft colors, flowing, artistic",
	cartoon: "cartoon style, colorful, animated, fun illustration",
	anime: "anime style, manga art, japanese animation, detailed",
	cyberpunk: "cyberpunk style, neon lights, futuristic, dark atmosphere",
	fantasy: "fantasy art, magical, mystical atmosphere, enchanted",
};

const HISTORY_KEY = "ai-image-history";
const FAVORITES_KEY = "ai-image-favorites";
const MAX_HISTORY = 50;

function readStoredItems(key: string): ImageGeneration[] {
	try {
		const value = localStorage.getItem(key);
		if (!value) return [];
		const parsed: unknown = JSON.parse(value);
		return Array.isArray(parsed) ? (parsed as ImageGeneration[]) : [];
	} catch {
		return [];
	}
}

export default function AIImageGeneratorTool() {
	const [prompt, setPrompt] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [copied, setCopied] = useState(false);
	const [history, setHistory] = useState<ImageGeneration[]>([]);
	const [favorites, setFavorites] = useState<ImageGeneration[]>([]);
	const [activeTab, setActiveTab] = useState("generator");
	const [generationProgress, setGenerationProgress] = useState(0);

	const [style, setStyle] = useState("photorealistic");
	const [size, setSize] = useState("1024x1024");
	const [seed, setSeed] = useState("");
	const [aspectRatio, setAspectRatio] = useState("square");

	useEffect(() => {
		setHistory(readStoredItems(HISTORY_KEY));
		setFavorites(readStoredItems(FAVORITES_KEY));
	}, []);

	const availableSizes = useMemo(
		() =>
			ASPECT_RATIOS.find((ratio) => ratio.value === aspectRatio)?.sizes ??
			["1024x1024"],
		[aspectRatio],
	);

	useEffect(() => {
		if (!availableSizes.includes(size)) {
			setSize(availableSizes[0]);
		}
	}, [availableSizes, size]);

	const selectedStyle = useMemo(
		() => STYLES.find((item) => item.value === style),
		[style],
	);

	const quickPrompts = useMemo(
		() =>
			EXAMPLE_PROMPTS.flatMap((group) =>
				group.prompts.map((text) => ({
					text,
					category: group.category,
				})),
			).slice(0, 4),
		[],
	);

	const saveToHistory = useCallback((imageData: ImageGeneration) => {
		setHistory((previous) => {
			const next = [imageData, ...previous.filter((item) => item.url !== imageData.url)].slice(
				0,
				MAX_HISTORY,
			);
			localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
			return next;
		});
	}, []);

	const addToFavorites = useCallback((imageData: ImageGeneration) => {
		setFavorites((previous) => {
			if (previous.some((item) => item.url === imageData.url)) {
				toast.info("Already in favorites");
				return previous;
			}
			const next = [imageData, ...previous];
			localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
			toast.success("Added to favorites");
			return next;
		});
	}, []);

	const removeFromFavorites = useCallback((url: string) => {
		setFavorites((previous) => {
			const next = previous.filter((item) => item.url !== url);
			localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
			toast.success("Removed from favorites");
			return next;
		});
	}, []);

	const clearHistory = () => {
		if (!window.confirm("Clear all generated image history?")) return;
		setHistory([]);
		localStorage.removeItem(HISTORY_KEY);
		toast.success("History cleared");
	};

	const simulateProgress = useCallback(() => {
		setGenerationProgress(8);
		const interval = window.setInterval(() => {
			setGenerationProgress((previous) => {
				if (previous >= 90) return 90;
				return Math.min(90, previous + 8 + Math.random() * 8);
			});
		}, 500);
		return interval;
	}, []);

	const handleGenerate = async () => {
		const cleanPrompt = prompt.trim();
		if (!cleanPrompt) {
			toast.error("Describe what you want to create first");
			return;
		}

		setLoading(true);
		setError("");
		setImageUrl("");
		setGenerationProgress(0);

		const progressInterval = simulateProgress();

		try {
			const enhancedPrompt =
				(STYLE_PREFIX[style] || "") + ", " + cleanPrompt;
			let url =
				"https://image.pollinations.ai/prompt/" +
				encodeURIComponent(enhancedPrompt);

			const dimensions = size.split("x");
			url +=
				"?width=" +
				dimensions[0] +
				"&height=" +
				dimensions[1];

			if (seed.trim()) {
				url += "&seed=" + encodeURIComponent(seed.trim());
			}

			url += "&nologo=true&model=flux&enhance=true";

			await new Promise<void>((resolve, reject) => {
				const image = new Image();
				image.onload = () => resolve();
				image.onerror = () =>
					reject(new Error("Image provider could not generate this image."));
				image.src = url;
			});

			setImageUrl(url);
			setGenerationProgress(100);

			const imageData: ImageGeneration = {
				id: Date.now(),
				url,
				prompt: cleanPrompt,
				style,
				size,
				aspectRatio,
				seed: seed.trim(),
				timestamp: new Date().toISOString(),
			};

			saveToHistory(imageData);
			toast.success("Image generated successfully");
		} catch {
			setError(
				"Generation failed. Try a simpler prompt or another image size.",
			);
			toast.error("Could not generate the image");
		} finally {
			window.clearInterval(progressInterval);
			setLoading(false);
			window.setTimeout(() => setGenerationProgress(0), 300);
		}
	};

	const handleCopy = async () => {
		if (!imageUrl) return;

		try {
			await navigator.clipboard.writeText(imageUrl);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
			toast.success("Image URL copied");
		} catch {
			toast.error("Clipboard access was blocked");
		}
	};

	const handleDownload = async () => {
		if (!imageUrl) return;

		try {
			const response = await fetch(imageUrl);
			if (!response.ok) throw new Error("Download failed");
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const anchor = document.createElement("a");
			anchor.href = url;
			anchor.download = "ai-generated-" + Date.now() + ".png";
			document.body.appendChild(anchor);
			anchor.click();
			anchor.remove();
			window.URL.revokeObjectURL(url);
			toast.success("Image downloaded");
		} catch {
			window.open(imageUrl, "_blank", "noopener,noreferrer");
			toast.info("Opened the image in a new tab");
		}
	};

	const loadPrompt = (selectedPrompt: string) => {
		setPrompt(selectedPrompt);
		setActiveTab("generator");
		document.getElementById("ai-image-prompt")?.focus();
	};

	const loadFromHistory = (item: ImageGeneration) => {
		setPrompt(item.prompt);
		setStyle(item.style);
		setSize(item.size);
		setAspectRatio(item.aspectRatio || "square");
		setSeed(item.seed || "");
		setImageUrl(item.url);
		setActiveTab("generator");
	};

	const generateRandomSeed = () => {
		setSeed(Math.floor(Math.random() * 1_000_000).toString());
		toast.success("Random seed generated");
	};

	const currentImage = imageUrl
		? {
				id: Date.now(),
				url: imageUrl,
				prompt: prompt.trim(),
				style,
				size,
				aspectRatio,
				seed: seed.trim(),
				timestamp: new Date().toISOString(),
			}
		: null;

	return (
		<div className="w-full">
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-5"
			>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-sm font-medium text-foreground">
							Create an image
						</p>
						<p className="text-xs text-muted-foreground">
							Describe it, choose a look, then generate.
						</p>
					</div>
					<TabsList className="grid h-10 w-full grid-cols-3 rounded-xl bg-muted/60 p-1 sm:w-[360px]">
						<TabsTrigger
							value="generator"
							className="gap-1.5 rounded-lg px-2 text-xs sm:text-sm"
						>
							<Wand2 className="h-4 w-4" />
							<span>Create</span>
						</TabsTrigger>
						<TabsTrigger
							value="history"
							className="gap-1.5 rounded-lg px-2 text-xs sm:text-sm"
						>
							<History className="h-4 w-4" />
							<span>History {history.length > 0 ? "(" + history.length + ")" : ""}</span>
						</TabsTrigger>
						<TabsTrigger
							value="favorites"
							className="gap-1.5 rounded-lg px-2 text-xs sm:text-sm"
						>
							<HeartIcon className="h-4 w-4" />
							<span>Saved {favorites.length > 0 ? "(" + favorites.length + ")" : ""}</span>
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="generator" className="m-0">
					<div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(360px,0.8fr)_minmax(0,1.2fr)]">
						<section className="rounded-2xl border border-border/60 bg-card/70 p-3.5 shadow-none sm:p-4">
							<div className="space-y-5">
								<div>
									<div className="mb-2 flex items-center justify-between gap-3">
										<div>
											<Label
												htmlFor="ai-image-prompt"
												className="text-base font-semibold"
											>
												Describe your image
											</Label>
											<p className="mt-1 text-xs text-muted-foreground">
												Add the subject, setting, lighting, mood, and composition.
											</p>
										</div>
										<span className="shrink-0 text-xs tabular-nums text-muted-foreground">
											{prompt.length}/1200
										</span>
									</div>
									<Textarea
										id="ai-image-prompt"
										maxLength={1200}
										placeholder="A cinematic mountain cabin at blue hour, warm window light, misty pine forest, detailed photography..."
										value={prompt}
										onChange={(event) => setPrompt(event.target.value)}
										disabled={loading}
										className="min-h-[132px] resize-none rounded-xl border-border/70 bg-background/50 px-4 py-3 text-[15px] leading-6 shadow-none focus-visible:ring-2"
									/>
								</div>

								<div>
									<div className="mb-2 flex items-center justify-between">
										<div>
											<p className="text-sm font-semibold">Need inspiration?</p>
											<p className="text-xs text-muted-foreground">
												Tap an example to fill the prompt.
											</p>
										</div>
										<Star className="h-4 w-4 text-muted-foreground" />
									</div>
									<div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
										{quickPrompts.map((example) => (
											<button
												key={example.text}
												type="button"
												onClick={() => loadPrompt(example.text)}
												disabled={loading}
												className="rounded-xl border border-border/60 bg-muted/35 px-3 py-2.5 text-left text-xs leading-5 text-foreground transition-colors hover:border-primary/40 hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-60"
											>
												<span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
													{example.category}
												</span>
												<span className="line-clamp-2">{example.text}</span>
											</button>
										))}
									</div>
								</div>

								<div>
									<div className="mb-2 flex items-center justify-between gap-3">
										<div>
											<p className="text-sm font-semibold">Style</p>
											<p className="text-xs text-muted-foreground">
												Pick the visual direction.
											</p>
										</div>
										<Badge variant="outline" className="hidden gap-1.5 sm:inline-flex">
											{selectedStyle?.icon} {selectedStyle?.label}
										</Badge>
									</div>
									<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
										{STYLES.map((styleOption) => {
											const isSelected = style === styleOption.value;
											return (
												<button
													key={styleOption.value}
													type="button"
													onClick={() => setStyle(styleOption.value)}
													disabled={loading}
													title={styleOption.description}
													aria-pressed={isSelected}
													className={
														"min-h-12 rounded-xl border px-3 py-2 text-left transition-colors " +
														(isSelected
															? "border-primary bg-primary/10 text-foreground shadow-sm"
															: "border-border/60 bg-background/40 text-muted-foreground hover:border-border hover:bg-muted/50")
													}
												>
													<span className="flex items-center gap-2 text-xs font-medium">
														<span aria-hidden="true">{styleOption.icon}</span>
														<span>{styleOption.label}</span>
													</span>
												</button>
											);
										})}
									</div>
								</div>

								<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
									<div className="space-y-2">
										<Label className="text-sm font-medium">Aspect ratio</Label>
										<select
											value={aspectRatio}
											onChange={(event) => setAspectRatio(event.target.value)}
											disabled={loading}
											className="flex h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
										>
											{ASPECT_RATIOS.map((ratio) => (
												<option key={ratio.value} value={ratio.value}>
													{ratio.label}
												</option>
											))}
										</select>
									</div>
									<div className="space-y-2">
										<Label className="text-sm font-medium">Image size</Label>
										<select
											value={size}
											onChange={(event) => setSize(event.target.value)}
											disabled={loading}
											className="flex h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
										>
											{availableSizes.map((sizeOption) => (
												<option key={sizeOption} value={sizeOption}>
													{sizeOption}
												</option>
											))}
										</select>
									</div>
								</div>

								<details className="group rounded-xl border border-border/50 bg-muted/20">
									<summary className="flex cursor-pointer list-none items-center justify-between px-3 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
										<span>Advanced settings</span>
										<span className="text-xs text-muted-foreground transition-transform group-open:rotate-180">
											⌄
										</span>
									</summary>
									<div className="space-y-2 border-t border-border/50 px-3 py-3">
										<div className="flex items-center justify-between gap-3">
											<div>
												<Label htmlFor="seed" className="text-sm">
													Seed
												</Label>
												<p className="text-xs text-muted-foreground">
													Reuse a seed when you want reproducible results.
												</p>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="h-8 shrink-0 gap-1.5 px-2.5 text-xs"
												onClick={generateRandomSeed}
												disabled={loading}
												title="Generate a random seed"
											>
												<RefreshCwIcon className="h-3.5 w-3.5" />
												Randomize
											</Button>
										</div>
										<div className="flex gap-2">
											<Input
												id="seed"
												inputMode="numeric"
												placeholder="Optional number"
												value={seed}
												onChange={(event) =>
													setSeed(event.target.value.replace(/\D/g, "").slice(0, 10))
												}
												disabled={loading}
												className="h-10 rounded-xl bg-background/60 shadow-none"
											/>
											<Button
												type="button"
												variant="outline"
												size="icon"
												className="h-10 w-10 shrink-0 rounded-xl"
												onClick={generateRandomSeed}
												disabled={loading}
												aria-label="Generate random seed"
											>
												<RefreshCwIcon className="h-4 w-4" />
											</Button>
										</div>
									</div>
								</details>

								<div className="space-y-3 pt-1">
									<div className="flex items-start gap-2 rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground">
										<InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
										<p>
											External processing: your prompt is sent to Pollinations.ai to
											generate the image. Avoid sensitive or confidential data.
										</p>
									</div>

									<Button
										onClick={handleGenerate}
										disabled={loading || !prompt.trim()}
										className="h-11 w-full rounded-xl text-sm font-semibold shadow-sm sm:h-12"
										size="lg"
									>
										{loading ? (
											<>
												<RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
												Generating…
											</>
										) : (
											<>
												<Sparkles className="mr-2 h-4 w-4" />
												Generate image
											</>
										)}
									</Button>

									{loading && (
										<div className="space-y-2 rounded-xl bg-muted/25 px-3 py-2.5">
											<div className="flex items-center justify-between text-xs font-medium">
												<span>Generating image</span>
												<span className="tabular-nums">
													{Math.round(generationProgress)}%
												</span>
											</div>
											<Progress value={generationProgress} className="h-1.5" />
										</div>
									)}

									{error && (
										<Alert variant="destructive" className="rounded-xl">
											<AlertDescription>{error}</AlertDescription>
										</Alert>
									)}
								</div>
							</div>
						</section>

						<section className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-none sm:p-5">
							<div className="mb-4 flex items-start justify-between gap-3">
								<div>
									<div className="flex items-center gap-2">
										<ImageIcon className="h-5 w-5" />
										<h2 className="text-base font-semibold">
											{imageUrl ? "Your generated image" : "Preview"}
										</h2>
									</div>
									<p className="mt-1 text-xs text-muted-foreground">
										{imageUrl
											? "Ready to download or save."
											: "Your result will appear here."}
									</p>
								</div>
								{imageUrl && (
									<Badge variant="secondary" className="hidden sm:inline-flex">
										{size}
									</Badge>
								)}
							</div>

							<div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl bg-muted/25 p-2 sm:min-h-[360px] lg:min-h-[400px]">
								{imageUrl ? (
									<img
										src={imageUrl}
										alt={prompt ? "AI generated image: " + prompt : "AI generated image"}
										className="max-h-[520px] w-full rounded-xl object-contain"
										loading="eager"
									/>
								) : loading ? (
									<div className="w-full max-w-sm px-6 text-center">
										<div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-background shadow-sm">
											<RefreshCwIcon className="h-7 w-7 animate-spin text-primary" />
										</div>
										<h3 className="text-base font-semibold">Creating your image</h3>
										<p className="mt-1 text-sm text-muted-foreground">
											You can keep your current settings while it renders.
										</p>
										<div className="mt-5">
											<Progress value={generationProgress} className="h-1.5" />
										</div>
									</div>
								) : (
									<div className="max-w-sm px-6 text-center">
										<div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-background shadow-sm">
											<Wand2 className="h-7 w-7 text-muted-foreground" />
										</div>
										<h3 className="text-base font-semibold">
											Your canvas is ready
										</h3>
										<p className="mt-1 text-sm leading-6 text-muted-foreground">
											Write a prompt on the left, choose a style, and generate your
											first image.
										</p>
										<button
											type="button"
											onClick={() => loadPrompt("A cinematic portrait with soft natural light")}
											className="mt-4 text-xs font-medium text-primary underline underline-offset-4 hover:no-underline"
										>
											Try a sample prompt
										</button>
									</div>
								)}

								{loading && imageUrl && (
									<div className="absolute inset-2 flex items-center justify-center rounded-xl bg-background/75 p-6 text-center backdrop-blur-sm">
										<div>
											<RefreshCwIcon className="mx-auto mb-2 h-7 w-7 animate-spin" />
											<p className="text-sm font-semibold">Generating new image…</p>
											<p className="mt-1 text-xs text-muted-foreground">
												Please keep this tab open.
											</p>
										</div>
									</div>
								)}
							</div>

							{imageUrl && (
								<div className="mt-4 space-y-3">
									<div className="flex flex-wrap gap-2">
										<Button
											onClick={handleDownload}
											className="h-10 gap-2 rounded-xl"
										>
											<DownloadIcon className="h-4 w-4" />
											Download
										</Button>
										<Button
											onClick={handleCopy}
											variant="outline"
											className="h-10 gap-2 rounded-xl"
										>
											<CopyIcon className="h-4 w-4" />
											{copied ? "Copied" : "Copy URL"}
										</Button>
										<Button
											onClick={() =>
												currentImage && addToFavorites(currentImage)
											}
											variant="outline"
											className="h-10 gap-2 rounded-xl"
										>
											<HeartIcon className="h-4 w-4" />
											Save
										</Button>
									</div>

									<div className="rounded-xl bg-muted/25 px-3 py-3">
										<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
											<span className="flex items-center gap-1.5">
												<Palette className="h-3.5 w-3.5" />
												{selectedStyle?.label}
											</span>
											<span className="flex items-center gap-1.5">
												<ImageIcon className="h-3.5 w-3.5" />
												{size}
											</span>
											{seed && (
												<span className="flex items-center gap-1.5">
													<RefreshCwIcon className="h-3.5 w-3.5" />
													Seed {seed}
												</span>
											)}
										</div>
										<p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
											{prompt}
										</p>
									</div>
								</div>
							)}
						</section>
					</div>
				</TabsContent>

				<TabsContent value="history" className="m-0">
					<section className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-none sm:p-5">
						<div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<div className="flex items-center gap-2">
									<History className="h-5 w-5" />
									<h2 className="text-base font-semibold">Generation history</h2>
								</div>
								<p className="mt-1 text-xs text-muted-foreground">
									Your recent generated images are stored locally in this browser.
								</p>
							</div>
							{history.length > 0 && (
								<Button
									onClick={clearHistory}
									variant="outline"
									size="sm"
									className="w-full gap-2 rounded-xl sm:w-auto"
								>
									<TrashIcon className="h-4 w-4" />
									Clear history
								</Button>
							)}
						</div>

						{history.length === 0 ? (
							<div className="flex min-h-[220px] items-center justify-center rounded-2xl bg-muted/20 px-6 text-center">
								<div className="max-w-sm">
									<History className="mx-auto mb-4 h-10 w-10 text-muted-foreground/60" />
									<h3 className="text-base font-semibold">Nothing here yet</h3>
									<p className="mt-1 text-sm leading-6 text-muted-foreground">
										Generate an image and it will appear here for quick reuse.
									</p>
									<Button
										onClick={() => setActiveTab("generator")}
										variant="outline"
										size="sm"
										className="mt-4 rounded-xl"
									>
										Create an image
									</Button>
								</div>
							</div>
						) : (
							<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{history.map((item) => (
									<div
										key={item.id}
										className="overflow-hidden rounded-xl border border-border/60 bg-background/40"
									>
										<button
											type="button"
											onClick={() => loadFromHistory(item)}
											className="block w-full text-left"
											aria-label={"Load image: " + item.prompt}
										>
											<img
												src={item.url}
												alt=""
												className="h-44 w-full object-cover transition-transform hover:scale-[1.02]"
												loading="lazy"
											/>
										</button>
										<div className="space-y-3 p-3">
											<p className="line-clamp-2 text-sm font-medium leading-5">
												{item.prompt}
											</p>
											<div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
												<span className="flex items-center gap-1">
													<Clock className="h-3 w-3" />
													{new Date(item.timestamp).toLocaleDateString()}
												</span>
												<Badge variant="outline" className="max-w-[55%] truncate text-[10px]">
													{STYLES.find((option) => option.value === item.style)?.label ??
														item.style}
												</Badge>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</section>
				</TabsContent>

				<TabsContent value="favorites" className="m-0">
					<section className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-none sm:p-5">
						<div className="mb-5">
							<div className="flex items-center gap-2">
								<HeartIcon className="h-5 w-5" />
								<h2 className="text-base font-semibold">Saved images</h2>
							</div>
							<p className="mt-1 text-xs text-muted-foreground">
								Keep the generations you want to revisit.
							</p>
						</div>

						{favorites.length === 0 ? (
							<div className="flex min-h-[280px] items-center justify-center rounded-2xl bg-muted/20 px-6 text-center">
								<div className="max-w-sm">
									<HeartIcon className="mx-auto mb-4 h-10 w-10 text-muted-foreground/60" />
									<h3 className="text-base font-semibold">No saved images</h3>
									<p className="mt-1 text-sm leading-6 text-muted-foreground">
										Use Save after a generation to keep your favorites in this browser.
									</p>
									<Button
										onClick={() => setActiveTab("generator")}
										variant="outline"
										size="sm"
										className="mt-4 rounded-xl"
									>
										Back to generator
									</Button>
								</div>
							</div>
						) : (
							<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{favorites.map((item) => (
									<div
										key={item.id}
										className="overflow-hidden rounded-xl border border-border/60 bg-background/40"
									>
										<div className="relative">
											<button
												type="button"
												onClick={() => loadFromHistory(item)}
												className="block w-full text-left"
												aria-label={"Load saved image: " + item.prompt}
											>
												<img
													src={item.url}
													alt=""
													className="h-44 w-full object-cover transition-transform hover:scale-[1.02]"
													loading="lazy"
												/>
											</button>
											<Button
												onClick={() => removeFromFavorites(item.url)}
												type="button"
												size="icon"
												variant="secondary"
												className="absolute right-2 top-2 h-8 w-8 rounded-lg bg-background/90 shadow-sm backdrop-blur-sm hover:bg-background"
												aria-label="Remove from favorites"
											>
												<TrashIcon className="h-4 w-4" />
											</Button>
										</div>
										<div className="space-y-3 p-3">
											<p className="line-clamp-2 text-sm font-medium leading-5">
												{item.prompt}
											</p>
											<div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
												<span className="flex items-center gap-1">
													<Clock className="h-3 w-3" />
													{new Date(item.timestamp).toLocaleDateString()}
												</span>
												<Badge variant="outline" className="max-w-[55%] truncate text-[10px]">
													{STYLES.find((option) => option.value === item.style)?.label ??
														item.style}
												</Badge>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</section>
				</TabsContent>
			</Tabs>
		</div>
	);
}
