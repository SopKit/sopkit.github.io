"use client";

import { Check, Copy, ImageIcon, Wand2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface ModCategory {
	key: string;
	label: string;
	color: string;
	terms: string[];
}

const CATEGORIES: ModCategory[] = [
	{
		key: "style",
		label: "Style",
		color: "text-violet-600 dark:text-violet-400 bg-violet-500/10",
		terms: [
			"photorealistic",
			"watercolor",
			"cinematic still",
			"oil painting",
			"anime style",
			"isometric 3D render",
			"film photography",
			"digital illustration",
			"papercraft",
			"vaporwave",
		],
	},
	{
		key: "lighting",
		label: "Lighting",
		color: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
		terms: [
			"golden hour light",
			"rim lighting",
			"neon glow",
			"soft diffused light",
			"dramatic chiaroscuro",
			"backlit silhouette",
			"studio softbox lighting",
			"bioluminescence",
			"candlelight",
		],
	},
	{
		key: "camera",
		label: "Camera",
		color: "text-sky-600 dark:text-sky-400 bg-sky-500/10",
		terms: [
			"85mm lens",
			"macro shot",
			"aerial drone view",
			"wide-angle 24mm",
			"shallow depth of field",
			"long exposure",
			"bokeh background",
			"low angle shot",
			"fisheye lens",
			"tilt-shift",
		],
	},
	{
		key: "mood",
		label: "Mood",
		color: "text-rose-600 dark:text-rose-400 bg-rose-500/10",
		terms: [
			"serene",
			"dramatic",
			"cozy",
			"melancholic",
			"whimsical",
			"epic and grand",
			"eerie",
			"nostalgic",
			"energetic",
		],
	},
	{
		key: "detail",
		label: "Detail",
		color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
		terms: [
			"ultra-detailed",
			"8k resolution",
			"intricate textures",
			"hyperrealistic skin pores",
			"sharp focus",
			"physically based rendering",
			"fine fabric weave",
		],
	},
	{
		key: "color",
		label: "Color",
		color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
		terms: [
			"teal and orange grade",
			"pastel palette",
			"monochrome",
			"warm earthy tones",
			"cool blue hour tones",
			"high contrast black and white",
			"iridescent hues",
		],
	},
];

const ASPECTS = ["16:9", "1:1", "9:16", "4:5", "3:2"];

const MODEL_HINTS: Record<string, string> = {
	midjourney:
		"Midjourney v7 responds strongly to Style/Camera tokens — keep it under ~40 words and use --stylize for artistic freedom.",
	sd: "Stable Diffusion weighs early tokens more — put Detail and Lighting modifiers first for maximum effect.",
	dalle:
		"DALL·E prefers natural sentences — the extended prompt reads as a fluent description rather than a tag list.",
	flux: "Flux follows natural language best — pick a few strong modifiers instead of stacking many tags.",
};

export default function ImagePromptExtender() {
	const [basePrompt, setBasePrompt] = useState("");
	const [modelId, setModelId] =
		useState<keyof typeof MODEL_HINTS>("midjourney");
	const [active, setActive] = useState<string[]>([]);
	const [aspect, setAspect] = useState("16:9");
	const [useVersion, setUseVersion] = useState(true);
	const [stylize, setStylize] = useState(250);
	const [copied, setCopied] = useState(false);

	const toggleTerm = (term: string) => {
		setActive((prev) =>
			prev.includes(term) ? prev.filter((t) => t !== term) : [...prev, term],
		);
	};

	const finalPrompt = useMemo(() => {
		const base = basePrompt.trim();
		if (!base && active.length === 0) return "";
		const parts = [base, ...active].filter(Boolean).join(", ");
		let params = "";
		if (modelId === "midjourney") {
			const flags: string[] = [];
			flags.push(`--ar ${aspect}`);
			if (useVersion) flags.push("--v 7");
			flags.push(`--stylize ${stylize}`);
			params = ` ${flags.join(" ")}`;
			return parts ? `${parts}${params}` : params.trim();
		}
		return parts;
	}, [basePrompt, active, modelId, aspect, useVersion, stylize]);

	const handleCopy = () => {
		if (!finalPrompt.trim()) {
			toast.error("Add a base prompt or some modifiers first");
			return;
		}
		if (navigator.clipboard?.writeText) {
			navigator.clipboard
				.writeText(finalPrompt)
				.then(() => toast.success("Copied to clipboard"))
				.catch(() => toast.error("Copy failed"));
		} else {
			toast.error("Clipboard unavailable");
			return;
		}
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="space-y-8 max-w-5xl mx-auto">
			<div className="flex items-center gap-2 p-3.5 rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/5 text-xs font-semibold text-fuchsia-600 dark:text-fuchsia-400">
				<ImageIcon className="h-4.5 w-4.5 shrink-0" />
				<span>
					Everything runs locally — compose prompts with one click and copy them
					straight into your generator of choice.
				</span>
			</div>

			<div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-3">
				<Label htmlFor="base-prompt" className="text-sm font-bold">
					Base Prompt
				</Label>
				<Input
					id="base-prompt"
					value={basePrompt}
					onChange={(e) => setBasePrompt(e.target.value)}
					placeholder="e.g. a lighthouse on a stormy cliff at dusk"
					className="h-11 text-sm"
				/>
				<div className="flex flex-wrap gap-1.5 pt-1">
					{(Object.keys(MODEL_HINTS) as Array<keyof typeof MODEL_HINTS>).map(
						(m) => (
							<button
								key={m}
								type="button"
								aria-pressed={m === modelId}
								onClick={() => setModelId(m)}
								className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all ${m === modelId ? "bg-foreground text-background shadow-sm" : "bg-muted/70 text-muted-foreground hover:text-foreground border border-border/50"}`}
							>
								{m}
							</button>
						),
					)}
				</div>
				<p className="text-[11px] text-muted-foreground leading-relaxed">
					{MODEL_HINTS[modelId]}
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
				{CATEGORIES.map((cat) => (
					<div
						key={cat.key}
						className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm space-y-3"
					>
						<div className="flex items-center justify-between">
							<span
								className={`px-2 py-0.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${cat.color}`}
							>
								{cat.label}
							</span>
							<span className="text-[11px] text-muted-foreground tabular-nums">
								{cat.terms.filter((t) => active.includes(t)).length}/
								{cat.terms.length}
							</span>
						</div>
						<div className="flex flex-wrap gap-1.5">
							{cat.terms.map((term) => {
								const isActive = active.includes(term);
								return (
									<button
										key={term}
										type="button"
										onClick={() => toggleTerm(term)}
										aria-pressed={isActive}
										className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${isActive ? "bg-emerald-500/90 text-white shadow-sm hover:bg-emerald-500" : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"}`}
									>
										{term}
									</button>
								);
							})}
						</div>
					</div>
				))}
			</div>

			{modelId === "midjourney" && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-card border border-border/60 shadow-sm">
					<div className="space-y-2">
						<Label className="text-xs font-bold">Aspect Ratio (--ar)</Label>
						<div className="flex flex-wrap gap-1.5">
							{ASPECTS.map((a) => (
								<button
									key={a}
									type="button"
									onClick={() => setAspect(a)}
									className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${a === aspect ? "bg-fuchsia-500/90 text-white shadow-sm" : "bg-muted/70 text-muted-foreground hover:text-foreground border border-border/50"}`}
								>
									{a}
								</button>
							))}
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="stylize" className="text-xs font-bold">
								Stylize
							</Label>
							<span className="text-xs tabular-nums text-fuchsia-600 dark:text-fuchsia-400">
								{stylize}
							</span>
						</div>
						<Slider
							id="stylize"
							value={[stylize]}
							min={0}
							max={1000}
							step={50}
							onValueChange={(v) => setStylize(v[0])}
						/>
					</div>
					<div className="space-y-2">
						<Label className="text-xs font-bold">Version Flag</Label>
						<button
							type="button"
							onClick={() => setUseVersion(!useVersion)}
							aria-pressed={useVersion}
							className={`w-full px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${useVersion ? "bg-fuchsia-500/90 text-white shadow-sm" : "bg-muted/70 text-muted-foreground border border-border/50"}`}
						>
							--v 7 {useVersion ? "included" : "excluded"}
						</button>
					</div>
				</div>
			)}

			<div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-4">
				<div className="flex items-center justify-between gap-3 flex-wrap">
					<h3 className="text-sm font-bold flex items-center gap-1.5">
						<Wand2 className="h-4 w-4 text-fuchsia-500" /> Final Prompt
					</h3>
					<Button
						size="sm"
						onClick={handleCopy}
						disabled={!finalPrompt.trim()}
						className="gap-1.5 text-xs h-8"
					>
						{copied ? (
							<Check className="h-3.5 w-3.5" />
						) : (
							<Copy className="h-3.5 w-3.5" />
						)}{" "}
						{copied ? "Copied" : "Copy Prompt"}
					</Button>
				</div>
				<pre
					className={`min-h-[64px] p-4 rounded-xl bg-muted/50 border border-border/40 font-mono text-xs leading-relaxed whitespace-pre-wrap ${finalPrompt ? "" : "italic text-muted-foreground"}`}
				>
					{finalPrompt ||
						"Your composed prompt will appear here — start typing above or click modifier chips."}
				</pre>
				{active.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{active.map((t) => (
							<button
								key={t}
								type="button"
								onClick={() => toggleTerm(t)}
								className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold hover:bg-red-500/15 hover:text-red-600 transition-colors"
							>
								{t} <X className="h-3 w-3" />
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
