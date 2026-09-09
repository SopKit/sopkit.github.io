"use client";

import { useState, useMemo, type ReactNode } from "react";
import { diffWords } from "diff";
import { Copy, Check, GitCompareArrows, CircleCheck, CircleX, FileDiff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface DiffPart {
	value: string;
	added?: boolean;
	removed?: boolean;
}

interface Stats {
	words: number;
	chars: number;
	tokens: number;
	lines: number;
}

const CHECKS: { label: string; pattern: RegExp }[] = [
	{ label: "Role", pattern: /\b(role|system|assistant|user|you are|act as)\b/i },
	{ label: "Context", pattern: /\b(context|background|given|here is|following|below)\b/i },
	{ label: "Constraints", pattern: /\b(must|should|do not|don't|avoid|never|only|limit|max|min)\b/i },
	{ label: "Format spec", pattern: /\b(format|json|markdown|list|table|bullet|csv|schema|respond in)\b/i },
	{ label: "Examples", pattern: /(example|e\.g\.|\bfor instance\b|<example)/i },
];

function computeStats(text: string): Stats {
	return {
		words: (text.match(/\S+/g) || []).length,
		chars: text.length,
		tokens: Math.ceil(text.length / 4),
		lines: text ? text.split("\n").length : 0,
	};
}

function StatsPanel({ side, text, other }: { side: string; text: string; other: string }) {
	const stats = useMemo(() => computeStats(text), [text]);
	const otherStats = useMemo(() => computeStats(other), [other]);
	const rows: { label: string; value: number; delta: number; suffix?: string }[] = [
		{ label: "Words", value: stats.words, delta: stats.words - otherStats.words },
		{ label: "Chars", value: stats.chars, delta: stats.chars - otherStats.chars },
		{ label: "Est. tokens", value: stats.tokens, delta: stats.tokens - otherStats.tokens },
		{ label: "Lines", value: stats.lines, delta: stats.lines - otherStats.lines },
	];
	return (
		<div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm space-y-3">
			<div className="flex items-center gap-2">
				<span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${side === "A" ? "bg-blue-500/15 text-blue-600 dark:text-blue-400" : "bg-violet-500/15 text-violet-600 dark:text-violet-400"}`}>{side}</span>
				<h4 className="text-sm font-bold text-foreground">Prompt {side}</h4>
			</div>
			<div className="grid grid-cols-2 gap-x-4 gap-y-2">
				{rows.map((row) => (
					<div key={row.label} className="flex items-center justify-between text-xs">
						<span className="text-muted-foreground">{row.label}</span>
						<span className="flex items-center gap-1.5 font-semibold text-foreground">
							{row.value.toLocaleString()}
							{row.delta !== 0 && (
								<span className={`px-1 rounded text-[10px] font-bold ${row.delta > 0 ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-red-500/15 text-red-600 dark:text-red-400"}`}>
									{row.delta > 0 ? "+" : ""}{row.delta}
								</span>
							)}
						</span>
					</div>
				))}
			</div>
			<div className="space-y-1.5 pt-2 border-t border-border/50">
				{CHECKS.map((check) => {
					const has = check.pattern.test(text);
					return (
						<div key={check.label} className={`flex items-center gap-1.5 text-xs ${has ? "text-foreground" : "text-muted-foreground/60"}`}>
							{has ? <CircleCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" /> : <CircleX className="h-3.5 w-3.5 shrink-0 text-red-400" />}
							Has {check.label.toLowerCase()}
						</div>
					);
				})}
			</div>
		</div>
	);
}

function renderParts(parts: DiffPart[]): ReactNode[] {
	return parts.map((part, i) => {
		if (part.added) return <ins key={i} className="no-underline bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-sm px-0.5">{part.value}</ins>;
		if (part.removed) return <del key={i} className="no-underline line-through bg-red-500/10 text-red-700 dark:text-red-300 rounded-sm px-0.5">{part.value}</del>;
		return <span key={i}>{part.value}</span>;
	});
}

export default function PromptAbComparator() {
	const [promptA, setPromptA] = useState("");
	const [promptB, setPromptB] = useState("");
	const [result, setResult] = useState<DiffPart[] | null>(null);
	const [copied, setCopied] = useState(false);

	const handleCompare = () => {
		if (!promptA.trim() && !promptB.trim()) {
			toast.info("Enter at least one prompt to compare.");
			return;
		}
		setResult(diffWords(promptA, promptB) as DiffPart[]);
	};

	const addedCount = result?.filter((p) => p.added).length ?? 0;
	const removedCount = result?.filter((p) => p.removed).length ?? 0;

	const copyReport = () => {
		if (!result) return;
		const report = result
			.filter((p) => p.added || p.removed)
			.map((p) => `${p.added ? "+ ADDED" : "- REMOVED"}: ${p.value.trim()}`)
			.join("\n");
		navigator.clipboard.writeText(`PROMPT DIFF REPORT\n${addedCount} additions, ${removedCount} removals\n\n${report || "No word-level changes."}`);
		setCopied(true);
		toast.success("Diff report copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="space-y-8 max-w-5xl mx-auto">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="space-y-2 p-5 rounded-2xl bg-card border border-border/60 shadow-sm ring-1 ring-blue-500/10">
					<Label htmlFor="prompt-a" className="text-xs font-semibold text-blue-600 dark:text-blue-400">Prompt A</Label>
					<Textarea id="prompt-a" value={promptA} onChange={(e) => setPromptA(e.target.value)} placeholder="Paste the original prompt…" className="min-h-[220px] text-sm resize-y font-mono" />
				</div>
				<div className="space-y-2 p-5 rounded-2xl bg-card border border-border/60 shadow-sm ring-1 ring-violet-500/10">
					<Label htmlFor="prompt-b" className="text-xs font-semibold text-violet-600 dark:text-violet-400">Prompt B</Label>
					<Textarea id="prompt-b" value={promptB} onChange={(e) => setPromptB(e.target.value)} placeholder="Paste the revised prompt…" className="min-h-[220px] text-sm resize-y font-mono" />
				</div>
			</div>

			<div className="flex justify-center">
				<Button onClick={handleCompare} size="lg" className="gap-2">
					<GitCompareArrows className="h-4 w-4" />
					Compare Prompts
				</Button>
			</div>

			{!result ? (
				<div className="flex flex-col items-center justify-center gap-3 p-12 rounded-2xl border border-dashed border-border text-muted-foreground">
					<FileDiff className="h-9 w-9 opacity-40" />
					<p className="text-sm">Run a comparison to see word-level diffs, deltas, and structure gaps.</p>
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<StatsPanel side="A" text={promptA} other={promptB} />
						<StatsPanel side="B" text={promptB} other={promptA} />
					</div>

					<div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm space-y-3">
						<div className="flex items-center justify-between gap-3 flex-wrap">
							<h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Unified Word Diff</h4>
							<div className="flex items-center gap-2">
								<span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">+{addedCount} added segments</span>
								<span className="px-2 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] font-bold">-{removedCount} removed segments</span>
								<Button size="sm" variant="outline" onClick={copyReport} className="h-7 text-xs gap-1.5">
									{copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
									Copy Report
								</Button>
							</div>
						</div>
						<p className="p-4 rounded-xl bg-muted/50 border border-border/40 text-sm leading-relaxed whitespace-pre-wrap max-h-[420px] overflow-y-auto font-mono">
							{renderParts(result)}
						</p>
						<div className="flex gap-4 text-[11px] text-muted-foreground">
							<span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-500/10 line-through decoration-red-500" /> removed from A</span>
							<span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-500/10" /> added in B</span>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
