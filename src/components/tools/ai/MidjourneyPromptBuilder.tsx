"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Copy, Check, Sparkles, Image as ImageIcon, RotateCcw, Sliders, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MidjourneyPromptBuilder() {
	const [subject, setSubject] = useState("");
	const [aspectRatio, setAspectRatio] = useState("16:9");
	const [version, setVersion] = useState("6.0");
	const [artStyle, setArtStyle] = useState("");
	const [lighting, setLighting] = useState("");
	const [camera, setCamera] = useState("");
	const [stylize, setStylize] = useState(100);
	const [chaos, setChaos] = useState(0);
	const [weird, setWeird] = useState(0);
	const [negativePrompt, setNegativePrompt] = useState("");
	const [isTile, setIsTile] = useState(false);
	const [isRaw, setIsRaw] = useState(false);
	const [quality, setQuality] = useState("1");
	const [compiledPrompt, setCompiledPrompt] = useState("");
	const [copied, setCopied] = useState(false);

	// Recompile prompt on state changes
	useEffect(() => {
		let prompt = subject.trim() ? subject.trim() : "[Subject]";
		
		if (artStyle) prompt += `, ${artStyle}`;
		if (lighting) prompt += `, ${lighting} lighting`;
		if (camera) prompt += `, ${camera}`;
		
		// Add Midjourney specific parameters
		prompt += ` --ar ${aspectRatio}`;
		prompt += ` --v ${version}`;
		
		if (isRaw && (version === "6.0" || version === "5.2" || version === "5.1")) {
			prompt += " --style raw";
		}
		if (stylize !== 100) {
			prompt += ` --stylize ${stylize}`;
		}
		if (chaos > 0) {
			prompt += ` --chaos ${chaos}`;
		}
		if (weird > 0) {
			prompt += ` --weird ${weird}`;
		}
		if (quality !== "1") {
			prompt += ` --q ${quality}`;
		}
		if (isTile) {
			prompt += " --tile";
		}
		if (negativePrompt.trim()) {
			prompt += ` --no ${negativePrompt.trim()}`;
		}

		setCompiledPrompt(`/imagine prompt: ${prompt}`);
	}, [subject, aspectRatio, version, artStyle, lighting, camera, stylize, chaos, weird, negativePrompt, isTile, isRaw, quality]);

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(compiledPrompt);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy text", err);
		}
	};

	const resetFields = () => {
		setSubject("");
		setAspectRatio("16:9");
		setVersion("6.0");
		setArtStyle("");
		setLighting("");
		setCamera("");
		setStylize(100);
		setChaos(0);
		setWeird(0);
		setNegativePrompt("");
		setIsTile(false);
		setIsRaw(false);
		setQuality("1");
	};

	const artStyles = [
		"Photorealistic", "Oil Painting", "Watercolor", "3D Render", "Vector Art",
		"Claymation", "Cyberpunk", "Cinematic", "Anime", "Ukiyo-e", "Steampunk",
		"Minimalist Logo", "Pop Art", "Charcoal Sketch", "Voxel Art"
	];

	const lightings = [
		"Cinematic", "Golden Hour", "Studio Portrait", "Neon", "Soft Diffusion",
		"Volumetric", "Moody Dark", "Sunset", "Bioluminescent", "Rim Light"
	];

	const cameras = [
		"Macro lens", "Wide Angle 18mm", "Drone aerial shot", "Extreme close-up",
		"Fisheye lens", "GoPro view", "Vintage film 35mm", "Satellite view"
	];

	return (
		<div className="w-full max-w-4xl mx-auto space-y-8 font-sans">
			<Card className="border border-border/40 bg-card/30 backdrop-blur-md">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl font-black">
						<Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
						Midjourney Prompt Builder
					</CardTitle>
					<CardDescription>
						Mix-and-match Midjourney parameters, art styles, camera settings, and aspect ratios to construct the perfect image prompt.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					
					{/* Text Input for Subject */}
					<div className="space-y-2">
						<Label className="font-bold text-sm">Image Subject (Core Concept)</Label>
						<Input
							placeholder="e.g. A futuristic astronaut sipping coffee on Mars with a view of Earth in the background"
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							className="text-sm py-5"
						/>
					</div>

					{/* 3-Column Grid for Preset Helpers */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						
						{/* Column 1: Art Style */}
						<div className="space-y-2">
							<Label className="font-bold text-xs flex items-center gap-1">
								<ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
								Art Style
							</Label>
							<select
								value={artStyle}
								onChange={(e) => setArtStyle(e.target.value)}
								className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
							>
								<option value="">None (Default Midjourney Style)</option>
								{artStyles.map(style => (
									<option key={style} value={style}>{style}</option>
								))}
							</select>
						</div>

						{/* Column 2: Lighting */}
						<div className="space-y-2">
							<Label className="font-bold text-xs flex items-center gap-1">
								<Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
								Lighting Style
							</Label>
							<select
								value={lighting}
								onChange={(e) => setLighting(e.target.value)}
								className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
							>
								<option value="">None</option>
								{lightings.map(light => (
									<option key={light} value={light}>{light}</option>
								))}
							</select>
						</div>

						{/* Column 3: Camera & Lens */}
						<div className="space-y-2">
							<Label className="font-bold text-xs flex items-center gap-1">
								<Settings className="h-3.5 w-3.5 text-muted-foreground" />
								Camera Lens & Angle
							</Label>
							<select
								value={camera}
								onChange={(e) => setCamera(e.target.value)}
								className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
							>
								<option value="">None</option>
								{cameras.map(cam => (
									<option key={cam} value={cam}>{cam}</option>
								))}
							</select>
						</div>

					</div>

					{/* 2-Column Grid for Parameters */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/20">
						
						{/* Left parameter column */}
						<div className="space-y-4">
							<h3 className="font-bold text-xs text-indigo-500 uppercase tracking-wider flex items-center gap-1">
								<Sliders className="h-3.5 w-3.5" />
								Ratios & Engine
							</h3>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1.5">
									<Label className="text-xs font-bold">Aspect Ratio (--ar)</Label>
									<select
										value={aspectRatio}
										onChange={(e) => setAspectRatio(e.target.value)}
										className="w-full h-9 px-2 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring"
									>
										<option value="16:9">16:9 (Landscape)</option>
										<option value="1:1">1:1 (Square)</option>
										<option value="9:16">9:16 (Portrait/Story)</option>
										<option value="4:5">4:5 (Instagram Post)</option>
										<option value="2:3">2:3 (Pinterest)</option>
										<option value="3:2">3:2 (Camera Photo)</option>
									</select>
								</div>

								<div className="space-y-1.5">
									<Label className="text-xs font-bold">Version (--v)</Label>
									<select
										value={version}
										onChange={(e) => setVersion(e.target.value)}
										className="w-full h-9 px-2 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring"
									>
										<option value="6.0">Version 6.0 (Latest)</option>
										<option value="5.2">Version 5.2</option>
										<option value="5.1">Version 5.1</option>
										<option value="niji 6">Niji 6 (Anime)</option>
										<option value="niji 5">Niji 5 (Anime)</option>
									</select>
								</div>
							</div>

							<div className="flex flex-wrap gap-4 pt-2">
								<label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
									<input
										type="checkbox"
										checked={isRaw}
										onChange={(e) => setIsRaw(e.target.checked)}
										className="rounded border-input text-primary focus:ring-primary h-4 w-4 bg-background"
									/>
									<span>Style Raw (--style raw)</span>
								</label>

								<label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
									<input
										type="checkbox"
										checked={isTile}
										onChange={(e) => setIsTile(e.target.checked)}
										className="rounded border-input text-primary focus:ring-primary h-4 w-4 bg-background"
									/>
									<span>Seamless Tile (--tile)</span>
								</label>
							</div>
						</div>

						{/* Right parameter column (Sliders) */}
						<div className="space-y-4">
							<h3 className="font-bold text-xs text-indigo-500 uppercase tracking-wider flex items-center gap-1">
								<Sliders className="h-3.5 w-3.5" />
								Styling Parameters
							</h3>

							<div className="space-y-3">
								<div className="space-y-1">
									<div className="flex justify-between text-xs font-bold">
										<Label>Stylize (--stylize)</Label>
										<span className="text-muted-foreground">{stylize}</span>
									</div>
									<input
										type="range"
										min="0"
										max="1000"
										step="10"
										value={stylize}
										onChange={(e) => setStylize(Number(e.target.value))}
										className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
									/>
								</div>

								<div className="space-y-1">
									<div className="flex justify-between text-xs font-bold">
										<Label>Chaos (--chaos)</Label>
										<span className="text-muted-foreground">{chaos}</span>
									</div>
									<input
										type="range"
										min="0"
										max="100"
										step="1"
										value={chaos}
										onChange={(e) => setChaos(Number(e.target.value))}
										className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
									/>
								</div>

								<div className="space-y-1">
									<div className="flex justify-between text-xs font-bold">
										<Label>Weirdness (--weird)</Label>
										<span className="text-muted-foreground">{weird}</span>
									</div>
									<input
										type="range"
										min="0"
										max="3000"
										step="50"
										value={weird}
										onChange={(e) => setWeird(Number(e.target.value))}
										className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
									/>
								</div>
							</div>
						</div>

					</div>

					{/* Negative prompt input */}
					<div className="space-y-2 pt-2">
						<Label className="font-bold text-xs">Negative Prompting (--no)</Label>
						<Input
							placeholder="Objects or elements to exclude (e.g. text, watermarks, signature, blurry, duplicate)"
							value={negativePrompt}
							onChange={(e) => setNegativePrompt(e.target.value)}
							className="text-xs"
						/>
					</div>

					{/* Dynamic compiled Output Card */}
					<Card className="border border-indigo-500/20 bg-indigo-500/5 mt-6">
						<CardContent className="p-4 space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Generated Midjourney Command</span>
								<div className="flex gap-2">
									<Button size="sm" onClick={copyToClipboard} className="bg-indigo-600 hover:bg-indigo-700 font-bold text-xs gap-1.5">
										{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
										{copied ? "Copied!" : "Copy Prompt"}
									</Button>
									<Button size="sm" variant="outline" onClick={resetFields} className="text-xs gap-1">
										<RotateCcw className="h-3 w-3" />
										Reset
									</Button>
								</div>
							</div>
							
							<div className="p-3 bg-zinc-950/70 border border-border/40 rounded-lg select-all">
								<code className="text-xs md:text-sm font-mono break-all text-zinc-100 leading-relaxed block">
									{compiledPrompt}
								</code>
							</div>
						</CardContent>
					</Card>

				</CardContent>
			</Card>
		</div>
	);
}
