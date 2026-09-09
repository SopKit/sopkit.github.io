"use client";

import { Ban, Check, Copy, RefreshCw, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Category {
	key: string;
	label: string;
	color: string;
	terms: string[];
	core: boolean;
}

const CATEGORIES: Category[] = [
	{
		key: "quality",
		label: "Quality",
		color: "text-sky-600 dark:text-sky-400 bg-sky-500/10",
		core: true,
		terms: [
			"lowres",
			"blurry",
			"jpeg artifacts",
			"compression artifacts",
			"pixelated",
			"noise",
			"grainy",
			"oversaturated",
			"overexposed",
			"underexposed",
			"low quality",
			"worst quality",
			"normal quality",
		],
	},
	{
		key: "anatomy",
		label: "Anatomy",
		color: "text-rose-600 dark:text-rose-400 bg-rose-500/10",
		core: true,
		terms: [
			"bad hands",
			"extra fingers",
			"missing fingers",
			"fused fingers",
			"too many fingers",
			"deformed",
			"disfigured",
			"mutation",
			"mutated hands",
			"extra limbs",
			"extra arms",
			"extra legs",
			"bad anatomy",
			"malformed limbs",
			"poorly drawn face",
			"poorly drawn hands",
			"asymmetrical eyes",
			"cross-eyed",
			"long neck",
		],
	},
	{
		key: "text",
		label: "Text & Watermarks",
		color: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
		core: true,
		terms: [
			"text",
			"watermark",
			"logo",
			"signature",
			"username",
			"artist name",
			"caption",
			"subtitle",
			"letters",
			"page number",
			"error",
			"date stamp",
		],
	},
	{
		key: "style",
		label: "Style Contamination",
		color: "text-violet-600 dark:text-violet-400 bg-violet-500/10",
		core: false,
		terms: [
			"cartoon",
			"anime",
			"painting",
			"illustration",
			"sketch",
			"3d render",
			"cgi",
			"doll",
			"plastic skin",
			"airbrushed",
			"childish drawing",
		],
	},
	{
		key: "framing",
		label: "Duplicates & Framing",
		color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
		core: true,
		terms: [
			"cropped",
			"out of frame",
			"cut off",
			"duplicate",
			"cloned face",
			"two heads",
			"multiple views",
			"collage",
			"tiled",
			"border",
			"frame",
			"split screen",
		],
	},
];

interface Dialect {
	id: string;
	name: string;
	hint: string;
}

const DIALECTS: Dialect[] = [
	{
		id: "sd",
		name: "Stable Diffusion",
		hint: "Full comma-separated list — SD weighs every term, so longer lists work well.",
	},
	{
		id: "mj",
		name: "Midjourney",
		hint: "Midjourney uses a single --no parameter; terms are joined with commas after it.",
	},
	{
		id: "flux",
		name: "Flux",
		hint: "Flux understands natural language — a short minimal set avoids over-constraining.",
	},
];

const PRESETS: Record<string, Record<string, string[]>> = {
	portrait: {
		quality: [
			"lowres",
			"blurry",
			"jpeg artifacts",
			"bad anatomy",
			"worst quality",
		],
		anatomy: [
			"bad hands",
			"extra fingers",
			"missing fingers",
			"deformed",
			"disfigured",
			"asymmetrical eyes",
			"long neck",
			"mutated hands",
		],
		text: ["watermark", "signature", "text", "logo"],
		framing: ["cropped", "out of frame"],
	},
	landscape: {
		quality: [
			"lowres",
			"blurry",
			"jpeg artifacts",
			"overexposed",
			"oversaturated",
			"worst quality",
		],
		style: ["cartoon", "anime", "cgi", "3d render"],
		framing: ["cropped", "out of frame", "border", "frame"],
	},
	product: {
		quality: [
			"lowres",
			"blurry",
			"jpeg artifacts",
			"noise",
			"underexposed",
			"worst quality",
		],
		text: ["watermark", "text", "logo", "signature"],
		style: ["doll", "plastic skin", "airbrushed"],
		framing: [
			"cropped",
			"out of frame",
			"cut off",
			"duplicate",
			"cluttered background",
		],
	},
};

export default function NegativePromptGenerator() {
	const [selected, setSelected] = useState<string[]>(
		CATEGORIES[0].terms.slice(0, 5),
	);
	const [dialectId, setDialectId] = useState("sd");
	const [copied, setCopied] = useState(false);

	const dialect = DIALECTS.find((d) => d.id === dialectId) ?? DIALECTS[0];

	const toggleTerm = (term: string) => {
		setSelected((prev) =>
			prev.includes(term) ? prev.filter((t) => t !== term) : [...prev, term],
		);
	};

	const applyPreset = (key: keyof typeof PRESETS) => {
		const preset = PRESETS[key];
		setSelected(Object.values(preset).flat());
		toast.success(`Applied ${key} preset`);
	};

	const output = useMemo(() => {
		if (selected.length === 0) return "";
		if (dialectId === "mj") {
			return `--no ${[...new Set(selected)].join(", ")}`;
		}
		if (dialectId === "flux") {
			return [...new Set(selected)].slice(0, 8).join(", ");
		}
		return [...new Set(selected)].join(", ");
	}, [selected, dialectId]);

	const handleCopy = () => {
		if (!output) {
			toast.error("Select at least one term first");
			return;
		}
		if (navigator.clipboard?.writeText) {
			navigator.clipboard
				.writeText(output)
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
			<div className="flex flex-wrap items-center gap-2 p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs font-semibold text-rose-600 dark:text-rose-400">
				<Ban className="h-4.5 w-4.5 shrink-0" />
				<span>
					Click terms to toggle them into your negative prompt. Selected:{" "}
					<strong className="tabular-nums">{selected.length}</strong>
				</span>
			</div>

			<div className="flex flex-wrap gap-2 items-center">
				<Button
					variant="outline"
					size="sm"
					onClick={() => applyPreset("portrait")}
					className="rounded-full h-8 text-xs gap-1"
				>
					<Wand2 className="h-3.5 w-3.5" /> Portrait
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => applyPreset("landscape")}
					className="rounded-full h-8 text-xs gap-1"
				>
					<Wand2 className="h-3.5 w-3.5" /> Landscape
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => applyPreset("product")}
					className="rounded-full h-8 text-xs gap-1"
				>
					<Wand2 className="h-3.5 w-3.5" /> Product Photo
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setSelected([])}
					className="h-8 text-xs gap-1 text-muted-foreground hover:text-red-500"
				>
					<RefreshCw className="h-3.5 w-3.5" /> Clear All
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
				{CATEGORIES.map((cat) => (
					<div
						key={cat.key}
						className={`p-5 rounded-2xl border shadow-sm space-y-3 ${cat.key === "anatomy" ? "md:col-span-2 xl:col-span-2 xl:row-span-2" : ""} ${cat.core ? "bg-card border-border/60" : "bg-card border-dashed border-violet-500/30"}`}
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<span
									className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${cat.color}`}
								>
									{cat.label}
								</span>
								{!cat.core && (
									<span className="text-[10px] text-muted-foreground italic">
										optional use
									</span>
								)}
							</div>
							<span className="text-[11px] text-muted-foreground tabular-nums">
								{cat.terms.filter((t) => selected.includes(t)).length}/
								{cat.terms.length}
							</span>
						</div>
						<div className="flex flex-wrap gap-1.5">
							{cat.terms.map((term) => {
								const active = selected.includes(term);
								return (
									<button
										key={term}
										type="button"
										onClick={() => toggleTerm(term)}
										aria-pressed={active}
										className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${active ? "bg-red-500/90 text-white shadow-sm hover:bg-red-500" : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"}`}
									>
										{term}
									</button>
								);
							})}
						</div>
					</div>
				))}
			</div>

			<div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-4">
				<div className="flex flex-wrap gap-2">
					{DIALECTS.map((d) => (
						<button
							key={d.id}
							type="button"
							aria-pressed={d.id === dialectId}
							onClick={() => setDialectId(d.id)}
							className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${d.id === dialectId ? "bg-foreground text-background shadow-sm" : "bg-muted/70 text-muted-foreground hover:text-foreground border border-border/50"}`}
						>
							{d.name}
						</button>
					))}
				</div>
				<p className="text-xs text-muted-foreground leading-relaxed">
					{dialect.hint}
					{dialectId === "flux"
						? " Showing only the first 8 selected terms."
						: ""}
				</p>
				<div className="relative">
					<pre
						className={`min-h-[72px] p-4 pr-24 rounded-xl bg-muted/50 border border-border/40 font-mono text-xs leading-relaxed whitespace-pre-wrap ${output ? "" : "italic text-muted-foreground"}`}
					>
						{output || "Toggle terms above to compose your negative prompt."}
					</pre>
					<Button
						size="sm"
						onClick={handleCopy}
						disabled={!output}
						className="absolute bottom-3 right-3 gap-1.5 text-xs h-8"
					>
						{copied ? (
							<Check className="h-3.5 w-3.5" />
						) : (
							<Copy className="h-3.5 w-3.5" />
						)}{" "}
						{copied ? "Copied" : "Copy"}
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant="outline" className="text-[10px]">
						Dedupe on
					</Badge>
					<span className="text-[11px] text-muted-foreground">
						Duplicate selections collapse automatically.
					</span>
				</div>
			</div>
		</div>
	);
}
