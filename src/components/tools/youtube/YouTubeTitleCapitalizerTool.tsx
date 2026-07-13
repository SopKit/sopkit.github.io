"use client";

import { useState } from "react";
import { CaseSensitive, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function YouTubeTitleCapitalizerTool() {
	const [title, setTitle] = useState("how to grow your youtube channel in 30 days");
	const [copied, setCopied] = useState(false);

	const toTitleCase = (str: string) => {
		const minorWords = ["a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", "of", "on", "or", "so", "the", "to", "up", "yet", "v", "vs", "via"];
		return str
			.toLowerCase()
			.split(" ")
			.map((word, index, arr) => {
				if (word.length === 0) return "";
				if (
					index > 0 &&
					index < arr.length - 1 &&
					minorWords.includes(word)
				) {
					return word;
				}
				return word.charAt(0).toUpperCase() + word.slice(1);
			})
			.join(" ");
	};

	const toUpperCase = (str: string) => str.toUpperCase();
	const toLowerCase = (str: string) => str.toLowerCase();
	const toStartCase = (str: string) => {
		return str
			.toLowerCase()
			.split(" ")
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	const [transformMode, setTransformMode] = useState<"title" | "upper" | "lower" | "start">("title");

	const getTransformed = () => {
		if (transformMode === "title") return toTitleCase(title);
		if (transformMode === "upper") return toUpperCase(title);
		if (transformMode === "lower") return toLowerCase(title);
		if (transformMode === "start") return toStartCase(title);
		return title;
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(getTransformed());
		setCopied(true);
		toast.success("Capitalized title copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6 animate-in">
			<Card className="border border-border/40 bg-card/60 backdrop-blur-sm shadow-xl">
				<CardHeader className="pb-4">
					<CardTitle className="text-2xl font-bold flex items-center gap-2">
						<CaseSensitive className="w-6 h-6 text-primary" />
						YouTube Title Capitalizer
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<label className="text-sm font-semibold">Enter Video Title</label>
						<Input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g. how to grow your youtube channel in 30 days"
							className="h-12 text-base px-4 bg-muted/20 border-2 border-primary/5 focus:border-primary/20 rounded-xl"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-semibold">Capitalization Mode</label>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
							{(["title", "start", "upper", "lower"] as const).map((mode) => (
								<Button
									key={mode}
									variant={transformMode === mode ? "default" : "outline"}
									onClick={() => setTransformMode(mode)}
									className="capitalize font-semibold text-xs py-5 rounded-xl border border-border/40 hover:scale-105 active:scale-95 transition-all"
								>
									{mode === "title" ? "AP Title Case" : mode === "start" ? "Start Case" : mode === "upper" ? "ALL CAPS" : "lowercase"}
								</Button>
							))}
						</div>
					</div>

					<div className="pt-4 border-t border-border/40 space-y-3">
						<div className="flex justify-between items-center">
							<span className="text-sm font-semibold text-muted-foreground">Transformed Title</span>
							<Button
								size="sm"
								variant="ghost"
								onClick={() => setTitle("")}
								className="text-xs text-destructive hover:bg-destructive/10"
							>
								Clear
							</Button>
						</div>
						<div className="p-4 bg-muted/40 border border-border/40 rounded-xl min-h-[50px] flex items-center justify-between gap-4 font-mono text-sm leading-relaxed whitespace-pre-wrap select-all">
							<span className="text-foreground font-semibold">{getTransformed() || <span className="italic text-muted-foreground">Transformed output will appear here...</span>}</span>
							<Button
								size="icon"
								variant="ghost"
								disabled={!getTransformed()}
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
