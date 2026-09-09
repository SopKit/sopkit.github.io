"use client";

import {
	Check,
	ClipboardPaste,
	Copy,
	Gauge,
	RefreshCw,
	Sparkles,
	Wand2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Dimension {
	key: string;
	label: string;
	hint: string;
	score: number;
	detected: string | null;
}

const DIMENSIONS: Array<{
	key: string;
	label: string;
	hint: string;
	patterns: RegExp[];
	suggestion: (topic: string) => string;
}> = [
	{
		key: "role",
		label: "Role / Persona",
		hint: 'Defines who the AI should act as ("act as", "you are", "expert")',
		patterns: [
			/\b(act as|you are|as an?|acting as|role of|expert|senior|professional)\b/i,
		],
		suggestion: () =>
			"Act as a senior subject-matter expert with 10+ years of hands-on experience.",
	},
	{
		key: "context",
		label: "Context",
		hint: "Background information, audience, or situation the AI needs",
		patterns: [
			/\b(context|background|audience|for my|we are|i am|currently|situation|project)\b/i,
		],
		suggestion: (t) =>
			`Context: The audience is [describe your audience] and this is for ${t || "[topic]"} [add relevant background].`,
	},
	{
		key: "constraints",
		label: "Constraints",
		hint: 'Explicit rules and limits ("must", "do not", "only", word limits)',
		patterns: [
			/\b(must|do not|don't|should not|only|max|min|limit|no more than|at least|avoid|never|exactly)\b/i,
		],
		suggestion: () =>
			"Constraints: Must be under 500 words. Do not use jargon. Only use verified facts.",
	},
	{
		key: "format",
		label: "Output Format",
		hint: "Specifies the shape of the answer (json, table, list, markdown)",
		patterns: [
			/\b(json|table|list|bullet|markdown|format|csv|outline|steps|sections|paragraph)\b/i,
		],
		suggestion: () =>
			"Output Format: Respond in clean Markdown with ## headings and bullet points.",
	},
	{
		key: "examples",
		label: "Examples",
		hint: 'Includes sample inputs/outputs ("example", "e.g.", "such as")',
		patterns: [/\b(example|e\.g\.|for instance|such as|like this|sample)\b/i],
		suggestion: () =>
			"Example: Here is a sample of the desired output: [paste one ideal example].",
	},
];

function guessTopic(prompt: string): string {
	const stop = new Set([
		"write",
		"create",
		"generate",
		"make",
		"give",
		"me",
		"a",
		"an",
		"the",
		"please",
		"help",
		"about",
		"on",
		"for",
		"with",
		"and",
		"to",
		"of",
		"in",
	]);
	const words = prompt
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, " ")
		.split(/\s+/)
		.filter((w) => w.length > 2 && !stop.has(w));
	return words.slice(0, 4).join(" ");
}

export default function AiPromptImprover() {
	const [prompt, setPrompt] = useState("");
	const [analyzedPrompt, setAnalyzedPrompt] = useState<string | null>(null);
	const [improved, setImproved] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const analysis = useMemo(() => {
		if (!analyzedPrompt) return null;
		const dims: Dimension[] = DIMENSIONS.map((d) => {
			const hit = d.patterns.find((p) => p.test(analyzedPrompt));
			return {
				key: d.key,
				label: d.label,
				hint: d.hint,
				score: hit ? 20 : 0,
				detected: hit ? "Detected" : "Missing",
			};
		});
		const total = dims.reduce((sum, d) => sum + d.score, 0);
		return { dims, total };
	}, [analyzedPrompt]);

	const improvedText = useMemo(() => {
		if (!analysis) return null;
		const topic = guessTopic(analyzedPrompt);
		const sections: string[] = [];
		for (const def of DIMENSIONS) {
			const dim = analysis.dims.find((d) => d.key === def.key);
			if (!dim || dim.score === 0) continue;
			if (dim.score > 0) {
				const raw = analyzedPrompt.trim();
				if (def.key === "role")
					sections.push(
						`## Role\n${raw
							.split(/\n/)[0]
							.replace(/^\s*(act as|you are)\s*/i, "")
							.trim()}`,
					);
				else if (def.key === "context")
					sections.push(
						`## Context\n${raw.replace(/^(write|create|make)\s+/i, "").trim()}`,
					);
				else if (def.key === "constraints")
					sections.push(
						`## Constraints\n${
							raw
								.match(
									/[^.!?\n]*(?:must|do not|don't|only|max|min|at least|avoid|never)[^.!?\n]*[.!?]?/gi,
								)
								?.map((s) => `- ${s.trim()}`)
								.join("\n") ?? raw.trim()
						}`,
					);
				else if (def.key === "format")
					sections.push(
						`## Output Format\n${raw.match(/\b(json|table|markdown|csv|bullet list|numbered list)\b/i)?.[0] ?? "Markdown"} as specified above.`,
					);
				else
					sections.push(
						`## Example\n${raw.match(/(?:example|e\.g\.|for instance)[:\s]+([^\n]+)/i)?.[1]?.trim() ?? "[see original prompt]"}`,
					);
			}
		}
		const taskLine =
			analyzedPrompt.trim().split(/\n/).slice(0, 3).join(" ").slice(0, 240) ||
			`[state your task about ${topic}]`;
		const result = [`## Task\n${taskLine}`, ...sections];
		for (const def of DIMENSIONS) {
			const dim = analysis.dims.find((d) => d.key === def.key);
			if (dim && dim.score === 0) result.push(def.suggestion(topic));
		}
		result.push(
			"---\nReview each bracketed placeholder and replace it with your specifics before sending.",
		);
		return result.join("\n\n");
	}, [analysis, analyzedPrompt]);

	const handleAnalyze = () => {
		if (!prompt.trim()) {
			toast.error("Enter a prompt to analyze first.");
			return;
		}
		setAnalyzedPrompt(prompt);
		setImproved(null);
	};

	const handleImprove = () => {
		if (!improvedText) return;
		setImproved(improvedText);
		toast.success("Prompt rewritten using detected framework pieces.");
	};

	const handleCopy = (text: string) => {
		if (navigator.clipboard?.writeText) {
			navigator.clipboard
				.writeText(text)
				.then(() => toast.success("Copied to clipboard"))
				.catch(() => fallbackCopy(text));
		} else {
			fallbackCopy(text);
		}
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const fallbackCopy = (text: string) => {
		const ta = document.createElement("textarea");
		ta.value = text;
		document.body.appendChild(ta);
		ta.select();
		document.execCommand("copy");
		document.body.removeChild(ta);
		toast.success("Copied to clipboard");
	};

	const loadSample = () => {
		setPrompt(
			"Write a blog post about AI tools. Keep it short. Use a list format.",
		);
		setAnalyzedPrompt(null);
		setImproved(null);
	};

	const reset = () => {
		setPrompt("");
		setAnalyzedPrompt(null);
		setImproved(null);
	};

	return (
		<div className="space-y-8 max-w-5xl mx-auto">
			<div className="flex items-center gap-2 p-3.5 rounded-xl border border-violet-500/20 bg-violet-500/5 text-violet-600 dark:text-violet-400 text-xs font-semibold">
				<Sparkles className="h-4.5 w-4.5 shrink-0" />
				<span>
					Heuristic scoring runs 100% in your browser — your prompt never leaves
					this page.
				</span>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="space-y-4 p-6 rounded-2xl bg-card border border-border/60 shadow-sm">
					<div className="flex items-center justify-between">
						<Label htmlFor="prompt-input" className="text-base font-bold">
							Your Prompt
						</Label>
						<Button
							variant="ghost"
							size="sm"
							onClick={loadSample}
							className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
						>
							<ClipboardPaste className="h-3.5 w-3.5" /> Sample
						</Button>
					</div>
					<Textarea
						id="prompt-input"
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						placeholder="Paste any prompt you want to score and improve…"
						className="min-h-[180px] font-mono text-sm"
					/>
					<div className="flex flex-wrap gap-2">
						<Button onClick={handleAnalyze} className="gap-1.5">
							<Gauge className="h-4 w-4" /> Analyze
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={reset}
							className="gap-1 text-muted-foreground h-9"
						>
							<RefreshCw className="h-3.5 w-3.5" /> Reset
						</Button>
					</div>

					{analysis && (
						<div className="space-y-4 pt-2">
							<div className="flex items-center justify-between p-3 rounded-xl bg-muted/60 border border-border/50">
								<span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
									Overall Score
								</span>
								<span
									className={`text-2xl font-black tabular-nums ${analysis.total >= 80 ? "text-emerald-600 dark:text-emerald-400" : analysis.total >= 40 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}
								>
									{analysis.total}
									<span className="text-sm text-muted-foreground">/100</span>
								</span>
							</div>
							{analysis.dims.map((d) => (
								<div key={d.key} className="space-y-1.5">
									<div className="flex items-center justify-between text-xs">
										<span className="font-semibold text-foreground">
											{d.label}
										</span>
										<Badge
											variant={d.score > 0 ? "default" : "outline"}
											className={d.score > 0 ? "" : "text-muted-foreground"}
										>
											{d.detected}
										</Badge>
									</div>
									<div className="h-2 rounded-full bg-muted overflow-hidden">
										<div
											className={`h-full rounded-full transition-all duration-700 ease-out ${d.score > 0 ? "bg-gradient-to-r from-violet-500 to-indigo-500" : "bg-transparent"}`}
											style={{ width: `${d.score * 5}%` }}
										/>
									</div>
									<p className="text-[11px] text-muted-foreground leading-snug">
										{d.hint}
									</p>
								</div>
							))}
							<Button
								onClick={handleImprove}
								variant="outline"
								className="w-full gap-1.5"
							>
								<Wand2 className="h-4 w-4" /> Improve Prompt
							</Button>
						</div>
					)}
				</div>

				<div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm flex flex-col">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-base font-bold">Improved Prompt</h3>
						{improved && (
							<Button
								size="sm"
								variant="outline"
								onClick={() => handleCopy(improved)}
								className="h-7 text-xs gap-1.5"
							>
								{copied ? (
									<Check className="h-3.5 w-3.5 text-emerald-500" />
								) : (
									<Copy className="h-3.5 w-3.5" />
								)}
								Copy
							</Button>
						)}
					</div>
					{improved ? (
						<pre className="flex-1 min-h-[300px] p-4 rounded-xl bg-muted/50 border border-border/40 font-mono text-xs leading-relaxed whitespace-pre-wrap overflow-auto">
							{improved}
						</pre>
					) : (
						<div className="flex-1 min-h-[300px] flex items-center justify-center rounded-xl border border-dashed border-border/70 text-center p-6">
							<p className="text-sm text-muted-foreground max-w-xs">
								Run{" "}
								<span className="font-semibold text-foreground">Analyze</span>{" "}
								to score your prompt across role, context, constraints, format,
								and examples — then click Improve Prompt to get a structured
								rewrite.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
